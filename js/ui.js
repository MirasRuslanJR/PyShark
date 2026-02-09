// ui.js - UI management and page navigation

import { curriculum, getLessonById, getNextLesson, getPreviousLesson } from './curriculum.js';
import { loadData, saveData, completeLesson, isLessonUnlocked } from './storage.js';
import { getMascotMessage, updateMascotMessage, animateMascot, showXPNotification, showLevelUpNotification, checkAchievements, getTrackProgress } from './gamification.js';
import { initializeEditor, setEditorCode, getEditorCode, formatCode, clearEditor } from './editor.js';
import { runPythonCode } from './python-runner.js';
import { createLessonSimulator, createPlaygroundSimulator, resetLessonSimulator, resetPlaygroundSimulator, getLessonSimulator, getPlaygroundSimulator } from './robot-sim.js';

let userData = null;
let currentLessonId = null;

// Initialize UI
export function initializeUI() {
    userData = loadData();
    setupNavigation();
    setupDashboard();
    setupLessonsMap();
    showPage('dashboard');
    updateAllStats();
    
    // Show welcome message
    const welcomeMsg = getMascotMessage('welcome');
    updateMascotMessage(welcomeMsg);
    animateMascot('happy');
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            showPage(page);
            
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });
}

// Show page
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Page-specific initialization
    if (pageName === 'playground') {
        initializePlayground();
    } else if (pageName === 'profile') {
        updateProfilePage();
    }
}

// Setup dashboard
function setupDashboard() {
    // Continue learning button
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            const nextLesson = findNextUncompletedLesson();
            if (nextLesson) {
                openLesson(nextLesson.id);
            }
        });
    }
    
    updateDashboardStats();
}

// Update dashboard stats
function updateDashboardStats() {
    // Update stat cards
    document.getElementById('total-xp').textContent = userData.xp;
    document.getElementById('lessons-completed').textContent = userData.completedLessons.length;
    document.getElementById('current-level').textContent = userData.level;
    document.getElementById('streak-count').textContent = userData.streak;
    
    // Update track progress
    updateTrackProgressBars();
    
    // Update next lesson card
    updateNextLessonCard();
}

// Update track progress bars
function updateTrackProgressBars() {
    const tracks = ['beginner', 'intermediate', 'advanced'];
    
    tracks.forEach(track => {
        const progress = getTrackProgress(curriculum, track, userData.completedLessons);
        const progressEl = document.getElementById(`${track}-progress`);
        const barEl = document.getElementById(`${track}-bar`);
        
        if (progressEl) {
            progressEl.textContent = `${progress.completed}/${progress.total}`;
        }
        if (barEl) {
            barEl.style.width = `${progress.percentage}%`;
        }
    });
}

// Update next lesson card
function updateNextLessonCard() {
    const nextLesson = findNextUncompletedLesson();
    const card = document.getElementById('next-lesson-card');
    
    if (nextLesson && card) {
        const lessonNumber = getLessonNumber(nextLesson.id);
        card.querySelector('.lesson-number').textContent = `Lesson ${lessonNumber}`;
        card.querySelector('.lesson-title').textContent = nextLesson.title;
        card.querySelector('.lesson-desc').textContent = nextLesson.description;
    }
}

// Find next uncompleted lesson
function findNextUncompletedLesson() {
    for (const track of ['beginner', 'intermediate', 'advanced']) {
        for (const lesson of curriculum[track]) {
            if (!userData.completedLessons.includes(lesson.id)) {
                return lesson;
            }
        }
    }
    return curriculum.beginner[0]; // Default to first lesson
}

// Get lesson number across all tracks
function getLessonNumber(lessonId) {
    let count = 1;
    for (const track of ['beginner', 'intermediate', 'advanced']) {
        for (const lesson of curriculum[track]) {
            if (lesson.id === lessonId) return count;
            count++;
        }
    }
    return 1;
}

// Setup lessons map
function setupLessonsMap() {
    const tracks = ['beginner', 'intermediate', 'advanced'];
    
    tracks.forEach(track => {
        const container = document.getElementById(`${track}-lessons`);
        if (!container) return;
        
        container.innerHTML = '';
        
        curriculum[track].forEach((lesson, index) => {
            const card = createLessonCard(lesson, track, index);
            container.appendChild(card);
        });
    });
}

