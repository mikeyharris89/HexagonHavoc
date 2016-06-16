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
