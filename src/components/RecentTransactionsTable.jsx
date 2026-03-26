import React from 'react';
import { format, parseISO } from 'date-fns';
import { getCategoryDetails } from '../utils/categories';

const RecentTransactionsTable = React.memo(({ filteredExpenses, setActiveTab }) => (
    <div className="recent-section span-2">
        <div className="card table-card glass">
            <div className="card-header-flex">
                <h3>Recent Transactions</h3>
                <button className="btn btn-accent" onClick={() => setActiveTab('expenses')}>View All</button>
            </div>
            <div className="table-responsive">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.slice(0, 5).map(exp => (
                            <tr key={exp.id}>
                                <td>{format(parseISO(exp.date), 'dd MMM')}</td>
                                <td><span className="badge" style={{ background: `${getCategoryDetails(exp.category).color}15`, color: getCategoryDetails(exp.category).color, borderColor: `${getCategoryDetails(exp.category).color}30` }}>{getCategoryDetails(exp.category).icon} {exp.category}</span></td>
                                <td className="amount-cell">₹{exp.amount.toLocaleString('en-IN')}</td>
                                <td className="note-cell">{exp.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
));

export default RecentTransactionsTable;
