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
