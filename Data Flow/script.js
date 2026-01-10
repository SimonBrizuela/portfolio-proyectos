// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Data Generation
function generateRandomData(length, min, max) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function generateDateLabels(days) {
    const labels = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

// Mobile Menu Toggle
const menuToggle = $('#menuToggle');
const sidebar = $('#sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar && menuToggle) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Navigation
const navItems = $$('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.getAttribute('data-page');
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding page
        const pages = $$('.page-content');
        pages.forEach(p => p.classList.remove('active'));
        const targetPage = $(`#${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Reinitialize charts for analytics page
            if (page === 'analytics') {
                setTimeout(() => initAnalyticsChart(), 100);
            }
        }
        
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
    });
});

// Search Functionality
const searchInput = $('#searchInput');
if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Searching for:', searchTerm);
            // Implement search logic here
        }, 300);
    });
}

// Notification Button
const notificationBtn = $('#notificationBtn');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        alert('Notifications:\n\n1. New data import completed\n2. Server backup successful\n3. 5 new user registrations');
    });
}

// Chart.js Implementation
function createLineChart(canvasId, labels, datasets, options = {}) {
    const canvas = $(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
    gradient1.addColorStop(1, 'rgba(102, 126, 234, 0.0)');
    
    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(118, 75, 162, 0.3)');
    gradient2.addColorStop(1, 'rgba(118, 75, 162, 0.0)');
    
    drawLineChart(ctx, canvas, labels, datasets, gradient1, gradient2);
}

function drawLineChart(ctx, canvas, labels, datasets, gradient1, gradient2) {
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...datasets[0].data, ...datasets[1].data);
    const stepX = chartWidth / (labels.length - 1);
    const stepY = chartHeight / maxValue;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw labels
    ctx.fillStyle = '#718096';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        if (i % 2 === 0) {
            const x = padding + stepX * i;
            ctx.fillText(label, x, canvas.height - padding + 20);
        }
    });
    
    // Draw datasets
    datasets.forEach((dataset, datasetIndex) => {
        const gradient = datasetIndex === 0 ? gradient1 : gradient2;
        
        // Fill area
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        dataset.data.forEach((value, i) => {
            const x = padding + stepX * i;
            const y = canvas.height - padding - (value * stepY);
            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        dataset.data.forEach((value, i) => {
            const x = padding + stepX * i;
            const y = canvas.height - padding - (value * stepY);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw points
        dataset.data.forEach((value, i) => {
            const x = padding + stepX * i;
            const y = canvas.height - padding - (value * stepY);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = dataset.borderColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    });
}

function createBarChart(canvasId, labels, data) {
    const canvas = $(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...data);
    const barWidth = chartWidth / data.length * 0.7;
    const spacing = chartWidth / data.length * 0.3;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    data.forEach((value, i) => {
        const x = padding + (barWidth + spacing) * i + spacing / 2;
        const height = (value / maxValue) * chartHeight;
        const y = canvas.height - padding - height;
        
        // Gradient for bar
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, height);
        
        // Draw label
        ctx.fillStyle = '#718096';
        ctx.font = '11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barWidth / 2, canvas.height - padding + 20);
    });
}

// Initialize Charts
function initCharts() {
    const revenueCanvas = $('#revenueChart');
    const activityCanvas = $('#activityChart');
    
    if (revenueCanvas) {
        const container = revenueCanvas.parentElement;
        revenueCanvas.width = container.offsetWidth * 2;
        revenueCanvas.height = 600;
        revenueCanvas.style.width = container.offsetWidth + 'px';
        revenueCanvas.style.height = '300px';
        
        const labels = generateDateLabels(7);
        const datasets = [
            {
                label: 'Revenue',
                data: generateRandomData(7, 30000, 50000),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)'
            },
            {
                label: 'Expenses',
                data: generateRandomData(7, 20000, 35000),
                borderColor: '#764ba2',
                backgroundColor: 'rgba(118, 75, 162, 0.1)'
            }
        ];
        
        createLineChart('#revenueChart', labels, datasets);
    }
    
    if (activityCanvas) {
        const container = activityCanvas.parentElement;
        activityCanvas.width = container.offsetWidth * 2;
        activityCanvas.height = 600;
        activityCanvas.style.width = container.offsetWidth + 'px';
        activityCanvas.style.height = '300px';
        
        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = generateRandomData(7, 1000, 5000);
        
        createBarChart('#activityChart', labels, data);
    }
}

// Users Data - Real user management
let usersData = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Admin', department: 'Management', status: 'Active', avatar: 'SJ', joinDate: '2023-01-15', lastLogin: '2024-01-09' },
    { id: 2, name: 'Michael Chen', email: 'mchen@company.com', role: 'Manager', department: 'Sales', status: 'Active', avatar: 'MC', joinDate: '2023-03-20', lastLogin: '2024-01-09' },
    { id: 3, name: 'Emma Williams', email: 'e.williams@company.com', role: 'User', department: 'Marketing', status: 'Active', avatar: 'EW', joinDate: '2023-06-10', lastLogin: '2024-01-08' },
    { id: 4, name: 'James Rodriguez', email: 'j.rodriguez@company.com', role: 'Manager', department: 'Engineering', status: 'Active', avatar: 'JR', joinDate: '2023-02-28', lastLogin: '2024-01-09' },
    { id: 5, name: 'Lisa Anderson', email: 'landerson@company.com', role: 'User', department: 'Support', status: 'Active', avatar: 'LA', joinDate: '2023-08-05', lastLogin: '2024-01-07' },
    { id: 6, name: 'David Kim', email: 'd.kim@company.com', role: 'User', department: 'Engineering', status: 'Active', avatar: 'DK', joinDate: '2023-09-12', lastLogin: '2024-01-09' },
    { id: 7, name: 'Maria Garcia', email: 'm.garcia@company.com', role: 'Manager', department: 'Marketing', status: 'Inactive', avatar: 'MG', joinDate: '2023-04-18', lastLogin: '2023-12-20' }
];

// Table Data - Extended dataset for better pagination demo
const transactionsData = [
    { id: 'TXN-2024-001', customer: 'Acme Corporation', amount: 45230, status: 'completed', date: '2024-01-08' },
    { id: 'TXN-2024-002', customer: 'Tech Solutions Inc', amount: 32890, status: 'completed', date: '2024-01-08' },
    { id: 'TXN-2024-003', customer: 'Global Enterprises', amount: 28760, status: 'pending', date: '2024-01-07' },
    { id: 'TXN-2024-004', customer: 'Innovation Labs', amount: 52340, status: 'completed', date: '2024-01-07' },
    { id: 'TXN-2024-005', customer: 'Digital Dynamics', amount: 19450, status: 'failed', date: '2024-01-06' },
    { id: 'TXN-2024-006', customer: 'Smart Systems LLC', amount: 38920, status: 'completed', date: '2024-01-06' },
    { id: 'TXN-2024-007', customer: 'Future Technologies', amount: 44560, status: 'pending', date: '2024-01-05' },
    { id: 'TXN-2024-008', customer: 'Cloud Services Pro', amount: 31780, status: 'completed', date: '2024-01-05' },
    { id: 'TXN-2024-009', customer: 'DataCore Systems', amount: 48920, status: 'completed', date: '2024-01-04' },
    { id: 'TXN-2024-010', customer: 'Network Solutions', amount: 26540, status: 'pending', date: '2024-01-04' },
    { id: 'TXN-2024-011', customer: 'Quantum Computing Ltd', amount: 67890, status: 'completed', date: '2024-01-04' },
    { id: 'TXN-2024-012', customer: 'Blockchain Industries', amount: 41200, status: 'completed', date: '2024-01-03' },
    { id: 'TXN-2024-013', customer: 'AI Innovations Corp', amount: 55670, status: 'pending', date: '2024-01-03' },
    { id: 'TXN-2024-014', customer: 'Cyber Security Plus', amount: 33450, status: 'completed', date: '2024-01-02' },
    { id: 'TXN-2024-015', customer: 'Data Mining Co', amount: 29800, status: 'failed', date: '2024-01-02' },
    { id: 'TXN-2024-016', customer: 'Mobile Apps United', amount: 47320, status: 'completed', date: '2024-01-01' },
    { id: 'TXN-2024-017', customer: 'Web Development Hub', amount: 38500, status: 'completed', date: '2024-01-01' },
    { id: 'TXN-2024-018', customer: 'Digital Marketing Pro', amount: 22100, status: 'pending', date: '2023-12-31' },
    { id: 'TXN-2024-019', customer: 'E-Commerce Solutions', amount: 58900, status: 'completed', date: '2023-12-31' },
    { id: 'TXN-2024-020', customer: 'Social Media Agency', amount: 31400, status: 'completed', date: '2023-12-30' },
    { id: 'TXN-2024-021', customer: 'Content Management Co', amount: 42700, status: 'pending', date: '2023-12-30' },
    { id: 'TXN-2024-022', customer: 'Video Streaming Inc', amount: 64200, status: 'completed', date: '2023-12-29' },
    { id: 'TXN-2024-023', customer: 'Gaming Studios LLC', amount: 71500, status: 'completed', date: '2023-12-29' },
    { id: 'TXN-2024-024', customer: 'Virtual Reality Labs', amount: 53800, status: 'failed', date: '2023-12-28' },
    { id: 'TXN-2024-025', customer: 'Augmented Reality Co', amount: 48300, status: 'completed', date: '2023-12-28' }
];

function getStatusClass(status) {
    const statusMap = {
        'completed': 'status-success',
        'pending': 'status-pending',
        'failed': 'status-failed'
    };
    return statusMap[status] || '';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(amount);
}

function renderTableRow(transaction) {
    return `
        <tr>
            <td><strong>${transaction.id}</strong></td>
            <td>${transaction.customer}</td>
            <td><strong>${formatCurrency(transaction.amount)}</strong></td>
            <td><span class="status-badge ${getStatusClass(transaction.status)}">${transaction.status.toUpperCase()}</span></td>
            <td>${new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" title="View">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <button class="action-btn" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                    </button>
                    <button class="action-btn" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function renderTable(data) {
    const tableBody = $('#tableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = data.map(renderTableRow).join('');
    
    // Add click handlers to action buttons
    $$('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('title');
            const row = btn.closest('tr');
            const id = row.querySelector('td:first-child strong').textContent;
            
            if (action === 'View') {
                viewTransaction(id);
            } else if (action === 'Edit') {
                showToast('Edit Mode', `Opening editor for ${id}`, 'info');
            } else if (action === 'Delete') {
                if (confirm(`Are you sure you want to delete ${id}?`)) {
                    row.style.opacity = '0';
                    setTimeout(() => {
                        // Remove from current data
                        const index = currentData.findIndex(t => t.id === id);
                        if (index > -1) {
                            currentData.splice(index, 1);
                            renderPaginatedTable(currentData, window.currentPage || 1);
                        }
                        showToast('Transaction Deleted', `${id} has been deleted successfully`, 'success');
                    }, 300);
                }
            }
        });
    });
}

// Table Search with Pagination
const tableSearch = $('#tableSearch');
if (tableSearch) {
    tableSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        currentData = transactionsData.filter(transaction => 
            transaction.id.toLowerCase().includes(searchTerm) ||
            transaction.customer.toLowerCase().includes(searchTerm) ||
            transaction.status.toLowerCase().includes(searchTerm)
        );
        window.currentPage = 1;
        renderPaginatedTable(currentData, 1);
    });
}

// Animate Statistics
function animateStats() {
    const statValues = $$('.stat-value');
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (!target) return;
        
        const originalText = stat.textContent;
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = originalText;
                clearInterval(timer);
            } else {
                if (target >= 1000000) {
                    stat.textContent = (current / 1000000).toFixed(1) + 'M';
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }
        }, 20);
    });
}

