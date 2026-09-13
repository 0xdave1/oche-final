import test from "node:test";
import assert from "node:assert/strict";

import { computeDashboardMetrics, defaultSimulationParams, round } from "../app/lib/calculations";

test("default parameters reproduce thesis baseline outputs", () => {
  const metrics = computeDashboardMetrics(defaultSimulationParams);

  assert.equal(round(metrics.peakObservation.totalCurrent, 1), 122.2);
  assert.equal(round(metrics.peakObservation.apparentPower, 2), 26.88);
  assert.equal(round(metrics.peakObservation.realPower, 2), 24.2);

  assert.equal(round(metrics.dailyEnergy.Monday, 2), 91.73);
  assert.equal(round(metrics.dailyEnergy.Tuesday, 2), 104.15);
  assert.equal(round(metrics.dailyEnergy.Wednesday, 2), 87.85);
  assert.equal(round(metrics.dailyEnergy.Thursday, 2), 55.14);
  assert.equal(round(metrics.meanDailyEnergy, 2), 84.72);

  assert.equal(round(metrics.phaseShares.yellow, 1), 42.6);
  assert.equal(round(metrics.phaseShares.blue, 1), 30.6);
  assert.equal(round(metrics.phaseShares.red, 1), 26.8);
  assert.equal(round(metrics.phaseMeans.neutral, 2), 14.55);
  assert.equal(round(metrics.neutralMax, 1), 32.6);

  assert.equal(round(metrics.sizing.adoptedPvArray, 2), 30.24);
  assert.equal(round(metrics.sizing.inverterRating, 2), 30.24);
  assert.equal(round(metrics.sizing.batteryCapacity, 2), 117.67);
  assert.equal(round(metrics.diversityFactor, 2), 0.24);
});
