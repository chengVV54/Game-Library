// ======================【基础角色】======================
const ROLE_DATABASE = {
    '大狗嚼': {
        normalImg: "/assets/dog-1.png", attackImg: "/assets/dog-2.png",
        hp: 300, speed: 1.8, attackRange: 100, displayAttackRange: 150,
        damage: 25, burnDamage: 0, attackType: 'melee'
    },
    '哈基米': {
        normalImg: "/assets/cat-1.png", attackImg: "/assets/cat-1.png",
        hp: 280, speed: 1.9, attackRange: 100, displayAttackRange: 150,
        damage: 20, burnDamage: 0, attackType: 'ranged'
    },
    '哈气猫': {
        normalImg: "/assets/standcat-1.png", attackImg: "/assets/standcat-2.png",
        hp: 280, speed: 1.7, attackRange: 100, displayAttackRange: 150,
        damage: 22, burnDamage: 0, hasCombo: true, attackType: 'melee'
    },
    'mj虫二': {
        normalImg: "/assets/mj.png", attackImg: "/assets/mj.png",
        hp: 600, speed: 1.6, attackRange: 9999, displayAttackRange: 0,
        damage: 5, burnDamage: 0, attackType: 'special', isMjChong: true
    },
    '训练木桩': {
        normalImg: "/assets/trainwood.png", attackImg: "/assets/trainwood.png",
        hp: 10000, speed: 0, attackRange: 0, displayAttackRange: 0,
        damage: 0, burnDamage: 0, attackType: 'none'
    },
    '美团飞肚肚': {
        normalImg: "/assets/meituanfeidudu.png",
        attackImg: "/assets/meituanqixing.png",
        hp: 400,
        speed: 1.5,
        attackRange: 9999,
        displayAttackRange: 0,
        damage: 20,
        burnDamage: 0,
        attackType: 'special',
        hasCharge: true
    },
    '奶龙': {
        normalImg: "/assets/nailong1.png",
        attackImg: "/assets/nailong2.png",
        hp: 400,
        speed: 1.6,
        attackRange: 100,
        displayAttackRange: 150,
        damage: 20,
        burnDamage: 0,
        attackType: 'melee',
        hasNailong: true
    }
    
};

// ======================【召唤物】======================
const SUMMON_DATABASE = {
    '召唤物近战': {
        normalImg: "/assets/mj2.png", attackImg: "/assets/mj2.png",
        hp: 85, speed: 1.9, attackRange: 100, displayAttackRange: 0,
        damage: 8, burnDamage: 0, attackType: 'melee'
    },
    '召唤物远程': {
        normalImg: "/assets/mj1.png", attackImg: "/assets/mj1.png",
        hp: 60, speed: 1.7, attackRange: 9999, displayAttackRange: 0,
        damage: 10, burnDamage: 0, attackType: 'ranged'
    }
};

// ======================【进化形态】======================
const EVOLUTION_DATABASE = {
    '大狗嚼': {
        stage1: {
            normalImg: "/assets/reddog-1.png",
            attackImg: "/assets/reddog-2.png",
            damage: 30,
            burnDamage: 5
        },
        stage2: {
            normalImg: "/assets/bluedog-1.png",
            attackImg: "/assets/bluedog-2.png",
            damage: 40,
            burnDamage: 8
        }
    }
};

const SPRITE_SIZE = 120;