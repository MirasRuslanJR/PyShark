// app.js - Main application controller

import { initializeUI } from './ui.js';
import { initializePyodide } from './python-runner.js';

// Application state
const app = {
    isInitialized: false,
    pyodideReady: false
};

// Initialize application
async function initializeApp() {
    console.log('Initializing PyBricks Academy...');
    
    try {
        // Show loading screen
        showLoading(true);
        
        // Initialize Pyodide in background
        initializePyodideAsync();
        
        // Initialize UI (can start immediately)
        initializeUI();
        
        // Wait a moment for nice loading animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Hide loading screen and show app
        showLoading(false);
        showApp();
        
        app.isInitialized = true;
        console.log('PyBricks Academy initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to load PyBricks Academy. Please refresh the page.');
    }
}

// Initialize Pyodide asynchronously
async function initializePyodideAsync() {
    try {
        console.log('Loading Python environment...');
        await initializePyodide();
        app.pyodideReady = true;
        console.log('Python environment ready!');
    } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        // App can still work without Pyodide, just no code execution
    }
}

// Show/hide loading screen
function showLoading(show) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        if (show) {
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';
        } else {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}

// Show app
function showApp() {
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.style.display = 'flex';
        // Trigger fade-in animation
        setTimeout(() => {
            appContainer.style.opacity = '1';
        }, 50);
    }
}

// Show error message
function showError(message) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div style="font-size: 64px; margin-bottom: 20px;">😔</div>
                <p class="loading-text" style="color: #FF6B9D;">${message}</p>
            </div>
        `;
    }
}

// Add global keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to run code
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const runButton = document.querySelector('#run-code:not([style*="display: none"])') ||
                            document.querySelector('#playground-run');
            if (runButton) {
                runButton.click();
            }
        }
        
        // Ctrl/Cmd + S to format code (prevent save dialog)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            const formatButton = document.querySelector('#format-code:not([style*="display: none"])') ||
                               document.querySelector('#playground-format');
            if (formatButton) {
                formatButton.click();
            }
        }
    });
}

// Track session time
let sessionStart = Date.now();
let sessionTimer = null;

function trackSessionTime() {
    // Update session time every minute
    sessionTimer = setInterval(() => {
        const sessionMinutes = Math.floor((Date.now() - sessionStart) / 60000);
        // This could be used to update user stats
        console.log(`Session time: ${sessionMinutes} minutes`);
    }, 60000);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (sessionTimer) {
        clearInterval(sessionTimer);
    }
    
    // Save final session time
    const sessionMinutes = Math.floor((Date.now() - sessionStart) / 60000);
    console.log(`Total session: ${sessionMinutes} minutes`);
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User switched away
        console.log('User left tab');
    } else {
        // User returned
        console.log('User returned to tab');
    }
});

// Add custom styles for app initialization
const initStyles = document.createElement('style');
initStyles.textContent = `
    #app {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    #loading-screen {
        transition: opacity 0.5s ease;
    }
    
    /* Custom scrollbar for better aesthetics */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--gray-100);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--pink-300);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--pink-400);
    }
    
    /* Smooth transitions for all interactive elements */
    button, .nav-item, .lesson-card, .stat-card {
        transition: all 0.3s ease;
    }
    
    /* Focus styles for accessibility */
    button:focus, input:focus, select:focus {
        outline: 2px solid var(--pink-400);
        outline-offset: 2px;
    }
    
    /* Loading animation */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .loading {
        animation: pulse 1.5s ease-in-out infinite;
    }
`;
document.head.appendChild(initStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp();
        setupKeyboardShortcuts();
        trackSessionTime();
    });
} else {
    // DOM already loaded
    initializeApp();
    setupKeyboardShortcuts();
    trackSessionTime();
}

// Export app state for debugging
window.PyBricksAcademy = app;

console.log(`
  🦈 PyBricks Academy
  ==================
  Welcome to the cutest robotics learning platform!
  
  Keyboard Shortcuts:
  - Ctrl/Cmd + Enter: Run code
  - Ctrl/Cmd + S: Format code
  
  Happy coding! 🌊
`);