// Animate Skill Bars
function animateSkillBars() {
    const skillBars = $$('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        setTimeout(() => {
            bar.style.width = progress + '%';
            bar.classList.add('animated');
        }, 100);
    });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderPaginatedTable(transactionsData, 1);
    renderUsersTable();
    animateStats();
    animateSkillBars();
    
    // Welcome message
    setTimeout(() => {
        showToast('Welcome to DataFlow Pro', 'Your enterprise data management platform is ready', 'success');
    }, 500);
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initCharts();
    }, 250);
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation example
const contactForm = $('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Dark Mode Toggle
const darkModeToggle = $('#darkModeToggle');
if (darkModeToggle) {
    // Load saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        const isEnabled = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isEnabled);
        
        showToast(
            isEnabled ? 'Dark Mode Enabled' : 'Light Mode Enabled',
            `Switched to ${isEnabled ? 'dark' : 'light'} mode successfully`,
            'success'
        );
        
        // Redraw charts with new colors
        setTimeout(() => {
            initCharts();
            if ($('#analyticsChart')) {
                initAnalyticsChart();
            }
        }, 100);
    });
}

// Export functionality
function exportToCSV(data, filename) {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Add export button handler
document.addEventListener('DOMContentLoaded', () => {
    const exportButtons = document.querySelectorAll('.btn-secondary');
    exportButtons.forEach(btn => {
        if (btn.textContent.includes('Export')) {
            btn.addEventListener('click', () => {
                exportToCSV(transactionsData, 'transactions.csv');
            });
        }
    });
});

// Toast Notification System
function showToast(title, message, type = 'info') {
    const toastContainer = $('#toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" style="color: #48bb78;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
        error: '<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" style="color: #f56565;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
        warning: '<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" style="color: #ed8936;"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
        info: '<svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor" style="color: #4299e1;"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    setTimeout(() => removeToast(toast), 5000);
}

function removeToast(toast) {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
}

// Enhanced Table Pagination
let currentPage = 1;
let itemsPerPage = 10;
let currentData = [...transactionsData];

function renderPaginatedTable(data, page = 1) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);
    
    renderTable(paginatedData);
    updatePaginationControls(data.length, page);
}

