import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from './GenderDonutChart.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GenderDonutChartProps {
    maleCount: number;
    femaleCount: number;
}

const GenderDonutChart: React.FC<GenderDonutChartProps> = ({ maleCount, femaleCount }) => {
    const data = {
        labels: ['Male', 'Female'],
        datasets: [
            {
                data: [maleCount, femaleCount],

                backgroundColor: [
                    '#1b273d',
                    '#EA533c',
                ],
                hoverBackgroundColor: [
                    '#162033',
                    '#cc3e29',
                ],
                borderWidth: 1,
                borderColor: '#ffffff',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#666666',
                    font: {
                        size: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base')) * 16 // Use base font size
                    }
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((sum: number, current: number) => sum + current, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';
                        return `${label}: ${value} (${percentage})`;
                    },
                },
                backgroundColor: '#101d2c',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#cccccc',
                borderWidth: 1,
            },
        },
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Gender Distribution</h4>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default GenderDonutChart;