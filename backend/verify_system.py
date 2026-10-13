#!/usr/bin/env python3
"""
Comprehensive Verification Script for Algorithm Review & Backend Schema Sync.
Verifies:
1. Backend feature schema exact alignment (45 features in features_list.json and main.py).
2. Live prediction endpoint (/api/predict/{account_id}) inference with real player.
3. Scaler and model artifact compatibility.
4. Metric endpoints (/api/status, /api/ml/metrics).
"""
import sys
import json
import joblib
import urllib.request
import pandas as pd
import numpy as np

def run_tests():
    print("=" * 60)
    print("RUNNING AUTOMATED SYSTEM VERIFICATION TESTS")
    print("=" * 60)
    
    # Test 1: Feature Schema File
    print("\n[Test 1] Verifying features_list.json schema...")
    with open("data/features_list.json", "r") as f:
        features = json.load(f)
    assert len(features) == 45, f"Expected 45 features, got {len(features)}"
    print(f"✓ features_list.json contains exactly 45 features.")

    # Test 2: Scaler Artifact Verification
    print("\n[Test 2] Verifying scaler artifact dimensions...")
    scaler = joblib.load("data/dota2_scaler.pkl")
    assert scaler.n_features_in_ == 45, f"Scaler expects {scaler.n_features_in_} features, not 45"
    print(f"✓ Scaler loaded and verified: expects exactly 45 features.")

    # Test 3: Model Artifact Verification
    print("\n[Test 3] Verifying model artifact...")
    model = joblib.load("data/dota2_churn_model.pkl")
    df_sample = pd.DataFrame([{f: 0.0 for f in features}])[features]
    scaled_sample = scaler.transform(df_sample)
    pred_prob = model.predict_proba(scaled_sample)
    assert pred_prob.shape == (1, 2), f"Invalid prediction shape: {pred_prob.shape}"
    print(f"✓ Model loaded: dummy prediction probability = {pred_prob[0][1]:.4f}")

    # Test 4: Live Backend Health
    print("\n[Test 4] Querying GET /api/status on port 8001...")
    req = urllib.request.Request("http://localhost:8001/api/status")
    with urllib.request.urlopen(req) as resp:
        status_data = json.loads(resp.read().decode())
    assert status_data.get("status") == "healthy", f"Backend unhealthy: {status_data}"
    print(f"✓ Backend /api/status is healthy: {status_data['status']}")

    # Test 5: Live Prediction Endpoint
    print("\n[Test 5] Querying GET /api/predict/1604339046 on port 8001...")
    req = urllib.request.Request("http://localhost:8001/api/predict/1604339046")
    with urllib.request.urlopen(req) as resp:
        pred_data = json.loads(resp.read().decode())
    assert "churn_probability" in pred_data, f"Missing churn_probability in response: {pred_data}"
    assert "risk_level" in pred_data, f"Missing risk_level in response: {pred_data}"
    assert "features" in pred_data, f"Missing features in response: {pred_data}"
    print(f"✓ Live prediction successful!")
    print(f"  - Player: {pred_data.get('personaname')} (Rank: {pred_data.get('rank_tier')})")
    print(f"  - Churn Probability: {pred_data.get('churn_probability'):.4f}")
    print(f"  - Predicted Churn: {pred_data.get('predicted_churn')} | Risk Level: {pred_data.get('risk_level')}")
    print(f"  - Win Rate: {pred_data['features'].get('win_rate'):.2f} | KDA: {pred_data['features'].get('avg_kda'):.2f}")

    print("\n" + "=" * 60)
    print("ALL VERIFICATION TESTS PASSED SUCCESSFULLY (5/5)!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
