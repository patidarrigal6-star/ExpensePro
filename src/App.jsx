import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, 
  Settings, Plus, LogOut, ChevronRight, Filter, Search, 
  Calendar, CreditCard, ShoppingCart, Home, Info, AlertCircle,
  Lightbulb, Activity
} from 'lucide-react';
import { 
  format, 
  isToday, 
  startOfMonth, 
  startOfYear, 
  subMonths, 
  startOfDay, 
  parseISO, 
  getDaysInMonth, 
  isSameMonth, 
  isSameYear,
  differenceInDays,
  endOfMonth,
  subDays,
  isSameDay,
  eachDayOfInterval,
  endOfYear,
  eachMonthOfInterval
} from 'date-fns';
import Sidebar from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import Login from './components/Login';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  LineChart, Line, AreaChart, Area
} from 'recharts';

const CATEGORIES = [
  'Daily Expenses',
  'Extra Expenses',
  'Petrol',
  'Fixed Expenses',
  'Viha Expenses',
  'SIP Investment'
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const API_URL = 'https://script.google.com/macros/s/AKfycbz-q1728GPVjcLQxejyXib1TGDhpqz-PBJubpTkCzbUtaTwsMTUL7XVBN6GEtkz0aUy/exec';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyBudgets, setMonthlyBudgets] = useLocalStorage('expensePro_monthlyBudgets', { default: 50000 });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterDate, setFilterDate] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('expensePro_isLoggedIn', false);
  const [showAddModal, setShowAddModal] = useState(false); // Assuming this state is needed for the Sidebar prop
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      // Map Google Sheet columns to internal format
      // Headers: Timestamp, Month, Category, Amount, Discerption
      const mappedData = data
        .filter(item => item.Category && item.Amount) // Skip empty rows
        .map((item, index) => ({
          id: index,
          date: item.Timestamp ? format(new Date(item.Timestamp), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
          category: item.Category,
          amount: Number(item.Amount),
          note: item.Discerption || ''
        })).reverse(); // Newest first

      setExpenses(mappedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle Quick Entry via URL parameter (?add=true or ?mode=quick)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('mode') === 'quick') {
      setIsQuickMode(true);
      setActiveTab('add');
      return;
    }

    if (params.get('add') === 'true' && isLoggedIn) {
      setActiveTab('add');
      // Clear the param to avoid redirecting again on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isLoggedIn]);

  const updateBudget = (monthKey, value) => {
    setMonthlyBudgets(prev => ({
      ...prev,
      [monthKey]: Number(value)
    }));
  };

  const updateDefaultBudget = (value) => {
    setMonthlyBudgets(prev => ({
      ...prev,
      default: Number(value)
    }));
  };

  const currentMonthKey = format(selectedDate || new Date(), 'yyyy-MM');
  const budgetObj = monthlyBudgets || { default: 50000 };
  const currentBudget = budgetObj[currentMonthKey] || budgetObj.default || 50000;

  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      options.push(subMonths(new Date(), i));
    }
    return options;
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const periodStart = startOfMonth(selectedDate);
    const yearStart = startOfYear(selectedDate);
    const lastMonthStart = startOfMonth(subMonths(selectedDate, 1));
    const lastYearStart = startOfYear(subMonths(selectedDate, 12));

    let totalPeriodic = 0;
    let todayTotal = 0;
    let sipTotal = 0;
    let lastPeriodTotal = 0;

    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      const isInMonth = startOfMonth(expDate).getTime() === periodStart.getTime();
      const isInYear = startOfYear(expDate).getTime() === yearStart.getTime();
      const isInPeriod = viewMode === 'monthly' ? isInMonth : isInYear;

      const isInLastMonth = startOfMonth(expDate).getTime() === lastMonthStart.getTime();
      const isInLastYear = startOfYear(expDate).getTime() === lastYearStart.getTime();
      const isInLastPeriod = viewMode === 'monthly' ? isInLastMonth : isInLastYear;

      if (isInPeriod) {
        if (exp.category !== 'SIP Investment') totalPeriodic += exp.amount;
        if (exp.category === 'SIP Investment') sipTotal += exp.amount;
      }

      if (isInLastPeriod && exp.category !== 'SIP Investment') {
        lastPeriodTotal += exp.amount;
      }

      if (isToday(expDate)) {
        todayTotal += exp.amount;
      }
    });

    const categoryTotals = {};
    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      const isInMonth = startOfMonth(expDate).getTime() === periodStart.getTime();
      const isInYear = startOfYear(expDate).getTime() === yearStart.getTime();
      const isInPeriod = viewMode === 'monthly' ? isInMonth : isInYear;

      if (isInPeriod && exp.category !== 'SIP Investment') {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });

    let highestCategory = 'None';
    let highestAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmount) {
        highestAmount = amt;
        highestCategory = cat;
      }
    });

    // Daily Average
    let daysPassed = 1;
    if (viewMode === 'monthly') {
      daysPassed = isSameMonth(selectedDate, now) ? now.getDate() : getDaysInMonth(selectedDate);
    } else {
      daysPassed = isSameYear(selectedDate, now) ? differenceInDays(now, yearStart) + 1 : 365;
    }
    const dailyAverage = totalPeriodic / daysPassed;

    // Savings Tracker (SIP as % of Budget)
    const budgetToUse = viewMode === 'monthly' ? currentBudget : currentBudget * 12;
    const savingsRate = (sipTotal / budgetToUse) * 100;

    // Comparison with last period
    const diff = totalPeriodic - lastPeriodTotal;
    const percentChange = lastPeriodTotal === 0 ? (totalPeriodic > 0 ? 100 : 0) : (diff / lastPeriodTotal) * 100;

    return { 
      totalPeriodic, 
      todayTotal, 
      sipTotal, 
      remaining: budgetToUse - totalPeriodic,
      highestCategory,
      highestAmount,
      dailyAverage,
      savingsRate,
      percentChange,
      lastPeriodTotal,
      budget: budgetToUse
    };
  }, [expenses, currentBudget, viewMode, selectedDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = parseISO(exp.date);
      const periodStart = startOfMonth(selectedDate);
      const yearStart = startOfYear(selectedDate);
      
      const isInMonth = startOfMonth(expDate).getTime() === periodStart.getTime();
      const isInYear = startOfYear(expDate).getTime() === yearStart.getTime();
      const isInPeriod = viewMode === 'monthly' ? isInMonth : isInYear;

      const matchesSearch = exp.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           exp.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
      const matchesDate = !filterDate || exp.date === filterDate;
      
      return isInPeriod && matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, searchTerm, filterCategory, filterDate, selectedDate, viewMode]);

  const chartData = useMemo(() => {
    const periodStart = startOfMonth(selectedDate);
    const yearStart = startOfYear(selectedDate);

    // Category Wise
    const catMap = {};
    // Pre-populate catch map with all categories to ensure they show in legend
    CATEGORIES.forEach(cat => catMap[cat] = 0);

    expenses.forEach(e => {
      const expDate = parseISO(e.date);
      const isInMonth = startOfMonth(expDate).getTime() === periodStart.getTime();
      const isInYear = startOfYear(expDate).getTime() === yearStart.getTime();
      const isInPeriod = viewMode === 'monthly' ? isInMonth : isInYear;
      if (isInPeriod) {
        catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      }
    });

    // Only include categories that actually exist in the definition or have data
    const pieData = CATEGORIES.map(cat => ({ 
      name: cat, 
      value: catMap[cat] || 0 
    })).filter(item => item.value > 0 || CATEGORIES.includes(item.name));

    // Periodic (Last 7 Days)
    if (viewMode === 'monthly') {
      const today = startOfDay(new Date());
      const sevenDaysAgo = subDays(today, 6);
      
      const last7Days = eachDayOfInterval({
        start: sevenDaysAgo,
        end: today
      });

      const barData = last7Days.map(day => {
        const dayTotal = expenses.reduce((sum, exp) => {
          return isSameDay(parseISO(exp.date), day) ? sum + exp.amount : sum;
        }, 0);

        return {
          date: format(day, 'dd MMM'),
          amount: dayTotal
        };
      });

      return { pieData, barData };
    } else {
      const periodicMap = {};
      expenses.forEach(e => {
        const expDate = parseISO(e.date);
        if (startOfYear(expDate).getTime() === yearStart.getTime()) {
          const monthKey = format(expDate, 'MMM');
          periodicMap[monthKey] = (periodicMap[monthKey] || 0) + e.amount;
        }
      });
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const barData = months.map(m => ({
        date: m,
        amount: periodicMap[m] || 0
      }));
      return { pieData, barData };
    }
  }, [expenses, viewMode, selectedDate]);

  const addExpense = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = Number(formData.get('amount'));
    const category = formData.get('category');
    const note = formData.get('note');
    const date = formData.get('date');

    // Optimistic UI update
    const tempId = Date.now();
    const newExp = { id: tempId, date, category, amount, note };
    setExpenses([newExp, ...expenses]);
    setActiveTab('dashboard');

    try {
      // Send to Google Sheets
      await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' }, // Using text/plain to avoid preflight issues in simple Apps Script CORS
        body: JSON.stringify({
          category,
          amount,
          note,
          Month: `${format(new Date(date), 'dd MMM')} To ${format(new Date(date), 'dd MMM')}` // Correctly formatted date string
        })
      });
      
      // Refetch to sync with server/sheet
      setTimeout(fetchExpenses, 2000);
      
      if (isQuickMode) {
        setSaveSuccess(true);
      } else {
        setActiveTab('dashboard');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to save to Google Sheets. Please check your connection.');
    }
  };

  const deleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  if (!isLoggedIn && !isQuickMode) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="app-container mesh-gradient" id="app-root-container">
      {/* Mobile Toggle & Overlay */}
      {!isQuickMode && (
        <>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
            <Filter size={20} />
          </button>

          {sidebarOpen && (
            <div className="mobile-overlay" onClick={() => setSidebarOpen(false)}></div>
          )}
        </>
      )}

      {!isQuickMode && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onAddClick={() => setActiveTab('add')}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      )}

      <main className="main-content">
        {!isQuickMode && (
          <header className="page-header">
            <div>
              <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p className="text-muted">Welcome back, track your spending seamlessly.</p>
            </div>
            <div className="header-actions">
              {activeTab === 'dashboard' && (
                <div className="selector-group">
                  <select 
                    className="input view-selector" 
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <option value="monthly">Monthly View</option>
                    <option value="yearly">Yearly View</option>
                  </select>

                  {viewMode === 'monthly' && (
                    <select 
                      className="input month-selector" 
                      value={selectedDate.toISOString()}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    >
                      {monthOptions.map((date) => (
                        <option key={date.toISOString()} value={date.toISOString()}>
                          {format(date, 'MMMM yyyy')}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
              <div className="date-display card">
                <Calendar size={18} />
                <span>{format(new Date(), 'EEEE, dd MMMM')}</span>
              </div>
            </div>
          </header>
        )}

        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="insight-bubble glass span-4">
              <div className="insight-icon">
                <Lightbulb size={20} color="var(--warning)" />
              </div>
              <div className="insight-content">
                <strong>Insight:</strong> {stats.highestAmount > stats.budget * 0.2 ? 
                  `You've spent a significant portion on ${stats.highestCategory} this period. Consider reviewing it!` : 
                  `Your SIP savings rate of ${stats.savingsRate.toFixed(1)}% is looking healthy! Keep it up.`}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-section">
              <SummaryCard title="Today's Total" amount={stats.todayTotal} icon={CreditCard} color="#10b981" />
              <SummaryCard title={viewMode === 'monthly' ? `${format(selectedDate, 'MMMM')} Expense` : "Yearly Expense"} amount={stats.totalPeriodic} icon={PieIcon} color="#0ea5e9" />
              <SummaryCard title="Remaining Budget" amount={stats.remaining} icon={Home} color="#ef4444" subtitle={`Budget: â‚¹${stats.budget.toLocaleString('en-IN')}`} />
              <SummaryCard title="Daily Average" amount={stats.dailyAverage} icon={DollarSign} color="#8b5cf6" subtitle="Spending Speed" />
              <SummaryCard title="Highest Category" amount={stats.highestAmount} icon={AlertCircle} color="#f59e0b" subtitle={stats.highestCategory} />
              <SummaryCard title="SIP Investment" amount={stats.sipTotal} icon={PieIcon} color="#ec4899" subtitle={viewMode === 'monthly' ? format(selectedDate, 'MMMM') : format(selectedDate, 'yyyy')} />
            </div>

            {/* Analytics */}
            <div className="analytics-section">
              <div className="card chart-card glass">
                <h3>Category Distribution</h3>
                <div className="chart-layout">
                  <div className="chart-main">
                    <div className="donut-center">
                      <div className="donut-total">â‚¹{stats.totalPeriodic.toLocaleString('en-IN')}</div>
                      <div className="donut-label">{viewMode === 'monthly' ? format(selectedDate, 'MMM') : format(selectedDate, 'yyyy')}</div>
                    </div>
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie 
                            data={chartData.pieData} 
                            innerRadius={55} 
                            outerRadius={75} 
                            paddingAngle={5} 
                            dataKey="value"
                            stroke="none"
                          >
                            {chartData.pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="chart-legend">
                    {chartData.pieData.map((entry, index) => (
                      <div key={entry.name} className="legend-item">
                        <div className="legend-color" style={{ background: COLORS[index % COLORS.length] }}></div>
                        <div className="legend-info">
                          <span className="legend-name">{entry.name}</span>
                          <span className="legend-percent">{((entry.value / stats.totalPeriodic) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card chart-card glass">
                <h3>Recent Activity</h3>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData.barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }}
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                      />
                      <Bar dataKey="amount" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Expenses Table */}
            <div className="recent-section">
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
                          <td><span className="badge">{exp.category}</span></td>
                          <td className="amount-cell">â‚¹{exp.amount}</td>
                          <td className="note-cell">{exp.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Budget Tracker */}
            <div className="budget-section">
              <div className="card insight-card glass">
                <div className="card-header-flex">
                  <h3>{viewMode === 'monthly' ? "Monthly" : "Yearly"} Budget Progress</h3>
                  <span className="badge badge-accent">Current Status</span>
                </div>
                <div className="budget-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min((stats.totalPeriodic / stats.budget) * 100, 100)}%` }}></div>
                  </div>
                  <div className="budget-info">
                    <span>Spent: â‚¹{stats.totalPeriodic.toLocaleString('en-IN')}</span>
                    <span>Remaining: â‚¹{stats.remaining.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="insights-footer">
                  <div className="insight-item">
                    <p className="text-muted">Avg. {viewMode === 'monthly' ? "Daily" : "Monthly"}</p>
                    <strong>â‚¹{(stats.totalPeriodic / (viewMode === 'monthly' ? new Date().getDate() : new Date().getMonth() + 1)).toFixed(0)}</strong>
                  </div>
                  <div className="insight-item">
                    <p className="text-muted">Estimated {viewMode === 'monthly' ? "Monthly" : "Yearly"}</p>
                    <strong>â‚¹{((stats.totalPeriodic / (viewMode === 'monthly' ? new Date().getDate() : new Date().getMonth() + 1)) * (viewMode === 'monthly' ? 30 : 12)).toFixed(0)}</strong>
                  </div>
                  <div className="insight-item" style={{ borderLeft: '4px solid var(--danger)' }}>
                    <p className="text-muted">Highest Spending</p>
                    <strong>{stats.highestCategory}</strong>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>â‚¹{stats.highestAmount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="expenses-view">
            <div className="card filters-card">
              <div className="search-bar">
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="date-filter">
                <input 
                  type="date" 
                  className="input" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <div className="category-filter">
                <select 
                  className="input" 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="card table-card mt-6">
              <div className="table-responsive">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Note</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map(exp => (
                      <tr key={exp.id}>
                        <td>{format(parseISO(exp.date), 'dd MMM yyyy')}</td>
                        <td><span className="badge">{exp.category}</span></td>
                        <td className="amount-cell">â‚¹{exp.amount.toLocaleString('en-IN')}</td>
                        <td className="note-cell">{exp.note}</td>
                        <td>
                          <button 
                            className="btn-text-danger" 
                            onClick={() => deleteExpense(exp.id)}
                            title="Delete"
                          >
                            <AlertCircle size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-muted">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-view dashboard-grid">
            <div className="card chart-card span-4">
              <h3>Monthly Spending Trend</h3>
              <div className="chart-container" style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card chart-card span-2">
              <h3>Category Breakdown</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie 
                      data={chartData.pieData} 
                      innerRadius={60} 
                      outerRadius={100} 
                      paddingAngle={5} 
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card chart-card span-2">
              <h3>Spend Analysis</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.pieData} layout="vertical" margin={{ left: 20, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={150} tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="investments-view">
            <div className="investment-header-grid">
              <SummaryCard title="Total SIP Invested" amount={stats.sipTotal} icon={TrendingUp} color="#ec4899" />
              <div className="card insight-card">
                <h3>Investment Strategy</h3>
                <p className="text-muted">You are consistently investing in your future. Keep it up!</p>
                <div className="mt-4">
                  <span className="badge badge-success">On Track</span>
                </div>
              </div>
            </div>

            <div className="card table-card mt-6">
              <h3>SIP Contribution History</h3>
              <div className="table-responsive mt-4">
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.filter(e => e.category === 'SIP Investment').map(exp => (
                      <tr key={exp.id}>
                        <td>{format(parseISO(exp.date), 'dd MMM yyyy')}</td>
                        <td className="amount-cell text-success">â‚¹{exp.amount.toLocaleString('en-IN')}</td>
                        <td>{exp.note}</td>
                      </tr>
                    ))}
                    {expenses.filter(e => e.category === 'SIP Investment').length === 0 && (
                      <tr>
                        <td colSpan="3" className="text-center py-8 text-muted">No investments recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-view">
            <div className="card settings-card glass">
              <div className="settings-header mb-8">
                <Settings className="text-primary mb-2" size={32} />
                <h2>Financial Settings</h2>
                <p className="text-muted">Manage your monthly budgets and preferences.</p>
              </div>

              <div className="settings-group mb-8">
                <h3 className="mb-4">Selected Month Budget</h3>
                <p className="text-muted mb-4">Set budget for <strong>{format(selectedDate, 'MMMM yyyy')}</strong></p>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    className="input" 
                    style={{ flex: 1 }}
                    value={monthlyBudgets[currentMonthKey] || ''} 
                    placeholder={monthlyBudgets.default || 50000}
                    onChange={(e) => updateBudget(currentMonthKey, e.target.value)}
                  />
                  <div className="card px-4 flex-center">â‚¹</div>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="mb-4">Default Monthly Budget</h3>
                <p className="text-muted mb-4">Used for months where no specific budget is set.</p>
                <div className="flex gap-4">
                  <input 
                    type="number" 
                    className="input"
                    style={{ flex: 1 }}
                    value={monthlyBudgets.default || 50000} 
                    onChange={(e) => updateDefaultBudget(e.target.value)}
                  />
                  <div className="card px-4 flex-center">â‚¹</div>
                </div>
              </div>

              <div className="mt-12 p-6 glass rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-sm">
                  <strong>Pro Tip:</strong> Dashboard automatically switches budgets based on the month you select in the header!
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="form-container card">
            {saveSuccess ? (
              <div className="success-view text-center py-12">
                <div className="success-icon-wrapper mb-6">
                  <Plus size={48} className="text-success" />
                </div>
                <h2 className="mb-4">Expense Recorded! âœ…</h2>
                <p className="text-muted mb-8">Aapka kharcha safely Google Sheet mein save ho gaya hai.</p>
                <div className="flex-center gap-4">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setSaveSuccess(false);
                      document.querySelector('.expense-form')?.reset();
                    }}
                  >
                    Add Another Entry
                  </button>
                  {!isQuickMode && (
                    <button className="btn" onClick={() => setActiveTab('dashboard')}>
                      Go to Dashboard
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="form-header">
                  <h2>Add New Transaction</h2>
                  {!isQuickMode && (
                    <button className="btn" onClick={() => setActiveTab('dashboard')}>
                      <AlertCircle size={20} /> Cancel
                    </button>
                  )}
                </div>
                <form onSubmit={addExpense} className="expense-form">
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" required className="input" defaultValue={format(new Date(), 'yyyy-MM-dd')} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" className="input" required>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Amount (â‚¹)</label>
                <input type="number" name="amount" required className="input" placeholder="0" />
              </div>
              <div className="form-group">
                <label>Note</label>
                <input type="text" name="note" className="input" placeholder="What's this for?" />
              </div>
              <button type="submit" className="btn btn-primary submit-btn">Save Expense</button>
              </form>
            </>
          )}
        </div>
      )}
      </main>
    </div>
  );
}

export default App;
Clicking...Pressing key...Stopping...

Stop Agent
