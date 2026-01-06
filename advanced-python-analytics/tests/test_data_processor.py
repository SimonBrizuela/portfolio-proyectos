"""
Tests for data processor module.
"""

import pytest
import pandas as pd
import numpy as np

from src.data.processor import DataProcessor


class TestDataProcessor:
    """Test suite for DataProcessor class."""
    
    def test_process_basic(self, sample_dataframe):
        """Test basic data processing."""
        processor = DataProcessor()
        processed = processor.process(sample_dataframe, target='target')
        
        assert isinstance(processed, pd.DataFrame)
        assert len(processed) > 0
        assert 'target' in processed.columns
    
    def test_handle_missing_values(self, sample_dataframe):
        """Test missing value handling."""
        # Add missing values
        df = sample_dataframe.copy()
        df.loc[0:5, 'feature1'] = np.nan
        
        processor = DataProcessor()
        processed = processor.process(df)
        
        assert processed['feature1'].isnull().sum() == 0
    
    def test_remove_duplicates(self):
        """Test duplicate removal."""
        df = pd.DataFrame({
            'A': [1, 1, 2, 3],
            'B': [4, 4, 5, 6],
            'C': [7, 7, 8, 9]
        })
        
        processor = DataProcessor()
        processed = processor.process(df)
        
        assert len(processed) == 3
    
    def test_train_test_split(self, sample_dataframe):
        """Test train-test split."""
        processor = DataProcessor()
        train, test = processor.train_test_split(sample_dataframe, test_size=0.2)
        
        assert len(train) == 80
        assert len(test) == 20
        assert len(train) + len(test) == len(sample_dataframe)
    
    def test_get_summary(self, sample_dataframe):
        """Test data summary generation."""
        processor = DataProcessor()
        summary = processor.get_summary(sample_dataframe)
        
        assert 'n_rows' in summary
        assert 'n_columns' in summary
        assert summary['n_rows'] == len(sample_dataframe)
        assert summary['n_columns'] == len(sample_dataframe.columns)