function updatePaginationControls(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationInfo = $('.pagination-info');
    const paginationControls = $('.pagination-controls');
    
    if (paginationInfo) {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        paginationInfo.textContent = `Showing ${start}-${end} of ${totalItems} results`;
    }
    
    if (paginationControls) {
        paginationControls.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn';
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                renderPaginatedTable(currentData, currentPage - 1);
                window.currentPage = currentPage - 1;
            }
        });
        paginationControls.appendChild(prevBtn);
        
        // Page numbers
        const maxPages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxPages - 1);
        
        if (endPage - startPage < maxPages - 1) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                renderPaginatedTable(currentData, i);
                window.currentPage = i;
            });
            paginationControls.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                renderPaginatedTable(currentData, currentPage + 1);
                window.currentPage = currentPage + 1;
            }
        });
        paginationControls.appendChild(nextBtn);
    }
}

// Initialize Analytics Chart
function initAnalyticsChart() {
    const analyticsCanvas = $('#analyticsChart');
    if (!analyticsCanvas) return;
    
    const container = analyticsCanvas.parentElement;
    analyticsCanvas.width = container.offsetWidth * 2;
    analyticsCanvas.height = 600;
    analyticsCanvas.style.width = container.offsetWidth + 'px';
    analyticsCanvas.style.height = '300px';
    
    const labels = generateDateLabels(30);
    const datasets = [
        {
            label: 'Page Views',
            data: generateRandomData(30, 3000, 6000),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)'
        },
        {
            label: 'Unique Visitors',
            data: generateRandomData(30, 2000, 4500),
            borderColor: '#764ba2',
            backgroundColor: 'rgba(118, 75, 162, 0.1)'
        }
    ];
    
    createLineChart('#analyticsChart', labels, datasets);
}

