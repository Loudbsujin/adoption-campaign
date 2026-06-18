const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const config = require('./config');
const { containsBanned, sanitize } = require('./filter');

const TOTAL_PIECES = config.grid.cols * config.grid.rows;

// Mulberry32 PRNG for reproducible shuffle
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffledOrder(seed, n) {
  const arr = Array.from({ length: n }, (_, i) => i);
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const pieceOrder = shuffledOrder(config.shuffleSeed, TOTAL_PIECES);

// State
const messageQueue = [];
const revealedPieces = []; // { pieceIndex, message, ts }
const galleryMessages = []; // overflow once puzzle is full
let nextOrderIdx = 0;

// Per-IP rate limiter
const rateBuckets = new Map();
function allowSubmission(ip) {
  const now = Date.now();
  const arr = rateBuckets.get(ip) || [];
  const fresh = arr.filter((t) => now - t < config.rateLimit.windowMs);
  if (fresh.length >= config.rateLimit.maxPerWindow) {
    rateBuckets.set(ip, fresh);
    return false;
  }
  fresh.push(now);
  rateBuckets.set(ip, fresh);
  return true;
}

const app = express();
app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/state', (_req, res) => {
  res.json({
    grid: config.grid,
    keyVisual: config.keyVisual,
    revealed: revealedPieces,
    gallery: galleryMessages.slice(-30),
    total: TOTAL_PIECES,
    queued: messageQueue.length,
  });
});

app.post('/api/message', (req, res) => {
  const ip = req.ip;
  if (!allowSubmission(ip)) {
    return res.status(429).json({ ok: false, error: '잠시 후 다시 시도해 주세요.' });
  }

  const raw = (req.body && typeof req.body.text === 'string') ? req.body.text : '';
  const text = sanitize(raw);

  if (text.length < config.message.minLength) {
    return res.status(400).json({ ok: false, error: '메시지를 입력해 주세요.' });
  }
  if (text.length > config.message.maxLength) {
    return res.status(400).json({ ok: false, error: `최대 ${config.message.maxLength}자까지 가능합니다.` });
  }
  if (containsBanned(text)) {
    return res.status(400).json({ ok: false, error: '부적절한 표현이 포함되어 있습니다.' });
  }

  messageQueue.push({ text, ts: Date.now() });
  return res.json({ ok: true, queued: messageQueue.length });
});

// Demo endpoint: seed N fake messages for rehearsal
app.post('/api/demo', (req, res) => {
  const count = Math.min(parseInt(req.query.count, 10) || 20, 500);
  const samples = [
    '모든 아이가 가족을 만나길', '함께라서 행복해요', '사랑으로 자라요',
    '응원합니다', '오늘도 따뜻한 하루', '같이 걸어가요',
    '입양은 또 하나의 시작', '소중한 만남', '축복합니다',
    '늘 곁에 있을게요', '용기 있는 선택을 응원해요', '감사합니다',
  ];
  for (let i = 0; i < count; i++) {
    messageQueue.push({ text: samples[i % samples.length], ts: Date.now(), demo: true });
  }
  res.json({ ok: true, queued: messageQueue.length });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.emit('hello', {
    grid: config.grid,
    keyVisual: config.keyVisual,
    revealed: revealedPieces,
    gallery: galleryMessages.slice(-30),
    total: TOTAL_PIECES,
  });
});

// Worker: dequeue at fixed interval, broadcast reveal/gallery events
setInterval(() => {
  if (messageQueue.length === 0) return;
  const item = messageQueue.shift();

  if (nextOrderIdx < pieceOrder.length) {
    const pieceIndex = pieceOrder[nextOrderIdx++];
    const reveal = { pieceIndex, message: item.text, ts: item.ts };
    revealedPieces.push(reveal);
    io.emit('piece-revealed', reveal);
    if (revealedPieces.length === TOTAL_PIECES) {
      io.emit('puzzle-complete', { at: Date.now() });
    }
  } else {
    const entry = { message: item.text, ts: item.ts };
    galleryMessages.push(entry);
    if (galleryMessages.length > 200) galleryMessages.shift();
    io.emit('gallery-message', entry);
  }
}, config.queue.revealIntervalMs);

server.listen(config.port, () => {
  console.log(`[puzzle] listening on http://localhost:${config.port}`);
  console.log(`[puzzle] grid ${config.grid.cols}x${config.grid.rows} = ${TOTAL_PIECES} pieces`);
  console.log(`[puzzle] mobile:  http://localhost:${config.port}/mobile.html`);
  console.log(`[puzzle] display: http://localhost:${config.port}/display.html`);
});
