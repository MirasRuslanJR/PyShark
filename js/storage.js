// storage.js - LocalStorage management for user progress

const STORAGE_KEY = 'pybricks_academy';

// Default user data structure
const defaultData = {
    xp: 0,
    level: 1,
    streak: 0,
    lastVisit: null,
    completedLessons: [],
    lessonProgress: {},
    stats: {
        totalLessons: 0,
        codeRuns: 0,
        timeSpent: 0
    },
    currentLesson: 'b1'
};

// Load data from localStorage
export function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            updateStreak(data);
            return { ...defaultData, ...data };
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
    return { ...defaultData };
}

// Save data to localStorage
export function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {        console.error('Error saving data:', error);
    }
}

// Update streak based on last visit
function updateStreak(data) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (data.lastVisit) {
        const lastVisit = new Date(data.lastVisit);
        const lastVisitDay = new Date(lastVisit.getFullYear(), lastVisit.getMonth(), lastVisit.getDate());
        const daysDiff = Math.floor((today - lastVisitDay) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
            // Same day, keep streak
        } else if (daysDiff === 1) {
            // Next day, increment streak
            data.streak++;
        } else {
            // Missed days, reset streak
            data.streak = 1;
        }
    } else {
        data.streak = 1;
    }
    
    data.lastVisit = now.toISOString();
}

// Mark lesson as complete
export function completeLesson(data, lessonId, xpEarned) {
    if (!data.completedLessons.includes(lessonId)) {
        data.completedLessons.push(lessonId);
        data.xp += xpEarned;
        data.stats.totalLessons++;
        updateLevel(data);
    }
    saveData(data);
}

// Update level based on XP
function updateLevel(data) {
    // 100 XP per level, exponential growth
    const newLevel = Math.floor(Math.sqrt(data.xp / 100)) + 1;
    data.level = newLevel;
}

// Add XP
export function addXP(data, amount) {
    data.xp += amount;
    updateLevel(data);
    saveData(data);
}

// Increment code runs
export function incrementCodeRuns(data) {
    data.stats.codeRuns++;
    saveData(data);
}

// Add time spent (in minutes)
export function addTimeSpent(data, minutes) {
    data.stats.timeSpent += minutes;
    saveData(data);
}

// Reset all data (for testing)
export function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return { ...defaultData };
}

// Check if lesson is unlocked
export function isLessonUnlocked(data, lessonId, allLessons) {
    // First lesson is always unlocked
    if (lessonId === 'b1') return true;
    
    // Find previous lesson in sequence
    let found = false;
    for (const track of ['beginner', 'intermediate', 'advanced']) {
        for (let i = 0; i < allLessons[track].length; i++) {
            if (found) {
                // This is the lesson after current - check if previous is complete
                return true;
            }
            if (allLessons[track][i].id === lessonId) {
                found = true;
                // Check if previous lesson is complete
                if (i > 0) {
                    return data.completedLessons.includes(allLessons[track][i - 1].id);
                } else if (track !== 'beginner') {
                    // First lesson of new track - check last lesson of previous track
                    const prevTrack = track === 'intermediate' ? 'beginner' : 'intermediate';
                    const lastLesson = allLessons[prevTrack][allLessons[prevTrack].length - 1];
                    return data.completedLessons.includes(lastLesson.id);
                }
            }
        }
    }
    return false;
}

// Get XP needed for next level
export function getXPForNextLevel(currentLevel) {
    return Math.pow(currentLevel, 2) * 100;
}

// Get progress percentage for current level
export function getLevelProgress(data) {
    const currentLevelXP = Math.pow(data.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(data.level, 2) * 100;
    const xpInLevel = data.xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    return (xpInLevel / xpNeeded) * 100;
}