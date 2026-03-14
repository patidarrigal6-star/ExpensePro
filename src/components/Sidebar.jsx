import React from 'react';
import { LayoutDashboard, Wallet, Settings, PieChart, History, TrendingUp, PlusCircle, Menu, X } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab }) {
    const [isOpen, setIsOpen] = React.useState(

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'expenses', label: 'Recent Expenses', icon: History },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
      ];

  return (
        <>
              <button className="mobile-toggle btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                      <div className="sidebar-header">
                                <div className="logo-container">
                                            <Wallet className="logo-icon" />
                                            <span className="logo-text">ExpensePro</span>span>
                                </div>div>
                      </div>div>
                      <nav className="sidebar-nav">
                        {menuItems.map((item) => (
                      <button
                                      key={item.id}
                                      onClick={() => {
                                                        setActiveTab(item.id);
                                                        setIsOpen(false);
                                      }}
                                      className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>span>
                      </button>button>
                    ))}
                      </nav>nav>
                      <div className="sidebar-footer">
                                <button className="btn btn-primary add-btn" onClick={() => setActiveTab('add')}>
                                            <PlusCircle size={20} />
                                            <span>Add Expense</span>span>
                                </button>button>
                      </div>div>
              </div>div>
              <style jsx>{`
                      .sidebar {
                                width: var(--sidebar-width);
                                          height: 100vh;
                                                    background: var(--surface);
                                                              border-right: 1px solid var(--border);
                                                                        display: flex;
                                                                                  flex-direction: column;
                                                                                          }
                                                                                                  .nav-item {
                                                                                                            display: flex;
                                                                                                                      align-items: center;
                                                                                                                                gap: 1rem;
                                                                                                                                          padding: 1rem;
                                                                                                                                                    border: none;
                                                                                                                                                              background: transparent;
                                                                                                                                                                        cursor: pointer;
                                                                                                                                                                                }
                                                                                                                                                                                        .nav-item.active {
                                                                                                                                                                                                  background: var(--accent-soft);
                                                                                                                                                                                                            color: var(--accent);
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                          `}</style>style>
        </>>
      );
}
</>
