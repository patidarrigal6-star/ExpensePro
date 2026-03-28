import React from 'react';
import { Calendar, Plus, AlertCircle } from 'lucide-react';
import { CATEGORIES } from '../utils/categories';

const AddExpenseForm = React.memo(({
        saveSuccess,
        setSaveSuccess,
        setActiveTab,
        isQuickMode,
        addExpense,
        addFormDate,
        setAddFormDate
}) => {
        if (saveSuccess) {
                    return (
                                    <div className="success-view text-center py-12">
                                                    <div className="success-icon-wrapper mb-6">
                                                                        <Plus size={48} className="text-success" />
                                                    </div>
                                                    <h2 className="mb-4">Expense Recorded! {"\u2705"}</h2>
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
                                );
        }
    
        return (
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
                                                                    <div className="input-with-icon">
                                                                                            <Calendar size={18} className="field-icon" />
                                                                                            <input
                                                                                                                            type="date"
                                                                                                                            name="date"
                                                                                                                            required
                                                                                                                            className="input"
                                                                                                                            value={addFormDate}
                                                                                                                            onChange={(e) => setAddFormDate(e.target.value)}
                                                                                                                        />
                                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                                    <label>Category</label>
                                                                    <select name="category" className="input" required>
                                                                        {CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.icon} {cat.name} {cat.dot}</option>)}
                                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                                    <label>Amount ({"\u20b9"})</label>
                                                                    <input type="number" name="amount" required className="input" placeholder="0" />
                                                </div>
                                                <div className="form-group">
                                                                    <label>Note</label>
                                                                    <input type="text" name="note" className="input" placeholder="What's this for?" />
                                                </div>
                                                <button type="submit" className="btn btn-primary submit-btn">Save Expense</button>
                                </form>
                    </>
                );
});

export default AddExpenseForm;
