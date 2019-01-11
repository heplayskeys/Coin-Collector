function Coin(block, sprite) {
    this.sprite = sprite;
    this.x = Math.floor(Math.random() * (block.width - 16)) + block.x; 
    this.y = block.y - sprite.height - 4;
    this.width = sprite.width/8;
    this.height = sprite.height;
    this.frameX = 0;
    this.delay = 0;
    this.draw = function() {

        this.delay++;
        
        if (this.delay > 6) {
            this.delay = 0;
            
            if (this.frameX < 7) {
                this.frameX++
            }
            else {
                this.frameX = 0;
            }
        }
        ctx.drawImage(this.sprite, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}