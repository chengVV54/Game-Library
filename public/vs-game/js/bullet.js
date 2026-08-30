let bullets = [];
class Bullet {
    constructor(x, y, targetX, targetY, damage, isMjText, imgSrc, team, canBounce){
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.isMjText = isMjText;
        this.team = team;
        this.canBounce = canBounce || false;
        this.bounces = 0;
        this.img = imgSrc ? new Image() : null;
        if(this.img){
            this.img.crossOrigin = "anonymous";
            this.img.src = imgSrc;
        }
        this.alive = true;
        this.speed = 6;
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        this.vx = (dx / dist) * this.speed;
        this.vy = (dy / dist) * this.speed;
    }
    update(){
        if(this.canBounce){
            this.x += this.vx;
            this.y += this.vy;
            if(this.x <= 0 || this.x >= canvas.width){
                this.vx *= -0.9;
                this.bounces++;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if(this.y <= 0 || this.y >= canvas.height){
                this.vy *= -0.9;
                this.bounces++;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
            if(this.bounces >= 3) this.alive = false;
        } else {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const dist = Math.max(1, Math.hypot(dx, dy));
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
            if(dist < 10) this.alive = false;
        }
    }
    draw(){
        if(this.isMjText){
            ctx.fillStyle = "#fff";
            ctx.font = "bold 22px system-ui";
            ctx.textAlign = "center";
            ctx.fillText("mj", this.x, this.y);
        } else if(this.img){
            ctx.drawImage(this.img, this.x - 15, this.y - 15, 30, 30);
        }
    }
}