var Game = require("./game"),
    GameView = require("./gameView");
    Platform = require("./platform");
    var COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];


document.addEventListener("DOMContentLoaded", function() {
  homeScreen();
});

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
  images.forEach(function(image, index) {
    ctx.drawImage(image, 100 + (index * 100), 300);
  });
}


function startGame () {
  var game = new Game();
  new GameView(game, ctx).start();
}

function homeScreen () {
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;
  var images = makeImages();

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

  drawSprites(images, ctx);

  wordColor('HEXAGON HAVOC', 180, 75, ctx);
  for (var i = 0; i < 3; i++) {
    drawRoundButton(ctx, COLORS[i + 3], (300 * i + 150), 500, 152, 40, 4);
    drawText(ctx, (i + 2) + " Players", (300 * i + 160), 525);
  }
  canvasEl.addEventListener('click', handleClick);
}

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
