// player class
function createPlayer(s) {
	return {
		// graphics
		sprite: s,
		width: 25,
		height: 45,
		frameX: 7,
		frameY: 0,
		delay: 0,
		// position
		x: canvas.width/2 - 25/2,
		y: canvas.height - 150,
		// movement
		speed: 3,
		velocity: 0,
		jumpPower: 14,
		jumping: false,
		update: function() {
			// player presses left
			if (this.x > 0 && keys.left in keysDown) {
				// move player to the left
				this.x -= this.speed;
				
				// change the spritesheet row
				this.frameY = 1;
			}
				
			// presses right
			if (this.x + this.width <= canvas.width && keys.right in keysDown) {
				this.x += this.speed;
				
				this.frameY = 0;
			}
				
			// presses up
			if (!this.jumping && keys.up in keysDown && this.velocity == 0) {
				// begin jumping by bumping up velocity power
				this.velocity = this.jumpPower*-1;
				this.jumping = true;
			}
			
			// update gravity
			if (this.velocity < 0) {
				this.velocity++;
			}
			else {
				// fall slower than you jump
				this.velocity += 0.5;
			}
			
			// apply final velocity value
			this.y += this.velocity;
			
			// stop at bottom of screen
			if (this.y + this.height >= canvas.height) {
				this.y = canvas.height - this.height;
				
				// reset jumping/falling
				this.jumping = false;
				this.velocity = 0;
			}
		},
		draw: function() {	
			// increase delay value
			this.delay++;
			
			// change spritesheet frame after delay is met
			if (this.delay > 4) {
				// reset animation delay
				this.delay = 0;
				
				// show falling frame
				if (this.velocity > 0) {	
					this.frameX = 13;
				}
				// jumping
				else if (this.jumping) {
					this.frameX = 11;
				}
				// walking
				else if (keys.left in keysDown || keys.right in keysDown) {		
					if (this.frameX < 7) {
						// show a new walking frame on every update
						this.frameX++;
					}
					else {
						// start over when we reach the end of the walking frames
						this.frameX = 0;
					}
				}
				// stopped
				else {
					this.frameX = 7;
				}
			}
				
			// draw player on canvas (by selecting a small portion of the spritesheet)
			ctx.drawImage(this.sprite, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
		}
	}
}