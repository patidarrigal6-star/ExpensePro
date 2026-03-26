import React from 'react';
import { CreditCard, PieChart as PieIcon, DollarSign } from 'lucide-react';
import { SummaryCard } from './SummaryCard';

const SummaryCardsSection = React.memo(({ stats, currentMonthName }) => (
    <>
        <SummaryCard title="Today's Total" amount={stats.todayTotal} icon={CreditCard} />
        <SummaryCard title={`${currentMonthName} Total`} amount={stats.totalPeriodic} icon={PieIcon} />
        <SummaryCard 
            title="Remaining" 
            amount={stats.remaining} 
            icon={CreditCard}
            subtitle={`Monthly Budget: ₹${stats.budget.toLocaleString('en-IN')}`}
        />
        <SummaryCard title="Daily Avg" amount={stats.dailyAverage} icon={DollarSign} subtitle="Average Spends" />
    </>
));

export default SummaryCardsSection;
