"""
Advanced Python Analytics Engine
Main application entry point
"""

import asyncio
import argparse
import sys
from pathlib import Path

from src.core.logger import setup_logger
from src.core.config import Config
from src.data.ingestion import DataLoader
from src.data.processor import DataProcessor
from src.models.ml_pipeline import MLPipeline
from src.analysis.statistics import StatisticalAnalyzer
from src.visualization.dashboard import Dashboard
from src.visualization.report import ReportGenerator


logger = setup_logger(__name__)


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Advanced Python Analytics Engine",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    
    parser.add_argument(
        "--data",
        type=str,
        required=True,
        help="Path to input data file (CSV, JSON, or Excel)"
    )
    
    parser.add_argument(
        "--target",
        type=str,
        required=True,
        help="Target column name for prediction"
    )
    
    parser.add_argument(
        "--model",
        type=str,
        choices=["random_forest", "xgboost", "linear"],
        default="random_forest",
        help="Machine learning model to use"
    )
    
    parser.add_argument(
        "--output",
        type=str,
        default="outputs/analysis_report.html",
        help="Output file path for the report"
    )
    
    parser.add_argument(
        "--analyze-only",
        action="store_true",
        help="Run statistical analysis only, skip ML training"
    )
    
    parser.add_argument(
        "--config",
        type=str,
        default="config.yaml",
        help="Path to configuration file"
    )
    
    return parser.parse_args()


async def run_analysis(args):
    """Execute the main analysis pipeline."""
    
    logger.info("=" * 80)
    logger.info("Advanced Python Analytics Engine - Starting Analysis")
    logger.info("=" * 80)
    
    try:
        # Load configuration
        config = Config.load(args.config)
        logger.info(f"Configuration loaded from: {args.config}")
        
        # Step 1: Load data
        logger.info(f"\n[1/6] Loading data from: {args.data}")
        loader = DataLoader()
        data = await loader.load_async(args.data)
        logger.info(f"Loaded {len(data)} rows with {len(data.columns)} columns")
        
        # Step 2: Process and clean data
        logger.info("\n[2/6] Processing and cleaning data")
        processor = DataProcessor()
        processed_data = processor.process(data)
        logger.info(f"Data processing complete. Shape: {processed_data.shape}")
        
        # Step 3: Statistical analysis
        logger.info("\n[3/6] Performing statistical analysis")
        analyzer = StatisticalAnalyzer()
        stats_results = analyzer.analyze(processed_data, target=args.target)
        logger.info(f"Statistical analysis complete:")
        logger.info(f"  - Correlations computed: {len(stats_results['correlations'])}")
        logger.info(f"  - Feature importance calculated: {len(stats_results['importance'])}")
        
        predictions = None
        model_metrics = None
        
        # Step 4: Machine learning (optional)
        if not args.analyze_only:
            logger.info(f"\n[4/6] Training {args.model} model")
            pipeline = MLPipeline(model_type=args.model, config=config)
            
            # Split data and train
            train_data, test_data = processor.train_test_split(
                processed_data, 
                test_size=0.2
            )
            
            pipeline.fit(train_data, target=args.target)
            logger.info("Model training complete")
            
            # Make predictions
            predictions = pipeline.predict(test_data)
            model_metrics = pipeline.evaluate(test_data, target=args.target)
            
            logger.info(f"Model evaluation metrics:")
            for metric, value in model_metrics.items():
                logger.info(f"  - {metric}: {value:.4f}")
        else:
            logger.info("\n[4/6] Skipping ML training (analyze-only mode)")
        
        # Step 5: Generate visualizations
        logger.info("\n[5/6] Generating visualizations")
        dashboard = Dashboard(config=config)
        
        # Add statistical charts
        dashboard.add_distribution_plots(processed_data)
        dashboard.add_correlation_heatmap(stats_results['correlations'])
        dashboard.add_feature_importance(stats_results['importance'])
        
        # Add ML results if available
        if predictions is not None:
            dashboard.add_prediction_analysis(
                actual=test_data[args.target],
                predicted=predictions,
                metrics=model_metrics
            )
        
        logger.info("Visualizations generated successfully")
        
        # Step 6: Generate report
        logger.info(f"\n[6/6] Generating final report: {args.output}")
        report_gen = ReportGenerator(config=config)
        report_gen.create_report(
            data_summary=processor.get_summary(processed_data),
            statistics=stats_results,
            model_metrics=model_metrics,
            dashboard=dashboard,
            output_path=args.output
        )
        
        logger.info("=" * 80)
        logger.info(f"Analysis complete! Report saved to: {args.output}")
        logger.info("=" * 80)
        
        return 0
        
    except FileNotFoundError as e:
        logger.error(f"File not found: {e}")
        return 1
    except ValueError as e:
        logger.error(f"Invalid data or configuration: {e}")
        return 1
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return 1


def main():
    """Main entry point."""
    args = parse_arguments()
    
    # Create output directory if it doesn't exist
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Run async analysis
    exit_code = asyncio.run(run_analysis(args))
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
