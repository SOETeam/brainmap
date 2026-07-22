// Simplex-like 3D noise implementation (no external deps)
// Based on improved Perlin noise with smooth gradients

const GRAD3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

const PERM = new Uint8Array(512);
const PERM_MOD12 = new Uint8Array(512);

// Seed the permutation table
function seedNoise(seed: number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle with seed
  let s = seed;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) {
    PERM[i] = p[i & 255];
    PERM_MOD12[i] = PERM[i] % 12;
  }
}

seedNoise(42);

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }

function grad3(hash: number, x: number, y: number, z: number) {
  const g = GRAD3[hash % 12];
  return g[0] * x + g[1] * y + g[2] * z;
}

export function noise3D(x: number, y: number, z: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);

  const A  = PERM[X] + Y;
  const AA = PERM[A] + Z;
  const AB = PERM[A + 1] + Z;
  const B  = PERM[X + 1] + Y;
  const BA = PERM[B] + Z;
  const BB = PERM[B + 1] + Z;

  return lerp(
    lerp(
      lerp(grad3(PERM_MOD12[AA], xf, yf, zf), grad3(PERM_MOD12[BA], xf-1, yf, zf), u),
      lerp(grad3(PERM_MOD12[AB], xf, yf-1, zf), grad3(PERM_MOD12[BB], xf-1, yf-1, zf), u),
      v
    ),
    lerp(
      lerp(grad3(PERM_MOD12[AA+1], xf, yf, zf-1), grad3(PERM_MOD12[BA+1], xf-1, yf, zf-1), u),
      lerp(grad3(PERM_MOD12[AB+1], xf, yf-1, zf-1), grad3(PERM_MOD12[BB+1], xf-1, yf-1, zf-1), u),
      v
    ),
    w
  );
}

// FBM (Fractal Brownian Motion) for richer noise
export function fbm(x: number, y: number, z: number, octaves = 3): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3D(x * frequency, y * frequency, z * frequency);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / maxValue;
}
