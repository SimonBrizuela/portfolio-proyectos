"""
Custom exception classes for the analytics engine.
"""


class AnalyticsException(Exception):
    """Base exception for analytics engine."""
    pass


class DataLoadError(AnalyticsException):
    """Raised when data cannot be loaded."""
    pass


class DataValidationError(AnalyticsException):
    """Raised when data validation fails."""
    pass


class ModelTrainingError(AnalyticsException):
    """Raised when model training fails."""
    pass


class PredictionError(AnalyticsException):
    """Raised when prediction fails."""
    pass


class ConfigurationError(AnalyticsException):
    """Raised when configuration is invalid."""
    pass


class VisualizationError(AnalyticsException):
    """Raised when visualization generation fails."""
    pass
