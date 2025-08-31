"use client";

import React from 'react';

interface ChartData {
    label: string;
    value: number;
    color?: string;
}

interface SimpleChartProps {
    data: ChartData[];
    type: 'bar' | 'line' | 'pie';
    width?: number;
    height?: number;
    title?: string;
}

export default function SimpleChart({ data, type, width = 400, height = 300, title }: SimpleChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue;

    const defaultColors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];

    const renderBarChart = () => {
        const barWidth = width / data.length * 0.8;
        const barSpacing = width / data.length * 0.2;
        const chartHeight = height - 60; // Space for labels

        return (
            <svg width={width} height={height} className="w-full h-full">
                {title && (
                    <text x={width / 2} y={20} textAnchor="middle" className="text-sm font-medium fill-gray-700">
                        {title}
                    </text>
                )}

                {/* Y-axis labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <g key={i}>
                        <line
                            x1={40}
                            y1={40 + (chartHeight * ratio)}
                            x2={width - 20}
                            y2={40 + (chartHeight * ratio)}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                        />
                        <text
                            x={35}
                            y={45 + (chartHeight * ratio)}
                            textAnchor="end"
                            className="text-xs fill-gray-500"
                        >
                            {Math.round(minValue + (range * ratio))}
                        </text>
                    </g>
                ))}

                {/* Bars */}
                {data.map((item, index) => {
                    const barHeight = range > 0 ? ((item.value - minValue) / range) * chartHeight : 0;
                    const x = 40 + index * (barWidth + barSpacing);
                    const y = 40 + chartHeight - barHeight;
                    const color = item.color || defaultColors[index % defaultColors.length];

                    return (
                        <g key={index}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={color}
                                rx="2"
                                className="hover:opacity-80 transition-opacity"
                            />
                            <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                className="text-xs font-medium fill-gray-700"
                            >
                                {item.value}
                            </text>
                            <text
                                x={x + barWidth / 2}
                                y={height - 10}
                                textAnchor="middle"
                                className="text-xs fill-gray-600"
                            >
                                {item.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    const renderLineChart = () => {
        const chartWidth = width - 80;
        const chartHeight = height - 80;
        const pointRadius = 4;

        const points = data.map((item, index) => {
            const x = 40 + (index / (data.length - 1)) * chartWidth;
            const y = 40 + chartHeight - ((item.value - minValue) / range) * chartHeight;
            return { x, y, value: item.value, label: item.label };
        });

        const pathData = points.map((point, index) => {
            return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="w-full h-full">
                {title && (
                    <text x={width / 2} y={20} textAnchor="middle" className="text-sm font-medium fill-gray-700">
                        {title}
                    </text>
                )}

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                    <g key={i}>
                        <line
                            x1={40}
                            y1={40 + (chartHeight * ratio)}
                            x2={width - 40}
                            y2={40 + (chartHeight * ratio)}
                            stroke="#E5E7EB"
                            strokeWidth="1"
                        />
                        <text
                            x={35}
                            y={45 + (chartHeight * ratio)}
                            textAnchor="end"
                            className="text-xs fill-gray-500"
                        >
                            {Math.round(minValue + (range * ratio))}
                        </text>
                    </g>
                ))}

                {/* Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    className="transition-all duration-300"
                />

                {/* Points */}
                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r={pointRadius}
                            fill="#3B82F6"
                            className="hover:r-6 transition-all duration-200"
                        />
                        <text
                            x={point.x}
                            y={point.y - 10}
                            textAnchor="middle"
                            className="text-xs font-medium fill-gray-700"
                        >
                            {point.value}
                        </text>
                        <text
                            x={point.x}
                            y={height - 20}
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                        >
                            {point.label}
                        </text>
                    </g>
                ))}
            </svg>
        );
    };

    const renderPieChart = () => {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;

        let currentAngle = -Math.PI / 2; // Start from top
        const total = data.reduce((sum, item) => sum + item.value, 0);

        return (
            <svg width={width} height={height} className="w-full h-full">
                {title && (
                    <text x={width / 2} y={20} textAnchor="middle" className="text-sm font-medium fill-gray-700">
                        {title}
                    </text>
                )}

                {/* Pie slices */}
                {data.map((item, index) => {
                    const sliceAngle = (item.value / total) * 2 * Math.PI;
                    const endAngle = currentAngle + sliceAngle;
                    const color = item.color || defaultColors[index % defaultColors.length];

                    // Calculate arc path
                    const x1 = centerX + radius * Math.cos(currentAngle);
                    const y1 = centerY + radius * Math.sin(currentAngle);
                    const x2 = centerX + radius * Math.cos(endAngle);
                    const y2 = centerY + radius * Math.sin(endAngle);

                    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

                    const pathData = [
                        `M ${centerX} ${centerY}`,
                        `L ${x1} ${y1}`,
                        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                        'Z'
                    ].join(' ');

                    // Calculate label position
                    const labelAngle = currentAngle + sliceAngle / 2;
                    const labelRadius = radius * 0.7;
                    const labelX = centerX + labelRadius * Math.cos(labelAngle);
                    const labelY = centerY + labelRadius * Math.sin(labelAngle);

                    currentAngle = endAngle;

                    return (
                        <g key={index}>
                            <path
                                d={pathData}
                                fill={color}
                                className="hover:opacity-80 transition-opacity"
                            />
                            <text
                                x={labelX}
                                y={labelY}
                                textAnchor="middle"
                                className="text-xs font-medium fill-white"
                                dominantBaseline="middle"
                            >
                                {Math.round((item.value / total) * 100)}%
                            </text>
                        </g>
                    );
                })}

                {/* Legend */}
                <g transform={`translate(0, ${height - 60})`}>
                    {data.map((item, index) => {
                        const color = item.color || defaultColors[index % defaultColors.length];
                        const legendX = 20 + (index % 3) * 120;
                        const legendY = Math.floor(index / 3) * 20;

                        return (
                            <g key={index}>
                                <rect
                                    x={legendX}
                                    y={legendY}
                                    width={12}
                                    height={12}
                                    fill={color}
                                    rx="2"
                                />
                                <text
                                    x={legendX + 18}
                                    y={legendY + 9}
                                    className="text-xs fill-gray-700"
                                >
                                    {item.label}: {item.value}
                                </text>
                            </g>
                        );
                    })}
                </g>
            </svg>
        );
    };

    const renderChart = () => {
        switch (type) {
            case 'bar':
                return renderBarChart();
            case 'line':
                return renderLineChart();
            case 'pie':
                return renderPieChart();
            default:
                return renderBarChart();
        }
    };

    return (
        <div className="w-full h-full">
            {renderChart()}
        </div>
    );
}