class Player {
  constructor(){
    this.index = null;
    this.yPos = 0;
    this.xPos = 0;
    this.name = null;
    this.points = 0;
    this.visible = true;
    this.rotation = 0;
    this.bulletx = -1000; // -1000,-1000 is bullets position of rest
    this.bullety = -1000;
  }

  getCount(){
    var playerCountRef = database.ref('playerCount');
    playerCountRef.on("value",(data)=>{
      playerCount = data.val();
    })
  }

  updateCount(count){
    database.ref('/').update({
      playerCount: count
    });
  }

  static updateHitPlayer(index) {
    var playerIndex = "players/player" + index;
    console.log("player hit ==" + playerIndex);
    
    database.ref(playerIndex).update({
      yPos:-500,
      xPos:-500,
      visible: false
    });
  }

  updateRotation(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      rotation: this.rotation
    });
  }
  
  update(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).set({
      name:this.name,
      xPos: this.xPos,
      yPos:this.yPos,
      visible: this.visible,
      rotation: this.rotation,
      points: this.points,
      bulletx: this.bulletx,
      bullety: this.bullety
    });
  }
  getFinishedPlayers(){
    var finishedPlayersRef = database.ref('finishedPlayers');
    finishedPlayersRef.on("value",(data)=>{
        finishedPlayers = data.val();
    });
  }

  static updateFinishedPlayers(){
    database.ref('/').update({
        finishedPlayers: finishedPlayers + 1
    });
  }

  updateBulletPosition() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      bulletx:this.bulletx,
      bullety:this.bullety
    });
  }
  
  updateScore() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      points:this.points
    });
  }

  static getPlayerInfo(){ 
    var playerInfoRef = database.ref('players');
    playerInfoRef.on("value",(data)=>{
      allPlayers = data.val();
    })
  }
}
