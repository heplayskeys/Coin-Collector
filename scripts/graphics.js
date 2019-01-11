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

// draw everything
function render() {	
	// reset the canvas
	ctx.globalAlpha = 1;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// draw the platforms
	for (i = 0; i < blocks.length; i++) {
        blocks[i].draw();
	}
	
	for (i = 0; i < coins.length; i++) {
		coins[i].draw();
	}
	
	// draw the player on top
    player.draw();
    
	ground.draw();

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