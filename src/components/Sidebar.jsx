import React from 'react';
import {
            LayoutDashboard,
            Wallet,
            PieChart,
            History,
            TrendingUp,
            ShoppingCart,
            PlusCircle,
            X,
            Plus,
            CreditCard,
            Settings,
            LogOut
} from 'lucide-react';

const Sidebar = React.memo(({ activeTab, setActiveTab, isOpen, onClose, onLogout, onAddClick }) => {
            const menuItems = [
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'history', label: 'History', icon: History },
                    { id: 'analytics', label: 'Analytics', icon: PieChart },
                    { id: 'investments', label: 'Investments', icon: TrendingUp },
                    { id: 'settings', label: 'Settings', icon: Settings },
                        ];

                               return (
                                               <div className={`sidebar glass ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <Wallet className="logo-icon" />
                    <span className="logo-text">ExpensePro</span>
                </div>
                <button className="mobile-close-btn" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-nav">
{menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                                                    setActiveTab(item.id);
                                                                    onClose();
                                }}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="btn btn-primary add-btn"
                    onClick={() => {
                                                    onAddClick();
                                                    onClose();
                    }}
                    style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, #4f46e5, #9333ea)', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)', border: 'none' }}
                >
                    <PlusCircle size={20} />
                    <span>Add Expense</span>
                </button>

                <button
                    className="nav-item logout-btn"
                    onClick={onLogout}
                    style={{ border: 'none', background: 'transparent', width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
});

export default Sidebar;
