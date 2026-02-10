/**
 * UI.JS
 * User interface rendering and management
 */

class UIManager {
    constructor(progressManager, gamificationManager) {
        this.progress = progressManager;
        this.gamification = gamificationManager;
        this.currentView = 'dashboard';
        this.currentLessonData = null;
        this.currentQuestionIndex = 0;
        this.lessonScore = 0;
        this.lessonAnswers = [];
    }

    // Инициализация UI
    init() {
        this.showView('dashboard');
        this.updateAllStats();
        this.renderLessonMap();
        this.renderAllAchievements();
        this.setupEventListeners();
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Клик по плавающей акуле
        const shark = document.getElementById('floatingShark');
        if (shark) {
            shark.addEventListener('click', () => {
                this.gamification.handleSharkClick();
            });
        }
    }

    // Показать определенный view
    showView(viewName) {
        // Скрыть все views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Показать нужный view
        const targetView = document.getElementById(viewName + 'View');
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        // Обновить данные при открытии view
        if (viewName === 'dashboard') {
            this.updateDashboard();
        } else if (viewName === 'profile') {
            this.updateProfile();
        }
    }

    // Обновить все статистики
    updateAllStats() {
        const data = this.progress.getData();
        
        // Навбар
        document.getElementById('navXP').textContent = data.xp;
        document.getElementById('navStreak').textContent = data.streak;
        document.getElementById('navLevel').textContent = data.level;

        // Дашборд
        document.getElementById('totalXP').textContent = data.xp;
        document.getElementById('currentStreak').textContent = data.streak;
        document.getElementById('completedLessons').textContent = data.stats.totalLessons;
        document.getElementById('achievementCount').textContent = data.achievements.length;

        // Ежедневная цель
        this.updateDailyGoal();
    }

    // Обновить ежедневную цель
    updateDailyGoal() {
        const goal = this.progress.getData().dailyGoal;
        const progress = (goal.completed / goal.target) * 100;
        
        document.getElementById('dailyGoalText').textContent = `${goal.completed}/${goal.target} урока`;
        document.getElementById('dailyGoalFill').style.width = Math.min(progress, 100) + '%';
    }

    // Обновить дашборд
    updateDashboard() {
        this.updateAllStats();
        this.renderRecentAchievements();
    }

    // Отрисовка недавних достижений
    renderRecentAchievements() {
        const container = document.getElementById('achievementsList');
        const unlocked = this.gamification.getUnlockedAchievements();
        
        if (unlocked.length === 0) {
            container.innerHTML = `
                <div class="achievement-placeholder">
                    <span>🎯</span>
                    <p>Начните обучение, чтобы получить первое достижение!</p>
                </div>
            `;
            return;
        }

        // Показать последние 3 достижения
        const recent = unlocked.slice(-3).reverse();
        container.innerHTML = recent.map(ach => `
            <div class="achievement-item unlocked">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-name">${ach.title}</div>
                <div class="achievement-description">${ach.description}</div>
            </div>
        `).join('');
    }

    // Отрисовка карты уроков
    renderLessonMap() {
        const container = document.getElementById('lessonPath');
        container.innerHTML = '';

        let totalLessons = 0;
        let completedCount = 0;

        // Отрисовка по секциям
        for (const [key, section] of Object.entries(CURRICULUM)) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'lesson-section';

            // Заголовок секции
            sectionDiv.innerHTML = `
                <div class="section-header">
                    <div class="section-title">${section.title}</div>
                    <div class="section-description">${section.description}</div>
                </div>
                <div class="lessons-grid" id="section-${section.id}"></div>
            `;

            container.appendChild(sectionDiv);

            // Отрисовка уроков секции
            const lessonsGrid = sectionDiv.querySelector('.lessons-grid');
            section.lessons.forEach((lesson, index) => {
                const isCompleted = this.progress.isLessonCompleted(lesson.id);
                const isUnlocked = this.progress.isLessonUnlocked(lesson.id);
                
                totalLessons++;
                if (isCompleted) completedCount++;

                const lessonNode = document.createElement('div');
                lessonNode.className = 'lesson-node';
                
                let circleClass = 'lesson-circle';
                if (isCompleted) circleClass += ' completed';
                if (!isUnlocked) circleClass += ' locked';

                lessonNode.innerHTML = `
                    <div class="${circleClass}">
                        ${lesson.icon}
                        ${isCompleted ? '<div class="lesson-checkmark">✓</div>' : ''}
                    </div>
                    <div class="lesson-label">
                        <div class="lesson-title">${lesson.title}</div>
                        <div class="lesson-xp-badge">⚡ ${lesson.xp} XP</div>
                    </div>
                `;

                if (isUnlocked) {
                    lessonNode.addEventListener('click', () => {
                        this.startLesson(lesson);
                    });
                }

                lessonsGrid.appendChild(lessonNode);
            });
        }

