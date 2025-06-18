import React, {useEffect, useMemo, useState} from 'react';
import {Range, TimeRangeRequest, UserGrowthDto} from '@/types/dashboard';
import styles from './UserGrowthChart.module.css';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    TooltipItem,
} from 'chart.js';
import useDashboardApi from "@/api/hooks/useDashboardApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {Line} from "react-chartjs-2";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface UserGrowthChartProps {
    forceRefresh?: boolean;
    setForceRefresh: (value: boolean) => void;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({forceRefresh,setForceRefresh}) => {
    const {getUserGrowth} = useDashboardApi();
    const [timeRange, setTimeRange] = useState<Range>(Range.LAST_90D);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [userGrowth, setUserGrowth] = useState<UserGrowthDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserGrowth = async (forceRefresh: boolean = false) => {
        setLoading(true);
        try {
            const timeRangeRequest: TimeRangeRequest = {
                range: timeRange,
                ...(timeRange === Range.CUSTOM && startDate && endDate
                    ? {startDate, endDate}
                    : {}),
            };

            const response = await getUserGrowth(timeRangeRequest, forceRefresh);
            if (response?.data?.userGrowth) {
                setUserGrowth(response.data.userGrowth);
            } else {
                console.warn("User growth data not available in response");
            }
        } catch (err) {
            console.error(extractErrorMessage(err, "Error fetching user growth"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeRange !== Range.CUSTOM || (startDate && endDate)) {
            void fetchUserGrowth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRange, startDate, endDate]);

    useEffect(() => {
        if (forceRefresh) {
            void fetchUserGrowth(true).finally(() => {
                setForceRefresh(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [forceRefresh, setForceRefresh]);

    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRange = e.target.value as Range;
        setTimeRange(newRange);
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
    };


    // Prepare data for Chart.js
    const chartData = useMemo(() => {
        if (!userGrowth || !userGrowth.timeline || userGrowth.timeline.length === 0) {
            return {
                labels: [],
                datasets: [],
            };
        }

        const labels = userGrowth.timeline.map(entry => entry.date);
        const dataPoints = userGrowth.timeline.map(entry => entry.count);

        return {
            labels,
            datasets: [
                {
                    label: 'New Users',
                    data: dataPoints,
                    borderColor: '#1b273d',
                    backgroundColor: 'rgba(27, 39, 61, 0.2)',
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#EA533c',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                },
            ],
        };
    }, [userGrowth]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#333333',
                    font: {
                        size: 14,
                    }
                }
            },
            title: {
                display: true,
                text: `User Growth Over Time (${userGrowth?.comparisonPeriod})`,
                color: '#1b273d',
                font: {
                    size: 18,
                    weight: 'bold' as const,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<'line'>) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat().format(context.parsed.y) + ' users';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false // Hide x-axis grid lines
                },
                ticks: {
                    color: '#666666',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#CCCCCC',
                },
                ticks: {
                    color: '#666666',
                    font: {
                        size: 12
                    }
                }
            }
        },
    }), [userGrowth]);


    return (
        <div className={styles.chartContainer}>
            {loading ? (
                <div>
                    <div className={styles.spinnerWrapper}>
                        <SpinLoading />
                        <p>Loading user growth data...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.chartHeaderWrapper}>
                        <h3 className={styles.chartTitle}>User Growth</h3>
                        <div className={styles.controlsWrapper}>

                            <div className={styles.timeRangeSelector}>
                                <label htmlFor="timeRange">User Growth Range:</label>
                                <select id="timeRange" value={timeRange} onChange={handleTimeRangeChange}
                                        className={styles.selectInput}>
                                    <option value={Range.LAST_24H}>Last 24 Hours</option>
                                    <option value={Range.LAST_7D}>Last 7 Days</option>
                                    <option value={Range.LAST_30D}>Last 30 Days</option>
                                    <option value={Range.LAST_90D}>Last 90 Days</option>
                                    <option value={Range.CUSTOM}>Custom Range</option>
                                </select>
                            </div>
                            {timeRange === Range.CUSTOM && (
                                <div className={styles.customDateInputs}>
                                    <input
                                        type="date"
                                        value={startDate || ''}
                                        onChange={handleStartDateChange}
                                        className={styles.dateInput}
                                        max={
                                            endDate
                                                ? new Date(new Date(endDate).getTime() - 86400000) // endDate - 1 day
                                                    .toISOString()
                                                    .split('T')[0]
                                                : new Date().toISOString().split('T')[0]
                                        }
                                    />
                                    <input
                                        type="date"
                                        value={endDate || ''}
                                        onChange={handleEndDateChange}
                                        className={styles.dateInput}
                                        min={
                                            startDate
                                                ? new Date(new Date(startDate).getTime() + 86400000)
                                                    .toISOString()
                                                    .split('T')[0]
                                                : undefined
                                        }
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.actualChartWrapper}>
                        {chartData.datasets.length > 0 && chartData.datasets[0].data.length > 0 ? (
                            <Line data={chartData} options={chartOptions}/>
                        ) : (
                            <p className={styles.noDataMessage}>No user growth data available for the selected period.</p>
                        )}
                    </div>
                    {userGrowth && (
                        <>
                            <p className={styles.chartSummary}>
                                Percentage Change:{' '}
                                <span style={{ color: userGrowth.percentageChange >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {userGrowth.percentageChange.toFixed(2)}%
                        </span>
                            </p>
                            <p className={styles.lastUpdated}>Last Updated: {userGrowth.lastUpdated}</p>
                        </>
                    )}
                </>
            )}

        </div>
    );
};

export default UserGrowthChart;