// Modal functionality
function showModal(title, content, type = 'form') {
    const modalHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" id="modalClose">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const overlay = $('#modalOverlay');
    const closeBtn = $('#modalClose');
    
    closeBtn.addEventListener('click', () => closeModal());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

function closeModal() {
    const modal = $('#modalOverlay');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    }
}

// View transaction details
function viewTransaction(id) {
    const transaction = transactionsData.find(t => t.id === id);
    if (!transaction) return;
    
    const content = `
        <div class="modal-detail">
            <div class="detail-row">
                <span class="detail-label">Transaction ID:</span>
                <span class="detail-value"><strong>${transaction.id}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Customer:</span>
                <span class="detail-value">${transaction.customer}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Amount:</span>
                <span class="detail-value"><strong>${formatCurrency(transaction.amount)}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge ${getStatusClass(transaction.status)}">${transaction.status.toUpperCase()}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">Credit Card (****4532)</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Processing Time:</span>
                <span class="detail-value">2.3 seconds</span>
            </div>
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="closeModal(); showToast('Edit Mode', 'Editing transaction ${transaction.id}', 'info');">Edit</button>
        </div>
    `;
    
    showModal('Transaction Details', content);
}

// New Report Modal
function showNewReportModal() {
    const content = `
        <form id="newReportForm" style="display: flex; flex-direction: column; gap: 15px;">
            <div class="form-group">
                <label>Report Name</label>
                <input type="text" class="form-input" placeholder="e.g., Monthly Sales Report" required>
            </div>
            <div class="form-group">
                <label>Report Type</label>
                <select class="form-input">
                    <option>Sales Report</option>
                    <option>User Activity Report</option>
                    <option>Financial Report</option>
                    <option>Custom Report</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date Range</label>
                <select class="form-input">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                    <option>This year</option>
                    <option>Custom range</option>
                </select>
            </div>
            <div class="form-group">
                <label>Format</label>
                <select class="form-input">
                    <option>PDF</option>
                    <option>Excel (XLSX)</option>
                    <option>CSV</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Generate Report</button>
            </div>
        </form>
    `;
    
    showModal('Create New Report', content);
    
    $('#newReportForm').addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
        setTimeout(() => {
            showToast('Report Generated', 'Your report is being generated and will be downloaded shortly', 'success');
        }, 300);
    });
}

