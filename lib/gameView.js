var Game = require("./game.js");

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
