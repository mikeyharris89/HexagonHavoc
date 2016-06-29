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
