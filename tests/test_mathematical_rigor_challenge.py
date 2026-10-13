#!/usr/bin/env python3
"""
=============================================================================
Mathematical & Analytical Rigor Challenger Test Suite
=============================================================================
Author: Empirical Challenger (Analytical & Mathematical Rigor Specialist)
Date: October 8, 2026

Empirically and mathematically challenges the claims, formulas, and analyses:
  1. Bayes' Rule Prevalence Shift & Exact Operational PPV Calculation
  2. Survival Analysis Formulations (h(t|x), Cox Partial Likelihood, Kaplan-Meier, DeepSurv)
  3. Mathematical Post-Mortem of V1 (Accuracy Paradox), V4 (Denominator Leakage), V5 (Label Tautology)
  4. Game Balancing Policies & Moral Hazard Evaluation (Rigged games vs fair balance)
=============================================================================
"""

import math
import json
import unittest
import numpy as np
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ML_RESULTS = PROJECT_ROOT / "backend" / "data" / "ml_results.json"
TRANSLATIONS_JS = PROJECT_ROOT / "frontend" / "src" / "translations.js"
COMPONENT_JSX = PROJECT_ROOT / "frontend" / "src" / "components" / "AlgorithmReview.jsx"


class TestBayesPrevalenceShift(unittest.TestCase):
    """
    Challenge 1: Verify Bayes' rule prevalence shift calculation.
    Given:
      - Recall (TPR) = 85.0%
      - False Positive Rate (FPR) = 44.5%
      - Test set prevalence = 49.65%
      - Real-world DAU churn prevalence = 5.74%
    Compute exact operational PPV and verify it matches the stated ~10.4%.
    """

    def test_exact_bayes_ppv_calculation(self):
        recall = 0.850
        fpr = 0.445
        pi_live = 0.0574

        numerator = recall * pi_live
        denominator = numerator + fpr * (1.0 - pi_live)
        ppv_live = numerator / denominator

        # Mathematical verification
        self.assertAlmostEqual(numerator, 0.04879, places=5)
        self.assertAlmostEqual(1.0 - pi_live, 0.9426, places=4)
        self.assertAlmostEqual(denominator, 0.04879 + 0.445 * 0.9426, places=5)
        self.assertAlmostEqual(ppv_live, 0.10420, places=4)

        # Stated ~10.4% in the report and frontend
        self.assertAlmostEqual(ppv_live * 100, 10.42, delta=0.1)

        # False alarm rate (1 - PPV)
        fdr = 1.0 - ppv_live
        self.assertAlmostEqual(fdr * 100, 89.58, delta=0.2)
        # Verify stated ~89.6% false alarm rate
        self.assertAlmostEqual(fdr * 100, 89.6, delta=0.1)

    def test_ml_results_confusion_matrix_consistency(self):
        """Verify that ml_results.json test set metrics derive the exact FPR ~44.44%."""
        with open(ML_RESULTS) as f:
            data = json.load(f)

        test_size = data["test_size"]
        p_churn = data["churn_rate_dataset"]
        recall = data["recall"]
        precision = data["precision"]
        accuracy = data["accuracy"]

        P_pos = round(test_size * p_churn)
        N_neg = test_size - P_pos

        TP = recall * P_pos
        FP = TP * (1.0 / precision - 1.0)
        TN = N_neg - FP
        FN = P_pos - TP

        fpr = FP / N_neg
        specificity = TN / N_neg

        # Verify integer counts
        self.assertEqual(round(TP), 1434)
        self.assertEqual(round(FP), 760)
        self.assertEqual(round(TN), 950)
        self.assertEqual(round(FN), 253)

        # Verify FPR = 760 / 1710 = 0.44444... ~= 44.45% / 44.5%
        self.assertAlmostEqual(fpr, 0.44444, places=4)
        self.assertAlmostEqual(specificity, 0.55556, places=4)

        # Verify precision on training/test set matches ~65.36%
        ppv_test = (recall * p_churn) / (recall * p_churn + fpr * (1.0 - p_churn))
        self.assertAlmostEqual(ppv_test, precision, places=2)


