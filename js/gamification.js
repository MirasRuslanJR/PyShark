// gamification.js - XP, levels, achievements, and mascot reactions

// Mascot messages based on context
export const mascotMessages = {
    welcome: [
        "Ready to learn some robotics? Let's dive in! 🦈",
        "Hey there! Time to make some robots move! 🤖",
        "Welcome back, friend! Let's code together! 💖",
        "Sharks are great swimmers... and coders! Let's go! 🌊"
    ],
    lessonComplete: [
        "Awesome work! You're swimming through these lessons! 🦈",
        "Incredible! Keep riding this wave of learning! 🌊",
        "You're crushing it! That was fin-tastic! 🦈",
        "Great job! You're becoming a robotics expert! ⭐"
    ],
    levelUp: [
        "LEVEL UP! You're making serious waves! 🌊🎉",
        "Wow! New level unlocked! You're amazing! ✨",
        "Incredible progress! Keep swimming! 🦈",
        "Level up! You're on fire! 🔥"
    ],
    streak: [
        "Nice streak! Consistency is key! 🔥",
        "You're on a roll! Keep it up! 🎯",
        "Amazing dedication! Your streak is impressive! ⭐",
        "Wow! That's commitment! Keep swimming! 🦈"
    ],
    encouragement: [
        "Don't give up! Every expert was once a beginner! 💪",
        "You've got this! Take it one step at a time! 🦈",
        "Keep trying! Learning is a journey! 🌊",
        "Mistakes are just learning opportunities! Keep going! ✨"
    ],
    codeRun: [
        "Let's see what this does! 🔬",
        "Running your code... exciting! ⚡",
        "Time to bring your robot to life! 🤖",
        "Let's make some magic happen! ✨"
    ]
};

// Get random message from category
export function getMascotMessage(category) {
    const messages = mascotMessages[category] || mascotMessages.welcome;
    return messages[Math.floor(Math.random() * messages.length)];
}

// Animate mascot
export function animateMascot(emotion = 'happy') {
    const mascot = document.getElementById('mascot');
    if (!mascot) return;
    
    mascot.style.transform = 'scale(1)';
    
    switch (emotion) {
        case 'happy':
            mascot.style.animation = 'bounce 0.6s ease';
            break;
        case 'excited':
            mascot.style.animation = 'bounce 0.4s ease 3';
            break;
        case 'thinking':
            mascot.style.animation = 'float 2s ease-in-out infinite';
            break;
    }
    
    setTimeout(() => {
        mascot.style.animation = '';
    }, 2000);
}

// Update mascot message
export function updateMascotMessage(message) {
    const messageEl = document.getElementById('mascot-message');
    if (messageEl) {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.textContent = message;
            messageEl.style.opacity = '1';
        }, 200);
    }
}

// Achievements system
export const achievements = [
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        requirement: (data) => data.completedLessons.length >= 1
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        requirement: (data) => data.streak >= 7
    },
    {
        id: 'speed_runner',
        name: 'Speed Runner',
        description: 'Complete 5 lessons in one day',
        icon: '🚀',
        requirement: (data) => {
            // This would need session tracking - simplified for demo
            return data.completedLessons.length >= 5;
        }
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete a track without hints',
        icon: '💎',
        requirement: (data) => {
            return data.completedLessons.length >= 12;
        }
    },
    {
        id: 'code_master',
        name: 'Code Master',
        description: 'Run code 100 times',
        icon: '⚡',
        requirement: (data) => data.stats.codeRuns >= 100
    },
    {
        id: 'dedicated',
        name: 'Dedicated Learner',
        description: 'Spend 10+ hours learning',
        icon: '📚',
        requirement: (data) => data.stats.timeSpent >= 600
    }
];

// Check which achievements are unlocked
export function checkAchievements(data) {
    return achievements.map(achievement => ({
        ...achievement,
        unlocked: achievement.requirement(data)
    }));
}

// Show XP gained notification
export function showXPNotification(amount) {
    const notification = document.createElement('div');
    notification.className = 'xp-notification';
    notification.innerHTML = `
        <span class="xp-icon">⭐</span>
        <span class="xp-amount">+${amount} XP</span>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 40px;
        background: linear-gradient(135deg, #FF6B9D, #FFB6C1);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(255, 107, 157, 0.3);
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        z-index: 1000;
        font-family: 'Quicksand', sans-serif;
        font-size: 18px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show level up notification
export function showLevelUpNotification(newLevel) {
    const notification = document.createElement('div');
    notification.className = 'level-notification';
    notification.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
        <div style="font-size: 24px; font-weight: 700;">LEVEL UP!</div>
        <div style="font-size: 18px; margin-top: 4px;">You're now level ${newLevel}</div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #FFB6C1, #D8B4FE);
        color: white;
        padding: 40px 60px;
        border-radius: 24px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(255, 107, 157, 0.4);
        animation: scaleIn 0.5s ease;
        z-index: 2000;
        font-family: 'Quicksand', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Add confetti effect (simplified)
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createConfetti(), i * 50);
    }
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Create confetti particle
function createConfetti() {
    const confetti = document.createElement('div');
    const colors = ['#FFB6C1', '#D8B4FE', '#99E6D8', '#FFB89A'];
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}%;
        border-radius: 50%;
        animation: fall ${2 + Math.random() * 2}s linear;
        z-index: 1999;
    `;
    
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes scaleIn {
        from { transform: translate(-50%, -50%) scale(0); }
        to { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes fall {
        to { 
            top: 100vh; 
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Calculate total XP for track
export function getTrackXP(curriculum, track) {
    return curriculum[track].reduce((total, lesson) => total + lesson.xp, 0);
}

// Calculate completed lessons in track
export function getTrackProgress(curriculum, track, completedLessons) {
    const total = curriculum[track].length;
    const completed = curriculum[track].filter(l => 
        completedLessons.includes(l.id)
    ).length;
    return { completed, total, percentage: (completed / total) * 100 };
}