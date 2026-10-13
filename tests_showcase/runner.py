#!/usr/bin/env python3
"""
=============================================================================
Automated E2E Test Runner — Dota 2 Showcase Frontend
=============================================================================
Runs all 4 tiers or individual tiers with formatted reporting.
Returns exit code 0 when all tests pass, exit code 1 on failure.

Usage:
  python3 tests_showcase/runner.py              # Run all tiers (Tiers 1-4)
  python3 tests_showcase/runner.py --tier 1     # Run Tier 1 (Feature Coverage)
  python3 tests_showcase/runner.py --tier 2     # Run Tier 2 (Boundary & Corner Cases)
  python3 tests_showcase/runner.py --tier 3     # Run Tier 3 (Cross-Feature Combinations)
  python3 tests_showcase/runner.py --tier 4     # Run Tier 4 (Real-World Application Scenarios)
  python3 tests_showcase/runner.py --verbose    # Detailed test case output
=============================================================================
"""

import sys
import time
import argparse
import unittest
from pathlib import Path

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from tests_showcase import (
    test_tier1_features,
    test_tier2_boundaries,
    test_tier3_cross_features,
    test_tier4_real_world,
)

# Tier Definitions
TIERS = {
    1: {
        "name": "Tier 1: Feature Coverage (F1 - F11)",
        "module": test_tier1_features,
        "description": "55+ tests verifying core behavior across all 11 features",
    },
    2: {
        "name": "Tier 2: Boundary & Corner Cases",
        "module": test_tier2_boundaries,
        "description": "55+ tests verifying extreme inputs, 0 deaths, 320px/4K, and offline failures",
    },
    3: {
        "name": "Tier 3: Cross-Feature Combinations",
        "module": test_tier3_cross_features,
        "description": "13+ tests verifying pairwise subsystem interactions and synchronization",
    },
    4: {
        "name": "Tier 4: Real-World Application Scenarios",
        "module": test_tier4_real_world,
        "description": "9+ tests verifying end-to-end user workflows and public clone experience",
    },
}

MILESTONE_TIER_MAP = {
    "M1": [1, 2],
    "M2": [1, 2],
    "M3": [1, 2, 3],
    "M4": [1, 2, 3, 4],
    "M5": [1, 2, 3, 4],
}


def run_tier(tier_id: int, verbose: bool = False):
    tier_info = TIERS[tier_id]
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromModule(tier_info["module"])

    start_time = time.time()
    verbosity = 2 if verbose else 1
    runner = unittest.TextTestRunner(verbosity=verbosity)
    result = runner.run(suite)
    duration = time.time() - start_time

    return result, duration


def main():
    parser = argparse.ArgumentParser(
        description="Automated E2E Test Runner — Dota 2 Public Showcase Frontend"
    )
    parser.add_argument(
        "--tier",
        type=int,
        choices=[1, 2, 3, 4],
        help="Execute only the specified tier (1, 2, 3, or 4)",
    )
    parser.add_argument(
        "--milestone",
        type=str,
        choices=["M1", "M2", "M3", "M4", "M5"],
        help="Execute tiers associated with milestone",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Print verbose test execution details",
    )
    args = parser.parse_args()

    # Determine which tiers to run
    if args.tier:
        tiers_to_run = [args.tier]
    elif args.milestone:
        tiers_to_run = MILESTONE_TIER_MAP.get(args.milestone, [1, 2, 3, 4])
    else:
        tiers_to_run = [1, 2, 3, 4]

    print("\n" + "=" * 76)
    print("  DOTA 2 CHURN & TILT PREDICTION — PUBLIC SHOWCASE FRONTEND")
    print("  AUTOMATED 4-TIER E2E TEST RUNNER")
    print("=" * 76)
    print(f"  Target Workspace: {PROJECT_ROOT}")
    print(f"  Active Tiers:     {tiers_to_run}")
    print("=" * 76 + "\n")

    overall_start = time.time()
    tier_results = []
    total_tests = 0
    total_failures = 0
    total_errors = 0

    for t_id in tiers_to_run:
        tier_meta = TIERS[t_id]
        print(f"\n▶ Running {tier_meta['name']}...")
        print(f"  Scope: {tier_meta['description']}")
        print("-" * 76)

        result, duration = run_tier(t_id, verbose=args.verbose)
        test_count = result.testsRun
        fails = len(result.failures)
        errs = len(result.errors)

        total_tests += test_count
        total_failures += fails
        total_errors += errs

        tier_results.append({
            "tier_id": t_id,
            "name": tier_meta["name"],
            "tests": test_count,
            "failures": fails,
            "errors": errs,
            "duration": duration,
            "passed": fails == 0 and errs == 0,
        })

    total_duration = time.time() - overall_start

    # Print Summary Table
    print("\n" + "=" * 76)
    print("  TEST EXECUTION SUMMARY REPORT")
    print("=" * 76)
    print(f"  {'Tier / Test Suite':<46} | {'Tests':<6} | {'Status':<8} | {'Time':<7}")
    print("-" * 76)

    for tr in tier_results:
        status_str = "PASSED" if tr["passed"] else "FAILED"
        print(f"  {tr['name']:<46} | {tr['tests']:<6} | {status_str:<8} | {tr['duration']:.3f}s")

    print("-" * 76)
    pass_rate = 100.0 if (total_tests > 0 and total_failures == 0 and total_errors == 0) else 0.0
    print(f"  TOTAL TESTS RUN:   {total_tests}")
    print(f"  TOTAL FAILURES:    {total_failures}")
    print(f"  TOTAL ERRORS:      {total_errors}")
    print(f"  PASS RATE:         {pass_rate:.1f}%")
    print(f"  TOTAL DURATION:    {total_duration:.3f} seconds")
    print("=" * 76)

    if total_failures == 0 and total_errors == 0 and total_tests >= 127:
        print("\n✅ ALL TESTS PASSED! TEST SUITE COMPLETE & OPERATIONAL (>= 127 TESTS)\n")
        sys.exit(0)
    elif total_failures == 0 and total_errors == 0:
        print(f"\n✅ ALL TESTS PASSED! ({total_tests} tests executed)\n")
        sys.exit(0)
    else:
        print(f"\n❌ TEST RUN FAILED with {total_failures} failure(s) and {total_errors} error(s).\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
