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
                              const currentYear = new Date().getFullYear();

                                 if (item.Month && item.Month.includes('-') && !item.Month.includes('To')) {
                                               try {
                                                               parsedDate = parse(item.Month, 'dd-MM-yyyy', new Date());
                                                               if (!parsedDate || isNaN(parsedDate.getTime())) {
                                                                                 parsedDate = parseISO(item.Month);
                                                               }
                                               } catch (e) {}
                                 }

                                 if ((!parsedDate || isNaN(parsedDate.getTime())) && item.Timestamp) {
                                               const tsDate = new Date(item.Timestamp);
                                               if (!isNaN(tsDate.getTime())) {
                                                               parsedDate = tsDate;
                                               }
                                 }

                                 if ((!parsedDate || isNaN(parsedDate.getTime())) && item.Month && item.Month.includes('To')) {
                                               try {
                                                               const dayStr = item.Month.split('To')[0].trim();
                                                               parsedDate = parse(dayStr, 'd MMM', new Date(currentYear, 0, 1));
                                               } catch (e) {}
                                 }

                                 if (parsedDate && !isNaN(parsedDate.getTime())) {
                                               dateStr = format(parsedDate, 'yyyy-MM-dd');
                                 }

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

  useEffect(() => {
        if (isLoggedIn || isQuickMode) {
                fetchExpenses();
        }
  }, [isLoggedIn, isQuickMode, fetchExpenses]);

  useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('mode') === 'quick') {
                setIsQuickMode(true);
                setActiveTab('add');
                return;
        }
        if (params.get('add') === 'true' && isLoggedIn) {
                setActiveTab('add');
                window.history.replaceState({}, document.title, window.location.pathname);
        }
  }, [isLoggedIn]);

  useEffect(() => {
        const handleClickOutside = (event) => {
                if (reportMenuRef.current && !reportMenuRef.current.contains(event.target)) {
                          setShowReportMenu(false);
                }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = useCallback(() => setIsLoggedIn(true), [setIsLoggedIn]);
    const handleLogout = useCallback(() => {
          setIsLoggedIn(false);
          localStorage.removeItem('expensePro_isLoggedIn');
          window.location.reload();
    }, [setIsLoggedIn]);

  const updateBudget = useCallback((monthKey, value) => {
        setMonthlyBudgets(prev => ({ ...prev, [monthKey]: Number(value) }));
  }, [setMonthlyBudgets]);

  const updateDefaultBudget = useCallback((value) => {
        setMonthlyBudgets(prev => ({ ...prev, default: Number(value) }));
  }, [setMonthlyBudgets]);

  const currentMonthKey = format(selectedDate || new Date(), 'yyyy-MM');
    const budgetObj = monthlyBudgets || { default: 50000 };
    const currentBudget = budgetObj[currentMonthKey] || budgetObj.default || 50000;

  const handleSaveBudgetModal = useCallback((e) => {
        e.preventDefault();
        if (budgetInputVal && !isNaN(budgetInputVal)) {
                updateBudget(currentMonthKey, Number(budgetInputVal));
                updateDefaultBudget(Number(budgetInputVal));
                setShowBudgetModal(false);
        }
  }, [budgetInputVal, currentMonthKey, updateBudget, updateDefaultBudget]);

  const currentMonthName = format(selectedDate || new Date(), 'MMMM');

  const stats = useMemo(() => {
        const periodStart = startOfMonth(selectedDate);
        const categoryTotals = {};
        let totalPeriodic = 0;
        let todayTotal = 0;
        let sipTotal = 0;

                            expenses.forEach(exp => {
                                    const expDate = parseISO(exp.date);
                                    const isInMonth = startOfMonth(expDate).getTime() === periodStart.getTime();
                                    if (isInMonth) {
                                              if (exp.category === 'SIP Investment') {
                                                          sipTotal += exp.amount;
                                              } else {
                                                          totalPeriodic += exp.amount;
                                                          categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
                                              }
                                    }
                                    if (isToday(expDate)) todayTotal += exp.amount;
                            });

                            let highestCategory = 'None';
        let highestAmount = 0;
        Object.entries(categoryTotals).forEach(([cat, amt]) => {
                if (amt > highestAmount) {
                          highestAmount = amt;
                          highestCategory = cat;
                }
        });

                            const budgetToUse = currentBudget;
        return {
                totalPeriodic,
                todayTotal,
                sipTotal,
                remaining: budgetToUse - totalPeriodic - sipTotal,
                highestCategory,
                highestAmount,
                budget: budgetToUse,
                dailyAverage: totalPeriodic / 30
        };
  }, [expenses, currentBudget, selectedDate]);

  const filteredExpenses = useMemo(() => {
        return expenses.filter(exp => {
                const expDate = parseISO(exp.date);
                const periodStart = startOfMonth(selectedDate);
                const isInPeriod = startOfMonth(expDate).getTime() === periodStart.getTime();
                const matchesSearch = exp.note.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          exp.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
                const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
                return isInPeriod && matchesSearch && matchesCategory;
        });
  }, [expenses, debouncedSearchTerm, filterCategory, selectedDate]);

  const chartData = useMemo(() => {
        const periodStart = startOfMonth(selectedDate);
        const catMap = {};
        CATEGORIES.forE
