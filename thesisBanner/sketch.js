const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

// Physics control variables
const INITIAL_GRAVITY = 0.09;    // Initial gentle gravity
const CLICK_GRAVITY = 0.25;      // Stronger gravity after click
const MIN_SPRING = 0.01;         // Minimum spring strength
const MAX_SPRING = 0.2;          // Maximum spring strength
const SPRING_DISTANCE = 25;      // How far apart points can be to connect
const PHYSICS_DRAG = 0.1;        // Air resistance essentially
const PARTICLE_SIZE = 4;         // Size of dots

let sliders = [];
let sliderLabels = [];
let showSliders = false;

function setupSliders() {
  sliders.push(createSlider(0, 1, INITIAL_GRAVITY, 0.01).position(10, 10).style('width', '180px'));
  sliderLabels.push(createP('Initial Gravity').position(10, 30));
  
  sliders.push(createSlider(0, 1, CLICK_GRAVITY, 0.01).position(210, 10).style('width', '180px'));
  sliderLabels.push(createP('Click Gravity').position(210, 30));
  
  sliders.push(createSlider(0, 1, MIN_SPRING, 0.01).position(410, 10).style('width', '180px'));
  sliderLabels.push(createP('Min Spring').position(410, 30));
  
  sliders.push(createSlider(0, 1, MAX_SPRING, 0.01).position(610, 10).style('width', '180px'));
  sliderLabels.push(createP('Max Spring').position(610, 30));
  
  sliders.push(createSlider(0, 100, SPRING_DISTANCE, 1).position(10, 70).style('width', '180px'));
  sliderLabels.push(createP('Spring Distance').position(10, 90));
  
  sliders.push(createSlider(0, 1, PHYSICS_DRAG, 0.01).position(210, 70).style('width', '180px'));
  sliderLabels.push(createP('Physics Drag').position(210, 90));
  
  sliders.push(createSlider(1, 10, PARTICLE_SIZE, 1).position(410, 70).style('width', '180px'));
  sliderLabels.push(createP('Particle Size').position(410, 90));
  
  for (let slider of sliders) {
    slider.hide();
  }
  
  for (let label of sliderLabels) {
    label.hide();
  }
}

function toggleSliders() {
  showSliders = !showSliders;
  for (let slider of sliders) {
    if (showSliders) {
      slider.show();
    } else {
      slider.hide();
    }
  }
  for (let label of sliderLabels) {
    if (showSliders) {
      label.show();
    } else {
      label.hide();
    }
  }
}

// Oscillation control
const OSCILLATION_SPEED = 0.02;  // How fast the springs oscillate

// Text variables
const FONT_SIZE = 120;
const TEXT_SAMPLE_FACTOR = 0.1;  // Density of points

let font;
let physics;
let particles = [];
let springs = [];
let textToShow = "DF THESIS";
let gravityBehavior;
let isStrongGravity = false;
let time = 0;  // For oscillation

function preload() {
  font = loadFont('assets/SpaceMono-Bold.ttf');
}

function setup() {
  createCanvas(800, 200);

  setupSliders();
  
  // Initialize physics with drag
  physics = new VerletPhysics2D();
  physics.setDrag(PHYSICS_DRAG);
  
  let bounds = new Rect(10, 10, width-10, height-20);
  physics.setWorldBounds(bounds);
  
  // Add initial gentle gravity
  gravityBehavior = new GravityBehavior(new Vec2D(0, INITIAL_GRAVITY));
  physics.addBehavior(gravityBehavior);

  // Set text properties
  textFont(font);
  textSize(FONT_SIZE);
  
  // Get text bounds for centering
  let bounds_text = font.textBounds(textToShow, 0, 0, FONT_SIZE);
  
  // Get points from text
  let points = font.textToPoints(textToShow, 
                               width/2 - bounds_text.w/2, 
                               height/2 + bounds_text.h/2, 
                               FONT_SIZE, {
    sampleFactor: TEXT_SAMPLE_FACTOR
  });
  
  // Create particles
  for (let pt of points) {
    particles.push(new Particle(pt.x, pt.y));
  }
  
  // Connect nearby points with springs
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < SPRING_DISTANCE) {
        // Start at the midpoint between min and max
        springs.push(new Spring(p1, p2, (MIN_SPRING + MAX_SPRING) / 2));
      }
    }
  }
}

function draw() {
  background(255);
  
  // Update spring strengths based on oscillation
  time += OSCILLATION_SPEED;
  
  // Map sine wave (-1 to 1) to spring strength range
  let springStrength = map(sin(time), -1, 1, MIN_SPRING, MAX_SPRING);
  
  // Update all springs
  for (let spring of springs) {
    spring.setStrength(springStrength);
  }
  
  physics.update();

  // Draw all springs first
  stroke(0, 100);
  strokeWeight(1);
  for (let spring of springs) {
    spring.show();
  }

  // Then draw all particles
  for (let particle of particles) {
    particle.show();
  }

  if (mouseIsPressed) {
    let closest = null;
    let minDist = 50;
    for (let particle of particles) {
      let d = dist(mouseX, mouseY, particle.x, particle.y);
      if (d < minDist) {
        closest = particle;
        minDist = d;
      }
    }
    if (closest) {
      closest.lock();
      closest.x = mouseX;
      closest.y = mouseY;
      closest.unlock();
    }
  }
}

function keyReleased() {
  if (key === ' ') {
    toggleSliders();
  }
  if (key === 'r' || key === 'R') {
    // Generate random gravity value between -CLICK_GRAVITY and CLICK_GRAVITY
    let randomGravity = random(-CLICK_GRAVITY, CLICK_GRAVITY);
    
    // Remove current gravity behavior
    physics.removeBehavior(gravityBehavior);
    
    // Create and add new gravity behavior with random value
    gravityBehavior = new GravityBehavior(new Vec2D(0, randomGravity));
    physics.addBehavior(gravityBehavior);
    
    // Always set to true since we want to allow multiple clicks
    isStrongGravity = true;
  }
}