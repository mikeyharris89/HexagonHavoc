var Platform = require("./platform.js"),
    Flag = require('./flag.js'),
    Player = require('./player.js');

var Game = function () {
  this.platforms = [];
  this.players = new Player({ game: this, name: "Mikey"});
  this.flag = new Flag({ game: this, colors: Game.COLORS });
  this.movingOut = true;
  this.homePlatforms = [];
  this.addPlatforms();
  this.paused = true;
  setTimeout(function() {
    this.paused = false;
  }.bind(this), 3000);
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_PLATFORMS = 7;
Game.COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#00CC00", "#FFFF00", "#7F00FF", "#00FFFF"];
Game.PLATFORM_POS = [[370, 113], [500, 113], [305, 225], [435, 225], [565, 225], [370, 337], [500, 337]];
Game.PLATFORM_DIRS = [[-4, -4], [4, -4], [-6, 0], [0, 6], [6, 0], [-4, 4], [4, 4]];



Game.prototype.add = function (object) {
  if (object.type === "Platform") {
    this.platforms.push(object);
  } else if (object.type === "Flag"){
    this.flag.push(object);
  }
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

Game.prototype.backHome = function(object) {
  if (this.homePlatforms.length > 5){
  }

  if ((equalPositions(object.pos, object.startPos)) && (this.homePlatforms.indexOf(object) === -1)){
    this.homePlatforms.push(object);
  }
};

var equalPositions = function(pos1, pos2) {
  return (pos1[0] === pos2[0]) && (pos1[1] === pos2[1]);
};

Game.prototype.allOff = function () {
  var game = this;
  if (game.platforms.every(game.offBoard, game)){
    game.movingOut = false;
  }
};


Game.prototype.allBack = function () {
  if (this.homePlatforms.length > 6){
  }
  if (this.homePlatforms.length === this.platforms.length){
    this.flag.changeColor();
    this.homePlatforms =[];
    this.movingOut = true;
    this.paused = true;
    setTimeout(function() {
      this.paused = false;
    }.bind(this), 3000);
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

Game.prototype.allObjects = function () {
  return [].concat(this.flag, this.platforms, this.players);
};

Game.prototype.handleKey = function (e) {
  debugger
};
Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.allObjects().forEach(function(object) {
    object.draw(ctx);
  });

};

Game.prototype.moveObjects = function(delta, direction) {
  this.pause = 0;
  var game = this;
  if (!this.paused) {
    this.platforms.forEach(function(platform) {
      if (platform.color === game.flag.color){
        game.backHome(platform);
        return;
      }
      if (direction === -1) {
        game.backHome(platform);
      }
      if (game.homePlatforms.includes(platform)){
        return;
      }
      platform.move(delta, "blue", direction);
    });
  }
};


Game.prototype.step = function (delta) {
  if (this.movingOut){
    this.moveObjects(delta, 1);
    this.allOff();
  }

  else {
    this.moveObjects(delta, -1);
    this.allBack();
  }
};

module.exports = Game;
