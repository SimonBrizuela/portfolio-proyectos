"""
Statistical analysis module.
Provides comprehensive statistical analysis capabilities.
"""

from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np
from scipy import stats
from sklearn.feature_selection import mutual_info_regression, mutual_info_classif

from src.core.logger import setup_logger


logger = setup_logger(__name__)


class StatisticalAnalyzer:
    """Performs statistical analysis on datasets."""
    
    def __init__(self):
        self.results: Dict[str, Any] = {}
    
    def analyze(
        self,
        data: pd.DataFrame,
        target: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Perform comprehensive statistical analysis.
        
        Args:
            data: Input DataFrame
            target: Target column for correlation analysis
            
        Returns:
            Dictionary containing analysis results
        """
        logger.info("Starting statistical analysis")
        
        results = {}
        
        # Basic statistics
        results['descriptive'] = self._descriptive_stats(data)
        
        # Correlation analysis
        results['correlations'] = self._correlation_analysis(data, target)
        
        # Distribution analysis
        results['distributions'] = self._distribution_analysis(data)
        
        # Feature importance (if target provided)
        if target and target in data.columns:
            results['importance'] = self._feature_importance(data, target)
        else:
            results['importance'] = {}
        
        # Outlier detection
        results['outliers'] = self._detect_outliers(data)
        
        self.results = results
        logger.info("Statistical analysis complete")
        
        return results
    
    def _descriptive_stats(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Calculate descriptive statistics."""
        numeric_data = data.select_dtypes(include=[np.number])
        
        stats_dict = {
            'mean': numeric_data.mean().to_dict(),
            'median': numeric_data.median().to_dict(),
            'std': numeric_data.std().to_dict(),
            'min': numeric_data.min().to_dict(),
            'max': numeric_data.max().to_dict(),
            'skewness': numeric_data.skew().to_dict(),
            'kurtosis': numeric_data.kurtosis().to_dict()
        }
        
        return stats_dict
    
    def _correlation_analysis(
        self,
        data: pd.DataFrame,
        target: Optional[str] = None
    ) -> Dict[str, Any]:
        """Analyze correlations between features."""
        numeric_data = data.select_dtypes(include=[np.number])
        
        # Pearson correlation
        corr_matrix = numeric_data.corr()
        
        results = {
            'matrix': corr_matrix.to_dict(),
            'pairs': []
        }
        
        # Find highly correlated pairs
        for i in range(len(corr_matrix.columns)):
            for j in range(i + 1, len(corr_matrix.columns)):
                col1 = corr_matrix.columns[i]
                col2 = corr_matrix.columns[j]
                corr_value = corr_matrix.iloc[i, j]
                
                if abs(corr_value) > 0.7:  # High correlation threshold
                    results['pairs'].append({
                        'feature1': col1,
                        'feature2': col2,
                        'correlation': float(corr_value)
                    })
        
        # Target correlations
        if target and target in numeric_data.columns:
            target_corr = corr_matrix[target].drop(target).sort_values(ascending=False)
            results['target_correlations'] = target_corr.to_dict()
        
        return results
    
    def _distribution_analysis(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Analyze distribution of numeric features."""
        numeric_data = data.select_dtypes(include=[np.number])
        
        distributions = {}
        
        for col in numeric_data.columns:
            # Normality test (Shapiro-Wilk)
            if len(numeric_data[col].dropna()) > 3:
                try:
                    statistic, p_value = stats.shapiro(numeric_data[col].dropna()[:5000])
                    is_normal = p_value > 0.05
                except:
                    is_normal = False
                    p_value = 0.0
            else:
                is_normal = False
                p_value = 0.0
            
            distributions[col] = {
                'is_normal': bool(is_normal),
                'shapiro_p_value': float(p_value),
                'quartiles': {
                    'q25': float(numeric_data[col].quantile(0.25)),
                    'q50': float(numeric_data[col].quantile(0.50)),
                    'q75': float(numeric_data[col].quantile(0.75))
                }
            }
        
        return distributions
    
    def _feature_importance(
        self,
        data: pd.DataFrame,
        target: str
    ) -> Dict[str, float]:
        """Calculate feature importance using mutual information."""
        numeric_data = data.select_dtypes(include=[np.number])
        
        if target not in numeric_data.columns:
            return {}
        
        X = numeric_data.drop(columns=[target])
        y = numeric_data[target]
        
        # Determine if regression or classification
        if y.nunique() <= 20:
            mi_scores = mutual_info_classif(X, y, random_state=42)
        else:
            mi_scores = mutual_info_regression(X, y, random_state=42)
        
        importance = dict(zip(X.columns, mi_scores))
        
        # Sort by importance
        importance = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        
        return importance
    
    def _detect_outliers(
        self,
        data: pd.DataFrame,
        threshold: float = 3.0
    ) -> Dict[str, Any]:
        """Detect outliers using Z-score method."""
        numeric_data = data.select_dtypes(include=[np.number])
        
        outliers = {}
        
        for col in numeric_data.columns:
            z_scores = np.abs(stats.zscore(numeric_data[col].dropna()))
            outlier_indices = np.where(z_scores > threshold)[0]
            
            outliers[col] = {
                'count': int(len(outlier_indices)),
                'percentage': float(len(outlier_indices) / len(numeric_data) * 100)
            }
        
        return outliers
    
    def hypothesis_test(
        self,
        group1: pd.Series,
        group2: pd.Series,
        test_type: str = "ttest"
    ) -> Dict[str, float]:
        """
        Perform hypothesis testing between two groups.
        
        Args:
            group1: First group data
            group2: Second group data
            test_type: Type of test ('ttest', 'mannwhitney')
            
        Returns:
            Dictionary with test results
        """
        if test_type == "ttest":
            statistic, p_value = stats.ttest_ind(group1, group2)
        elif test_type == "mannwhitney":
            statistic, p_value = stats.mannwhitneyu(group1, group2)
        else:
            raise ValueError(f"Unknown test type: {test_type}")
        
        return {
            'statistic': float(statistic),
            'p_value': float(p_value),
            'significant': bool(p_value < 0.05)
        }
