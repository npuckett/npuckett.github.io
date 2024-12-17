let bleController;

//variables holding the values from the controllers
let player1Movement;
let player1Name;

let player2Movement;
let player2Name;

function setup() {
  createCanvas(400, 300);
  textSize(16);
  textAlign(CENTER, CENTER);
  
  // Create and setup BLE controller
  bleController = new BLEController();
  bleController.debug = true;  // Set to false to hide debug info
  bleController.setup();
}

function draw() {
  background(220);
  
  // Draw debug information if enabled
  bleController.drawDebug();
  
  //get current player names
  player1Name = bleController.player1Name;
  player2Name = bleController.player2Name;
  
  
  // Get movement values for game logic
  player1Movement = bleController.getPlayer1Movement();
  player2Movement = bleController.getPlayer2Movement();
  
  // Your game logic here using player1Movement and player2Movement
  // Values will be:
  // -1: Moving up
  //  0: Stopped
  //  1: Moving down
}