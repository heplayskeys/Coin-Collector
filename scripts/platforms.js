function createGround(sprite) {
    return {
        sprite: sprite,
        width: 32,
        height: 32,
        position: canvas.height - 32,
        draw: function() {

            for (let i = 0; i < canvas.width; i += this.width) {
                ctx.drawImage(this.sprite, i, this.position, this.width, this.height);
            }
        }
    }
}

function Platform(x, y, sprite, length, type) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = length * this.sprite.width;
    this.height = this.sprite.height;
    this.blockType = type;
    this.draw = function() {

        for (let i = this.x; i < this.x + this.width; i += this.sprite.width) {

            ctx.drawImage(this.sprite, i, this.y, this.sprite.width, this.height);
            ctx.strokeRect(i, this.y, this.sprite.width, this.height);
        }
    }
}

function createFire(sprite) {
    return {
        sprite: sprite,
        y: canvas.height - 32,
        width: 32,
        height: 32,
        frameX: 0,
        delay: 0,
        draw: function() {

            this.delay++;
            
            if (this.delay > 6) {
                this.delay = 0;
                
                if (this.frameX < 5) {
                    this.frameX++
                }
                else {
                    this.frameX = 0;
                }
            }

            for (let i = 0; i < canvas.width; i += this.width) {
                ctx.drawImage(this.sprite, this.frameX * this.width, 0, this.width, this.height, i, this.y, this.width, this.height);
            }
        }
    }
}