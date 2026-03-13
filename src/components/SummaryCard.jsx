import React from 'react';

export function SummaryCard({ title, amount, icon: Icon, color, subtitle }) {
    const isString = typeof amount === 'string';
    const formattedAmount = isString ? amount : `Rs. ${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  return (
        <div className="card summary-card glass">
              <div className="watermark">
                      <Icon size={80} />
              </div>div>
              <div className="card-header">
                      <div className="icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
                                <Icon size={24} />
                      </div>div>
                      <div className="header-info">
                                <p className="card-subtitle">{title}</p>p>
                                <h2 className="card-title">{formattedAmount}</h2>h2>
                      </div>div>
              </div>div>
          {subtitle && <p className="card-footer-text">{subtitle}</p>p>}
              <style jsx>{`
                      .summary-card { position: relative; overflow: hidden; padding: 1.5rem; }
                              .card-header { display: flex; align-items: center; gap: 1rem; }
                                    `}</style>style>
        </div>div>
      );
}
</div>
