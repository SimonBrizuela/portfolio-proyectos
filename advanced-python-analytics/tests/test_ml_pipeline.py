"""
Tests for ML pipeline module.
"""

import pytest
import numpy as np

from src.models.ml_pipeline import MLPipeline
from src.core.exceptions import ModelTrainingError, PredictionError


class TestMLPipeline:
    """Test suite for MLPipeline class."""
    
    def test_initialization(self):
        """Test pipeline initialization."""
        pipeline = MLPipeline(model_type='random_forest')
        
        assert pipeline.model_type == 'random_forest'
        assert pipeline.model is None
    
    def test_fit_random_forest(self, sample_dataframe):
        """Test training with Random Forest."""
        pipeline = MLPipeline(model_type='random_forest')
        pipeline.fit(sample_dataframe, target='target')
        
        assert pipeline.model is not None
        assert pipeline.target_column == 'target'
        assert len(pipeline.feature_columns) > 0
    
    def test_predict(self, sample_dataframe):
        """Test prediction."""
        pipeline = MLPipeline(model_type='random_forest')
        pipeline.fit(sample_dataframe, target='target')
        
        predictions = pipeline.predict(sample_dataframe)
        
        assert isinstance(predictions, np.ndarray)
        assert len(predictions) == len(sample_dataframe)
    
    def test_evaluate(self, sample_dataframe):
        """Test model evaluation."""
        pipeline = MLPipeline(model_type='random_forest')
        pipeline.fit(sample_dataframe, target='target')
        
        metrics = pipeline.evaluate(sample_dataframe, target='target')
        
        assert 'mse' in metrics
        assert 'rmse' in metrics
        assert 'mae' in metrics
        assert 'r2' in metrics
        assert all(isinstance(v, float) for v in metrics.values())
    
    def test_feature_importance(self, sample_dataframe):
        """Test feature importance extraction."""
        pipeline = MLPipeline(model_type='random_forest')
        pipeline.fit(sample_dataframe, target='target')
        
        importance = pipeline.get_feature_importance()
        
        assert len(importance) > 0
        assert 'feature' in importance.columns
        assert 'importance' in importance.columns
    
    def test_predict_without_training(self, sample_dataframe):
        """Test prediction without training raises error."""
        pipeline = MLPipeline(model_type='random_forest')
        
        with pytest.raises(PredictionError):
            pipeline.predict(sample_dataframe)
    
    def test_invalid_model_type(self):
        """Test invalid model type."""
        pipeline = MLPipeline(model_type='invalid_model')
        
        with pytest.raises(ModelTrainingError):
            pipeline._create_model()
