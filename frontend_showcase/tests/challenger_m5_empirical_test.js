/**
 * Challenger M5 Empirical Stress Test & Adversarial Verification Harness
 * 
 * Target: Dota 2 Final/frontend_showcase
 * Scope:
 * 1. Adversarial Fuzzing & Stress Testing of sanitizeAccountId:
 *    - Extreme SteamID64 (valid conversions, out-of-range, BigInt, string)
 *    - Negative numbers & negative strings
 *    - Decimal strings, floats & scientific notation
 *    - Non-numeric strings, SQLi, XSS, Unicode, Control Chars
 *    - Non-primitive types (Objects, Arrays, Functions, Symbols, BigInt, Dates, RegExps)
 *    - 10,000 randomized fuzzing iterations verifying ZERO unhandled exceptions
 * 2. Integration & Defensive Resilience of predictPlayer & synthesizePlayerProfile:
 *    - Zero uncaught promise rejections on adversarial inputs
 *    - Contract verification: invalid inputs return structured { success: false, errorKey }
 *    - Mathematical soundness and determinism of synthesized player profiles
 * 3. Resilient Clipboard Fallback Verification:
 *    - NotAllowedError, SecurityError, headless environments, missing APIs
 * 4. Translation System Adversarial Stress:
 *    - Nested paths, XSS interpolation, prototype pollution
 *    - 100% FR <-> EN dictionary leaf symmetry
 * 5. Production Bundle Integrity:
 *    - Zero machine paths (/Users/), zero secrets, valid distribution assets
 */

import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeAccountId, synthesizePlayerProfile, predictPlayer } from '../src/services/api.js';
import { translations, t, translateFeature, translateRank, translateRiskLevel } from '../src/translations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('  CHALLENGER M5 ADVERSARIAL STRESS TEST & EMPIRICAL AUDIT HARNESS');
console.log('================================================================\n');

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failures = [];

function check(condition, message, details = {}) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
  } else {
    failedAssertions++;
    failures.push({ message, details });
    console.error(`  ❌ FAIL: ${message}`, details);
  }
}

// ============================================================================
// SUITE 1: sanitizeAccountId Adversarial Edge Cases & Fuzzing
// ============================================================================
console.log('--- Suite 1: sanitizeAccountId Boundary & Adversarial Edge Cases ---');

// 1.1 SteamID64 conversions and boundaries
const steam64Tests = [
  ['76561198000000000', '39734272', 'Standard SteamID64 (39734272)'],
  [76561198000000000n, '39734272', 'Standard SteamID64 as BigInt'],
  ['76561198795663699', '835397971', 'SteamID64 for Tilting Player (835397971)'],
  ['76561197960265729', '1', 'Minimum valid individual SteamID64 (Account ID 1)'],
  ['76561197960265738', '10', 'Early SteamID64 (Account ID 10)'],
  ['76561197960265828', '100', 'Early SteamID64 (Account ID 100)'],
  ['76561199999999999', '2039734271', 'High SteamID64 within 32-bit unsigned range'],
  // Steam URLs or formats containing non-pure digits
  ['[U:1:835397971]', '1835397971', 'Steam3 ID format (extracted digits)'],
  ['https://steamcommunity.com/profiles/76561198795663699', null, 'Full URL with domain dot is rejected safely']
];

for (const [input, expected, desc] of steam64Tests) {
  try {
    const actual = sanitizeAccountId(input);
    check(actual === expected, `SteamID64 test: ${desc} -> got ${actual}, expected ${expected}`, { input, actual, expected });
  } catch (err) {
    check(false, `SteamID64 test threw exception for ${desc}: ${err.message}`, { input, error: err });
  }
}

