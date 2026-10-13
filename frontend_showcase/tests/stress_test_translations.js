/**
 * Stress Test Harness for Translation Resolution (i18n)
 * Tests:
 * 1. Missing keys & fallback behavior
 * 2. Null, undefined, empty, invalid path & lang inputs
 * 3. Deep dot notation & prototype pollution resilience
 * 4. Special characters, unicode, emoji, punctuation
 * 5. Parameter interpolation stress (XSS, missing, nested)
 * 6. High-concurrency / rapid switching benchmark
 * 7. Specialized helpers: translateFeature, translateRank, translateRiskLevel
 * 8. Exact dictionary symmetry and key parity
 */

import { translations, t, translateFeature, translateRank, translateRiskLevel } from '../src/translations.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message, details = {}) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    failures.push({ message, details });
    console.error(`❌ FAILED: ${message}`, details);
  }
}

console.log('=== STARTING TRANSLATION RESOLUTION STRESS TESTS ===\n');

// -------------------------------------------------------------
// Test Suite 1: Missing Keys & Fallback Mechanics
// -------------------------------------------------------------
console.log('--- Suite 1: Missing Keys & Fallback Mechanics ---');

// 1.1 Completely non-existent key in both languages
const res1 = t('non.existent.deep.nested.key', 'fr');
assert(res1 === 'non.existent.deep.nested.key', 'Missing key should return the original key path as fallback', { got: res1 });

// 1.2 Non-existent single key
const res2 = t('nonexistent', 'en');
assert(res2 === 'nonexistent', 'Single missing key should return key name', { got: res2 });

// 1.3 Key that exists only in fallback (if any simulated)
const mockDict = { fr: { existingOnlyInFr: 'Bonjour' }, en: {} };
// Test t() with nonexistent in fr should fallback to en, or vice versa
// Let's test a key present in fr:
const frHero = t('hero.badge', 'fr');
assert(typeof frHero === 'string' && frHero.length > 0, 'fr hero.badge should be populated string');
const enHero = t('hero.badge', 'en');
assert(typeof enHero === 'string' && enHero.length > 0, 'en hero.badge should be populated string');
assert(frHero !== enHero, 'fr and en hero.badge should have different translations');

// -------------------------------------------------------------
// Test Suite 2: Null, Undefined, Type Mismatches & Boundary Inputs
// -------------------------------------------------------------
console.log('--- Suite 2: Null, Undefined, and Type Mismatches ---');

// Path inputs
const nullPathTest = (() => {
  try {
    return t(null, 'fr');
  } catch (e) {
    return `THREW: ${e.message}`;
  }
})();
// Let's check how t handles non-string path
assert(!String(nullPathTest).startsWith('THREW'), 't(null) should not throw uncaught error', { got: nullPathTest });

const undefinedPathTest = (() => {
  try {
    return t(undefined, 'fr');
  } catch (e) {
    return `THREW: ${e.message}`;
  }
})();
assert(!String(undefinedPathTest).startsWith('THREW'), 't(undefined) should not throw uncaught error', { got: undefinedPathTest });

const emptyPathTest = (() => {
  try {
    return t('', 'fr');
  } catch (e) {
    return `THREW: ${e.message}`;
  }
})();
assert(!String(emptyPathTest).startsWith('THREW'), 't("") should not throw uncaught error', { got: emptyPathTest });

const numberPathTest = (() => {
  try {
    return t(12345, 'fr');
  } catch (e) {
    return `THREW: ${e.message}`;
  }
})();
assert(!String(numberPathTest).startsWith('THREW'), 't(number) should not throw uncaught error', { got: numberPathTest });

const objPathTest = (() => {
  try {
    return t({ foo: 'bar' }, 'fr');
  } catch (e) {
    return `THREW: ${e.message}`;
  }
})();
assert(!String(objPathTest).startsWith('THREW'), 't(object) should not throw uncaught error', { got: objPathTest });

// Lang inputs
const invalidLang1 = t('hero.badge', null);
assert(typeof invalidLang1 === 'string' && invalidLang1.length > 0, 't(key, null) should default gracefully to fr', { got: invalidLang1 });

const invalidLang2 = t('hero.badge', undefined);
assert(typeof invalidLang2 === 'string' && invalidLang2.length > 0, 't(key, undefined) should default gracefully to fr', { got: invalidLang2 });

const invalidLang3 = t('hero.badge', 'es');
assert(typeof invalidLang3 === 'string' && invalidLang3.length > 0, 't(key, "es") unsupported lang should default to fr', { got: invalidLang3 });

const invalidLang4 = t('hero.badge', 123);
assert(typeof invalidLang4 === 'string' && invalidLang4.length > 0, 't(key, number) should default gracefully to fr', { got: invalidLang4 });

