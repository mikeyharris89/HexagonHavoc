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
	    Platform = __webpack_require__(2);
	    var COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];
	
	
	function handleClick(e){
	  e.preventDefault();
	  var canvasEl = document.getElementsByTagName("canvas")[0],
	      x = e.pageX - canvasEl.offsetLeft,
	      y = e.pageY - canvasEl.offsetTop,
	      ctx = canvasEl.getContext("2d"),
	      game,
	      style = canvasEl.style;
	  style.marginLeft = "auto";
	  style.marginRight = "auto";
	
	  var parentStyle = canvasEl.parentElement.style;
	  parentStyle.textAlign = "center";
	  parentStyle.width = "100%";
	
	  if ((x >= 150  && y >= 500) && (x <= 315  && y <= 550)){
	     game = new Game(2);
	    new GameView(game, ctx).start();
	
	  } else if ((x >= 450  && y >= 500) && (x <= 615  && y <= 550)){
	     game = new Game(3);
	    new GameView(game, ctx).start();
	
	  } else if ((x >= 750  && y >= 500) && (x <= 915  && y <= 550)) {
	     game = new Game(4);
	    new GameView(game, ctx).start();
	  }
	}
	
	function drawRandomHexagon (ctx) {
	  var x = (Math.random() * 1200) - 200,
	      y = (Math.random() * 1200) - 200,
	      color = COLORS[Math.floor(Math.random() * 6)],
	      angle = 0.523598776,
	      sideLength = Math.random() * 100,
	      height = Math.sin(angle) * sideLength,
	      radius = Math.cos(angle) * sideLength,
	      rectHeight = sideLength + 2 * height,
	      rectWidth = 2 * radius,
	      vertex1 = [x + radius, y],
	      vertex2 = [x + rectWidth, y + height],
	      vertex3 = [x + rectWidth, y + height + sideLength],
	      vertex4 = [x + radius, y + rectHeight],
	      vertex5 = [x, y + sideLength + height],
	      vertex6 = [x, y + height],
	      vertices = [];
	      vertices.push(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6);
	
	  ctx.lineWidth = 5;
	  ctx.strokeStyle = color;
	  ctx.beginPath();
	  ctx.moveTo(vertices[0][0], vertices[0][1]);
	
	  vertices.slice(1).forEach(function(vertex){
	    ctx.lineTo(vertex[0], vertex[1]);
	  });
	
	  ctx.closePath();
	  ctx.stroke();
	}
	
	document.addEventListener("DOMContentLoaded", function() {
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var style = canvasEl.style;
	  style.marginLeft = "auto";
	  style.marginRight = "auto";
	
	  var parentStyle = canvasEl.parentElement.style;
	  parentStyle.textAlign = "center";
	  parentStyle.width = "100%";
	  var ctx = canvasEl.getContext("2d");
	
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  for (var j = 0; j < 200; j++) {
	    drawRandomHexagon(ctx);
	  }
	  ctx.font = '60px "sans-serif"';
	  ctx.fillStyle = "white";
	  ctx.fillText('HEXAGON HAVOC', 200, 75);
	  ctx.fontStyle = "bold";
	
	  for (var i = 0; i < 3; i++) {
	    drawRoundButton(ctx, COLORS[i], (300 * i + 150), 500, 152, 40, 4);
	    drawText(ctx, (i + 2) + " Players", COLORS[i], (300 * i + 160), 525);
	  }
	
	  canvasEl.addEventListener('click', handleClick);
	});
	
	function startGame () {
	  var game = new Game();
	  new GameView(game, ctx).start();
	}
	
	function wordColor (string, x, y, ctx){
	  ctx.font = '40px "New Super Mario Font (Mario Party 9)"';
	  ctx.lineWidth = 5;
	
	  for (var i = 0; i < string.length; i++) {
	    ctx.strokeStyle = COLORS[i % 7];
	    ctx.strokeText(string[i], x, y);
	    x += ctx.measureText(string[i]).width;
	  }
	}
	
	function drawRoundButton(ctx, color, x, y, width, height, arcsize) {
	  ctx.lineWidth = 5;
	  ctx.strokeStyle = color;
	
	  ctx.beginPath();
	  ctx.moveTo(x+arcsize, y);
	  ctx.lineTo(x+width-arcsize, y);
	  ctx.arcTo(x+width, y, x+width, y+arcsize, arcsize);
	  ctx.lineTo(x+width,y+height-arcsize);
	  ctx.arcTo(x+width, y+height, x+width-arcsize, y+height, arcsize);
	  ctx.lineTo(x+arcsize, y+height);
	  ctx.arcTo(x, y+height, x, y-arcsize, arcsize);
	  ctx.lineTo(x, y+arcsize);
	  ctx.arcTo(x, y, x+arcsize, y, arcsize);
	  ctx.lineTo(x+arcsize, y);
	  ctx.stroke();
	}
	
	function drawText(ctx, text, color, x, y){
	  ctx.font = '15px "New Super Mario Font (Mario Party 9)"';
	  ctx.strokeStyle = color;
	  ctx.lineWidth = 2;
	  ctx.strokeText(text, x, y);
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Platform = __webpack_require__(2),
	    Flag = __webpack_require__(3),
	    Player = __webpack_require__(4);
	
	var Game = function (numPlayers) {
	  this.platforms = [];
	  this.players = [];
	  this.flag = new Flag({ game: this, colors: Game.COLORS });
	  this.movingOut = true;
	  this.homePlatforms = [];
	  this.addPlatforms();
	  this.addPlayers(numPlayers);
	  this.flagPlatform = this.platforms[3];
	  this.paused = true;
	  setTimeout(function() {
	    this.paused = false;
	  }.bind(this), 5000);
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_PLATFORMS = 7;
	Game.COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];
	Game.PLATFORM_POS = [[370, 113], [500, 113], [305, 225], [435, 225], [565, 225], [370, 337], [500, 337]];
	Game.PLATFORM_DIRS = [[-4, -4], [4, -4], [-6, 0], [0, 6], [6, 0], [-4, 4], [4, 4]];
	
	
	var equalPositions = function(pos1, pos2) {
	  return (pos1[0] === pos2[0]) && (pos1[1] === pos2[1]);
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
	  } else {
	    ctx.font = '40px "New Super Mario Font (Mario Party 9)"';
	    ctx.lineWidth = 5;
	
	    var text = "Draw",
	        x = 400,
	        y = 75;
	
	    if (this.players.length === 1){
	      var winner = this.players[0];
	      text = winner.name + " Wins!";
	      x = 225;
	    }
	
	    for (var i = 0; i < text.length; i++) {
	
	      ctx.strokeStyle = Game.COLORS[i % 7];
	      ctx.strokeText(text[i], x, y);
	      x += ctx.measureText(text[i]).width;
	    }
	  }
	
	};
	
	Game.prototype.gameOver = function () {
	  return this.players.length <= 1;
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
	      if (direction === -1) {
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
	      this.moveObjects(delta, 1);
	      this.allOff();
	    }
	
	    else {
	      this.moveObjects(delta, -1);
	      this.allBack();
	    }
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
	  this.keyCodes = options.keyCodes;
	  this.color = options.color;
	  this.xPos = options.pos[0];
	  this.yPos = options.pos[1];
	  this.velX = 0;
	  this.velY = 0;
	  this.speed = 3;
	  this.radius = 10;
	  this.friction = 0.75;
	  this.addKeyListener();
	  this.makeSprite();
	};
	
	var keys = [];
	
	Player.prototype.makeSprite = function () {
	  var sprite = new Image();
	  sprite.src = "./assets/images/" + this.name +".png";
	  this.sprite = sprite ;
	};
	
	Player.prototype.draw = function (ctx) {
	  this.move();
	  // ctx.fillStyle = this.color;
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, true
	  // );
	  // ctx.fill();
	  ctx.drawImage(this.sprite, this.xPos, this.yPos);
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
	  window.addEventListener("keydown", function (e) { e.preventDefault(); keys[e.keyCode] = true;});
	  window.addEventListener("keyup", function (e) { e.preventDefault(); keys[e.keyCode] = false;});
	};
	
	
	Player.prototype.move = function () {
	  if (keys[this.keyCodes[0]]){
	    if (this.velX > -this.speed){
	        this.velX -= 5;
	    }
	  }  if (keys[this.keyCodes[1]]) {
	    if (this.velY > -this.speed){
	        this.velY -= 5;
	    }
	  }  if (keys[this.keyCodes[2]]) {
	    if (this.velX < this.speed){
	        this.velX += 5;
	    }
	  }  if (keys[this.keyCodes[3]]) {
	    if (this.velY < this.speed){
	        this.velY += 5;
	    }
	  }
	
	  this.velY *= this.friction;
	  this.yPos += this.velY;
	  this.velX *= this.friction;
	  this.xPos += this.velX;
	};
	
	Player.prototype.colliding = function (otherPlayer) {
	  var dx = otherPlayer.xPos - this.xPos;
	  var dy = otherPlayer.yPos - this.yPos;
	  var totalRadius = this.radius * 2;
	  return ((dx * dx) + (dy * dy)) <= (totalRadius * totalRadius);
	
	};
	
	Player.prototype.handleCollision = function (otherPlayer) {
	  var tempVelX = this.velX,
	      tempVelY = this.velY;
	
	  this.velX = otherPlayer.velX;
	  this.velY = otherPlayer.velY;
	  otherPlayer.velX = tempVelX;
	  otherPlayer.velY = tempVelY;
	  this.xPos += this.velX;
	  this.yPos += this.velY;
	  otherPlayer.xPos += otherPlayer.velX;
	  otherPlayer.yPos += otherPlayer.velY;
	
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