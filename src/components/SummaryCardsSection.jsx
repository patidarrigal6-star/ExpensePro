import React from 'react';
import { CreditCard, PieChart as PieIcon, Home, DollarSign, AlertCircle } from 'lucide-react';
import { SummaryCard } from './SummaryCard';

const SummaryCardsSection = React.memo(({ stats, currentMonthName }) => (
    <div className="summary-section">
        <SummaryCard title="TODAY'S TOTAL" amount={stats.todayTotal} icon={CreditCard} color="#3b82f6" />
        <SummaryCard title={`${currentMonthName.toUpperCase()} EXPENSE`} amount={stats.totalPeriodic} icon={PieIcon} color="#10b981" />
        <SummaryCard
            title="REMAINING BUDGET"
            amount={stats.remaining}
            icon={Home}
            color={stats.remaining < 0 ? "#ef4444" : "#6366f1"}
            subtitle={`Budget: ₹${stats.budget.toLocaleString('en-IN')}`}
        />
        <SummaryCard title="DAILY AVERAGE" amount={stats.dailyAverage} icon={DollarSign} color="#f59e0b" subtitle="Spending Speed" />
        <SummaryCard title="HIGHEST CATEGORY" amount={stats.highestAmount} icon={AlertCircle} color="#ec4899" subtitle={stats.highestCategory} />
        <SummaryCard title="SIP INVESTMENT" amount={stats.sipTotal} icon={PieIcon} color="#8b5cf6" subtitle={currentMonthName} />
    </div>
));

export default SummaryCardsSection;
