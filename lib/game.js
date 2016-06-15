var Platform = require("./platform.js");

var Game = function () {
  this.platforms = [];
  this.players = [];
  this.flag = [];

  this.addPlatforms();
};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_PLATFORMS = 7;
Game.COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#00CC00", "#FFFF00", "#7F00FF", "#00FFFF"];
Game.PLATFORM_POS = [[370, 113], [500, 113], [305, 225], [435, 225], [565, 225], [370, 337], [500, 337]];
Game.PLATFORM_DIRS = [[-0.5, 0.5], [0.5, 0.5], [-1, 0], [0, -1], [0, 1], [-0.5, -0.5], [0.5, -0.5]];



Game.prototype.add = function (object) {
  if (object.type === "Platform") {
    this.platforms.push(object);
  } else if (object.type === "Player") {
    this.players.push(object);
  } else if (object.type === "Flag"){
    this.flag.push(object);
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
  return [].concat(this.platforms);
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
  this.allObjects().forEach(function(object) {
    object.draw(ctx);
  });

};
module.exports = Game;
