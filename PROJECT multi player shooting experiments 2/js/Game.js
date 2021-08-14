class Game {
    constructor(){}
  
    getState(){
      var gameStateRef  = database.ref('gameState');
      gameStateRef.on("value",function(data){
          gameState = data.val();
      })
  
    }
  
    update(state){
      database.ref('/').update({
        gameState: state
      });
    }
  
    async start(){
      if(gameState === 0){
        player = new Player();
        var playerCountRef = await database.ref('playerCount').once("value");
        if(playerCountRef.exists()){
          playerCount = playerCountRef.val();
          player.getCount();
        }
        form = new Form()
        form.display();
      }
  
      charL1 = createSprite(10,10);
      charL1.addImage("charL1",charL1_img);
      charL2 = createSprite(10,displayHeight-10);
      charL2.addImage("charL2",charL2_img);
      charR1 = createSprite(displayWidth-10,10);
      charR1.addImage("charR1",charR1_img);
      charR2 = createSprite(displayWidth-10, displayHeight-10);
      charR2.addImage("charR2",charR2_img);
      charL1.scale = 0.5;
      charL2.scale = 0.5;
      charR1.scale = 0.2;
      charR2.scale = 0.5;
      
      chars = [charL1, charL2, charR1, charR2];

      // -1000,-1000 is bullets position at rest
      // -500,-500 is players position when hit
      bullet1 = createSprite(-1000,-1000,10,10);
      bullet1.addImage(bulletImg);
      bullet1.scale = 0.1;
      bullet1.visible = false;

      bullet2 = createSprite(-1000,-1000,10,10);
      bullet2.addImage(bulletImg);
      bullet2.scale = 0.1;
      bullet2.visible = false;

      bullet3 = createSprite(-1000,-1000,10,10);
      bullet3.addImage(bulletImg);
      bullet3.scale = 0.1;
      bullet3.visible = false;

      bullet4 = createSprite(-1000,-1000,10,10);
      bullet4.addImage(bulletImg);
      bullet4.scale = 0.1;
      bullet4.visible = false;

      bullets = [bullet1, bullet2, bullet3, bullet4];

    }
  
    play(){
      form.hide();

      Player.getPlayerInfo();
      player.getFinishedPlayers();

      if(allPlayers !== undefined){
        //image(ground, -1000,-1000,displayWidth, displayHeight);

        //index of the array, x and y position of the chars
        var index =0,x,y;
        
        for(var plr in allPlayers){
          index = index + 1 ;

          chars[index-1].x = allPlayers[plr].xPos;
          chars[index-1].y = allPlayers[plr].yPos;
          chars[index-1].visible = allPlayers[plr].visible;
          chars[index-1].rotation = allPlayers[plr].rotation;
          bullets[index-1].x = allPlayers[plr].bulletx;
          bullets[index-1].y = allPlayers[plr].bullety;
          bullets[index-1].rotation = chars[index-1].rotation;

          if (bullets[index-1].y !== -1000 || bullets[index-1].x !==-1000)
            bullets[index-1].visible = true;

          if (chars[index-1].visible) {
            textAlign(CENTER);
            textSize(20);
            fill("black");
            text(allPlayers[plr].name, chars[index - 1].x, chars[index - 1].y + 75);
            text("Score :"+ allPlayers[plr].points, chars[index - 1].x, chars[index - 1].y + 100)
            if (index === player.index){
              // camera.position.x = displayWidth/2;
              // camera.position.y = chars[index-1].y
              fill("red");
              ellipse(chars[index-1].x,chars[index-1].y,60,60)
              if (shootDir!==null) {
                  if (player.bulletx==-1000 && player.bullety==-1000) {
                    player.bulletx = player.xPos;
                    player.bullety = player.yPos;
                    bulletsRemaining[index]--;
                  }
                  this.shoot(shootDir);
                  if (player.bulletx > width || player.bulletx < 0 ||
                    player.bullety > height || player.bullety < 0){
                      shootDir= null;
                      player.bulletx = -1000;
                      player.bullety = -1000;
                      player.updateBulletPosition();
                  }
                      
              }
            }
          }
        }
            
      }

      if (player.index != null)
      {
        if (keyIsDown(RIGHT_ARROW) && player.xPos < width-15) {
            player.xPos += 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.xPos > 15 ) {
            player.xPos -= 10
            player.update();
        }
        if (keyIsDown(UP_ARROW) && player.yPos > 15) {
            player.yPos -= 10
            player.update();
        }
        if (keyIsDown(DOWN_ARROW) && player.yPos < height-15) {
            player.yPos += 10
            player.update();
        }
        if (keyDown("r")) {
          player.rotation +=90;
          player.updateRotation();
        }
        
      }
      //display sprites
      drawSprites();
      
    }
      
    shoot(dir) {
      var index = player.index-1;
      console.log("bullet started for " + player.index);
      console.log("dir n pos = ", dir, player.bulletx, player.bullety);
      
      if (dir=="L")       player.bulletx -=20;
      else  if (dir=="R") player.bulletx +=20;
      else  if (dir=="D") player.bullety +=10;
      else  if (dir=="U") player.bullety -=10;
    
      player.updateBulletPosition();
    }

    displayRanks(){
      imageMode(CENTER);
      Player.getPlayerInfo();
      //clear();
      textAlign(CENTER);
      textSize(50);
      var i = 0;
      for(var plr in allPlayers){
          if(allPlayers[plr].visible ){
              text("Congratulations! You Won " + allPlayers[plr].name, width/2, 100);
              chars[i].x = width/2;
              chars[i].y = height/2;
          }
          i++;
      }
      drawSprites();
    }
}
