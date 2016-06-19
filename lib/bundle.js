/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1),
	    GameView = __webpack_require__(5);
	
	document.addEventListener("DOMContentLoaded", function() {
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	});
	
	window.addEventListener("keydown", keyDownListener, false);
	
	var keyDownListener = function(e) {
	  debugger
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Platform = __webpack_require__(2),
	    Flag = __webpack_require__(3),
	    Player = __webpack_require__(4);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Platform = function (options = {}) {
	
	  this.direction = options.direction;
	  this.color = options.color;
	  this.pos = options.pos;
	  this.startPos = options.pos;
	  this.angle = 0.523598776;
	  this.sideLength = 75;
	  this.height = Math.sin(this.angle) * this.sideLength;
	  this.radius = Math.cos(this.angle) * this.sideLength;
	  this.rectHeight = this.sideLength + 2 * this.height;
	  this.rectWidth = 2 * this.radius;
	  this.vertices = this.addVertices();
	
	};
	
	
	Platform.prototype.addVertices = function() {
	
	  var x = this.pos[0],
	  y = this.pos[1],
	
	  vertex1 = [x + this.radius, y],
	  vertex2 = [x + this.rectWidth, y + this.height],
	  vertex3 = [x + this.rectWidth, y + this.height + this.sideLength],
	  vertex4 = [x + this.radius, y + this.rectHeight],
	  vertex5 = [x, y + this.sideLength + this.height],
	  vertex6 = [x, y + this.height];
	  var vertices = [];
	  vertices.push(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6);
	  return vertices;
	};
	
	Platform.prototype.draw = function(ctx) {
	  this.vertices = this.addVertices();
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
	
	  this.vertices.slice(1).forEach(function(vertex){
	    ctx.lineTo(vertex[0], vertex[1]);
	  });
	
	  ctx.closePath();
	  ctx.fill();
	};
	
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	Platform.prototype.move = function(timeDelta, color, direction){
	  // var velocityScale = Math.floor(timeDelta / NORMAL_FRAME_TIME_DELTA),
	    var offsetX = (this.direction[0] * direction),
	        offsetY = (this.direction[1] * direction);
	
	  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	};
	
	
	
	Platform.prototype.type = "Platform";
	module.exports = Platform;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	var Flag = function (options = {} ) {
	  this.colors = options.colors;
	  this.color = this.colors[3];
	  this.game = options.game;
	};
	
	Flag.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.moveTo(900, 75);
	  ctx.lineTo(975, 75);
	  ctx.lineTo(975, 150);
	  ctx.lineTo(900, 150);
	  ctx.closePath();
	
	  ctx.fill();
	};
	
	
	Flag.prototype.randomColor = function (){
	  return this.colors[Math.floor(Math.random() * this.colors.length)];
	};
	
	Flag.prototype.changeColor = function () {
	  this.color = this.randomColor();
	};
	
	module.exports = Flag;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var Player = function (options = {}) {
	  this.game = options.game;
	  this.name = options.name;
	  this.xPos = options.pos[0];
	  this.yPos = options.pos[1];
	  this.velX = 0;
	  this.velY = 0;
	  this.speed = 10;
	  this.radius = 10;
	  this.friction = 0.75;
	  this.addKeyListener();
	};
	
	Player.prototype.draw = function (ctx) {
	  ctx.fillStyle = "#FFFFFF";
	  ctx.beginPath();
	  ctx.arc(
	    this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	};
	
	Player.prototype.offPlatforms = function () {
	  var player = this,
	      platforms = player.game.platforms,
	      pos = [player.xPos, player.yPos];
	
	  for (var i = 0; i < platforms.length; i++) {
	    if (player.game.pointInHexagon(pos, platforms[i].vertices)){
	      return false;
	    }
	  }
	  return true;
	};
	
	Player.prototype.addKeyListener = function () {
	  this.fn = this.move.bind(this);
	  window.addEventListener("keydown", this.fn, true);
	  window.addEventListener("keyup", this.fn, false);
	};
	
	Player.prototype.move = function (e) {
	
	  // e.preventDefault();
	  if (e.keyCode === 37){
	    if (this.velX > -this.speed){
	        this.velX -= 10;
	    }
	  } else if (e.keyCode === 38) {
	    if (this.velY > -this.speed){
	        this.velY -= 10;
	    }
	  } else if (e.keyCode === 39) {
	    if (this.velX < this.speed){
	        this.velX += 10;
	    }
	  } else if (e.keyCode === 40) {
	    if (this.velY < this.speed){
	        this.velY += 10;
	    }
	  }
	
	  this.velY *= this.friction;
	  this.yPos += this.velY;
	  this.velX *= this.friction;
	  this.xPos += this.velX;
	};
	
	module.exports = Player;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function () {
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this), 8000);
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	  requestAnimationFrame(this.animate.bind(this), 8000);
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map