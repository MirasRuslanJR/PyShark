// python-runner.js - Pyodide integration with PyBricks stub API

let pyodide = null;
let isInitialized = false;
let robotSimulator = null;

// Initialize Pyodide
export async function initializePyodide() {
    if (isInitialized) return pyodide;
    
    try {
        console.log('Loading Pyodide...');
        pyodide = await loadPyodide();
        
        // Install PyBricks stub API
        await installPyBricksStub();
        
        isInitialized = true;
        console.log('Pyodide initialized successfully!');
        return pyodide;
    } catch (error) {
        console.error('Failed to initialize Pyodide:', error);
        throw error;
    }
}

// Install PyBricks stub API
async function installPyBricksStub() {
    // Create PyBricks stub module
    const pybricksStub = `
import sys
from types import ModuleType
import js
import time as _time

# Store robot simulator reference
_robot_sim = None

def set_robot_simulator(sim):
    global _robot_sim
    _robot_sim = sim

# Port enum
class Port:
    A = 'A'
    B = 'B'
    C = 'C'
    D = 'D'
    S1 = 'S1'
    S2 = 'S2'
    S3 = 'S3'
    S4 = 'S4'

# Color enum
class Color:
    BLACK = 'BLACK'
    BLUE = 'BLUE'
    GREEN = 'GREEN'
    YELLOW = 'YELLOW'
    RED = 'RED'
    WHITE = 'WHITE'
    BROWN = 'BROWN'

# Wait function
def wait(milliseconds):
    _time.sleep(milliseconds / 1000.0)

# Motor class
class Motor:
    def __init__(self, port):
        self.port = port
        self._angle = 0
        self._speed = 0
        print(f"Motor initialized on port {port}")
    
    def run(self, speed):
        self._speed = speed
        print(f"Motor {self.port} running at {speed} deg/s")
        if _robot_sim:
            js.updateRobotMotor(self.port, speed)
    
    def run_angle(self, speed, angle, wait=True):
        self._angle += angle
        duration = abs(angle / speed) if speed != 0 else 0
        print(f"Motor {self.port} rotating {angle} degrees at {speed} deg/s")
        if _robot_sim:
            js.updateRobotMotor(self.port, speed)
        if wait:
            _time.sleep(duration)
            self.stop()
    
    def run_time(self, speed, time_ms, wait=True):
        self._speed = speed
        print(f"Motor {self.port} running for {time_ms}ms at {speed} deg/s")
        if _robot_sim:
            js.updateRobotMotor(self.port, speed)
        if wait:
            _time.sleep(time_ms / 1000.0)
            self.stop()
    
    def stop(self):
        self._speed = 0
        print(f"Motor {self.port} stopped")
        if _robot_sim:
            js.updateRobotMotor(self.port, 0)
    
    def angle(self):
        return self._angle
    
    def speed(self):
        return self._speed
    
    def reset_angle(self, angle=0):
        self._angle = angle

# Touch Sensor class
class TouchSensor:
    def __init__(self, port):
        self.port = port
        print(f"TouchSensor initialized on port {port}")
    
    def pressed(self):
        # Simulated - always returns False in simulator
        return False

# Color Sensor class
class ColorSensor:
    def __init__(self, port):
        self.port = port
        self._reflection = 50
        print(f"ColorSensor initialized on port {port}")
    
    def color(self):
        # Simulated color detection
        return Color.WHITE
    
    def reflection(self):
        # Return simulated reflection value
        return self._reflection
    
    def ambient(self):
        return 10

# Ultrasonic Sensor class
class UltrasonicSensor:
    def __init__(self, port):
        self.port = port
        print(f"UltrasonicSensor initialized on port {port}")
    
    def distance(self):
        # Simulated distance in mm
        if _robot_sim:
            return js.getRobotDistance()
        return 500

# Gyro Sensor class
class GyroSensor:
    def __init__(self, port):
        self.port = port
        self._angle = 0
        print(f"GyroSensor initialized on port {port}")
    
    def angle(self):
        return self._angle
    
    def speed(self):
        return 0
    
    def reset_angle(self, angle=0):
        self._angle = angle

# EV3 Brick class
class EV3Brick:
    def __init__(self):
        self.speaker = Speaker()
        self.light = Light()
        print("EV3Brick initialized")

class Speaker:
    def beep(self, frequency=500, duration=100):
        print(f"*BEEP* (frequency: {frequency}Hz, duration: {duration}ms)")
    
    def say(self, text):
        print(f"Robot says: {text}")

class Light:
    def on(self, color=None):
        print(f"Light on: {color}")
    
    def off(self):
        print("Light off")

# StopWatch class
class StopWatch:
    def __init__(self):
        self._start_time = _time.time()
        self._paused_time = 0
        self._is_paused = False
    
    def time(self):
        if self._is_paused:
            return int(self._paused_time * 1000)
        return int((_time.time() - self._start_time) * 1000)
    
    def reset(self):
        self._start_time = _time.time()
        self._paused_time = 0
        self._is_paused = False
    
    def pause(self):
        if not self._is_paused:
            self._paused_time = _time.time() - self._start_time
            self._is_paused = True
    
    def resume(self):
        if self._is_paused:
            self._start_time = _time.time() - self._paused_time
            self._is_paused = False

# Create proper Python module structure for imports to work
import sys
from types import ModuleType

# Create pybricks main module
pybricks = ModuleType('pybricks')
sys.modules['pybricks'] = pybricks

# Create pybricks.hubs submodule
pybricks_hubs = ModuleType('pybricks.hubs')
pybricks_hubs.EV3Brick = EV3Brick
pybricks.hubs = pybricks_hubs
sys.modules['pybricks.hubs'] = pybricks_hubs

# Create pybricks.ev3devices submodule
pybricks_ev3devices = ModuleType('pybricks.ev3devices')
pybricks_ev3devices.Motor = Motor
pybricks_ev3devices.TouchSensor = TouchSensor
pybricks_ev3devices.ColorSensor = ColorSensor
pybricks_ev3devices.UltrasonicSensor = UltrasonicSensor
pybricks_ev3devices.GyroSensor = GyroSensor
pybricks.ev3devices = pybricks_ev3devices
sys.modules['pybricks.ev3devices'] = pybricks_ev3devices

# Create pybricks.parameters submodule
pybricks_parameters = ModuleType('pybricks.parameters')
pybricks_parameters.Port = Port
pybricks_parameters.Color = Color
pybricks.parameters = pybricks_parameters
sys.modules['pybricks.parameters'] = pybricks_parameters

# Create pybricks.tools submodule
pybricks_tools = ModuleType('pybricks.tools')
pybricks_tools.wait = wait
pybricks_tools.StopWatch = StopWatch
pybricks.tools = pybricks_tools
sys.modules['pybricks.tools'] = pybricks_tools
`;

    await pyodide.runPythonAsync(pybricksStub);
}

