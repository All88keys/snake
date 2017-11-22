var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
c.width = window.innerWidth;
c.height = window.innerHeight;
window.addEventListener('resize', resizeCanvas, false);
var looper;
ctx.fillStyle = 'white';

var active = false;
var width = 50;
var height = 30;

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function resizeCanvas() {
	c.width = window.innerWidth;
	c.height = window.innerHeight;

}

document.addEventListener('keydown', function (e) {
  if (active) {
    if (e.keyCode == 37 && player.direction != "right") {player.direction = "left"}
    if (e.keyCode == 39 && player.direction != "left") {player.direction = "right"}
    if (e.keyCode == 38 && player.direction != "down") {player.direction = "up"}
    if (e.keyCode == 40 && player.direction != "up") {player.direction = "down"}
  }
},false);

var fruit = {
  x:rand(0,width-1),
  y:rand(0,height-1),
  update: function () {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(this.x*c.width/width, this.y*c.height/height, c.width/width, c.height/height);
    ctx.fillStyle = "white";
  }
}

var player = {
  direction: 'none',
  active: false,
  x: width/2,
  y: height/2,
  lastx:0,
  lasty:0,
  tail: [],
  update: function () {
    //remember last location
    player.lasty = player.y;
    player.lastx = player.x;

    //change player velocity by direction
    switch (player.direction) {
      case "up":
        player.y-=1;
        break;
      case "down":
        player.y+=1;
        break;
      case "left":
        player.x-=1;
        break;
      case "right":
        player.x+=1;
        break;
      default:
        break;
    }

    //keep the player in bounds
    player.x%=width;
    player.y%=height;
    if (player.x<0) {
      player.x = width;
    }
    if (player.y<0) {
      player.y = height;
    }

    if (player.x == fruit.x && player.y == fruit.y) {
      if (player.tail.length == 0) {
        player.tail.push(new tailPiece(player.x,player.y,player.tail.length));
      } else {
        player.tail.push(new tailPiece(player.tail[player.tail.length-1].lastx,player.tail[player.tail.length-1].lasty,player.tail.length));
      }
      fruit.x = rand(0,width-1);
      fruit.y = rand(0,height-1);
    }

    for (var i = 1; i < player.tail.length; i++) {
      if (player.x == player.tail[i].x && player.y == player.tail[i].y) {
        end();
      }
    }

    ctx.beginPath();
    ctx.fillRect(this.x*c.width/width, this.y*c.height/height, c.width/width, c.height/height); //draw player
  }
}

function tailPiece(x,y,order){ //tailpiece constructor
  this.order= order;
  this.x = x;
  this.y = y;
  this.lastx = x;
  this.lasty = y;
  this.update = function () {
    this.lastx = this.x;
    this.lasty = this.y;

    if (order == 0) {
      this.x = player.lastx;
      this.y = player.lasty;
    } else{
      this.x = player.tail[order-1].lastx;
      this.y = player.tail[order-1].lasty;
    }
    ctx.beginPath();
    ctx.fillRect(this.x*c.width/width, this.y*c.height/height, c.width/width, c.height/height);
  }
}

//player.tail.push(new tailPiece(player.x,player.y,player.tail.length)); //create/update tail
//player.tail[0].update();

function start() { //set initial game variables
  active = true;
  player.direction = 'down';
  player.x = Math.round(width/2);
  player.y = Math.round(height/2);
  looper = setInterval(loop ,100);
}

function end() { //kill game
  active = false;
  clearInterval(looper);
  player.tail = [];
  console.log('you lose boy');
  start();
}

function loop() { //game tick
  ctx.clearRect(0,0,c.width,c.height); //clear canvas
  player.update();
  for (var i = 0; i < player.tail.length; i++) {
    player.tail[i].update();
  }
  fruit.update();
}

start();
