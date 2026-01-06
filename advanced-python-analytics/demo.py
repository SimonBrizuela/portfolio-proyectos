"""
Complete Demo Script
Demonstrates all major features of the Advanced Python Analytics Engine
"""

import sys
import asyncio
from pathlib import Path

# Add project to path
sys.path.insert(0, str(Path(__file__).parent))

from src.data.ingestion import DataLoader, StreamProcessor
from src.data.processor import DataProcessor
from src.models.ml_pipeline import MLPipeline
from src.analysis.statistics import StatisticalAnalyzer
from src.analysis.anomaly import AnomalyDetector
from src.visualization.dashboard import Dashboard
from src.visualization.report import ReportGenerator
from src.core.config import Config
from src.core.logger import setup_logger


logger = setup_logger(__name__)


def print_header(text):
    """Print formatted header."""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80)


def print_section(text):
    """Print formatted section."""
    print(f"\n{'─' * 80}")
    print(f"  {text}")
    print('─' * 80)


async def demo_async_processing():
    """Demonstrate async data processing."""
    print_section("Async Data Processing Demo")
    
    processor = StreamProcessor(batch_size=10)
    detector = AnomalyDetector(method='zscore', threshold=3.0)
    
    print("Simulating real-time data stream...")
    batch_count = 0
    
    async for batch in processor.stream_data(source='api'):
        batch_count += 1
        print(f"  Batch {batch_count}: Received {len(batch)} records")
        
        # Detect anomalies in batch
        anomalies = detector.detect(batch)
        if len(anomalies) > 0:
            print(f"    ⚠ Detected {len(anomalies)} anomalies!")
        
        if batch_count >= 3:  # Limit demo to 3 batches
            break
    
    print("✓ Async processing demo complete")


def demo_data_loading():
    """Demonstrate data loading capabilities."""
    print_section("Data Loading Demo")
    
    loader = DataLoader()
    
    # Load sample data
    print("Loading sample data from CSV...")
    data = loader.load('data/sample_data.csv')
    
    print(f"✓ Loaded {len(data)} rows and {len(data.columns)} columns")
    print(f"\nColumns: {', '.join(data.columns[:5])}...")
    print(f"\nFirst few rows:")
    print(data.head(3).to_string())
    
    return data


def demo_data_processing(data):
    """Demonstrate data processing."""
    print_section("Data Processing Demo")
    
    processor = DataProcessor()
    
    print("Processing data (cleaning, encoding, feature engineering)...")
    processed_data = processor.process(data, target='sales')
    
    print(f"✓ Processing complete")
    print(f"  Original shape: {data.shape}")
    print(f"  Processed shape: {processed_data.shape}")
    print(f"  New features created: {processed_data.shape[1] - data.shape[1]}")
    
    # Get summary
    summary = processor.get_summary(processed_data)
    print(f"\nData Summary:")
    print(f"  Memory usage: {summary['memory_usage']:.2f} MB")
    print(f"  Missing values: {sum(summary['missing_values'].values())}")
    
    return processed_data, processor


def demo_statistical_analysis(data):
    """Demonstrate statistical analysis."""
    print_section("Statistical Analysis Demo")
    
    analyzer = StatisticalAnalyzer()
    
    print("Performing comprehensive statistical analysis...")
    stats = analyzer.analyze(data, target='sales')
    
    print("✓ Analysis complete")
    
    # Show key statistics
    print("\nDescriptive Statistics (first 3 features):")
    for feature in list(stats['descriptive']['mean'].keys())[:3]:
        print(f"  {feature}:")
        print(f"    Mean: {stats['descriptive']['mean'][feature]:.2f}")
        print(f"    Std Dev: {stats['descriptive']['std'][feature]:.2f}")
        print(f"    Skewness: {stats['descriptive']['skewness'][feature]:.2f}")
    
    # Show correlations
    if 'target_correlations' in stats['correlations']:
        print("\nTop 3 Correlations with Target:")
        for i, (feature, corr) in enumerate(list(stats['correlations']['target_correlations'].items())[:3], 1):
            print(f"  {i}. {feature}: {corr:.4f}")
    
    # Show feature importance
    print("\nTop 5 Important Features:")
    for i, (feature, importance) in enumerate(list(stats['importance'].items())[:5], 1):
        print(f"  {i}. {feature}: {importance:.4f}")
    
    return stats


