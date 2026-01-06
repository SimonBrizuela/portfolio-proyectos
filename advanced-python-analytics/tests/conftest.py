"""
Pytest configuration and fixtures.
"""

import pytest
import pandas as pd
import numpy as np
from pathlib import Path


@pytest.fixture
def sample_dataframe():
    """Create sample DataFrame for testing."""
    np.random.seed(42)
    
    data = {
        'feature1': np.random.randn(100),
        'feature2': np.random.randn(100),
        'feature3': np.random.randint(0, 10, 100),
        'category': np.random.choice(['A', 'B', 'C'], 100),
        'target': np.random.randn(100) * 10 + 50
    }
    
    return pd.DataFrame(data)


@pytest.fixture
def sample_csv_file(tmp_path, sample_dataframe):
    """Create temporary CSV file for testing."""
    csv_file = tmp_path / "test_data.csv"
    sample_dataframe.to_csv(csv_file, index=False)
    return str(csv_file)


@pytest.fixture
def config_file(tmp_path):
    """Create temporary config file for testing."""
    config_content = """
database:
  url: sqlite:///test.db
  echo: false

logging:
  level: DEBUG
  format: "%(message)s"

models:
  random_forest:
    n_estimators: 10
    max_depth: 5
    random_state: 42

visualization:
  theme: plotly_white
  default_height: 400
  default_width: 800
"""
    config_file = tmp_path / "config.yaml"
    config_file.write_text(config_content)
    return str(config_file)


@pytest.fixture
def output_dir(tmp_path):
    """Create temporary output directory."""
    output = tmp_path / "outputs"
    output.mkdir()
    return str(output)
