var canvas, backgroundImage;

var gameState = 0,finishedPlayers;
var playerCount;
var allPlayers;
var distance = 0;
var database;
var passedFinish;
var obstacles;
var shootDir = null;
var s,i;
var form, player, game;
var initPos = [[0,0], [100,100], [100,650], [1000,100],[1000,650]];

var chars, charL1, charL2, charR1, charR2;
var ground, charL1_img, charL2_img, charR1_img, charR2_img;

var bullets, bullet1, bullet2, bullet3, bullet4;
var bulletsRemaining = [5,5,5,5];

function preload(){
  charL1_img = loadImage("images/left1.gif");
  charL2_img = loadImage("images/left2.png");
  charR1_img = loadImage("images/right1.png");
  charR2_img = loadImage("images/right2.png");
  ground = loadImage("images/ground.png");
 // bulletImg = loadImage("images/bullet.png");
  bulletImg = loadImage("images/fire.png");
}

function setup(){
  canvas = createCanvas(displayWidth , displayHeight);
  database = firebase.database();
  gameState = 0;
  distance = 0;
  finishedPlayers = 0;
  yVel = 0;
  xVel = 0;

  xSet = false;

  game = new Game();
  game.getState();
  game.start();
    
}

function draw(){
   background("pink");
 
  //start the game now that we have 4 players
  if (playerCount === 4) {
    game.update(1);
  }

  //start the game for real
  if (gameState === 1) {
    game.play();
    for (var i = 0; i < chars.length; i++) {
        if (i !== player.index-1)
          bullets[player.index-1].collide(chars[i], destroyChar);

        if (chars[i].visible===false) 
          Player.updateHitPlayer(i+1);  
    }
  }

  //end the game
  if (finishedPlayers === 3) {
    game.update(2);
  }

  //display ranking
  if (gameState === 2 && finishedPlayers === 3) {
    game.displayRanks();
  }
}

function keyPressed() {
  if (bulletsRemaining[player.index-1]>0 && gameState==1) {
    console.log(keyCode, shootDir)
    if (keyCode === 65) shootDir = "L";
    if (keyCode === 68) shootDir = "R";
    if (keyCode === 83) shootDir = "D";
    if (keyCode === 87) shootDir = "U";
  }
}

function destroyChar(bullet,char) {
  console.log("char got attacked!", char.x, char.y, bullet.x, bullet.y)
  // frameDelay=10;
  player.points +=50;
  char.visible = false;
  //bullet.destroy();
  player.updateScore();
  player.bulletx = -1000; player.bullety = -1000;
  shootDir = null; 
  player.updateBulletPosition();
  bullets[player.index-1].visible = false;
  bullet.x = -1000; bullet.y = -1000;
  Player.updateFinishedPlayers();
}