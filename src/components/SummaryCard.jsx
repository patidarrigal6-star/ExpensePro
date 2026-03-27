import React from 'react';

export const SummaryCard = React.memo(({ title, amount, icon: Icon, color, subtitle }) => {
        const isString = typeof amount === 'string';
        const formattedAmount = isString ? amount : `\u20B9${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

                                          return (
                                                      <div className="card summary-card glass">
                                                                  <div className="watermark">
                                                                                  <Icon size={80} />
                                                                  </div>div>
                                                                  <div className="card-header">
                                                                                  <div className="icon-wrapper" style={{ background: 'linear-gradient(135deg, #4f46e5, #9333ea)', color: '#ffffff', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                                                                                      <Icon size={24} />
                                                                                  </div>div>
                                                                                  <div className="header-info">
                                                                                                      <p className="card-subtitle">{title}</p>p>
                                                                                                      <h2 className="card-title">{formattedAmount}</h2>h2>
                                                                                  </div>div>
                                                                  </div>div>
                                                          {subtitle && <p className="card-footer-text">{subtitle}</p>p>}
                                                      </div>div>
                                                  );
});
</div>
