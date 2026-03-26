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
            <h3>Category Distribution</h3>
            <div className="chart-layout">
                <div className="chart-main">
                    <div className="donut-center">
                        <div className="donut-total">₹{stats.totalPeriodic.toLocaleString('en-IN')}</div>
                        <div className="donut-label">{viewMode === 'monthly' ? format(selectedDate, 'MMM') : format(selectedDate, 'yyyy')}</div>
                    </div>
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
                                >
                                    {chartData.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-legend">
                    {chartData.pieData.map((entry) => (
                        <div key={entry.name} className="legend-item">
                            <div className="legend-color" style={{ background: entry.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>{getCategoryDetails(entry.name).icon}</div>
                            <div className="legend-info">
                                <span className="legend-name">{entry.name}</span>
                                <span className="legend-percent">{((entry.value / (chartData.pieData.reduce((s,i)=>s+i.value,0)||1)) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="card chart-card glass">
            <h3>Recent Activity</h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
));

export default ChartsSection;
