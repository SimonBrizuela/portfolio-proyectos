"""
Anomaly Detection Example
Demonstrates anomaly detection capabilities
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.data.ingestion import DataLoader
from src.data.processor import DataProcessor
from src.analysis.anomaly import AnomalyDetector
from src.visualization.charts import ChartBuilder
import plotly.graph_objects as go


def main():
    """Run anomaly detection example."""
    print("=" * 80)
    print("Anomaly Detection Example")
    print("=" * 80)
    
    # Load data
    print("\n[1] Loading data...")
    loader = DataLoader()
    data = loader.load('data/sample_data.csv')
    print(f"Loaded {len(data)} records")
    
    # Process data
    print("\n[2] Processing data...")
    processor = DataProcessor()
    processed_data = processor.process(data)
    
    # Test different methods
    methods = ['isolation_forest', 'zscore', 'iqr']
    
    for method in methods:
        print(f"\n[3] Detecting anomalies using {method.upper()}...")
        detector = AnomalyDetector(method=method, threshold=2.5)
        
        anomalies = detector.detect(processed_data)
        
        print(f"✓ Detected {len(anomalies)} anomalies ({len(anomalies)/len(processed_data)*100:.2f}%)")
        
        if len(anomalies) > 0:
            print("\nSample anomalous records:")
            print(anomalies.head(3)[['sales', 'marketing_spend', 'website_visits']])
    
    # Visualization
    print("\n[4] Creating visualization...")
    detector = AnomalyDetector(method='isolation_forest')
    detector.fit(processed_data)
    scores = detector.get_anomaly_scores(processed_data)
    
    # Create scatter plot with anomaly scores
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=processed_data.index,
        y=scores,
        mode='markers',
        marker=dict(
            size=8,
            color=scores,
            colorscale='Viridis',
            showscale=True,
            colorbar=dict(title="Anomaly Score")
        ),
        text=[f"Index: {i}<br>Score: {s:.2f}" for i, s in enumerate(scores)],
        hovertemplate='%{text}<extra></extra>'
    ))
    
    fig.update_layout(
        title="Anomaly Scores Distribution",
        xaxis_title="Sample Index",
        yaxis_title="Anomaly Score",
        template="plotly_white",
        height=600
    )
    
    output_path = "outputs/anomaly_detection.html"
    fig.write_html(output_path)
    
    print(f"\n✓ Anomaly detection complete!")
    print(f"✓ Visualization saved to: {output_path}")
    print("=" * 80)


if __name__ == "__main__":
    main()
