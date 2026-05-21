const GAME_WIDTH = 360;
const GAME_HEIGHT = 540;
const MAX_HP = 100;

const ICECREAM_TYPES = [
  { key: "slow", weight: 0.4, speed: 120, damage: 10 },
  { key: "medium", weight: 0.3, speed: 170, damage: 10 },
  { key: "fast", weight: 0.2, speed: 230, damage: 10 },
  { key: "damage", weight: 0.1, speed: 180, damage: 30 },
];

const POWERUP_TYPES = [
  { key: "mouthwash", weight: 0.45, effect: "invincible", amount: 0 },
  { key: "toothbrush", weight: 0.45, effect: "heal", amount: 20 },
  { key: "shield", weight: 0.1, effect: "heal", amount: 50 },
];

const rand = (min, max) => Math.random() * (max - min) + min;

const pickWeighted = (list) => {
  const total = list.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of list) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return list[list.length - 1];
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

const createSpriteData = (img, width, height) => {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;
  return { width, height, data };
};

const pixelPerfectCollision = (a, b) => {
  const ax1 = a.x;
  const ay1 = a.y;
  const ax2 = a.x + a.w;
  const ay2 = a.y + a.h;
  const bx1 = b.x;
  const by1 = b.y;
  const bx2 = b.x + b.w;
  const by2 = b.y + b.h;

  const ox1 = Math.max(ax1, bx1);
  const oy1 = Math.max(ay1, by1);
  const ox2 = Math.min(ax2, bx2);
  const oy2 = Math.min(ay2, by2);

  if (ox2 <= ox1 || oy2 <= oy1) return false;

  const aData = a.sprite.data;
  const bData = b.sprite.data;
  const aW = a.sprite.width;
  const bW = b.sprite.width;

  for (let y = Math.floor(oy1); y < Math.floor(oy2); y++) {
    const ay = y - Math.floor(ay1);
    const by = y - Math.floor(by1);
    for (let x = Math.floor(ox1); x < Math.floor(ox2); x++) {
      const ax = x - Math.floor(ax1);
      const bx = x - Math.floor(bx1);
      const aIndex = (ay * aW + ax) * 4 + 3;
      const bIndex = (by * bW + bx) * 4 + 3;
      if (aData[aIndex] > 0 && bData[bIndex] > 0) {
        return true;
      }
    }
  }

  return false;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const createGame = async ({
  canvas,
  leftButton,
  rightButton,
  onState,
}) => {
  const ctx = canvas.getContext("2d", { alpha: true });
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = GAME_WIDTH * dpr;
  canvas.height = GAME_HEIGHT * dpr;
  canvas.style.width = `${GAME_WIDTH}px`;
  canvas.style.height = `${GAME_HEIGHT}px`;
  ctx.scale(dpr, dpr);

  const assets = {
    tooth: {
      regular: await loadImage("/tooth/regular.png"),
      left: await loadImage("/tooth/left.png"),
      right: await loadImage("/tooth/right.png"),
      hurt: await loadImage("/tooth/hurt.png"),
      low: await loadImage("/tooth/low.png"),
    },
    icecream: {
      slow: await loadImage("/icecream/slow.png"),
      medium: await loadImage("/icecream/medium.png"),
      fast: await loadImage("/icecream/fast.png"),
      damage: await loadImage("/icecream/damage.png"),
    },
    powerups: {
      mouthwash: await loadImage("/powerups/mouthwash.png"),
      toothbrush: await loadImage("/powerups/toothbrush.png"),
      shield: await loadImage("/powerups/shield.png"),
    },
  };

  const toothSize = 56;
  const icecreamSize = 40;
  const powerupSize = 32;

  const toothSprites = {
    regular: createSpriteData(assets.tooth.regular, toothSize, toothSize),
    left: createSpriteData(assets.tooth.left, toothSize, toothSize),
    right: createSpriteData(assets.tooth.right, toothSize, toothSize),
    hurt: createSpriteData(assets.tooth.hurt, toothSize, toothSize),
    low: createSpriteData(assets.tooth.low, toothSize, toothSize),
  };

  const icecreamSprites = {
    slow: createSpriteData(assets.icecream.slow, icecreamSize, icecreamSize),
    medium: createSpriteData(assets.icecream.medium, icecreamSize, icecreamSize),
    fast: createSpriteData(assets.icecream.fast, icecreamSize, icecreamSize),
    damage: createSpriteData(assets.icecream.damage, icecreamSize, icecreamSize),
  };

  const powerupSprites = {
    mouthwash: createSpriteData(assets.powerups.mouthwash, powerupSize, powerupSize),
    toothbrush: createSpriteData(assets.powerups.toothbrush, powerupSize, powerupSize),
    shield: createSpriteData(assets.powerups.shield, powerupSize, powerupSize),
  };

  const state = {
    score: 0,
    highScore: Number(localStorage.getItem("tooth-dodge-highscore")) || 0,
    newHighScore: false,
    hp: MAX_HP,
    isGameOver: false,
  };

  const player = {
    x: GAME_WIDTH / 2 - toothSize / 2,
    y: GAME_HEIGHT - toothSize - 24,
    w: toothSize,
    h: toothSize,
    speed: 260,
    vx: 0,
    invincibleUntil: 0,
    hurtUntil: 0,
  };

  let icecreams = [];
  let powerups = [];
  let lastTime = performance.now();
  let elapsed = 0;
  let nextSpawnTime = lastTime + rand(220, 520);
  let nextPowerupTime = lastTime + rand(3000, 6000);
  let animationId;

  const input = { left: false, right: false };

  const setInput = (dir, value) => {
    input[dir] = value;
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") setInput("left", true);
    if (e.key === "ArrowRight" || e.key === "d") setInput("right", true);
    if (state.isGameOver && e.key.toLowerCase() === "r") restart();
  };
  const onKeyUp = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") setInput("left", false);
    if (e.key === "ArrowRight" || e.key === "d") setInput("right", false);
  };

  const bindHold = (el, dir) => {
    const down = (e) => {
      e.preventDefault();
      setInput(dir, true);
    };
    const up = (e) => {
      e.preventDefault();
      setInput(dir, false);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointerleave", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointerleave", up);
      el.removeEventListener("pointercancel", up);
    };
  };

  const getPlayerSpriteKey = () => {
    if (state.hp < 20) return "low";
    if (performance.now() < player.hurtUntil) return "hurt";
    if (input.left && !input.right) return "left";
    if (input.right && !input.left) return "right";
    return "regular";
  };

  const spawnIcecream = () => {
    const type = pickWeighted(ICECREAM_TYPES);
    const x = rand(12, GAME_WIDTH - icecreamSize - 12);
    icecreams.push({
      type: type.key,
      x,
      y: -icecreamSize,
      w: icecreamSize,
      h: icecreamSize,
      speed: type.speed,
      damage: type.damage,
      sprite: icecreamSprites[type.key],
    });
  };

  const spawnPowerup = () => {
    const type = pickWeighted(POWERUP_TYPES);
    const x = rand(12, GAME_WIDTH - powerupSize - 12);
    powerups.push({
      type: type.key,
      x,
      y: -powerupSize,
      w: powerupSize,
      h: powerupSize,
      speed: 140,
      sprite: powerupSprites[type.key],
      effect: type.effect,
      amount: type.amount,
    });
  };

  const applyPowerup = (item) => {
    if (item.effect === "invincible") {
      player.invincibleUntil = performance.now() + 5000;
    } else if (item.effect === "heal") {
      state.hp = clamp(state.hp + item.amount, 0, MAX_HP);
    }
  };

  const updateDifficulty = (delta) => {
    elapsed += delta;
  };

  const updateSpawnTimers = (now) => {
    const difficulty = Math.min(1, elapsed / 60000);
    const maxDelay = clamp(600 - difficulty * 250, 260, 600);
    const minDelay = clamp(maxDelay - 280, 200, maxDelay - 80);

    if (now >= nextSpawnTime) {
      spawnIcecream();
      nextSpawnTime = now + rand(minDelay, maxDelay);
    }

    if (now >= nextPowerupTime) {
      spawnPowerup();
      nextPowerupTime = now + rand(3200, 6500);
    }
  };

  const updatePlayer = (delta) => {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const target = dir * player.speed;
    player.vx = player.vx + (target - player.vx) * 0.2;
    player.x += player.vx * delta;
    player.x = clamp(player.x, 8, GAME_WIDTH - player.w - 8);
  };

  const updateIcecreams = (delta) => {
    const speedMultiplier = 1 + Math.min(2.5, elapsed / 35000);
    const remaining = [];
    for (const ice of icecreams) {
      ice.y += ice.speed * speedMultiplier * delta;
      if (ice.y > GAME_HEIGHT + ice.h) {
        state.score += 10;
      } else {
        remaining.push(ice);
      }
    }
    icecreams = remaining;
  };

  const updatePowerups = (delta) => {
    const remaining = [];
    for (const item of powerups) {
      item.y += item.speed * delta;
      if (item.y <= GAME_HEIGHT + item.h) {
        remaining.push(item);
      }
    }
    powerups = remaining;
  };

  const checkCollisions = () => {
    const playerSprite = toothSprites[getPlayerSpriteKey()];
    const playerBox = {
      x: player.x,
      y: player.y,
      w: player.w,
      h: player.h,
      sprite: playerSprite,
    };

    const remainingIce = [];
    for (const ice of icecreams) {
      if (pixelPerfectCollision(playerBox, ice)) {
        if (performance.now() > player.invincibleUntil) {
          state.hp = clamp(state.hp - ice.damage, 0, MAX_HP);
          player.hurtUntil = performance.now() + 200;
        }
      } else {
        remainingIce.push(ice);
      }
    }
    icecreams = remainingIce;

    const remainingPowerups = [];
    for (const item of powerups) {
      if (pixelPerfectCollision(playerBox, item)) {
        applyPowerup(item);
      } else {
        remainingPowerups.push(item);
      }
    }
    powerups = remainingPowerups;
  };

  const draw = () => {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    for (const ice of icecreams) {
      ctx.drawImage(
        assets.icecream[ice.type],
        ice.x,
        ice.y,
        ice.w,
        ice.h
      );
    }

    for (const item of powerups) {
      ctx.drawImage(
        assets.powerups[item.type],
        item.x,
        item.y,
        item.w,
        item.h
      );
    }

    const spriteKey = getPlayerSpriteKey();
    const isInvincible = performance.now() < player.invincibleUntil;
    if (isInvincible) {
      ctx.save();
      ctx.shadowColor = "rgba(110, 200, 255, 0.85)";
      ctx.shadowBlur = 18;
    }

    ctx.drawImage(
      assets.tooth[spriteKey],
      player.x,
      player.y,
      player.w,
      player.h
    );

    if (isInvincible) {
      ctx.restore();
    }

    if (performance.now() < player.hurtUntil) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#ff3b3b";
      ctx.fillRect(player.x, player.y, player.w, player.h);
      ctx.restore();
    }
  };

  const updateState = () => {
    if (state.score > state.highScore) {
      state.highScore = state.score;
      state.newHighScore = true;
      localStorage.setItem("tooth-dodge-highscore", String(state.highScore));
    }
    onState?.({
      score: state.score,
      highScore: state.highScore,
      hp: state.hp,
      isGameOver: state.isGameOver,
      newHighScore: state.newHighScore,
    });
  };

  const tick = (now) => {
    const delta = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;

    if (state.isGameOver) {
      draw();
      updateState();
      animationId = requestAnimationFrame(tick);
      return;
    }

    updateDifficulty(delta * 1000);
    updateSpawnTimers(now);
    updatePlayer(delta);
    updateIcecreams(delta);
    updatePowerups(delta);
    checkCollisions();
    if (state.hp <= 0) {
      state.isGameOver = true;
    }
    draw();
    updateState();

    animationId = requestAnimationFrame(tick);
  };

  const restart = () => {
    state.score = 0;
    state.hp = MAX_HP;
    state.isGameOver = false;
    state.newHighScore = false;
    player.x = GAME_WIDTH / 2 - toothSize / 2;
    player.y = GAME_HEIGHT - toothSize - 24;
    player.vx = 0;
    player.hurtUntil = 0;
    player.invincibleUntil = 0;
    icecreams = [];
    powerups = [];
    elapsed = 0;
    const now = performance.now();
    lastTime = now;
    nextSpawnTime = now + rand(220, 520);
    nextPowerupTime = now + rand(3000, 6000);
  };

  const handleRestart = (e) => {
    if (!state.isGameOver) return;
    e.preventDefault();
    restart();
  };

  const cleanupLeft = bindHold(leftButton, "left");
  const cleanupRight = bindHold(rightButton, "right");
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("pointerdown", handleRestart);

  animationId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(animationId);
    cleanupLeft();
    cleanupRight();
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    canvas.removeEventListener("pointerdown", handleRestart);
  };
};
