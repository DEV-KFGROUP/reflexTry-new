/* Run with: node scripts/test-game-results.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'reflextry-results-'));
for (const name of ['safeStorage', 'scoreHistory', 'dailyChallenge', 'rotation', 'number-layout']) {
  const source = fs.readFileSync(path.join(__dirname, '..', ['rotation', 'number-layout'].includes(name) ? 'lib/gaming' : 'utils', `${name}.ts`), 'utf8');
  fs.writeFileSync(path.join(temp, `${name}.js`), ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText);
}
class MemoryStorage {
  values = new Map();
  get length() { return this.values.size; }
  key(i) { return [...this.values.keys()][i] ?? null; }
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
  clear() { this.values.clear(); }
}
const storage = new MemoryStorage();
global.window = { localStorage: storage };
global.localStorage = storage;
const { ScoreHistory, calculateTrend } = require(path.join(temp, 'scoreHistory.js'));
const { DailyChallenge, localDay } = require(path.join(temp, 'dailyChallenge.js'));
try {
  const { generateTilePositions } = require(path.join(temp, 'number-layout.js'));
  for (const width of [180, 228, 298, 660, 840]) for (const count of [10, 20, 40]) {
    const board = generateTilePositions(count, 5, width);
    assert.equal(board.tiles.length, count + 5);
    assert.equal(new Set(board.tiles.map(tile => `${tile.x}:${tile.y}`)).size, count + 5);
    for (const tile of board.tiles) {
      const x = tile.x / 100 * width, y = tile.y / 100 * board.height;
      assert.ok(x >= 28 && x <= width - 28 && y >= 28 && y <= board.height - 28);
      for (const other of board.tiles) if (other.id !== tile.id) {
        assert.ok(Math.abs(tile.x - other.x) / 100 * width >= 56 || Math.abs(tile.y - other.y) / 100 * board.height >= 56);
      }
    }
  }
  const { rotationEquivalent } = require(path.join(temp, 'rotation.js'));
  const shape = [[0,0,0],[1,0,0],[0,2,0],[0,0,3]];
  assert.equal(rotationEquivalent(shape, shape.map(([x,y,z]) => [y+4,-x+7,z-2])), true);
  assert.equal(rotationEquivalent(shape, shape.map(([x,y,z]) => [-x,y,z])), false);
  assert.equal(rotationEquivalent([[0,0,0],[1,0,0]], [[0,0,0],[-1,0,0]]), true);
  assert.equal(calculateTrend([400, 390, 380, 300, 290, 280], false), 'improving');
  assert.equal(calculateTrend([10, 11, 12, 19, 20, 21], true), 'improving');
  assert.equal(calculateTrend([0, 0, 0, 0, 0, 0], false), 'stable');
  storage.setItem('reflexhub_history_reaction-time', '{broken');
  assert.deepEqual(ScoreHistory.get('reaction-time'), []);
  ScoreHistory.save('reaction-time', 100, 'ms', 'easy', { configuration: 'easy:mouse', higherIsBetter: false });
  ScoreHistory.save('reaction-time', 300, 'ms', 'hard', { configuration: 'hard:touch', higherIsBetter: false });
  ScoreHistory.save('reaction-time', 250, 'ms', 'hard', { configuration: 'hard:touch', higherIsBetter: false });
  assert.equal(ScoreHistory.getStats('reaction-time').best, 250);
  assert.equal(ScoreHistory.getStats('reaction-time').count, 2);
  ScoreHistory.save('reaction-time', 5, 'ms', 'hard', { configuration: 'hard:touch', eligible: false });
  assert.equal(ScoreHistory.getStats('reaction-time').best, 250);
  assert.equal(ScoreHistory.getStats('reaction-time', 'easy:mouse').best, 100);
  ScoreHistory.save('invalid', Infinity, 'pts');
  assert.equal(ScoreHistory.get('invalid').length, 0);
  for (let i = 0; i < 110; i++) ScoreHistory.save('bounded', i, 'pts');
  assert.equal(ScoreHistory.get('bounded').length, 100);
  const today = DailyChallenge.getToday();
  storage.clear();
  assert.deepEqual(DailyChallenge.getToday(), today, 'The daily tool is deterministic across storage resets');
  assert.equal(DailyChallenge.checkCompletion(today.toolId, today.target, 'wrong-unit'), false);
  assert.equal(DailyChallenge.checkCompletion(today.toolId, 0, today.unit), false);
  assert.equal(DailyChallenge.checkCompletion(today.toolId, today.target, today.unit), true);
  assert.equal(DailyChallenge.checkCompletion(today.toolId, today.target, today.unit), false, 'Daily rewards must not be granted twice');
  storage.clear();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  storage.setItem(`reflexhub_daily_completed_${localDay(yesterday)}`, 'true');
  assert.equal(DailyChallenge.getStreak(), 1, 'Yesterday’s streak survives before today is completed');
  storage.setItem(`reflexhub_daily_completed_${localDay()}`, 'true');
  assert.equal(DailyChallenge.getStreak(), 2);
  Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
  assert.doesNotThrow(() => ScoreHistory.save('offline', 4, 'pts'));
  assert.deepEqual(ScoreHistory.get('offline'), []);
  assert.doesNotThrow(() => DailyChallenge.getToday());
  console.log('Passed: target bounds/non-overlap, rotation equivalence, trends, comparable score groups, corrupt/blocked storage, bounded history, daily determinism, units, duplicate rewards and streaks.');
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
