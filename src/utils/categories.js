export const CATEGORIES = [
  { id: '1', name: 'SIP Investment', color: '#10b981', icon: 'Money', dot: 'Green' },
  { id: '2', name: 'Extra Expenses', color: '#f43f5e', icon: 'Extra', dot: 'Pink' },
  { id: '3', name: 'Viha Expenses', color: '#8b5cf6', icon: 'Baby', dot: 'Purple' },
  { id: '4', name: 'Daily Expenses', color: '#06b6d4', icon: 'Coffee', dot: 'Blue' },
  { id: '5', name: 'Petrol', color: '#f97316', icon: 'Petrol', dot: 'Orange' },
  { id: '6', name: 'Fixed Expenses', color: '#6366f1', icon: 'Fixed', dot: 'Indigo' },
  ];

export const getCategoryDetails = (name) => {
      if (!name) return { id: 'unknown', name: 'Unknown', color: '#94a3b8', icon: '?' };
      const cat = CATEGORIES.find(c => c.name === name);
      if (cat) return cat;

      const fallbackColors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return { id: `fallback-${name}`, name, color: fallbackColors[hash % fallbackColors.length], icon: 'Tag' };
};