// Create lesson card
function createLessonCard(lesson, track, index) {
    const card = document.createElement('div');
    card.className = 'lesson-card';
    
    const isCompleted = userData.completedLessons.includes(lesson.id);
    const isUnlocked = isLessonUnlocked(userData, lesson.id, curriculum);
    
    if (isCompleted) card.classList.add('completed');
    if (!isUnlocked) card.classList.add('locked');
    
    const lessonNumber = index + 1;
    const statusIcon = isCompleted ? '✓' : (isUnlocked ? '○' : '🔒');
    
    card.innerHTML = `
        <div class="lesson-card-header">
            <span class="lesson-card-number">Lesson ${lessonNumber}</span>
            <span class="lesson-card-status">${statusIcon}</span>
        </div>
        <h4 class="lesson-card-title">${lesson.title}</h4>
        <p class="lesson-card-desc">${lesson.description}</p>
        <div class="lesson-card-footer">
            <span class="lesson-card-xp">+${lesson.xp} XP</span>
        </div>
    `;
    
    if (isUnlocked) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openLesson(lesson.id));
    }
    
    return card;
}

// Open lesson
export function openLesson(lessonId) {
    currentLessonId = lessonId;
    const lesson = getLessonById(lessonId);
    
    if (!lesson) return;
    
    showPage('lesson');
    
    // Update lesson header
    document.getElementById('lesson-badge').textContent = `Lesson ${getLessonNumber(lessonId)}`;
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-xp').textContent = `+${lesson.xp} XP`;
    
    // Update theory section
    document.getElementById('theory-content').innerHTML = lesson.theory;
    
    // Initialize editor with starter code
    setTimeout(() => {
        initializeEditor('code-editor', lesson.starterCode || '');
        createLessonSimulator();
    }, 100);
    
    // Setup lesson controls
    setupLessonControls(lessonId);
}

// Setup lesson controls
function setupLessonControls(lessonId) {
    // Back button
    document.getElementById('back-to-map').onclick = () => {
        showPage('lessons');
        document.querySelector('[data-page="lessons"]').classList.add('active');
    };
    
    // Run code button
    document.getElementById('run-code').onclick = async () => {
        await runLessonCode();
    };
    
    // Format code button
    document.getElementById('format-code').onclick = () => {
        formatCode('lesson');
    };
    
    // Clear output button
    document.getElementById('clear-output').onclick = () => {
        document.getElementById('output').innerHTML = '';
    };
    
    // Reset robot button
    document.getElementById('reset-robot').onclick = () => {
        resetLessonSimulator();
        updateMascotMessage("Robot reset! Ready to try again? 🦈");
    };
    
    // Navigation buttons
    const prevLesson = getPreviousLesson(lessonId);
    const nextLesson = getNextLesson(lessonId);
    
    const prevBtn = document.getElementById('prev-lesson');
    const nextBtn = document.getElementById('next-lesson');
    
    prevBtn.style.display = prevLesson ? 'block' : 'none';
    nextBtn.style.display = nextLesson ? 'block' : 'none';
    
    if (prevLesson) {
        prevBtn.onclick = () => openLesson(prevLesson);
    }
    if (nextLesson) {
        nextBtn.onclick = () => openLesson(nextLesson);
    }
    
    // Complete lesson button
    document.getElementById('complete-lesson').onclick = () => {
        completeLessonAction(lessonId);
    };
}

// Run lesson code
async function runLessonCode() {
    const code = getEditorCode('lesson');
    const outputEl = document.getElementById('output');
    const simulator = getLessonSimulator();
    
    // Show running message
    updateMascotMessage(getMascotMessage('codeRun'));
    animateMascot('thinking');
    
    // Increment code runs
    userData.stats.codeRuns++;
    saveData(userData);
    
    // Run code
    await runPythonCode(code, (message, clear, type) => {
        if (clear) {
            outputEl.innerHTML = '';
        } else {
            const line = document.createElement('div');
            line.className = `output-line ${type ? `output-${type}` : ''}`;
            line.textContent = message;
            outputEl.appendChild(line);
            outputEl.scrollTop = outputEl.scrollHeight;
        }
    }, simulator);
}

