/**
 * PROGRESS.JS
 * User progress tracking and management
 */

class ProgressManager {
    constructor() {
        this.loadProgress();
    }

    // Загрузка прогресса из localStorage
    loadProgress() {
        const saved = localStorage.getItem('pyshark_progress');
        if (saved) {
            this.data = JSON.parse(saved);
        } else {
            this.data = this.getDefaultProgress();
        }
        
        // Обновляем дату последнего визита для подсчета серии
        this.updateStreak();
    }

    // Начальное состояние прогресса
    getDefaultProgress() {
        return {
            xp: 0,
            level: 1,
            streak: 0,
            lastVisit: new Date().toDateString(),
            completedLessons: [],
            currentLesson: null,
            achievements: [],
            dailyGoal: {
                target: 3,
                completed: 0,
                lastReset: new Date().toDateString()
            },
            stats: {
                totalLessons: 0,
                perfectScore: 0,
                questionsAnswered: 0,
                correctAnswers: 0
            }
        };
    }

    // Сохранение прогресса
    save() {
        localStorage.setItem('pyshark_progress', JSON.stringify(this.data));
    }

    // Обновление серии дней
    updateStreak() {
        const today = new Date().toDateString();
        const lastVisit = this.data.lastVisit;
        
        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastVisit === yesterday.toDateString()) {
                // Пользователь был вчера - продолжаем серию
                this.data.streak++;
            } else {
                // Серия прервана
                this.data.streak = 1;
            }
            
            this.data.lastVisit = today;
            this.save();
        }
    }

    // Сброс ежедневной цели
    resetDailyGoal() {
        const today = new Date().toDateString();
        if (this.data.dailyGoal.lastReset !== today) {
            this.data.dailyGoal.completed = 0;
            this.data.dailyGoal.lastReset = today;
            this.save();
        }
    }

    // Добавление XP
    addXP(amount) {
        this.data.xp += amount;
        
        // Проверка повышения уровня
        const newLevel = this.calculateLevel(this.data.xp);
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            this.unlockAchievement('level_' + newLevel);
            return { levelUp: true, newLevel: newLevel };
        }
        
        this.save();
        return { levelUp: false };
    }

    // Расчет уровня на основе XP
    calculateLevel(xp) {
        // Формула: уровень = floor(sqrt(xp / 100)) + 1
        return Math.floor(Math.sqrt(xp / 100)) + 1;
    }

    // Получение XP для следующего уровня
    getXPForNextLevel() {
        const nextLevel = this.data.level + 1;
        return (nextLevel - 1) * (nextLevel - 1) * 100;
    }

    // Завершение урока
    completeLesson(lessonId, score) {
        if (!this.data.completedLessons.includes(lessonId)) {
            this.data.completedLessons.push(lessonId);
            this.data.stats.totalLessons++;
            
            // Обновление ежедневной цели
            this.data.dailyGoal.completed++;
            
            // Проверка достижений
            this.checkLessonAchievements();
            
            if (score === 100) {
                this.data.stats.perfectScore++;
            }
        }
        
        this.save();
    }

    // Проверка, завершен ли урок
    isLessonCompleted(lessonId) {
        return this.data.completedLessons.includes(lessonId);
    }

    // Ответ на вопрос
    answerQuestion(correct) {
        this.data.stats.questionsAnswered++;
        if (correct) {
            this.data.stats.correctAnswers++;
        }
        this.save();
    }

    // Получение точности ответов
    getAccuracy() {
        if (this.data.stats.questionsAnswered === 0) return 0;
        return Math.round((this.data.stats.correctAnswers / this.data.stats.questionsAnswered) * 100);
    }

    // Разблокировка достижения
    unlockAchievement(achievementId) {
        if (!this.data.achievements.includes(achievementId)) {
            this.data.achievements.push(achievementId);
            this.save();
            return true;
        }
        return false;
    }

    // Проверка достижений связанных с уроками
    checkLessonAchievements() {
        const completed = this.data.stats.totalLessons;
        
        if (completed === 1) this.unlockAchievement('first_lesson');
        if (completed === 5) this.unlockAchievement('5_lessons');
        if (completed === 10) this.unlockAchievement('10_lessons');
        if (completed === this.getAllLessons().length) {
            this.unlockAchievement('all_lessons');
        }
        
        // Проверка серии
        if (this.data.streak === 7) this.unlockAchievement('week_streak');
        if (this.data.streak === 30) this.unlockAchievement('month_streak');
        
        // Проверка перфекта
        if (this.data.stats.perfectScore === 5) this.unlockAchievement('perfectionist');
    }

    // Получение всех уроков
    getAllLessons() {
        const lessons = [];
        for (const section of Object.values(CURRICULUM)) {
            lessons.push(...section.lessons);
        }
        return lessons;
    }

    // Получение прогресса в процентах
    getOverallProgress() {
        const total = this.getAllLessons().length;
        const completed = this.data.completedLessons.length;
        return Math.round((completed / total) * 100);
    }

    // Получение следующего доступного урока
    getNextLesson() {
        const allLessons = this.getAllLessons();
        for (const lesson of allLessons) {
            if (!this.isLessonCompleted(lesson.id)) {
                return lesson;
            }
        }
        return null;
    }

    // Проверка, доступен ли урок
    isLessonUnlocked(lessonId) {
        const allLessons = this.getAllLessons();
        const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
        
        if (lessonIndex === 0) return true;
        
        // Проверяем, завершен ли предыдущий урок
        const previousLesson = allLessons[lessonIndex - 1];
        return this.isLessonCompleted(previousLesson.id);
    }

    // Сброс прогресса
    reset() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить!')) {
            this.data = this.getDefaultProgress();
            this.save();
            window.location.reload();
        }
    }

    // Получение статистики для профиля
    getProfileStats() {
        return {
            xp: this.data.xp,
            level: this.data.level,
            streak: this.data.streak,
            completedLessons: this.data.stats.totalLessons,
            accuracy: this.getAccuracy(),
            achievements: this.data.achievements.length,
            progress: this.getOverallProgress()
        };
    }

    // Получение данных для отображения
    getData() {
        return this.data;
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProgressManager };
}