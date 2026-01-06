// Expense Tracker - JavaScript

class ExpenseTracker {
    constructor() {
        this.transactions = this.loadTransactions();
        this.currentFilter = 'all';
        this.expenseChart = null;
        this.trendChart = null;
        this.init();
    }

    init() {
        this.form = document.getElementById('transactionForm');
        this.transactionsList = document.getElementById('transactionsList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');

        this.addEventListeners();
        this.render();
        this.initCharts();
    }

    addEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTransactions();
            });
        });

        this.exportBtn.addEventListener('click', () => this.exportToCSV());
        this.clearAllBtn.addEventListener('click', () => this.clearAll());
    }

    addTransaction() {
        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const type = document.getElementById('type').value;

        if (!description || !amount || !category) {
            alert('Please fill in all fields');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
            category,
            type,
            date: new Date().toISOString()
        };

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.form.reset();
        this.render();
    }

    deleteTransaction(id) {
        if (confirm('Delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.render();
        }
    }

    clearAll() {
        if (confirm('Delete ALL transactions? This action cannot be undone.')) {
            this.transactions = [];
            this.saveTransactions();
            this.render();
        }
    }

    getFilteredTransactions() {
        switch (this.currentFilter) {
            case 'income':
                return this.transactions.filter(t => t.type === 'income');
            case 'expense':
                return this.transactions.filter(t => t.type === 'expense');
            default:
                return this.transactions;
        }
    }

    calculateBalance() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = Math.abs(this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0));
        
        const total = income - expense;

        return { total, income, expense };
    }

    updateBalance() {
        const { total, income, expense } = this.calculateBalance();

        document.getElementById('totalBalance').textContent = this.formatCurrency(total);
        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(expense);
    }

    renderTransactions() {
        const filtered = this.getFilteredTransactions();
        this.transactionsList.innerHTML = '';

        if (filtered.length === 0) {
            this.transactionsList.innerHTML = `
                <div class="empty-state">
                    <p>No transactions yet. Add one to get started.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(transaction => {
            const div = document.createElement('div');
            div.className = `transaction-item ${transaction.type}`;
            
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            div.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-description">${this.escapeHtml(transaction.description)}</div>
                    <div class="transaction-meta">
                        ${this.getCategoryIcon(transaction.category)} • ${formattedDate}
                    </div>
                </div>
                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : ''}${this.formatCurrency(transaction.amount)}
                </span>
                <button class="delete-transaction">Delete</button>
            `;

            const deleteBtn = div.querySelector('.delete-transaction');
            deleteBtn.addEventListener('click', () => this.deleteTransaction(transaction.id));

            this.transactionsList.appendChild(div);
        });
    }

    getCategoryIcon(category) {
        const icons = {
            alimentacion: 'Food',
            transporte: 'Transport',
            vivienda: 'Housing',
            entretenimiento: 'Entertainment',
            salud: 'Health',
            educacion: 'Education',
            otros: 'Other',
            salario: 'Salary',
            freelance: 'Freelance',
            inversiones: 'Investments',
            'otros-ingresos': 'Other Income'
        };
        return icons[category] || 'General';
    }

    getCategoryName(category) {
        const names = {
            alimentacion: 'Food',
            transporte: 'Transportation',
            vivienda: 'Housing',
            entretenimiento: 'Entertainment',
            salud: 'Health',
            educacion: 'Education',
            otros: 'Other',
            salario: 'Salary',
            freelance: 'Freelance',
            inversiones: 'Investments',
            'otros-ingresos': 'Other Income'
        };
        return names[category] || category;
    }

    initCharts() {
        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        const trendCtx = document.getElementById('trendChart').getContext('2d');

        this.expenseChart = new Chart(expenseCtx, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [] }] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        this.trendChart = new Chart(trendCtx, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        this.updateCharts();
    }

    updateCharts() {
        this.updateExpenseChart();
        this.updateTrendChart();
    }

    updateExpenseChart() {
        const expenses = this.transactions.filter(t => t.type === 'expense');
        const categoryTotals = {};

        expenses.forEach(t => {
            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = 0;
            }
            categoryTotals[t.category] += Math.abs(t.amount);
        });

        const labels = Object.keys(categoryTotals).map(cat => this.getCategoryName(cat));
        const data = Object.values(categoryTotals);

        this.expenseChart.data.labels = labels;
        this.expenseChart.data.datasets[0] = {
            data: data,
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
            ]
        };
        this.expenseChart.update();
    }

    updateTrendChart() {
        const last7Days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }

        const incomeByDay = {};
        const expenseByDay = {};

        last7Days.forEach(day => {
            incomeByDay[day] = 0;
            expenseByDay[day] = 0;
        });

        this.transactions.forEach(t => {
            const day = t.date.split('T')[0];
            if (last7Days.includes(day)) {
                if (t.type === 'income') {
                    incomeByDay[day] += t.amount;
                } else {
                    expenseByDay[day] += Math.abs(t.amount);
                }
            }
        });

        const labels = last7Days.map(day => {
            const date = new Date(day);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        });

        this.trendChart.data.labels = labels;
        this.trendChart.data.datasets = [
            {
                label: 'Income',
                data: Object.values(incomeByDay),
                borderColor: '#38ef7d',
                backgroundColor: 'rgba(56, 239, 125, 0.1)',
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: Object.values(expenseByDay),
                borderColor: '#f5576c',
                backgroundColor: 'rgba(245, 87, 108, 0.1)',
                tension: 0.4
            }
        ];
        this.trendChart.update();
    }

    exportToCSV() {
        if (this.transactions.length === 0) {
            alert('No transactions to export');
            return;
        }

        let csv = 'Date,Description,Category,Type,Amount\n';
        
        this.transactions.forEach(t => {
            const date = new Date(t.date).toLocaleDateString('en-US');
            csv += `${date},"${t.description}",${this.getCategoryName(t.category)},${t.type === 'income' ? 'Income' : 'Expense'},${t.amount}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transacciones_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    render() {
        this.updateBalance();
        this.renderTransactions();
        this.updateCharts();
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    loadTransactions() {
        const data = localStorage.getItem('transactions');
        return data ? JSON.parse(data) : [];
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new ExpenseTracker();
});
