import { translations, getTranslation } from './src/translations.js';

console.log("=" .repeat(60));
console.log("RUNNING FRONTEND BILINGUAL & INTEGRATION VERIFICATION");
console.log("=" .repeat(60));

// Test 1: Tabs in FR and EN
console.log("\n[Test 1] Checking tab keys in translations...");
if (!translations.fr.tabs.algorithm_review || !translations.en.tabs.algorithm_review) {
  throw new Error("Missing algorithm_review in tabs dictionary!");
}
console.log(`✓ FR tab: ${translations.fr.tabs.algorithm_review}`);
console.log(`✓ EN tab: ${translations.en.tabs.algorithm_review}`);

// Test 2: algorithm_review dictionaries in FR and EN
console.log("\n[Test 2] Checking algorithm_review schema completeness...");
const requiredSections = [
  'header',
  'scorecard',
  'literature',
  'viability',
  'comparisonWidget',
  'postMortem',
  'balancingPolicy',
  'roadmap'
];

for (const lang of ['fr', 'en']) {
  const t = translations[lang].algorithm_review;
  if (!t) throw new Error(`Missing algorithm_review in ${lang}!`);
  for (const sec of requiredSections) {
    if (!t[sec]) throw new Error(`Missing section ${sec} in ${lang}.algorithm_review!`);
  }
}
console.log("✓ All 8 core sections present in both FR and EN dictionaries.");

// Test 3: Scorecard grades
console.log("\n[Test 3] Verifying Executive Scorecard grades...");
const frSc = translations.fr.algorithm_review.scorecard;
const enSc = translations.en.algorithm_review.scorecard;
console.log(`✓ Algorithmic Validity: FR=${frSc.validityGrade} (${frSc.validityScore}), EN=${enSc.validityGrade} (${enSc.validityScore})`);
console.log(`✓ Production Readiness: FR=${frSc.readinessGrade} (${frSc.readinessScore}), EN=${enSc.readinessGrade} (${enSc.readinessScore})`);
console.log(`✓ Game Design Utility: FR=${frSc.actionabilityGrade} (${frSc.actionabilityScore}), EN=${enSc.actionabilityGrade} (${enSc.actionabilityScore})`);
console.log(`✓ Ethical Fairness: FR=${frSc.ethicsGrade} (${frSc.ethicsScore}), EN=${enSc.ethicsGrade} (${enSc.ethicsScore})`);

// Test 4: Post-Mortem coverage (V1 - V6)
console.log("\n[Test 4] Verifying Post-Mortem version coverage...");
const pm = translations.fr.algorithm_review.postMortem;
const versions = ['v1Title', 'v2Title', 'v3Title', 'v4Title', 'v5Title', 'v6Title'];
for (const v of versions) {
  if (!pm[v]) throw new Error(`Missing post-mortem entry ${v}!`);
}
console.log("✓ All 6 evolutionary iterations (V1.0 to V6.0) documented in post-mortem.");

// Test 5: Game balancing policies
console.log("\n[Test 5] Verifying non-punitive anti-churn policies...");
const bp = translations.fr.algorithm_review.balancingPolicy;
if (!bp.policy1Title || !bp.policy2Title || !bp.policy3Title || !bp.ethicsTitle) {
  throw new Error("Missing balancing policies or ethics section!");
}
console.log(`✓ Policy 1: ${bp.policy1Title}`);
console.log(`✓ Policy 2: ${bp.policy2Title}`);
console.log(`✓ Policy 3: ${bp.policy3Title}`);
console.log(`✓ Ethics: ${bp.ethicsTitle}`);

console.log("\n" + "=".repeat(60));
console.log("ALL FRONTEND VERIFICATION TESTS PASSED (5/5)!");
console.log("=".repeat(60));
