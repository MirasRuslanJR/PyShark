// robot-sim.js - Three.js 3D robot simulation

export class RobotSimulator {
    constructor(containerId) {
        this.containerId = containerId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.robot = null;
        this.motors = {
            A: 0,
            B: 0,
            C: 0,
            D: 0
        };
        this.position = { x: 0, y: 0, z: 0 };
        this.rotation = 0;
        this.animationId = null;
        
        this.initScene();
    }
    
    initScene() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found:', this.containerId);
            return;
        }
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(8, 8, 8);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.shadowMap.enabled = true;
        container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.addLights();
        
        // Add ground
        this.addGround();
        
        // Create robot
        this.createRobot();
        
        // Add grid
        const gridHelper = new THREE.GridHelper(20, 20, 0xffb6c1, 0xffe4e8);
        this.scene.add(gridHelper);
        
        // Start animation loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
    }
    
    addGround() {
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    createRobot() {
        this.robot = new THREE.Group();
        
        // Robot body (main cube)
        const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb6c1, // Pink!
            roughness: 0.5,
            metalness: 0.2
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.4;
        body.castShadow = true;
        this.robot.add(body);
        
        // Robot "eyes" (cute detail)
        const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x262626 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 0.6, 0.76);
        this.robot.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 0.6, 0.76);
        this.robot.add(rightEye);
        
        // Wheels
        this.createWheels();
        
        // Sensor (cute antenna)
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
        const antennaMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b9d });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(0, 1.1, 0.5);
        this.robot.add(antenna);
        
        const antennaTopGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const antennaTop = new THREE.Mesh(antennaTopGeometry, antennaMaterial);
        antennaTop.position.set(0, 1.4, 0.5);
        this.robot.add(antennaTop);
        
        this.scene.add(this.robot);
    }
    
    createWheels() {
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
        const wheelMaterial = new THREE.MeshStandardMaterial({
            color: 0x525252,
            roughness: 0.8
        });
        
        // Left wheel
        this.leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.leftWheel.rotation.z = Math.PI / 2;
        this.leftWheel.position.set(-0.9, 0.3, 0.5);
        this.leftWheel.castShadow = true;
        this.robot.add(this.leftWheel);
        
        // Right wheel
        this.rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        this.rightWheel.rotation.z = Math.PI / 2;
        this.rightWheel.position.set(0.9, 0.3, 0.5);
        this.rightWheel.castShadow = true;
        this.robot.add(this.rightWheel);
        
        // Back wheel (caster)
        const casterGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const caster = new THREE.Mesh(casterGeometry, wheelMaterial);
        caster.position.set(0, 0.2, -0.7);
        this.robot.add(caster);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update robot physics
        this.updateRobotPhysics();
        
        // Rotate wheels based on motor speeds
        if (this.leftWheel && this.motors.A !== 0) {
            this.leftWheel.rotation.y += this.motors.A * 0.001;
        }
        if (this.rightWheel && this.motors.B !== 0) {
            this.rightWheel.rotation.y += this.motors.B * 0.001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    updateRobotPhysics() {
        if (!this.robot) return;
        
        const leftSpeed = this.motors.A || 0;
        const rightSpeed = this.motors.B || 0;
        
        // Calculate robot movement
        const averageSpeed = (leftSpeed + rightSpeed) / 2;
        const turnRate = (rightSpeed - leftSpeed) / 2;
        
        // Update rotation
        this.rotation += turnRate * 0.0001;
        this.robot.rotation.y = this.rotation;
        
        // Update position
        const moveSpeed = averageSpeed * 0.0005;
        this.robot.position.x += Math.sin(this.rotation) * moveSpeed;
        this.robot.position.z += Math.cos(this.rotation) * moveSpeed;
        
        // Keep robot on ground
        this.robot.position.y = 0;
        
        // Update camera to follow robot
        const cameraDistance = 8;
        const cameraHeight = 6;
        const cameraAngle = this.rotation + Math.PI / 4;
        
        this.camera.position.x = this.robot.position.x + Math.sin(cameraAngle) * cameraDistance;
        this.camera.position.y = cameraHeight;
        this.camera.position.z = this.robot.position.z + Math.cos(cameraAngle) * cameraDistance;
        this.camera.lookAt(this.robot.position);
    }
    
    updateMotor(port, speed) {
        this.motors[port] = speed;
    }
    
    getDistance() {
        // Simulated distance sensor
        // Returns distance to nearest "wall" (edge of ground)
        const distanceToEdge = 10 - Math.abs(this.robot.position.x);
        return Math.max(100, Math.min(2000, distanceToEdge * 100));
    }
    
    reset() {
        if (this.robot) {
            this.robot.position.set(0, 0, 0);
            this.robot.rotation.set(0, 0, 0);
            this.rotation = 0;
        }
        this.motors = { A: 0, B: 0, C: 0, D: 0 };
    }
    
    onResize() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
            const container = document.getElementById(this.containerId);
            if (container && this.renderer.domElement) {
                container.removeChild(this.renderer.domElement);
            }
        }
    }
}

// Create and manage robot simulators
let lessonSimulator = null;
let playgroundSimulator = null;

export function createLessonSimulator() {
    if (lessonSimulator) {
        lessonSimulator.destroy();
    }
    lessonSimulator = new RobotSimulator('robot-canvas');
    return lessonSimulator;
}

export function createPlaygroundSimulator() {
    if (playgroundSimulator) {
        playgroundSimulator.destroy();
    }
    playgroundSimulator = new RobotSimulator('playground-canvas');
    return playgroundSimulator;
}

export function getLessonSimulator() {
    return lessonSimulator;
}

export function getPlaygroundSimulator() {
    return playgroundSimulator;
}

export function resetLessonSimulator() {
    if (lessonSimulator) {
        lessonSimulator.reset();
    }
}

export function resetPlaygroundSimulator() {
    if (playgroundSimulator) {
        playgroundSimulator.reset();
    }
}