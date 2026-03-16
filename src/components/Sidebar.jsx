import {
    LayoutDashboard,
    Wallet,
    PieChart,
    History,
    TrendingUp,
    PlusCircle,
    X,
    LogOut,
    Settings
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose, onLogout, onAddClick }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics', icon: PieChart },
        { id: 'expenses', label: 'History', icon: History },
        { id: 'investments', label: 'Investments', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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
                  style={{ marginBottom: '1rem' }}
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
}
