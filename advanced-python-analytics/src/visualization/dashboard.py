"""
Dashboard generation module.
Creates comprehensive interactive dashboards.
"""

from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
from pathlib import Path

from src.visualization.charts import ChartBuilder
from src.core.logger import setup_logger


logger = setup_logger(__name__)


class Dashboard:
    """Creates interactive data dashboards."""
    
    def __init__(self, config: Optional[Any] = None):
        """
        Initialize dashboard.
        
        Args:
            config: Configuration object
        """
        self.config = config
        self.chart_builder = ChartBuilder(config)
        self.figures: List[Any] = []
    
    def add_distribution_plots(
        self,
        data: pd.DataFrame,
        max_columns: int = 6
    ) -> "Dashboard":
        """
        Add distribution plots for numeric columns.
        
        Args:
            data: Input DataFrame
            max_columns: Maximum number of columns to plot
            
        Returns:
            Self for method chaining
        """
        numeric_cols = data.select_dtypes(include=[np.number]).columns.tolist()
        
        for col in numeric_cols[:max_columns]:
            fig = self.chart_builder.create_histogram(
                data,
                column=col,
                title=f"Distribution of {col}"
            )
            self.figures.append(fig)
        
        logger.info(f"Added {min(len(numeric_cols), max_columns)} distribution plots")
        return self
    
    def add_correlation_heatmap(
        self,
        correlation_matrix: Dict[str, Any]
    ) -> "Dashboard":
        """
        Add correlation heatmap.
        
        Args:
            correlation_matrix: Correlation matrix as dictionary
            
        Returns:
            Self for method chaining
        """
        corr_df = pd.DataFrame(correlation_matrix)
        
        fig = self.chart_builder.create_heatmap(
            corr_df,
            title="Feature Correlation Matrix"
        )
        self.figures.append(fig)
        
        logger.info("Added correlation heatmap")
        return self
    
    def add_feature_importance(
        self,
        importance_dict: Dict[str, float]
    ) -> "Dashboard":
        """
        Add feature importance chart.
        
        Args:
            importance_dict: Dictionary of feature importances
            
        Returns:
            Self for method chaining
        """
        if not importance_dict:
            return self
        
        fig = self.chart_builder.create_feature_importance(
            importance_dict,
            title="Top Features by Importance"
        )
        self.figures.append(fig)
        
        logger.info("Added feature importance chart")
        return self
    
    def add_prediction_analysis(
        self,
        actual: pd.Series,
        predicted: np.ndarray,
        metrics: Dict[str, float]
    ) -> "Dashboard":
        """
        Add prediction analysis plots.
        
        Args:
            actual: Actual values
            predicted: Predicted values
            metrics: Model evaluation metrics
            
        Returns:
            Self for method chaining
        """
        fig = self.chart_builder.create_prediction_plot(
            actual,
            predicted,
            title="Model Predictions Analysis"
        )
        self.figures.append(fig)
        
        logger.info("Added prediction analysis plots")
        return self
    
    def add_custom_figure(self, figure: Any) -> "Dashboard":
        """
        Add custom Plotly figure.
        
        Args:
            figure: Plotly figure object
            
        Returns:
            Self for method chaining
        """
        self.figures.append(figure)
        return self
    
    def generate(self, output_path: str = "dashboard.html") -> None:
        """
        Generate and save dashboard to HTML.
        
        Args:
            output_path: Path to save HTML file
        """
        if not self.figures:
            logger.warning("No figures to generate dashboard")
            return
        
        # Create HTML content
        html_content = self._create_html_template()
        
        # Add each figure
        for i, fig in enumerate(self.figures):
            html_content += f'<div class="chart-container">\n'
            html_content += fig.to_html(include_plotlyjs=False, div_id=f"chart_{i}")
            html_content += '\n</div>\n'
        
        html_content += self._html_footer()
        
        # Save to file
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"Dashboard generated: {output_path}")
    
    def _create_html_template(self) -> str:
        """Create HTML template."""
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Python Analytics Dashboard</title>
    <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
        }
        
        header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #667eea;
        }
        
        h1 {
            font-size: 2.5em;
            color: #2d3748;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .subtitle {
            font-size: 1.2em;
            color: #718096;
            font-weight: 400;
        }
        
        .chart-container {
            margin: 30px 0;
            padding: 20px;
            background: #f7fafc;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
            color: #718096;
        }
        
        .badge {
            display: inline-block;
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border-radius: 20px;
            font-size: 0.9em;
            margin: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Advanced Python Analytics Dashboard</h1>
            <p class="subtitle">Professional Data Analysis and Machine Learning Platform</p>
            <div style="margin-top: 20px;">
                <span class="badge">Real-time Processing</span>
                <span class="badge">Machine Learning</span>
                <span class="badge">Statistical Analysis</span>
                <span class="badge">Interactive Visualizations</span>
            </div>
        </header>
        
        <main>
"""
    
    def _html_footer(self) -> str:
        """Create HTML footer."""
        return """
        </main>
        
        <footer>
            <p><strong>Advanced Python Analytics Engine v1.0</strong></p>
            <p>Built with Python, Pandas, Scikit-learn, XGBoost, and Plotly</p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                Professional-grade analytics platform demonstrating advanced Python development
            </p>
        </footer>
    </div>
</body>
</html>
"""
