let fighters = [];
let battleMode = 0;
let modeTimer = 0;
let winnerName = null;
let chaseTurn = 0;

function initFighters(){
    fighters = [];
    bullets = [];
    battleMode = 0;
    modeTimer = 0;
    winnerName = null;
    chaseTurn = 0;
    
    for(const [name, count] of Object.entries(selectedA)){
        for(let i = 0; i < count; i++){
            fighters.push(new Fighter({...ROLE_DATABASE[name], name}, "A"));
        }
    }
    for(const [name, count] of Object.entries(selectedB)){
        for(let i = 0; i < count; i++){
            fighters.push(new Fighter({...ROLE_DATABASE[name], name}, "B"));
        }
    }
}

function gameLoop(){
    ctx.fillStyle = "#3498db";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    modeTimer++;
    if(modeTimer >= 480){
        modeTimer = 0;
        battleMode = 1;
    }

    fighters.forEach(f => f.update());
    
    // 更新子弹
    bullets.forEach(b => b.update());
    
    // 子弹命中检测
    for(let b of bullets){
        if(!b.alive) continue;
        
        for(let f of fighters){
            if(!f.alive || f.team === b.team) continue;
            const dist = Math.hypot(f.x + SPRITE_SIZE/2 - b.x, f.y + SPRITE_SIZE/2 - b.y);
            if(dist < 40){
                console.log(`子弹击中 ${f.name}，伤害 ${b.damage}`);
                f.takeDamage(b.damage, false);
                b.alive = false;
                
                // mj虫二命中计数
                if(b.isMjText){
                    const mj = fighters.find(f2 => f2.isMjChong && f2.team === b.team && f2.alive);
                    if(mj){
                        mj.mjSummonProgress += 0.2;
                        // mj子弹命中回1血
                        mj.hp = Math.min(mj.maxHp, mj.hp + 1);
                        mj.healTexts.push({
                            text: `+ 1 血量`,
                            x: mj.x + SPRITE_SIZE/2,
                            y: mj.y - 40,
                            frames: 60
                        });                        
                        if(mj.mjSummonProgress >= 1){
                            mj.mjSummonProgress = 0;
                            const type = Math.random() < 0.5 ? 'melee' : 'ranged';
                            const configKey = type === 'melee' ? '召唤物近战' : '召唤物远程';
                            const summonConfig = {...SUMMON_DATABASE[configKey], name: configKey};
                            fighters.push(new Fighter(summonConfig, mj.team));
                            console.log('召唤物已创建，fighters数量:', fighters.length);
                            const newSummon = fighters[fighters.length - 1];
                            newSummon.x = mj.x;
                            newSummon.y = mj.y;
                            newSummon.vx = (Math.random() - 0.5) * 2;
                            newSummon.vy = (Math.random() - 0.5) * 2;
                            
                            // 出场音效
                            if(type === 'melee'){
                                const audio = new Audio('/mp3/mjjin.mp3');
                                audio.volume = 0.9;
                                audio.play();
                            } else {
                                const audio = new Audio('/mp3/mjyuan.mp3');
                                audio.volume = 0.7;
                                audio.play();
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    
    bullets = bullets.filter(b => b.alive);

    fighters.forEach(f => {
        if(!f.comboMode && !f.chargeMode){
            f.img = f.normalImg;
        }
    });

    const attacks = [];

    for(let a of fighters){
        if(!a.alive || a.comboMode || a.isMjChong || a.hasCharge) continue;
        
        // 远程召唤物走子弹逻辑，不走普通攻击
        // 远程召唤物走子弹逻辑，不走普通攻击
        if(a.name === '召唤物远程'){
            if(a.attackCooldown === 0){
                let target = null;
                let minDist = Infinity;
                for(let f of fighters){
                    if(!f.alive || f.team === a.team) continue;
                    const d = Math.hypot(f.x - a.x, f.y - a.y);
                    if(d < minDist){
                        minDist = d;
                        target = f;
                    }
                }
                if(target){
                    playBubbleSound();
                    
                    bullets.push(new Bullet(
                        a.x + SPRITE_SIZE/2, a.y + SPRITE_SIZE/2,
                        target.x + SPRITE_SIZE/2, target.y + SPRITE_SIZE/2,
                        a.damage, false, '/assets/mj3.png', a.team
                    ));
                    a.attackCooldown = 120;
                }
            }
            continue;
        }
        // 近战：优先攻击最近的敌人
        if(a.attackType === 'melee'){
            let closestEnemy = null;
            let closestDist = Infinity;
            let inRangeEnemy = null;
            let inRangeDist = Infinity;
            
            for(let b of fighters){
                if(!b.alive) continue;
                if(a.team === b.team) continue;
                
                const p1 = a.getCenter();
                const p2 = b.getCenter();
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                
                if(dist < closestDist){
                    closestDist = dist;
                    closestEnemy = b;
                }
                
                // 优先找已经在攻击范围内的
                if(dist < a.attackRange && dist < inRangeDist){
                    inRangeDist = dist;
                    inRangeEnemy = b;
                }
            }
            
            // 如果有攻击范围内的，打范围内的；否则追最近的
            const target = inRangeEnemy || closestEnemy;
            const targetDist = inRangeEnemy ? inRangeDist : closestDist;
            
            if(target){
                const p1 = a.getCenter();
                const p2 = target.getCenter();
                
                if(a.displayAttackRange && targetDist < a.displayAttackRange){
                    a.img = a.attackImg;
                    a.attackImageFrames = 60;
                }
                
                if(battleMode === 1 && a.pauseFrames === 0 && target.pauseFrames === 0 && targetDist > a.attackRange && targetDist < a.attackRange * 1.5){
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const distance = Math.max(1, targetDist);
                    a.x += (dx / distance) * 1.1;
                    a.y += (dy / distance) * 1.1;
                }
                
                if(targetDist < a.attackRange && a.attackCooldown === 0){
                    attacks.push({ a, b: target, dist: targetDist, p1, p2 });
                }
            }
        } else {
            // 远程：原有逻辑
            for(let b of fighters){
                if(!b.alive) continue;
                if(a.team === b.team) continue;
                
                const p1 = a.getCenter();
                const p2 = b.getCenter();
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                
                if(dist < a.attackRange && a.attackCooldown === 0){
                    attacks.push({ a, b, dist, p1, p2 });
                }
            }
        }
    }
    
    for(const attack of attacks){
        const { a, b, dist, p1, p2 } = attack;
        let actualDamage = a.damage;
        a.attackCount++;
        
        if(a.hasCombo && a.attackCount >= 4){
            a.comboMode = true;
            a.comboStep = 0;
            a.comboTimer = 60;
            a.comboTarget = b;
            a.comboAttackCount = 0;
            a.attackCount = 0;
            a.img = a.attackImg;
            continue;
        }
        if(a.hasCharge && a.attackCount >= 3){
            a.chargeMode = true;
            a.chargeStep = 0;
            a.chargeTimer = 120;
            a.chargeTarget = b;
            a.attackCount = 0;
            playFeiduduSound();
            a.img = a.attackImg;
            continue;
        }
        
        if(EVOLUTION_DATABASE[a.name] && a.attackCount >= 5 && a.evolveStage === 0){
            const evo = EVOLUTION_DATABASE[a.name].stage1;
            a.evolveStage = 1;
            playDogEvolveSound();
            a.normalImg = new Image();
            a.normalImg.src = evo.normalImg;
            a.attackImg = new Image();
            a.attackImg.src = evo.attackImg;
            a.img = a.normalImg;
            a.attackCount = 0;
            a.damage = evo.damage;
            a.burnDamage = evo.burnDamage;
            a.pauseFrames = 180;
            b.pauseFrames = 180;
            continue;
        } else if(a.evolve2NormalImg && a.attackCount >= 5 && a.evolveStage === 1){
            const evo = EVOLUTION_DATABASE[a.name].stage2;
            a.evolveStage = 2;
            playDogEvolveSound();
            a.normalImg = a.evolve2NormalImg;
            a.attackImg = a.evolve2AttackImg;
            a.img = a.normalImg;
            a.attackCount = 0;
            a.damage = evo.damage;
            a.burnDamage = evo.burnDamage;
            a.pauseFrames = 180;
            b.pauseFrames = 180;
            continue;
        }
        
        actualDamage = a.damage;
        
        if(a.name === '大狗嚼'){
            playDogSound();
        } else if(a.name === '哈基米'){
            playDogSound();
        } else if(a.name === '哈气猫'){
            playCatHissSound();
        }
        
        b.takeDamage(actualDamage, false);
        
        if(a.name === '大狗嚼' && !b.alive && a.alive && a.evolveStage > 0){
            let healAmount = a.evolveStage === 1 ? 20 : 30;
            a.hp = Math.min(a.maxHp, a.hp + healAmount);
            a.healTexts.push({
                text: `+ ${healAmount} 血量`,
                x: a.x + SPRITE_SIZE/2,
                y: a.y - 20,
                frames: 120
            });
        }
        
        // 大狗嚼蓝火阶段每次攻击回20血
        if(a.name === '大狗嚼' && a.evolveStage >= 1 && b.alive){
            const healAmount = a.evolveStage === 1 ? 8 : 12;
            a.hp = Math.min(a.maxHp, a.hp + healAmount);
            a.healTexts.push({
                text: `+ ${healAmount} 血量`,
                x: a.x + SPRITE_SIZE/2,
                y: a.y - 40,
                frames: 90
            });
        }

        if(a.burnDamage > 0 && a.team !== b.team){
            b.applyBurn(a.burnDamage, 5);
        }
        
        a.img = a.attackImg;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.max(1, dist);
        const nx = dx / distance;
        const ny = dy / distance;
        a.x -= nx * 5;
        a.y -= ny * 5;
        b.x += nx * 5;
        b.y += ny * 5;
        a.vx = -nx * a.speed;
        a.vy = -ny * a.speed;
        b.vx = nx * b.speed;
        b.vy = ny * b.speed;

        if(a.attackType === 'ranged'){
            a.attackCooldown = 120;
        } else {
            a.attackCooldown = 60;
        }
        b.attackCooldown = 60;
        a.pauseFrames = 60;
        b.pauseFrames = 60;
        a.attackDisplayFrames = 30;
        b.attackDisplayFrames = 30;
        a.chaseTimer = 0;
        
        if(a.attackType === 'melee'){
            chaseTurn = a.team === 'A' ? 2 : 1;
        }
    }

    bullets.forEach(b => b.draw());

    fighters.forEach(f => f.draw());
    
    if(winnerName){
        ctx.fillStyle = "#000";
        ctx.font = "bold 60px system-ui";
        ctx.textAlign = "center";
        ctx.fillText(`${winnerName} 胜`, canvas.width/2, canvas.height/3);
    }

    const aliveA = fighters.filter(f => f.team === "A" && f.alive).length;
    const aliveB = fighters.filter(f => f.team === "B" && f.alive).length;

    if(aliveA === 0 || aliveB === 0){
        if(aliveA > 0){
            const alive = fighters.filter(f => f.team === "A" && f.alive);
            const uniqueNames = [...new Set(alive.map(f => f.name))];
            if(uniqueNames.length === 1){
                winnerName = uniqueNames[0];
            } else {
                winnerName = uniqueNames.map(n => n[0]).join('');
            }
        } else {
            const alive = fighters.filter(f => f.team === "B" && f.alive);
            const uniqueNames = [...new Set(alive.map(f => f.name))];
            if(uniqueNames.length === 1){
                winnerName = uniqueNames[0];
            } else {
                winnerName = uniqueNames.map(n => n[0]).join('');
            }
        }
        requestAnimationFrame(gameLoop);
        return;
    }

    requestAnimationFrame(gameLoop);
}

document.getElementById("startBtn").addEventListener("click", () => {
    getAudioCtx();
    if(!selectedA || !selectedB){
        alert("请先选择两个队伍！");
        return;
    }
    initFighters();
    document.getElementById("selectArea").style.display = "none";
    document.getElementById("startBtn").style.display = "none";
    requestAnimationFrame(gameLoop);
});
initSelectionUI();
updateTopBar();