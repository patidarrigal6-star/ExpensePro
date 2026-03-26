import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const BudgetInsightSection = React.memo(({ stats, viewMode, currentMonthKey, setBudgetInputVal, setShowBudgetModal }) => (
      <div className="budget-section span-2">
        <div className="card insight-card glass" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-header-flex mb-4">
                <h3 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
{viewMode === 'monthly' ? "Monthly Budget" : "Yearly Budget"}
{viewMode === 'monthly' && (
                          <button
                              onClick={() => {
                                  setBudgetInputVal(stats.budget);
                                  setShowBudgetModal(true);
}}
                            className="btn btn-icon-sm"
                            style={{ marginLeft: '10px', height: '24px', width: '24px', padding: 0 }}
                            title="Change Budget"
                        >
                            [Edit]
                        </button>
                    )}
                </h3>
            </div>

            <div style={{ position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 100 100" style={{ width: '160px', height: '160px', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke={stats.remaining < 0 ? '#ef4444' : '#6366f1'}
                        strokeWidth="8"
                        strokeDasharray={`${Math.min(100, (stats.totalPeriodic / stats.budget) * 100) * 2.827} 282.7`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)' }}>
{Math.round((stats.totalPeriodic / stats.budget) * 100)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Used</div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', padding: '0 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Used</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>RS{stats.totalPeriodic.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Remaining</span>
                    <span style={{ fontWeight: 700, color: stats.remaining < 0 ? '#ef4444' : '#10b981' }}>RS{Math.abs(stats.remaining).toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    </div>
));

export default BudgetInsightSection;
