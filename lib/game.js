var Platform = require("./platform.js"),
    Flag = require('./flag.js'),
    Player = require('./player.js');

var Game = function (numPlayers) {
  this.players = [];
  this.platforms = [];
  this.flag = new Flag({ game: this, colors: Game.COLORS });
  this.movingOut = true;
  this.homePlatforms = [];
  this.addPlatforms();
  this.flagPlatform = this.platforms[3];
  this.paused = true;
  this.over = false;
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_PLATFORMS = 7;
Game.COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];
Game.PLATFORM_POS = [[301, 13], [500, 13], [201, 185], [400, 185], [599, 185], [301, 357], [500, 357]];
Game.PLATFORM_DIRS = [[-4, -4], [4, -4], [-6, 0], [0, 6], [6, 0], [-4, 4], [4, 4]];


var equalPositions = function(pos1, pos2) {
  return (pos1[0] === pos2[0]) && (pos1[1] === pos2[1]);
};

Game.prototype.updatePlayers = function(numPlayers){
  this.addPlayers(numPlayers);
  setTimeout(function() {
    this.paused = false;
  }.bind(this), 5000);
};

Game.prototype.add = function (object) {
  if (object.type === "Platform") {
    this.platforms.push(object);
  }
};

Game.prototype.addPlatforms = function () {
  for (var i = 0; i < Game.NUM_PLATFORMS; i++) {

    this.add(new Platform( {
      game: this,
      color: Game.COLORS[i],
      pos: Game.PLATFORM_POS[i],
      direction: Game.PLATFORM_DIRS[i]
    }));
  }
};

Game.prototype.addPlayers = function (numPlayers) {
  var name = ["Hillary", "Trump", "Bernie", "Obama"],
      pos = [[500,300], [480,350], [520, 350], [480, 250]],
      colors = ["#A9A9A9", "#FFFFFF", "#000000", "#A52A2A"],
      keyCodes = [[65, 87, 68, 83], [37, 38, 39, 40], [74, 73, 76, 75], [88, 70, 86, 67]];
  for (var i = 0; i < numPlayers; i++) {
    this.players.push(new Player({
      name: name[i],
      pos: pos[i],
      game: this,
      color: colors[i],
      keyCodes: keyCodes[i]}));
  }
};

Game.prototype.allObjects = function () {
  return [].concat(this.flag, this.platforms, this.players);
};

Game.prototype.pointInHexagon = function(point, vertices) {
  var x = point[0], y = point[1];

  var inside = false;
  for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    var xi = vertices[i][0], yi = vertices[i][1];
    var xj = vertices[j][0], yj = vertices[j][1];

    var intersect = ((yi > y) != (yj > y)) &&
    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};



Game.prototype.offBoard = function(object, index, array) {
  if (object.color === this.flag.color) {
    return true;
  } else if ((object.pos[0] < -150) || (object.pos[0] > 1150)){
    return true;
  } else if ((object.pos[1] < -150) || (object.pos[1] > 1150)){
    return true;
  }

  return false;
};

Game.prototype.allOff = function () {
  var game = this;
  if (game.platforms.every(game.offBoard, game)){
    game.movingOut = false;
  }
};

Game.prototype.backHome = function(object) {
  if ((equalPositions(object.pos, object.startPos)) && (this.homePlatforms.indexOf(object) === -1)){
    this.homePlatforms.push(object);
  }
};

Game.prototype.allBack = function () {

  if (this.homePlatforms.length === this.platforms.length){
    this.flag.changeColor();
    this.platforms.forEach(function(platform) {
      if (platform.color === this.flag.color){
        this.flagPlatform = platform;
      }
    }.bind(this));
    this.homePlatforms =[];
    this.movingOut = true;
    this.paused = true;
    setTimeout(function() {
      this.removePlayers();
      this.paused = false;
    }.bind(this), 2250);
  }
};

Game.prototype.removePlayers = function() {
  var players = [];

  this.players.forEach(function(player) {
    if (this.playerInBound(player)){
      players.push(player);
    }
  }.bind(this));
  this.players = players;
};

Game.prototype.playerInBound = function(player) {
  var pos = [player.xPos, player.yPos];
  return this.pointInHexagon(pos, this.flagPlatform.vertices);
};

Game.prototype.draw = function (ctx) {

  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  if (!this.gameOver()) {
    this.allObjects().forEach(function(object) {
      object.draw(ctx);
    });
  }
};

Game.prototype.gameOver = function () {
  if (this.players.length <= 1){
    this.over = true;
  }
  return this.over;
};

Game.prototype.moveObjects = function(delta, direction) {

  if (this.paused) {
    this.players.forEach(function(player, index) {
      if (player.offPlatforms()){
        this.players.splice(index, 1);
      }
    }.bind(this));
  }
  else if (!this.paused) {

    this.removePlayers();
    this.platforms.forEach(function(platform) {
      if (platform.color === this.flag.color){

        this.flagPlatform = platform;
        this.backHome(platform);
        return;
      }
      if (direction === -2) {
        this.backHome(platform);
      }

      if (this.homePlatforms.includes(platform)){
        return;
      }

      platform.move(delta, "blue", direction);
    }.bind(this));
  }
};


Game.prototype.step = function (delta) {
  if (!this.gameOver()) {

    this.players.forEach(function(player, index) {
      if (index === this.players.length - 1) {return;}
      for (var i = index + 1; i < this.players.length; i++) {
        if (player.colliding(this.players[i])){
          player.handleCollision(this.players[i]);
        }
      }
    }.bind(this));

    if (this.movingOut){
      this.moveObjects(delta, 2);
      this.allOff();
    }

    else {
      this.moveObjects(delta, -2);
      this.allBack();
    }
  }
};

module.exports = Game;
