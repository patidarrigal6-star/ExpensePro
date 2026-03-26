import React, { useState, useMemo, useEffect, useRef, useCallback, Suspense } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon,
  Settings, Plus, LogOut, ChevronRight, Filter, Search, Menu, X,
  Calendar, CreditCard, ShoppingCart, Home, Info, AlertCircle, AlertTriangle,
  Lightbulb, Activity, Download, History, PlusCircle, ArrowUpRight, ArrowDownRight
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
  isSameDay,
  parse,
  subDays,
  eachDayOfInterval,
  endOfYear,
  eachMonthOfInterval
} from 'date-fns';
import Sidebar from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import Login from './components/Login';
import { useDebounce } from './hooks/useDebounce';

import { CATEGORIES, getCategoryDetails } from './utils/categories';
import SummaryCardsSection from './components/SummaryCardsSection';
import RecentTransactionsTable from './components/RecentTransactionsTable';
import BudgetInsightSection from './components/BudgetInsightSection';
import AddExpenseForm from './components/AddExpenseForm';

const ChartsSection = React.lazy(() => import('./components/ChartsSection'));
const AnalyticsSection = React.lazy(() => import('./components/AnalyticsSection'));

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInputVal, setBudgetInputVal] = useState('');
  const [showReportMenu, setShowReportMenu] = useState(false);
  const reportMenuRef = useRef(null);
  const [addFormDate, setAddFormDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const [invViewType, setInvViewType] = useState('all');
  const [invMonth, setInvMonth] = useState(new Date().getMonth());
  const [invYear, setInvYear] = useState(new Date().getFullYear());

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const mappedData = data
        .filter(item => item.Category && item.Amount)
        .map((item, index) => {
          let dateStr = format(new Date(), 'yyyy-MM-dd');
          let parsedDate = null;
          if (item.Month && item.Month.includes('-')) {
            try {
              parsedDate = parse(item.Month, 'dd-MM-yyyy', new Date());
              if (!parsedDate || isNaN(parsedDate.getTime())) parsedDate = parseISO(item.Month);
            } catch (e) {}
          }
          if ((!parsedDate || isNaN(parsedDate.getTime())) && item.Timestamp) {
            const tsDate = new Date(item.Timestamp);
            if (!isNaN(tsDate.getTime())) parsedDate = tsDate;
          }
          if (parsedDate && !isNaN(parsedDate.getTime())) dateStr = format(parsedDate, 'yyyy-MM-dd');
          return {
            id: index,
            date: dateStr,
            category: item.Category,
            amount: Number(item.Amount),
            note: item.Discerption || ''
          };
        }).reverse();
      setExpenses(mappedData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { if (isLoggedIn || isQuickMode) fetchExpenses(); }, [isLoggedIn, isQuickMode, fetchExpenses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportMenuRef.current && !reportMenuRef.current.contains(event.target)) setShowReportMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem('expensePro_isLoggedIn');
    window.location.reload();
  }, [setIsLoggedIn]);

  const currentMonthKey = format(selectedDate || new Date(), 'yyyy-MM');
  const budgetObj = monthlyBudgets || { default: 50000 };
  const currentBudget = budgetObj[currentMonthKey] || budgetObj.default || 50000;
  const currentMonthName = format(selectedDate || new Date(), 'MMMM');

  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 24; i++) options.push(subMonths(new Date(), i));
    return options;
  }, []);

  const getMonthlyStats = (targetDate) => {
    const periodStart = startOfMonth(targetDate);
    const monthKey = format(targetDate, 'yyyy-MM');
    const budgetValue = monthlyBudgets[monthKey] || monthlyBudgets.default || 50000;
    let totalPeriodic = 0;
    let sipTotal = 0;
    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      if (startOfMonth(expDate).getTime() === periodStart.getTime()) {
        if (exp.category === 'SIP Investment') sipTotal += exp.amount;
        else totalPeriodic += exp.amount;
      }
    });
    const categoryTotals = {};
    expenses.forEach(exp => {
      const expDate = parseISO(exp.date);
      if (startOfMonth(expDate).getTime() === periodStart.getTime()) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      }
    });
    const pieData = CATEGORIES.map(cat => ({
      name: cat.name,
      value: categoryTotals[cat.name] || 0,
      color: cat.color
    })).filter(item => item.value > 0);
    return { totalPeriodic, sipTotal, budget: budgetValue, remaining: budgetValue - totalPeriodic - sipTotal, pieData };
  };

  const stats = useMemo(() => {
    const periodStart = startOfMonth(selectedDate);
    const yearStart = startOfYear(selectedDate);
    const lastMonthStart = startOfMonth(subMonths(selectedDate, 1));
    const categoryTotals = {};
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

      if (isInPeriod) {
        if (exp.category === 'SIP Investment') sipTotal += exp.amount;
        else {
          totalPeriodic += exp.amount;
          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        }
      }
      if (viewMode === 'monthly' ? isInLastMonth : false) {
        if (exp.category !== 'SIP Investment') lastPeriodTotal += exp.amount;
      }
      if (isToday(expDate)) todayTotal += exp.amount;
    });

    let highestCategory = 'None';
    let highestAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > highestAmount) { highestAmount = amt; highestCategory = cat; }
    });

    const budgetToUse = viewMode === 'monthly' ? currentBudget : currentBudget * 12;
    const today = new Date();
    const daysInPeriod = viewMode === 'monthly' ? (isSameMonth(selectedDate, today) ? today.getDate() : getDaysInMonth(selectedDate)) : 365;
    const dailyAverage = totalPeriodic / (daysInPeriod || 1);
    const diff = totalPeriodic - lastPeriodTotal;
    const percentChange = lastPeriodTotal === 0 ? (totalPeriodic > 0 ? 100 : 0) : (diff / lastPeriodTotal) * 100;

    return { totalPeriodic, todayTotal, sipTotal, dailyAverage, remaining: budgetToUse - totalPeriodic - sipTotal, highestCategory, highestAmount, percentChange, lastPeriodTotal, budget: budgetToUse };
  }, [expenses, currentBudget, viewMode, selectedDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = parseISO(exp.date);
      const isInPeriod = viewMode === 'monthly' ? startOfMonth(expDate).getTime() === startOfMonth(selectedDate).getTime() : startOfYear(expDate).getTime() === startOfYear(selectedDate).getTime();
      const matchesSearch = exp.note.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || exp.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
      const matchesDate = !filterDate || exp.date === filterDate;
      return isInPeriod && matchesSearch && matchesCategory && matchesDate;
    });
  }, [expenses, debouncedSearchTerm, filterCategory, filterDate, selectedDate, viewMode]);

  const chartData = useMemo(() => {
    const periodStart = startOfMonth(selectedDate);
    const catMap = {};
    const dailyMap = {};
    const monthlyMap = {};
    CATEGORIES.forEach(cat => catMap[cat.name] = 0);
    expenses.forEach(e => {
      const expDate = parseISO(e.date);
      const isInPeriod = viewMode === 'monthly' ? startOfMonth(expDate).getTime() === periodStart.getTime() : startOfYear(expDate).getTime() === startOfYear(selectedDate).getTime();
      if (isInPeriod) catMap[e.category] = (catMap[e.category] || 0) + e.amount;
      if (viewMode === 'monthly') {
        const today = startOfDay(new Date());
        const sevenDaysAgo = subDays(today, 6);
        if (expDate >= sevenDaysAgo && expDate <= today) {
          const dayKey = format(expDate, 'yyyy-MM-dd');
          dailyMap[dayKey] = (dailyMap[dayKey] || 0) + e.amount;
        }
      } else if (startOfYear(expDate).getTime() === startOfYear(selectedDate).getTime()) {
        const monthKey = format(expDate, 'MMM');
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + e.amount;
      }
    });
    const pieData = CATEGORIES.map(cat => ({ name: cat.name, value: catMap[cat.name] || 0, color: cat.color })).filter(item => item.value > 0 || CATEGORIES.find(c => c.name === item.name));
    pieData.sort((a, b) => b.value - a.value);
    let barData = [];
    if (viewMode === 'monthly') {
      const today = startOfDay(new Date());
      barData = eachDayOfInterval({ start: subDays(today, 6), end: today }).map(day => ({ date: format(day, 'dd MMM'), amount: dailyMap[format(day, 'yyyy-MM-dd')] || 0 }));
    } else {
      barData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({ date: m, amount: monthlyMap[m] || 0 }));
    }
    return { pieData, barData };
  }, [expenses, viewMode, selectedDate]);

  const investmentData = useMemo(() => {
    let data = expenses.filter(exp => exp.category === 'SIP Investment');
    if (invViewType === 'thisMonth') {
      const now = new Date();
      data = data.filter(exp => { const d = parseISO(exp.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
    } else if (invViewType === 'custom') {
      data = data.filter(exp => { const d = parseISO(exp.date); return d.getMonth() === parseInt(invMonth) && d.getFullYear() === parseInt(invYear); });
    }
    return data.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [expenses, invViewType, invMonth, invYear]);

  const addExpense = useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const amount = Number(formData.get('amount'));
    const category = formData.get('category');
    const note = formData.get('note');
    const date = formData.get('date') || addFormDate;
    const tempId = Date.now();
    setExpenses(prev => [{ id: tempId, date, category, amount, note }, ...prev]);
    try {
      await fetch(API_URL, { 
        method: 'POST', 
        mode: 'no-cors', 
        headers: { 'Content-Type': 'text/plain' }, 
        body: JSON.stringify({ category, amount, note, Discerption: note, Month: format(parseISO(date), 'dd-MM-yyyy'), timestamp: new Date().toISOString() }) 
      });
      setTimeout(fetchExpenses, 2000);
      if (isQuickMode) setSaveSuccess(true); else setActiveTab('dashboard');
    } catch (error) { console.error('Error adding expense:', error); }
  }, [addFormDate, isQuickMode, fetchExpenses]);

  const generateReport = useCallback((targetDate = selectedDate) => {
    const reportDate = format(targetDate, 'MMMM yyyy');
    const today = format(new Date(), 'dd MMM yyyy, HH:mm');
    const reportStats = getMonthlyStats(targetDate);
    const usagePercent = Math.min(100, (reportStats.totalPeriodic / reportStats.budget) * 100).toFixed(1);
    const topExpenses = [...expenses].filter(exp => isSameMonth(parseISO(exp.date), targetDate)).sort((a, b) => b.amount - a.amount).slice(0, 5);
    const element = document.createElement('div');
    element.className = 'pdf-report';
    element.innerHTML = `
      <div class="report-header">
        <div class="report-title"><h1>Financial Statement</h1><p>Expense Summary for ${reportDate}</p></div>
        <div class="report-meta"><p>GENERATED ON</p><p style="color: #0f172a; font-weight: 600;">${today}</p></div>
      </div>
      <div class="report-summary-grid">
        <div class="report-card"><div class="report-card-label">Total Expenses</div><div class="report-card-value">₹${reportStats.totalPeriodic.toLocaleString('en-IN')}</div></div>
        <div class="report-card"><div class="report-card-label">Monthly Budget</div><div class="report-card-value">₹${reportStats.budget.toLocaleString('en-IN')}</div></div>
        <div class="report-card"><div class="report-card-label">Net Savings</div><div class="report-card-value" style="color: ${reportStats.remaining >= 0 ? '#10b981' : '#ef4444'}">₹${reportStats.remaining.toLocaleString('en-IN')}</div></div>
      </div>
      <div class="report-card" style="margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; align-items: center;"><div class="report-card-label">Budget Utilization</div><div style="font-size: 14px; font-weight: 700; color: #0f172a;">${usagePercent}%</div></div>
        <div class="report-progress-container"><div class="report-progress-fill" style="width: ${usagePercent}%; background: ${usagePercent > 90 ? '#ef4444' : usagePercent > 70 ? '#f59e0b' : '#6366f1'}"></div></div>
        <p style="font-size: 12px; color: #64748b; margin: 0;">Aapne is mahine budget ka <strong>${usagePercent}%</strong> kharch kiya hai.</p>
      </div>
      <div class="report-grid-2">
        <div><h3 class="report-section-title">Category Breakdown</h3><table class="report-table"><thead><tr><th>Category</th><th style="text-align: right;">Amount</th><th style="text-align: right;">%</th></tr></thead><tbody>
          ${reportStats.pieData.map(item => {
            const total = reportStats.pieData.reduce((acc, curr) => acc + curr.value, 0);
            return `<tr><td style="display: flex; align-items: center; gap: 8px;"><span style="color: ${item.color}">●</span> ${item.name}</td><td style="text-align: right; font-weight: 600;">₹${item.value.toLocaleString('en-IN')}</td><td style="text-align: right; color: #64748b;">${((item.value / total) * 100).toFixed(0)}%</td></tr>`;
          }).join('')}
        </tbody></table></div>
        <div><h3 class="report-section-title">Top 5 Expenses</h3><table class="report-table"><thead><tr><th>Note</th><th style="text-align: right;">Amount</th></tr></thead><tbody>
          ${topExpenses.map(exp => `<tr><td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${exp.note || exp.category}</td><td style="text-align: right; font-weight: 600;">₹${exp.amount.toLocaleString('en-IN')}</td></tr>`).join('')}
          ${topExpenses.length === 0 ? '<tr><td colspan="2" style="text-align: center; color: #94a3b8; padding: 20px;">No records found</td></tr>' : ''}
        </tbody></table></div>
      </div>
      <div class="report-card" style="background: #f0fdf4; border-color: #bbf7d0;">
        <h3 class="report-section-title" style="border-left-color: #10b981; margin-bottom: 8px;">Investment Summary</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;"><p style="margin: 0; color: #166534; font-size: 14px;">Total SIP & Investments for ${reportDate}:</p><p style="margin: 0; font-size: 20px; font-weight: 800; color: #15803d;">₹${reportStats.sipTotal.toLocaleString('en-IN')}</p></div>
      </div>
      <div class="report-footer"><p>© ${new Date().getFullYear()} ExpensePro Dashboard • Secure Financial Tracking</p><p style="margin-top: 4px;">This is a computer generated statement and does not require a physical signature.</p></div>
    `;
    const opt = { 
      margin: 0.5, 
      filename: `expense-report-${reportDate.toLowerCase().replace(' ', '-')}.pdf`, 
      image: { type: 'jpeg', quality: 0.98 }, 
      html2canvas: { scale: 2, useCORS: true, logging: false }, 
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } 
    };
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => { window.html2pdf().set(opt).from(element).save().then(() => { document.head.removeChild(script); }); };
    document.head.appendChild(script);
  }, [selectedDate, expenses]);

  if (!isLoggedIn && !isQuickMode) return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;

  return (
    <div className="app-container mesh-gradient">
      {!isQuickMode && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setActiveTab('add')} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={handleLogout} />}
      <main className="main-content">
        <header className="page-header">
          <div><h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1><p className="text-muted">Welcome back, track your spending.</p></div>
          <div className="header-actions">
            {activeTab === 'dashboard' && (
              <div className="selector-group glass">
                <select className="input view-selector" value={viewMode} onChange={(e) => setViewMode(e.target.value)}><option value="monthly">Monthly View</option><option value="yearly">Yearly View</option></select>
                {viewMode === 'monthly' && <select className="input month-selector" value={selectedDate.toISOString()} onChange={(e) => setSelectedDate(new Date(e.target.value))}>{monthOptions.map((date) => (<option key={date.toISOString()} value={date.toISOString()}>{format(date, 'MMMM yyyy')}</option>))}</select>}
                <div style={{ position: 'relative' }} ref={reportMenuRef}>
                  <button className="btn btn-primary download-report-btn" onClick={() => setShowReportMenu(!showReportMenu)} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={18} /><span>Download Report</span></button>
                  {showReportMenu && (
                    <div className="glass" style={{ position: 'absolute', top: '120%', right: 0, width: '200px', zIndex: 10000, padding: '8px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button onClick={() => { generateReport(new Date()); setShowReportMenu(false); }} style={{ padding: '10px 15px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem' }}>📅 This Month</button>
                      <button onClick={() => { generateReport(subMonths(new Date(), 1)); setShowReportMenu(false); }} style={{ padding: '10px 15px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem' }}>📅 Last Month</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="date-display card glass"><Calendar size={18} /><span>{format(new Date(), 'EEEE, dd MMMM')}</span></div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            {(() => {
              const savingsRate = (stats.sipTotal / (stats.totalPeriodic + stats.sipTotal + 0.1)) * 100;
              return (
                <div className="span-4 glass insight-banner" style={{ background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.08))', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem 1.75rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#10b981', padding: '0.65rem', borderRadius: '12px' }}><Lightbulb size={24} /></div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text)', fontWeight: 500 }}><strong style={{ color: '#10b981', marginRight: '6px' }}>Insight:</strong> Your SIP savings rate of <span style={{ color: '#10b981', fontWeight: 700 }}>{savingsRate.toFixed(1)}%</span> is looking healthy!</div>
                </div>
              );
            })()}
            <SummaryCardsSection stats={stats} onBudgetClick={() => setShowBudgetModal(true)} currentMonthName={currentMonthName} />
            <Suspense fallback={<div className="card glass flex-center py-20 text-muted">Loading Analytics...</div>}><ChartsSection chartData={chartData} stats={stats} viewMode={viewMode} selectedDate={selectedDate || new Date()} /></Suspense>
            <RecentTransactionsTable filteredExpenses={filteredExpenses} setActiveTab={setActiveTab} />
            <BudgetInsightSection stats={stats} viewMode={viewMode} currentMonthKey={currentMonthKey} monthlyBudgets={monthlyBudgets} setBudgetInputVal={setBudgetInputVal} setShowBudgetModal={setShowBudgetModal} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="expenses-view">
            <div className="card filters-card" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <input type="text" placeholder="Search..." className="input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 2 }} />
              <input type="date" className="input" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ flex: 1 }} />
              <select className="input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ flex: 1 }}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>)}
              </select>
            </div>
            <div className="card table-card"><div className="table-responsive"><table className="transaction-table"><thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Note</th><th>Action</th></tr></thead><tbody>
              {filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td>{format(parseISO(exp.date), 'dd MMM yyyy')}</td>
                  <td><span className="badge" style={{ color: getCategoryDetails(exp.category).color }}>{getCategoryDetails(exp.category).icon} {exp.category}</span></td>
                  <td className="amount-cell">₹{exp.amount.toLocaleString('en-IN')}</td>
                  <td className="note-cell">{exp.note}</td>
                  <td><button onClick={() => { if(window.confirm('Delete?')) setExpenses(prev => prev.filter(e => e.id !== exp.id)) }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={16} /></button></td>
                </tr>
              ))}
            </tbody></table></div></div>
          </div>
        )}

        {activeTab === 'investments' && (
          <div className="expenses-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div><h2 style={{ fontSize: '1.875rem', fontWeight: 700, background: 'linear-gradient(to right, #34d399, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portfolio Analysis</h2><p className="text-muted">Track your SIPs and investments.</p></div>
              <div className="card glass" style={{ padding: '0.75rem 1.25rem', background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '0.5rem', borderRadius: '10px' }}><TrendingUp size={20} /></div>
                <div><p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>Total Portfolio Value</p><h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>₹{investmentData.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('en-IN')}</h3></div>
              </div>
            </div>
            <div className="card table-card"><div className="table-responsive"><table className="transaction-table"><thead><tr><th>Date</th><th>Investment</th><th>Amount</th><th>Note</th></tr></thead><tbody>
              {investmentData.map(exp => (<tr key={exp.id}><td>{format(parseISO(exp.date), 'dd MMM yyyy')}</td><td><span className="badge" style={{ color: getCategoryDetails(exp.category).color }}>{getCategoryDetails(exp.category).icon} {exp.category}</span></td><td className="amount-cell">₹{exp.amount.toLocaleString('en-IN')}</td><td className="note-cell">{exp.note}</td></tr>))}
            </tbody></table></div></div>
          </div>
        )}

        {activeTab === 'analytics' && <Suspense fallback={<div className="card glass flex-center py-20 text-muted">Loading...</div>}><AnalyticsSection chartData={chartData} /></Suspense>}
        {activeTab === 'add' && <AddExpenseForm saveSuccess={saveSuccess} setSaveSuccess={setSaveSuccess} setActiveTab={setActiveTab} isQuickMode={isQuickMode} addExpense={addExpense} addFormDate={addFormDate} setAddFormDate={setAddFormDate} />}
      </main>
    </div>
  );
}

export default App;
