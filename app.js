const PRESETS = [
  {
    id: 'classic',
    name: 'Classic',
    vars: {
      '--key-color': 'transparent',
      '--swatch-color': '#f5f5f7',
      '--key-glow': 'rgba(150, 170, 255, 0.65)',
      '--key-press-glow': 'rgba(150, 170, 255, 0.85)',
    },
  },
  {
    id: 'coral',
    name: 'Coral',
    vars: {
      '--key-color': '#ff8a73',
      '--swatch-color': '#ff8a73',
      '--key-glow': 'rgba(255, 150, 120, 0.65)',
      '--key-press-glow': 'rgba(255, 140, 110, 0.85)',
    },
  },
  {
    id: 'mint',
    name: 'Mint',
    vars: {
      '--key-color': '#6fe0c0',
      '--swatch-color': '#6fe0c0',
      '--key-glow': 'rgba(140, 255, 220, 0.65)',
      '--key-press-glow': 'rgba(130, 255, 210, 0.85)',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    vars: {
      '--key-color': '#b79aff',
      '--swatch-color': '#b79aff',
      '--key-glow': 'rgba(200, 170, 255, 0.65)',
      '--key-press-glow': 'rgba(190, 160, 255, 0.85)',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    vars: {
      '--key-color': '#ffb86b',
      '--swatch-color': '#ffb86b',
      '--key-glow': 'rgba(255, 180, 150, 0.65)',
      '--key-press-glow': 'rgba(255, 170, 140, 0.85)',
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

const MIN_PRESS_MS = 70;
const keyCount = 2;
const grid = document.getElementById('keyboardGrid');
const keys = [];

for (let i = 0; i < keyCount; i++) {
  const key = document.createElement('div');
  key.className = 'key';
  key.innerHTML = '<span class="glow"></span>';
  let pressStart = 0;
  let releasePending = false;
  key.addEventListener('pointerdown', () => {
    key.classList.remove('pop');
    key.classList.add('pressed');
    pressStart = performance.now();
    playClick();
  });
  const release = () => {
    if (!key.classList.contains('pressed') || releasePending) return;
    releasePending = true;
    const wait = Math.max(0, MIN_PRESS_MS - (performance.now() - pressStart));
    setTimeout(() => {
      key.classList.remove('pressed');
      key.classList.add('pop');
      releasePending = false;
      setTimeout(() => key.classList.remove('pop'), 400);
    }, wait);
  };
  key.addEventListener('pointerup', release);
  key.addEventListener('pointerleave', () => {
    releasePending = false;
    key.classList.remove('pressed');
  });
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