def demo_machine_learning(processed_data, processor):
    """Demonstrate machine learning capabilities."""
    print_section("Machine Learning Demo")
    
    # Split data
    print("Splitting data (80% train, 20% test)...")
    train_data, test_data = processor.train_test_split(processed_data, test_size=0.2)
    print(f"  Training set: {len(train_data)} samples")
    print(f"  Test set: {len(test_data)} samples")
    
    # Train Random Forest
    print("\nTraining Random Forest model...")
    rf_pipeline = MLPipeline(model_type='random_forest')
    rf_pipeline.fit(train_data, target='sales')
    print("✓ Training complete")
    
    # Evaluate
    print("\nEvaluating model performance...")
    metrics = rf_pipeline.evaluate(test_data, target='sales')
    
    print("\nPerformance Metrics:")
    for metric, value in metrics.items():
        print(f"  {metric.upper()}: {value:.4f}")
    
    # Feature importance
    importance = rf_pipeline.get_feature_importance()
    print(f"\nTop 5 Feature Importances:")
    for i, row in importance.head(5).iterrows():
        print(f"  {row['feature']}: {row['importance']:.4f}")
    
    # Make predictions
    predictions = rf_pipeline.predict(test_data)
    
    return rf_pipeline, predictions, test_data, metrics


def demo_anomaly_detection(data):
    """Demonstrate anomaly detection."""
    print_section("Anomaly Detection Demo")
    
    methods = ['isolation_forest', 'zscore', 'iqr']
    
    for method in methods:
        print(f"\nUsing {method.upper()} method...")
        detector = AnomalyDetector(method=method, threshold=2.5)
        
        anomalies = detector.detect(data)
        percentage = (len(anomalies) / len(data)) * 100
        
        print(f"  ✓ Detected {len(anomalies)} anomalies ({percentage:.2f}%)")


def demo_visualization(processed_data, stats, predictions, test_data, metrics):
    """Demonstrate visualization capabilities."""
    print_section("Visualization & Reporting Demo")
    
    print("Creating interactive dashboard...")
    dashboard = Dashboard()
    
    # Add various visualizations
    dashboard.add_distribution_plots(processed_data, max_columns=4)
    dashboard.add_correlation_heatmap(stats['correlations']['matrix'])
    dashboard.add_feature_importance(stats['importance'])
    dashboard.add_prediction_analysis(
        actual=test_data['sales'],
        predicted=predictions,
        metrics=metrics
    )
    
    # Generate dashboard
    dashboard_path = "outputs/demo_dashboard.html"
    dashboard.generate(dashboard_path)
    print(f"✓ Dashboard saved to: {dashboard_path}")
    
    # Generate comprehensive report
    print("\nGenerating comprehensive report...")
    processor = DataProcessor()
    summary = processor.get_summary(processed_data)
    
    report_gen = ReportGenerator()
    report_path = "outputs/demo_report.html"
    report_gen.create_report(
        data_summary=summary,
        statistics=stats,
        model_metrics=metrics,
        dashboard=dashboard,
        output_path=report_path
    )
    print(f"✓ Report saved to: {report_path}")


async def main():
    """Run complete demo."""
    print_header("ADVANCED PYTHON ANALYTICS ENGINE - COMPLETE DEMO")
    print("\nThis demo showcases all major features of the platform:")
    print("  • Data loading and processing")
    print("  • Statistical analysis")
    print("  • Machine learning pipelines")
    print("  • Anomaly detection")
    print("  • Async stream processing")
    print("  • Interactive visualizations")
    print("  • Automated reporting")
    
    try:
        # 1. Data Loading
        data = demo_data_loading()
        
        # 2. Data Processing
        processed_data, processor = demo_data_processing(data)
        
        # 3. Statistical Analysis
        stats = demo_statistical_analysis(processed_data)
        
        # 4. Machine Learning
        ml_pipeline, predictions, test_data, metrics = demo_machine_learning(
            processed_data, processor
        )
        
        # 5. Anomaly Detection
        demo_anomaly_detection(processed_data)
        
        # 6. Async Processing
        await demo_async_processing()
        
        # 7. Visualization & Reporting
        demo_visualization(processed_data, stats, predictions, test_data, metrics)
        
        # Summary
        print_header("DEMO COMPLETE")
        print("\n✓ All features demonstrated successfully!")
        print("\nGenerated Files:")
        print("  • outputs/demo_dashboard.html - Interactive dashboard")
        print("  • outputs/demo_report.html - Comprehensive report")
        print("\nNext Steps:")
        print("  1. Open the HTML files in your browser")
        print("  2. Explore the examples/ directory for more use cases")
        print("  3. Try with your own data using main.py")
        print("  4. Read QUICKSTART.md for detailed guide")
        print("\n" + "=" * 80)
        
    except Exception as e:
        logger.error(f"Demo failed: {e}", exc_info=True)
        print(f"\n✗ Demo failed: {e}")
        return 1
    
    return 0


if __name__ == "__main__":
    # Create outputs directory
    Path("outputs").mkdir(exist_ok=True)
    
    # Run async demo
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
