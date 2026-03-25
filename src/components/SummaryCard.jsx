import React from 'react';

export function SummaryCard({ title, amount, icon: Icon, color, subtitle }) {
    const isString = typeof amount === 'string';
    const formattedAmount = isString ? amount : `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

    return (
        <div className="card summary-card glass">
            <div className="watermark">
                <Icon size={80} />
            </div>
            <div className="card-header">
                <div className="icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
                    <Icon size={24} />
                </div>
                <div className="header-info">
                    <p className="card-subtitle">{title}</p>
                    <h2 className="card-title">{formattedAmount}</h2>
                </div>
            </div>
            {subtitle && <p className="card-footer-text">{subtitle}</p>}
        </div>
    );
}
export default SummaryCard;