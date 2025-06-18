import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend, LegendItem, TooltipItem, ChartType,
} from 'chart.js';
import styles from './MultiSeriesDoughnutChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MultiSeriesDoughnutChartProps {
    labels: string[];
    dataSeries: {
        label: string;
        counts: number[];
    }[];
    title?: string;
    showLegend?: boolean;
}

// Define the system color codes directly for chart use
const COLOR_PRIMARY = '#1b273d';
const COLOR_PRIMARY_HOVER = '#162031';
const COLOR_SECONDARY = '#EA533c';
const COLOR_SECONDARY_HOVER = '#d84a34';
const COLOR_PRIMARY_LIGHT = '#3a4a6d';
const COLOR_PRIMARY_LIGHTER = '#6173a1';
const COLOR_PRIMARY_DARK = '#121c29';
const COLOR_PRIMARY_DARKER = '#0b1420';
const COLOR_PRIMARY_ACCENT = '#4a7d2a';
const COLOR_SECONDARY_LIGHT = '#f6b5a8';
const COLOR_SECONDARY_DARK = '#b23f2c';
const COLOR_SUCCESS = '#28a745';
const COLOR_WARNING = '#ffc107';
const COLOR_ERROR = '#dc3545';
const COLOR_ERROR_HOVER = '#c82333';
const COLOR_WHITE = '#ffffff';
const COLOR_BACKGROUND_ACCENT = '#f5f8fa';
const COLOR_TEXT_SECONDARY = '#666666';
const COLOR_TEXT_PRIMARY = '#333333';
const COLOR_BORDER = '#CCCCCC';


const CHART_COLOR_PALETTE = [
    COLOR_PRIMARY,
    COLOR_SECONDARY,
    COLOR_PRIMARY_LIGHTER,
    COLOR_PRIMARY_ACCENT,
    COLOR_PRIMARY_LIGHT,
    COLOR_SECONDARY_DARK,
    COLOR_SUCCESS,
    COLOR_WARNING,
    COLOR_ERROR,
    COLOR_SECONDARY_LIGHT,
    COLOR_PRIMARY_DARK,
];

// Generate hover colors by explicitly using the hover variables or slightly darkening
const CHART_HOVER_COLOR_PALETTE = [
    COLOR_PRIMARY_HOVER,
    COLOR_SECONDARY_HOVER,
    `${COLOR_PRIMARY_LIGHTER}D0`,
    `${COLOR_PRIMARY_ACCENT}D0`,
    `${COLOR_PRIMARY_LIGHT}D0`,
    `${COLOR_SECONDARY_DARK}D0`,
    `${COLOR_SUCCESS}D0`,
    `${COLOR_WARNING}D0`,
    COLOR_ERROR_HOVER,
    `${COLOR_SECONDARY_LIGHT}D0`,
    COLOR_PRIMARY_DARKER,
];


const generateChartColors = (numColors: number): string[] => {
    return Array.from({ length: numColors }, (_, i) =>
        CHART_COLOR_PALETTE[i % CHART_COLOR_PALETTE.length]
    );
};

const generateChartHoverColors = (numColors: number): string[] => {
    return Array.from({ length: numColors }, (_, i) =>
        CHART_HOVER_COLOR_PALETTE[i % CHART_HOVER_COLOR_PALETTE.length]
    );
};

