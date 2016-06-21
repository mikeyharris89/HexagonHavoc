var Game = require("./game"),
    GameView = require("./gameView");
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

  wordColor('Hexagon Havoc', 200, 75, ctx);
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
