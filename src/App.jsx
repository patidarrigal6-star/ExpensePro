import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isAfter, isBefore, isSameDay, parseISO, subMonths } from 'date-fns';
import { 
      Plus, Search, Download, Filter, Menu, Wallet, 
      TrendingUp, TrendingDown, DollarSign, Calendar as CalendarIcon,
      ChevronLeft, ChevronRight, FileText, Settings as SettingsIcon, LogOut
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import AnalyticsSection from './components/AnalyticsSection';
import AddExpenseForm from './components/AddExpenseForm';
import ChartsSection from './components/ChartsSection';
import BudgetInsightSection from './components/BudgetInsightSection';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import SummaryCardsSection from './components/SummaryCardsSection';
import Login from './components/Login';
import { CATEGORIES, getCategoryDetails } from './utils/categories';

const API_URL = 'https://script.google.com/macros/s/AKfycby5X_xY-6m-qKqU_R6zR_N0m6X_X_X/exec';

function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      const [expenses, setExpenses] = useState([]);
      const [loading, setLoading] = useState(true);
      const [activeTab, setActiveTab] = useState('dashboard');
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [selectedDate, setSelectedDate] = useState(new Date());
      const [viewMode, setViewMode] = useState('monthly');
      const [searchQuery, setSearchQuery] = useState('');
      const [budget, setBudget] = useState(60000);
      const [showBudgetModal, setShowBudgetModal] = useState(false);
      const [budgetInputVal, setBudgetInputVal] = useState(60000);
      const [saveSuccess, setSaveSuccess] = useState(false);
      const [addFormDate, setAddFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
          fetchData();
  }, []);

  const fetchData = async () => {
          try {
                    setLoading(true);
                    const res = await fetch(API_URL);
                    const data = await res.json();
                    setExpenses(data);
          } catch (err) {
                    console.error('Fetch error:', err);
          } finally {
                    setLoading(false);
          }
  };

  const addExpense = async (e) => {
          e.preventDefault();
          const form = e.target;
          const formData = new FormData(form);
          const newEntry = {
                    date: formData.get('date'),
                    category: formData.get('category'),
                    amount: parseFloat(formData.get('amount')),
                    note: formData.get('note'),
          };

          setLoading(true);
          try {
                    await fetch(API_URL, {
                                method: 'POST',
                                mode: 'no-cors',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newEntry)
                    });
                    setExpenses([newEntry, ...expenses]);
                    setSaveSuccess(true);
          } catch (err) {
                    console.error('Post error:', err);
          } finally {
                    setLoading(false);
          }
  };

  const getMonthlyStats = (date) => {
          const monthStart = startOfMonth(date);
          const monthEnd = endOfMonth(date);
          const monthlyExpenses = expenses.filter(exp => {
                    const d = parseISO(exp.date);
                    return isSameMonth(d, date);
          });

          const total = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          const sipTotal = monthlyExpenses.filter(exp => exp.category === 'SIP Investment').reduce((sum, exp) => sum + exp.amount, 0);
          const regularTotal = total - sipTotal;

          return {
                    total,
                    sipTotal,
                    regularTotal,
                    remaining: budget - total,
                    budget
          };
  };

  const stats = useMemo(() => {
          const periodExpenses = expenses.filter(exp => {
                    const d = parseISO(exp.date);
                    if (viewMode === 'monthly') return isSameMonth(d, selectedDate);
                    return d.getFullYear() === selectedDate.getFullYear();
          });

                            const total = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          const sipTotal = periodExpenses.filter(exp => exp.category === 'SIP Investment').reduce((sum, exp) => sum + exp.amount, 0);
          const todayTotal = expenses.filter(exp => isSameDay(parseISO(exp.date), new Date())).reduce((sum, exp) => sum + exp.amount, 0);

                            const cats = {};
          periodExpenses.forEach(exp => {
                    cats[exp.category] = (cats[exp.category] || 0) + exp.amount;
          });

                            const sortedCats = Object.entries(cats).sort((a,b) => b[1] - a[1]);

                            return {
                                      totalPeriodic: total,
                                      sipTotal,
                                      todayTotal,
                                      remaining: budget - total,
                                      budget,
                                      dailyAverage: total / 30,
                                      highestCategory: sortedCats[0]?.[0] || 'N/A',
                                      highestAmount: sortedCats[0]?.[1] || 0
                            };
  }, [expenses, selectedDate, viewMode, budget]);

  if (!isLoggedIn) return <Login onLoginSuccess={(() => setIsLoggedIn(true))} />;

  return (
          <div className="app-container mesh-gradient">
            <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={sidebarOpen} 
        onClose={(() => setSidebarOpen(false))}
        onLogout={(() => setIsLoggedIn(false))}
        onAddClick={(() => setActiveTab('add'))}
      />

      <button className="mobile-toggle" onClick={(() => setSidebarOpen(true))}>
          <Menu size={24} />
                    </button>

{sidebarOpen && <div className="mobile-overlay" onClick={(() => setSidebarOpen(false))}></div>}

      <main className="main-content">
            <header className="page-header">
              <div className="header-info">
                <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p className="text-muted">Welcome back, Rigal Patidar</p>
          </div>

          <div className="header-actions">
                <div className="selector-group">
                  <select className="input compact" value={viewMode} onChange={((e) => setViewMode(e.target.value))}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <div className="date-display">
                                    <button className="nav-btn" onClick={(() => setSelectedDate(subMonths(selectedDate, 1)))}><ChevronLeft size={18}/>></button>
                <span className="current-date">{viewMode === 'monthly' ? format(selectedDate, 'MMM yyyy') : format(selectedDate, 'yyyy')}</span>
                <button className="nav-btn" onClick={(() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))))}><ChevronRight size={18}/>></button>
              </div>
            </div>
            <button className="btn btn-primary" onClick={(() => setActiveTab('add'))}>
              <Plus size={18} /> <span>New Entry</span>
            </button>
          </div>
        </header>

{activeTab === 'dashboard' && (
              <div className="dashboard-grid">
                <SummaryCardsSection stats={stats} currentMonthName={format(selectedDate, 'MMMM')} />
                                                                                        <BudgetInsightSection 
              stats={stats} 
              viewMode={viewMode} 
              setBudgetInputVal={setBudgetInputVal} 
              setShowBudgetModal={setShowBudgetModal} 
            />
                              <RecentTransactionsTable filteredExpenses={expenses} setActiveTab={setActiveTab} />
                            </div>
         )}
      </main>
    </div>
  );
}
export default App;
