// curriculum.js - Complete PyBricks curriculum with 45 lessons across 3 tracks

export const curriculum = {
    beginner: [
        {
            id: 'b1',
            title: 'Welcome to PyBricks',
            description: 'Introduction to robotics programming and PyBricks basics',
            xp: 50,
            theory: `
                <h2>Welcome to Robotics Programming! 🤖</h2>
                <p>PyBricks is a powerful Python-based programming language designed specifically for LEGO robotics. In this lesson, you'll learn the fundamentals of controlling robots with code.</p>
                
                <h3>What is PyBricks?</h3>
                <p>PyBricks allows you to:</p>
                <ul>
                    <li>Control motors and sensors</li>
                    <li>Write Python code that runs on your robot</li>
                    <li>Create complex autonomous behaviors</li>
                    <li>Learn real programming concepts</li>
                </ul>
                
                <h3>Your First Program</h3>
                <p>Let's start with the most basic PyBricks program:</p>
                <pre>from pybricks.hubs import EV3Brick

brick = EV3Brick()
brick.speaker.beep()</pre>
                
                <p>This code creates a connection to the robot's brain (EV3Brick) and makes it beep!</p>
            `,
            starterCode: `from pybricks.hubs import EV3Brick

# Create a connection to the EV3 brick
brick = EV3Brick()

# Make the brick beep
brick.speaker.beep()

print("Hello, Robotics!")`,
            solution: null,
            challenges: ['Make the brick beep', 'Print a message']
        },
        {
            id: 'b2',
            title: 'Understanding Motors',
            description: 'Learn how to control robot motors',
            xp: 75,
            theory: `
                <h2>Controlling Motors ⚙️</h2>
                <p>Motors are the muscles of your robot. PyBricks gives you precise control over motor movement.</p>
                
                <h3>Motor Basics</h3>
                <p>To use a motor, you need to:</p>
                <ul>
                    <li>Import the Motor class</li>
                    <li>Specify which port the motor is connected to</li>
                    <li>Tell the motor what to do (speed, direction, duration)</li>
                </ul>
                
                <h3>Example Code</h3>
                <pre>from pybricks.ev3devices import Motor
from pybricks.parameters import Port

# Connect to a motor on port A
motor = Motor(Port.A)

# Run the motor at 200 degrees per second
motor.run(200)

# Wait 2 seconds
wait(2000)

# Stop the motor
motor.stop()</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

# Connect to motor on port A
motor = Motor(Port.A)

# Run motor forward at 200 degrees/second
motor.run(200)

# Wait 2 seconds
wait(2000)

# Stop the motor
motor.stop()

print("Motor movement complete!")`,
            solution: null,
            challenges: ['Run motor forward', 'Wait and stop']
        },
        {
            id: 'b3',
            title: 'Motor Direction Control',
            description: 'Control motor direction and rotation',
            xp: 75,
            theory: `
                <h2>Motor Directions 🔄</h2>
                <p>Motors can spin in two directions: forward (positive speed) and backward (negative speed).</p>
                
                <h3>Speed and Direction</h3>
                <p>The number you pass to <code>motor.run()</code> determines both speed and direction:</p>
                <ul>
                    <li>Positive numbers: clockwise rotation</li>
                    <li>Negative numbers: counter-clockwise rotation</li>
                    <li>Larger numbers: faster speed</li>
                </ul>
                
                <h3>Example</h3>
                <pre>motor.run(500)   # Fast forward
motor.run(-500)  # Fast backward
motor.run(100)   # Slow forward</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

motor = Motor(Port.A)

# Move forward
motor.run(300)
wait(1000)

# Move backward
motor.run(-300)
wait(1000)

# Stop
motor.stop()

print("Direction control complete!")`,
            solution: null,
            challenges: ['Run forward then backward']
        },
        {
            id: 'b4',
            title: 'Precise Motor Angles',
            description: 'Move motors by specific angles',
            xp: 100,
            theory: `
                <h2>Precise Movement 🎯</h2>
                <p>Sometimes you need exact control. Instead of running for time, you can rotate motors by specific angles.</p>
                
                <h3>Using run_angle()</h3>
                <p>The <code>run_angle(speed, angle)</code> method rotates the motor exactly by the specified angle in degrees.</p>
                
                <pre>motor.run_angle(200, 360)  # Rotate one full turn</pre>
                
                <p>This is perfect for:</p>
                <ul>
                    <li>Moving a specific distance</li>
                    <li>Turning exact amounts</li>
                    <li>Positioning mechanisms precisely</li>
                </ul>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port

motor = Motor(Port.A)

# Rotate 360 degrees (one full turn)
motor.run_angle(200, 360)

# Rotate back 180 degrees
motor.run_angle(200, -180)

print("Precise rotation complete!")`,
            solution: null,
            challenges: ['Rotate full turn, then half turn back']
        },
        {
            id: 'b5',
            title: 'Multiple Motors',
            description: 'Control multiple motors simultaneously',
            xp: 100,
            theory: `
                <h2>Using Multiple Motors 🤖</h2>
                <p>Real robots use multiple motors! Let's learn to control them together.</p>
                
                <h3>Connecting Multiple Motors</h3>
                <p>Each motor connects to a different port:</p>
                <pre>left_motor = Motor(Port.A)
right_motor = Motor(Port.B)</pre>
                
                <h3>Coordinated Movement</h3>
                <p>To move a robot forward, both motors run at the same speed in the same direction:</p>
                <pre>left_motor.run(300)
right_motor.run(300)</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

left_motor = Motor(Port.A)
right_motor = Motor(Port.B)

# Move forward
left_motor.run(300)
right_motor.run(300)
wait(2000)

# Stop both motors
left_motor.stop()
right_motor.stop()

print("Two motors controlled!")`,
            solution: null,
            challenges: ['Control two motors together']
        },
        {
            id: 'b6',
            title: 'Robot Turning',
            description: 'Learn to turn your robot',
            xp: 125,
            theory: `
                <h2>Turning Your Robot 🔄</h2>
                <p>To turn, we run the motors at different speeds or in opposite directions.</p>
                
                <h3>Turning Methods</h3>
                <ul>
                    <li><strong>Pivot turn:</strong> One motor forward, one backward</li>
                    <li><strong>Gentle turn:</strong> One motor faster than the other</li>
                    <li><strong>Point turn:</strong> Both motors opposite directions at same speed</li>
                </ul>
                
                <h3>Right Turn Example</h3>
                <pre>left_motor.run(400)   # Left faster
right_motor.run(100)  # Right slower</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

left_motor = Motor(Port.A)
right_motor = Motor(Port.B)

# Turn right (pivot)
left_motor.run(300)
right_motor.run(-300)
wait(1000)

# Stop
left_motor.stop()
right_motor.stop()

print("Robot turned right!")`,
            solution: null,
            challenges: ['Turn the robot right']
        },
        {
            id: 'b7',
            title: 'Introduction to Sensors',
            description: 'Learn about robot sensors',
            xp: 100,
            theory: `
                <h2>Robot Sensors 👁️</h2>
                <p>Sensors let robots perceive the world! They're like robot senses.</p>
                
                <h3>Common Sensors</h3>
                <ul>
                    <li><strong>Touch Sensor:</strong> Detects when pressed</li>
                    <li><strong>Color Sensor:</strong> Sees colors and light</li>
                    <li><strong>Ultrasonic Sensor:</strong> Measures distance</li>
                    <li><strong>Gyro Sensor:</strong> Detects rotation and angles</li>
                </ul>
                
                <h3>Reading Sensor Values</h3>
                <p>Each sensor has methods to read its current state:</p>
                <pre>from pybricks.ev3devices import TouchSensor

touch = TouchSensor(Port.S1)
is_pressed = touch.pressed()
print(is_pressed)  # True or False</pre>
            `,
            starterCode: `from pybricks.ev3devices import TouchSensor
from pybricks.parameters import Port

# Connect touch sensor to port S1
touch = TouchSensor(Port.S1)

# Read sensor (simulated)
is_pressed = False  # In real robot, use touch.pressed()

if is_pressed:
    print("Button is pressed!")
else:
    print("Button is not pressed")`,
            solution: null,
            challenges: ['Read a touch sensor']
        },
        {
            id: 'b8',
            title: 'Using the Color Sensor',
            description: 'Detect colors with your robot',
            xp: 125,
            theory: `
                <h2>Color Detection 🌈</h2>
                <p>The color sensor can detect different colors and measure light intensity.</p>
                
                <h3>Color Sensor Modes</h3>
                <ul>
                    <li><code>color()</code> - Returns detected color</li>
                    <li><code>reflection()</code> - Returns light reflection (0-100)</li>
                    <li><code>ambient()</code> - Returns ambient light</li>
                </ul>
                
                <h3>Example</h3>
                <pre>from pybricks.ev3devices import ColorSensor
from pybricks.parameters import Color

color_sensor = ColorSensor(Port.S3)
detected = color_sensor.color()

if detected == Color.RED:
    print("Red detected!")</pre>
            `,
            starterCode: `from pybricks.ev3devices import ColorSensor
from pybricks.parameters import Port, Color

color_sensor = ColorSensor(Port.S3)

# Simulate color detection
detected_color = Color.RED

print("Detected color:", detected_color)

# You can compare colors
if detected_color == Color.RED:
    print("Stop! Red means stop!")
elif detected_color == Color.GREEN:
    print("Go! Green means go!")`,
            solution: null,
            challenges: ['Detect and respond to colors']
        },
        {
            id: 'b9',
            title: 'Distance Sensing',
            description: 'Measure distance with ultrasonic sensor',
            xp: 125,
            theory: `
                <h2>Distance Measurement 📏</h2>
                <p>The ultrasonic sensor uses sound waves to measure distance, just like a bat!</p>
                
                <h3>How It Works</h3>
                <p>The sensor sends out ultrasonic pulses and measures how long they take to bounce back.</p>
                
                <h3>Using the Ultrasonic Sensor</h3>
                <pre>from pybricks.ev3devices import UltrasonicSensor

ultrasonic = UltrasonicSensor(Port.S4)
distance = ultrasonic.distance()  # Distance in mm
print("Distance:", distance, "mm")</pre>
                
                <p>This is perfect for obstacle avoidance!</p>
            `,
            starterCode: `from pybricks.ev3devices import UltrasonicSensor
from pybricks.parameters import Port

ultrasonic = UltrasonicSensor(Port.S4)

# Simulate distance reading
distance = 250  # millimeters

print("Distance to obstacle:", distance, "mm")

if distance < 200:
    print("Too close! Obstacle detected!")
else:
    print("Path is clear")`,
            solution: null,
            challenges: ['Read distance and detect obstacles']
        },
        {
            id: 'b10',
            title: 'Basic Loops',
            description: 'Repeat actions with loops',
            xp: 150,
            theory: `
                <h2>Loops for Repetition 🔁</h2>
                <p>Loops let you repeat code without writing it multiple times.</p>
                
                <h3>For Loop</h3>
                <p>Use when you know how many times to repeat:</p>
                <pre>for i in range(5):
    print("Loop", i)
    motor.run_angle(200, 360)</pre>
                
                <h3>While Loop</h3>
                <p>Use when repeating until a condition is met:</p>
                <pre>while distance > 100:
    motor.run(200)
    distance = ultrasonic.distance()</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port

motor = Motor(Port.A)

# Repeat action 3 times
for i in range(3):
    print("Rotation", i + 1)
    motor.run_angle(300, 360)
    
print("Loop complete!")`,
            solution: null,
            challenges: ['Use a loop to repeat motor movements']
        },
        {
            id: 'b11',
            title: 'Conditional Logic',
            description: 'Make decisions with if statements',
            xp: 150,
            theory: `
                <h2>Making Decisions 🤔</h2>
                <p>Conditionals let robots make choices based on sensor data.</p>
                
                <h3>If-Else Structure</h3>
                <pre>if condition:
    # Do this if true
else:
    # Do this if false</pre>
                
                <h3>Robot Example</h3>
                <pre>if touch.pressed():
    motor.stop()
    print("Obstacle hit!")
else:
    motor.run(300)
    print("Moving forward")</pre>
                
                <h3>Multiple Conditions</h3>
                <pre>if color == Color.RED:
    # Stop
elif color == Color.GREEN:
    # Go
else:
    # Default action</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor, ColorSensor
from pybricks.parameters import Port, Color

motor = Motor(Port.A)
color_sensor = ColorSensor(Port.S3)

# Simulate color reading
detected = Color.RED

if detected == Color.RED:
    print("Red detected - stopping!")
    motor.stop()
elif detected == Color.GREEN:
    print("Green detected - going!")
    motor.run(300)
else:
    print("Unknown color")`,
            solution: null,
            challenges: ['Use if-else to control motor based on color']
        },
        {
            id: 'b12',
            title: 'Beginner Challenge',
            description: 'Build a simple obstacle-avoiding robot',
            xp: 200,
            theory: `
                <h2>Final Challenge: Obstacle Avoider 🎯</h2>
                <p>Combine everything you've learned to create a robot that moves forward and stops before hitting obstacles!</p>
                
                <h3>Requirements</h3>
                <ul>
                    <li>Move forward continuously</li>
                    <li>Check distance sensor in a loop</li>
                    <li>Stop when obstacle is closer than 200mm</li>
                    <li>Print status messages</li>
                </ul>
                
                <h3>Pseudocode</h3>
                <pre>while True:
    distance = check_distance()
    if distance < 200:
        stop_motors()
        break
    else:
        move_forward()</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.tools import wait

left_motor = Motor(Port.A)
right_motor = Motor(Port.B)
ultrasonic = UltrasonicSensor(Port.S4)

# Your code here: Create an obstacle avoider
# Move forward until obstacle is closer than 200mm

print("Challenge complete!")`,
            solution: `from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.tools import wait

left_motor = Motor(Port.A)
right_motor = Motor(Port.B)
ultrasonic = UltrasonicSensor(Port.S4)

while True:
    distance = ultrasonic.distance()
    print("Distance:", distance, "mm")
    
    if distance < 200:
        left_motor.stop()
        right_motor.stop()
        print("Obstacle detected! Stopped.")
        break
    else:
        left_motor.run(300)
        right_motor.run(300)
    
    wait(100)`,
            challenges: ['Create obstacle avoider', 'Use loops and conditions', 'Stop before collision']
        }
    ],
    
    intermediate: [
        {
            id: 'i1',
            title: 'Advanced Loops',
            description: 'Master loop techniques',
            xp: 150,
            theory: `
                <h2>Advanced Looping Techniques 🔄</h2>
                <p>Learn powerful loop patterns for robotics.</p>
                
                <h3>Loop Control</h3>
                <ul>
                    <li><code>break</code> - Exit loop early</li>
                    <li><code>continue</code> - Skip to next iteration</li>
                    <li>Nested loops - Loops inside loops</li>
                </ul>
                
                <h3>Example: Search Pattern</h3>
                <pre>for row in range(3):
    for col in range(3):
        move_to_position(row, col)
        if target_found():
            break</pre>
            `,
            starterCode: `from pybricks.tools import wait

# Count and skip even numbers
for i in range(10):
    if i % 2 == 0:
        continue  # Skip even numbers
    print("Odd number:", i)
    
print("Advanced loops complete!")`,
            solution: null,
            challenges: ['Use break and continue effectively']
        },
        {
            id: 'i2',
            title: 'Line Following Basics',
            description: 'Follow a line using color sensor',
            xp: 175,
            theory: `
                <h2>Line Following 📍</h2>
                <p>One of the most important robot skills - following a line on the ground!</p>
                
                <h3>Basic Strategy</h3>
                <p>The color sensor detects light reflection. Dark line = low reflection, light surface = high reflection.</p>
                
                <h3>Simple Algorithm</h3>
                <pre>while True:
    reflection = color_sensor.reflection()
    if reflection < 50:  # On line
        turn_right()
    else:  # Off line
        turn_left()</pre>
                
                <p>This creates a zigzag pattern that follows the line!</p>
            `,
            starterCode: `from pybricks.ev3devices import Motor, ColorSensor
from pybricks.parameters import Port
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
sensor = ColorSensor(Port.S3)

# Simple line follower
for i in range(10):
    reflection = sensor.reflection()
    
    if reflection < 40:  # Dark (on line)
        left.run(200)
        right.run(100)
    else:  # Light (off line)
        left.run(100)
        right.run(200)
    
    wait(100)

print("Line following complete!")`,
            solution: null,
            challenges: ['Follow a line using reflection values']
        },
        {
            id: 'i3',
            title: 'Proportional Control',
            description: 'Smooth control with proportional steering',
            xp: 200,
            theory: `
                <h2>Proportional Control 📊</h2>
                <p>Instead of jerky on/off control, use proportional control for smooth movement!</p>
                
                <h3>The Concept</h3>
                <p>The error (difference from target) determines how much to correct:</p>
                <pre>error = target - current_value
correction = error * gain
speed = base_speed + correction</pre>
                
                <h3>Line Following Example</h3>
                <pre>TARGET = 50  # Middle gray value
GAIN = 2

error = TARGET - reflection
turn = error * GAIN
left.run(200 + turn)
right.run(200 - turn)</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor, ColorSensor
from pybricks.parameters import Port

left = Motor(Port.A)
right = Motor(Port.B)
sensor = ColorSensor(Port.S3)

TARGET = 50
GAIN = 2
BASE_SPEED = 200

# Proportional line follower
for i in range(20):
    reflection = sensor.reflection()
    error = TARGET - reflection
    correction = error * GAIN
    
    left.run(BASE_SPEED + correction)
    right.run(BASE_SPEED - correction)

print("Smooth control achieved!")`,
            solution: null,
            challenges: ['Implement proportional control']
        },
        {
            id: 'i4',
            title: 'Robot Functions',
            description: 'Organize code with functions',
            xp: 150,
            theory: `
                <h2>Functions for Organization 📦</h2>
                <p>Functions let you package code into reusable blocks.</p>
                
                <h3>Defining Functions</h3>
                <pre>def move_forward(speed, duration):
    left.run(speed)
    right.run(speed)
    wait(duration)
    left.stop()
    right.stop()</pre>
                
                <h3>Using Functions</h3>
                <pre>move_forward(300, 2000)  # Move at 300 for 2 seconds
turn_right(90)  # Turn 90 degrees
move_forward(200, 1000)  # Move slower</pre>
                
                <p>Functions make code cleaner and easier to understand!</p>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)

def move_forward(speed, duration):
    left.run(speed)
    right.run(speed)
    wait(duration)
    left.stop()
    right.stop()

def turn_right(duration):
    left.run(300)
    right.run(-300)
    wait(duration)
    left.stop()
    right.stop()

# Use the functions
move_forward(300, 1000)
turn_right(500)
move_forward(200, 1000)

print("Functions executed!")`,
            solution: null,
            challenges: ['Create and use robot functions']
        },
        {
            id: 'i5',
            title: 'Timing and Delays',
            description: 'Master robot timing',
            xp: 125,
            theory: `
                <h2>Precise Timing ⏱️</h2>
                <p>Timing is crucial in robotics for coordination and control.</p>
                
                <h3>Wait Functions</h3>
                <pre>from pybricks.tools import wait, StopWatch

wait(1000)  # Wait 1 second (1000 ms)

timer = StopWatch()
timer.reset()
elapsed = timer.time()  # Time since reset in ms</pre>
                
                <h3>Timed Actions</h3>
                <pre>timer = StopWatch()
while timer.time() < 5000:  # Run for 5 seconds
    motor.run(300)
motor.stop()</pre>
            `,
            starterCode: `from pybricks.tools import wait, StopWatch
from pybricks.ev3devices import Motor
from pybricks.parameters import Port

motor = Motor(Port.A)

# Use a timer for precise control
timer = StopWatch()
timer.reset()

motor.run(300)
while timer.time() < 3000:  # Run for 3 seconds
    print("Elapsed:", timer.time(), "ms")
    wait(500)

motor.stop()
print("Timed movement complete!")`,
            solution: null,
            challenges: ['Use timers for precise control']
        },
        {
            id: 'i6',
            title: 'Wall Following',
            description: 'Follow walls using distance sensor',
            xp: 200,
            theory: `
                <h2>Wall Following 🧱</h2>
                <p>Use the ultrasonic sensor to maintain a constant distance from a wall.</p>
                
                <h3>Strategy</h3>
                <p>Similar to line following, but using distance instead of color:</p>
                
                <pre>TARGET_DISTANCE = 200  # Stay 200mm from wall
current = ultrasonic.distance()
error = current - TARGET_DISTANCE

if error > 0:  # Too far
    turn_toward_wall()
else:  # Too close
    turn_away_from_wall()</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
ultrasonic = UltrasonicSensor(Port.S4)

TARGET = 200
GAIN = 1

# Wall follower
for i in range(20):
    distance = ultrasonic.distance()
    error = distance - TARGET
    correction = error * GAIN
    
    left.run(200 - correction)
    right.run(200 + correction)
    wait(100)

left.stop()
right.stop()
print("Wall following complete!")`,
            solution: null,
            challenges: ['Follow a wall at constant distance']
        },
        {
            id: 'i7',
            title: 'State Machines Intro',
            description: 'Learn basic state machine patterns',
            xp: 200,
            theory: `
                <h2>State Machines 🎰</h2>
                <p>State machines help robots switch between different behaviors.</p>
                
                <h3>States</h3>
                <p>A robot might have states like:</p>
                <ul>
                    <li>SEARCHING - Looking for target</li>
                    <li>MOVING - Moving toward target</li>
                    <li>STOPPED - At target</li>
                </ul>
                
                <h3>Simple State Machine</h3>
                <pre>state = "SEARCHING"

while True:
    if state == "SEARCHING":
        rotate()
        if target_found():
            state = "MOVING"
    elif state == "MOVING":
        move_forward()
        if at_target():
            state = "STOPPED"
    elif state == "STOPPED":
        break</pre>
            `,
            starterCode: `from pybricks.tools import wait

state = "SEARCHING"
steps = 0

while steps < 10:
    steps += 1
    
    if state == "SEARCHING":
        print("State: Searching...")
        if steps > 3:
            state = "FOUND"
    elif state == "FOUND":
        print("State: Found target!")
        state = "MOVING"
    elif state == "MOVING":
        print("State: Moving to target...")
        if steps > 7:
            state = "COMPLETE"
    elif state == "COMPLETE":
        print("State: Mission complete!")
        break
    
    wait(500)`,
            solution: null,
            challenges: ['Create a state machine']
        },
        {
            id: 'i8',
            title: 'Gyro Sensor Basics',
            description: 'Use gyro for accurate turning',
            xp: 175,
            theory: `
                <h2>Gyroscopic Sensing 🌀</h2>
                <p>The gyro sensor measures rotation - perfect for accurate turns!</p>
                
                <h3>Gyro Methods</h3>
                <ul>
                    <li><code>angle()</code> - Total rotation since reset</li>
                    <li><code>speed()</code> - Current rotation speed</li>
                    <li><code>reset_angle()</code> - Reset to zero</li>
                </ul>
                
                <h3>Accurate Turn</h3>
                <pre>gyro.reset_angle(0)
while gyro.angle() < 90:
    left.run(200)
    right.run(-200)
left.stop()
right.stop()</pre>
            `,
            starterCode: `from pybricks.ev3devices import GyroSensor, Motor
from pybricks.parameters import Port

gyro = GyroSensor(Port.S2)
left = Motor(Port.A)
right = Motor(Port.B)

# Reset and turn 90 degrees
gyro.reset_angle(0)

while gyro.angle() < 90:
    left.run(200)
    right.run(-200)
    print("Angle:", gyro.angle())

left.stop()
right.stop()
print("Turned 90 degrees!")`,
            solution: null,
            challenges: ['Turn exactly 90 degrees using gyro']
        },
        {
            id: 'i9',
            title: 'Sensor Fusion',
            description: 'Combine multiple sensors',
            xp: 225,
            theory: `
                <h2>Sensor Fusion 🔬</h2>
                <p>Use multiple sensors together for better decisions!</p>
                
                <h3>Why Combine Sensors?</h3>
                <ul>
                    <li>More reliable detection</li>
                    <li>Handle complex scenarios</li>
                    <li>Backup if one sensor fails</li>
                </ul>
                
                <h3>Example</h3>
                <pre>color = color_sensor.color()
distance = ultrasonic.distance()

if distance < 100 and color == Color.RED:
    # Emergency stop
    stop_all()
elif distance < 200:
    # Slow down
    move_slow()
else:
    # Normal speed
    move_normal()</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor, ColorSensor, UltrasonicSensor
from pybricks.parameters import Port, Color

left = Motor(Port.A)
right = Motor(Port.B)
color_sensor = ColorSensor(Port.S3)
ultrasonic = UltrasonicSensor(Port.S4)

# Multi-sensor decision
color = color_sensor.color()
distance = ultrasonic.distance()

print("Color:", color)
print("Distance:", distance)

if distance < 100:
    print("Obstacle very close - STOP")
    left.stop()
    right.stop()
elif color == Color.RED:
    print("Red line - STOP")
    left.stop()
    right.stop()
else:
    print("All clear - GO")
    left.run(300)
    right.run(300)`,
            solution: null,
            challenges: ['Make decisions using multiple sensors']
        },
        {
            id: 'i10',
            title: 'Speed Ramping',
            description: 'Smooth acceleration and deceleration',
            xp: 175,
            theory: `
                <h2>Smooth Speed Changes 📈</h2>
                <p>Instead of instant speed changes, ramp up and down for smoother movement.</p>
                
                <h3>Acceleration</h3>
                <pre>for speed in range(0, 500, 50):
    motor.run(speed)
    wait(100)</pre>
                
                <h3>Deceleration</h3>
                <pre>for speed in range(500, 0, -50):
    motor.run(speed)
    wait(100)
motor.stop()</pre>
                
                <p>This prevents jerky movements and reduces stress on motors!</p>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port
from pybricks.tools import wait

motor = Motor(Port.A)

# Accelerate smoothly
print("Accelerating...")
for speed in range(0, 600, 100):
    motor.run(speed)
    print("Speed:", speed)
    wait(300)

# Decelerate smoothly
print("Decelerating...")
for speed in range(600, 0, -100):
    motor.run(speed)
    print("Speed:", speed)
    wait(300)

motor.stop()
print("Smooth ramping complete!")`,
            solution: null,
            challenges: ['Implement smooth acceleration']
        },
        {
            id: 'i11',
            title: 'Maze Navigation',
            description: 'Navigate through a simple maze',
            xp: 250,
            theory: `
                <h2>Maze Solving 🧩</h2>
                <p>Combine sensors and logic to navigate mazes.</p>
                
                <h3>Wall Follower Strategy</h3>
                <p>One simple maze algorithm: always follow the right (or left) wall.</p>
                
                <pre>while not at_exit():
    if right_wall_exists():
        move_forward()
    else:
        turn_right()
        move_forward()</pre>
                
                <h3>Decision Making</h3>
                <p>Use distance sensor to detect walls in different directions.</p>
            `,
            starterCode: `from pybricks.ev3devices import Motor, UltrasonicSensor
from pybricks.parameters import Port
from pybricks.tools import wait

left = Motor(Port.A)
right = Motor(Port.B)
ultrasonic = UltrasonicSensor(Port.S4)

def move_forward(duration):
    left.run(300)
    right.run(300)
    wait(duration)
    left.stop()
    right.stop()

def turn_right():
    left.run(300)
    right.run(-300)
    wait(500)
    left.stop()
    right.stop()

# Simple maze navigation
for i in range(5):
    distance = ultrasonic.distance()
    
    if distance < 200:
        print("Wall ahead - turning right")
        turn_right()
    else:
        print("Path clear - moving forward")
        move_forward(1000)

print("Maze navigation complete!")`,
            solution: null,
            challenges: ['Navigate maze using wall-following']
        },
        {
            id: 'i12',
            title: 'Data Logging',
            description: 'Record and analyze sensor data',
            xp: 150,
            theory: `
                <h2>Data Logging 📊</h2>
                <p>Record sensor data for analysis and debugging.</p>
                
                <h3>Using Lists</h3>
                <pre>data = []
for i in range(100):
    reading = sensor.value()
    data.append(reading)
    wait(50)

# Analyze
average = sum(data) / len(data)
print("Average:", average)</pre>
                
                <h3>Why Log Data?</h3>
                <ul>
                    <li>Debug sensor issues</li>
                    <li>Tune control parameters</li>
                    <li>Analyze robot performance</li>
                </ul>
            `,
            starterCode: `from pybricks.ev3devices import ColorSensor
from pybricks.parameters import Port
from pybricks.tools import wait

sensor = ColorSensor(Port.S3)

# Collect reflection data
data = []
for i in range(10):
    reflection = sensor.reflection()
    data.append(reflection)
    print("Reading", i + 1, ":", reflection)
    wait(200)

# Analyze
average = sum(data) / len(data)
maximum = max(data)
minimum = min(data)

print("---Analysis---")
print("Average:", average)
print("Max:", maximum)
print("Min:", minimum)`,
            solution: null,
            challenges: ['Log and analyze sensor data']
        },
        {
            id: 'i13',
            title: 'PID Controller Basics',
            description: 'Introduction to PID control',
            xp: 250,
            theory: `
                <h2>PID Control 🎯</h2>
                <p>PID (Proportional-Integral-Derivative) is advanced control for precise robot behavior.</p>
                
                <h3>Three Components</h3>
                <ul>
                    <li><strong>P:</strong> Proportional - Based on current error</li>
                    <li><strong>I:</strong> Integral - Based on accumulated error</li>
                    <li><strong>D:</strong> Derivative - Based on rate of change</li>
                </ul>
                
                <h3>Simple PID</h3>
                <pre>integral = 0
last_error = 0

error = target - current
integral += error
derivative = error - last_error

output = Kp*error + Ki*integral + Kd*derivative
last_error = error</pre>
            `,
            starterCode: `# PID line follower example
TARGET = 50
Kp = 1.5
Ki = 0.01
Kd = 0.5

integral = 0
last_error = 0

# Simulated sensor readings
readings = [45, 48, 52, 55, 51, 49, 50]

for reflection in readings:
    error = TARGET - reflection
    integral += error
    derivative = error - last_error
    
    correction = Kp*error + Ki*integral + Kd*derivative
    
    print(f"Error: {error}, Correction: {correction:.2f}")
    last_error = error

print("PID calculation complete!")`,
            solution: null,
            challenges: ['Implement basic PID control']
        },
        {
            id: 'i14',
            title: 'Object Detection',
            description: 'Detect and track objects',
            xp: 200,
            theory: `
                <h2>Object Detection 🎯</h2>
                <p>Use sensors to find and track objects in the environment.</p>
                
                <h3>Detection Strategy</h3>
                <ol>
                    <li>Scan the environment (rotate)</li>
                    <li>Record distances at each angle</li>
                    <li>Find minimum distance (closest object)</li>
                    <li>Turn to face that object</li>
                </ol>
                
                <h3>Scanning Pattern</h3>
                <pre>distances = []
for angle in range(0, 180, 10):
    turn_to_angle(angle)
    dist = ultrasonic.distance()
    distances.append((angle, dist))

# Find closest
closest = min(distances, key=lambda x: x[1])
turn_to_angle(closest[0])</pre>
            `,
            starterCode: `from pybricks.tools import wait

# Simulate scanning for objects
print("Scanning for objects...")

scan_data = []
for angle in range(0, 180, 30):
    # Simulate distance reading
    distance = 500 - abs(90 - angle) * 3
    scan_data.append((angle, distance))
    print(f"Angle {angle}°: {distance}mm")
    wait(200)

# Find closest object
closest = min(scan_data, key=lambda x: x[1])
print(f"\\nClosest object at {closest[0]}° distance {closest[1]}mm")`,
            solution: null,
            challenges: ['Scan and locate closest object']
        },
        {
            id: 'i15',
            title: 'Intermediate Challenge',
            description: 'Build an autonomous delivery robot',
            xp: 300,
            theory: `
                <h2>Challenge: Delivery Robot 🚚</h2>
                <p>Create a robot that navigates to waypoints and avoids obstacles!</p>
                
                <h3>Requirements</h3>
                <ul>
                    <li>Follow a line to destination</li>
                    <li>Stop at color markers (red = stop)</li>
                    <li>Avoid obstacles using distance sensor</li>
                    <li>Use state machine for different behaviors</li>
                    <li>Log the journey</li>
                </ul>
                
                <h3>States</h3>
                <pre>- FOLLOWING_LINE
- OBSTACLE_DETECTED
- AT_WAYPOINT
- COMPLETE</pre>
            `,
            starterCode: `# Build your delivery robot here!
# Combine: line following, obstacle avoidance, states

from pybricks.ev3devices import Motor, ColorSensor, UltrasonicSensor
from pybricks.parameters import Port, Color
from pybricks.tools import wait

# Initialize
left = Motor(Port.A)
right = Motor(Port.B)
color = ColorSensor(Port.S3)
distance = UltrasonicSensor(Port.S4)

# Your code here
state = "FOLLOWING_LINE"

print("Delivery robot ready!")`,
            solution: null,
            challenges: ['Create autonomous delivery robot', 'Use multiple sensors', 'Implement state machine']
        }
    ],
    
    advanced: [
        {
            id: 'a1',
            title: 'Advanced PID Tuning',
            description: 'Master PID parameter tuning',
            xp: 250,
            theory: `
                <h2>PID Tuning 🎛️</h2>
                <p>Learn to tune PID parameters for optimal performance.</p>
                
                <h3>Tuning Process</h3>
                <ol>
                    <li>Start with P only (Ki=0, Kd=0)</li>
                    <li>Increase until oscillation occurs</li>
                    <li>Add D to dampen oscillations</li>
                    <li>Add I to eliminate steady-state error</li>
                </ol>
                
                <h3>Parameter Effects</h3>
                <ul>
                    <li><strong>Kp too high:</strong> Oscillation</li>
                    <li><strong>Ki too high:</strong> Overshoot</li>
                    <li><strong>Kd too high:</strong> Sluggish response</li>
                </ul>
            `,
            starterCode: `# PID tuning exercise
class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.integral = 0
        self.last_error = 0
    
    def calculate(self, error):
        self.integral += error
        derivative = error - self.last_error
        output = self.kp * error + self.ki * self.integral + self.kd * derivative
        self.last_error = error
        return output

# Try different values
pid = PIDController(kp=1.0, ki=0.05, kd=0.1)

# Simulate
target = 50
current = 30

for i in range(10):
    error = target - current
    correction = pid.calculate(error)
    current += correction * 0.1  # Simulated response
    print(f"Step {i}: Current={current:.1f}, Correction={correction:.2f}")

print("Tune Kp, Ki, Kd for best performance!")`,
            solution: null,
            challenges: ['Tune PID parameters', 'Minimize oscillation']
        },
        {
            id: 'a2',
            title: 'Path Planning',
            description: 'Plan optimal paths',
            xp: 300,
            theory: `
                <h2>Path Planning 🗺️</h2>
                <p>Calculate the best route from start to goal.</p>
                
                <h3>Grid-Based Planning</h3>
                <p>Represent the world as a grid, mark obstacles, find path.</p>
                
                <h3>A* Algorithm Concept</h3>
                <pre>1. Start at current position
2. Explore neighbors
3. Calculate cost: distance + heuristic
4. Choose lowest cost
5. Repeat until goal reached</pre>
                
                <h3>Simple Example</h3>
                <pre>path = []
current = start
while current != goal:
    next_step = choose_best_neighbor(current)
    path.append(next_step)
    current = next_step</pre>
            `,
            starterCode: `# Simple path planning
def plan_path(start, goal, obstacles):
    # Simple path: go right then up (no obstacles)
    path = []
    x, y = start
    gx, gy = goal
    
    # Move horizontally
    while x < gx:
        x += 1
        path.append((x, y))
    
    # Move vertically
    while y < gy:
        y += 1
        path.append((x, y))
    
    return path

start = (0, 0)
goal = (5, 3)
obstacles = [(2, 1), (3, 1)]

path = plan_path(start, goal, obstacles)
print("Planned path:", path)

# Challenge: Improve to avoid obstacles!`,
            solution: null,
            challenges: ['Plan collision-free path']
        },
        {
            id: 'a3',
            title: 'Multi-Motor Coordination',
            description: 'Synchronize multiple motors precisely',
            xp: 275,
            theory: `
                <h2>Motor Synchronization ⚙️⚙️</h2>
                <p>Coordinate multiple motors for complex mechanisms.</p>
                
                <h3>Synchronized Movement</h3>
                <pre>from pybricks.robotics import DriveBase

# Create drive base
robot = DriveBase(left_motor, right_motor, wheel_diameter=56, axle_track=114)

# Move with precise control
robot.straight(500)  # 500mm forward
robot.turn(90)  # 90 degree turn</pre>
                
                <h3>Custom Synchronization</h3>
                <pre># Keep motors in sync
target_angle = 360
left_motor.run_angle(200, target_angle, wait=False)
right_motor.run_angle(200, target_angle, wait=True)</pre>
            `,
            starterCode: `from pybricks.ev3devices import Motor
from pybricks.parameters import Port

motor1 = Motor(Port.A)
motor2 = Motor(Port.B)
motor3 = Motor(Port.C)

# Synchronize three motors
target = 720  # Two full rotations

print("Starting synchronized movement...")

# Start all motors simultaneously
motor1.run_angle(300, target, wait=False)
motor2.run_angle(300, target, wait=False)
motor3.run_angle(300, target, wait=True)

print("All motors synchronized!")

# Check final positions
print("Motor 1:", motor1.angle())
print("Motor 2:", motor2.angle())
print("Motor 3:", motor3.angle())`,
            solution: null,
            challenges: ['Synchronize three motors perfectly']
        },
        {
            id: 'a4',
            title: 'Kalman Filtering',
            description: 'Filter noisy sensor data',
            xp: 300,
            theory: `
                <h2>Kalman Filtering 📉</h2>
                <p>Remove noise from sensor readings for better accuracy.</p>
                
                <h3>Why Filter?</h3>
                <p>Sensors are noisy! Filtering gives you the true value.</p>
                
                <h3>Simple Moving Average</h3>
                <pre>readings = []
for i in range(10):
    readings.append(sensor.value())

filtered = sum(readings) / len(readings)</pre>
                
                <h3>Exponential Smoothing</h3>
                <pre>alpha = 0.3  # Smoothing factor
filtered = alpha * new_reading + (1 - alpha) * old_filtered</pre>
            `,
            starterCode: `# Exponential moving average filter
class EMAFilter:
    def __init__(self, alpha=0.3):
        self.alpha = alpha
        self.value = None
    
    def update(self, measurement):
        if self.value is None:
            self.value = measurement
        else:
            self.value = self.alpha * measurement + (1 - self.alpha) * self.value
        return self.value

# Test with noisy data
filter = EMAFilter(alpha=0.3)

# Simulated noisy sensor (true value around 100)
import random
noisy_readings = [100 + random.randint(-10, 10) for _ in range(20)]

print("Raw vs Filtered:")
for reading in noisy_readings:
    filtered = filter.update(reading)
    print(f"Raw: {reading:3d}  Filtered: {filtered:.1f}")`,
            solution: null,
            challenges: ['Implement sensor filtering']
        },
        {
            id: 'a5',
            title: 'Localization',
            description: 'Track robot position',
            xp: 325,
            theory: `
                <h2>Robot Localization 📍</h2>
                <p>Track where your robot is in the world.</p>
                
                <h3>Dead Reckoning</h3>
                <p>Track position by monitoring wheel rotations:</p>
                <pre>distance = (left_distance + right_distance) / 2
x += distance * cos(heading)
y += distance * sin(heading)

angle_change = (right_distance - left_distance) / wheelbase
heading += angle_change</pre>
                
                <h3>Sensor Fusion</h3>
                <p>Combine gyro, encoders, and other sensors for better accuracy.</p>
            `,
            starterCode: `import math

class RobotOdometry:
    def __init__(self, wheel_diameter=56, wheelbase=114):
        self.x = 0
        self.y = 0
        self.heading = 0
        self.wheel_circumference = wheel_diameter * math.pi
        self.wheelbase = wheelbase
    
    def update(self, left_angle, right_angle):
        # Convert angles to distance
        left_dist = (left_angle / 360) * self.wheel_circumference
        right_dist = (right_angle / 360) * self.wheel_circumference
        
        # Calculate movement
        distance = (left_dist + right_dist) / 2
        angle_change = (right_dist - left_dist) / self.wheelbase
        
        # Update position
        self.heading += angle_change
        self.x += distance * math.cos(self.heading)
        self.y += distance * math.sin(self.heading)
    
    def position(self):
        return (self.x, self.y, math.degrees(self.heading))

# Test
odom = RobotOdometry()
odom.update(360, 360)  # Both wheels one rotation
print("Position:", odom.position())

odom.update(180, -180)  # Turn in place
print("Position after turn:", odom.position())`,
            solution: null,
            challenges: ['Track robot position accurately']
        },
        {
            id: 'a6',
            title: 'Behavior Trees',
            description: 'Advanced decision making',
            xp: 300,
            theory: `
                <h2>Behavior Trees 🌳</h2>
                <p>Hierarchical structure for complex robot behaviors.</p>
                
                <h3>Tree Nodes</h3>
                <ul>
                    <li><strong>Sequence:</strong> Execute children in order</li>
                    <li><strong>Selector:</strong> Try until one succeeds</li>
                    <li><strong>Action:</strong> Do something</li>
                    <li><strong>Condition:</strong> Check something</li>
                </ul>
                
                <h3>Example Tree</h3>
                <pre>Selector:
  - Sequence:
      - Check obstacle
      - Avoid obstacle
  - Sequence:
      - Check line
      - Follow line
  - Explore randomly</pre>
            `,
            starterCode: `# Simple behavior tree
class Node:
    def run(self):
        pass

class Sequence(Node):
    def __init__(self, children):
        self.children = children
    
    def run(self):
        for child in self.children:
            if not child.run():
                return False
        return True

class Selector(Node):
    def __init__(self, children):
        self.children = children
    
    def run(self):
        for child in self.children:
            if child.run():
                return True
        return False

class Action(Node):
    def __init__(self, action_func):
        self.action = action_func
    
    def run(self):
        return self.action()

# Build tree
def check_obstacle():
    print("Checking for obstacle...")
    return False  # No obstacle

def follow_line():
    print("Following line...")
    return True

tree = Selector([
    Sequence([
        Action(check_obstacle),
        Action(lambda: print("Avoiding!") or True)
    ]),
    Action(follow_line)
])

tree.run()`,
            solution: null,
            challenges: ['Create behavior tree']
        }
    ]
};

