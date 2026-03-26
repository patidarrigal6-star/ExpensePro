import React from 'react';
import { format, parseISO } from 'date-fns';

const RecentTransactionsTable = React.memo(({ filteredExpenses, getCategoryDetails, setActiveTab }) => (
    <div className="glass-card" style={{ gridColumn: 'span 2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Transactions</h3>
            <button className="btn-premium" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', padding: '0.5rem 1rem' }} onClick={() => setActiveTab('history')}>View All</button>
        </div>
        <div className="table-responsive">
            <table className="transaction-table">
                <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        <th style={{ paddingBottom: '1rem' }}>Date</th>
                        <th style={{ paddingBottom: '1rem' }}>Category</th>
                        <th style={{ paddingBottom: '1rem' }}>Amount</th>
                        <th style={{ paddingBottom: '1rem' }}>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.slice(0, 5).map(exp => (
                        <tr key={exp.id}>
                            <td className="transaction-cell" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{format(parseISO(exp.date), 'dd MMM')}</td>
                            <td className="transaction-cell">
                                <span className="badge" style={{ background: `${getCategoryDetails(exp.category).color}15`, color: getCategoryDetails(exp.category).color, fontWeight: 600 }}>
                                    {getCategoryDetails(exp.category).icon} {exp.category}
                                </span>
                            </td>
                            <td className="transaction-cell" style={{ fontWeight: 700 }}>₹{exp.amount.toLocaleString('en-IN')}</td>
                            <td className="transaction-cell text-muted" style={{ fontSize: '0.85rem' }}>{exp.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
));

export default RecentTransactionsTable;
