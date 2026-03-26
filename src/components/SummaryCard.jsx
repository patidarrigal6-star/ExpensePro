import React from 'react';

export const SummaryCard = React.memo(({ title, amount, icon: Icon, subtitle }) => {
    const isString = typeof amount === 'string';
    const formattedAmount = isString ? amount : `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <div className="glass-card summary-card">
            <div className="card-header">
                <div className="icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff' }}>
                    <Icon size={24} />
                </div>
                <div className="header-info">
                    <p className="card-label">{title}</p>
                    <h2 className="card-value">{formattedAmount}</h2>
                </div>
            </div>
            {subtitle && <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.7 }}>{subtitle}</p>}
        </div>
    );
});