// Run Python code
export async function runPythonCode(code, outputCallback, robotSim = null) {
    if (!isInitialized) {
        throw new Error('Pyodide not initialized');
    }
    
    robotSimulator = robotSim;
    
    try {
        // Clear previous output
        outputCallback('', true);
        
        // Redirect stdout to capture prints
        await pyodide.runPythonAsync(`
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
        `);
        
        // Run the user code
        await pyodide.runPythonAsync(code);
        
        // Get stdout
        const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()');
        const stderr = await pyodide.runPythonAsync('sys.stderr.getvalue()');
        
        if (stdout) {
            outputCallback(stdout, false, 'output');
        }
        
        if (stderr) {
            outputCallback(stderr, false, 'error');
        }
        
        if (!stdout && !stderr) {
            outputCallback('Code executed successfully (no output)', false, 'success');
        }
        
        return { success: true, output: stdout, error: stderr };
        
    } catch (error) {
        console.error('Python execution error:', error);
        const errorMessage = error.message || error.toString();
        outputCallback(`Error: ${errorMessage}`, false, 'error');
        return { success: false, error: errorMessage };
    }
}

// Set robot simulator reference
export function setRobotSimulator(sim) {
    robotSimulator = sim;
}

// Get robot simulator
export function getRobotSimulator() {
    return robotSimulator;
}

// Check if Pyodide is ready
export function isPyodideReady() {
    return isInitialized;
}

// Expose functions to Python via window
if (typeof window !== 'undefined') {
    window.updateRobotMotor = function(port, speed) {
        if (robotSimulator) {
            robotSimulator.updateMotor(port, speed);
        }
    };
    
    window.getRobotDistance = function() {
        if (robotSimulator) {
            return robotSimulator.getDistance();
        }
        return 500; // Default distance
    };
}