# Quick Start Guide

Get up and running with Advanced Python Analytics Engine in 5 minutes.

## Installation

### Step 1: Clone and Setup Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Unix/MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Verify Installation

```bash
# Run tests to verify everything works
pytest tests/ -v
```

## Basic Usage

### Example 1: Simple Analysis

```bash
# Run basic analysis on sample data
python examples/basic_analysis.py
```

This will:
- Load the sample dataset
- Perform statistical analysis
- Generate interactive visualizations
- Create an HTML dashboard in `outputs/basic_analysis_dashboard.html`

### Example 2: Train ML Models

```bash
# Train machine learning models
python examples/ml_training.py
```

This will:
- Train Random Forest and Linear Regression models
- Evaluate model performance
- Save trained models
- Generate prediction visualizations

### Example 3: Detect Anomalies

```bash
# Run anomaly detection
python examples/anomaly_detection.py
```

This will:
- Apply multiple anomaly detection methods
- Identify outliers in your data
- Create anomaly score visualizations

## Using the CLI

### Full Analysis Pipeline

```bash
# Run complete analysis on your data
python main.py --data data/sample_data.csv --target sales --model random_forest --output outputs/report.html
```

### Statistical Analysis Only

```bash
# Skip ML training, only perform statistical analysis
python main.py --data data/sample_data.csv --target sales --analyze-only --output outputs/stats_report.html
```

### Custom Configuration

```bash
# Use custom configuration file
python main.py --data data/sample_data.csv --target sales --config custom_config.yaml
```

## Using Your Own Data

### Prepare Your Data

Your data should be in CSV, JSON, or Excel format with:
- Numeric features for analysis
- A target column for ML predictions (optional)
- Clean column names (no special characters)

### Run Analysis

```python
from src.data.ingestion import DataLoader
from src.models.ml_pipeline import MLPipeline

# Load your data
loader = DataLoader()
data = loader.load('path/to/your/data.csv')

# Train model
pipeline = MLPipeline(model_type='random_forest')
pipeline.fit(data, target='your_target_column')

# Make predictions
predictions = pipeline.predict(data)
```

## Project Structure Overview

```
advanced-python-analytics/
├── src/                    # Source code
│   ├── core/              # Core utilities
│   ├── data/              # Data processing
│   ├── models/            # ML models
│   ├── analysis/          # Statistical analysis
│   └── visualization/     # Charts and dashboards
├── examples/              # Example scripts
├── tests/                 # Unit tests
├── data/                  # Data directory
├── outputs/               # Generated reports
└── main.py               # CLI entry point
```

## Next Steps

1. **Explore Examples**: Check out the `examples/` directory for more use cases
2. **Read Documentation**: See `README.md` for detailed documentation
3. **Customize Configuration**: Edit `config.yaml` to adjust settings
4. **Run Tests**: Execute `pytest tests/ -v --cov=src` to see test coverage
5. **Try Your Data**: Replace sample data with your own datasets

## Common Tasks

### Change Model Type

```python
# Use XGBoost instead of Random Forest
pipeline = MLPipeline(model_type='xgboost')
```

### Adjust Visualization Theme

Edit `config.yaml`:
```yaml
visualization:
  theme: plotly_dark  # or 'plotly_white', 'ggplot2', 'seaborn'
```

### Enable Logging to File

Edit `config.yaml`:
```yaml
logging:
  level: DEBUG
  file: logs/analytics.log
```

## Troubleshooting

**Issue**: Import errors
- **Solution**: Ensure virtual environment is activated and dependencies are installed

**Issue**: Data loading fails
- **Solution**: Check file path and format (CSV, JSON, or Excel)

**Issue**: Model training takes too long
- **Solution**: Reduce `n_estimators` in `config.yaml` or use smaller dataset

## Support

For issues, questions, or contributions, please refer to the main README.md

---

**Ready to analyze your data!** Start with the examples and then apply to your own datasets.