const MultiSeriesDoughnutChart: React.FC<MultiSeriesDoughnutChartProps> = ({
                                                                               labels,
                                                                               dataSeries,
                                                                               title = "Multi-Series Data Distribution",
                                                                               showLegend = true,
                                                                           }) => {
    // State to control which dataset is "active" (highlighted).
    // null means all are active.
    const [activeDataset, setActiveDataset] = useState<number | null>(null);

    const datasets = dataSeries.map((series, seriesIndex) => {
        // Determine if the current dataset should be highlighted or de-emphasized
        const isActive = activeDataset === null || activeDataset === seriesIndex;

        // Generate base colors for this series' segments
        const baseColors = generateChartColors(labels.length);
        const baseHoverColors = generateChartHoverColors(labels.length);

        return {
            label: series.label,
            data: series.counts,
            backgroundColor: baseColors.map(color =>
                isActive ? color : `${color}40` // Reduce opacity if not active
            ),
            hoverBackgroundColor: baseHoverColors, // Use distinct hover colors
            borderColor: COLOR_WHITE, // White border between segments
            borderWidth: 2, // Standard border width
            spacing: seriesIndex * 5, // Create concentric circles
            borderRadius: 5, // Rounded edges for segments
            // Chart.js handles opacity based on backgroundColor, no need for separate `opacity` prop here
        };
    });

    const chartData = {
        labels: labels,
        datasets: datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '45%', // Adjust the size of the inner hole
        plugins: {
            legend: {
                display: showLegend,
                position: 'bottom' as const,
                labels: {
                    color: COLOR_TEXT_PRIMARY, // Text color for legend labels
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                    boxWidth: 16,
                    padding: 16,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
                onClick: (
                    legendItem: LegendItem,
                ) => {
                    const index = legendItem.datasetIndex!;
                    setActiveDataset(activeDataset === index ? null : index);
                },
            },
            tooltip: {
                callbacks: {
                    title: function (context: TooltipItem<ChartType>[]) {
                        return context[0].dataset.label; // Show the series label (e.g., "Q1 Sales")
                    },
                    label: function (context: TooltipItem<ChartType>) {
                        const label = context.label || ''; // The segment label (e.g., "Product A")
                        const value = context.parsed as number; // The count for that segment
                        const datasetData = context.dataset.data as (number | null)[];
                        // Type-safe reduce with initial value
                        const total = datasetData.reduce<number>((sum, current) => sum + (current ?? 0), 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                        return `${label}: ${value} (${percentage})`;
                    }

                },
                backgroundColor: COLOR_PRIMARY_DARKER, // Tooltip background
                titleColor: COLOR_WHITE, // Tooltip title text
                bodyColor: COLOR_WHITE, // Tooltip body text
                borderColor: COLOR_BORDER, // Tooltip border
                borderWidth: 1,
                padding: 12,
                boxPadding: 8,
                displayColors: true, // Show color box in tooltip
                bodyFont: {
                    size: 13,
                    family: "'Inter', sans-serif",
                },
                titleFont: {
                    size: 14,
                    weight: 'bold',
                    family: "'Inter', sans-serif",
                },
                cornerRadius: 6, // Rounded corners for tooltip
            },
        },

    };

    // Calculate total values for each dataset for display in buttons/stats
    const datasetTotals = dataSeries.map(series =>
        series.counts.reduce((sum, count) => sum + count, 0)
    );

    const overallTotal = datasetTotals.reduce((a, b) => a + b, 0);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h4 className={styles.title}>{title}</h4>

                {/* Dataset selector buttons only visible if there's more than one series */}
                {dataSeries.length > 1 && (
                    <div className={styles.datasetSelector}>
                        {dataSeries.map((series, index) => (
                            <button
                                key={index}
                                className={`${styles.datasetButton} ${
                                    activeDataset === index || activeDataset === null
                                        ? styles.active
                                        : ''
                                }`}
                                onClick={() => setActiveDataset(activeDataset === index ? null : index)}
                                style={{
                                    backgroundColor: activeDataset === index || activeDataset === null
                                        ? CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length] // Active color from palette
                                        : COLOR_BACKGROUND_ACCENT, // Inactive button background
                                    color: activeDataset === index || activeDataset === null
                                        ? COLOR_WHITE // Active button text
                                        : COLOR_TEXT_SECONDARY // Inactive button text
                                }}
                            >
                                {series.label}
                                <span className={styles.datasetTotal}>
                                    {datasetTotals[index]}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.chartWrapper}>
                {/* @ts-expect-error TS2322: Ignore legend.onClick type mismatch */}
                <Doughnut data={chartData} options={options} />
            </div>

            {showLegend && dataSeries.length > 1 && (
                <div className={styles.datasetStats}>
                    {dataSeries.map((series, index) => (
                        <div
                            key={index}
                            className={`${styles.datasetStat} ${
                                activeDataset === index || activeDataset === null ? '' : styles.inactiveStat
                            }`}
                        >
                            <div
                                className={styles.statIndicator}
                                style={{
                                    backgroundColor: CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length],
                                    opacity: activeDataset === index || activeDataset === null ? 1 : 0.4
                                }}
                            />
                            <div className={styles.statLabel}>{series.label}</div>
                            <div className={styles.statValue}>{datasetTotals[index]}</div>
                            <div className={styles.statPercentage}>
                                {overallTotal > 0 ? Math.round((datasetTotals[index] / overallTotal) * 100) : 0}%
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSeriesDoughnutChart;