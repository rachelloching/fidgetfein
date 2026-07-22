const PRESETS = [
  {
    id: 'classic',
    name: 'Classic',
    vars: {
      '--key-top': '#46465e',
      '--key-bottom': '#2c2c40',
      '--key-border': 'rgba(23, 23, 35, 0.5)',
      '--key-glow': 'rgba(160, 160, 255, 0.5)',
      '--key-press-glow': 'rgba(150, 150, 255, 0.6)',
      '--key-pattern': 'none',
      '--key-pattern-size': 'auto',
    },
  },
  {
    id: 'coral',
    name: 'Coral',
    vars: {
      '--key-top': '#ff8a73',
      '--key-bottom': '#d9503a',
      '--key-border': 'rgba(120, 40, 25, 0.5)',
      '--key-glow': 'rgba(255, 150, 120, 0.55)',
      '--key-press-glow': 'rgba(255, 140, 110, 0.65)',
      '--key-pattern': 'none',
      '--key-pattern-size': 'auto',
    },
  },
  {
    id: 'mint',
    name: 'Mint',
    vars: {
      '--key-top': '#6fe0c0',
      '--key-bottom': '#2fae8c',
      '--key-border': 'rgba(15, 70, 55, 0.5)',
      '--key-glow': 'rgba(140, 255, 220, 0.55)',
      '--key-press-glow': 'rgba(130, 255, 210, 0.65)',
      '--key-pattern': 'none',
      '--key-pattern-size': 'auto',
    },
  },
  {
    id: 'lavender-dot',
    name: 'Lavender Dot',
    vars: {
      '--key-top': '#b79aff',
      '--key-bottom': '#7c5cd9',
      '--key-border': 'rgba(50, 30, 90, 0.5)',
      '--key-glow': 'rgba(200, 170, 255, 0.55)',
      '--key-press-glow': 'rgba(190, 160, 255, 0.65)',
      '--key-pattern': 'radial-gradient(rgba(255,255,255,0.45) 22%, transparent 23%)',
      '--key-pattern-size': '14px 14px',
    },
  },
  {
    id: 'sunset-stripe',
    name: 'Sunset Stripe',
    vars: {
      '--key-top': '#ffb86b',
      '--key-bottom': '#ff6b9d',
      '--key-border': 'rgba(90, 30, 50, 0.5)',
      '--key-glow': 'rgba(255, 180, 150, 0.55)',
      '--key-press-glow': 'rgba(255, 170, 140, 0.65)',
      '--key-pattern': 'repeating-linear-gradient(45deg, rgba(255,255,255,0.28) 0 6px, rgba(0,0,0,0.12) 6px 12px)',
      '--key-pattern-size': 'auto',
    },
  },
];

function applyPreset(el, preset) {
  for (const [prop, value] of Object.entries(preset.vars)) {
    el.style.setProperty(prop, value);
  }
}

const POOL_SIZE = 6;
const pool = [];
for (let i = 0; i < POOL_SIZE; i++) {
  const a = new Audio('assets/click.wav');
  a.preload = 'auto';
  pool.push(a);
}
let poolIndex = 0;
function playClick() {
  const a = pool[poolIndex];
  poolIndex = (poolIndex + 1) % POOL_SIZE;
  try {
    a.currentTime = 0;
    a.play();
  } catch (e) {}
}

const keyCount = 2;
const grid = document.getElementById('keyboardGrid');
const keys = [];
let streakCount = 0;
let streakTimer = null;

for (let i = 0; i < keyCount; i++) {
  const key = document.createElement('div');
  key.className = 'key';
  key.innerHTML = '<span class="glow"></span>';
  key.addEventListener('pointerdown', () => {
    key.classList.add('pressed');
    playClick();
    streakCount++;
    document.getElementById('streak').textContent = streakCount > 2 ? streakCount + ' clicks' : '';
    clearTimeout(streakTimer);
    streakTimer = setTimeout(() => {
      streakCount = 0;
      document.getElementById('streak').textContent = '';
    }, 900);
  });
  const release = () => {
    key.classList.remove('pressed');
    key.classList.add('pop');
    setTimeout(() => key.classList.remove('pop'), 400);
  };
  key.addEventListener('pointerup', release);
  key.addEventListener('pointerleave', () => key.classList.remove('pressed'));
  grid.appendChild(key);
  keys.push(key);
}

const swatchRow = document.getElementById('swatchRow');
PRESETS.forEach((preset, i) => {
  const swatch = document.createElement('button');
  swatch.type = 'button';
  swatch.className = 'swatch' + (i === 0 ? ' active' : '');
  swatch.setAttribute('aria-label', preset.name);
  swatch.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
  applyPreset(swatch, preset);
  swatch.addEventListener('click', () => {
    keys.forEach((key) => applyPreset(key, preset));
    swatchRow.querySelectorAll('.swatch').forEach((s) => {
      s.classList.remove('active');
      s.setAttribute('aria-pressed', 'false');
    });
    swatch.classList.add('active');
    swatch.setAttribute('aria-pressed', 'true');
  });
  swatchRow.appendChild(swatch);
});

keys.forEach((key) => applyPreset(key, PRESETS[0]));
