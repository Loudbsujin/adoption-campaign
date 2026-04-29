const BANNED = [
  '시발', '씨발', '병신', '개새끼', '좆', '꺼져', '죽어',
  'fuck', 'shit', 'bitch', 'asshole',
];

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, '');
}

function containsBanned(text) {
  const n = normalize(text);
  return BANNED.some((word) => n.includes(word));
}

function sanitize(text) {
  // strip ASCII control characters and trim whitespace
  let out = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code < 32 || code === 127) continue;
    out += ch;
  }
  return out.trim();
}

module.exports = { containsBanned, sanitize };
