var Platform = require("./platform.js"),
    Flag = require('./flag.js'),
    Player = require('./player.js');

var Game = function () {
  this.platforms = [];
  this.players = {};
  this.flag = new Flag({ game: this, colors: Game.COLORS });
  this.movingOut = true;
  this.homePlatforms = [];
  this.addPlatforms();
  this.addPlayers(2);
  this.flagPlatform = this.platforms[3];
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
Game.COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];
Game.PLATFORM_POS = [[370, 113], [500, 113], [305, 225], [435, 225], [565, 225], [370, 337], [500, 337]];
Game.PLATFORM_DIRS = [[-4, -4], [4, -4], [-6, 0], [0, 6], [6, 0], [-4, 4], [4, 4]];



Game.prototype.add = function (object) {
  if (object.type === "Platform") {
    this.platforms.push(object);
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

Game.prototype.addPlayers = function (numPlayers) {
  var name = ["Hillary", "Trump", "Bernie", "Obama"],
      pos = [[500,300], [480,350], [520, 350], [480, 250]];
  for (var i = 0; i < numPlayers; i++) {
    this.players[name[i]] = new Player({ name: name[i], pos: pos[i], game: this});
  }
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

Game.prototype.backHome = function(object) {

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
    var game = this;
    this.flag.changeColor();
    this.platforms.forEach(function(platform) {
      if (platform.color === game.flag.color){
            game.flagPlatform = platform;
      }
    });
    this.homePlatforms =[];
    this.movingOut = true;
    this.paused = true;
    setTimeout(function() {
        this.removePlayers();
      this.paused = false;
    }.bind(this), 3000);
  }
};

Game.prototype.removePlayers = function() {
  var game = this;
  Object.keys(game.players).forEach(function(key) {
    if (!game.playerInBound(game.players[key])){
      delete game.players[key];
    }
  });
};

Game.prototype.playerInBound = function(player) {
  var pos = [player.xPos, player.yPos];
  return this.pointInHexagon(pos, this.flagPlatform.vertices);
};

Game.prototype.allObjects = function () {
  var players = [],
      game = this;

  Object.keys(game.players).forEach(function(key) {
    players.push(game.players[key]);
  });

  return [].concat(this.flag, this.platforms, players);
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
  return Object.keys(this.players).length < 1;
};

Game.prototype.moveObjects = function(delta, direction) {
  var game = this;
  if (game.paused) {
    Object.keys(game.players).forEach(function(key) {
      if (game.players[key].offPlatforms()){
        delete game.players[key];
      }
    });
  }
  else if (!game.paused) {

    game.removePlayers();
    game.platforms.forEach(function(platform) {
      if (platform.color === game.flag.color){

        game.flagPlatform = platform;
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