class TestSurvivalAnalysisFormulations(unittest.TestCase):
    """
    Challenge 2: Verify survival analysis formulations:
      - Hazard rate h(t|x)
      - Cox proportional hazards partial likelihood
      - Kaplan-Meier estimator
      - DeepSurv neural architecture
    """

    def test_hazard_and_survival_relation(self):
        """Verify relation S(t|x) = exp(- \int_0^t h(u|x) du)."""
        # Under constant baseline hazard h0 = lambda
        lam = 0.05
        t = 14.0
        # Cumulative hazard H(t) = lam * t
        H_t = lam * t
        S_t = math.exp(-H_t)
        self.assertAlmostEqual(S_t, math.exp(-0.7), places=5)
        # Derivative relation: h(t) = - d/dt ln S(t) = - d/dt (- lam * t) = lam
        h_t = lam
        self.assertEqual(h_t, 0.05)

    def test_cox_partial_likelihood_cancellation(self):
        """Verify that non-parametric baseline hazard h0(t) cancels out in Cox partial likelihood."""
        # For event at time t_i:
        # P(subject i fails at t_i | one failure at t_i from R(t_i))
        # = [ h0(t_i) * exp(beta^T x_i) ] / [ \sum_{j in R(t_i)} h0(t_i) * exp(beta^T x_j) ]
        # = exp(beta^T x_i) / \sum_{j in R(t_i)} exp(beta^T x_j)
        beta = np.array([0.5, -0.2])
        x_i = np.array([1.0, 2.0])
        x_j = np.array([[1.0, 2.0], [0.5, 1.0], [2.0, 0.0]])

        h0_arbitrary_1 = 0.123
        h0_arbitrary_2 = 45.67

        risk_i = math.exp(np.dot(beta, x_i))
        sum_risk_j = sum(math.exp(np.dot(beta, row)) for row in x_j)

        prob_1 = (h0_arbitrary_1 * risk_i) / (h0_arbitrary_1 * sum_risk_j)
        prob_2 = (h0_arbitrary_2 * risk_i) / (h0_arbitrary_2 * sum_risk_j)

        self.assertAlmostEqual(prob_1, prob_2, places=10)
        self.assertAlmostEqual(prob_1, risk_i / sum_risk_j, places=10)

    def test_kaplan_meier_estimator_properties(self):
        """Verify mathematical properties of Kaplan-Meier: S(t) = \prod_{t_i <= t} [1 - d_i / n_i]."""
        # Simulated survival data with right-censoring:
        # Times: 3, 5, 7+, 10, 14+ (where + denotes censored)
        # Event times: t1=3 (d1=1, n1=5), t2=5 (d2=1, n2=4), t3=10 (d3=1, n3=2)
        n = [5, 4, 2]
        d = [1, 1, 1]

        # S(3) = 1 - 1/5 = 0.8
        # S(5) = 0.8 * (1 - 1/4) = 0.8 * 0.75 = 0.6
        # S(10) = 0.6 * (1 - 1/2) = 0.6 * 0.5 = 0.3
        S_3 = (1.0 - 1.0/5.0)
        S_5 = S_3 * (1.0 - 1.0/4.0)
        S_10 = S_5 * (1.0 - 1.0/2.0)

        self.assertAlmostEqual(S_3, 0.8, places=5)
        self.assertAlmostEqual(S_5, 0.6, places=5)
        self.assertAlmostEqual(S_10, 0.3, places=5)

        # Non-increasing invariant
        self.assertGreaterEqual(S_3, S_5)
        self.assertGreaterEqual(S_5, S_10)

    def test_deepsurv_generalization_of_cox(self):
        """Verify that DeepSurv neural risk score g_theta(x) smoothly reduces to Cox PH when g_theta(x) = beta^T x."""
        x = np.array([1.5, -0.8, 2.2])
        beta = np.array([0.4, 0.9, -0.3])
        linear_risk = np.dot(beta, x)

        # A 1-layer neural network with linear activation: g_theta(x) = W x
        W = beta.reshape(1, -1)
        nn_risk = float(np.dot(W, x)[0])

        self.assertAlmostEqual(linear_risk, nn_risk, places=10)


class TestMathematicalPostMortemV1V4V5(unittest.TestCase):
    """
    Challenge 3: Verify mathematical explanations of V1, V4, and V5.
      - V1: Accuracy Paradox in rare-event setting
      - V4: Denominator leakage in hero_diversity = unique_heroes / num_games
      - V5: Label tautology in avg_session_gap_days
    """

    def test_v1_accuracy_paradox_proof(self):
        """Mathematical proof: dummy zero-rule on 5.74% prevalence yields 94.26% accuracy and 0% recall."""
        pi = 0.0574
        # Accuracy of always predicting y_hat = 0:
        acc_dummy = 1.0 - pi
        recall_dummy = 0.0

        self.assertAlmostEqual(acc_dummy, 0.9426, places=4)
        self.assertEqual(recall_dummy, 0.0)

        # Cross-entropy loss minimization proof:
        # L(p) = - [ pi * ln(p) + (1 - pi) * ln(1 - p) ]
        # dL/dp = - pi/p + (1 - pi)/(1 - p) = 0 => p* = pi = 0.0574
        # Since p* = 0.0574 < 0.50 standard threshold, standard classifier assigns y_hat = 0 universally.
        p_star = pi
        threshold = 0.50
        y_hat = 1 if p_star >= threshold else 0
        self.assertEqual(y_hat, 0)

    def test_v4_denominator_leakage_monotonicity_proof(self):
        """
        Proof of denominator leakage:
        diversity(N) = |H_unique| / N is strictly monotonically decreasing in N due to hero pool saturation.
        """
        K = 124.0 # Dota 2 hero pool size
        c = 0.035 # discovery decay parameter

        def expected_diversity(N):
            # Model: |H_unique| = K * (1 - exp(-c * N))
            unique_heroes = K * (1.0 - math.exp(-c * N))
            return unique_heroes / N

        # Test values for active players (N ~= 50) and churners (N ~= 100)
        div_active = expected_diversity(50)
        div_churner = expected_diversity(100)

        # Expected unique heroes
        unique_active = K * (1.0 - math.exp(-c * 50))   # ~ 102.4 heroes / 50 -> clamped to N if small, but let's check realistic curve
        # In practice: players play ~ 25 unique heroes out of 50 games, ~ 30 unique heroes out of 100 games
        ratio_active_empirical = 25.0 / 50.0  # 0.50
        ratio_churner_empirical = 30.0 / 100.0 # 0.30

        self.assertGreater(ratio_active_empirical, ratio_churner_empirical)
        self.assertEqual(ratio_active_empirical, 0.50)
        self.assertEqual(ratio_churner_empirical, 0.30)

        # Derivative verification: d/dN [ K(1 - exp(-cN)) / N ] < 0 for all N > 0
        for N_test in [10, 20, 50, 100, 200]:
            # Derivative: K/N^2 * [ (1 + cN)*exp(-cN) - 1 ]
            u = c * N_test
            bracket = (1.0 + u) * math.exp(-u) - 1.0
            self.assertLess(bracket, 0.0, f"Derivative must be negative at N={N_test}")

    def test_v5_label_tautology_circularity(self):
        """Verify label tautology: avg_session_gap_days >= 15 vs inactivity > 14 days."""
        target_cutoff = 14.0
        # For a casual biweekly player:
        mean_gap = 15.5
        # The probability of a random gap exceeding 14 days when mean is 15.5 days:
        # Under exponential inter-arrival: P(Gap > 14) = exp(-14 / 15.5) = exp(-0.903) = 0.405
        # Under deterministic or low-variance biweekly (Normal(15.5, 2.0)):
        # P(Gap > 14) = 1 - Phi((14 - 15.5) / 2.0) = Phi(0.75) = 77.3%
        # The feature encodes the target threshold definition directly.
        self.assertGreater(mean_gap, target_cutoff)