// Complete lesson action
function completeLessonAction(lessonId) {
    const lesson = getLessonById(lessonId);
    if (!lesson) return;
    
    const oldLevel = userData.level;
    
    // Complete lesson
    completeLesson(userData, lessonId, lesson.xp);
    
    // Show notifications
    showXPNotification(lesson.xp);
    
    if (userData.level > oldLevel) {
        showLevelUpNotification(userData.level);
    }
    
    // Update UI
    updateAllStats();
    updateMascotMessage(getMascotMessage('lessonComplete'));
    animateMascot('excited');
    
    // Move to next lesson
    setTimeout(() => {
        const nextLesson = getNextLesson(lessonId);
        if (nextLesson) {
            openLesson(nextLesson);
        } else {
            showPage('lessons');
        }
    }, 2000);
}

// Initialize playground
function initializePlayground() {
    const starterCode = `from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

# Initialize
brick = EV3Brick()
motor = Motor(Port.A)

# Your code here
print("Hello, Robotics!")
`;

    // Initialize editor if not already done
    setTimeout(() => {
        if (!document.querySelector('#playground-code-editor .monaco-editor')) {
            initializeEditor('playground-code-editor', starterCode);
            createPlaygroundSimulator();
        }
    }, 100);
    
    // Setup playground controls
    setupPlaygroundControls();
}

// Setup playground controls
function setupPlaygroundControls() {
    document.getElementById('playground-run').onclick = async () => {
        const code = getEditorCode('playground');
        const outputEl = document.getElementById('playground-output');
        const simulator = getPlaygroundSimulator();
        
        await runPythonCode(code, (message, clear, type) => {
            if (clear) {
                outputEl.innerHTML = '';
            } else {
                const line = document.createElement('div');
                line.className = `output-line ${type ? `output-${type}` : ''}`;
                line.textContent = message;
                outputEl.appendChild(line);
                outputEl.scrollTop = outputEl.scrollHeight;
            }
        }, simulator);
        
        userData.stats.codeRuns++;
        saveData(userData);
    };
    
    document.getElementById('playground-format').onclick = () => {
        formatCode('playground');
    };
    
    document.getElementById('playground-clear').onclick = () => {
        clearEditor('playground');
    };
    
    document.getElementById('playground-clear-output').onclick = () => {
        document.getElementById('playground-output').innerHTML = '';
    };
    
    document.getElementById('playground-reset').onclick = () => {
        resetPlaygroundSimulator();
    };
}

// Update profile page
function updateProfilePage() {
    document.getElementById('profile-level').textContent = userData.level;
    document.getElementById('profile-xp-text').textContent = 
        `${userData.xp} / ${Math.pow(userData.level, 2) * 100} XP`;
    
    const xpProgress = (userData.xp % (Math.pow(userData.level, 2) * 100)) / 
                       (Math.pow(userData.level, 2) * 100) * 100;
    document.getElementById('profile-xp-bar').style.width = `${xpProgress}%`;
    
    // Update stats
    document.getElementById('stat-lessons').textContent = userData.stats.totalLessons;
    document.getElementById('stat-runs').textContent = userData.stats.codeRuns;
    document.getElementById('stat-streak').textContent = `${userData.streak} days`;
    document.getElementById('stat-time').textContent = 
        `${Math.floor(userData.stats.timeSpent / 60)} hours`;
    
    // Update achievements
    const achievementsEl = document.getElementById('achievements');
    const unlockedAchievements = checkAchievements(userData);
    
    achievementsEl.innerHTML = '';
    unlockedAchievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement ${achievement.unlocked ? '' : 'locked'}`;
        achievementEl.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <span class="achievement-name">${achievement.name}</span>
        `;
        achievementsEl.appendChild(achievementEl);
    });
}

// Update all stats
function updateAllStats() {
    updateDashboardStats();
    setupLessonsMap();
}

// Export current lesson ID
export function getCurrentLessonId() {
    return currentLessonId;
}