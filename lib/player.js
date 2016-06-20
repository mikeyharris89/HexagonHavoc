var Player = function (options = {}) {
  this.game = options.game;
  this.name = options.name;
  this.keyCodes = options.keyCodes;
  this.color = options.color;
  this.xPos = options.pos[0];
  this.yPos = options.pos[1];
  this.velX = 0;
  this.velY = 0;
  this.speed = 10;
  this.radius = 10;
  this.friction = 0.75;
  this.addKeyListener();
};

Player.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();
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
  this.fn = this.move.bind(this);
  window.addEventListener("keydown", this.fn, true);
  window.addEventListener("keyup", this.fn, false);
};

Player.prototype.move = function (e) {

  e.preventDefault();
  if (e.keyCode === this.keyCodes[0]){
    if (this.velX > -this.speed){
        this.velX -= 10;
    }
  } else if (e.keyCode === this.keyCodes[1]) {
    if (this.velY > -this.speed){
        this.velY -= 10;
    }
  } else if (e.keyCode === this.keyCodes[2]) {
    if (this.velX < this.speed){
        this.velX += 10;
    }
  } else if (e.keyCode === this.keyCodes[3]) {
    if (this.velY < this.speed){
        this.velY += 10;
    }
  }
  if (this.keyCodes.includes(e.keyCode)) {
    this.velY *= this.friction;
    this.yPos += this.velY;
    this.velX *= this.friction;
    this.xPos += this.velX;

  }
};

module.exports = Player;
