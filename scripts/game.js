// the player
var player;

// the platforms
var platforms = new Array;
var blocks = new Array;
var coins = new Array;
var coinCnt = 0;
var coinInt;
var blockRandom = new Array;
var score = 0;
var time = 0;
var countdown = 10;
var ground;

// array to store all key presses
var keysDown = new Array;

// important key codes to play game
var keys = {left: 37, right: 39, up: 38, down: 40, space: 32, esc: 27};

// listen for key presses
addEventListener("keydown", function (e) {
	// add to array of keys pressed
	keysDown[e.keyCode] = true;
	
	// disable scrolling when these buttons are pushed
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// no longer pressing a key
addEventListener("keyup", function (e) {
	// remove from array of keys pressed
	delete keysDown[e.keyCode];
}, false);

// initialize the game
function init() {

    ground = createGround(groundImage);

	// set up player
	player = createPlayer(spriteSheet); // player.js
	
	
	blocks.push(new Platform((canvas.width/2) - 48, canvas.height - 112, startImage, 1, "start"));

	// set up platforms (4 total)
	for (var i = 0; i < 7; i++) {

		var overlap = false;
		var typeBlock = [
			{
				sprite: greyFormImage,
				type: "neutral"
			},
			{
				sprite: orangeFormImage,
				type: "speedBoost"
			},
			{
				sprite: blueFormImage,
				type: "bounce"
			},
			{
				sprite: slowFormImage,
				type: "slow"
			}
		];

		var randLength = Math.floor(Math.random() * 12) + 1;
		var rX = Math.floor(Math.random() * (canvas.width - (200 + randLength * 16))) + 100;
		var rW = randLength * 16;
		var rY = Math.floor(Math.random() * (canvas.height - 112));
		var randBlock = Math.floor(Math.random() * typeBlock.length);
		var height = 16;
		var xPadding = 25;
		var yPadding = 40;
		
		for (var j = 0; j < blocks.length; j++) {

			if ((rX - xPadding <= blocks[j].x + blocks[j].width) && (rX + rW + xPadding >= blocks[j].x) && (rY + height + yPadding >= blocks[j].y) && (rY - yPadding <= blocks[j].y + blocks[j].height)) {
				overlap = true;
			}
		}

		if (overlap || rY < 80) {
			i--;
			continue;
		}
        
		blocks.push(new Platform(rX, rY, typeBlock[randBlock].sprite, randLength, typeBlock[randBlock].type));        
	}
	
	showCoins();

	// start game engine
	setInterval(main, 17);
	setInterval(gameTimer, 1000);
}

// GAME ENGINE
function main() {
	// update game logic
	update();
		
	// draw the game
	render(); // graphics.js
}

// update game logic
function update() {

	time += 17;
	// update player position
	player.update();
	
	// check every platform
	for (i = 0; i < blocks.length; i++) {
	
		// ignore this if player is holding down or jumping
		if (!(keys.down in keysDown) && player.velocity >= 0) {
		
			// compare x/y values to find collision between player and platform
			if ((player.y + player.height > blocks[i].y) && (player.y + player.height < blocks[i].y + blocks[i].height) && (player.x + player.width > blocks[i].x && player.x < blocks[i].x + blocks[i].width)) {
            
                switch (blocks[i].blockType) {

					case "start":
						player.jumpPower = 21;
						player.speed = 6;
						break;

                    case "bounce":
                        player.jumpPower = 21;
                        player.speed = 3;
                    break;

                    case "speedBoost":
                        player.jumpPower = 14;
                        player.speed = 6;
					break;
					
					case "slow":
						player.jumpPower = 10;
						player.speed = 1.5;
						break;

                    case "neutral":
                        player.jumpPower = 14;
                        player.speed = 3;
                    break;
                }

				// stop player
				player.y = blocks[i].y - player.height;
				
				// reset jumping/falling
				player.jumping = false;
				player.velocity = 0;
			}
        }
	}
	
	for (i = 0; i < coins.length; i++) {
		
		// Check for Coin Collision
		if ((player.x <= coins[i].x + coins[i].width) && (player.x + player.width >= coins[i].x) && (player.y + player.height >= coins[i].y) && (player.y <= coins[i].y + coins[i].height)) {
		
			// Remove Collected Coin
			coins.splice(i, 1);
			console.log(coins);

			// Increase Coin Score
			score++;
			coinCnt--;
			countdown++;

			console.log("COLLECTING: " + coinCnt);

			if (coinCnt === 0) {
				showCoins();
			}

			break;
		}
	}
			
    if (player.y + player.height > ground.position) {
    
        player.y = ground.position - player.height;
        
        player.jumping = false;
        player.velocity = 0;
        player.speed = 3;
		player.jumpPower = 14;
		
		// reset();
	}
	
	if (time > 10000) {
		showCoins();
	}

	if (countdown === 0) {
		stopTime();
	}
}

// Populate Coins Array
function showCoins() {

	time = 0;
	coinCnt = 3;
	coins = [];
	blockRandom = [];

	for (let i = 0; i < 3; i++) {

		var blockNum = Math.floor(Math.random() * 6) + 1;

		if (blockRandom.length === 0 || blockRandom.indexOf(blockNum) === -1) {
			blockRandom.push(blockNum);
			coins.push(new Coin(blocks[blockRandom[i]], coinSprite));
		}
		else {
			i--;
			continue;
		}
	}
}

function gameTimer() {
	countdown--;
}

function stopTime() {
	clearInterval(gameCount);
}

function reset() {
	// score = 0;
	// platforms = [];
	// blocks = [];
	// coins = [];
	// player.jumping = false;
	// player.velocity = 0;
	// player.speed = 3;
	// player.jumpPower = 14;

	// init();
	// location.reload();
}