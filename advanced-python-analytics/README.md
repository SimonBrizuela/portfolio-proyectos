# Advanced Python Analytics Engine
# Motor de Analítica Avanzada en Python

[English](#english) | [Español](#español)

---

<a name="english"></a>
## 🇬🇧 English

A professional data analytics platform with machine learning pipelines, statistical analysis, and interactive visualizations.

### Features

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

### License

MIT License - Free to use for learning and portfolio purposes

---

<a name="español"></a>
## 🇪🇸 Español

Una plataforma profesional de análisis de datos con pipelines de machine learning, análisis estadístico y visualizaciones interactivas.

### Características

- **Procesamiento de Datos**: Ingesta asíncrona, limpieza y feature engineering
- **Machine Learning**: Modelos Random Forest, XGBoost y Lineales con pipelines automatizados
- **Análisis Estadístico**: Análisis de correlación, detección de anomalías y pruebas de hipótesis
- **Visualizaciones**: Dashboards interactivos y reportes usando Plotly
- **Testing**: Suite de pruebas comprehensiva con alta cobertura

### Stack Tecnológico

- **Python 3.10+**
- **Ciencia de Datos**: NumPy, Pandas, SciPy
- **Machine Learning**: Scikit-learn, XGBoost
- **Visualización**: Plotly, Matplotlib, Seaborn
- **Async**: asyncio, aiohttp
- **Testing**: pytest, pytest-cov, pytest-asyncio

### Estructura del Proyecto

```
advanced-python-analytics/
├── src/
│   ├── core/          # Configuración, logging, excepciones
│   ├── data/          # Carga y procesamiento de datos
│   ├── models/        # Pipeline de entrenamiento ML
│   ├── analysis/      # Análisis estadístico y detección de anomalías
│   └── visualization/ # Gráficos, dashboards y reportes
├── tests/             # Tests unitarios y de integración
├── examples/          # Scripts de ejemplo
├── data/              # Datos de muestra
├── main.py            # Punto de entrada CLI
└── demo.py            # Demo completo
```

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd advanced-python-analytics

# Crear y activar entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar tests
pytest tests/ -v --cov=src
```

### Inicio Rápido

#### Ejecutar el Demo

```bash
python demo.py
```

Esto demostrará todas las características incluyendo procesamiento de datos, entrenamiento ML, análisis estadístico y generación de reportes.

#### Uso Básico

```python
from src.data.ingestion import DataLoader
from src.models.ml_pipeline import MLPipeline
from src.visualization.dashboard import Dashboard

# Cargar y procesar datos
loader = DataLoader()
data = loader.load_csv('data/sample.csv')

# Entrenar modelo
pipeline = MLPipeline(model_type='random_forest')
pipeline.fit(data, target='sales')

# Generar predicciones
predictions = pipeline.predict(data)

# Crear dashboard interactivo
dashboard = Dashboard()
dashboard.add_predictions(predictions)
dashboard.generate('outputs/report.html')
```

#### Uso de CLI

```bash
# Ejecutar pipeline de análisis completo
python main.py --data data/sample_data.csv --target sales --model random_forest --output report.html

# Solo análisis estadístico
python main.py --data data/sample_data.csv --target sales --analyze-only

# Configuración personalizada
python main.py --data data/sample_data.csv --target sales --config custom_config.yaml
```

#### Ejemplos

Revisa el directorio `examples/` para casos de uso específicos:

```bash
python examples/basic_analysis.py      # Análisis estadístico
python examples/ml_training.py         # Entrenamiento de modelos ML
python examples/anomaly_detection.py   # Detección de anomalías
```

### Configuración

Edita `config.yaml` para personalizar configuraciones:

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

### Testing

```bash
# Ejecutar todos los tests con cobertura
pytest --cov=src --cov-report=html

# Ejecutar tests específicos
pytest tests/test_ml_pipeline.py -v
```

### Licencia

Licencia MIT - Libre para usar con fines de aprendizaje y portafolio

---

**Construido con Python 3.10+ | Arquitectura Lista para Producción**
