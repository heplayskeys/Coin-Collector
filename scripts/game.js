// the player
var player;

// the platforms
var platforms = new Array;

// var orangeForms = new Array;
// var blueForms = new Array;

var blocks = new Array;

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
		var rX = Math.floor(Math.random() * (canvas.width - (100 + randLength * 16)));
		var rW = randLength * 16;
		var rY = Math.floor(Math.random() * (canvas.height - 112));
		var randBlock = Math.floor(Math.random() * typeBlock.length);
		var height = 16;

		console.log(rY);
		
		for (var j = 0; j < blocks.length; j++) {

			if ((rX < blocks[j].x + blocks[j].width) && (rX + rW > blocks[j].x) && (rY + height > blocks[j].y) && (rY < blocks[j].y + blocks[j].height)) {
				overlap = true;
			}
		}

		if (overlap || rY < 80) {
			i--;
			continue;
		}

		if (rX < 100) {
			rX = 100;
		}
        
		blocks.push(new Platform(rX, rY, typeBlock[randBlock].sprite, randLength, typeBlock[randBlock].type));        
	} 

	// start game engine
	setInterval(main, 17);
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
			
    if (player.y + player.height > ground.position) {
    
        player.y = ground.position - player.height;
        
        player.jumping = false;
        player.velocity = 0;
        player.speed = 3;
        player.jumpPower = 14;
    }
}