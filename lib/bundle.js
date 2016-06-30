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
	
	
	document.addEventListener("DOMContentLoaded", function() {
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  var ctx = canvasEl.getContext("2d");
	  game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Platform = __webpack_require__(2),
	    Flag = __webpack_require__(3),
	    Player = __webpack_require__(4);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Platform = function (options = {}) {
	
	  this.direction = options.direction;
	  this.color = options.color;
	  this.pos = options.pos;
	  this.startPos = options.pos;
	  this.angle = 0.523598776;
	  this.sideLength = 115;
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
	  this.issues = this.setIssues();
	  this.color = this.colors[3];
	  this.game = options.game;
	};
	
	Flag.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.moveTo(775, 75);
	  ctx.lineTo(975, 75);
	  ctx.lineTo(975, 150);
	  ctx.lineTo(775, 150);
	  ctx.closePath();
	
	  ctx.fill();
	
	  ctx.fillStyle = "black";
	  ctx.font = '13px "New Super Mario Font (Mario Party 9)"';
	  ctx.fillText(this.issues[this.color], 780, 120);
	};
	
	Flag.prototype.setIssues = function () {
	  var topics = ["Healthcare", "Climate Change", "Education", "Guns", "Taxes", "Brexit", "Immigration"],
	      issues = {};
	  for (var i = 0; i < this.colors.length; i++) {
	    issues[this.colors[i]] = topics[i];
	  }
	  return issues;
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
	  this.speed = 2;
	  this.radius = 15;
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
	  ctx.drawImage(this.sprite, this.xPos - 15, this.yPos - 85);
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
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	var GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  this.keyUpHandler = this.handleKey.bind(this);
	  this.click = this.handleClick.bind(this);
	  this.newGame = this.playAgain.bind(this);
	  this.images = makeImages();
	};
	
	COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];
	
	GameView.prototype.start = function () {
	  this.lastTime = 0;
	  this.homeScreen();
	};
	
	
	GameView.prototype.animate = function(time){
	  var timeDelta = time - this.lastTime;
	
	  if (!this.game.over){
	
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	  requestAnimationFrame(this.animate.bind(this), 8000);
	}
	else {
	  this.endScreen(this.ctx);
	}
	};
	
	GameView.prototype.instructionScreen = function(){
	  this.ctx.clearRect(0, 0, 1000, 600);
	  this.ctx.fillStyle = "black";
	  this.ctx.fillRect(0, 0, 1000, 600);
	
	  this.ctx.fillStyle = "white";
	  var description1 = "It's a last-man(or Hillary)-standing",
	      description2 = "political melee!! Run to the platform",
	      description3 = "corresponding to your candidate's",
	      description4 = "ever-changing views. But be quick ",
	      description5 = "or you'll be out of the race. And ",
	      description6 = "watch out, your fellow candidates ",
	      description7 = "can make you plummet faster than",
	      description8 = "your approval ratings.";
	
	  wordColor("Instructions", 245, 75, this.ctx);
	  drawWords(15, "Press any key to continue", "red",315, 550, this.ctx);
	
	  drawWords(12, description1, "#00FFFF", 30, 150, this.ctx);
	  drawWords(12, description2, "#00FFFF", 30, 175, this.ctx);
	  drawWords(12, description3, "#00FFFF", 30, 200, this.ctx);
	  drawWords(12, description4, "#00FFFF", 30, 225, this.ctx);
	  drawWords(12, description5, "#00FFFF", 30, 250, this.ctx);
	  drawWords(12, description6, "#00FFFF", 30, 275, this.ctx);
	  drawWords(12, description7, "#00FFFF", 30, 300, this.ctx);
	  drawWords(12, description8, "#00FFFF", 30, 325, this.ctx);
	
	  drawWords(15, "Controls", "#FFADF7", 700, 150, this.ctx);
	  drawWords(12, "1. Trump   LEFT, UP, DOWN, RIGHT", "#FFFF00", 475, 200, this.ctx);
	  drawWords(12, "2. Hillary   A[left] W[up] D[right] S[down]", "#00CC00", 475, 240, this.ctx);
	  drawWords(12, "3. Bernie   J[left] I[up] L[right] K[down]", "#7F00FF", 475, 280, this.ctx);
	  drawWords(12, "4. Obama   X[left] F[up] V[right] C[down]", "#0000FF", 475, 320, this.ctx);
	  window.addEventListener("keyup", this.keyUpHandler, false);
	};
	
	GameView.prototype.endScreen = function(ctx) {
	  ctx.font = '40px "New Super Mario Font (Mario Party 9)"';
	  ctx.lineWidth = 5;
	
	  var text = "Draw",
	      x = 400,
	      y = 75;
	
	  if (this.game.players.length === 1){
	    var winner = this.game.players[0];
	    text = winner.name + " Wins!";
	    x = 225;
	    ctx.drawImage(winner.sprite, 450 ,300);
	  }
	
	  for (var i = 0; i < text.length; i++) {
	
	    ctx.strokeStyle = COLORS[i % 7];
	    ctx.strokeText(text[i], x, y);
	    x += ctx.measureText(text[i]).width;
	  }
	  drawRoundButton(ctx, COLORS[4], 400, 500, 175, 40, 4);
	  drawText(ctx, "Play Again!", 410, 525);
	
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.addEventListener('click', this.newGame);
	};
	
	GameView.prototype.playAgain = function(e) {
	  var canvasEl = document.getElementsByTagName("canvas")[0],
	      x = e.pageX - canvasEl.offsetLeft,
	      y = e.pageY - canvasEl.offsetTop;
	
	  if ((x >= 400  && y >= 500) && (x <= 575  && y <= 540)){
	
	  canvasEl.removeEventListener("click", this.newGame);
	  var ctx = canvasEl.getContext("2d");
	
	  ctx.clearRect(0, 0, 1000, 600);
	  ctx.fillStyle = "black";
	  ctx.fillRect(0, 0, 1000, 600);
	  game = new Game();
	  new GameView(game, ctx).start();
	}
	
	};
	
	GameView.prototype.handleKey = function(e) {
	  e.preventDefault();
	  window.removeEventListener("keyup", this.keyUpHandler, false);
	  requestAnimationFrame(this.animate.bind(this), 8000);
	};
	
	function wordColor (string, x, y, ctx){
	  ctx.font = '40px "New Super Mario Font (Mario Party 9)"';
	
	  for (var i = 0; i < string.length; i++) {
	    ctx.fillStyle = COLORS[i % 7];
	    ctx.fillText(string[i], x, y);
	    x += ctx.measureText(string[i]).width;
	  }
	}
	
	function drawWords (size, string, color, x, y, ctx) {
	  ctx.font = size + 'px "New Super Mario Font (Mario Party 9)"';
	  ctx.fillStyle = color;
	  ctx.fillText(string, x, y);
	}
	
	GameView.prototype.handleClick = function(e){
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
	     this.game.updatePlayers(2);
	     canvasEl.removeEventListener('click', this.click);
	     this.instructionScreen();
	  } else if ((x >= 450  && y >= 500) && (x <= 615  && y <= 550)){
	    this.game.updatePlayers(3);
	    canvasEl.removeEventListener('click', this.click);
	    this.instructionScreen();
	
	  } else if ((x >= 750  && y >= 500) && (x <= 915  && y <= 550)) {
	    this.game.updatePlayers(4);
	    canvasEl.removeEventListener('click', this.click);
	    this.instructionScreen();
	  }
	};
	
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
	  ctx.strokeStyle = "grey";
	  ctx.beginPath();
	  ctx.moveTo(vertices[0][0], vertices[0][1]);
	
	  vertices.slice(1).forEach(function(vertex){
	    ctx.lineTo(vertex[0], vertex[1]);
	  });
	
	  ctx.closePath();
	  ctx.stroke();
	}
	
	function drawSprites(images, ctx) {
	  setTimeout(function(){
	  images.forEach(function(image, index) {
	    ctx.drawImage(image, 300 + (index * 100), 300);
	  });}, 50);
	}
	
	GameView.prototype.homeScreen = function () {
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = 1000;
	  canvasEl.height = 600;
	
	
	  var style = canvasEl.style;
	  style.marginLeft = "auto";
	  style.marginRight = "auto";
	
	  var parentStyle = canvasEl.parentElement.style;
	  parentStyle.textAlign = "center";
	  parentStyle.width = "100%";
	  var ctx = canvasEl.getContext("2d");
	
	  ctx.clearRect(0, 0, 1000, 600);
	  ctx.fillStyle = "black";
	  ctx.fillRect(0, 0, 1000, 600);
	
	  for (var j = 0; j < 200; j++) {
	    drawRandomHexagon(ctx);
	  }
	
	  drawSprites(this.images, ctx);
	
	  wordColor('HEXAGON HAVOC', 180, 75, ctx);
	  for (var i = 0; i < 3; i++) {
	    drawRoundButton(ctx, COLORS[i + 3], (300 * i + 150), 500, 152, 40, 4);
	    drawText(ctx, (i + 2) + " Players", (300 * i + 160), 525);
	  }
	  canvasEl.addEventListener('click', this.click);
	};
	
	function wordColor (string, x, y, ctx){
	  ctx.font = '40px "New Super Mario Font (Mario Party 9)"';
	
	  for (var i = 0; i < string.length; i++) {
	    ctx.fillStyle = COLORS[i % 7];
	    ctx.fillText(string[i], x, y);
	    x += ctx.measureText(string[i]).width;
	  }
	}
	
	function drawRoundButton(ctx, color, x, y, width, height, arcsize) {
	  ctx.fillStyle = color;
	
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
	  ctx.fill();
	}
	
	function makeImages () {
	  var sprites = ["Hillary.png", "Trump.png", "Bernie.png", "Obama.png"],
	      images = [];
	
	  for (var i = 0; i < sprites.length; i++) {
	    var sprite = new Image();
	    sprite.src = "./assets/images/" + sprites[i];
	    images.push(sprite);
	  }
	  return images;
	}
	
	function drawText(ctx, text, x, y){
	  ctx.font = '15px "New Super Mario Font (Mario Party 9)"';
	  ctx.fillStyle = "black";
	  ctx.lineWidth = 2;
	  ctx.fillText(text, x, y);
	}
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map