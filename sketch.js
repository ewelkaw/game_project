/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/



var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
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
  for (var i = 0; i < canyons.length; i++) {
    drawCanyon(canyons[i]);
    checkCanyon(canyons[i]);
    if (isPlummeting && gameChar_y >= height) {
      console.log("isPlummeting", isPlummeting);
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

  //open up the console to see how these work
  console.log("keyPressed: " + key);
  console.log("keyPressed: " + keyCode);
  if (keyCode == 37) {
    // moving left
    isLeft = true;
  } else if (keyCode == 39) {
    // moving right
    isRight = true;
  } else if (keyCode == 32 && gameChar_y >= floorPos_y) {
    // jumping facing forward
    gameChar_y -= 100;
    jumpSound.play();
  }
}

function keyReleased() {
  // if statements to control the animation of the character when
  // keys are released.

  console.log("keyReleased: " + key);
  console.log("keyReleased: " + keyCode);
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
  trees = [
    { x_pos: width / 2 - 200, y_pos: -200 / 2 + floorPos_y + 10 },
    { x_pos: width / 2, y_pos: -200 / 2 + floorPos_y + 10 },
    { x_pos: width / 2 + 150, y_pos: -200 / 2 + floorPos_y + 10 },
    { x_pos: width / 2 + 350, y_pos: -200 / 2 + floorPos_y + 10 },
  ];
  clouds = [
    {
      x_pos: 150,
      y_pos: 140,
    },
    {
      x_pos: 350,
      y_pos: 160,
    },
    {
      x_pos: 650,
      y_pos: 120,
    },
    {
      x_pos: 800,
      y_pos: 150,
    },
  ];

  mountains = [
    {
      x1_pos: 100,
      y1_pos: floorPos_y,
      x2_pos: 150,
      y2_pos: floorPos_y - 232,
      x3_pos: 250,
      y3_pos: floorPos_y,
    },
    {
      x1_pos: 590,
      y1_pos: floorPos_y,
      x2_pos: 640,
      y2_pos: floorPos_y - 232,
      x3_pos: 740,
      y3_pos: floorPos_y,
    },
    {
      x1_pos: 870,
      y1_pos: floorPos_y,
      x2_pos: 920,
      y2_pos: floorPos_y - 232,
      x3_pos: 1020,
      y3_pos: floorPos_y,
    },
  ];

  collectables = [
    {
      x_pos: 170,
      y_pos: floorPos_y,
      size: 30,
      isFound: false,
    },
    {
      x_pos: 400,
      y_pos: floorPos_y,
      size: 30,
      isFound: false,
    },
    {
      x_pos: 650,
      y_pos: floorPos_y,
      size: 30,
      isFound: false,
    },
    {
      x_pos: 800,
      y_pos: floorPos_y,
      size: 30,
      isFound: false,
    },
  ];

  canyons = [
    {
      x_pos: 55,
      width: 100,
      y_pos: 432,
    },
    {
      x_pos: 275,
      width: 100,
      y_pos: 432,
    },
    {
      x_pos: 875,
      width: 100,
      y_pos: 432,
    },
  ];
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
  // draw game character
  if (isLeft && isFalling) {
    // add your jumping-left code
    fill(168, 84, 50);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(129, 168, 50);
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
    fill(168, 84, 50);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(129, 168, 50);
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
    fill(168, 84, 50);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(129, 168, 50);
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
    fill(168, 84, 50);
    rect(gameChar_x - 7, gameChar_y - 42, 15, 35);
    //    head, hands, legs
    fill(129, 168, 50);
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
    fill(168, 84, 50);
    rect(gameChar_x - 10, gameChar_y - 42, 20, 35);
    //    head, hands, legs
    fill(129, 168, 50);
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
    fill(168, 84, 50);
    rect(gameChar_x - 10, gameChar_y - 42, 20, 35);
    //    head, hands, legs
    fill(129, 168, 50);
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
  for (var i = 0; i < clouds.length; i++) {
    fill(255, 255, 255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, 80, 60);
    ellipse(clouds[i].x_pos + 40, clouds[i].y_pos, 80, 50);
    ellipse(clouds[i].x_pos - 40, clouds[i].y_pos, 80, 50);
  }
}

// Function to draw mountains objects.
function drawMountains() {
  for (var i = 0; i < mountains.length; i++) {
    // add mountain
    fill(150, 150, 150);
    triangle(
      mountains[i].x1_pos,
      mountains[i].y1_pos,
      mountains[i].x2_pos,
      mountains[i].y2_pos,
      mountains[i].x3_pos,
      mountains[i].y3_pos
    );
    triangle(
      mountains[i].x1_pos + 100,
      mountains[i].y1_pos,
      mountains[i].x2_pos + 80,
      mountains[i].y2_pos + 100,
      mountains[i].x3_pos,
      mountains[i].y3_pos
    );
    // add snow at the top of mountain
    fill(255, 255, 255);
    triangle(
      mountains[i].x1_pos + 43,
      mountains[i].y1_pos - 200,
      mountains[i].x2_pos,
      mountains[i].y2_pos,
      mountains[i].x3_pos - 85,
      mountains[i].y3_pos - 200
    );
    triangle(
      mountains[i].x1_pos + 125,
      mountains[i].y1_pos - 102,
      mountains[i].x2_pos + 80,
      mountains[i].y2_pos + 100,
      mountains[i].x3_pos - 15,
      mountains[i].y3_pos - 102
    );
  }
}

// Function to draw trees objects.
function drawTrees() {
  for (var i = 0; i < trees.length; i++) {
    // add trunk
    fill(205, 133, 63);
    rect(trees[i].x_pos, trees[i].y_pos - 10, 30, 100);

    // add branches
    fill(0, 155, 0);
    triangle(
      trees[i].x_pos - 40,
      trees[i].y_pos,
      trees[i].x_pos + 15,
      trees[i].y_pos - 52,
      trees[i].x_pos + 70,
      trees[i].y_pos
    );
    triangle(
      trees[i].x_pos - 40,
      trees[i].y_pos - 40,
      trees[i].x_pos + 15,
      trees[i].y_pos - 102,
      trees[i].x_pos + 70,
      trees[i].y_pos - 40
    );
    triangle(
      trees[i].x_pos - 40,
      trees[i].y_pos - 80,
      trees[i].x_pos + 15,
      trees[i].y_pos - 152,
      trees[i].x_pos + 70,
      trees[i].y_pos - 80
    );
  }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon) {
  stroke(0);
  fill(71, 63, 63);
  rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, 145, 2);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
  if (
    t_canyon.x_pos <= gameChar_world_x &&
    gameChar_world_x <= t_canyon.x_pos + t_canyon.width &&
    gameChar_y >= t_canyon.y_pos
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
  stroke(242, 129, 9);
  fill(242, 226, 9);
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
  strokeWeight(5);
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
  fill(180, 120, 140);
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
