/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var jumpSound;
var enemies;

function preload() {
  soundFormats("mp3", "wav");

  //load your sounds here
  jumpSound = loadSound("assets/jump.wav");
  jumpSound.setVolume(0.1);
}

function setup() {
  createCanvas(1024, 576);
  floorPos_y = (height * 3) / 4;
  lives = 3;
  startGame();
}

function draw() {
  background(100, 155, 255); // fill the sky blue

  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height / 4); // draw some green ground
  push();
  translate(scrollPos, 0);

  if (lives < 1) {
    text("Game over. Press space to continue", width / 2, height / 2);
    return;
  }
  if (flagpole.isReached) {
    text("Level complete. Press space to continue.", width / 2, height / 2);
    return;
  }

  // Draw clouds.
  drawClouds();

  // Draw mountains.
  drawMountains();

  // Draw trees.
  drawTrees();

  // Draw canyons.
  for (var i = 0; i < 3; i++) {
    var canyon = new Canyon(55, i);
    drawCanyon(canyon);
    checkCanyon(canyon);
    if (isPlummeting && gameChar_y >= height) {
      checkPlayerDie();
    }
  }
  // Draw collectable items.
  for (var i = 0; i < collectables.length; i++) {
    if (!collectables[i].isFound) {
      drawCollectable(collectables[i]);
      checkCollectable(collectables[i]);
    }
  }

  renderFlagpole(flagpole);
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].draw();
    var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
    if (isContact) {
      if (lives > 0) {
        startGame();
        lives -= 1;
        break;
      }
    }
  }

  pop();

  // Draw game character.
  drawGameChar();

  // Draw game_score
  textSize(32);
  fill(0);
  text("Game score: " + str(game_score), 50, 50);

  // Draw lives amount
  textSize(32);
  fill(0);
  text("Lives: " + str(lives), 350, 50);

  // Logic to make the game character move or the background scroll.
  if (isLeft) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5;
    } else {
      scrollPos += 5;
    }
  }

  if (isRight) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5;
    } else {
      scrollPos -= 5; // negative for moving against the background
    }
  }

  // Logic to make the game character rise and fall.
  ///////////INTERACTION CODE//////////
  if (gameChar_y < floorPos_y) {
    gameChar_y += 2;
    isFalling = true;
  } else {
    isFalling = false;
  }

  checkFlagpole(flagpole);
  // Update real position of gameChar for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed() {
  // if statements to control the animation of the character when
  // keys are pressed.
  if (keyCode == 37) {
    // moving left
    isLeft = true;
  } else if (keyCode == 39) {
    // moving right
    isRight = true;
  } else if (
    (keyCode == 32 && lives == 0) ||
    (keyCode == 32 && flagpole.isReached)
  ) {
    checkPlayerDie();
  } else if (keyCode == 32 && gameChar_y >= floorPos_y) {
    // jumping facing forward
    gameChar_y -= 100;
    jumpSound.play();
  }
}

function keyReleased() {
  // if statements to control the animation of the character when
  // keys are released.
  if (keyCode == 37) {
    isLeft = false;
  } else if (keyCode == 39) {
    isRight = false;
  } else if (keyCode == 32) {
    isPlummeting = false;
  }
}

