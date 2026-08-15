// Generates the app's PNG icons (apple-touch-icon + PWA manifest icons)
// with zero image dependencies, using a hand-rolled PNG encoder.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

let crcTable;
function crc32(buf) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // no filter
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw);

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const BG = [15, 23, 42, 255]; // #0f172a
const BLUE = [59, 130, 246, 255]; // #3b82f6
const RED = [239, 68, 68, 255]; // #ef4444

function drawIcon(size, { maskableSafePad = false } = {}) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const scale = maskableSafePad ? 0.68 : 1; // keep design inside the safe zone
  const r1 = size * 0.34 * scale;
  const r2 = size * 0.2 * scale;
  const r3 = size * 0.09 * scale;
  const ringWidth = Math.max(1.5, size * 0.018);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      let color = BG;
      if (Math.abs(d - r1) < ringWidth) color = BLUE;
      else if (Math.abs(d - r2) < ringWidth) color = BLUE;
      else if (d <= r3) color = RED;
      const i = (y * size + x) * 4;
      rgba[i] = color[0];
      rgba[i + 1] = color[1];
      rgba[i + 2] = color[2];
      rgba[i + 3] = color[3];
    }
  }
  return encodePng(size, size, rgba);
}

const targets = [
  { name: 'apple-touch-icon.png', size: 180, maskableSafePad: false },
  { name: 'icon-192.png', size: 192, maskableSafePad: false },
  { name: 'icon-512.png', size: 512, maskableSafePad: false },
  { name: 'maskable-512.png', size: 512, maskableSafePad: true },
];

for (const t of targets) {
  const png = drawIcon(t.size, { maskableSafePad: t.maskableSafePad });
  writeFileSync(path.join(outDir, t.name), png);
  console.log(`Wrote public/icons/${t.name} (${t.size}x${t.size})`);
}