        // Обновить общий прогресс
        const progressPercent = (completedCount / totalLessons) * 100;
        document.getElementById('pathProgressText').textContent = Math.round(progressPercent) + '%';
        document.getElementById('pathProgressFill').style.width = progressPercent + '%';
    }

    // Начать урок
    startLesson(lesson) {
        this.currentLessonData = lesson;
        this.currentQuestionIndex = 0;
        this.lessonScore = 0;
        this.lessonAnswers = [];
        
        // Проверка достижений по времени
        this.gamification.checkTimeBasedAchievements();
        
        this.showView('lesson');
        this.renderQuestion();
    }

    // Отрисовка вопроса
    renderQuestion() {
        const lesson = this.currentLessonData;
        const question = lesson.questions[this.currentQuestionIndex];
        const container = document.getElementById('lessonContent');

        // Обновить прогресс урока
        const progress = ((this.currentQuestionIndex + 1) / lesson.questions.length) * 100;
        document.getElementById('lessonProgressFill').style.width = progress + '%';
        document.getElementById('lessonProgressText').textContent = 
            `${this.currentQuestionIndex + 1}/${lesson.questions.length}`;
        document.getElementById('lessonXP').textContent = lesson.xp;

        // Сбросить кнопки
        document.getElementById('lessonCheckBtn').style.display = 'inline-block';
        document.getElementById('lessonNextBtn').style.display = 'none';
        document.getElementById('lessonSkipBtn').style.display = 
            question.type !== 'explanation' ? 'inline-block' : 'none';

        // Отрисовка в зависимости от типа вопроса
        if (question.type === 'explanation') {
            container.innerHTML = this.renderExplanation(question);
            document.getElementById('lessonCheckBtn').textContent = 'Понятно!';
        } else if (question.type === 'multiple') {
            container.innerHTML = this.renderMultipleChoice(question);
            document.getElementById('lessonCheckBtn').textContent = 'Проверить';
        } else if (question.type === 'code') {
            container.innerHTML = this.renderCodeInput(question);
            document.getElementById('lessonCheckBtn').textContent = 'Проверить';
        }
    }

    // Отрисовка объяснения
    renderExplanation(question) {
        return `
            <div class="question-card">
                <div class="question-type">📖 Теория</div>
                <div class="question-title">${question.title}</div>
                
                <div class="explanation-card">
                    ${question.emoji ? `<div style="font-size: 48px; margin-bottom: 20px;">${question.emoji}</div>` : ''}
                    <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">${question.content}</p>
                    ${question.highlight ? `<p style="background: #ffe0f0; padding: 15px; border-radius: 10px; font-weight: 600; color: #ff1493;">${question.highlight}</p>` : ''}
                </div>
                
                ${question.code ? `<div class="code-block">${this.highlightCode(question.code)}</div>` : ''}
            </div>
        `;
    }

    // Отрисовка вопроса с выбором ответа
    renderMultipleChoice(question) {
        return `
            <div class="question-card">
                <div class="question-type">❓ Вопрос</div>
                <div class="question-title">${question.question}</div>
                
                ${question.code ? `<div class="code-block">${this.highlightCode(question.code)}</div>` : ''}
                
                <div class="options-list">
                    ${question.options.map((option, index) => `
                        <div class="option-item" data-index="${index}">
                            ${option}
                        </div>
                    `).join('')}
                </div>
                
                <div class="feedback-card" id="feedback"></div>
            </div>
        `;
    }

    // Отрисовка вопроса с вводом кода
    renderCodeInput(question) {
        return `
            <div class="question-card">
                <div class="question-type">💻 Код</div>
                <div class="question-title">${question.question}</div>
                
                ${question.hint ? `<div class="input-hint">💡 ${question.hint}</div>` : ''}
                
                <input type="text" class="code-input" id="codeInput" 
                       placeholder="Введите ваш код здесь..." autocomplete="off">
                
                <div class="feedback-card" id="feedback"></div>
            </div>
        `;
    }

    // Подсветка синтаксиса кода
    highlightCode(code) {
        return code
            .replace(/\n/g, '<br>')
            .replace(/(#.*)/g, '<span class="code-comment">$1</span>')
            .replace(/\b(from|import|def|class|if|else|elif|while|for|in|return|True|False)\b/g, 
                '<span class="code-keyword">$1</span>')
            .replace(/(['"].*?['"])/g, '<span class="code-string">$1</span>')
            .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>');
    }

    // Обновить профиль
    updateProfile() {
        const stats = this.progress.getProfileStats();
        
        document.getElementById('profileLevel').textContent = `Уровень ${stats.level}`;
        document.getElementById('profileXP').textContent = stats.xp;
        document.getElementById('profileStreak').textContent = stats.streak;
        document.getElementById('profileCompleted').textContent = stats.completedLessons;
        
        this.renderAllAchievements();
    }

    // Отрисовка всех достижений
    renderAllAchievements() {
        const container = document.getElementById('allAchievements');
        const unlocked = this.gamification.getUnlockedAchievements();
        const locked = this.gamification.getLockedAchievements();
        const unlockedIds = unlocked.map(a => a.id);

        const allAchievements = this.gamification.getAllAchievements();
        
        container.innerHTML = allAchievements.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return `
                <div class="achievement-item ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${ach.icon}</div>
                    <div class="achievement-name">${ach.title}</div>
                    <div class="achievement-description">${ach.description}</div>
                    ${!isUnlocked ? '<div class="achievement-description">🔒 Заблокировано</div>' : ''}
                </div>
            `;
        }).join('');
    }

    // Показать результаты урока
    showLessonSummary() {
        const lesson = this.currentLessonData;
        const totalQuestions = this.lessonAnswers.length;
        const correctAnswers = this.lessonAnswers.filter(a => a).length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        this.lessonScore = score;

        const container = document.getElementById('lessonContent');
        
        // Завершаем урок в прогрессе
        this.progress.completeLesson(lesson.id, score);
        
        // Начисляем XP
        const xpEarned = Math.round(lesson.xp * (score / 100));
        const result = this.progress.addXP(xpEarned);

        // Проверяем ежедневную цель
        const goalCompleted = this.gamification.checkDailyGoal();

        container.innerHTML = `
            <div class="summary-test">
                <div class="summary-icon">${score === 100 ? '🏆' : score >= 70 ? '🎉' : '📚'}</div>
                <div class="summary-title">
                    ${score === 100 ? 'Идеально!' : score >= 70 ? 'Отличная работа!' : 'Урок завершен!'}
                </div>
                <div class="summary-description">
                    Вы набрали ${score}% и получили ${xpEarned} XP!
                </div>
                
                <div class="summary-stats">
                    <div class="summary-stat">
                        <div class="summary-stat-value">${correctAnswers}/${totalQuestions}</div>
                        <div class="summary-stat-label">Верных ответов</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-value">${score}%</div>
                        <div class="summary-stat-label">Точность</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-value">+${xpEarned}</div>
                        <div class="summary-stat-label">XP получено</div>
                    </div>
                </div>
                
                ${result.levelUp ? `
                    <div style="background: linear-gradient(135deg, #ff69b4, #ff1493); 
                                color: white; padding: 20px; border-radius: 15px; 
                                margin: 20px 0; font-size: 20px; font-weight: 700;">
                        🎊 Повышение уровня! Теперь вы ${result.newLevel} уровня!
                    </div>
                ` : ''}
                
                ${goalCompleted ? `
                    <div style="background: #90EE90; padding: 15px; 
                                border-radius: 10px; margin: 15px 0;">
                        🎯 Ежедневная цель выполнена!
                    </div>
                ` : ''}
            </div>
        `;

        // Скрыть кнопки проверки
        document.getElementById('lessonCheckBtn').style.display = 'none';
        document.getElementById('lessonNextBtn').style.display = 'none';
        document.getElementById('lessonSkipBtn').style.display = 'none';

        // Показать празднование
        this.gamification.showCelebration(
            score === 100 ? 'Идеальный результат! 🏆' : 'Урок завершен! 🎉'
        );

        // Обновить статистику
        this.updateAllStats();

        // Автоматически вернуться к карте через 5 секунд
        setTimeout(() => {
            this.exitLesson();
        }, 5000);
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIManager };
}