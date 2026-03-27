export const CATEGORIES = [
  { id: '1', name: 'SIP Investment', color: '#10b981', icon: '\uD83D\uDCB0', dot: '\uD83D\uDFE2' },
  { id: '2', name: 'Extra Expenses', color: '#f43f5e', icon: '\uD83C\uDFAD', dot: '\uD83C\uDF38' },
  { id: '3', name: 'Viha Expenses', color: '#8b5cf6', icon: '\uD83D\uDC76', dot: '\uD83D\uDFE3' },
  { id: '4', name: 'Daily Expenses', color: '#06b6d4', icon: '\u2615', dot: '\uD83D\uDD35' },
  { id: '5', name: 'Petrol', color: '#f97316', icon: '\u26FD', dot: '\uD83D\uDFE0' },
  { id: '6', name: 'Fixed Expenses', color: '#6366f1', icon: '\uD83C\uDFE0', dot: '\uD83D\uDD35' },
  ];

export const getCategoryDetails = (name) => {
      if (!name) return { id: 'unknown', name: 'Unknown', color: '#94a3b8', icon: '\u2753' };
      const cat = CATEGORIES.find(c => c.name === name);
      if (cat) return cat;

      const fallbackColors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return { id: `fallback-${name}`, name, color: fallbackColors[hash % fallbackColors.length], icon: '\uD83C\uDFF7\uFE0F' };
};
