"""
Configuration management module.
Handles loading and validation of application configuration.
"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, Any, Optional
import yaml


@dataclass
class DatabaseConfig:
    """Database configuration."""
    url: str = "sqlite:///analytics.db"
    echo: bool = False
    pool_size: int = 5


@dataclass
class LoggingConfig:
    """Logging configuration."""
    level: str = "INFO"
    format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    file: Optional[str] = None


@dataclass
class ModelConfig:
    """Machine learning model configuration."""
    random_forest: Dict[str, Any] = field(default_factory=lambda: {
        "n_estimators": 100,
        "max_depth": 10,
        "random_state": 42,
        "n_jobs": -1
    })
    xgboost: Dict[str, Any] = field(default_factory=lambda: {
        "learning_rate": 0.1,
        "n_estimators": 200,
        "max_depth": 6,
        "random_state": 42
    })
    linear: Dict[str, Any] = field(default_factory=lambda: {
        "fit_intercept": True,
        "normalize": False
    })


@dataclass
class VisualizationConfig:
    """Visualization configuration."""
    theme: str = "plotly_white"
    default_height: int = 600
    default_width: int = 1000
    color_palette: list = field(default_factory=lambda: [
        "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"
    ])


class Config:
    """Main configuration class."""
    
    def __init__(self):
        self.database = DatabaseConfig()
        self.logging = LoggingConfig()
        self.models = ModelConfig()
        self.visualization = VisualizationConfig()
    
    @classmethod
    def load(cls, config_path: str = "config.yaml") -> "Config":
        """
        Load configuration from YAML file.
        
        Args:
            config_path: Path to configuration file
            
        Returns:
            Config object with loaded settings
        """
        config = cls()
        
        config_file = Path(config_path)
        if not config_file.exists():
            # Return default configuration if file doesn't exist
            return config
        
        try:
            with open(config_file, 'r') as f:
                data = yaml.safe_load(f)
            
            if data:
                # Update configurations from file
                if 'database' in data:
                    for key, value in data['database'].items():
                        setattr(config.database, key, value)
                
                if 'logging' in data:
                    for key, value in data['logging'].items():
                        setattr(config.logging, key, value)
                
                if 'models' in data:
                    for model_name, params in data['models'].items():
                        if hasattr(config.models, model_name):
                            getattr(config.models, model_name).update(params)
                
                if 'visualization' in data:
                    for key, value in data['visualization'].items():
                        setattr(config.visualization, key, value)
        
        except Exception as e:
            print(f"Warning: Could not load config file: {e}")
            print("Using default configuration")
        
        return config
    
    def save(self, config_path: str = "config.yaml") -> None:
        """
        Save current configuration to YAML file.
        
        Args:
            config_path: Path to save configuration file
        """
        data = {
            'database': {
                'url': self.database.url,
                'echo': self.database.echo,
                'pool_size': self.database.pool_size
            },
            'logging': {
                'level': self.logging.level,
                'format': self.logging.format,
                'file': self.logging.file
            },
            'models': {
                'random_forest': self.models.random_forest,
                'xgboost': self.models.xgboost,
                'linear': self.models.linear
            },
            'visualization': {
                'theme': self.visualization.theme,
                'default_height': self.visualization.default_height,
                'default_width': self.visualization.default_width,
                'color_palette': self.visualization.color_palette
            }
        }
        
        with open(config_path, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
