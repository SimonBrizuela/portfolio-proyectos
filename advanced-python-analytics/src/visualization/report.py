"""
Report generation module.
Creates comprehensive analysis reports.
"""

from typing import Optional, Dict, Any
from pathlib import Path
from datetime import datetime

from src.core.logger import setup_logger


logger = setup_logger(__name__)


class ReportGenerator:
    """Generates comprehensive analysis reports."""
    
    def __init__(self, config: Optional[Any] = None):
        """
        Initialize report generator.
        
        Args:
            config: Configuration object
        """
        self.config = config
    
    def create_report(
        self,
        data_summary: Dict[str, Any],
        statistics: Dict[str, Any],
        model_metrics: Optional[Dict[str, float]],
        dashboard: Any,
        output_path: str
    ) -> None:
        """
        Create comprehensive analysis report.
        
        Args:
            data_summary: Data summary statistics
            statistics: Statistical analysis results
            model_metrics: Model evaluation metrics
            dashboard: Dashboard object with figures
            output_path: Path to save report
        """
        logger.info("Generating comprehensive report")
        
        # Generate dashboard HTML with additional information
        html_content = self._create_report_header(data_summary, statistics, model_metrics)
        
        # Add dashboard charts
        if dashboard.figures:
            for i, fig in enumerate(dashboard.figures):
                html_content += f'<div class="chart-container">\n'
                html_content += fig.to_html(include_plotlyjs=False if i > 0 else 'cdn', div_id=f"chart_{i}")
                html_content += '\n</div>\n'
        
        html_content += self._create_report_footer()
        
        # Save report
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        logger.info(f"Report generated successfully: {output_path}")
    
    def _create_report_header(
        self,
        data_summary: Dict[str, Any],
        statistics: Dict[str, Any],
        model_metrics: Optional[Dict[str, float]]
    ) -> str:
        """Create report header with summary information."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Report - {timestamp}</title>
    <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.6;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
        }}
        
        header {{
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #667eea;
        }}
        
        h1 {{
            font-size: 2.5em;
            color: #2d3748;
            margin-bottom: 10px;
            font-weight: 700;
        }}
        
        h2 {{
            font-size: 1.8em;
            color: #2d3748;
            margin: 30px 0 20px 0;
            padding-left: 15px;
            border-left: 5px solid #667eea;
        }}
        
        .subtitle {{
            font-size: 1.2em;
            color: #718096;
            margin-bottom: 10px;
        }}
        
        .timestamp {{
            color: #a0aec0;
            font-size: 0.9em;
        }}
        
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }}
        
        .summary-card {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px;
            border-radius: 15px;
            color: white;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }}
        
        .summary-card h3 {{
            font-size: 1.1em;
            margin-bottom: 10px;
            opacity: 0.9;
        }}
        
        .summary-card .value {{
            font-size: 2em;
            font-weight: bold;
        }}
        
        .metrics-table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }}
        
        .metrics-table th {{
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }}
        
        .metrics-table td {{
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
        }}
        
        .metrics-table tr:hover {{
            background: #f7fafc;
        }}
        
        .chart-container {{
            margin: 30px 0;
            padding: 20px;
            background: #f7fafc;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }}
        
        .badge {{
            display: inline-block;
            padding: 8px 16px;
            background: #667eea;
            color: white;
            border-radius: 20px;
            font-size: 0.9em;
            margin: 5px;
        }}
        
        footer {{
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
            color: #718096;
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Advanced Analytics Report</h1>
            <p class="subtitle">Comprehensive Data Analysis and Machine Learning Results</p>
            <p class="timestamp">Generated: {timestamp}</p>
            <div style="margin-top: 20px;">
                <span class="badge">Data Science</span>
                <span class="badge">Machine Learning</span>
                <span class="badge">Statistical Analysis</span>
            </div>
        </header>
        
        <main>
            <h2>Data Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Records</h3>
                    <div class="value">{data_summary.get('n_rows', 'N/A'):,}</div>
                </div>
                <div class="summary-card">
                    <h3>Features</h3>
                    <div class="value">{data_summary.get('n_columns', 'N/A')}</div>
                </div>
                <div class="summary-card">
                    <h3>Memory Usage</h3>
                    <div class="value">{data_summary.get('memory_usage', 0):.2f} MB</div>
                </div>
            </div>
"""
        
        # Add model metrics if available
        if model_metrics:
            html += """
            <h2>Model Performance</h2>
            <table class="metrics-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
"""
            for metric, value in model_metrics.items():
                html += f"""
                    <tr>
                        <td><strong>{metric.upper()}</strong></td>
                        <td>{value:.4f}</td>
                    </tr>
"""
            html += """
                </tbody>
            </table>
"""
        
        html += """
            <h2>Visualizations</h2>
"""
        
        return html
    
    def _create_report_footer(self) -> str:
        """Create report footer."""
        return """
        </main>
        
        <footer>
            <p><strong>Advanced Python Analytics Engine v1.0</strong></p>
            <p>Professional analytics platform demonstrating advanced Python development</p>
            <p style="margin-top: 15px; font-size: 0.9em;">
                <strong>Technologies:</strong> Python 3.10+ | Pandas | NumPy | Scikit-learn | XGBoost | Plotly | SQLAlchemy
            </p>
            <p style="margin-top: 10px; font-size: 0.85em; color: #a0aec0;">
                Built with production-ready architecture and enterprise-grade code quality
            </p>
        </footer>
    </div>
</body>
</html>
"""