function startGame() {
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  // Variable to control the background scrolling.
  scrollPos = 0;

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos;

  // Boolean variables to control the movement of the game character.
  isLeft = false;
  isRight = false;
  isFalling = false;
  isPlummeting = false;
  game_score = 0;

  // Initialise arrays of scenery objects.
  flagpole = {
    x_pos: 1100,
    isReached: false,
  };

  collectables = [
    {
      x_pos: 240,
      y_pos: floorPos_y - 10,
      size: 30,
      isFound: false,
    },
    {
      x_pos: 400,
      y_pos: floorPos_y - 10,
      size: 30,
      isFound: false,
    },
    {
      x_pos: 650,
      y_pos: floorPos_y - 10,
      size: 30,
      isFound: false,
    },
    {
      x_pos: 800,
      y_pos: floorPos_y - 10,
      size: 30,
      isFound: false,
    },
  ];

  // Add enemies
  enemies = [];
  enemies.push(new Enemy(150, floorPos_y - 10, 100));
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
  // draw game character
  if (isLeft && isFalling) {
    // add your jumping-left code
    fill(52, 189, 235);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(245, 226, 105);
    ellipse(gameChar_x, gameChar_y - 55, 15, 35);
    // legs
    triangle(
      gameChar_x - 3,
      gameChar_y - 10,
      gameChar_x,
      gameChar_y,
      gameChar_x + 10,
      gameChar_y
    );
    // arms
    rect(gameChar_x - 20, gameChar_y - 32, 22, 8);
    rect(gameChar_x - 20, gameChar_y - 42, 22, 8);
    //    eyes
    fill(0, 0, 0);
    ellipse(gameChar_x, gameChar_y - 60, 10, 10);
  } else if (isRight && isFalling) {
    // add your jumping-right
    fill(52, 189, 235);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(245, 226, 105);
    ellipse(gameChar_x, gameChar_y - 55, 15, 35);
    // legs
    triangle(
      gameChar_x + 3,
      gameChar_y - 10,
      gameChar_x,
      gameChar_y,
      gameChar_x - 10,
      gameChar_y
    );
    // arms
    rect(gameChar_x, gameChar_y - 32, 22, 8);
    rect(gameChar_x, gameChar_y - 42, 22, 8);
    //    eyes
    fill(0, 0, 0);
    ellipse(gameChar_x, gameChar_y - 60, 10, 10);
  } else if (isLeft) {
    // add your walking left code
    fill(52, 189, 235);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(245, 226, 105);
    ellipse(gameChar_x, gameChar_y - 55, 15, 35);
    // legs
    rect(gameChar_x - 3, gameChar_y - 7, 8, 10);
    // arms
    rect(gameChar_x - 20, gameChar_y - 32, 22, 8);
    rect(gameChar_x - 20, gameChar_y - 42, 22, 8);
    //    eyes
    fill(0, 0, 0);
    ellipse(gameChar_x, gameChar_y - 60, 10, 10);
  } else if (isRight) {
    // add your walking right code
    fill(52, 189, 235);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(245, 226, 105);
    ellipse(gameChar_x, gameChar_y - 55, 15, 35);
    // legs
    rect(gameChar_x - 5, gameChar_y - 7, 8, 10);
    // arms
    rect(gameChar_x, gameChar_y - 32, 22, 8);
    rect(gameChar_x, gameChar_y - 42, 22, 8);
    //    eyes
    fill(0, 0, 0);
    ellipse(gameChar_x, gameChar_y - 60, 10, 10);
  } else if (isFalling || isPlummeting) {
    // add your jumping facing forwards code
    fill(52, 189, 235);
    rect(gameChar_x - 10, gameChar_y - 42, 20, 35);
    //    head, hands, legs
    fill(245, 226, 105);
    ellipse(gameChar_x, gameChar_y - 55, 25, 35);
    // legs
    rect(gameChar_x + 2, gameChar_y - 7, 8, 10);
    rect(gameChar_x - 10, gameChar_y - 7, 8, 10);
    // arms
    rect(gameChar_x + 5, gameChar_y - 42, 20, 8);
    rect(gameChar_x - 25, gameChar_y - 42, 20, 8);
    //    eyes
    fill(0, 0, 0);
    ellipse(gameChar_x - 5, gameChar_y - 60, 10, 10);
    ellipse(gameChar_x + 5, gameChar_y - 60, 10, 10);
  } else {
    // add your standing front facing code
    fill(52, 189, 235);
    rect(gameChar_x - 10, gameChar_y - 42, 20, 35);
    //    head, hands, legs
    fill(245, 226, 105);
    ellipse(gameChar_x, gameChar_y - 55, 25, 35);
    // legs
    rect(gameChar_x + 2, gameChar_y - 7, 8, 10);
    rect(gameChar_x - 10, gameChar_y - 7, 8, 10);
    // arms
    rect(gameChar_x + 8, gameChar_y - 42, 8, 22);
    rect(gameChar_x - 17, gameChar_y - 42, 8, 22);
    //    eyes
    fill(0, 0, 0);
    ellipse(gameChar_x - 5, gameChar_y - 60, 10, 10);
    ellipse(gameChar_x + 5, gameChar_y - 60, 10, 10);
  }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds() {
  for (var i = 0; i < 5; i++) {
    fill(255, 255, 255);
    var cloud = new Cloud(120 + i * 250, 100 + i * 30);
    ellipse(cloud.x_pos, cloud.y_pos, 80, 60);
    ellipse(cloud.x_pos + 40, cloud.y_pos, 80, 50);
    ellipse(cloud.x_pos - 40, cloud.y_pos, 80, 50);
  }
}

// Function to draw mountains objects.
function drawMountains() {
  for (var i = 0; i < 5; i++) {
    // add mountain
    fill(150, 150, 150);
    var mountain = new Mountain(100);
    triangle(
      mountain.x1_pos * i,
      mountain.y1_pos,
      mountain.x2_pos * i,
      mountain.y2_pos,
      mountain.x3_pos * i,
      mountain.y3_pos
    );
    triangle(
      (mountain.x1_pos + 100) * i,
      mountain.y1_pos,
      (mountain.x2_pos + 80) * i,
      mountain.y2_pos + 100,
      mountain.x3_pos * i,
      mountain.y3_pos
    );
    // add snow at the top of mountain
    fill(255, 255, 255);
    triangle(
      (mountain.x1_pos + 43) * i,
      mountain.y1_pos - 200,
      mountain.x2_pos * i,
      mountain.y2_pos,
      (mountain.x3_pos - 85) * i,
      mountain.y3_pos - 200
    );
    triangle(
      (mountain.x1_pos + 125) * i,
      mountain.y1_pos - 102,
      (mountain.x2_pos + 80) * i,
      mountain.y2_pos + 100,
      (mountain.x3_pos - 15) * i,
      mountain.y3_pos - 102
    );
  }
}

// Function to draw trees objects.
function drawTrees() {
  for (var i = 0; i < 5; i++) {
    // add trunk
    fill(205, 133, 63);
    var tree = new Tree(-500 + i * i * 70);
    rect(tree.x_pos, tree.y_pos - 10, 30, 100);

    // add branches
    fill(0, 155, 0);
    for (var j = 0; j < 3; j++) {
      triangle(
        tree.x_pos - 40,
        tree.y_pos - 40 * j,
        tree.x_pos + 15,
        tree.y_pos - 52 - 50 * j,
        tree.x_pos + 70,
        tree.y_pos - 40 * j
      );
    }
  }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(canyon) {
  fill(0);
  rect(canyon.x_pos, canyon.y_pos, canyon.width, 145, 2);
}

// Function to check character is over a canyon.

function checkCanyon(canyon) {
  if (
    canyon.x_pos <= gameChar_world_x &&
    gameChar_world_x <= canyon.x_pos + canyon.width &&
    gameChar_y >= canyon.y_pos
  ) {
    isPlummeting = true;
    gameChar_y += 5;
  } else {
    isPlummeting = false;
  }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
  stroke(150, 150, 150);
  fill(245, 226, 105);
  ellipse(
    t_collectable.x_pos,
    t_collectable.y_pos,
    t_collectable.size,
    t_collectable.size
  );

  ellipse(
    t_collectable.x_pos - 10,
    t_collectable.y_pos,
    t_collectable.size,
    t_collectable.size
  );
  text("$", t_collectable.x_pos - 20, t_collectable.y_pos + 10);
  text("$", t_collectable.x_pos - 20, t_collectable.y_pos + 10);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
  if (
    dist(
      gameChar_world_x,
      gameChar_y,
      t_collectable.x_pos,
      t_collectable.y_pos
    ) < 20
  ) {
    t_collectable.isFound = true;
    game_score += 1;
  }
}

function renderFlagpole(flagpole) {
  stroke(255);
  strokeWeight(3);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
  fill(252, 186, 3);
  if (flagpole.isReached) {
    rect(flagpole.x_pos, floorPos_y - 200, 60, 40);
  } else {
    rect(flagpole.x_pos, floorPos_y - 40, 60, 40);
  }
}

function checkFlagpole(flagpole) {
  if (abs(gameChar_world_x - flagpole.x_pos) < 15) {
    flagpole.isReached = true;
  }
}

function checkPlayerDie() {
  if (lives == 0) {
    lives = 3;
    startGame();
  } else {
    lives -= 1;
    startGame();
  }
}

function Tree(x_pos) {
  this.x_pos = width / 2 + x_pos;
  this.y_pos = -90 + floorPos_y;
}

function Mountain(x1_pos) {
  this.x1_pos = x1_pos;
  this.y1_pos = floorPos_y;
  this.x2_pos = x1_pos + 50;
  this.y2_pos = floorPos_y - 232;
  this.x3_pos = x1_pos + 150;
  this.y3_pos = floorPos_y;
}

function Cloud(x_pos, y_pos) {
  this.x_pos = x_pos;
  this.y_pos = y_pos;
}

function Canyon(x_pos, i) {
  this.x_pos = x_pos + 200 * i * i;
  this.y_pos = 432;
  this.width = 100;
}

function Enemy(x, y, range) {
  this.x = x;
  this.y = y;
  this.range = range;
  this.currentX = x;
  this.inc = 1;
  this.update = function () {
    this.currentX += this.inc;
    if (this.currentX >= this.x + this.range) {
      this.inc = -1;
    } else if (this.currentX < this.x) {
      this.inc = 1;
    }
  };
  this.draw = function () {
    this.update();
    fill(255, 0, 0);
    ellipse(this.currentX, this.y, 20, 20);
  };
  this.checkContact = function (gc_x, gc_y) {
    var d = dist(gc_x, gc_y, this.currentX, this.y);
    if (d < 20) {
      return true;
    }
    return false;
  };
}
