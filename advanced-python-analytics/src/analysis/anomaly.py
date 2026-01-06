"""
Anomaly detection module.
Implements various anomaly detection algorithms.
"""

from typing import Optional, List
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from scipy import stats

from src.core.logger import setup_logger


logger = setup_logger(__name__)


class AnomalyDetector:
    """Detects anomalies in data using multiple methods."""
    
    def __init__(
        self,
        method: str = "isolation_forest",
        threshold: float = 2.5
    ):
        """
        Initialize anomaly detector.
        
        Args:
            method: Detection method (isolation_forest, zscore, iqr)
            threshold: Threshold for anomaly detection
        """
        self.method = method
        self.threshold = threshold
        self.scaler = StandardScaler()
        self.model = None
    
    def fit(self, data: pd.DataFrame, features: Optional[List[str]] = None) -> "AnomalyDetector":
        """
        Fit the anomaly detector on training data.
        
        Args:
            data: Training data
            features: List of features to use (if None, use all numeric)
            
        Returns:
            Self for method chaining
        """
        if features is None:
            features = data.select_dtypes(include=[np.number]).columns.tolist()
        
        X = data[features]
        
        if self.method == "isolation_forest":
            self.model = IsolationForest(
                contamination=0.1,
                random_state=42,
                n_estimators=100
            )
            self.model.fit(X)
            logger.info("Isolation Forest model fitted")
        
        return self
    
    def detect(
        self,
        data: pd.DataFrame,
        features: Optional[List[str]] = None
    ) -> pd.DataFrame:
        """
        Detect anomalies in data.
        
        Args:
            data: Data to analyze
            features: List of features to use
            
        Returns:
            DataFrame containing only anomalous records
        """
        if features is None:
            features = data.select_dtypes(include=[np.number]).columns.tolist()
        
        X = data[features]
        
        if self.method == "isolation_forest":
            if self.model is None:
                self.fit(data, features)
            predictions = self.model.predict(X)
            anomalies = data[predictions == -1]
            
        elif self.method == "zscore":
            anomalies = self._zscore_detection(data, features)
            
        elif self.method == "iqr":
            anomalies = self._iqr_detection(data, features)
        
        else:
            raise ValueError(f"Unknown detection method: {self.method}")
        
        logger.info(f"Detected {len(anomalies)} anomalies using {self.method}")
        return anomalies
    
    def _zscore_detection(
        self,
        data: pd.DataFrame,
        features: List[str]
    ) -> pd.DataFrame:
        """Detect anomalies using Z-score method."""
        anomaly_mask = pd.Series([False] * len(data), index=data.index)
        
        for feature in features:
            z_scores = np.abs(stats.zscore(data[feature].fillna(data[feature].mean())))
            anomaly_mask |= (z_scores > self.threshold)
        
        return data[anomaly_mask]
    
    def _iqr_detection(
        self,
        data: pd.DataFrame,
        features: List[str]
    ) -> pd.DataFrame:
        """Detect anomalies using Interquartile Range method."""
        anomaly_mask = pd.Series([False] * len(data), index=data.index)
        
        for feature in features:
            Q1 = data[feature].quantile(0.25)
            Q3 = data[feature].quantile(0.75)
            IQR = Q3 - Q1
            
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            anomaly_mask |= (data[feature] < lower_bound) | (data[feature] > upper_bound)
        
        return data[anomaly_mask]
    
    def get_anomaly_scores(
        self,
        data: pd.DataFrame,
        features: Optional[List[str]] = None
    ) -> np.ndarray:
        """
        Get anomaly scores for all records.
        
        Args:
            data: Data to score
            features: List of features to use
            
        Returns:
            Array of anomaly scores
        """
        if self.method != "isolation_forest":
            raise NotImplementedError("Anomaly scores only available for isolation_forest")
        
        if features is None:
            features = data.select_dtypes(include=[np.number]).columns.tolist()
        
        if self.model is None:
            self.fit(data, features)
        
        X = data[features]
        scores = self.model.score_samples(X)
        
        return -scores  # Negative scores indicate anomalies
