var GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.keyUpHandler = this.handleKey.bind(this);
};

COLORS = ["#FFADF7", "#FF0000", "#0000FF", "#FFFF00", "#00CC00", "#7F00FF", "#00FFFF"];

GameView.prototype.start = function () {
  this.lastTime = 0;
  this.instructionScreen();
};


GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;
  requestAnimationFrame(this.animate.bind(this), 8000);
};

GameView.prototype.instructionScreen = function(){
  this.ctx.clearRect(0, 0, 1000, 600);
  this.ctx.fillStyle = "black";
  this.ctx.fillRect(0, 0, 1000, 600);

  this.ctx.fillStyle = "white";
  var description1 = "Free for all political melee!! Run to the",
      description2 = "platform corresponding to the color.",
      description3 = "of the flag. Be quick, or you'll be left",
      description4 = "behind. And watch out, your fellow",
      description5 = "candidates can push you off!";

  wordColor("Instructions", 245, 75, this.ctx);
  drawWords(15, "Press any key to continue", "red",315, 550, this.ctx);
  drawWords(12, description1, "blue", 50, 150, this.ctx);
  drawWords(12, description2, "blue", 50, 175, this.ctx);
  drawWords(12, description3, "blue", 50, 200, this.ctx);
  drawWords(12, description4, "blue", 50, 225, this.ctx);
  drawWords(12, description5, "blue", 50, 250, this.ctx);
  window.addEventListener("keyup", this.keyUpHandler, false);
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


module.exports = GameView;
