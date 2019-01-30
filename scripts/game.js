// Global Variables
var player;
var platforms = new Array;
var blocks = new Array;
var coins = new Array;
var particles = new Array;
var randomColor = ["#000000", "#77523b", "#262626", "#ffb27f", "#444489"];
var coinCnt = 0;
var coinInt;
var blockRandom = new Array;
var score = 0;
var time = 0;
var timer;
var runGame;
var countdown = 10;
var fireGround;

// array to store all key presses
var keysDown = new Array;

// important key codes to play game
var keys = {left: 37, right: 39, up: 38, down: 40, space: 32, esc: 27};

// listen for key presses
addEventListener("keydown", function (e) {
	// add to array of keys pressed
	keysDown[e.keyCode] = true;
	
	// disable scrolling when these buttons are pushed
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
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

    fireGround = createFire(fireSprite);

	// set up player
	player = createPlayer(spriteSheet); // player.js
	
	
	blocks.push(new Platform((canvas.width/2) - 48, canvas.height - 112, startImage, 1, "start"));

	showPlatforms();
	showCoins();

	// start game engine
	runGame = setInterval(main, 17);
	timer = setInterval(gameTimer, 1000);
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

	// update particles' position
	for (let i = 0; i < particles.length; i++) {

		particles[i].update();

		if (particles[i].size <= 0) {
			particles.splice(i, 1);
		}
	}
	
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
			
    if (player.y + player.height > fireGround.y + 16) {

		// Populate Particles Array
		for (let i = 0; i < 25; i++) {
			particles.push(new Particle(player.x, player.y, randomColor[Math.floor(Math.random() * randomColor.length)]));
		}
            
        player.jumping = false;
        player.velocity = 0;
        player.speed = 3;
		player.jumpPower = 14;
		player.x = canvas.width/2 - 25/2;
		player.y = canvas.height - 150;

		score -= coinCnt;

		if (score < 0) {
			score = 0;
		}

		blocks.splice(1);
		showPlatforms();
	}
	
	if (time > 10000) {
		showCoins();
	}

	if (countdown <= 0) {
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

function showPlatforms() {

	// set up platforms (7 total)
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
}

function gameTimer() {
	countdown--;
}

function stopTime() {
	clearInterval(timer);
	clearInterval(runGame);

	if (score > localStorage.getItem("hs1") || localStorage.getItem("hs1") === null) {

		if (localStorage.getItem("hs1") !== null || localStorage.getItem("hn1") !== null) {
			localStorage.setItem(("hs2"), localStorage.getItem("hs1"));
			localStorage.setItem(("hn2"), localStorage.getItem("hn1"));
		}

		localStorage.setItem(("hn1"), localStorage.getItem("playerName"));
		localStorage.setItem("hs1", score);

		$("#hs1Name").text(localStorage.getItem("hn1"));
		$("#hs1Score").text(localStorage.getItem("hs1"));
		$("#hs2Name").text(localStorage.getItem("hn2"));
		$("#hs2Score").text(localStorage.getItem("hs2"));
		$("#hs3Name").text(localStorage.getItem("hn3"));
		$("#hs3Score").text(localStorage.getItem("hs3"));
	}
	else if (score > localStorage.getItem("hs2") || localStorage.getItem("hs2") === null) {

		if (localStorage.getItem("hs2") !== null || localStorage.getItem("hn2") !== null) {
			localStorage.setItem(("hs3"), localStorage.getItem("hs2"));
			localStorage.setItem(("hn3"), localStorage.getItem("hn2"));
		}

		localStorage.setItem(("hn2"), localStorage.getItem("playerName"));
		localStorage.setItem("hs2", score);

		$("#hs1Name").text(localStorage.getItem("hn1"));
		$("#hs1Score").text(localStorage.getItem("hs1"));
		$("#hs2Name").text(localStorage.getItem("hn2"));
		$("#hs2Score").text(localStorage.getItem("hs2"));
		$("#hs3Name").text(localStorage.getItem("hn3"));
		$("#hs3Score").text(localStorage.getItem("hs3"));
	}
	else if (score > localStorage.getItem("hs3") || localStorage.getItem("hs3") === null) {

		localStorage.setItem("hs3", score);
		localStorage.setItem(("hn3"), localStorage.getItem("playerName"));

		$("#hs1Name").text(localStorage.getItem("hn1"));
		$("#hs1Score").text(localStorage.getItem("hs1"));
		$("#hs2Name").text(localStorage.getItem("hn2"));
		$("#hs2Score").text(localStorage.getItem("hs2"));
		$("#hs3Name").text(localStorage.getItem("hn3"));
		$("#hs3Score").text(localStorage.getItem("hs3"));
	}

	$("#gameOver").modal("toggle");
	$("#numCoins").css("color", "red").text(score);

	if (score === 1) {
		$("#scoreValue").text(" Coin");
	}
	else {
		$("#scoreValue").text(" Coins");
	}

	$("#exit").on("click", () => {
		window.close();
	});

	$("#tryAgain").on("click", () => {
		location.reload();
	});
}