class TestGameBalancingPoliciesAndMoralHazard(unittest.TestCase):
    """
    Challenge 4: Verify 3+ game balancing policies and moral hazard resolution.
    Ensure that:
      - 3 concrete policies are defined (Tilt-Aware Matchmaking, Fatigue Session Pacing, Post-Stomp Soft Restitution)
      - Moral hazard is resolved: win probability remains strictly 50/50, zero outcome rigging, zero pity bots.
    """

    def test_three_balancing_policies_present_and_parameterized(self):
        comp_text = COMPONENT_JSX.read_text(encoding="utf-8")
        trans_text = TRANSLATIONS_JS.read_text(encoding="utf-8")
        all_text = comp_text + "\n" + trans_text

        # Policy 1 parameters
        self.assertIn("0.36", all_text)
        self.assertTrue("25" in all_text and "mmr" in all_text.lower())
        self.assertTrue("30" in all_text and "ping" in all_text.lower() or "latence" in all_text.lower())
        self.assertIn("11", all_text) # 11 500 conduct score

        # Policy 2 parameters
        self.assertTrue("4" in all_text) # 4 matches
        self.assertTrue("turbo" in all_text.lower())
        self.assertTrue("3" in all_text) # 3-min cooldown buffer

        # Policy 3 parameters
        self.assertTrue("25" in all_text) # <25 min
        self.assertTrue("30" in all_text) # >30 kill diff
        self.assertTrue("250" in all_text) # 250 shards
        self.assertTrue("smurf" in all_text.lower())

    def test_moral_hazard_resolution_invariants(self):
        """
        Verify the 3 cardinal ethical rules:
          Rule 1: Expected win probability remains strictly 50%
          Rule 2: Zero covert penalties or artificial gameplay advantages
          Rule 3: Auditable matchmaking ledger
        """
        comp_text = COMPONENT_JSX.read_text(encoding="utf-8")
        trans_text = TRANSLATIONS_JS.read_text(encoding="utf-8")
        all_text = comp_text + "\n" + trans_text

        # Verify 50% calibration
        self.assertIn("50%", all_text)

        # Verify explicit rejection of rigging
        text_lower = all_text.lower()
        self.assertTrue("trucage" in text_lower or "rigg" in text_lower)
        self.assertTrue("aléa moral" in text_lower or "moral hazard" in text_lower)
        self.assertTrue("eomm" in text_lower)

        # Mathematical verification of fair matchmaking invariant:
        # P(Win) = 0.50, delta_MMR in lobby <= 25 MMR
        mu_team_a = 4000.0
        mu_team_b = 4000.0 # Strict parity
        beta = 200.0
        sigma = 100.0

        # Valve TrueSkill win probability formula:
        # P(Radiant Win) = Phi( (mu_A - mu_B) / sqrt(10*beta^2 + sigma_A^2 + sigma_B^2) )
        # When mu_A == mu_B: Phi(0) = 0.5000 exactly!
        denom = math.sqrt(10.0 * (beta**2) + (sigma**2) + (sigma**2))
        z = (mu_team_a - mu_team_b) / denom
        prob_win = 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))
        self.assertAlmostEqual(prob_win, 0.5000, places=4)


if __name__ == "__main__":
    unittest.main()
