/**
 * GAMIFICATION.JS
 * Achievements, rewards, and gamification mechanics
 */

const ACHIEVEMENTS = {
    // Первые шаги
    first_lesson: {
        id: 'first_lesson',
        title: 'Первые шаги',
        description: 'Завершите свой первый урок',
        icon: '🎯',
        xp: 10
    },
    
    // Уроки
    five_lessons: {
        id: '5_lessons',
        title: 'Новичок',
        description: 'Завершите 5 уроков',
        icon: '📚',
        xp: 50
    },
    ten_lessons: {
        id: '10_lessons',
        title: 'Ученик',
        description: 'Завершите 10 уроков',
        icon: '🎓',
        xp: 100
    },
    all_lessons: {
        id: 'all_lessons',
        title: 'Мастер PyBricks',
        description: 'Завершите все уроки!',
        icon: '👑',
        xp: 500
    },
    
    // Серии
    week_streak: {
        id: 'week_streak',
        title: 'Недельная серия',
        description: 'Занимайтесь 7 дней подряд',
        icon: '🔥',
        xp: 100
    },
    month_streak: {
        id: 'month_streak',
        title: 'Месячная серия',
        description: 'Занимайтесь 30 дней подряд',
        icon: '💪',
        xp: 300
    },
    
    // Навыки
    perfectionist: {
        id: 'perfectionist',
        title: 'Перфекционист',
        description: 'Получите 100% в 5 уроках',
        icon: '⭐',
        xp: 150
    },
    speed_learner: {
        id: 'speed_learner',
        title: 'Быстрый ученик',
        description: 'Завершите 3 урока за один день',
        icon: '⚡',
        xp: 75
    },
    
    // Уровни
    level_5: {
        id: 'level_5',
        title: 'Уровень 5',
        description: 'Достигните 5-го уровня',
        icon: '🏅',
        xp: 50
    },
    level_10: {
        id: 'level_10',
        title: 'Уровень 10',
        description: 'Достигните 10-го уровня',
        icon: '🥇',
        xp: 100
    },
    level_20: {
        id: 'level_20',
        title: 'Уровень 20',
        description: 'Достигните 20-го уровня',
        icon: '💎',
        xp: 200
    },
    
    // Особые
    shark_friend: {
        id: 'shark_friend',
        title: 'Друг акулы',
        description: 'Кликните на акулу 10 раз',
        icon: '🦈',
        xp: 25
    },
    early_bird: {
        id: 'early_bird',
        title: 'Ранняя пташка',
        description: 'Начните урок до 8 утра',
        icon: '🌅',
        xp: 30
    },
    night_owl: {
        id: 'night_owl',
        title: 'Ночная сова',
        description: 'Завершите урок после 10 вечера',
        icon: '🦉',
        xp: 30
    }
};

class GamificationManager {
    constructor(progressManager) {
        this.progress = progressManager;
        this.sharkClicks = 0;
    }

    // Получить все достижения
    getAllAchievements() {
        return Object.values(ACHIEVEMENTS);
    }

    // Получить разблокированные достижения
    getUnlockedAchievements() {
        const unlockedIds = this.progress.getData().achievements;
        return this.getAllAchievements().filter(a => unlockedIds.includes(a.id));
    }

    // Получить заблокированные достижения
    getLockedAchievements() {
        const unlockedIds = this.progress.getData().achievements;
        return this.getAllAchievements().filter(a => !unlockedIds.includes(a.id));
    }

    // Разблокировать достижение
    unlockAchievement(achievementId) {
        const achievement = ACHIEVEMENTS[achievementId];
        if (!achievement) return false;

        const unlocked = this.progress.unlockAchievement(achievementId);
        if (unlocked) {
            this.progress.addXP(achievement.xp);
            this.showAchievementPopup(achievement);
            return true;
        }
        return false;
    }

    // Показать popup достижения
    showAchievementPopup(achievement) {
        const popup = document.getElementById('achievementPopup');
        const icon = popup.querySelector('.achievement-popup-icon');
        const title = popup.querySelector('.achievement-popup-title');
        const description = popup.querySelector('.achievement-popup-description');

        icon.textContent = achievement.icon;
        title.textContent = achievement.title;
        description.textContent = `${achievement.description} (+${achievement.xp} XP)`;

        popup.classList.add('show');

        // Воспроизвести звук (опционально)
        this.playAchievementSound();

        // Скрыть через 5 секунд
        setTimeout(() => {
            popup.classList.remove('show');
        }, 5000);
    }