// Add User Modal
function showAddUserModal() {
    const content = `
        <form id="addUserForm" style="display: flex; flex-direction: column; gap: 15px;">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="form-input" name="name" placeholder="John Doe" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-input" name="email" placeholder="john@example.com" required>
            </div>
            <div class="form-group">
                <label>Role</label>
                <select class="form-input" name="role">
                    <option>User</option>
                    <option>Manager</option>
                    <option>Admin</option>
                </select>
            </div>
            <div class="form-group">
                <label>Department</label>
                <select class="form-input" name="department">
                    <option>Sales</option>
                    <option>Marketing</option>
                    <option>Engineering</option>
                    <option>Support</option>
                    <option>Management</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add User</button>
            </div>
        </form>
    `;
    
    showModal('Add New User', content);
    
    $('#addUserForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const role = formData.get('role');
        const department = formData.get('department');
        
        // Create initials for avatar
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        // Add new user
        const newUser = {
            id: usersData.length + 1,
            name: name,
            email: email,
            role: role,
            department: department,
            status: 'Active',
            avatar: initials,
            joinDate: new Date().toISOString().split('T')[0],
            lastLogin: new Date().toISOString().split('T')[0]
        };
        
        usersData.push(newUser);
        
        closeModal();
        setTimeout(() => {
            renderUsersTable();
            showToast('User Added Successfully', `${name} has been added to the system`, 'success');
        }, 300);
    });
}

// Render Users Table
function renderUsersTable() {
    const tbody = $('#usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = usersData.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="user-avatar" style="width: 36px; height: 36px; font-size: 0.75rem;">${user.avatar}</div>
                    <strong>${user.name}</strong>
                </div>
            </td>
            <td>${user.email}</td>
            <td><span class="status-badge ${user.role === 'Admin' ? 'status-success' : user.role === 'Manager' ? 'status-pending' : ''}">${user.role}</span></td>
            <td>${user.department}</td>
            <td><span class="status-badge ${user.status === 'Active' ? 'status-success' : 'status-failed'}">${user.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn" title="View" onclick="viewUser(${user.id})">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <button class="action-btn" title="Edit" onclick="showToast('Edit User', 'Opening editor for ${user.name}', 'info')">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                        </svg>
                    </button>
                    <button class="action-btn" title="Delete" onclick="deleteUser(${user.id})">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// View User Details
function viewUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    const content = `
        <div class="modal-detail">
            <div style="text-align: center; margin-bottom: 20px;">
                <div class="user-avatar" style="width: 80px; height: 80px; font-size: 2rem; margin: 0 auto;">${user.avatar}</div>
            </div>
            <div class="detail-row">
                <span class="detail-label">Full Name:</span>
                <span class="detail-value"><strong>${user.name}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${user.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Role:</span>
                <span class="detail-value"><span class="status-badge ${user.role === 'Admin' ? 'status-success' : user.role === 'Manager' ? 'status-pending' : ''}">${user.role}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Department:</span>
                <span class="detail-value">${user.department}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge ${user.status === 'Active' ? 'status-success' : 'status-failed'}">${user.status}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Join Date:</span>
                <span class="detail-value">${new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Last Login:</span>
                <span class="detail-value">${new Date(user.lastLogin).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="closeModal(); showToast('Edit User', 'Opening editor for ${user.name}', 'info');">Edit</button>
        </div>
    `;
    
    showModal('User Details', content);
}

// Delete User
function deleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        usersData = usersData.filter(u => u.id !== userId);
        renderUsersTable();
        showToast('User Deleted', `${user.name} has been removed from the system`, 'success');
    }
}

