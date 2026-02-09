// editor.js - Monaco Editor integration

let monacoEditor = null;
let playgroundEditor = null;

// Initialize Monaco Editor
export async function initializeEditor(containerId, initialCode = '') {
    return new Promise((resolve) => {
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
        
        require(['vs/editor/editor.main'], function() {
            const editor = monaco.editor.create(document.getElementById(containerId), {
                value: initialCode,
                language: 'python',
                theme: 'vs-light',
                fontSize: 14,
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 10, bottom: 10 },
                renderLineHighlight: 'all',
                selectionHighlight: true,
                lineHeight: 22,
                fontFamily: "'Courier New', monospace",
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                snippetSuggestions: 'top',
                wordBasedSuggestions: true
            });
            
            // Add PyBricks snippets
            addPyBricksSnippets();
            
            // Store reference
            if (containerId === 'code-editor') {
                monacoEditor = editor;
            } else {
                playgroundEditor = editor;
            }
            
            resolve(editor);
        });
    });
}

// Add PyBricks code snippets
function addPyBricksSnippets() {
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: () => {
            const suggestions = [
                {
                    label: 'import_pybricks',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'from pybricks.hubs import EV3Brick',
                        'from pybricks.ev3devices import Motor, ColorSensor, UltrasonicSensor',
                        'from pybricks.parameters import Port',
                        'from pybricks.tools import wait',
                        '',
                        'brick = EV3Brick()',
                        ''
                    ].join('\n'),
                    documentation: 'Basic PyBricks imports'
                },
                {
                    label: 'motor_setup',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'left_motor = Motor(Port.A)',
                        'right_motor = Motor(Port.B)',
                        ''
                    ].join('\n'),
                    documentation: 'Setup two motors for drive base'
                },
                {
                    label: 'move_forward',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'left_motor.run(300)',
                        'right_motor.run(300)',
                        'wait(2000)',
                        'left_motor.stop()',
                        'right_motor.stop()'
                    ].join('\n'),
                    documentation: 'Move robot forward for 2 seconds'
                },
                {
                    label: 'turn_right',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'left_motor.run(300)',
                        'right_motor.run(-300)',
                        'wait(1000)',
                        'left_motor.stop()',
                        'right_motor.stop()'
                    ].join('\n'),
                    documentation: 'Turn robot right'
                },
                {
                    label: 'color_sensor',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'color_sensor = ColorSensor(Port.S3)',
                        'reflection = color_sensor.reflection()',
                        'print("Reflection:", reflection)'
                    ].join('\n'),
                    documentation: 'Setup and read color sensor'
                },
                {
                    label: 'distance_sensor',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'ultrasonic = UltrasonicSensor(Port.S4)',
                        'distance = ultrasonic.distance()',
                        'print("Distance:", distance, "mm")'
                    ].join('\n'),
                    documentation: 'Setup and read ultrasonic sensor'
                },
                {
                    label: 'line_follower',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: [
                        'TARGET = 50',
                        'GAIN = 2',
                        'BASE_SPEED = 200',
                        '',
                        'while True:',
                        '    reflection = color_sensor.reflection()',
                        '    error = TARGET - reflection',
                        '    correction = error * GAIN',
                        '    ',
                        '    left_motor.run(BASE_SPEED + correction)',
                        '    right_motor.run(BASE_SPEED - correction)',
                        '    wait(10)'
                    ].join('\n'),
                    documentation: 'Proportional line follower'
                }
            ];
            return { suggestions };
        }
    });
}

// Get editor code
export function getEditorCode(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    return editor ? editor.getValue() : '';
}

// Set editor code
export function setEditorCode(code, editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        editor.setValue(code);
    }
}

// Format code
export function formatCode(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        editor.getAction('editor.action.formatDocument').run();
    }
}

// Clear editor
export function clearEditor(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        editor.setValue('');
    }
}

// Highlight line (for errors)
export function highlightErrorLine(lineNumber, editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor && lineNumber) {
        editor.deltaDecorations([], [
            {
                range: new monaco.Range(lineNumber, 1, lineNumber, 1),
                options: {
                    isWholeLine: true,
                    className: 'error-line',
                    glyphMarginClassName: 'error-glyph'
                }
            }
        ]);
    }
}

// Clear error highlighting
export function clearErrorHighlights(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        editor.deltaDecorations([], []);
    }
}

// Get editor instance
export function getEditor(editorType = 'lesson') {
    return editorType === 'lesson' ? monacoEditor : playgroundEditor;
}

// Resize editor
export function resizeEditor(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        editor.layout();
    }
}

// Add custom theme
export function setCustomTheme() {
    if (typeof monaco !== 'undefined') {
        monaco.editor.defineTheme('pybricks-theme', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '999999', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'FF6B9D', fontStyle: 'bold' },
                { token: 'string', foreground: '99E6D8' },
                { token: 'number', foreground: 'FFB89A' }
            ],
            colors: {
                'editor.background': '#FAFAFA',
                'editor.foreground': '#262626',
                'editor.lineHighlightBackground': '#FFF5F7',
                'editorLineNumber.foreground': '#D4D4D4',
                'editor.selectionBackground': '#FFE4E8'
            }
        });
    }
}

// Add syntax error checking
export function addSyntaxChecker(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        editor.onDidChangeModelContent(() => {
            const code = editor.getValue();
            // Basic Python syntax checking could go here
            // For now, we'll rely on Pyodide for error checking
        });
    }
}

// Export editor state for saving
export function getEditorState(editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor) {
        return {
            code: editor.getValue(),
            cursor: editor.getPosition(),
            scroll: editor.getScrollTop()
        };
    }
    return null;
}

// Restore editor state
export function restoreEditorState(state, editorType = 'lesson') {
    const editor = editorType === 'lesson' ? monacoEditor : playgroundEditor;
    if (editor && state) {
        editor.setValue(state.code);
        if (state.cursor) {
            editor.setPosition(state.cursor);
        }
        if (state.scroll) {
            editor.setScrollTop(state.scroll);
        }
    }
}