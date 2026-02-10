/**
 * APP.JS
 * Main application entry point
 * Connects all modules and handles global interactions
 */

// Global instances
let progressManager;
let gamificationManager;
let uiManager;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Create manager instances
    progressManager = new ProgressManager();
    gamificationManager = new GamificationManager(progressManager);
    uiManager = new UIManager(progressManager, gamificationManager);

    // Initialize UI
    uiManager.init();

    // Setup global event listeners
    setupEventListeners();

    // Check and reset daily goal if needed
    progressManager.resetDailyGoal();

    console.log('🦈 PyShark Academy initialized successfully!');
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Multiple choice options
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('option-item') && 
            !e.target.classList.contains('disabled')) {
            selectOption(e.target);
        }
    });

    // Code input - check on Enter key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.id === 'codeInput') {
            checkAnswer();
        }
    });
}

/**
 * Navigate to dashboard
 */
function showDashboard() {
    uiManager.showView('dashboard');
}

/**
 * Navigate to lesson map
 */
function showLessonMap() {
    uiManager.showView('lessonMap');
    uiManager.renderLessonMap();
}

/**
 * Navigate to profile
 */
function showProfile() {
    uiManager.showView('profile');
    uiManager.updateProfile();
}

/**
 * Exit current lesson
 */
function exitLesson() {
    if (confirm('Вы уверены, что хотите выйти из урока?')) {
        showLessonMap();
    }
}

/**
 * Select an option in multiple choice
 */
function selectOption(element) {
    // Remove previous selection
    document.querySelectorAll('.option-item').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select new option
    element.classList.add('selected');
}

/**
 * Check the current answer
 */
function checkAnswer() {
    const lesson = uiManager.currentLessonData;
    const question = lesson.questions[uiManager.currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    let isCorrect = false;

    // Handle explanation type - always correct
    if (question.type === 'explanation') {
        nextQuestion();
        return;
    }

    // Handle multiple choice
    if (question.type === 'multiple') {
        const selected = document.querySelector('.option-item.selected');
        
        if (!selected) {
            alert('Пожалуйста, выберите ответ!');
            return;
        }

        const selectedIndex = parseInt(selected.dataset.index);
        isCorrect = selectedIndex === question.correct;

        // Disable all options
        document.querySelectorAll('.option-item').forEach(opt => {
            opt.classList.add('disabled');
            const index = parseInt(opt.dataset.index);
            
            if (index === question.correct) {
                opt.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                opt.classList.add('wrong');
            }
        });

        // Show feedback
        feedback.className = 'feedback-card show ' + (isCorrect ? 'correct' : 'wrong');
        feedback.innerHTML = isCorrect 
            ? '🦈 Правильно! Отлично! +10 XP'
            : `❌ Неправильно. ${question.explanation || 'Попробуйте еще раз в следующий раз!'}`;
    }

    // Handle code input
    if (question.type === 'code') {
        const userCode = document.getElementById('codeInput').value.trim();
        const correctCode = question.answer.trim();

        // Normalize code for comparison (remove extra spaces, case-insensitive for Python keywords)
        const normalizeCode = (code) => {
            return code.replace(/\s+/g, ' ').toLowerCase();
        };

        isCorrect = normalizeCode(userCode) === normalizeCode(correctCode);

        const codeInput = document.getElementById('codeInput');
        codeInput.style.borderColor = isCorrect ? '#32CD32' : '#ff1493';
        codeInput.disabled = true;

        feedback.className = 'feedback-card show ' + (isCorrect ? 'correct' : 'wrong');
        feedback.innerHTML = isCorrect 
            ? '🦈 Код правильный! Отлично! +15 XP'
            : `❌ Код неправильный. Правильный ответ:<br><code style="background: #f0f0f0; padding: 5px 10px; border-radius: 5px; display: inline-block; margin-top: 10px;">${question.answer}</code>`;
    }

    // Record answer
    uiManager.lessonAnswers.push(isCorrect);
    progressManager.answerQuestion(isCorrect);

    // Show celebration for correct answer
    if (isCorrect) {
        const shark = document.getElementById('floatingShark');
        shark.style.transform = 'scale(1.3) translateY(-20px)';
        setTimeout(() => {
            shark.style.transform = '';
        }, 500);
    }

    // Update UI
    document.getElementById('lessonCheckBtn').style.display = 'none';
    document.getElementById('lessonNextBtn').style.display = 'inline-block';
    document.getElementById('lessonSkipBtn').style.display = 'none';
}

/**
 * Skip current question
 */
function skipQuestion() {
    if (confirm('Пропустить этот вопрос? Вы не получите за него баллы.')) {
        uiManager.lessonAnswers.push(false);
        progressManager.answerQuestion(false);
        nextQuestion();
    }
}

/**
 * Move to next question or show summary
 */
function nextQuestion() {
    uiManager.currentQuestionIndex++;
    
    const lesson = uiManager.currentLessonData;
    
    // Check if there are more questions
    if (uiManager.currentQuestionIndex < lesson.questions.length) {
        uiManager.renderQuestion();
    } else {
        // Show lesson summary
        uiManager.showLessonSummary();
    }
}

/**
 * Reset all progress
 */
function resetProgress() {
    progressManager.reset();
}

/**
 * Share progress (optional feature)
 */
function shareProgress() {
    const stats = progressManager.getProfileStats();
    const text = `Я прошел ${stats.completedLessons} уроков в PyShark Academy и набрал ${stats.xp} XP! 🦈✨`;
    
    if (navigator.share) {
        navigator.share({
            title: 'PyShark Academy',
            text: text,
            url: window.location.href
        }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Статистика скопирована в буфер обмена!');
        });
    }
}