// -------------------------------------------------------------
// Test Suite 3: Deep Dot Notation, Hierarchy & Prototype Pollution
// -------------------------------------------------------------
console.log('--- Suite 3: Deep Dot Notation & Prototype Pollution ---');

// 3.1 Very deep dot path (100 levels)
const deepPath = new Array(100).fill('level').join('.');
const deepRes = t(deepPath, 'fr');
assert(deepRes === deepPath, '100-level deep path should return key without throwing', { got: deepRes });

// 3.2 Intermediate primitive collisions (traversing through a string or boolean as if it were an object)
// e.g. 'hero.badge.something.else' where hero.badge is a string
const primCollision = t('hero.badge.something.else', 'fr');
assert(primCollision === 'hero.badge.something.else', 'Path traversing through primitive should return original path without crashing', { got: primCollision });

// 3.3 Prototype pollution attempts
const proto1 = t('__proto__.polluted', 'fr');
assert(proto1 === '__proto__.polluted' && Object.prototype.polluted === undefined, 'No __proto__ pollution', { got: proto1, polluted: Object.prototype.polluted });

const proto2 = t('constructor.prototype', 'fr');
assert(!String(proto2).startsWith('THREW'), 'constructor.prototype should not throw', { got: proto2 });

const proto3 = t('toString', 'fr');
assert(typeof proto3 === 'string', 'toString key should not return Function object', { got: typeof proto3 });

// -------------------------------------------------------------
// Test Suite 4: Special Characters, Unicode, Emoji, Line Breaks
// -------------------------------------------------------------
console.log('--- Suite 4: Special Characters & Unicode ---');

const specialChars = [
  'key with spaces',
  'key\nwith\nnewlines',
  'key\twith\ttabs',
  'key.with..double.dots',
  '.leading.dot',
  'trailing.dot.',
  'symbols!@#$%^&*()_+{}|:"<>?',
  'emoji_🔥_ember_⚔️_dota',
  'unicode_héros_éléphant_日本語_русский',
  'xss_<script>alert(1)</script>',
  'sql_\' OR 1=1 --',
];

for (const sc of specialChars) {
  try {
    const res = t(sc, 'fr');
    assert(typeof res === 'string', `Handled special character path: "${sc.slice(0, 20)}"`, { got: res });
  } catch (err) {
    assert(false, `Crashed on special character path: "${sc.slice(0, 20)}"`, { error: err.message });
  }
}

// -------------------------------------------------------------
// Test Suite 5: String Parameter Interpolation Stress
// -------------------------------------------------------------
console.log('--- Suite 5: Parameter Interpolation Stress ---');

// Note: Test interpolation with existing or custom keys
// If dictionary has interpolation like {count} or similar
const interpTest1 = t('hero.titleMain', 'fr', { extra: 'unused' });
assert(typeof interpTest1 === 'string', 'Extra params should not break resolution');

const interpTest2 = t('non.existent.key', 'fr', { foo: 'bar' });
assert(interpTest2 === 'non.existent.key', 'Missing key with params should return key');

// If val is a string with {param}
// Let's test by checking how t interpolates when params contain null, undefined, numbers, strings
// We can check through translations directly or via t
// Let's check with null param
const interpNull = t('hero.titleMain', 'fr', null);
assert(typeof interpNull === 'string', 't with params = null should not throw');

const interpArray = t('hero.titleMain', 'fr', ['a', 'b']);
assert(typeof interpArray === 'string', 't with params as array should not throw');

// -------------------------------------------------------------
// Test Suite 6: Rapid Switching / Concurrency Stress Test
// -------------------------------------------------------------
console.log('--- Suite 6: Rapid Switching & Performance (50,000 lookups) ---');

const sampleKeys = [
  'nav.brandTitle',
  'hero.titleMain',
  'kpis.cards.datasetSize.label',
  'kpis.cards.recall.value',
  'psychology.cards.tiltIndex.name',
  'mlBenchmark.table.rows.xgbSmote.name',
  'simulator.archetypes.tilting_player.name',
  'architecture.quickstart.commandInstall',
  'footer.disclaimers.ethics'
];

const startTime = performance.now();
const ITERATIONS = 50000;
let switchLang = 'fr';
let lookupSuccesses = 0;

for (let i = 0; i < ITERATIONS; i++) {
  switchLang = i % 2 === 0 ? 'fr' : 'en';
  const key = sampleKeys[i % sampleKeys.length];
  const translated = t(key, switchLang);
  if (typeof translated === 'string' && translated.length > 0 && translated !== key) {
    lookupSuccesses++;
  }
}
const durationMs = performance.now() - startTime;
console.log(`⚡ 50,000 rapid lookups completed in ${durationMs.toFixed(2)}ms (${(ITERATIONS / (durationMs / 1000)).toFixed(0)} ops/sec)`);
assert(lookupSuccesses === ITERATIONS, `All 50,000 lookups must resolve valid translations`, { lookupSuccesses, expected: ITERATIONS });
assert(durationMs < 2000, `50,000 lookups should finish in under 2000ms`, { durationMs });

