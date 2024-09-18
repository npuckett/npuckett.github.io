let tiles = [];
const GRID_SIZE = 10;
let tileWidth, tileHeight;
let canvasWidth, canvasHeight;

// Adjustable parameters
let gapSize = 2;
let triangleGap = 1;
let tileColor;

// Sliders and their values
let baseSpeedSlider, randomnessSlider, recalcSlider;
let baseSpeed, randomness, recalcInterval;
let lastRecalcTime = 0;
let showSliders = true;

class WangTile {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.triangles = [false, false, false, false]; // left, top, right, bottom
    this.nextChangeTime = 0;
  }

  display() {
    push();
    translate(this.x, this.y);

    // Draw tile background
    
    fill(247, 166, 235);
    rect(0, 0, this.w, this.h);

    // Draw triangles
    fill(tileColor);
    noStroke();

    if (this.triangles[0]) triangle(gapSize, gapSize + triangleGap, this.w/2, this.h/2, gapSize, this.h - gapSize - triangleGap);
    if (this.triangles[1]) triangle(gapSize + triangleGap, gapSize, this.w - gapSize - triangleGap, gapSize, this.w/2, this.h/2);
    if (this.triangles[2]) triangle(this.w - gapSize, gapSize + triangleGap, this.w - gapSize, this.h - gapSize - triangleGap, this.w/2, this.h/2);
    if (this.triangles[3]) triangle(gapSize + triangleGap, this.h - gapSize, this.w - gapSize - triangleGap, this.h - gapSize, this.w/2, this.h/2);

    pop();
  }

  update(currentTime) {
    if (currentTime >= this.nextChangeTime) {
      for (let i = 0; i < 4; i++) {
        if (random() < 0.5) {
          this.triangles[i] = !this.triangles[i];
        }
      }
      this.nextChangeTime = currentTime + baseSpeed + random(-randomness, randomness);
    }
  }
}

function setup() {
  // Set canvas size based on screen height
  canvasHeight = windowHeight - 400; // Subtract 100 to leave some space for sliders
  canvasWidth = (canvasHeight / GRID_SIZE) * (GRID_SIZE * 115 / 184);
  createCanvas(canvasWidth, canvasHeight);
  
  tileColor = color(245, 66, 218);

  // Calculate tile size based on canvas size, grid, and aspect ratio
  tileHeight = canvasHeight / GRID_SIZE;
  tileWidth = tileHeight * (115 / 184); // Maintain 184:115 aspect ratio

  // Create tiles
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      tiles.push(new WangTile(x * tileWidth, y * tileHeight, tileWidth, tileHeight));
    }
  }

  // Create sliders
  baseSpeedSlider = createSlider(100, 5000, 1000, 100);
  randomnessSlider = createSlider(0, 2000, 500, 100);
  recalcSlider = createSlider(1000, 10000, 5000, 1000);
  
  positionSliders();
}

function draw() {
  background(0);

  // Update slider values
  baseSpeed = baseSpeedSlider.value();
  randomness = randomnessSlider.value();
  recalcInterval = recalcSlider.value();

  let currentTime = millis();

  // Recalculate randomness if interval has passed
  if (currentTime - lastRecalcTime > recalcInterval) {
    for (let tile of tiles) {
      tile.nextChangeTime = currentTime + random(baseSpeed);
    }
    lastRecalcTime = currentTime;
  }

  // Update and display tiles
  for (let tile of tiles) {
    tile.update(currentTime);
    tile.display();
  }

  // Display slider values if shown
  if (showSliders) {
    fill(0);
    text(`Base Speed: ${baseSpeed}ms`, 10, height - 60);
    text(`Randomness: ±${randomness}ms`, 10, height - 40);
    text(`Recalc Interval: ${recalcInterval}ms`, 10, height - 20);
  }
}

function keyPressed() {
  if (key === ' ') {
    showSliders = !showSliders;
    baseSpeedSlider.style('display', showSliders ? 'block' : 'none');
    randomnessSlider.style('display', showSliders ? 'block' : 'none');
    recalcSlider.style('display', showSliders ? 'block' : 'none');
  }
}

function positionSliders() {
  baseSpeedSlider.position(10, height + 10);
  randomnessSlider.position(10, height + 40);
  recalcSlider.position(10, height + 70);
}

function windowResized() {
  canvasHeight = windowHeight - 100;
  canvasWidth = (canvasHeight / GRID_SIZE) * (GRID_SIZE * 115 / 184);
  resizeCanvas(canvasWidth, canvasHeight);
  
  tileHeight = canvasHeight / GRID_SIZE;
  tileWidth = tileHeight * (115 / 184);
  
  // Reposition tiles
  tiles = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      tiles.push(new WangTile(x * tileWidth, y * tileHeight, tileWidth, tileHeight));
    }
  }
  
  positionSliders();
}

// Functions to allow dynamic changes
function setGapSize(size) {
  gapSize = size;
}

function setTriangleGap(size) {
  triangleGap = size;
}

function setTileColor(r, g, b) {
  tileColor = color(r, g, b);
}
