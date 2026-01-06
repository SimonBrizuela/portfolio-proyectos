"""
Machine Learning Training Example
Demonstrates ML pipeline usage
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.data.ingestion import DataLoader
from src.data.processor import DataProcessor
from src.models.ml_pipeline import MLPipeline
from src.visualization.charts import ChartBuilder
from src.visualization.dashboard import Dashboard


def main():
    """Run ML training example."""
    print("=" * 80)
    print("Machine Learning Training Example")
    print("=" * 80)
    
    # Load and process data
    print("\n[1] Loading and processing data...")
    loader = DataLoader()
    data = loader.load('data/sample_data.csv')
    
    processor = DataProcessor()
    processed_data = processor.process(data, target='sales')
    
    # Split data
    print("\n[2] Splitting data into train/test sets...")
    train_data, test_data = processor.train_test_split(processed_data, test_size=0.2)
    print(f"Training set: {len(train_data)} samples")
    print(f"Test set: {len(test_data)} samples")
    
    # Train models
    models = ['random_forest', 'linear']
    results = {}
    
    for model_type in models:
        print(f"\n[3] Training {model_type} model...")
        pipeline = MLPipeline(model_type=model_type)
        pipeline.fit(train_data, target='sales')
        
        # Evaluate
        print(f"[4] Evaluating {model_type} model...")
        metrics = pipeline.evaluate(test_data, target='sales')
        results[model_type] = metrics
        
        print(f"\nMetrics for {model_type}:")
        for metric, value in metrics.items():
            print(f"  {metric.upper()}: {value:.4f}")
        
        # Get predictions
        predictions = pipeline.predict(test_data)
        
        # Create visualization
        dashboard = Dashboard()
        dashboard.add_prediction_analysis(
            actual=test_data['sales'],
            predicted=predictions,
            metrics=metrics
        )
        
        # Save model
        model_path = f"outputs/{model_type}_model.pkl"
        pipeline.save_model(model_path)
        print(f"✓ Model saved to: {model_path}")
        
        # Generate dashboard
        dashboard_path = f"outputs/{model_type}_predictions.html"
        dashboard.generate(dashboard_path)
        print(f"✓ Dashboard saved to: {dashboard_path}")
    
    # Compare models
    print("\n" + "=" * 80)
    print("Model Comparison:")
    print("=" * 80)
    for model_type, metrics in results.items():
        print(f"\n{model_type.upper()}:")
        print(f"  R² Score: {metrics.get('r2', 0):.4f}")
        print(f"  RMSE: {metrics.get('rmse', 0):.4f}")
    
    print("\n✓ ML training complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()
