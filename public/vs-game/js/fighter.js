class Fighter {
    constructor(config, team){
        this.team = team;
        this.teamLabel = team === 'A' ? 'P1' : 'P2';
        this.name = config.name || '';
        this.maxHp = config.hp;
        this.hp = config.hp;
        this.speed = config.speed;
        this.attackRange = config.attackRange;
        this.displayAttackRange = config.displayAttackRange || 0;
        this.damage = config.damage;
        this.burnDamage = config.burnDamage || 0;
        this.burnTickDamage = 0;
        this.hasCombo = config.hasCombo || false;
        this.attackType = config.attackType || 'melee';
        this.isMjChong = config.isMjChong || false;
        this.hasCharge = config.hasCharge || false;
        this.chargeMode = false;
        this.chargeStep = 0;
        this.chargeTimer = 0;
        this.chargeTarget = null;
        this.chargeDragStartX = 0;
        this.chargeDragStartY = 0;
        this.chargeCooldown = 420;
        this.energy = 0;
        this.baseSpeed = config.speed;
        this.skillSpeed = config.speed * 1.1;
        this.energyMax = 100;
        this.alive = true;

        this.normalImg = new Image();
        this.normalImg.crossOrigin = "anonymous";
        this.normalImg.src = config.normalImg;
        this.attackImg = new Image();
        this.attackImg.crossOrigin = "anonymous";
        this.attackImg.src = config.attackImg;

        const evo = EVOLUTION_DATABASE[this.name];
        if(evo){
            this.evolve1NormalImg = new Image();
            this.evolve1NormalImg.crossOrigin = "anonymous";
            this.evolve1NormalImg.src = evo.stage1.normalImg;
            this.evolve1AttackImg = new Image();
            this.evolve1AttackImg.crossOrigin = "anonymous";
            this.evolve1AttackImg.src = evo.stage1.attackImg;
            this.evolve2NormalImg = new Image();
            this.evolve2NormalImg.crossOrigin = "anonymous";
            this.evolve2NormalImg.src = evo.stage2.normalImg;
            this.evolve2AttackImg = new Image();
            this.evolve2AttackImg.crossOrigin = "anonymous";
            this.evolve2AttackImg.src = evo.stage2.attackImg;
        } else {
            this.evolve1NormalImg = null;
            this.evolve1AttackImg = null;
            this.evolve2NormalImg = null;
            this.evolve2AttackImg = null;
        }

        this.img = this.normalImg;
        this.speed = this.baseSpeed;

        if(this.name === '训练木桩'){
            this.x = canvas.width / 2 - SPRITE_SIZE / 2;
            this.y = canvas.height / 2 - SPRITE_SIZE / 2;
        } else {
            this.x = Math.random() * (canvas.width - SPRITE_SIZE);
            this.y = Math.random() * (canvas.height - SPRITE_SIZE);
        }

        this.vx = (Math.random() - 0.5) * 2 * this.speed;
        this.vy = (Math.random() - 0.5) * 2 * this.speed;
        this.pauseFrames = 0;
        this.attackDisplayFrames = 0;
        this.attackImageFrames = 0;
        this.attackCount = 0;
        this.attackCooldown = 0;
        this.chaseTimer = 0;
        this.evolveStage = 0;
        this.damageTexts = [];
        this.healTexts = [];
        this.burnFrames = 0;
        this.burnTickCounter = 0;
        this.comboMode = false;
        this.comboStep = 0;
        this.comboTimer = 0;
        this.comboTarget = null;
        this.comboAttackCount = 0;
        this.stunFrames = 0;
        this.stunTextFrames = 0;
        this.hasNailong = config.hasNailong || false;
        this.nailongStage = 0;
        this.tauntCooldown = 600;
        this.tauntTimer = 0;
        this.taunting = false;
        this.evolving = false;
        this.evolveStep = 0;
        this.evolveTimer = 0;
        this.hitCount = 0;
        this.cloneMode = false;
        this.clones = [];
        this.clonePhase = 0;
        this.cloneTimer = 0;
        this.cloneTarget = null;
        this.originalX = 0;
        this.originalY = 0;
        this.charmedFrames = 0;
        this.charmTextFrames = 0;
        this.mjAttackInterval = 250;
        this.mjHitCount = 0;
        this.mjSummonProgress = 0;
    }

    update(){
        if(!this.alive) return;
        
        if(this.pauseFrames > 0){
            this.pauseFrames--;
            return;
        }

        if(this.stunFrames > 0){
            this.stunFrames--;
            if(this.stunFrames === 0){
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * this.speed;
                this.vy = Math.sin(angle) * this.speed;
            }
            return;
        }

        if(this.charmedFrames > 0){
            this.charmedFrames--;
            if(this.charmTextFrames > 0) this.charmTextFrames--;
            
            if(this.charmedFrames % 30 === 0){
                this.hp -= 2;
                this.damageTexts.push({
                    text: `- 2 血量`,
                    x: this.x + SPRITE_SIZE/2,
                    y: this.y - 20,
                    frames: 60
                });
                if(this.hp <= 0){
                    this.hp = 0;
                    this.alive = false;
                }
            }
            // 不return，继续正常移动
        }
        
        if(this.cloneMode){
            this.cloneTimer--;
            const target = this.cloneTarget;
            
            if(this.clonePhase === 0){
                if(this.cloneTimer <= 0){
                    this.clonePhase = 1;
                    this.cloneTimer = 0;
                }
            } else if(this.clonePhase === 1){
                if(target && target.alive){
                    for(let c of this.clones){
                        const dx = target.x - c.x;
                        const dy = target.y - c.y;
                        const dist = Math.max(1, Math.hypot(dx, dy));
                        c.x += (dx / dist) * 3;
                        c.y += (dy / dist) * 3;
                        c.x = Math.max(0, Math.min(canvas.width - SPRITE_SIZE, c.x));
                        c.y = Math.max(0, Math.min(canvas.height - SPRITE_SIZE, c.y));
                    }
                    
                    const allArrived = this.clones.every(c => {
                        const d = Math.hypot(target.x - c.x, target.y - c.y);
                        return d < 50;
                    });
                    
                    if(allArrived){
                        this.clonePhase = 2;
                    }
                }
            } else if(this.clonePhase === 2){
                if(target){
                    target.takeDamage(this.damage * 2, false);
                    target.charmedFrames = 300;
                    target.charmTextFrames = 60;
                    playBellSound();
                }
                this.cloneMode = false;
                this.clones = [];
                this.x = this.originalX;
                this.y = this.originalY;
                this.img = this.normalImg;
                this.pauseFrames = 30;
            }
            return;
        }
        
        if(this.evolving){
            this.evolveTimer--;
            if(this.evolveStep === 0){
                if(this.evolveTimer <= 0){
                    this.evolveStep = 1;
                    this.evolveTimer = 600;
                    this.img = new Image();
                    this.img.src = '/assets/nailongbaojinhua.png';
                    playNailongLaughSound();
                }
            } else if(this.evolveStep === 1){
                if(this.evolveTimer <= 0){
                    this.evolving = false;
                    this.nailongStage = 1;
                    this.normalImg = new Image();
                    this.normalImg.src = '/assets/nailongjinhua1.png';
                    this.attackImg = new Image();
                    this.attackImg.src = '/assets/nailongjinhua2.png';
                    this.img = this.normalImg;
                }
            }
            return;
        }



        if(this.comboMode){
            this.comboTimer--;
            const target = this.comboTarget;
            
            if(this.comboStep === 0){
                if(target && target.alive){
                    const dx = target.x - this.x;
                    const dy = target.y - this.y;
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    this.x += (dx / dist) * 8;
                    this.y += (dy / dist) * 8;
                    if(dist < 30){
                        this.comboStep = 1;
                        this.comboTimer = 0;
                    }
                }
            } else if(this.comboStep === 1){
                if(target && target.alive){
                    const dx = target.x - this.x;
                    const dy = target.y - this.y;
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    const nx = dx / dist;
                    const ny = dy / dist;
                    target.x += nx * 20;
                    target.y += ny * 20;
                    if(target.x <= 0 || target.x + SPRITE_SIZE >= canvas.width ||
                       target.y <= 0 || target.y + SPRITE_SIZE >= canvas.height){
                        target.x = Math.max(0, Math.min(canvas.width - SPRITE_SIZE, target.x));
                        target.y = Math.max(0, Math.min(canvas.height - SPRITE_SIZE, target.y));
                        target.stunFrames = 300;
                        target.stunTextFrames = 60;
                        playBellSound();
                        this.comboStep = 2;
                        this.comboTimer = 0;
                    }
                }
            } else if(this.comboStep === 2){
                if(target && target.alive){
                    const dx = target.x - this.x;
                    const dy = target.y - this.y;
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    this.x += (dx / dist) * 10;
                    this.y += (dy / dist) * 10;
                    if(dist < this.attackRange){
                        this.comboStep = 3;
                        this.comboTimer = 0;
                        this.comboAttackCount = 0;
                    }
                }
            } else if(this.comboStep === 3){
                if(target && target.alive && this.comboTimer <= 0){
                    playCatHissSound();
                    target.takeDamage(this.damage * 0.4, false);
                    this.comboAttackCount++;
                    this.comboTimer = 24;
                    if(this.comboAttackCount >= 5){
                        this.comboMode = false;
                        this.attackCooldown = 60;
                        const dx = target.x - this.x;
                        const dy = target.y - this.y;
                        const dist = Math.max(1, Math.hypot(dx, dy));
                        const nx = dx / dist;
                        const ny = dy / dist;
                        this.x -= nx * 50;
                        this.y -= ny * 50;
                        this.vx = -nx * this.speed * 2;
                        this.vy = -ny * this.speed * 2;
                        this.x = Math.max(0, Math.min(canvas.width - SPRITE_SIZE, this.x));
                        this.y = Math.max(0, Math.min(canvas.height - SPRITE_SIZE, this.y));
                    }
                }
            }
            return;
        }

        if(this.hasCharge && !this.chargeMode){
            this.energy += 100 / 960;
            const speedProgress = this.energy / 100;
            this.speed = this.baseSpeed + (this.skillSpeed - this.baseSpeed) * speedProgress;
            
            if(this.energy >= 100){
                this.energy = 0;
                this.speed = this.baseSpeed;
                let target = null;
                let minDist = Infinity;
                for(let f of fighters){
                    if(!f.alive || f.team === this.team) continue;
                    const d = Math.hypot(f.x - this.x, f.y - this.y);
                    if(d < minDist){ minDist = d; target = f; }
                }
                if(target){
                    this.chargeMode = true;
                    this.chargeStep = 0;
                    this.chargeTimer = 120;
                    this.chargeTarget = target;
                    this.chargeDragStartX = target.x;
                    this.chargeDragStartY = target.y;
                    playFeiduduSound();
                    this.img = this.attackImg;
                }
            }
        }

        if(this.chargeMode){
            this.chargeTimer--;
            const target = this.chargeTarget;
            
            if(this.chargeStep === 0){
                if(this.chargeTimer <= 0){
                    this.chargeStep = 1;
                    this.chargeTimer = 0;
                }
            } else if(this.chargeStep === 1){
                if(target && target.alive){
                    const dx = target.x - this.x;
                    const dy = target.y - this.y;
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    this.x += (dx / dist) * 7.5;
                    this.y += (dy / dist) * 7.5;
                    
                    if(dist < 80){
                        this.chargeStep = 2;
                        target.stunFrames = 999;
                        target.stunTextFrames = 60;
                        target.vx = 0;
                        target.vy = 0;
                    }
                }
            } else if(this.chargeStep === 2){
                if(target && target.alive){
                    target.stunFrames = 999;
                    target.stunTextFrames = 60;
                    
                    const dx = target.x - this.x;
                    const dy = target.y - this.y;
                    const dist = Math.max(1, Math.hypot(dx, dy));
                    const nx = dx / dist;
                    const ny = dy / dist;
                    
                    this.x += nx * 6;
                    this.y += ny * 6;
                    
                    target.x = this.x + nx * (SPRITE_SIZE * 0.7);
                    target.y = this.y + ny * (SPRITE_SIZE * 0.7);
                    
                    target.hp -= this.damage * 0.1;
                    target.damageTexts.push({
                        text: `- ${Math.ceil(this.damage * 0.1)} 血量`,
                        x: target.x + SPRITE_SIZE/2,
                        y: target.y - 20,
                        frames: 90
                    });
                    if(target.hp <= 0){
                        target.hp = 0;
                        target.alive = false;
                    }
                    
                    if(target.x <= 0 || target.x + SPRITE_SIZE >= canvas.width ||
                       target.y <= 0 || target.y + SPRITE_SIZE >= canvas.height){
                        target.x = Math.max(0, Math.min(canvas.width - SPRITE_SIZE, target.x));
                        target.y = Math.max(0, Math.min(canvas.height - SPRITE_SIZE, target.y));
                        
                        const dragDist = Math.hypot(target.x - this.chargeDragStartX, target.y - this.chargeDragStartY);
                        const maxDist = Math.hypot(canvas.width, canvas.height);
                        target.stunFrames = Math.floor((dragDist / maxDist) * 600);
                        target.stunTextFrames = 60;
                        
                        playBellSound();
                        target.takeDamage(this.damage, false);
                        this.chargeMode = false;
                        this.chargeStep = 0;
                        this.chargeTarget = null;
                        this.chargeCooldown = 420;
                        this.energy = 0;
                        this.pauseFrames = 60;
                        this.img = this.normalImg;
                        this.speed = this.baseSpeed;
                    }
                }
            }
            return;
        }

        if(this.attackCooldown > 0){
            this.attackCooldown--;
        }

        if(this.attackDisplayFrames > 0){
            this.attackDisplayFrames--;
            this.img = this.attackImg;
        }
        if(this.attackImageFrames > 0){
            this.attackImageFrames--;
            this.img = this.attackImg;
        }

        if(this.burnFrames > 0){
            this.burnFrames--;
            this.burnTickCounter++;
            if(this.burnTickCounter >= 60){
                this.burnTickCounter = 0;
                this.hp -= this.burnTickDamage;
                this.damageTexts.push({
                    text: `- ${this.burnTickDamage} 血量（灼烧）`,
                    x: this.x + SPRITE_SIZE/2,
                    y: this.y - 20,
                    frames: 90
                });
                if(this.hp <= 0){
                    this.hp = 0;
                    this.alive = false;
                    for(let f of fighters){
                        if(f.alive && f.name === '大狗嚼' && f.team !== this.team){
                            f.hp = Math.min(f.maxHp, f.hp + 100);
                            f.healTexts.push({
                                text: `+ 100 血量`,
                                x: f.x + SPRITE_SIZE/2,
                                y: f.y - 20,
                                frames: 120
                            });
                            break;
                        }
                    }
                    return;
                }
            }
        }

        if(this.isMjChong){
            this.mjAttackInterval--;
            if(this.mjAttackInterval <= 0){
                let target = null;
                let minDist = Infinity;
                for(let f of fighters){
                    if(!f.alive || f.team === this.team) continue;
                    const d = Math.hypot(f.x - this.x, f.y - this.y);
                    if(d < minDist){ minDist = d; target = f; }
                }
                if(target){
                    const mjBulletAudio = new Audio('/mp3/mjzidan.mp3');
                    mjBulletAudio.volume = 0.2;
                    mjBulletAudio.play();  
                    
                    bullets.push(new Bullet(
                        this.x + SPRITE_SIZE/2, this.y + SPRITE_SIZE/2,
                        target.x + SPRITE_SIZE/2, target.y + SPRITE_SIZE/2,
                        this.damage, true, null, this.team, true
                    ));
                    this.mjAttackInterval = Math.max(20, 250 * Math.pow(0.975, this.mjHitCount));
                    this.mjHitCount++;
                }
            }
        }

        if(this.attackType === 'melee'){
            this.chaseTimer++;
            const meleeCount = fighters.filter(f => f.alive && f.attackType === 'melee').length;
            if(meleeCount === 1){
                if(this.chaseTimer > 840){
                    this.chaseToEnemy();
                }
            } else if(meleeCount === 2){
                const shouldChase = (chaseTurn === 1 && this.team === 'A') || 
                                    (chaseTurn === 2 && this.team === 'B');
                if(shouldChase && this.chaseTimer > 840){
                    this.chaseToEnemy();
                }
            }
        }

        const charmedMult = this.charmedFrames > 0 ? 0.5 : 1;
        if(this.hasCharge && !this.chargeMode){
            const speedMult = (1 + (this.energy / 100) * 0.8) * charmedMult;
            this.x += this.vx * speedMult;
            this.y += this.vy * speedMult;
        } else {
            this.x += this.vx * charmedMult;
            this.y += this.vy * charmedMult;
        }

        if(this.x <= 0 || this.x + SPRITE_SIZE >= canvas.width){
            this.vx *= -1;
        }
        if(this.y <= 0 || this.y + SPRITE_SIZE >= canvas.height){
            this.vy *= -1;
        }
        this.x = Math.max(0, Math.min(canvas.width - SPRITE_SIZE, this.x));
        this.y = Math.max(0, Math.min(canvas.height - SPRITE_SIZE, this.y));
    }

    chaseToEnemy(){
        let target = null;
        let minDist = Infinity;
        for(let f of fighters){
            if(f === this || f.team === this.team || !f.alive) continue;
            const d = Math.hypot(f.x - this.x, f.y - this.y);
            if(d < minDist){
                minDist = d;
                target = f;
            }
        }
        if(target){
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.max(1, Math.hypot(dx, dy));
            this.x += (dx / dist) * this.speed * 1.05;
            this.y += (dy / dist) * this.speed * 1.05;
        }
    }

    draw(){
        if(!this.alive) return;
        
        let nearestEnemy = null;
        let nearestDist = Infinity;
        for(let f of fighters){
            if(f === this || f.team === this.team || !f.alive) continue;
            const dist = Math.hypot(f.x - this.x, f.y - this.y);
            if(dist < nearestDist){
                nearestDist = dist;
                nearestEnemy = f;
            }
        }
        
        ctx.save();
        if(this.charmedFrames > 0){
            ctx.translate(this.x + SPRITE_SIZE/2, this.y + SPRITE_SIZE/2);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(this.img, -SPRITE_SIZE/2, -SPRITE_SIZE/2, SPRITE_SIZE, SPRITE_SIZE);
        } else if(nearestEnemy && nearestEnemy.x < this.x){
            ctx.translate(this.x + SPRITE_SIZE, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(this.img, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
        } else {
            ctx.drawImage(this.img, this.x, this.y, SPRITE_SIZE, SPRITE_SIZE);
        }
        ctx.restore();
        
        if(this.cloneMode && this.clones.length > 0){
            const cloneImg = new Image();
            cloneImg.src = this.nailongStage === 0 ? 
                '/assets/nailonglaugh.png' : '/assets/nailongjinhualaugh.png';
            for(let c of this.clones){
                ctx.drawImage(cloneImg, c.x, c.y, SPRITE_SIZE, SPRITE_SIZE);
            }
        }
        
        this.drawTeamLabel();
        this.drawHpBar();
        this.drawDamageTexts();
        this.drawHealTexts();
        this.drawStunText();
        
        if(this.isMjChong){
            const barX = this.x;
            const barY = this.y + SPRITE_SIZE + 15;
            ctx.fillStyle = "#333";
            ctx.fillRect(barX, barY, SPRITE_SIZE, 8);
            ctx.fillStyle = "#ffd700";
            ctx.fillRect(barX, barY, SPRITE_SIZE * this.mjSummonProgress, 8);
        }

        if(this.hasCharge){
            const barX = this.x;
            const barY = this.y + SPRITE_SIZE + 10;
            ctx.fillStyle = "#333";
            ctx.fillRect(barX, barY, SPRITE_SIZE, 6);
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(barX, barY, SPRITE_SIZE * (this.energy / 100), 6);
        }

        if(this.charmedFrames > 0){
            const px = this.x + SPRITE_SIZE/2;
            const py = this.y - 50;
            const alpha = Math.min(1, this.charmedFrames / 60);
            ctx.save();
            ctx.fillStyle = `rgba(255, 105, 180, ${alpha})`;
            ctx.font = "bold 35px system-ui";
            ctx.textAlign = "center";
            ctx.fillText("💕魅惑", px, py);
            ctx.restore();
        }
    }

    drawTeamLabel(){
        const px = this.x + SPRITE_SIZE/2;
        const py = this.y - 10;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(this.teamLabel, px, py);
    }

    drawHpBar(){
        const barW = 90;
        const barH = 24;
        const crossLen = 80;
        const crossW = 28;
        const px = this.x + SPRITE_SIZE/2;
        const centerY = this.y + SPRITE_SIZE/2;
        const isUpperHalf = centerY < canvas.height / 2;
        const barY = isUpperHalf ? this.y + SPRITE_SIZE + 10 : this.y - 90;
        const hpRatio = Math.max(0, this.hp / this.maxHp);
        
        ctx.fillStyle = "#222";
        ctx.fillRect(px - barW/2, barY - barH/2, barW, barH);
        const verticalWhiteTop = barY + crossLen/2 - crossLen * hpRatio;
        const horizontalBarTop = barY - barH/2;
        let horizontalWhiteHeight;
        if (verticalWhiteTop <= horizontalBarTop) {
            horizontalWhiteHeight = barH;
        } else if (verticalWhiteTop >= horizontalBarTop + barH) {
            horizontalWhiteHeight = 0;
        } else {
            horizontalWhiteHeight = (horizontalBarTop + barH) - verticalWhiteTop;
        }
        if (horizontalWhiteHeight > 0) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(px - barW/2, barY + barH/2 - horizontalWhiteHeight, barW, horizontalWhiteHeight);
        }
        ctx.fillStyle = "#222";
        ctx.fillRect(px - crossW/2, barY - crossLen/2, crossW, crossLen);
        ctx.fillStyle = "#fff";
        ctx.fillRect(px - crossW/2, barY + crossLen/2 - crossLen * hpRatio, crossW, crossLen * hpRatio);
        const numberY = barY + 4;
        const whiteTop = barY + barH/2 - horizontalWhiteHeight;
        const whiteBottom = barY + barH/2;
        if(numberY >= whiteTop && numberY <= whiteBottom){
            ctx.fillStyle = "#000";
        } else {
            ctx.fillStyle = "#fff";
        }
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${Math.ceil(this.hp)}`, px, barY + 4);
    }
    
    drawDamageTexts(){
        for(let i = this.damageTexts.length - 1; i >= 0; i--){
            const dt = this.damageTexts[i];
            dt.y -= 0.3;
            dt.frames--;
            const alpha = dt.frames / 120;
            ctx.fillStyle = `rgba(180, 0, 0, ${alpha})`;
            ctx.font = "14px system-ui";
            ctx.textAlign = "center";
            ctx.fillText(dt.text, dt.x, dt.y);
            if(dt.frames <= 0){
                this.damageTexts.splice(i, 1);
            }
        }
    }

    drawHealTexts(){
        for(let i = this.healTexts.length - 1; i >= 0; i--){
            const ht = this.healTexts[i];
            ht.y -= 0.3;
            ht.frames--;
            const alpha = ht.frames / 120;
            ctx.fillStyle = `rgba(0, 180, 0, ${alpha})`;
            ctx.font = "14px system-ui";
            ctx.textAlign = "center";
            ctx.fillText(ht.text, ht.x, ht.y);
            if(ht.frames <= 0){
                this.healTexts.splice(i, 1);
            }
        }
    }

    drawStunText(){
        if(this.stunFrames > 0){
            const px = this.x + SPRITE_SIZE/2;
            const py = this.y - 50;
            const alpha = this.stunFrames > 120 ? 1 : (this.stunFrames - 60) / 60;
            
            ctx.save();
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.font = "bold 35px system-ui";
            ctx.textAlign = "center";
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 8;
            ctx.fillText("⚡眩晕", px, py);
            ctx.restore();
        }
    }

    takeDamage(dmg, isBurn){
        if(!this.alive) return;
        if(this.evolving) return;
        if(this.chargeMode) return;
        if(this.cloneMode) return;
        console.log(`${this.name} 受到 ${dmg} 伤害`);
        this.hp -= dmg;
        
        if(this.hasNailong && !this.cloneMode && !this.evolving){
            this.hitCount++;
            if(this.hitCount >= 5){
                this.startCloneAttack();
            }
        }
        this.damageTexts.push({
            text: isBurn ? `- ${dmg} 血量（灼烧）` : `- ${dmg} 血量`,
            x: this.x + SPRITE_SIZE/2,
            y: this.y - 20,
            frames: 90
        });
        if(this.hp <= 0){
            this.hp = 0;
            this.alive = false;
        }
    }

    applyBurn(damage, durationSeconds){
        this.burnTickDamage = damage;
        this.burnFrames = durationSeconds * 60;
        this.burnTickCounter = 0;
    }

    startCloneAttack(){
        this.cloneMode = true;
        this.clonePhase = 0;
        this.cloneTimer = 120;
        this.originalX = this.x;
        this.originalY = this.y;
        this.hitCount = 0;
        
        this.img = new Image();
        this.img.src = this.nailongStage === 0 ? 
            '/assets/nailonglaugh.png' : '/assets/nailongjinhualaugh.png';
        playNailongLaughSound();
        let target = null;
        let minDist = Infinity;
        for(let f of fighters){
            if(!f.alive || f.team === this.team) continue;
            const d = Math.hypot(f.x - this.x, f.y - this.y);
            if(d < minDist){ minDist = d; target = f; }
        }
        this.cloneTarget = target;
        
        this.clones = [];
        for(let i = 0; i < 10; i++){
            this.clones.push({
                x: this.x + Math.random() * 300 - 150,
                y: this.y + Math.random() * 300 - 150
            });
        }
        
        if(target){
            target.charmedFrames = 300;
            target.charmTextFrames = 60;
        }
    }

    getCenter(){
        return {
            x: this.x + SPRITE_SIZE/2,
            y: this.y + SPRITE_SIZE/2
        };
    }
}