module.exports = {
  port: process.env.PORT || 3000,

  grid: {
    cols: parseInt(process.env.GRID_COLS, 10) || 20,
    rows: parseInt(process.env.GRID_ROWS, 10) || 12,
  },

  keyVisual: process.env.KEY_VISUAL || '/assets/keyvisual.svg',

  message: {
    minLength: 1,
    maxLength: 60,
  },

  queue: {
    revealIntervalMs: parseInt(process.env.REVEAL_INTERVAL_MS, 10) || 2500,
  },

  rateLimit: {
    windowMs: 10_000,
    maxPerWindow: 3,
  },

  shuffleSeed: parseInt(process.env.SHUFFLE_SEED, 10) || 20260511,
};
