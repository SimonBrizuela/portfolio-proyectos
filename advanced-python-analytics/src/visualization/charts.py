"""
Chart generation module.
Creates interactive visualizations using Plotly.
"""

from typing import Optional, List, Dict, Any
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

from src.core.logger import setup_logger


logger = setup_logger(__name__)


class ChartBuilder:
    """Builds various types of interactive charts."""
    
    def __init__(self, config: Optional[Any] = None):
        """
        Initialize chart builder.
        
        Args:
            config: Configuration object
        """
        self.config = config
        self.theme = "plotly_white"
        self.default_height = 600
        self.default_width = 1000
        
        if config and hasattr(config, 'visualization'):
            self.theme = config.visualization.theme
            self.default_height = config.visualization.default_height
            self.default_width = config.visualization.default_width
    
    def create_scatter(
        self,
        data: pd.DataFrame,
        x: str,
        y: str,
        color: Optional[str] = None,
        size: Optional[str] = None,
        title: str = "Scatter Plot"
    ) -> go.Figure:
        """Create scatter plot."""
        fig = px.scatter(
            data,
            x=x,
            y=y,
            color=color,
            size=size,
            title=title,
            template=self.theme,
            height=self.default_height
        )
        
        fig.update_traces(marker=dict(line=dict(width=0.5, color='DarkSlateGrey')))
        return fig
    
    def create_line(
        self,
        data: pd.DataFrame,
        x: str,
        y: List[str],
        title: str = "Line Chart"
    ) -> go.Figure:
        """Create line chart."""
        fig = go.Figure()
        
        for col in y:
            fig.add_trace(go.Scatter(
                x=data[x],
                y=data[col],
                mode='lines+markers',
                name=col
            ))
        
        fig.update_layout(
            title=title,
            template=self.theme,
            height=self.default_height,
            hovermode='x unified'
        )
        
        return fig
    
    def create_bar(
        self,
        data: pd.DataFrame,
        x: str,
        y: str,
        title: str = "Bar Chart",
        orientation: str = 'v'
    ) -> go.Figure:
        """Create bar chart."""
        fig = px.bar(
            data,
            x=x,
            y=y,
            title=title,
            template=self.theme,
            height=self.default_height,
            orientation=orientation
        )
        
        return fig
    
    def create_histogram(
        self,
        data: pd.DataFrame,
        column: str,
        bins: int = 30,
        title: Optional[str] = None
    ) -> go.Figure:
        """Create histogram."""
        if title is None:
            title = f"Distribution of {column}"
        
        fig = px.histogram(
            data,
            x=column,
            nbins=bins,
            title=title,
            template=self.theme,
            height=self.default_height
        )
        
        fig.update_traces(marker_line_width=1, marker_line_color="white")
        return fig
    
    def create_box(
        self,
        data: pd.DataFrame,
        columns: List[str],
        title: str = "Box Plot"
    ) -> go.Figure:
        """Create box plot."""
        fig = go.Figure()
        
        for col in columns:
            fig.add_trace(go.Box(
                y=data[col],
                name=col,
                boxmean='sd'
            ))
        
        fig.update_layout(
            title=title,
            template=self.theme,
            height=self.default_height
        )
        
        return fig
    
    def create_heatmap(
        self,
        data: pd.DataFrame,
        title: str = "Heatmap",
        color_scale: str = "RdBu"
    ) -> go.Figure:
        """Create correlation heatmap."""
        fig = go.Figure(data=go.Heatmap(
            z=data.values,
            x=data.columns,
            y=data.index,
            colorscale=color_scale,
            zmid=0
        ))
        
        fig.update_layout(
            title=title,
            template=self.theme,
            height=self.default_height,
            width=self.default_width
        )
        
        return fig
    
    def create_prediction_plot(
        self,
        actual: pd.Series,
        predicted: np.ndarray,
        title: str = "Actual vs Predicted"
    ) -> go.Figure:
        """Create actual vs predicted plot."""
        fig = make_subplots(
            rows=1, cols=2,
            subplot_titles=("Scatter Plot", "Residual Plot")
        )
        
        # Scatter plot
        fig.add_trace(
            go.Scatter(
                x=actual,
                y=predicted,
                mode='markers',
                name='Predictions',
                marker=dict(size=8, opacity=0.6)
            ),
            row=1, col=1
        )
        
        # Perfect prediction line
        min_val = min(actual.min(), predicted.min())
        max_val = max(actual.max(), predicted.max())
        fig.add_trace(
            go.Scatter(
                x=[min_val, max_val],
                y=[min_val, max_val],
                mode='lines',
                name='Perfect Prediction',
                line=dict(color='red', dash='dash')
            ),
            row=1, col=1
        )
        
        # Residual plot
        residuals = actual.values - predicted
        fig.add_trace(
            go.Scatter(
                x=predicted,
                y=residuals,
                mode='markers',
                name='Residuals',
                marker=dict(size=8, opacity=0.6)
            ),
            row=1, col=2
        )
        
        # Zero line
        fig.add_trace(
            go.Scatter(
                x=[predicted.min(), predicted.max()],
                y=[0, 0],
                mode='lines',
                name='Zero',
                line=dict(color='red', dash='dash')
            ),
            row=1, col=2
        )
        
        fig.update_xaxes(title_text="Actual", row=1, col=1)
        fig.update_yaxes(title_text="Predicted", row=1, col=1)
        fig.update_xaxes(title_text="Predicted", row=1, col=2)
        fig.update_yaxes(title_text="Residuals", row=1, col=2)
        
        fig.update_layout(
            title=title,
            template=self.theme,
            height=self.default_height,
            showlegend=True
        )
        
        return fig
    
    def create_feature_importance(
        self,
        importance_dict: Dict[str, float],
        top_n: int = 15,
        title: str = "Feature Importance"
    ) -> go.Figure:
        """Create feature importance bar chart."""
        # Sort and get top N
        sorted_items = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)[:top_n]
        features, importances = zip(*sorted_items)
        
        fig = go.Figure(go.Bar(
            x=list(importances),
            y=list(features),
            orientation='h',
            marker=dict(
                color=list(importances),
                colorscale='Viridis'
            )
        ))
        
        fig.update_layout(
            title=title,
            xaxis_title="Importance",
            yaxis_title="Feature",
            template=self.theme,
            height=max(400, len(features) * 25),
            yaxis={'categoryorder': 'total ascending'}
        )
        
        return fig
