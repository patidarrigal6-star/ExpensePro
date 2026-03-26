import React from 'react';
import {
      AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
      PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const AnalyticsSection = React.memo(({ chartData }) => (
      <div className="analytics-view dashboard-grid">
        <div className="card chart-card span-4">
            <h3>Monthly Spending Trend</h3>
            <div className="chart-container" style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.barData}>
                        <defs>
                            <linearGradient id="colorAmountMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} />
                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmountMain)" strokeWidth={3} activeDot={{ r: 8, filter: 'url(#glowLine)', fill: '#9333ea', strokeWidth: 0 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="card chart-card span-2">
            <h3>Category Breakdown</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData.pieData}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

        <div className="card chart-card span-2">
            <h3>Spend Analysis</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.pieData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="barGradientSide" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#9333ea" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                        <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar dataKey="value" fill="url(#barGradientSide)" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
));

export default AnalyticsSection;