// Search Users
const usersSearch = $('#usersSearch');
if (usersSearch) {
    usersSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tbody = $('#usersTableBody');
        if (!tbody) return;
        
        const filteredUsers = usersData.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm) ||
            user.department.toLowerCase().includes(searchTerm)
        );
        
        tbody.innerHTML = filteredUsers.map(user => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div class="user-avatar" style="width: 36px; height: 36px; font-size: 0.75rem;">${user.avatar}</div>
                        <strong>${user.name}</strong>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.role === 'Admin' ? 'status-success' : user.role === 'Manager' ? 'status-pending' : ''}">${user.role}</span></td>
                <td>${user.department}</td>
                <td><span class="status-badge ${user.status === 'Active' ? 'status-success' : 'status-failed'}">${user.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" title="View" onclick="viewUser(${user.id})">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                        <button class="action-btn" title="Edit" onclick="showToast('Edit User', 'Opening editor for ${user.name}', 'info')">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                        </button>
                        <button class="action-btn" title="Delete" onclick="deleteUser(${user.id})">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    });
}

// Filter Modal
function showFilterModal() {
    const content = `
        <form id="filterForm" style="display: flex; flex-direction: column; gap: 15px;">
            <div class="form-group">
                <label>Status</label>
                <select class="form-input">
                    <option value="">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
            <div class="form-group">
                <label>Date Range</label>
                <select class="form-input">
                    <option>All time</option>
                    <option>Today</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Custom range</option>
                </select>
            </div>
            <div class="form-group">
                <label>Amount Range</label>
                <div style="display: flex; gap: 10px;">
                    <input type="number" class="form-input" placeholder="Min" style="flex: 1;">
                    <input type="number" class="form-input" placeholder="Max" style="flex: 1;">
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Apply Filters</button>
            </div>
        </form>
    `;
    
    showModal('Advanced Filters', content);
    
    $('#filterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const status = e.target.querySelector('select').value;
        closeModal();
        setTimeout(() => {
            if (status) {
                currentData = transactionsData.filter(t => t.status === status);
                renderPaginatedTable(currentData, 1);
                showToast('Filters Applied', `Showing only ${status} transactions`, 'success');
            }
        }, 300);
    });
}

// Add Transaction Modal
function showAddTransactionModal() {
    const content = `
        <form id="addTransactionForm" style="display: flex; flex-direction: column; gap: 15px;">
            <div class="form-group">
                <label>Customer Name</label>
                <input type="text" class="form-input" name="customer" placeholder="Company Name" required>
            </div>
            <div class="form-group">
                <label>Amount (USD)</label>
                <input type="number" class="form-input" name="amount" placeholder="10000" min="1" required>
            </div>
            <div class="form-group">
                <label>Status</label>
                <select class="form-input" name="status">
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>
            <div class="form-group">
                <label>Payment Receipt (Optional)</label>
                <input type="file" class="form-input" name="receipt" accept="image/*,.pdf" id="receiptUpload">
                <div id="receiptPreview" style="margin-top: 10px; display: none;">
                    <div style="padding: 10px; background: var(--bg-secondary); border-radius: 8px; display: flex; align-items: center; gap: 10px;">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" style="color: var(--success-color);">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span id="receiptFileName" style="font-size: 0.875rem; color: var(--text-secondary);"></span>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 10px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Transaction</button>
            </div>
        </form>
    `;
    
    showModal('Add New Transaction', content);
    
    // File upload preview
    const receiptUpload = $('#receiptUpload');
    if (receiptUpload) {
        receiptUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const preview = $('#receiptPreview');
                const fileName = $('#receiptFileName');
                if (preview && fileName) {
                    fileName.textContent = file.name;
                    preview.style.display = 'block';
                }
            }
        });
    }
    
    $('#addTransactionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const customer = formData.get('customer');
        const amount = parseInt(formData.get('amount'));
        const status = formData.get('status');
        const receipt = formData.get('receipt');
        
        // Generate new transaction ID
        const lastId = transactionsData[transactionsData.length - 1].id;
        const newIdNum = parseInt(lastId.split('-')[2]) + 1;
        const newId = `TXN-2024-${String(newIdNum).padStart(3, '0')}`;
        
        // Add new transaction
        const newTransaction = {
            id: newId,
            customer: customer,
            amount: amount,
            status: status,
            date: new Date().toISOString().split('T')[0],
            receipt: receipt ? receipt.name : null
        };
        
        transactionsData.unshift(newTransaction);
        currentData = [...transactionsData];
        
        closeModal();
        setTimeout(() => {
            renderPaginatedTable(currentData, 1);
            showToast('Transaction Added', `${newId} for ${formatCurrency(amount)} has been added`, 'success');
        }, 300);
    });
}

