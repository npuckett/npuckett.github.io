let tiles = [];
const GRID_SIZE = 10;
let tileWidth, tileHeight;
let canvasWidth, canvasHeight;

// Adjustable parameters
let outerGapSize = 2;
let innerGapSize = 1;
let tileColor, backgroundColor;

// Sliders and their values
let baseSpeedSlider, randomnessSlider, recalcSlider, outerGapSlider, innerGapSlider;
let baseSpeed, randomness, recalcInterval;
let lastRecalcTime = 0;
let showControls = true;

// Color pickers
let tileColorPicker, backgroundColorPicker;

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
    noStroke();
    // Draw tile background
    fill(backgroundColor);
    rect(0, 0, this.w, this.h);

    // Draw triangles
    fill(tileColor);
    

    let halfW = this.w / 2;
    let halfH = this.h / 2;

    if (this.triangles[0]) triangle(outerGapSize, outerGapSize, outerGapSize, this.h - outerGapSize, halfW - innerGapSize, halfH);
    if (this.triangles[1]) triangle(outerGapSize, outerGapSize, this.w - outerGapSize, outerGapSize, halfW, halfH - innerGapSize);
    if (this.triangles[2]) triangle(this.w - outerGapSize, outerGapSize, this.w - outerGapSize, this.h - outerGapSize, halfW + innerGapSize, halfH);
    if (this.triangles[3]) triangle(outerGapSize, this.h - outerGapSize, this.w - outerGapSize, this.h - outerGapSize, halfW, halfH + innerGapSize);

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
  canvasHeight = windowHeight - 150; // Subtract 150 to leave more space for controls
  canvasWidth = (canvasHeight / GRID_SIZE) * (GRID_SIZE * 115 / 184);
  createCanvas(canvasWidth, canvasHeight);
  
  // Load colors from localStorage or use defaults
  tileColor = color(localStorage.getItem('tileColor') || '#000000');
  backgroundColor = color(localStorage.getItem('backgroundColor') || '#FFFFFF');

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
  outerGapSlider = createSlider(0, 20, 2, 1);
  innerGapSlider = createSlider(0, 20, 1, 1);

  // Create color pickers
  tileColorPicker = createColorPicker(tileColor);
  backgroundColorPicker = createColorPicker(backgroundColor);
  
  // Add event listeners to color pickers
  tileColorPicker.input(() => {
    tileColor = tileColorPicker.color();
    localStorage.setItem('tileColor', tileColor.toString('#rrggbb'));
  });
  
  backgroundColorPicker.input(() => {
    backgroundColor = backgroundColorPicker.color();
    localStorage.setItem('backgroundColor', backgroundColor.toString('#rrggbb'));
  });
  
  createGUILabels();
  positionControls();
}

function draw() {
  background(220);

  // Update slider and color picker values
  baseSpeed = baseSpeedSlider.value();
  randomness = randomnessSlider.value();
  recalcInterval = recalcSlider.value();
  outerGapSize = outerGapSlider.value();
  innerGapSize = innerGapSlider.value();

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
}

function createGUILabels() {
  createElement('label', 'Base Speed').attribute('for', 'baseSpeedSlider');
  createElement('label', 'Randomness').attribute('for', 'randomnessSlider');
  createElement('label', 'Recalc Interval').attribute('for', 'recalcSlider');
  createElement('label', 'Outer Gap').attribute('for', 'outerGapSlider');
  createElement('label', 'Inner Gap').attribute('for', 'innerGapSlider');
  createElement('label', 'Tile Color').attribute('for', 'tileColorPicker');
  createElement('label', 'Background Color').attribute('for', 'backgroundColorPicker');
}

function positionControls() {
  let yOffset = height + 30;
  let labelOffset = -15;

  baseSpeedSlider.position(10, yOffset).id('baseSpeedSlider');
  randomnessSlider.position(10, yOffset + 40).id('randomnessSlider');
  recalcSlider.position(10, yOffset + 80).id('recalcSlider');
  outerGapSlider.position(250, yOffset).id('outerGapSlider');
  innerGapSlider.position(250, yOffset + 40).id('innerGapSlider');
  tileColorPicker.position(490, yOffset).id('tileColorPicker');
  backgroundColorPicker.position(490, yOffset + 40).id('backgroundColorPicker');

  // Position labels
  select('label[for="baseSpeedSlider"]').position(10, yOffset + labelOffset);
  select('label[for="randomnessSlider"]').position(10, yOffset + 40 + labelOffset);
  select('label[for="recalcSlider"]').position(10, yOffset + 80 + labelOffset);
  select('label[for="outerGapSlider"]').position(250, yOffset + labelOffset);
  select('label[for="innerGapSlider"]').position(250, yOffset + 40 + labelOffset);
  select('label[for="tileColorPicker"]').position(490, yOffset + labelOffset);
  select('label[for="backgroundColorPicker"]').position(490, yOffset + 40 + labelOffset);
}

function keyPressed() {
  if (key === ' ') {
    saveCanvas('wang_tiling', 'png');
  }
}

function windowResized() {
  canvasHeight = windowHeight - 150;
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
  
  positionControls();
}