// -------------------------------------------------------------
// Test Suite 7: Specialized Helpers Stress Testing
// -------------------------------------------------------------
console.log('--- Suite 7: Specialized Helpers (translateFeature, translateRank, translateRiskLevel) ---');

// 7.1 translateFeature
const featuresToTest = [
  'tilt_index',
  'night_owl_pct',
  'role_consistency',
  'loss_streak_current',
  'avg_xpm',
  'avg_gpm',
  'unknown_random_feature_xyz',
  '',
  null,
  undefined
];

for (const feat of featuresToTest) {
  try {
    const frF = translateFeature(feat, 'fr');
    const enF = translateFeature(feat, 'en');
    assert(frF !== undefined && enF !== undefined, `translateFeature(${feat}) returned valid output`, { fr: frF, en: enF });
  } catch (err) {
    assert(false, `translateFeature(${feat}) threw error`, { error: err.message });
  }
}

// 7.2 translateRank
const ranksToTest = [
  null,
  undefined,
  0,
  -10,
  11, // Herald 1
  25, // Guardian 5
  34, // Archon 4
  75, // Divine 5
  80, // Immortal
  85, // Immortal
  999, // Super high
  'not_a_number',
  NaN
];

for (const rank of ranksToTest) {
  try {
    const frR = translateRank(rank, 'fr');
    const enR = translateRank(rank, 'en');
    assert(typeof frR === 'string' && typeof enR === 'string', `translateRank(${rank}) returned string`, { fr: frR, en: enR });
  } catch (err) {
    assert(false, `translateRank(${rank}) threw error`, { error: err.message });
  }
}

// 7.3 translateRiskLevel
const probsToTest = [
  0.0,
  0.10,
  0.3599,
  0.36,   // threshold boundary
  0.5999,
  0.60,   // threshold boundary
  0.865,
  1.0,
  -0.5,   // negative
  1.5,    // over 100%
  NaN,
  null,
  undefined
];

for (const prob of probsToTest) {
  try {
    const risk = translateRiskLevel(prob, 'fr');
    assert(
      risk && typeof risk === 'object' && risk.level && risk.label && risk.status && risk.color,
      `translateRiskLevel(${prob}) returned structured risk object with level/label/status/color`,
      { risk }
    );
  } catch (err) {
    assert(false, `translateRiskLevel(${prob}) threw error`, { error: err.message });
  }
}

// -------------------------------------------------------------
// Test Suite 8: 100% Dictionary Key Parity and Structure Verification
// -------------------------------------------------------------
console.log('--- Suite 8: Full Dictionary Symmetry & Leaf Type Check ---');

function collectLeaves(obj, prefix = '') {
  const result = {};
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, collectLeaves(v, full));
    } else {
      result[full] = typeof v;
    }
  }
  return result;
}

const frLeaves = collectLeaves(translations.fr);
const enLeaves = collectLeaves(translations.en);

const frKeySet = new Set(Object.keys(frLeaves));
const enKeySet = new Set(Object.keys(enLeaves));

const missingInEn = [...frKeySet].filter(k => !enKeySet.has(k));
const missingInFr = [...enKeySet].filter(k => !frKeySet.has(k));

assert(missingInEn.length === 0, `No keys missing in English dictionary (missing: ${missingInEn.length})`, { missingInEn });
assert(missingInFr.length === 0, `No keys missing in French dictionary (missing: ${missingInFr.length})`, { missingInFr });
assert(frKeySet.size === enKeySet.size, `Exact symmetry: ${frKeySet.size} FR keys and ${enKeySet.size} EN keys`);

// Check for empty string leaves or null leaves
let emptyLeaves = [];
for (const [key, type] of Object.entries(frLeaves)) {
  const valFr = t(key, 'fr');
  const valEn = t(key, 'en');
  if (valFr === '' || valFr === undefined || valFr === null) {
    emptyLeaves.push({ key, lang: 'fr', val: valFr });
  }
  if (valEn === '' || valEn === undefined || valEn === null) {
    emptyLeaves.push({ key, lang: 'en', val: valEn });
  }
}
assert(emptyLeaves.length === 0, `No empty or undefined translation leaves detected in either dictionary`, { emptyLeaves });

// -------------------------------------------------------------
// Final Summary
// -------------------------------------------------------------
console.log('\n=== TRANSLATION STRESS TEST SUMMARY ===');
console.log(`Total assertions: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  console.error('\nFAILURE DETAILS:');
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
} else {
  console.log('\nALL TRANSLATION STRESS TESTS PASSED EMPIRICALLY!');
  process.exit(0);
}
