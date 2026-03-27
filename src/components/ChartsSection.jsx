import React from 'react';
import { format } from 'date-fns';
import {
        PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
        BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { getCategoryDetails } from '../utils/categories';

const ChartsSection = React.memo(({ chartData, stats, viewMode, selectedDate }) => (
        <div className="analytics-section">
                <div className="card chart-card glass">
                            <h3>Category Distribution</h3>h3>
                            <div className="chart-layout">
                                            <div className="chart-main">
                                                                <div className="donut-center">
                                                                                        <div className="donut-total">\u20B9{stats.totalPeriodic.toLocaleString('en-IN')}</div>div>
                                                                                        <div className="donut-label">{viewMode === 'monthly' ? format(selectedDate, 'MMM') : format(selectedDate, 'yyyy')}</div>div>
                                                                </div>div>
                                                                <div className="chart-container">
                                                                                        <ResponsiveContainer width="100%" height={260}>
                                                                                                                    <PieChart>
                                                                                                                                                    <Pie
                                                                                                                                                                                            data={chartData.pieData}
                                                                                                                                                                                            innerRadius={65}
                                                                                                                                                                                            outerRadius={80}
                                                                                                                                                                                            paddingAngle={3}
                                                                                                                                                                                            dataKey="value"
                                                                                                                                                                                            stroke="none"
                                                                                                                                                                                            animationDuration={1500}
                                                                                                                                                                                            animationBegin={200}
                                                                                                                                                                                        >
                                                                                                                                                        {chartData.pieData.map((entry, index) => (
                                                                                                                                                                                                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                                                                                                                                                                                                ))}
                                                                                                                                                        </Pie>Pie>
                                                                                                                                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                                                                                                                        </PieChart>PieChart>
                                                                                            </ResponsiveContainer>ResponsiveContainer>
                                                                </div>div>
                                            </div>div>
                                            <div className="chart-legend">
                                                {chartData.pieData.map((entry) => {
                                    const chartTotal = chartData.pieData.reduce((sum, item) => sum + item.value, 0);
                                    const percent = chartTotal > 0 ? ((entry.value / chartTotal) * 100).toFixed(0) : 0;
                                    return (
                                                                    <div key={entry.name} className="legend-item">
                                                                                                    <div className="legend-color" style={{ background: entry.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                                                                                        {getCategoryDetails(entry.name).icon}
                                                                                                        </div>div>
                                                                                                    <div className="legend-info">
                                                                                                                                        <span className="legend-name">{entry.name}</span>span>
                                                                                                                                        <span className="legend-percent">{percent}%</span>span>
                                                                                                        </div>div>
                                                                    </div>div>
                                                                );
        })}
                                            </div>div>
                            </div>div>
                </div>div>
        
                <div className="card chart-card glass">
                            <h3>Recent Activity</h3>h3>
                            <div className="chart-container">
                                            <ResponsiveContainer width="100%" height={260}>
                                                                <BarChart data={chartData.barData}>
                                                                                        <defs>
                                                                                                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                                                                                                                    <stop offset="0%" stopColor="#9333ea" stopOpacity={1} />
                                                                                                                                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
                                                                                                                        </linearGradient>linearGradient>
                                                                                                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                                                                                                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                                                                                                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                                                                                        </filter>filter>
                                                                                            </defs>defs>
                                                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                                                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                                                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                                                                                        <Tooltip
                                                                                                                        contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }}
                                                                                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                                                                                    />
                                                                                        <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={24} activeBar={{ filter: 'url(#glow)', fill: 'url(#barGradient)' }} />
                                                                </BarChart>BarChart>
                                            </ResponsiveContainer>ResponsiveContainer>
                            </div>div>
                </div>div>
        </div>div>
    ));

export default ChartsSection;</div>
