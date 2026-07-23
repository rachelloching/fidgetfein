const PRESETS = [
  {
    id: 'classic',
    name: 'Classic',
    vars: {
      '--key-color': 'transparent',
      '--key-blend': 'normal',
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
      '--key-blend': 'color',
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
      '--key-blend': 'color',
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
      '--key-blend': 'color',
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
      '--key-blend': 'color',
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

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContextClass();
let clickBuffer = null;
fetch('assets/click.wav')
  .then((r) => r.arrayBuffer())
  .then((data) => audioCtx.decodeAudioData(data))
  .then((buffer) => {
    clickBuffer = buffer;
  });

let audioUnlocked = false;
function playClick(rate, gain) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (!audioUnlocked) {
    // iOS Safari only reliably unlocks a suspended AudioContext when a
    // buffer is started synchronously within the first user gesture.
    audioUnlocked = true;
    const silence = audioCtx.createBuffer(1, 1, 22050);
    const silentSource = audioCtx.createBufferSource();
    silentSource.buffer = silence;
    silentSource.connect(audioCtx.destination);
    silentSource.start(0);
  }
  if (!clickBuffer) return;
  const source = audioCtx.createBufferSource();
  source.buffer = clickBuffer;
  source.playbackRate.value = rate;
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = gain;
  source.connect(gainNode).connect(audioCtx.destination);
  source.start(0);
}

function playPressSound() {
  playClick(1, 1);
}

function playReleaseSound() {
  playClick(1.18, 0.6);
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
  let pressToken = 0;
  key.addEventListener('pointerdown', () => {
    pressToken++;
    key.classList.add('pressed');
    pressStart = performance.now();
    playPressSound();
  });
  const release = () => {
    if (!key.classList.contains('pressed')) return;
    const myToken = pressToken;
    const wait = Math.max(0, MIN_PRESS_MS - (performance.now() - pressStart));
    setTimeout(() => {
      if (myToken !== pressToken) return;
      key.classList.remove('pressed');
      playReleaseSound();
      const pulse = document.createElement('span');
      pulse.className = 'pulse';
      pulse.addEventListener('animationend', () => pulse.remove());
      key.appendChild(pulse);
    }, wait);
  };
  key.addEventListener('pointerup', release);
  key.addEventListener('pointerleave', () => {
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