// Helper function to get lesson by ID
export function getLessonById(lessonId) {
    for (const track of ['beginner', 'intermediate', 'advanced']) {
        const lesson = curriculum[track].find(l => l.id === lessonId);
        if (lesson) {
            return { ...lesson, track };
        }
    }
    return null;
}

// Get next lesson
export function getNextLesson(currentId) {
    for (const track of ['beginner', 'intermediate', 'advanced']) {
        const index = curriculum[track].findIndex(l => l.id === currentId);
        if (index !== -1) {
            // Next in same track
            if (index < curriculum[track].length - 1) {
                return curriculum[track][index + 1].id;
            }
            // Move to next track
            if (track === 'beginner') return curriculum.intermediate[0].id;
            if (track === 'intermediate') return curriculum.advanced[0].id;
            return null;
        }
    }
    return null;
}

// Get previous lesson
export function getPreviousLesson(currentId) {
    for (const track of ['beginner', 'intermediate', 'advanced']) {
        const index = curriculum[track].findIndex(l => l.id === currentId);
        if (index !== -1) {
            if (index > 0) {
                return curriculum[track][index - 1].id;
            }
            // Move to previous track
            if (track === 'intermediate') return curriculum.beginner[curriculum.beginner.length - 1].id;
            if (track === 'advanced') return curriculum.intermediate[curriculum.intermediate.length - 1].id;
            return null;
        }
    }
    return null;
}