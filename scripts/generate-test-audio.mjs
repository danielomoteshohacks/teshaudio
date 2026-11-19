/**
 * Generates the synthetic test audio used to prove the players work, and
 * measures each file's integrated loudness (LUFS) so the values written into
 * content frontmatter are real measurements, not guesses.
 *
 * Usage: node scripts/generate-test-audio.mjs
 * Output: public/audio/test/*.wav plus a printed table of LUFS and durations.
 *
 * Why synthetic tones: the site must never ship music Tesh did not make, but
 * the players still need something real to play until his own files exist.
 *
 * Files:
 *   sine-440.wav  2 s, 440 Hz sine. Seed track for the persistent player.
 *   pink-a.wav    8 s, plain pink noise, quiet. Version A of the seed A/B.
 *   pink-b.wav    8 s, the same noise with a +6 dB high shelf, much louder.
 *                 Version B of the seed A/B.
 * The A/B pair is built so loudness matching is audible: unmatched, B mostly
 * sounds "louder"; matched, the only difference left is tone (brightness).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 48000; // The K-weighting coefficients below are defined at 48 kHz.
const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio', 'test');

/* ----- Signal generation ------------------------------------------------ */

// Seeded PRNG so every run produces identical files (stable git diffs).
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sine(freq, seconds) {
  const n = Math.round(seconds * SAMPLE_RATE);
  return Float64Array.from({ length: n }, (_, i) => Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE));
}

// Paul Kellet's refined pink-noise filter: white noise through parallel
// one-pole filters, giving the -3 dB/octave slope that sounds "even" to ears.
function pinkNoise(seconds, seed) {
  const rand = mulberry32(seed);
  const n = Math.round(seconds * SAMPLE_RATE);
  const out = new Float64Array(n);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < n; i++) {
    const white = rand() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return out;
}

function biquad(x, b, a) {
  const y = new Float64Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v;
    y[i] = v;
  }
  return y;
}

// RBJ cookbook high shelf (shelf slope 1).
function highShelf(x, freq, gainDb) {
  const A = 10 ** (gainDb / 40);
  const w0 = (2 * Math.PI * freq) / SAMPLE_RATE;
  const cos = Math.cos(w0);
  const alpha = (Math.sin(w0) / 2) * Math.SQRT2;
  const sq = 2 * Math.sqrt(A) * alpha;
  const a0 = A + 1 - (A - 1) * cos + sq;
  const b = [
    (A * (A + 1 + (A - 1) * cos + sq)) / a0,
    (-2 * A * (A - 1 + (A + 1) * cos)) / a0,
    (A * (A + 1 + (A - 1) * cos - sq)) / a0,
  ];
  const a = [1, (2 * (A - 1 - (A + 1) * cos)) / a0, (A + 1 - (A - 1) * cos - sq) / a0];
  return biquad(x, b, a);
}

// Short raised-cosine fades so playback never starts or stops with a click.
function fade(x, seconds = 0.02) {
  const n = Math.round(seconds * SAMPLE_RATE);
  for (let i = 0; i < n; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / n);
    x[i] *= g;
    x[x.length - 1 - i] *= g;
  }
  return x;
}

/* ----- Loudness (ITU-R BS.1770-4 integrated, mono) -----------------------
 * K-weighting = a high shelf (models the head's acoustic effect) followed by
 * a high-pass (discounts low frequencies we hear as quieter). Then 400 ms
 * blocks with 75% overlap, an absolute gate at -70 LUFS and a relative gate
 * 10 LU below the ungated level, so silence and quiet tails do not drag the
 * measurement down. The result is what a DAW's integrated loudness meter
 * shows, and what ffmpeg's ebur128 filter reports (checked separately).
 */
function integratedLufs(x) {
  const stage1 = biquad(
    x,
    [1.53512485958697, -2.69169618940638, 1.19839281085285],
    [1, -1.69065929318241, 0.73248077421585],
  );
  const k = biquad(stage1, [1, -2, 1], [1, -1.99004745483398, 0.99007225036621]);

  const block = Math.round(0.4 * SAMPLE_RATE);
  const step = Math.round(0.1 * SAMPLE_RATE);
  const powers = [];
  for (let start = 0; start + block <= k.length; start += step) {
    let sum = 0;
    for (let i = start; i < start + block; i++) sum += k[i] * k[i];
    powers.push(sum / block);
  }
  const toLufs = (p) => -0.691 + 10 * Math.log10(p);
  const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;

  const absGated = powers.filter((p) => toLufs(p) > -70);
  const relativeGate = toLufs(mean(absGated)) - 10;
  const gated = absGated.filter((p) => toLufs(p) > relativeGate);
  return toLufs(mean(gated));
}

function normalise(x, targetLufs) {
  const gain = 10 ** ((targetLufs - integratedLufs(x)) / 20);
  return x.map((v) => v * gain);
}

/* ----- WAV output (16-bit PCM mono) ------------------------------------- */

function writeWav(path, x) {
  const data = Buffer.alloc(x.length * 2);
  x.forEach((v, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  writeFileSync(path, Buffer.concat([header, data]));
}

/* ----- Build ------------------------------------------------------------ */

mkdirSync(outDir, { recursive: true });

const noise = pinkNoise(8, 1234);
const files = {
  'sine-440.wav': normalise(fade(sine(440, 2)), -18),
  // A is deliberately quiet and B deliberately loud, an 8 LU gap, so the
  // effect of loudness matching is obvious when switching.
  'pink-a.wav': normalise(fade(Float64Array.from(noise)), -24),
  'pink-b.wav': normalise(fade(highShelf(Float64Array.from(noise), 3000, 6)), -16),
};

for (const [name, samples] of Object.entries(files)) {
  // Quantise first, then measure, so the reported value matches the file on disk.
  const quantised = samples.map((v) => Math.round(Math.max(-1, Math.min(1, v)) * 32767) / 32767);
  const peak = 20 * Math.log10(quantised.reduce((m, v) => Math.max(m, Math.abs(v)), 0));
  writeWav(join(outDir, name), quantised);
  console.log(
    `${name.padEnd(14)} ${(quantised.length / SAMPLE_RATE).toFixed(2)} s  ` +
      `${integratedLufs(quantised).toFixed(1)} LUFS  peak ${peak.toFixed(1)} dBFS`,
  );
}
