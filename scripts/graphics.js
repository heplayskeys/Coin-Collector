// canvas element
var canvas;
var ctx;

// some variables that help control loading
var images = 1;
var loading = 0;

// called after the browser window loads
window.onload = function() {
	// create canvas
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');
	
	// set size
	canvas.width = 800;
	canvas.height = 400;
	
	// canvas has loaded
	loading++;
	
	// are all elements loaded now?
	if (loading == images) {
		init(); // game.js
	}
}

// image pre-loader
function loadImg(x) {
	// add to the total number of images
	images++;

	// set up a new image
    var img = new Image();
	
	// called after the image loads
    img.onload = function() {
		// add to the total number of loaded images
		loading++;
		
		// are all of the elements loaded now?
		if (loading == images)
			init(); // game.js
	};
	
	// finish creating image
    img.src = x;	
    return img;
}

// start loading our graphics
var spriteSheet = loadImg('images/spritesheetUSE.png');
var startImage = loadImg('images/start.png');
var groundImage = loadImg('images/ground.png');
var blueFormImage = loadImg('images/blue.png');
var orangeFormImage = loadImg('images/orange.png');
var greyFormImage = loadImg('images/grey.png');
var slowFormImage = loadImg('images/slow.png');
var coinSprite = loadImg('images/coins.png');
var fireSprite = loadImg('images/fire13.png');

// draw everything
function render() {	
	// reset the canvas
	ctx.globalAlpha = 1;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw the platforms
	for (i = 0; i < blocks.length; i++) {
        blocks[i].draw();
	}
	
	// draw the coins
	for (i = 0; i < coins.length; i++) {
		coins[i].draw();
	}
	
	// draw the particles
	for (i = 0; i < particles.length; i++) {
		particles[i].draw();
	}

	// draw the player on top
    player.draw();
    
	fireGround.draw();

	// Score
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Coins: " + score, 20, 20);

	// Timer
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText("Time: " + countdown, 780, 20);
	
}

function particleBurst(x, y) {

	console.log(x);

	// Inital starting position
	var posX = x;
	var posY = y + 25;

	// Set up object to contain particles and set some default values
	var particles = {};
	var particleIndex = 0;
	var settings = {

		density: 1,
		particleSize: 2.5,
		startingX: x,
		startingY: y + 25,
		gravity: 0.5,
		groundLevel: canvas.height,
		leftWall: 0,
		rightWall: canvas.width
	};

	// To optimise the previous script, generate some pseudo-random angles
	var seedsX = [];
	var seedsY = [];
	var maxAngles = 100;
	var currentAngle = 0;

	function seedAngles() {

	  seedsX = [];
	  seedsY = [];

	  for (var i = 0; i < maxAngles; i++) {

		seedsX.push(Math.random() * 10 - 5);
		seedsY.push(Math.random() * 15 - 5);
	  }
	}

	// Start off with 100 angles ready to go
	seedAngles();

	// Set up a function to create multiple particles
	function Particle() {

	  if (currentAngle !== maxAngles) {
		// Establish starting positions and velocities
		this.x = settings.startingX;
		this.y = settings.startingY;

		this.vx = seedsX[currentAngle];
		this.vy = seedsY[currentAngle];

		currentAngle++;

		// Add new particle to the index
		// Object used as it's simpler to manage that an array
		particleIndex ++;
		particles[particleIndex] = this;
		this.id = particleIndex;
		this.size = settings.particleSize;
	  }
	  else {
		seedAngles();
		currentAngle = 0;
	  }
	}

	// Some prototype methods for the particle's "draw" function
	Particle.prototype.draw = function() {
	  this.x += this.vx;
	  this.y += this.vy;
	  
	  // Give the particle some bounce
	  if ((this.y + settings.particleSize) > settings.groundLevel) {
		this.vy *= -0.6;
		this.vx *= 0.75;
		this.y = settings.groundLevel - settings.particleSize;
		this.size -= 0.25;
	  }

	  // Determine whether to bounce the particle off a wall
	  if (this.x - (settings.particleSize) <= settings.leftWall) {
		this.vx *= -1;
		this.x = settings.leftWall + (settings.particleSize);
		this.size -= 0.25;
	  }

	  if (this.x + (settings.particleSize) >= settings.rightWall) {
		this.vx *= -1;
		this.x = settings.rightWall - settings.particleSize;
		this.size -= 0.25;
	  }

	  // Adjust for gravity
	  this.vy += settings.gravity;

	  // Particle shrinks away
	  if (this.size < 0) {
		delete particles[this.id];
	  }

	  // Create the shapes
	  ctx.beginPath();
	  ctx.fillStyle="#000000";
	  // Draws a circle of radius this.size at the coordinates of the player on the canvas
	  ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, true); 
	  ctx.closePath();
	  ctx.fill();
	}

	var startBurst = setInterval(burst, 17);

	setTimeout(function() {
		clearInterval(startBurst);
	}, 750);
};