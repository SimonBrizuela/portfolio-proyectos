// Pomodoro Timer - JavaScript

class PomodoroTimer {
    constructor() {
        this.settings = this.loadSettings();
        this.stats = this.loadStats();
        this.tasks = this.loadTasks();
        this.currentMode = 'pomodoro';
        this.timeLeft = this.settings.pomodoro * 60;
        this.isRunning = false;
        this.intervalId = null;
        this.totalSeconds = this.settings.pomodoro * 60;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupProgressRing();
        this.updateDisplay();
        this.renderTasks();
        this.updateStats();
        this.requestNotificationPermission();
        this.checkNewDay();
    }

    setupElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.sessionLabel = document.getElementById('sessionLabel');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.settingsToggle = document.getElementById('settingsToggle');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        
        // Settings inputs
        this.pomodoroTimeInput = document.getElementById('pomodoroTime');
        this.shortBreakTimeInput = document.getElementById('shortBreakTime');
        this.longBreakTimeInput = document.getElementById('longBreakTime');
        this.autoStartBreaks = document.getElementById('autoStartBreaks');
        this.autoStartPomodoros = document.getElementById('autoStartPomodoros');
        this.enableNotifications = document.getElementById('enableNotifications');
        this.saveSettingsBtn = document.getElementById('saveSettings');
        
        // Load settings into inputs
        this.pomodoroTimeInput.value = this.settings.pomodoro;
        this.shortBreakTimeInput.value = this.settings.shortBreak;
        this.longBreakTimeInput.value = this.settings.longBreak;
        this.autoStartBreaks.checked = this.settings.autoStartBreaks;
        this.autoStartPomodoros.checked = this.settings.autoStartPomodoros;
        this.enableNotifications.checked = this.settings.enableNotifications;
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });
        
        this.settingsToggle.addEventListener('click', () => {
            this.settingsPanel.classList.toggle('hidden');
        });
        
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    setupProgressRing() {
        this.circle = document.querySelector('.progress-ring-circle');
        const radius = this.circle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = '0';
    }

    updateProgressRing() {
        const percent = this.timeLeft / this.totalSeconds;
        const offset = this.circumference - (percent * this.circumference);
        this.circle.style.strokeDashoffset = offset;
    }

    start() {
        this.isRunning = true;
        this.startBtn.classList.add('hidden');
        this.pauseBtn.classList.remove('hidden');
        
        this.intervalId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            this.updateProgressRing();
            
            if (this.timeLeft === 0) {
                this.timerComplete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        this.pauseBtn.classList.add('hidden');
        this.startBtn.classList.remove('hidden');
        clearInterval(this.intervalId);
    }

    reset() {
        this.pause();
        this.timeLeft = this.totalSeconds;
        this.updateDisplay();
        this.updateProgressRing();
    }

    timerComplete() {
        this.pause();
        this.playSound();
        
        if (this.currentMode === 'pomodoro') {
            this.stats.completedPomodoros++;
            this.stats.totalTime += this.settings.pomodoro;
            this.stats.currentStreak++;
            this.saveStats();
            this.updateStats();
            this.showNotification('Session Complete!', 'Great work! Time for a break.');
            
            // Auto-start break if enabled
            if (this.settings.autoStartBreaks) {
                setTimeout(() => {
                    const nextMode = this.stats.completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
                    this.switchMode(nextMode);
                    this.start();
                }, 2000);
            }
        } else {
            this.showNotification('Break Complete!', 'Time to get back to work.');
            
            // Auto-start pomodoro if enabled
            if (this.settings.autoStartPomodoros) {
                setTimeout(() => {
                    this.switchMode('pomodoro');
                    this.start();
                }, 2000);
            }
        }
    }

    switchMode(mode) {
        this.pause();
        this.currentMode = mode;
        
        // Update active button
        this.modeBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // Set time based on mode
        switch(mode) {
            case 'pomodoro':
                this.timeLeft = this.settings.pomodoro * 60;
                this.totalSeconds = this.settings.pomodoro * 60;
                this.sessionLabel.textContent = 'Work Session';
                this.circle.style.stroke = '#667eea';
                break;
            case 'shortBreak':
                this.timeLeft = this.settings.shortBreak * 60;
                this.totalSeconds = this.settings.shortBreak * 60;
                this.sessionLabel.textContent = 'Short Break';
                this.circle.style.stroke = '#38ef7d';
                break;
            case 'longBreak':
                this.timeLeft = this.settings.longBreak * 60;
                this.totalSeconds = this.settings.longBreak * 60;
                this.sessionLabel.textContent = 'Long Break';
                this.circle.style.stroke = '#f5576c';
                break;
        }
        
        this.updateDisplay();
        this.updateProgressRing();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update page title
        document.title = `${this.timeDisplay.textContent} - Pomodoro Timer`;
    }

    saveSettings() {
        this.settings = {
            pomodoro: parseInt(this.pomodoroTimeInput.value),
            shortBreak: parseInt(this.shortBreakTimeInput.value),
            longBreak: parseInt(this.longBreakTimeInput.value),
            autoStartBreaks: this.autoStartBreaks.checked,
            autoStartPomodoros: this.autoStartPomodoros.checked,
            enableNotifications: this.enableNotifications.checked
        };
        
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
        this.switchMode(this.currentMode); // Update times
        alert('Settings saved successfully');
    }

    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        return saved ? JSON.parse(saved) : {
            pomodoro: 25,
            shortBreak: 5,
            longBreak: 15,
            autoStartBreaks: false,
            autoStartPomodoros: false,
            enableNotifications: true
        };
    }

    // Tasks Management
    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;
        
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            pomodoros: 0
        };
        
        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.taskInput.value = '';
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No tasks yet</p>';
            return;
        }
        
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <span class="task-pomodoros">${task.pomodoros} sessions</span>
                <button class="delete-task">Delete</button>
            `;
            
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => this.toggleTask(task.id));
            
            const deleteBtn = li.querySelector('.delete-task');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            
            this.taskList.appendChild(li);
        });
    }

    saveTasks() {
        localStorage.setItem('pomodoroTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('pomodoroTasks');
        return saved ? JSON.parse(saved) : [];
    }

    // Statistics
    updateStats() {
        document.getElementById('completedPomodoros').textContent = this.stats.completedPomodoros;
        const hours = Math.floor(this.stats.totalTime / 60);
        const minutes = this.stats.totalTime % 60;
        document.getElementById('totalTime').textContent = `${hours}h ${minutes}m`;
        document.getElementById('currentStreak').textContent = this.stats.currentStreak;
    }

    saveStats() {
        this.stats.lastDate = new Date().toDateString();
        localStorage.setItem('pomodoroStats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('pomodoroStats');
        return saved ? JSON.parse(saved) : {
            completedPomodoros: 0,
            totalTime: 0,
            currentStreak: 0,
            lastDate: new Date().toDateString()
        };
    }

    checkNewDay() {
        const today = new Date().toDateString();
        if (this.stats.lastDate !== today) {
            this.stats.completedPomodoros = 0;
            this.stats.totalTime = 0;
            this.stats.currentStreak = 0;
            this.saveStats();
            this.updateStats();
        }
    }

    // Notifications
    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }
    }

    showNotification(title, body) {
        if (!this.settings.enableNotifications) return;
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body
            });
        }
    }

    playSound() {
        // Simple beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