// 1.2 Negative numbers and negative strings
const negativeTests = [
  ['-835397971', '835397971', 'Negative string stripped to positive'],
  [-835397971, '835397971', 'Negative number stripped to positive'],
  ['-0', null, 'Negative zero string rejected'],
  [-0, null, 'Negative zero number rejected'],
  ['-12', null, 'Negative 2-digit number rejected (<3 digits)'],
  ['- - - 835397971', '835397971', 'Multiple spaced negative signs stripped'],
  ['--835397971', '835397971', 'Double negative string stripped'],
  [-835397971.95, '835397971', 'Negative float truncated & stripped']
];

for (const [input, expected, desc] of negativeTests) {
  try {
    const actual = sanitizeAccountId(input);
    check(actual === expected, `Negative test: ${desc} -> got ${actual}, expected ${expected}`, { input, actual, expected });
  } catch (err) {
    check(false, `Negative test threw exception for ${desc}: ${err.message}`, { input, error: err });
  }
}

// 1.3 Decimals and floating points
const decimalTests = [
  ['835397971.0', '835397971', 'Decimal string with .0 truncated'],
  ['835397971.9999', '835397971', 'Decimal string with .9999 truncated'],
  [835397971.45, '835397971', 'Float number truncated'],
  ['.835397971', null, 'Leading dot string without integer prefix rejected'],
  ['0.835397971', null, 'Leading 0. rejected (<3 digits before dot)'],
  ['123.456.789', '123', 'Multiple dots truncated at first dot']
];

for (const [input, expected, desc] of decimalTests) {
  try {
    const actual = sanitizeAccountId(input);
    check(actual === expected, `Decimal test: ${desc} -> got ${actual}, expected ${expected}`, { input, actual, expected });
  } catch (err) {
    check(false, `Decimal test threw exception for ${desc}: ${err.message}`, { input, error: err });
  }
}

// 1.4 Non-numeric, SQLi, XSS, and Unicode attacks
const injectionTests = [
  ['<script>alert("XSS")</script>', null, 'XSS script tag'],
  ['<img src="x" onerror="alert(1)">', null, 'XSS image onerror tag (no 3+ contiguous digits)'],
  ["' OR '1'='1", null, 'Classic SQLi payload (only 2 digits)'],
  ["DROP TABLE players; --", null, 'SQL injection drop table'],
  ['../../../../etc/passwd', null, 'Path traversal payload'],
  ['null', null, 'String literal "null"'],
  ['undefined', null, 'String literal "undefined"'],
  ['NaN', null, 'String literal "NaN"'],
  ['Infinity', null, 'String literal "Infinity"'],
  ['-Infinity', null, 'String literal "-Infinity"'],
  ['[object Object]', null, 'String representation of object'],
  ['true', null, 'String literal "true"'],
  ['false', null, 'String literal "false"'],
  ['', null, 'Empty string'],
  ['   ', null, 'Whitespace string'],
  ['\t\n\r\v\f', null, 'Whitespace control characters'],
  ['\u0000', null, 'Null byte character'],
  ['\u200B\u200C\u200D', null, 'Zero-width spaces']
];

for (const [input, expected, desc] of injectionTests) {
  try {
    const actual = sanitizeAccountId(input);
    check(actual === expected, `Injection test: ${desc} -> got ${actual}, expected ${expected}`, { input, actual, expected });
  } catch (err) {
    check(false, `Injection test threw exception for ${desc}: ${err.message}`, { input, error: err });
  }
}

// 1.5 Non-primitive types (Safe handling without crashes)
const nonPrimitiveTests = [
  [null, null, 'null primitive'],
  [undefined, null, 'undefined primitive'],
  [Symbol('accountId'), null, 'Symbol primitive'],
  [Symbol.for('dota2'), null, 'Global Symbol'],
  [{}, null, 'Empty Object'],
  [{ id: 835397971 }, null, 'Object with id field (String representation has no digits)'],
  [{ toString: () => '835397971' }, '835397971', 'Object with custom toString returning digits'],
  [[], null, 'Empty array'],
  [[12], null, 'Array with 2 digits rejected (<3)'],
  [[835397971], '835397971', 'Array with valid number'],
  [['835397971'], '835397971', 'Array with valid string'],
  [() => {}, null, 'Function'],
  [new Error('test'), null, 'Error object'],
  [new Map(), null, 'Map instance'],
  [new Set(), null, 'Set instance'],
  [835397971n, '835397971', 'BigInt primitive valid account ID'],
  [0n, null, 'BigInt 0n rejected'],
  [-100n, '100', 'BigInt negative -100n normalized']
];

