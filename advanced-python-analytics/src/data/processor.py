"""
Data processing and transformation module.
Handles data cleaning, feature engineering, and preprocessing.
"""

from typing import Tuple, List, Optional, Dict, Any
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split

from src.core.logger import setup_logger
from src.core.exceptions import DataValidationError


logger = setup_logger(__name__)


class DataProcessor:
    """Processes and transforms data for analysis and modeling."""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders: Dict[str, LabelEncoder] = {}
        self.feature_columns: Optional[List[str]] = None
    
    def process(
        self,
        data: pd.DataFrame,
        target: Optional[str] = None
    ) -> pd.DataFrame:
        """
        Main processing pipeline for data.
        
        Args:
            data: Input DataFrame
            target: Target column name (optional)
            
        Returns:
            Processed DataFrame
        """
        logger.info("Starting data processing pipeline")
        
        df = data.copy()
        
        # Step 1: Handle missing values
        df = self._handle_missing_values(df)
        
        # Step 2: Remove duplicates
        df = self._remove_duplicates(df)
        
        # Step 3: Handle outliers
        df = self._handle_outliers(df, target)
        
        # Step 4: Encode categorical variables
        df = self._encode_categorical(df, target)
        
        # Step 5: Feature engineering
        df = self._engineer_features(df)
        
        logger.info(f"Data processing complete. Final shape: {df.shape}")
        return df
    
    def _handle_missing_values(self, df: pd.DataFrame) -> pd.DataFrame:
        """Handle missing values in the dataset."""
        missing_counts = df.isnull().sum()
        columns_with_missing = missing_counts[missing_counts > 0]
        
        if len(columns_with_missing) > 0:
            logger.info(f"Handling missing values in {len(columns_with_missing)} columns")
            
            for col in columns_with_missing.index:
                if df[col].dtype in ['int64', 'float64']:
                    # Fill numeric columns with median
                    df[col].fillna(df[col].median(), inplace=True)
                else:
                    # Fill categorical columns with mode
                    df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else 'Unknown', inplace=True)
        
        return df
    
    def _remove_duplicates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Remove duplicate rows."""
        initial_count = len(df)
        df = df.drop_duplicates()
        removed = initial_count - len(df)
        
        if removed > 0:
            logger.info(f"Removed {removed} duplicate rows")
        
        return df
    
    def _handle_outliers(
        self,
        df: pd.DataFrame,
        target: Optional[str] = None,
        threshold: float = 3.0
    ) -> pd.DataFrame:
        """
        Handle outliers using Z-score method.
        
        Args:
            df: Input DataFrame
            target: Target column to exclude from outlier detection
            threshold: Z-score threshold for outlier detection
            
        Returns:
            DataFrame with outliers handled
        """
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        if target and target in numeric_cols:
            numeric_cols.remove(target)
        
        for col in numeric_cols:
            z_scores = np.abs((df[col] - df[col].mean()) / df[col].std())
            outliers = z_scores > threshold
            outlier_count = outliers.sum()
            
            if outlier_count > 0:
                # Cap outliers at threshold
                upper_limit = df[col].mean() + threshold * df[col].std()
                lower_limit = df[col].mean() - threshold * df[col].std()
                df.loc[df[col] > upper_limit, col] = upper_limit
                df.loc[df[col] < lower_limit, col] = lower_limit
                logger.info(f"Capped {outlier_count} outliers in column: {col}")
        
        return df
    
    def _encode_categorical(
        self,
        df: pd.DataFrame,
        target: Optional[str] = None
    ) -> pd.DataFrame:
        """Encode categorical variables."""
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        
        if target and target in categorical_cols:
            categorical_cols.remove(target)
        
        if categorical_cols:
            logger.info(f"Encoding {len(categorical_cols)} categorical columns")
            
            for col in categorical_cols:
                # Use label encoding for columns with many categories
                # Use one-hot encoding for columns with few categories
                unique_values = df[col].nunique()
                
                if unique_values <= 10:
                    # One-hot encoding
                    dummies = pd.get_dummies(df[col], prefix=col, drop_first=True)
                    df = pd.concat([df, dummies], axis=1)
                    df.drop(col, axis=1, inplace=True)
                else:
                    # Label encoding
                    le = LabelEncoder()
                    df[col] = le.fit_transform(df[col].astype(str))
                    self.label_encoders[col] = le
        
        return df
    
    def _engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create engineered features."""
        # Example feature engineering
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Create interaction features for first few numeric columns
        if len(numeric_cols) >= 2:
            df[f'{numeric_cols[0]}_x_{numeric_cols[1]}'] = (
                df[numeric_cols[0]] * df[numeric_cols[1]]
            )
        
        # Create polynomial features
        for col in numeric_cols[:3]:  # Limit to first 3 columns
            if col in df.columns:
                df[f'{col}_squared'] = df[col] ** 2
        
        return df
    
    def train_test_split(
        self,
        data: pd.DataFrame,
        test_size: float = 0.2,
        random_state: int = 42
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Split data into training and testing sets.
        
        Args:
            data: Input DataFrame
            test_size: Proportion of data for testing
            random_state: Random seed for reproducibility
            
        Returns:
            Tuple of (train_data, test_data)
        """
        train, test = train_test_split(
            data,
            test_size=test_size,
            random_state=random_state
        )
        
        logger.info(f"Data split: {len(train)} train, {len(test)} test")
        return train, test
    
    def get_summary(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Get summary statistics for the dataset.
        
        Args:
            df: Input DataFrame
            
        Returns:
            Dictionary containing summary statistics
        """
        return {
            'n_rows': len(df),
            'n_columns': len(df.columns),
            'columns': df.columns.tolist(),
            'dtypes': df.dtypes.astype(str).to_dict(),
            'missing_values': df.isnull().sum().to_dict(),
            'numeric_summary': df.describe().to_dict(),
            'memory_usage': df.memory_usage(deep=True).sum() / 1024**2  # MB
        }
