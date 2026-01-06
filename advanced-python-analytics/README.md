# Advanced Python Analytics Engine

A professional data analytics platform with machine learning pipelines, statistical analysis, and interactive visualizations.

## Features

- **Data Processing**: Async data ingestion, cleaning, and feature engineering
- **Machine Learning**: Random Forest, XGBoost, and Linear models with automated training pipelines
- **Statistical Analysis**: Correlation analysis, anomaly detection, and hypothesis testing
- **Visualizations**: Interactive dashboards and reports using Plotly
- **Testing**: Comprehensive test suite with high code coverage

## Tech Stack

- **Python 3.10+**
- **Data Science**: NumPy, Pandas, SciPy
- **Machine Learning**: Scikit-learn, XGBoost
- **Visualization**: Plotly, Matplotlib, Seaborn
- **Async**: asyncio, aiohttp
- **Testing**: pytest, pytest-cov, pytest-asyncio

## Project Structure

```
advanced-python-analytics/
├── src/
│   ├── core/          # Configuration, logging, exceptions
│   ├── data/          # Data loading and processing
│   ├── models/        # ML training pipeline
│   ├── analysis/      # Statistical analysis and anomaly detection
│   └── visualization/ # Charts, dashboards, and reports
├── tests/             # Unit and integration tests
├── examples/          # Example scripts
├── data/              # Sample data
├── main.py            # CLI entry point
└── demo.py            # Complete demo
```

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd advanced-python-analytics

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest tests/ -v --cov=src
```

## Quick Start

### Run the Demo

```bash
python demo.py
```

This will demonstrate all features including data processing, ML training, statistical analysis, and report generation.

### Basic Usage

```python
from src.data.ingestion import DataLoader
from src.models.ml_pipeline import MLPipeline
from src.visualization.dashboard import Dashboard

# Load and process data
loader = DataLoader()
data = loader.load_csv('data/sample.csv')

# Train model
pipeline = MLPipeline(model_type='random_forest')
pipeline.fit(data, target='sales')

# Generate predictions
predictions = pipeline.predict(data)

# Create interactive dashboard
dashboard = Dashboard()
dashboard.add_predictions(predictions)
dashboard.generate('outputs/report.html')
```

### CLI Usage

```bash
# Run complete analysis pipeline
python main.py --data data/sample_data.csv --target sales --model random_forest --output report.html

# Statistical analysis only
python main.py --data data/sample_data.csv --target sales --analyze-only

# Custom configuration
python main.py --data data/sample_data.csv --target sales --config custom_config.yaml
```

### Examples

Check the `examples/` directory for specific use cases:

```bash
python examples/basic_analysis.py      # Statistical analysis
python examples/ml_training.py         # ML model training
python examples/anomaly_detection.py   # Anomaly detection
```

## Configuration

Edit `config.yaml` to customize settings:

```yaml
logging:
  level: INFO

models:
  random_forest:
    n_estimators: 100
    max_depth: 10
  xgboost:
    learning_rate: 0.1
    n_estimators: 200

visualization:
  theme: plotly_white
```

## Testing

```bash
# Run all tests with coverage
pytest --cov=src --cov-report=html

# Run specific tests
pytest tests/test_ml_pipeline.py -v
```

## License

MIT License - Free to use for learning and portfolio purposes

---

**Built with Python 3.10+ | Production-Ready Architecture**
