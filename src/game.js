import { state } from './store.js'

const FIRE_EVERY = 0.5
const BULLET_SPEED = 450
const SPAWN_EVERY = 0.4
const AURA_RADIUS = 120
const ORBIT_RADIUS = 60
const PICKUP_RADIUS = 30
const CONTACT_DAMAGE = 10
const ARROW = [[0, 0], [0, 17], [4, 13], [7, 20], [9, 19], [6, 12], [12, 12]]

const keys = {}
let ctx, raf, last
let player, cursors, bullets, drops, toSpawn, spawnTimer, fireTimer, orbitAngle

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const onKey = e => { keys[e.code] = e.type === 'keydown' }
const resize = () => { ctx.canvas.width = innerWidth; ctx.canvas.height = innerHeight }

export function start(canvas) {
  ctx = canvas.getContext('2d')
  resize()
  player = {
    x: canvas.width / 2, y: canvas.height / 2, r: 18, hurt: 0,
    hp: 100, maxHp: 100, speed: 220, damage: 10, projectiles: 1,
    armor: 1, slow: 0, orbitals: 0, dropMult: 1,
  }
  cursors = []
  bullets = []
  drops = []
  fireTimer = 0
  orbitAngle = 0
  startWave(1)
  addEventListener('keydown', onKey)
  addEventListener('keyup', onKey)
  addEventListener('resize', resize)
  last = performance.now()
  raf = requestAnimationFrame(loop)
}

export function stop() {
  cancelAnimationFrame(raf)
  removeEventListener('keydown', onKey)
  removeEventListener('keyup', onKey)
  removeEventListener('resize', resize)
}

export function pickUpgrade(upgrade) {
  upgrade.apply(player)
  state.upgrades.push(upgrade.name)
  startWave(state.wave + 1)
  state.phase = 'arena'
}

// Wave 1 → 5, 2 → 8, 3 → 12, 4 → 17, ...
function startWave(n) {
  state.wave = n
  toSpawn = (n * n + 3 * n + 6) / 2
  spawnTimer = 0
}

function loop(t) {
  const dt = Math.min((t - last) / 1000, 0.05)
  last = t
  if (state.phase === 'arena') update(dt)
  draw()
  raf = requestAnimationFrame(loop)
}

function update(dt) {
  const { width: W, height: H } = ctx.canvas

  // Move with WASD (e.code is the physical key, so AZERTY works too)
  const dx = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0)
  const dy = (keys.KeyS ? 1 : 0) - (keys.KeyW ? 1 : 0)
  const len = Math.hypot(dx, dy) || 1
  player.x = clamp(player.x + (dx / len) * player.speed * dt, player.r, W - player.r)
  player.y = clamp(player.y + (dy / len) * player.speed * dt, player.r, H - player.r)
  player.hurt -= dt

  // Spawn
  spawnTimer -= dt
  if (toSpawn > 0 && spawnTimer <= 0) {
    spawnCursor(W, H)
    toSpawn--
    spawnTimer = SPAWN_EVERY
  }

  // Cursors chase the player, push apart, and hurt on contact
  for (const c of cursors) {
    const d = dist(c, player) || 1
    const speed = c.speed * (d < AURA_RADIUS ? 1 - player.slow : 1)
    c.x += ((player.x - c.x) / d) * speed * dt
    c.y += ((player.y - c.y) / d) * speed * dt
    for (const o of cursors) {
      const od = dist(c, o)
      if (o !== c && od > 0 && od < c.r * 2) {
        c.x += ((c.x - o.x) / od) * (c.r * 2 - od) / 2
        c.y += ((c.y - o.y) / od) * (c.r * 2 - od) / 2
      }
    }
    if (d < c.r + player.r && player.hurt <= 0) {
      player.hp -= CONTACT_DAMAGE * player.armor
      player.hurt = 0.5
    }
  }

  // Auto-fire at the nearest cursor
  fireTimer -= dt
  if (fireTimer <= 0 && cursors.length) {
    fireTimer = FIRE_EVERY
    const target = cursors.reduce((a, c) => (dist(c, player) < dist(a, player) ? c : a))
    const base = Math.atan2(target.y - player.y, target.x - player.x)
    for (let i = 0; i < player.projectiles; i++) {
      const a = base + (i - (player.projectiles - 1) / 2) * 0.2
      bullets.push({ x: player.x, y: player.y, vx: Math.cos(a) * BULLET_SPEED, vy: Math.sin(a) * BULLET_SPEED, life: 1.5 })
    }
  }
  for (const b of bullets) {
    b.x += b.vx * dt
    b.y += b.vy * dt
    b.life -= dt
    const hit = cursors.find(c => dist(b, c) < c.r + 5)
    if (hit) {
      hit.hp -= player.damage
      b.life = 0
    }
  }
  bullets = bullets.filter(b => b.life > 0)

  // Orbitals deal damage over time on contact
  orbitAngle += 3 * dt
  for (const o of orbitals()) {
    for (const c of cursors) if (dist(o, c) < c.r + 10) c.hp -= player.damage * 5 * dt
  }

  // Deaths drop cookies
  for (const c of cursors) {
    if (c.hp > 0) continue
    state.kills++
    const n = Math.floor(player.dropMult) + (Math.random() < player.dropMult % 1 ? 1 : 0)
    for (let i = 0; i < n; i++) drops.push({ x: c.x + Math.random() * 20 - 10, y: c.y + Math.random() * 20 - 10 })
  }
  cursors = cursors.filter(c => c.hp > 0)

  drops = drops.filter(d => {
    if (dist(d, player) > player.r + PICKUP_RADIUS) return true
    collect()
    return false
  })

  state.hp = Math.max(0, Math.ceil(player.hp))
  state.maxHp = player.maxHp

  if (player.hp <= 0) {
    state.phase = 'over'
  } else if (!toSpawn && !cursors.length) {
    drops.forEach(collect) // leftover cookies fly to the player
    drops = []
    state.hp = Math.ceil(player.hp)
    state.phase = 'upgrade'
  }
}