// Chart change handlers
const revenueChartSelect = $('#revenueChartSelect');
if (revenueChartSelect) {
    revenueChartSelect.addEventListener('change', (e) => {
        const days = parseInt(e.target.value);
        updateRevenueChart(days);
    });
}

const activityChartSelect = $('#activityChartSelect');
if (activityChartSelect) {
    activityChartSelect.addEventListener('change', (e) => {
        const period = e.target.value;
        updateActivityChart(period);
    });
}

function updateRevenueChart(days) {
    const canvas = $('#revenueChart');
    if (!canvas) return;
    
    const labels = generateDateLabels(days);
    const datasets = [
        {
            label: 'Revenue',
            data: generateRandomData(days, 30000, 50000),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)'
        },
        {
            label: 'Expenses',
            data: generateRandomData(days, 20000, 35000),
            borderColor: '#764ba2',
            backgroundColor: 'rgba(118, 75, 162, 0.1)'
        }
    ];
    
    createLineChart('#revenueChart', labels, datasets);
    showToast('Chart Updated', `Showing data for last ${days} days`, 'info');
}

function updateActivityChart(period) {
    const canvas = $('#activityChart');
    if (!canvas) return;
    
    let labels, data;
    
    if (period === 'week') {
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = generateRandomData(7, 1000, 5000);
    } else if (period === 'month') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = generateRandomData(4, 15000, 30000);
    } else {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data = generateRandomData(12, 50000, 150000);
    }
    
    createBarChart('#activityChart', labels, data);
    showToast('Chart Updated', `Showing ${period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : 'yearly'} activity`, 'info');
}

// Enhanced button interactions with modals
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary, .btn-secondary');
    if (!btn) return;
    
    const btnId = btn.id;
    const text = btn.textContent.trim();
    
    if (btnId === 'addTransactionBtn') {
        showAddTransactionModal();
    } else if (btnId === 'addUserBtn') {
        showAddUserModal();
    } else if (btnId === 'exportUsersBtn') {
        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            exportToCSV(usersData, 'dataflow-users.csv');
            showToast('Export Successful', 'Users exported to CSV', 'success');
        }, 1500);
    } else if (text.includes('Export')) {
        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            
            const activePage = $('.page-content.active');
            if (activePage && activePage.id === 'dashboardPage') {
                exportToCSV(currentData, 'dataflow-transactions.csv');
            } else if (activePage && activePage.id === 'usersPage') {
                const usersData = [
                    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
                    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', status: 'Active' }
                ];
                exportToCSV(usersData, 'dataflow-users.csv');
            } else {
                exportToCSV(currentData, 'dataflow-export.csv');
            }
            
            showToast('Export Successful', 'Your data has been exported to CSV', 'success');
        }, 1500);
    } else if (text.includes('New Report')) {
        showNewReportModal();
    } else if (text.includes('Add User')) {
        showAddUserModal();
    } else if (text.includes('New Table')) {
        showToast('Table Created', 'New database table "customers_2024" has been created', 'success');
    } else if (text.includes('Backup')) {
        btn.classList.add('loading');
        setTimeout(() => {
            btn.classList.remove('loading');
            showToast('Backup Complete', 'Database backup completed successfully (234 GB)', 'success');
        }, 2000);
    } else if (btn.id === 'filterBtn') {
        showFilterModal();
    }
});

console.log('%c DataFlow Pro v1.0 ', 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px; font-size: 16px; font-weight: bold;');
console.log('Enterprise Data Management Platform - Loaded Successfully');