/**
 * Export progress as JSON (for backup)
 */
function exportProgress() {
    const data = progressManager.getData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pyshark-progress.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Import progress from JSON (for restore)
 */
function importProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem('pyshark_progress', JSON.stringify(data));
                alert('Прогресс успешно восстановлен!');
                window.location.reload();
            } catch (error) {
                alert('Ошибка при импорте файла!');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * Get daily motivational quote
 */
function getDailyQuote() {
    const quotes = [
        { text: 'Каждый эксперт когда-то был новичком.', author: 'Хелен Хейс' },
        { text: 'Робототехника - это будущее, которое мы создаем сегодня.', author: 'Неизвестный' },
        { text: 'Ошибки - это просто возможности учиться.', author: 'Генри Форд' },
        { text: 'Программирование - это искусство решения проблем.', author: 'Неизвестный' },
        { text: 'Невозможное становится возможным, когда вы учитесь.', author: 'PyShark Academy' },
        { text: 'Робот не может думать за вас, но он может выполнить ваши идеи!', author: 'PyShark Academy' },
        { text: 'Каждая строка кода приближает вас к мастерству.', author: 'PyShark Academy' }
    ];
    
    const today = new Date().getDate();
    const quote = quotes[today % quotes.length];
    
    return quote;
}

/**
 * Show daily quote on dashboard
 */
function showDailyQuote() {
    const quote = getDailyQuote();
    const quoteDiv = document.createElement('div');
    quoteDiv.style.cssText = `
        background: linear-gradient(135deg, #ff69b4, #ff1493);
        color: white;
        padding: 20px;
        border-radius: 15px;
        margin: 20px 0;
        text-align: center;
        box-shadow: 0 5px 20px rgba(255, 105, 180, 0.3);
    `;
    quoteDiv.innerHTML = `
        <div style="font-size: 18px; font-style: italic; margin-bottom: 10px;">"${quote.text}"</div>
        <div style="font-size: 14px; opacity: 0.9;">- ${quote.author}</div>
    `;
    
    const dashboardContent = document.querySelector('.dashboard-content');
    dashboardContent.insertBefore(quoteDiv, dashboardContent.firstChild);
}

// Show daily quote on load
window.addEventListener('load', () => {
    setTimeout(showDailyQuote, 500);
});

// Console Easter Egg
console.log('%c🦈 PyShark Academy', 'font-size: 24px; color: #ff69b4; font-weight: bold;');
console.log('%cОбучайся робототехнике с розовой акулой!', 'font-size: 14px; color: #ff1493;');
console.log('%cИспользуйте exportProgress() для резервного копирования', 'font-size: 12px; color: #666;');
console.log('%cИспользуйте importProgress() для восстановления', 'font-size: 12px; color: #666;');