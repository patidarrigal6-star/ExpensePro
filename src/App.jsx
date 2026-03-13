import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TrendingUp, CreditCard, Droplets, Home, User, PieChart as PieChartIcon, Calendar, AlertCircle, Activity, LayoutDashboard, Lightbulb } from 'lucide-react';
import { format, isToday, startOfMonth, startOfYear, subMonths, startOfDay, parseISO, getDaysInMonth, isSameMonth, isSameYear, differenceInDays, endOfMonth, subDays, isSameDay, eachDayOfInterval } from 'date-fns';
import { Sidebar } from './components/Sidebar';
import { SummaryCard } from './components/SummaryCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

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
    const [budget, setBudget] = useState(50000);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [viewMode, setViewMode] = useState('monthly');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterDate, setFilterDate] = useState('');

  const fetchExpenses = async () => {
        setIsLoading(true);
        try {
                const response = await fetch(API_URL);
                const data = await response.json();

          const mappedData = data
                  .filter(item => item.Category && item.Amount)
                  .map((item, index) => ({
                              id: index,
                              date: item.Timestamp ? format(new Date(item.Timestamp), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
                              category: item.Category,
                              amount: Number(item.Amount),
                              note: item.Discerption || ''
                  })).reverse();

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

  const stats = useMemo(() => {
        const periodStart = startOfMonth(selectedDate);
        const yearStart = startOfYear(selectedDate);

                            let totalPeriodic = 0;
        let todayTotal = 0;
        let sipTotal = 0;

                            expenses.forEach(exp => {
                                    const expDate = parseISO(exp.date);
                                    const isInPeriod = viewMode === 'monthly' ? (startOfMonth(expDate).getTime() === periodStart.getTime()) : (startOfYear(expDate).getTime() === yearStart.getTime());

                                                   if (isInPeriod) {
                                                             if (exp.category !== 'SIP Investment') totalPeriodic += exp.amount;
                                                             if (exp.category === 'SIP Investment') sipTotal += exp.amount;
                                                   }
                                    if (isToday(expDate)) {
                                              todayTotal += exp.amount;
                                    }
                            });

                            const currentBudget = viewMode === 'monthly' ? budget : budget * 12;
        return { totalPeriodic, todayTotal, sipTotal, remaining: currentBudget - totalPeriodic };
  }, [expenses, budget, viewMode, selectedDate]);

  return (
        <div className="app-container">
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
              <main className="main-content">
                      <h1>{activeTab}</h1>h1>
                      <div className="summary">
                                <SummaryCard title="Today" amount={stats.todayTotal} icon={CreditCard} color="#10b981" />
                                <SummaryCard title="Total" amount={stats.totalPeriodic} icon={LayoutDashboard} color="#0ea5e9" />
                                <SummaryCard title="Remaining" amount={stats.remaining} icon={Home} color="#ef4444" />
                                <SummaryCard title="SIP" amount={stats.sipTotal} icon={PieChartIcon} color="#ec4899" />
                      </div>div>
              </main>main>
        </div>div>
      );
}

export default App;
</div>
