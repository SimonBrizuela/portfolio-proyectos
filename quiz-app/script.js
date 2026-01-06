// Quiz Application - JavaScript

class QuizApp {
    constructor() {
        this.selectedCategory = null;
        this.selectedDifficulty = 'easy';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timerInterval = null;
        this.timeLeft = 30;
        this.startTime = 0;
        this.stats = this.loadStats();
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.updateStatsDisplay();
    }

    setupElements() {
        // Screens
        this.startScreen = document.getElementById('startScreen');
        this.quizScreen = document.getElementById('quizScreen');
        this.resultsScreen = document.getElementById('resultsScreen');
        
        // Start screen elements
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');
        this.startQuizBtn = document.getElementById('startQuizBtn');
        
        // Quiz screen elements
        this.currentQuestionEl = document.getElementById('currentQuestion');
        this.totalQuestionsEl = document.getElementById('totalQuestions');
        this.timerEl = document.getElementById('timer');
        this.progressFill = document.getElementById('progressFill');
        this.categoryBadge = document.getElementById('categoryBadge');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');
        this.nextBtn = document.getElementById('nextBtn');
        
        // Results screen elements
        this.finalScoreEl = document.getElementById('finalScore');
        this.correctAnswersEl = document.getElementById('correctAnswers');
        this.wrongAnswersEl = document.getElementById('wrongAnswers');
        this.timeTakenEl = document.getElementById('timeTaken');
        this.performanceMessageEl = document.getElementById('performanceMessage');
        this.reviewContainer = document.getElementById('reviewContainer');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.changeCategoryBtn = document.getElementById('changeCategory');
        this.scoreCircle = document.getElementById('scoreCircle');
    }

    setupEventListeners() {
        // Category selection
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.categoryBtns.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedCategory = e.target.dataset.category;
            });
        });
        
        // Difficulty selection
        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.selectedDifficulty = e.target.dataset.difficulty;
            });
        });
        
        // Start quiz
        this.startQuizBtn.addEventListener('click', () => this.startQuiz());
        
        // Next question
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        
        // Results actions
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.changeCategoryBtn.addEventListener('click', () => this.changeCategory());
    }

    startQuiz() {
        if (!this.selectedCategory) {
            alert('Please select a category');
            return;
        }
        
        // Get questions for selected category and difficulty
        this.currentQuestions = this.getQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        // Show quiz screen
        this.startScreen.classList.add('hidden');
        this.quizScreen.classList.remove('hidden');
        
        // Load first question
        this.loadQuestion();
    }

    getQuestions() {
        let questions = quizDatabase[this.selectedCategory] || [];
        
        // Filter by difficulty
        questions = questions.filter(q => q.difficulty === this.selectedDifficulty);
        
        // Shuffle and take 10 questions
        questions = this.shuffleArray(questions).slice(0, 10);
        
        return questions;
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update header
        this.currentQuestionEl.textContent = this.currentQuestionIndex + 1;
        this.totalQuestionsEl.textContent = this.currentQuestions.length;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100;
        this.progressFill.style.width = progress + '%';
        
        // Update category badge
        this.categoryBadge.textContent = this.getCategoryName(this.selectedCategory);
        
        // Update question
        this.questionText.textContent = question.question;
        
        // Load answers
        this.loadAnswers(question);
        
        // Start timer
        this.startTimer();
        
        // Hide next button
        this.nextBtn.classList.add('hidden');
    }

    loadAnswers(question) {
        this.answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.selectAnswer(index));
            this.answersContainer.appendChild(btn);
        });
    }

    selectAnswer(selectedIndex) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // Stop timer
        this.stopTimer();
        
        // Save answer
        this.userAnswers.push({
            question: question.question,
            userAnswer: question.answers[selectedIndex],
            correctAnswer: question.answers[question.correct],
            isCorrect: isCorrect
        });
        
        // Update score
        if (isCorrect) {
            this.score++;
        }
        
        // Disable all buttons and show correct/wrong
        const buttons = this.answersContainer.querySelectorAll('.answer-btn');
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });
        
        // Show next button
        this.nextBtn.classList.remove('hidden');
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    startTimer() {
        this.timeLeft = 30;
        this.timerEl.textContent = this.timeLeft;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerEl.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.selectAnswer(-1); // Time's up
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
    }

    showResults() {
        this.quizScreen.classList.add('hidden');
        this.resultsScreen.classList.remove('hidden');
        
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const percentage = Math.round((this.score / this.currentQuestions.length) * 100);
        
        // Update score circle
        this.updateScoreCircle(percentage);
        
        // Update stats
        this.finalScoreEl.textContent = percentage;
        this.correctAnswersEl.textContent = this.score;
        this.wrongAnswersEl.textContent = this.currentQuestions.length - this.score;
        this.timeTakenEl.textContent = totalTime;
        
        // Performance message
        this.performanceMessageEl.textContent = this.getPerformanceMessage(percentage);
        
        // Save stats
        this.updateStats(percentage);
        
        // Show review
        this.showReview();
    }

    updateScoreCircle(percentage) {
        const circle = this.scoreCircle;
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        setTimeout(() => {
            const offset = circumference - (percentage / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }, 100);
    }

    getPerformanceMessage(percentage) {
        if (percentage === 100) return "Perfect! Outstanding performance!";
        if (percentage >= 80) return "Excellent! Great job!";
        if (percentage >= 60) return "Good work! Keep it up!";
        if (percentage >= 40) return "Not bad. Keep practicing!";
        return "Need more practice. Don't give up!";
    }

    showReview() {
        this.reviewContainer.innerHTML = '';
        
        this.userAnswers.forEach((answer, index) => {
            const div = document.createElement('div');
            div.className = `review-item ${answer.isCorrect ? 'correct' : 'wrong'}`;
            
            div.innerHTML = `
                <div class="review-question">${index + 1}. ${answer.question}</div>
                <div class="review-answer user">Your answer: ${answer.userAnswer}</div>
                ${!answer.isCorrect ? `<div class="review-answer correct-answer">Correct answer: ${answer.correctAnswer}</div>` : ''}
            `;
            
            this.reviewContainer.appendChild(div);
        });
    }

    playAgain() {
        this.resultsScreen.classList.add('hidden');
        this.startQuiz();
    }

    changeCategory() {
        this.resultsScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
    }

    updateStats(score) {
        this.stats.totalQuizzes++;
        this.stats.totalScore += score;
        this.stats.bestScore = Math.max(this.stats.bestScore, score);
        this.saveStats();
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        document.getElementById('totalQuizzesPlayed').textContent = this.stats.totalQuizzes;
        const avgScore = this.stats.totalQuizzes > 0 ? 
            Math.round(this.stats.totalScore / this.stats.totalQuizzes) : 0;
        document.getElementById('averageScore').textContent = avgScore + '%';
        document.getElementById('bestScore').textContent = this.stats.bestScore + '%';
    }

    getCategoryName(category) {
        const names = {
            general: 'General Knowledge',
            science: 'Science',
            history: 'History',
            geography: 'Geography',
            sports: 'Sports',
            entertainment: 'Entertainment'
        };
        return names[category] || category;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    saveStats() {
        localStorage.setItem('quizStats', JSON.stringify(this.stats));
    }

    loadStats() {
        const saved = localStorage.getItem('quizStats');
        return saved ? JSON.parse(saved) : {
            totalQuizzes: 0,
            totalScore: 0,
            bestScore: 0
        };
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