    // Воспроизвести звук достижения
    playAchievementSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS56eibUBELTqXh8bllHAU2jdXuzn0pBSp+zPLaizsKGGO46+mnVRILTKPf8bllHQU1i9Puy30qBSt9y/HaizsKF2G16+mmVRIKTKHd8blnHwU0idLtyX4qBSx8yfDZjD0KGF+z6+mjVBMKS5/b8blpIAQ0h9Dsx4AsBSx7x+/YjT4LGF2w6OihUxQJS57Z8LlqIgQzhs/rxoEtBS18xO7Xjj8LGFW06eifUhYJSZvX77prJAU0hczsxYMvBS1+w+zWkEELGFCx5+meURcJSJrU7rpuJgU2hMrqw4URBDCB2PbNfSsFLIPZ8tqNOwgZZ7nm6aVSEwxPnN/uuG4pBTWAyeq6hBEFMYHX8s1+KgUsg9nz2Iw6CBlnuOPlpVQSDk+b3ey6cCsFNoHI6bmGFAUxgNbyyYErBSyC2PLXjjoIGWa35+KlVhINT5ra6rh0LAU2f8bnuYgWBDKA1O/IfS0FLILa89SOPAUKZ7fk5aRYFAxOnNfu'); // Простой звук
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Игнорируем ошибки автовоспроизведения
        } catch (e) {
            // Звук не критичен
        }
    }

    // Показать празднование (при завершении урока/достижении)
    showCelebration(text = 'Отлично! 🎉', duration = 2000) {
        const overlay = document.getElementById('celebrationOverlay');
        const textElement = overlay.querySelector('.celebration-text');
        
        textElement.textContent = text;
        overlay.classList.add('show');

        // Создать конфетти
        this.createConfetti();

        setTimeout(() => {
            overlay.classList.remove('show');
        }, duration);
    }

    // Создать эффект конфетти
    createConfetti() {
        const confettiContainer = document.querySelector('.confetti');
        confettiContainer.innerHTML = '';

        const colors = ['#ff69b4', '#ff1493', '#ffb3d9', '#90EE90', '#FFD700'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-20px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s linear`;
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            confettiContainer.appendChild(confetti);
        }

        // Добавить CSS анимацию если её нет
        if (!document.getElementById('confettiAnimation')) {
            const style = document.createElement('style');
            style.id = 'confettiAnimation';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Обработка клика по акуле
    handleSharkClick() {
        this.sharkClicks++;
        
        const shark = document.getElementById('floatingShark');
        shark.style.transform = 'scale(1.3) rotate(15deg)';
        
        setTimeout(() => {
            shark.style.transform = '';
        }, 200);

        // Разблокировать достижение после 10 кликов
        if (this.sharkClicks === 10) {
            this.unlockAchievement('shark_friend');
        }

        // Случайные фразы акулы
        const phrases = [
            '🦈 Привет!',
            '🦈 Продолжай учиться!',
            '🦈 Ты молодец!',
            '🦈 Давай дальше!',
            '🦈 Я верю в тебя!'
        ];
        
        if (Math.random() < 0.3) { // 30% шанс показать фразу
            this.showSharkMessage(phrases[Math.floor(Math.random() * phrases.length)]);
        }
    }

    // Показать сообщение от акулы
    showSharkMessage(message) {
        const bubble = document.createElement('div');
        bubble.textContent = message;
        bubble.style.cssText = `
            position: fixed;
            bottom: 200px;
            right: 50px;
            background: white;
            padding: 15px 20px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(255, 105, 180, 0.3);
            font-weight: 600;
            color: #ff1493;
            animation: fadeIn 0.3s ease;
            z-index: 999;
        `;
        document.body.appendChild(bubble);

        setTimeout(() => {
            bubble.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => bubble.remove(), 300);
        }, 2000);
    }

    // Проверить достижения по времени
    checkTimeBasedAchievements() {
        const hour = new Date().getHours();
        
        if (hour < 8) {
            this.unlockAchievement('early_bird');
        }
        
        if (hour >= 22) {
            this.unlockAchievement('night_owl');
        }
    }

    // Проверить ежедневную цель
    checkDailyGoal() {
        const dailyGoal = this.progress.getData().dailyGoal;
        if (dailyGoal.completed >= dailyGoal.target) {
            return true;
        }
        return false;
    }

    // Получить награду за ежедневную цель
    getDailyGoalReward() {
        if (this.checkDailyGoal()) {
            this.progress.addXP(50);
            this.showCelebration('Ежедневная цель выполнена! +50 XP 🎯');
            return true;
        }
        return false;
    }
}

// Экспорт
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GamificationManager, ACHIEVEMENTS };
}