import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
} from 'chart.js';
import styles from './BarChart.module.css';

// Register necessary Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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
const COLOR_SECONDARY_DARK = '#b23f2c';
const COLOR_SUCCESS = '#28a745';
const COLOR_WARNING = '#ffc107';
const COLOR_ERROR = '#dc3545';
const COLOR_ERROR_HOVER = '#c82333';
const COLOR_WHITE = '#ffffff';
const COLOR_TEXT_PRIMARY = '#333333';
const COLOR_TEXT_SECONDARY = '#666666';
const COLOR_BORDER = '#CCCCCC';

// Palette for bar colors - ensuring enough variety and using system colors
const BAR_COLOR_PALETTE = [
    COLOR_PRIMARY,
    COLOR_SECONDARY,
    COLOR_SUCCESS,
    COLOR_WARNING,
    COLOR_ERROR,
    COLOR_PRIMARY_LIGHTER,
    COLOR_PRIMARY_ACCENT,
    COLOR_SECONDARY_DARK,
    COLOR_PRIMARY_LIGHT,
    COLOR_PRIMARY_DARK,
];

const BAR_HOVER_COLOR_PALETTE = [
    COLOR_PRIMARY_HOVER,
    COLOR_SECONDARY_HOVER,
    `${COLOR_SUCCESS}D0`, // Lighter shades often look good with simple transparency for hover
    `${COLOR_WARNING}D0`,
    COLOR_ERROR_HOVER,
    `${COLOR_PRIMARY_LIGHTER}D0`,
    `${COLOR_PRIMARY_ACCENT}D0`,
    `${COLOR_SECONDARY_DARK}D0`,
    `${COLOR_PRIMARY_LIGHT}D0`,
    COLOR_PRIMARY_DARKER,
];

interface BarChartProps {
    dataObject: { [key: string]: number };
    title?: string;
    orientation?: 'vertical' | 'horizontal';
}

const BarChart: React.FC<BarChartProps> = ({
                                               dataObject,
                                               title = 'Data Distribution Bar Chart',
                                               orientation = 'vertical',
                                           }) => {
    // Extract labels (keys) and data values
    const labels = Object.keys(dataObject);
    const dataValues = Object.values(dataObject);

    // Generate colors for each bar based on the number of labels
    const backgroundColors = labels.map((_, i) => BAR_COLOR_PALETTE[i % BAR_COLOR_PALETTE.length]);
    const hoverBackgroundColors = labels.map((_, i) => BAR_HOVER_COLOR_PALETTE[i % BAR_HOVER_COLOR_PALETTE.length]);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Count',
                data: dataValues,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverBackgroundColors,
                borderColor: COLOR_WHITE,
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: orientation === 'horizontal' ? 'y' as const : 'x' as const,
        elements: {
            bar: {
                borderSkipped: false,
            },
        },
        plugins: {
            title: {
                display: true,
                text: title,
                color: COLOR_TEXT_PRIMARY,
                font: {
                    size: 18,
                    weight: 'bold',
                    family: "'Inter', sans-serif",
                },
            },
            legend: {
                display: false,
                labels: {
                    color: COLOR_TEXT_PRIMARY,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif",
                    },
                },
            },
            tooltip: {
                callbacks: {
                    // *** IMPORTANT CHANGE HERE ***
                    label: function (context: TooltipItem<'bar'>) {
                        const label = context.label || '';
                        const value = context.raw as number;
                        return `${label}: ${value}`;
                    },
                },
                backgroundColor: COLOR_PRIMARY_DARKER,
                titleColor: COLOR_WHITE,
                bodyColor: COLOR_WHITE,
                borderColor: COLOR_BORDER,
                borderWidth: 1,
                padding: 12,
                bodyFont: {
                    size: 13,
                    family: "'Inter', sans-serif",
                },
                titleFont: {
                    size: 14,
                    weight: 'bold',
                    family: "'Inter', sans-serif",
                },
                cornerRadius: 6,
            },
        },
        scales: {
            x: {
                title: {
                    display: orientation === 'vertical',
                    text: 'Category',
                    color: COLOR_TEXT_SECONDARY,
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: "'Inter', sans-serif",
                    },
                },
                ticks: {
                    color: COLOR_TEXT_SECONDARY,
                    font: {
                        family: "'Inter', sans-serif",
                    }
                },
                grid: {
                    color: `${COLOR_BORDER}80`,
                },
            },
            y: {
                title: {
                    display: orientation === 'horizontal',
                    text: 'Count',
                    color: COLOR_TEXT_SECONDARY,
                    font: {
                        size: 14,
                        weight: 'bold',
                        family: "'Inter', sans-serif",
                    },
                },
                ticks: {
                    color: COLOR_TEXT_SECONDARY,
                    font: {
                        family: "'Inter', sans-serif",
                    }
                },
                grid: {
                    color: `${COLOR_BORDER}80`,
                },
            },
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart',
        },
    };

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartWrapper}>
                {/* @ts-expect-error TS2322: Ignore legend.onClick type mismatch */}
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default BarChart;