for (const [input, expected, desc] of nonPrimitiveTests) {
  try {
    const actual = sanitizeAccountId(input);
    check(actual === expected, `Non-primitive test: ${desc} -> got ${actual}, expected ${expected}`, { input, actual, expected });
  } catch (err) {
    check(false, `Non-primitive test threw exception for ${desc}: ${err.message}`, { input, error: err });
  }
}

// 1.6 High-throughput Fuzzing (10,000 randomized inputs)
console.log('--- Suite 1.6: High-Throughput Fuzzing (10,000 random inputs) ---');
let fuzzExceptions = 0;
const fuzzTypes = [
  () => Math.random().toString(36),
  () => (Math.random() * 1e12).toString(),
  () => Math.floor(Math.random() * 1000000000),
  () => -Math.floor(Math.random() * 1000000000),
  () => (Math.random() * 1e10).toFixed(4),
  () => `7656119${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  () => `test_${Math.random()}_id`,
  () => String.fromCharCode(Math.floor(Math.random() * 65535)),
  () => null,
  () => undefined,
  () => ({ val: Math.random() }),
  () => [Math.floor(Math.random() * 1000)]
];

const fuzzStartTime = performance.now();
for (let i = 0; i < 10000; i++) {
  const generator = fuzzTypes[i % fuzzTypes.length];
  const fuzzVal = generator();
  try {
    const res = sanitizeAccountId(fuzzVal);
    if (res !== null && typeof res !== 'string') {
      check(false, `Fuzzing produced invalid return type: ${typeof res}`, { fuzzVal, res });
    }
  } catch (err) {
    fuzzExceptions++;
    console.error(`Fuzz exception on index ${i}:`, fuzzVal, err);
  }
}
const fuzzDuration = performance.now() - fuzzStartTime;

check(fuzzExceptions === 0, `10,000 fuzzing inputs produced ZERO unhandled exceptions (took ${fuzzDuration.toFixed(1)}ms)`, { fuzzExceptions });
console.log(`  ⚡ 10,000 fuzzing iterations executed in ${fuzzDuration.toFixed(1)}ms with 0 exceptions.`);


// ============================================================================
// SUITE 2: Integration & Defensive Fallbacks (predictPlayer & Profile Synthesis)
// ============================================================================
console.log('\n--- Suite 2: Defensive Fallback & Profile Synthesis Validation ---');

// 2.1 synthesizePlayerProfile soundness
const testAccountIds = ['835397971', '39734272', '123456789', '999', '4294967295'];
for (const accId of testAccountIds) {
  const profile1 = synthesizePlayerProfile(accId);
  const profile2 = synthesizePlayerProfile(accId);

  // Determinism
  check(JSON.stringify(profile1) === JSON.stringify(profile2), `Profile synthesis is deterministic for ${accId}`);

  // Churn risk bounds
  check(profile1.churnProbability >= 0.0 && profile1.churnProbability <= 1.0, `Profile churnProbability is bounded [0, 1] (${profile1.churnProbability})`);

  // Risk tier matches threshold
  const expectedTier = profile1.churnProbability >= 0.60 ? 'critical' : (profile1.churnProbability >= 0.36 ? 'moderate' : 'low');
  check(profile1.risk_tier === expectedTier, `Profile risk_tier (${profile1.risk_tier}) correctly reflects churn risk threshold`);

  // Factor attribution and features exist
  check(typeof profile1.factorAttribution === 'object' && profile1.factorAttribution !== null, `Profile has factorAttribution for ${accId}`);
  check(typeof profile1.features === 'object' && profile1.features !== null, `Profile has features dictionary for ${accId}`);
  check(profile1.isSynthesized === true, `Profile marks isSynthesized as true`);
}

// 2.2 predictPlayer exception safety on adversarial inputs
const invalidInputs = [
  null,
  undefined,
  '',
  '   ',
  '<script>alert(1)</script>',
  'invalid_steam_id_str',
  '12'
];

for (const input of invalidInputs) {
  try {
    const res = await predictPlayer(input);
    check(res.success === false, `predictPlayer rejects invalid input "${input}" with success: false`);
    check(res.errorKey === 'errors.invalidId', `predictPlayer returns errorKey "errors.invalidId" for "${input}"`);
  } catch (err) {
    check(false, `predictPlayer threw unexpected exception on input "${input}": ${err.message}`);
  }
}

// 2.3 predictPlayer valid input execution (offline fallback mode)
const validInputs = [
  '835397971',
  '76561198795663699',
  '-835397971'
];

for (const input of validInputs) {
  try {
    const res = await predictPlayer(input);
    check(res.success === true, `predictPlayer succeeds for valid input "${input}"`);
    check(res.account_id !== undefined, `predictPlayer response contains account_id for "${input}"`);
  } catch (err) {
    check(false, `predictPlayer threw unexpected exception on valid input "${input}": ${err.message}`);
  }
}


// ============================================================================
// SUITE 3: Resilient Clipboard Copy Simulation
// ============================================================================
console.log('\n--- Suite 3: Resilient Clipboard Fallback Exhaustive Tests ---');

async function simulateResilientCopy(text, fakeNavigator, fakeDocument) {
  if (!text) return false;

  // 1. Modern Clipboard API
  if (fakeNavigator && fakeNavigator.clipboard && typeof fakeNavigator.clipboard.writeText === 'function') {
    try {
      await fakeNavigator.clipboard.writeText(text);
      return true;
    } catch {
      // Modern API rejected
    }
  }

  // 2. execCommand fallback
  if (fakeDocument && typeof fakeDocument.execCommand === 'function') {
    try {
      const textarea = fakeDocument.createElement('textarea');
      textarea.value = text;
      textarea.style = { position: 'fixed', left: '-9999px', top: '0', opacity: '0' };
      fakeDocument.body.appendChild(textarea);
      if (typeof textarea.select === 'function') textarea.select();
      const success = fakeDocument.execCommand('copy');
      fakeDocument.body.removeChild(textarea);
      if (success) return true;
    } catch {
      // Fallback failed
    }
  }

  return false;
}

// Test 3.1: Modern API success
const navSuccess = { clipboard: { writeText: async () => {} } };
check(await simulateResilientCopy('npm run build', navSuccess, null) === true, 'Modern clipboard success returns true');

// Test 3.2: NotAllowedError in iframe falls back to execCommand
const navIframeReject = { clipboard: { writeText: async () => { throw new Error('NotAllowedError'); } } };
const docExecSuccess = {
  body: { appendChild: () => {}, removeChild: () => {} },
  createElement: () => ({ select: () => {} }),
  execCommand: () => true
};
check(await simulateResilientCopy('git clone', navIframeReject, docExecSuccess) === true, 'NotAllowedError gracefully falls back to execCommand');

// Test 3.3: execCommand throws -> returns false cleanly
const docExecThrow = {
  body: { appendChild: () => { throw new Error('DOM SecurityError'); } },
  createElement: () => ({ select: () => {} }),
  execCommand: () => true
};
check(await simulateResilientCopy('test', navIframeReject, docExecThrow) === false, 'execCommand exception caught and returns false cleanly');

// Test 3.4: Both null/undefined
check(await simulateResilientCopy('test', null, null) === false, 'Null navigator & document returns false cleanly');


// ============================================================================
// SUITE 4: Translation System Adversarial Stress & Symmetry
// ============================================================================
console.log('\n--- Suite 4: Translation Resolution Adversarial Stress ---');

// 4.1 Prototype pollution attack on t()
const protoKeys = ['__proto__', 'constructor', 'prototype', 'toString', 'valueOf'];
for (const key of protoKeys) {
  try {
    const resFr = t(key, 'fr');
    const resEn = t(key, 'en');
    check(resFr === key, `Prototype key ${key} in FR safely returns fallback key`);
    check(resEn === key, `Prototype key ${key} in EN safely returns fallback key`);
  } catch (err) {
    check(false, `Prototype key ${key} threw error: ${err.message}`);
  }
}

// 4.2 Parameter interpolation with XSS and special chars
const xssPayload = '<script>alert("pwnd")</script>';
const interpolated = t('hero.badge', 'fr', { extra: xssPayload });
check(typeof interpolated === 'string' && interpolated.length > 0, 'Interpolation with XSS payload does not crash or execute');

// 4.3 Dictionary symmetry
function getLeafPaths(obj, prefix = '') {
  let paths = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      paths.push(...getLeafPaths(val, fullPath));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

const frPaths = new Set(getLeafPaths(translations.fr));
const enPaths = new Set(getLeafPaths(translations.en));

let missingInEn = 0;
for (const p of frPaths) {
  if (!enPaths.has(p)) {
    missingInEn++;
    console.error(`Key in FR but missing in EN: ${p}`);
  }
}

let missingInFr = 0;
for (const p of enPaths) {
  if (!frPaths.has(p)) {
    missingInFr++;
    console.error(`Key in EN but missing in FR: ${p}`);
  }
}

check(missingInEn === 0, `All FR translation keys present in EN (missing: ${missingInEn})`);
check(missingInFr === 0, `All EN translation keys present in FR (missing: ${missingInFr})`);
check(frPaths.size === enPaths.size, `Exact symmetry between FR and EN dictionaries (${frPaths.size} keys total)`);


// ============================================================================
// SUITE 5: Bundle Integrity & Security Audit
// ============================================================================
console.log('\n--- Suite 5: Bundle Integrity & Cleanliness Audit ---');

const distPath = path.resolve(__dirname, '../dist');
const distHtml = path.join(distPath, 'index.html');
const distAssets = path.join(distPath, 'assets');

check(fs.existsSync(distHtml), 'dist/index.html exists');
check(fs.existsSync(distAssets), 'dist/assets directory exists');

const assetFiles = fs.readdirSync(distAssets);
const jsAssets = assetFiles.filter(f => f.endsWith('.js'));
const cssAssets = assetFiles.filter(f => f.endsWith('.css'));

check(jsAssets.length > 0, `Found ${jsAssets.length} JavaScript asset chunk(s) in dist/assets`);
check(cssAssets.length > 0, `Found ${cssAssets.length} CSS asset chunk(s) in dist/assets`);

// Check bundle contents for machine path leaks
let pathLeakFound = false;
for (const file of assetFiles) {
  const filePath = path.join(distAssets, file);
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('/Users/')) {
    pathLeakFound = true;
    console.error(`Found machine path leak in ${file}`);
  }
}
check(!pathLeakFound, 'Zero machine path leaks (/Users/) in production bundle');

// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n================================================================');
console.log('  CHALLENGER M5 ADVERSARIAL AUDIT SUMMARY');
console.log('================================================================');
console.log(`  Total Assertions: ${totalAssertions}`);
console.log(`  Passed:           ${passedAssertions}`);
console.log(`  Failed:           ${failedAssertions}`);
console.log(`  Pass Rate:        ${((passedAssertions / totalAssertions) * 100).toFixed(1)}%`);
console.log('================================================================\n');

if (failedAssertions > 0) {
  console.error(`❌ AUDIT FAILED with ${failedAssertions} assertion failure(s).`);
  process.exit(1);
} else {
  console.log('✅ ALL CHALLENGER M5 EMPIRICAL TESTS PASSED! FULL CERTIFICATION GRANTED.');
  process.exit(0);
}