// Each cookie picked up heals 1 HP
function collect() {
  state.cookies++
  state.collected++
  player.hp = Math.min(player.maxHp, player.hp + 1)
}

function spawnCursor(W, H) {
  const e = Math.random() * 2 * (W + H) // random point along the edges
  const [x, y] =
    e < W ? [e, -20] :
    e < 2 * W ? [e - W, H + 20] :
    e < 2 * W + H ? [-20, e - 2 * W] :
    [W + 20, e - 2 * W - H]
  cursors.push({ x, y, r: 12, hp: 10 * 1.1 ** (state.wave - 1), speed: 70 * 1.05 ** (state.wave - 1) })
}

function orbitals() {
  return Array.from({ length: player.orbitals }, (_, i) => {
    const a = orbitAngle + (i * 2 * Math.PI) / player.orbitals
    return { x: player.x + Math.cos(a) * ORBIT_RADIUS, y: player.y + Math.sin(a) * ORBIT_RADIUS }
  })
}

function draw() {
  const { width: W, height: H } = ctx.canvas
  ctx.fillStyle = '#fdf6ec'
  ctx.fillRect(0, 0, W, H)

  if (player.slow) {
    ctx.fillStyle = 'rgba(150, 190, 255, 0.15)'
    ctx.beginPath()
    ctx.arc(player.x, player.y, AURA_RADIUS, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = '#f5c542'
  for (const b of bullets) {
    ctx.beginPath()
    ctx.arc(b.x, b.y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  for (const c of cursors) drawCursor(c)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#000'
  ctx.font = '16px sans-serif'
  for (const d of drops) ctx.fillText('🍪', d.x, d.y)
  ctx.font = '20px sans-serif'
  for (const o of orbitals()) ctx.fillText('🍪', o.x, o.y)

  ctx.globalAlpha = player.hurt > 0 && Math.floor(player.hurt * 20) % 2 ? 0.4 : 1
  ctx.font = '40px sans-serif'
  ctx.fillText('🍪', player.x, player.y)
  ctx.globalAlpha = 1
}

function drawCursor(c) {
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.scale(1.4, 1.4)
  ctx.translate(-6, -10)
  ctx.beginPath()
  ARROW.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
  ctx.closePath()
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.lineWidth = 1
  ctx.strokeStyle = '#000'
  ctx.stroke()
  ctx.restore()
}
