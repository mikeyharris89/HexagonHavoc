var Platform = require("./platform.js");

var Game = function () {
  this.platforms = [];
  this.players = [];
  this.flag = [];
  this.movingOut = true;
  this.homePlatforms = [];
  this.addPlatforms();
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
  } else if (object.type === "Player") {
    this.players.push(object);
  } else if (object.type === "Flag"){
    this.flag.push(object);
  }
};

var offBoard = function(object) {
  if ((object.pos[0] < -150) || (object.pos[0] > 1150)){
    return true;
  } else if ((object.pos[1] < -150) || (object.pos[1] > 1150)){
    return true;
  }

  return false;
};

var backHome = function(object) {
  if (object.color === "#FF0000" && object.pos[0] === 500) {
  // console.log("position: " + object.pos);
  // console.log("start pos: " + object.startPos);
}
  if ((object.pos[0] === object.startPos[0]) && (object.pos[1] === object.startPos[1])){
    this.homePlatforms.push(object);
  }
};

Game.prototype.allOff = function () {
  if (this.platforms.every(offBoard)){
    this.movingOut = false;
    return true;
  } else {
    return false;
  }
};

Game.prototype.allBack = function () {

  if (this.homePlatforms.length === this.platforms.length){
    debugger
    this.homePlatforms =[];
    this.movingOut = true;
    return true;
  }
  return false;
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
  return [].concat(this.platforms);
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
  var game = this;
  this.platforms.forEach(function(platform) {
    if (direction === -1) {
      backHome(platform);
    }
    if (game.homePlatforms.includes(platform)){
      return;
    }
    platform.move(delta, "blue", direction);
  });
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
