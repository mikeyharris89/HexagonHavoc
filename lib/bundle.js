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
	    GameView = __webpack_require__(2);
	
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

	var Platform = __webpack_require__(3),
	    Flag = __webpack_require__(4),
	    Player = __webpack_require__(5);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	};
	
	GameView.prototype.start = function () {
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this), 5000);
	};
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 3 */
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
	};
	
	Platform.prototype.draw = function(ctx) {
	  var x = this.pos[0];
	  var y = this.pos[1];
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.moveTo(x + this.radius, y);
	  ctx.lineTo(x + this.rectWidth, y + this.height);
	  ctx.lineTo(x + this.rectWidth, y + this.height + this.sideLength);
	  ctx.lineTo(x + this.radius, y + this.rectHeight);
	  ctx.lineTo(x, y + this.sideLength + this.height);
	  ctx.lineTo(x, y + this.height);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	var Flag = function (options = {} ) {
	  this.colors = options.colors;
	  this.color = this.randomColor();
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
/* 5 */
/***/ function(module, exports) {

	var Player = function (options = {}) {
	  this.name = options.name;
	  this.xPos = 500;
	  this.yPos = 300;
	  this.xVel = 0;
	  this.yVel = 0;
	  this.speed = 2;
	  this.radius = 10;
	  this.friction = 0.98;
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
	
	Player.prototype.addKeyListener = function () {
	  this.fn = this.move.bind(this);
	  window.addEventListener("keydown", this.fn, false);
	};
	
	Player.prototype.move = function (e) {
	  e.preventDefault();
	  if (e.keyCode === 37){
	    this.xPos -= 5;
	  } else if (e.keyCode === 38) {
	    this.yPos -= 5;
	  } else if (e.keyCode === 39) {
	    this.xPos += 5;
	  } else if (e.keyCode === 40) {
	    this.yPos +=5;
	  }
	
	};
	
	module.exports = Player;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map