"""
Basic Analysis Example
Demonstrates simple data analysis workflow
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.data.ingestion import DataLoader
from src.data.processor import DataProcessor
from src.analysis.statistics import StatisticalAnalyzer
from src.visualization.dashboard import Dashboard


def main():
    """Run basic analysis example."""
    print("=" * 80)
    print("Basic Analysis Example")
    print("=" * 80)
    
    # Load data
    print("\n[1] Loading sample data...")
    loader = DataLoader()
    data = loader.load('data/sample_data.csv')
    print(f"Loaded {len(data)} records")
    print(f"Columns: {', '.join(data.columns)}")
    
    # Process data
    print("\n[2] Processing data...")
    processor = DataProcessor()
    processed_data = processor.process(data, target='sales')
    print(f"Processed data shape: {processed_data.shape}")
    
    # Statistical analysis
    print("\n[3] Performing statistical analysis...")
    analyzer = StatisticalAnalyzer()
    stats = analyzer.analyze(processed_data, target='sales')
    
    print("\nDescriptive Statistics (first 3 features):")
    for feature in list(stats['descriptive']['mean'].keys())[:3]:
        print(f"  {feature}:")
        print(f"    Mean: {stats['descriptive']['mean'][feature]:.2f}")
        print(f"    Std: {stats['descriptive']['std'][feature]:.2f}")
    
    print("\nTop 5 Feature Importances:")
    for i, (feature, importance) in enumerate(list(stats['importance'].items())[:5], 1):
        print(f"  {i}. {feature}: {importance:.4f}")
    
    # Create visualizations
    print("\n[4] Creating visualizations...")
    dashboard = Dashboard()
    dashboard.add_distribution_plots(processed_data, max_columns=3)
    dashboard.add_correlation_heatmap(stats['correlations']['matrix'])
    dashboard.add_feature_importance(stats['importance'])
    
    # Generate dashboard
    output_path = "outputs/basic_analysis_dashboard.html"
    dashboard.generate(output_path)
    
    print(f"\n✓ Analysis complete!")
    print(f"✓ Dashboard saved to: {output_path}")
    print("\n" + "=" * 80)


if __name__ == "__main__":
    main()
