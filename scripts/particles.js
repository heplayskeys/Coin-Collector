function Particle(x, y, color) {
    this.x = x;
    this.y = y + player.height;
    this.randomVelY = -8 + (Math.random() * 3); // random between -5 and -8
    this.randomVelX = -2 + (Math.random() * 4); // random between -2 and +2
    this.size = 5;
    this.color = color;

    this.update = function() {
        this.randomVelY += 0.5;
        this.y += this.randomVelY;

        this.x += this.randomVelX;

        this.size -= 0.15;
    }

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}