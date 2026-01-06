"""
Machine Learning Pipeline module.
Provides end-to-end ML training, prediction, and evaluation.
"""

from typing import Optional, Dict, Any, List
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    mean_squared_error, mean_absolute_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score
)
from sklearn.model_selection import cross_val_score
import joblib

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

from src.core.logger import setup_logger
from src.core.exceptions import ModelTrainingError, PredictionError


logger = setup_logger(__name__)


class MLPipeline:
    """
    Machine Learning pipeline for training and prediction.
    Supports multiple algorithms and problem types.
    """
    
    def __init__(
        self,
        model_type: str = "random_forest",
        config: Optional[Any] = None,
        problem_type: str = "auto"
    ):
        """
        Initialize ML pipeline.
        
        Args:
            model_type: Type of model (random_forest, xgboost, linear)
            config: Configuration object
            problem_type: 'regression', 'classification', or 'auto'
        """
        self.model_type = model_type
        self.config = config
        self.problem_type = problem_type
        self.model = None
        self.feature_columns: Optional[List[str]] = None
        self.target_column: Optional[str] = None
    
    def fit(
        self,
        data: pd.DataFrame,
        target: str,
        features: Optional[List[str]] = None
    ) -> "MLPipeline":
        """
        Train the model on the provided data.
        
        Args:
            data: Training data
            target: Target column name
            features: List of feature column names (if None, use all except target)
            
        Returns:
            Self for method chaining
        """
        logger.info(f"Training {self.model_type} model")
        
        self.target_column = target
        
        if target not in data.columns:
            raise ModelTrainingError(f"Target column '{target}' not found in data")
        
        # Determine feature columns
        if features is None:
            self.feature_columns = [col for col in data.columns if col != target]
        else:
            self.feature_columns = features
        
        # Prepare data
        X = data[self.feature_columns]
        y = data[target]
        
        # Auto-detect problem type
        if self.problem_type == "auto":
            unique_values = y.nunique()
            if unique_values <= 20 and y.dtype in ['object', 'category', 'int64']:
                self.problem_type = "classification"
            else:
                self.problem_type = "regression"
            logger.info(f"Auto-detected problem type: {self.problem_type}")
        
        # Initialize and train model
        try:
            self.model = self._create_model()
            self.model.fit(X, y)
            logger.info("Model training completed successfully")
            
            # Cross-validation
            cv_scores = cross_val_score(self.model, X, y, cv=5)
            logger.info(f"Cross-validation scores: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
            
        except Exception as e:
            raise ModelTrainingError(f"Error during model training: {str(e)}")
        
        return self
    
    def _create_model(self):
        """Create model instance based on type and problem."""
        model_params = {}
        
        if self.config and hasattr(self.config, 'models'):
            model_params = getattr(self.config.models, self.model_type, {})
        
        if self.model_type == "random_forest":
            if self.problem_type == "regression":
                return RandomForestRegressor(**model_params)
            else:
                return RandomForestClassifier(**model_params)
        
        elif self.model_type == "xgboost":
            if not XGBOOST_AVAILABLE:
                raise ModelTrainingError("XGBoost is not installed")
            
            if self.problem_type == "regression":
                return xgb.XGBRegressor(**model_params)
            else:
                return xgb.XGBClassifier(**model_params)
        
        elif self.model_type == "linear":
            if self.problem_type == "regression":
                return LinearRegression(**model_params)
            else:
                return LogisticRegression(**model_params)
        
        else:
            raise ModelTrainingError(f"Unknown model type: {self.model_type}")
    
    def predict(self, data: pd.DataFrame) -> np.ndarray:
        """
        Make predictions on new data.
        
        Args:
            data: Data to predict on
            
        Returns:
            Array of predictions
        """
        if self.model is None:
            raise PredictionError("Model has not been trained yet")
        
        if self.feature_columns is None:
            raise PredictionError("Feature columns not set")
        
        try:
            X = data[self.feature_columns]
            predictions = self.model.predict(X)
            logger.info(f"Generated {len(predictions)} predictions")
            return predictions
        except Exception as e:
            raise PredictionError(f"Error during prediction: {str(e)}")
    
    def predict_proba(self, data: pd.DataFrame) -> np.ndarray:
        """
        Predict class probabilities (classification only).
        
        Args:
            data: Data to predict on
            
        Returns:
            Array of probability predictions
        """
        if self.problem_type != "classification":
            raise PredictionError("predict_proba only available for classification")
        
        if not hasattr(self.model, 'predict_proba'):
            raise PredictionError("Model does not support probability predictions")
        
        X = data[self.feature_columns]
        return self.model.predict_proba(X)
    
    def evaluate(
        self,
        data: pd.DataFrame,
        target: str
    ) -> Dict[str, float]:
        """
        Evaluate model performance.
        
        Args:
            data: Test data
            target: Target column name
            
        Returns:
            Dictionary of evaluation metrics
        """
        if self.model is None:
            raise PredictionError("Model has not been trained yet")
        
        y_true = data[target]
        y_pred = self.predict(data)
        
        metrics = {}
        
        if self.problem_type == "regression":
            metrics['mse'] = mean_squared_error(y_true, y_pred)
            metrics['rmse'] = np.sqrt(metrics['mse'])
            metrics['mae'] = mean_absolute_error(y_true, y_pred)
            metrics['r2'] = r2_score(y_true, y_pred)
        else:
            metrics['accuracy'] = accuracy_score(y_true, y_pred)
            metrics['precision'] = precision_score(y_true, y_pred, average='weighted', zero_division=0)
            metrics['recall'] = recall_score(y_true, y_pred, average='weighted', zero_division=0)
            metrics['f1'] = f1_score(y_true, y_pred, average='weighted', zero_division=0)
        
        logger.info(f"Model evaluation complete: {metrics}")
        return metrics
    
    def get_feature_importance(self) -> pd.DataFrame:
        """
        Get feature importance scores.
        
        Returns:
            DataFrame with feature names and importance scores
        """
        if self.model is None:
            raise PredictionError("Model has not been trained yet")
        
        if not hasattr(self.model, 'feature_importances_'):
            logger.warning("Model does not support feature importance")
            return pd.DataFrame()
        
        importance_df = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return importance_df
    
    def save_model(self, path: str) -> None:
        """
        Save trained model to disk.
        
        Args:
            path: File path to save model
        """
        if self.model is None:
            raise ModelTrainingError("No model to save")
        
        joblib.dump({
            'model': self.model,
            'feature_columns': self.feature_columns,
            'target_column': self.target_column,
            'model_type': self.model_type,
            'problem_type': self.problem_type
        }, path)
        
        logger.info(f"Model saved to: {path}")
    
    @classmethod
    def load_model(cls, path: str) -> "MLPipeline":
        """
        Load trained model from disk.
        
        Args:
            path: File path to load model from
            
        Returns:
            MLPipeline instance with loaded model
        """
        data = joblib.load(path)
        
        pipeline = cls(model_type=data['model_type'])
        pipeline.model = data['model']
        pipeline.feature_columns = data['feature_columns']
        pipeline.target_column = data['target_column']
        pipeline.problem_type = data['problem_type']
        
        logger.info(f"Model loaded from: {path}")
        return pipeline
