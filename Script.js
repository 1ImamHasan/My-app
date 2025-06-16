
        // ==========================================
        // Global Error Handling
        // ==========================================
        window.addEventListener('error', (event) => {
            showErrorBoundary(event.message || 'Unknown error');
        });
        
        function showErrorBoundary(message) {
            document.getElementById('error-details').textContent = `ত্রুটি বিবরণ: ${message}`;
            document.getElementById('error-boundary').style.display = 'block';
            document.querySelector('body > *:not(#error-boundary)').style.display = 'none';
        }
        
        document.getElementById('refresh-app').addEventListener('click', () => {
            location.reload();
        });
        
        // ==========================================
        // Onboarding Tour System
        // ==========================================
        const onboardingSteps = [
            {
                title: "স্বাগতম!",
                description: "এই অ্যাপে আপনি আপনার মাসিক বাজেট এবং ব্যয় ট্র্যাক করতে পারবেন। চলুন একটি সংক্ষিপ্ত ট্যুর দিয়ে শুরু করি।",
                element: null
            },
            {
                title: "আর্থিক সারাংশ",
                description: "এখানে আপনি আপনার মাসিক বাজেট, চলতি মাসের ব্যয় এবং অবশিষ্ট ব্যালেন্স দেখতে পাবেন।",
                element: "#balance-card"
            },
            {
                title: "বাজেট ব্যবহার",
                description: "এই প্রোগ্রেস বার আপনাকে আপনার বাজেটের কতটা ব্যবহার করেছেন তা দেখাবে।",
                element: "#budget-card"
            },
            {
                title: "ব্যয় বিশ্লেষণ",
                description: "এই চার্টে আপনি বিভাগ অনুযায়ী আপনার ব্যয়ের ডাটা ভিজ্যুয়ালাইজ করতে পারবেন।",
                element: "#expense-chart"
            },
            {
                title: "ব্যয়ের তালিকা",
                description: "এখানে আপনার সমস্ত ব্যয়ের বিস্তারিত তালিকা দেখতে পাবেন। আপনি ব্যয় মুছে ফেলতে পারবেন।",
                element: "#expense-table-section"
            },
            {
                title: "ব্যয় যোগ করুন",
                description: "এই বাটনে ক্লিক করে আপনি নতুন ব্যয় যোগ করতে পারবেন।",
                element: "#add-expense-fab"
            },
            {
                title: "সেটিংস",
                description: "এখানে আপনি সতর্কতা এবং অন্যান্য সেটিংস ম্যানেজ করতে পারবেন।",
                element: "#settings-btn"
            },
            {
                title: "ট্যুর সম্পন্ন!",
                description: "এখন আপনি আপনার ব্যয় ট্র্যাকিং শুরু করতে প্রস্তুত! কোনো সাহায্যের প্রয়োজন হলে সেটিংস থেকে আবার ট্যুর শুরু করতে পারবেন।",
                element: null
            }
        ];
        
        let currentStep = 0;
        let onboardingCompleted = localStorage.getItem('onboardingCompleted') === 'true';
        
        function startOnboarding() {
            document.getElementById('onboarding-overlay').style.display = 'block';
            document.getElementById('onboarding-tooltip').style.display = 'block';
            showStep(currentStep);
        }
        
        function showStep(stepIndex) {
            const step = onboardingSteps[stepIndex];
            const tooltip = document.getElementById('onboarding-tooltip');
            const title = document.getElementById('onboarding-title');
            const description = document.getElementById('onboarding-description');
            const prevBtn = document.getElementById('onboarding-prev');
            const nextBtn = document.getElementById('onboarding-next');
            const skipBtn = document.getElementById('onboarding-skip');
            
            title.textContent = step.title;
            description.textContent = step.description;
            
            // Update button text for last step
            if (stepIndex === onboardingSteps.length - 1) {
                nextBtn.textContent = 'শেষ করুন';
            } else {
                nextBtn.textContent = 'পরবর্তী';
            }
            
            // Hide previous button on first step
            if (stepIndex === 0) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'inline-block';
            }
            
            // Position tooltip
            if (step.element) {
                const element = document.querySelector(step.element);
                element.classList.add('highlighted');
                
                const rect = element.getBoundingClientRect();
                tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
                
                if (rect.left > window.innerWidth / 2) {
                    tooltip.style.left = `${rect.left + window.scrollX - tooltip.offsetWidth - 10}px`;
                } else {
                    tooltip.style.left = `${rect.right + window.scrollX + 10}px`;
                }
            } else {
                // Center for welcome and completion steps
                tooltip.style.top = '50%';
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translate(-50%, -50%)';
            }
        }
        
        function nextStep() {
            // Remove highlight from previous element
            if (onboardingSteps[currentStep].element) {
                document.querySelector(onboardingSteps[currentStep].element).classList.remove('highlighted');
            }
            
            currentStep++;
            
            if (currentStep < onboardingSteps.length) {
                showStep(currentStep);
            } else {
                finishOnboarding();
            }
        }
        
        function prevStep() {
            // Remove highlight from current element
            if (onboardingSteps[currentStep].element) {
                document.querySelector(onboardingSteps[currentStep].element).classList.remove('highlighted');
            }
            
            currentStep--;
            showStep(currentStep);
        }
        
        function finishOnboarding() {
            document.getElementById('onboarding-overlay').style.display = 'none';
            document.getElementById('onboarding-tooltip').style.display = 'none';
            localStorage.setItem('onboardingCompleted', 'true');
            onboardingCompleted = true;
            showAlert('success', 'ট্যুর সম্পন্ন! এখন আপনি আপনার ব্যয় ট্র্যাকিং শুরু করতে প্রস্তুত।');
        }
        
        // ==========================================
        // Push Notification System
        // ==========================================
        function showNotification(title, message, type = 'info') {
            if (!document.getElementById('budget-alerts-toggle').checked && type !== 'error') {
                return;
            }
            
            const notificationCenter = document.getElementById('notification-center');
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'danger' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">&times;</button>
            `;
            
            notificationCenter.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
            
            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            });
        }
        
        function checkBudgetNotifications() {
            const currentMonthExpenses = getCurrentMonthExpenses();
            const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
            const utilization = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
            
            if (utilization >= 90) {
                showNotification(
                    'বাজেট সতর্কতা!',
                    `আপনার বাজেটের ৯০% এর বেশি ব্যবহার করা হয়েছে! অবশিষ্ট ব্যালেন্স: ৳${(monthlyBudget - totalExpenses).toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    'danger'
                );
            } else if (utilization >= 75) {
                showNotification(
                    'বাজেট সতর্কতা',
                    `আপনার বাজেটের ৭৫% ব্যবহার করা হয়েছে। সতর্কতার সাথে ব্যয় করুন।`,
                    'warning'
                );
            }
            
            // Monthly reminder on the 25th
            const now = new Date();
            if (now.getDate() === 25 && document.getElementById('monthly-reminder-toggle').checked) {
                const remainingDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
                showNotification(
                    'মাসিক রিমাইন্ডার',
                    `মাসের মাত্র ${remainingDays} দিন বাকি! আপনার ব্যয় পর্যালোচনা করুন।`,
                    'info'
                );
            }
        }
        
        // ==========================================
        // Enhanced Error Handling
        // ==========================================
        function showAlert(type, message, duration = 3000) {
            const alertId = `${type}-alert`;
            const alertEl = document.getElementById(alertId);
            const messageEl = document.getElementById(`${type}-message`);
            
            if (!alertEl || !messageEl) return;
            
            messageEl.textContent = message;
            alertEl.classList.add('show');
            
            setTimeout(() => {
                alertEl.classList.remove('show');
            }, duration);
        }
        
        function handleStorageError(operation, error) {
            console.error(`${operation} failed:`, error);
            showAlert('error', `ডেটা সংরক্ষণে সমস্যা: ${error.message}`);
        }
        
        function validateExpenseForm() {
            const name = document.getElementById('expense-name').value.trim();
            const amount = document.getElementById('expense-amount').value;
            const date = document.getElementById('expense-date').value;
            const category = document.getElementById('expense-category').value;
            
            if (!name) {
                showAlert('error', 'ব্যয়ের নাম দিন');
                return false;
            }
            
            if (!amount || parseFloat(amount) <= 0) {
                showAlert('error', 'বৈধ টাকার পরিমাণ লিখুন');
                return false;
            }
            
            if (!date) {
                showAlert('error', 'তারিখ নির্বাচন করুন');
                return false;
            }
            
            if (!category) {
                showAlert('error', 'একটি বিভাগ নির্বাচন করুন');
                return false;
            }
            
            return true;
        }
        
        // ==========================================
        // App Core Functionality
        // ==========================================
        // DOM Elements
        const balanceCard = document.getElementById('balance-card');
        const monthlyBudgetEl = document.getElementById('monthly-budget');
        const currentMonthExpensesEl = document.getElementById('current-month-expenses');
        const remainingBalanceEl = document.getElementById('remaining-balance');
        const budgetPercentageEl = document.getElementById('budget-percentage');
        const budgetUsedEl = document.getElementById('budget-used');
        const budgetRemainingEl = document.getElementById('budget-remaining');
        const budgetProgressBar = document.getElementById('budget-progress-bar');
        const tableBody = document.getElementById('table-body');
        const chartContainer = document.getElementById('chart-container');
        const successAlert = document.getElementById('success-alert');
        const errorAlert = document.getElementById('error-alert');

        // Forms
        const expenseForm = document.getElementById('expenseForm');
        const budgetForm = document.getElementById('budgetForm');
        const feedbackForm = document.getElementById('feedbackForm');

        // Popups
        const expensePopup = document.getElementById('expense-form');
        const budgetPopup = document.getElementById('budget-form');
        const feedbackPopup = document.getElementById('feedback-form');
        const exportPopup = document.getElementById('export-options');

        // Buttons
        const addExpenseBtn = document.getElementById('add-expense-fab');
        const addBudgetBtn = document.getElementById('add-budget-fab');
        const feedbackBtn = document.getElementById('feedback-btn');
        const deleteAllBtn = document.getElementById('delete-all-btn');
        const exportBtn = document.getElementById('export-btn');
        const exportTextBtn = document.getElementById('export-text-btn');
        const exportPdfBtn = document.getElementById('export-pdf-btn');
        const settingsBtn = document.getElementById('settings-btn');
        const closeBtns = document.querySelectorAll('.close-btn');
        const restartTutorialBtn = document.getElementById('restart-tutorial');

        // App state
        let expenses = [];
        let monthlyBudget = 0;
        let lastResetMonth = new Date().getMonth();
        let lastResetYear = new Date().getFullYear();

        // Bengali month names
        const bengaliMonths = [
            "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", 
            "মে", "জুন", "জুলাই", "আগস্ট", 
            "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
        ];

        // Initialize the app
        function initApp() {
            try {
                // Load data from localStorage with error handling
                const storedExpenses = localStorage.getItem('expenses');
                expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
                
                monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget') || 0;
                lastResetMonth = parseInt(localStorage.getItem('lastResetMonth')) || new Date().getMonth();
                lastResetYear = parseInt(localStorage.getItem('lastResetYear')) || new Date().getFullYear();
                
                checkResetBudget();
                updateBudgetDisplay();
                renderExpenses();
                renderExpenseChart();
                
                // Set max date to today for expense date
                document.getElementById('expense-date').max = new Date().toISOString().split('T')[0];
                document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
                
                // Start onboarding if not completed
                if (!onboardingCompleted) {
                    setTimeout(() => startOnboarding(), 1000);
                }
                
                // Check for notifications periodically
                setInterval(checkBudgetNotifications, 60000);
                checkBudgetNotifications();
                
            } catch (error) {
                handleStorageError('ডেটা লোড করা', error);
            }
        }

        // Check if we need to reset the budget (new month)
        function checkResetBudget() {
            try {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                if (currentMonth !== lastResetMonth || currentYear !== lastResetYear) {
                    expenses = expenses.filter(expense => {
                        const expenseDate = new Date(expense.date);
                        return expenseDate.getMonth() === currentMonth && 
                               expenseDate.getFullYear() === currentYear;
                    });
                    
                    localStorage.setItem('expenses', JSON.stringify(expenses));
                    lastResetMonth = currentMonth;
                    lastResetYear = currentYear;
                    localStorage.setItem('lastResetMonth', lastResetMonth);
                    localStorage.setItem('lastResetYear', lastResetYear);
                    
                    showNotification(
                        'নতুন মাস শুরু হয়েছে',
                        `আপনার বাজেট ${bengaliMonths[currentMonth]} মাসের জন্য রিসেট করা হয়েছে`,
                        'info'
                    );
                }
            } catch (error) {
                handleStorageError('বাজেট রিসেট করা', error);
            }
        }

        // Update budget and balance displays
        function updateBudgetDisplay() {
            try {
                const currentMonthExpenses = getCurrentMonthExpenses();
                const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                const remainingBalance = monthlyBudget - totalExpenses;
                const utilization = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
                
                // Update balance display with proper formatting
                monthlyBudgetEl.textContent = `৳${monthlyBudget.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                currentMonthExpensesEl.textContent = `৳${totalExpenses.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                remainingBalanceEl.textContent = `৳${remainingBalance.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                
                // Update budget utilization
                budgetPercentageEl.textContent = `${utilization.toFixed(1)}%`;
                budgetProgressBar.style.width = `${Math.min(utilization, 100)}%`;
                
                // Update budget status text
                budgetUsedEl.textContent = `৳${totalExpenses.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ব্যবহৃত`;
                budgetRemainingEl.textContent = `৳${Math.max(remainingBalance, 0).toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} অবশিষ্ট`;
                
                // Update progress bar color
                budgetProgressBar.className = '';
                if (utilization > 90) {
                    budgetProgressBar.classList.add('progress-danger');
                } else if (utilization > 75) {
                    budgetProgressBar.classList.add('progress-warning');
                }
                
                // Update balance card color
                balanceCard.style.borderLeft = remainingBalance < 0 ? '8px solid var(--accent)' : 
                                     remainingBalance === 0 ? '8px solid var(--warning)' : 
                                     '8px solid var(--success)';
            } catch (error) {
                showAlert('error', `বাজেট আপডেটে সমস্যা: ${error.message}`);
            }
        }

        // Get expenses for current month
        function getCurrentMonthExpenses() {
            try {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                
                return expenses.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() === currentMonth && 
                           expenseDate.getFullYear() === currentYear;
                });
            } catch (error) {
                showAlert('error', `ব্যয় ফিল্টারে সমস্যা: ${error.message}`);
                return [];
            }
        }

        // Render expenses in table
        function renderExpenses() {
            try {
                const currentMonthExpenses = getCurrentMonthExpenses();
                
                if (currentMonthExpenses.length === 0) {
                    tableBody.innerHTML = `
                        <tr class="empty-row">
                            <td colspan="5">
                                <div class="empty-state">
                                    <i class="fas fa-receipt"></i>
                                    <p>এই মাসে কোনো ব্যয় যোগ করা হয়নি</p>
                                </div>
                            </td>
                        </tr>
                    `;
                    return;
                }
                
                tableBody.innerHTML = '';
                
                currentMonthExpenses.forEach((expense, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${expense.name}</td>
                        <td>৳${parseFloat(expense.amount).toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${formatDate(expense.date)}</td>
                        <td><span class="category-badge" data-category="${expense.category}">${getCategoryName(expense.category)}</span></td>
                        <td>
                            <button class="delete-btn" data-index="${index}">
                                <i class="fas fa-trash"></i> মুছুন
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                
                // Add event listeners to delete buttons
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.closest('.delete-btn').dataset.index;
                        deleteExpense(index);
                    });
                });
            } catch (error) {
                showAlert('error', `ব্যয় তালিকা প্রদর্শনে সমস্যা: ${error.message}`);
            }
        }
        
        // Render expense chart
        function renderExpenseChart() {
            try {
                const currentMonthExpenses = getCurrentMonthExpenses();
                
                if (currentMonthExpenses.length === 0) {
                    chartContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-chart-bar"></i>
                            <p>কোনো ব্যয় যোগ করা হয়নি</p>
                        </div>
                    `;
                    return;
                }
                
                // Calculate expenses by category
                const categories = {
                    'Food': 0,
                    'Transport': 0,
                    'Shopping': 0,
                    'Housing': 0,
                    'Entertainment': 0,
                    'Healthcare': 0,
                    'Education': 0,
                    'Other': 0
                };
                
                currentMonthExpenses.forEach(expense => {
                    if (categories.hasOwnProperty(expense.category)) {
                        categories[expense.category] += parseFloat(expense.amount);
                    } else {
                        categories.Other += parseFloat(expense.amount);
                    }
                });
                
                // Find max value for scaling
                const maxValue = Math.max(...Object.values(categories));
                
                // Clear chart container
                chartContainer.innerHTML = '';
                
                // Create bars for each category
                for (const [category, value] of Object.entries(categories)) {
                    if (value > 0) {
                        const barHeight = maxValue > 0 ? (value / maxValue) * 150 : 0;
                        const bar = document.createElement('div');
                        bar.className = 'chart-bar';
                        bar.style.height = `${barHeight}px`;
                        
                        const valueLabel = document.createElement('div');
                        valueLabel.className = 'chart-value';
                        valueLabel.textContent = `৳${value.toLocaleString('bn-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
                        bar.appendChild(valueLabel);
                        
                        const categoryLabel = document.createElement('div');
                        categoryLabel.className = 'chart-label';
                        categoryLabel.textContent = getCategoryName(category);
                        bar.appendChild(categoryLabel);
                        
                        bar.style.backgroundColor = getCategoryColor(category);
                        
                        chartContainer.appendChild(bar);
                    }
                }
            } catch (error) {
                showAlert('error', `চার্ট তৈরি করতে সমস্যা: ${error.message}`);
            }
        }
        
        // Get category color
        function getCategoryColor(category) {
            const colors = {
                'Food': '#FF6F00',
                'Transport': '#0D47A1',
                'Shopping': '#880E4F',
                'Housing': '#1B5E20',
                'Entertainment': '#4A148C',
                'Healthcare': '#FF6F00',
                'Education': '#01579B',
                'Other': '#263238'
            };
            return colors[category] || '#4a6da7';
        }
        
        // Format date to DD/MM/YYYY
        function formatDate(dateString) {
            try {
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            } catch (error) {
                return 'অবৈধ তারিখ';
            }
        }
        
        // Get category name in Bengali
        function getCategoryName(category) {
            const categories = {
                'Food': 'খাদ্য',
                'Transport': 'পরিবহন',
                'Shopping': 'কেনাকাটা',
                'Housing': 'বাসস্থান',
                'Entertainment': 'বিনোদন',
                'Healthcare': 'স্বাস্থ্যসেবা',
                'Education': 'শিক্ষা',
                'Other': 'অন্যান্য'
            };
            return categories[category] || category;
        }
        
        // Get Bengali month name
        function getBengaliMonthName(monthIndex) {
            return bengaliMonths[monthIndex] || '';
        }

        // Add new expense
        function addExpense(name, amount, date, category) {
            try {
                if (!validateExpenseForm()) return;
                
                expenses.push({
                    name,
                    amount: parseFloat(amount),
                    date,
                    category
                });
                
                localStorage.setItem('expenses', JSON.stringify(expenses));
                updateBudgetDisplay();
                renderExpenses();
                renderExpenseChart();
                
                showNotification(
                    'নতুন ব্যয় যোগ করা হয়েছে',
                    `${name} - ৳${parseFloat(amount).toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    'success'
                );
                
                checkBudgetNotifications();
            } catch (error) {
                handleStorageError('ব্যয় সংরক্ষণ করা', error);
            }
        }

        // Delete expense
        function deleteExpense(index) {
            try {
                const currentMonthExpenses = getCurrentMonthExpenses();
                const expenseToDelete = currentMonthExpenses[index];
                
                const expenseIndex = expenses.findIndex(exp => 
                    exp.name === expenseToDelete.name && 
                    exp.amount === expenseToDelete.amount && 
                    exp.date === expenseToDelete.date
                );
                
                if (expenseIndex !== -1) {
                    const expenseName = expenses[expenseIndex].name;
                    expenses.splice(expenseIndex, 1);
                    localStorage.setItem('expenses', JSON.stringify(expenses));
                    updateBudgetDisplay();
                    renderExpenses();
                    renderExpenseChart();
                    
                    showNotification(
                        'ব্যয় মুছে ফেলা হয়েছে',
                        `${expenseName} - ৳${expenseToDelete.amount.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        'info'
                    );
                }
            } catch (error) {
                handleStorageError('ব্যয় মুছে ফেলা', error);
            }
        }

        // Delete all expenses
        function deleteAllExpenses() {
            try {
                if (expenses.length === 0) {
                    showAlert('error', 'কোনো ব্যয় মুছে ফেলার জন্য নেই');
                    return;
                }
                
                if (confirm('আপনি কি নিশ্চিত যে আপনি সমস্ত ব্যয় মুছে ফেলতে চান?')) {
                    expenses = [];
                    localStorage.removeItem('expenses');
                    updateBudgetDisplay();
                    renderExpenses();
                    renderExpenseChart();
                    
                    showNotification(
                        'সমস্ত ব্যয় মুছে ফেলা হয়েছে',
                        'আপনার সমস্ত ব্যয়ের তথ্য মুছে ফেলা হয়েছে',
                        'info'
                    );
                }
            } catch (error) {
                handleStorageError('সমস্ত ব্যয় মুছে ফেলা', error);
            }
        }

        // Set monthly budget
        function setMonthlyBudget(amount) {
            try {
                // Clean input and convert to number
                const numericValue = amount.toString().replace(/[^0-9.]/g, '');
                const budgetValue = parseFloat(numericValue);
                
                if (isNaN(budgetValue) || budgetValue <= 0) {
                    showAlert('error', 'বাজেটের জন্য একটি বৈধ ধনাত্মক সংখ্যা লিখুন');
                    return;
                }
                
                monthlyBudget = budgetValue;
                localStorage.setItem('monthlyBudget', monthlyBudget.toString());
                updateBudgetDisplay();
                
                showNotification(
                    'বাজেট সেট করা হয়েছে',
                    `৳${budgetValue.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    'success'
                );
                
                checkBudgetNotifications();
            } catch (error) {
                handleStorageError('বাজেট সংরক্ষণ করা', error);
            }
        }

        // Submit feedback
        function submitFeedback(name, email, message) {
            try {
                if (!name || !email || !message) {
                    showAlert('error', 'সমস্ত ফিল্ড পূরণ করুন');
                    return;
                }
                
                // In a real app, this would send to a server
                console.log('Feedback submitted:', {name, email, message});
                showAlert('success', 'আপনার ফিডব্যাকের জন্য ধন্যবাদ!');
            } catch (error) {
                showAlert('error', `ফিডব্যাক জমা দিতে সমস্যা: ${error.message}`);
            }
        }
        
        // Export data to text file
        function exportToText() {
            try {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const monthName = getBengaliMonthName(currentMonth);
                
                const currentMonthExpenses = getCurrentMonthExpenses();
                const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                const remainingBalance = monthlyBudget - totalExpenses;
                
                // Create file content
                let content = `মাসিক বাজেট ও ব্যয় রিপোর্ট\n`;
                content += `==============================\n\n`;
                content += `মাস: ${monthName} ${currentYear}\n`;
                content += `বাজেট: ৳${monthlyBudget.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
                content += `ব্যয়ের তালিকা:\n`;
                content += `----------------------------\n`;
                
                if (currentMonthExpenses.length === 0) {
                    content += `কোনো ব্যয় যোগ করা হয়নি\n`;
                } else {
                    currentMonthExpenses.forEach((expense, index) => {
                        content += `${index+1}. ${expense.name} - ৳${expense.amount.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${getCategoryName(expense.category)}) - ${formatDate(expense.date)}\n`;
                    });
                }
                
                content += `\n`;
                content += `মোট ব্যয়: ৳${totalExpenses.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                content += `অবশিষ্ট ব্যালেন্স: ৳${remainingBalance.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
                content += `==============================\n`;
                content += `রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}\n`;
                
                // Create Blob and download
                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `বাজেট_রিপোর্ট_${monthName}_${currentYear}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showNotification(
                    'ডেটা এক্সপোর্ট করা হয়েছে',
                    `টেক্সট ফাইল সংরক্ষণ করা হয়েছে: ${monthName} ${currentYear}`,
                    'success'
                );
            } catch (error) {
                showAlert('error', `ফাইল এক্সপোর্ট করতে সমস্যা: ${error.message}`);
            }
        }
        
        // Export data to PDF
        function exportToPDF() {
            try {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                const monthName = getBengaliMonthName(currentMonth);
                
                const currentMonthExpenses = getCurrentMonthExpenses();
                const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
                const remainingBalance = monthlyBudget - totalExpenses;
                
                // Create PDF content
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF();
                
                // Set title
                pdf.setFontSize(18);
                pdf.text('মাসিক বাজেট ও ব্যয় রিপোর্ট', 105, 15, null, null, 'center');
                
                // Set subtitle
                pdf.setFontSize(14);
                pdf.text(`মাস: ${monthName} ${currentYear}`, 105, 25, null, null, 'center');
                
                // Set report date
                pdf.setFontSize(12);
                pdf.text(`রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 15, 35);
                
                // Budget summary
                pdf.setFontSize(14);
                pdf.text('আর্থিক সারাংশ', 15, 45);
                
                pdf.setFontSize(12);
                pdf.text(`মাসিক বাজেট: ৳${monthlyBudget.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, 55);
                pdf.text(`মোট ব্যয়: ৳${totalExpenses.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, 65);
                pdf.text(`অবশিষ্ট ব্যালেন্স: ৳${remainingBalance.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, 75);
                
                // Expense list
                pdf.setFontSize(14);
                pdf.text('ব্যয়ের তালিকা:', 15, 90);
                
                if (currentMonthExpenses.length === 0) {
                    pdf.setFontSize(12);
                    pdf.text('কোনো ব্যয় যোগ করা হয়নি', 20, 100);
                } else {
                    // Table headers
                    pdf.setFontSize(12);
                    pdf.setFillColor(74, 109, 167);
                    pdf.setTextColor(255, 255, 255);
                    pdf.rect(15, 95, 180, 10, 'F');
                    pdf.text('ব্যয়ের নাম', 20, 101);
                    pdf.text('পরিমাণ', 80, 101);
                    pdf.text('বিভাগ', 120, 101);
                    pdf.text('তারিখ', 160, 101);
                    
                    // Table rows
                    pdf.setTextColor(0, 0, 0);
                    let y = 105;
                    currentMonthExpenses.forEach((expense, index) => {
                        if (y > 280) {
                            pdf.addPage();
                            y = 20;
                        }
                        
                        pdf.text(expense.name, 20, y);
                        pdf.text(`৳${expense.amount.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 80, y);
                        pdf.text(getCategoryName(expense.category), 120, y);
                        pdf.text(formatDate(expense.date), 160, y);
                        
                        y += 10;
                    });
                }
                
                // Save PDF
                pdf.save(`বাজেট_রিপোর্ট_${monthName}_${currentYear}.pdf`);
                showNotification(
                    'ডেটা এক্সপোর্ট করা হয়েছে',
                    `পিডিএফ ফাইল সংরক্ষণ করা হয়েছে: ${monthName} ${currentYear}`,
                    'success'
                );
            } catch (error) {
                showAlert('error', `পিডিএফ তৈরি করতে সমস্যা: ${error.message}`);
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', initApp);

        // Form submission handlers
        expenseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('expense-name').value;
            const amount = document.getElementById('expense-amount').value;
            const date = document.getElementById('expense-date').value;
            const category = document.getElementById('expense-category').value;
            
            addExpense(name, amount, date, category);
            expensePopup.classList.remove('active');
            expenseForm.reset();
            document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
        });

        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amountInput = document.getElementById('monthly-budget-input');
            const amount = amountInput.value.trim();
            
            setMonthlyBudget(amount);
            budgetPopup.classList.remove('active');
            budgetForm.reset();
        });

        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('feedback-name').value;
            const email = document.getElementById('feedback-email').value;
            const message = document.getElementById('feedback-message').value;
            
            submitFeedback(name, email, message);
            feedbackPopup.classList.remove('active');
            feedbackForm.reset();
        });

        // Button click handlers
        addExpenseBtn.addEventListener('click', () => {
            expensePopup.classList.add('active');
        });

        addBudgetBtn.addEventListener('click', () => {
            budgetPopup.classList.add('active');
        });

        feedbackBtn.addEventListener('click', () => {
            feedbackPopup.classList.add('active');
        });

        deleteAllBtn.addEventListener('click', deleteAllExpenses);
        
        exportBtn.addEventListener('click', () => {
            exportPopup.classList.add('active');
        });
        
        exportTextBtn.addEventListener('click', () => {
            exportToText();
            exportPopup.classList.remove('active');
        });
        
        exportPdfBtn.addEventListener('click', () => {
            exportToPDF();
            exportPopup.classList.remove('active');
        });
        
        settingsBtn.addEventListener('click', () => {
            const panel = document.getElementById('settings-panel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });
        
        restartTutorialBtn.addEventListener('click', () => {
            document.getElementById('settings-panel').style.display = 'none';
            localStorage.removeItem('onboardingCompleted');
            onboardingCompleted = false;
            startOnboarding();
        });

        // Close popups
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                expensePopup.classList.remove('active');
                budgetPopup.classList.remove('active');
                feedbackPopup.classList.remove('active');
                exportPopup.classList.remove('active');
            });
        });

        // Close popups when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === expensePopup) expensePopup.classList.remove('active');
            if (e.target === budgetPopup) budgetPopup.classList.remove('active');
            if (e.target === feedbackPopup) feedbackPopup.classList.remove('active');
            if (e.target === exportPopup) exportPopup.classList.remove('active');
            
            // Close settings panel when clicking outside
            const settingsPanel = document.getElementById('settings-panel');
            if (settingsPanel.style.display === 'block' && 
                !settingsPanel.contains(e.target) && 
                e.target !== settingsBtn) {
                settingsPanel.style.display = 'none';
            }
        });
        
        // Onboarding navigation
        document.getElementById('onboarding-next').addEventListener('click', nextStep);
        document.getElementById('onboarding-prev').addEventListener('click', prevStep);
        document.getElementById('onboarding-skip').addEventListener('click', finishOnboarding);