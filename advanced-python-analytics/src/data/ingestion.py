"""
Data ingestion module.
Handles loading data from various sources (CSV, JSON, Excel, APIs).
"""

import asyncio
from pathlib import Path
from typing import Optional, AsyncGenerator, Dict, Any
import pandas as pd
import aiofiles

from src.core.logger import setup_logger
from src.core.exceptions import DataLoadError


logger = setup_logger(__name__)


class DataLoader:
    """Handles data loading from multiple sources."""
    
    def __init__(self):
        self.supported_formats = ['.csv', '.json', '.xlsx', '.xls']
    
    def load(self, file_path: str) -> pd.DataFrame:
        """
        Load data from a file.
        
        Args:
            file_path: Path to the data file
            
        Returns:
            Loaded DataFrame
            
        Raises:
            DataLoadError: If file cannot be loaded
        """
        path = Path(file_path)
        
        if not path.exists():
            raise DataLoadError(f"File not found: {file_path}")
        
        suffix = path.suffix.lower()
        
        if suffix not in self.supported_formats:
            raise DataLoadError(
                f"Unsupported file format: {suffix}. "
                f"Supported formats: {self.supported_formats}"
            )
        
        try:
            if suffix == '.csv':
                df = pd.read_csv(file_path)
            elif suffix == '.json':
                df = pd.read_json(file_path)
            elif suffix in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path)
            
            logger.info(f"Successfully loaded {len(df)} rows from {file_path}")
            return df
            
        except Exception as e:
            raise DataLoadError(f"Error loading file {file_path}: {str(e)}")
    
    async def load_async(self, file_path: str) -> pd.DataFrame:
        """
        Asynchronously load data from a file.
        
        Args:
            file_path: Path to the data file
            
        Returns:
            Loaded DataFrame
        """
        # Use asyncio to run the blocking load in a thread pool
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, self.load, file_path)
    
    def load_csv(
        self,
        file_path: str,
        **kwargs
    ) -> pd.DataFrame:
        """
        Load CSV file with custom parameters.
        
        Args:
            file_path: Path to CSV file
            **kwargs: Additional arguments for pd.read_csv
            
        Returns:
            Loaded DataFrame
        """
        try:
            df = pd.read_csv(file_path, **kwargs)
            logger.info(f"Loaded CSV: {len(df)} rows, {len(df.columns)} columns")
            return df
        except Exception as e:
            raise DataLoadError(f"Error loading CSV: {str(e)}")


class StreamProcessor:
    """Handles real-time data stream processing."""
    
    def __init__(self, batch_size: int = 100):
        self.batch_size = batch_size
        self.buffer = []
    
    async def stream_data(
        self,
        source: str,
        **kwargs
    ) -> AsyncGenerator[pd.DataFrame, None]:
        """
        Stream data in batches from a source.
        
        Args:
            source: Data source identifier
            **kwargs: Additional source-specific parameters
            
        Yields:
            DataFrames containing batches of data
        """
        # Simulated streaming - in production, this would connect to real streams
        logger.info(f"Starting data stream from: {source}")
        
        # Example: simulate streaming from a file in chunks
        if source == 'file':
            file_path = kwargs.get('file_path')
            if file_path:
                chunk_iterator = pd.read_csv(
                    file_path,
                    chunksize=self.batch_size
                )
                
                for chunk in chunk_iterator:
                    await asyncio.sleep(0.1)  # Simulate network delay
                    yield chunk
        
        # Example: simulate API stream
        elif source == 'api':
            # In production, this would make actual API calls
            for i in range(10):
                await asyncio.sleep(0.5)
                # Generate synthetic batch
                data = {
                    'timestamp': pd.date_range(
                        start='2024-01-01',
                        periods=self.batch_size,
                        freq='1min'
                    ),
                    'value': pd.Series(range(self.batch_size)) + i * self.batch_size
                }
                yield pd.DataFrame(data)
    
    async def alert(self, data: pd.DataFrame) -> None:
        """
        Send alert for anomalous data.
        
        Args:
            data: DataFrame containing anomalous records
        """
        logger.warning(f"ALERT: Detected {len(data)} anomalous records")
        # In production, this would send actual notifications
