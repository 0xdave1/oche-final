import { connectedLoads, fieldMeasurements } from "./data";

export type SimulationParams = {
  voltage: number;
  powerFactor: number;
  pvDerating: number;
  peakSunHours: number;
  inverterSafetyMargin: number;
  batteryDod: number;
  batteryEfficiency: number;
  autonomyDays: number;
};

export const defaultSimulationParams: SimulationParams = {
  voltage: 220,
  powerFactor: 0.9,
  pvDerating: 0.8,
  peakSunHours: 5,
  inverterSafetyMargin: 1.25,
  batteryDod: 0.8,
  batteryEfficiency: 0.9,
  autonomyDays: 1,
};

export type ObservationResult = {
  label: string;
  day: string;
  time: string;
  ir: number;
  iy: number;
  ib: number;
  neutral: number;
  totalCurrent: number;
  apparentPower: number;
  realPower: number;
  intervalEnergy: number;
};

export function round(value: number, dp = 2) {
  const p = 10 ** dp;
  return Math.round(value * p) / p;
}

export function computeObservationSeries(params: SimulationParams) {
  return fieldMeasurements.map((row) => {
    const totalCurrent = row.ir + row.iy + row.ib;
    const apparentPower = (params.voltage * totalCurrent) / 1000;
    const realPower = apparentPower * params.powerFactor;
    return {
      label: `${row.day.slice(0, 3)} ${row.time}`,
      day: row.day,
      time: row.time,
      ir: row.ir,
      iy: row.iy,
      ib: row.ib,
      neutral: row.in,
      totalCurrent,
      apparentPower,
      realPower,
      intervalEnergy: realPower,
    } satisfies ObservationResult;
  });
}

export function computeDashboardMetrics(params: SimulationParams) {
  const observations = computeObservationSeries(params);

  const dailyEnergy = observations.reduce<Record<string, number>>((acc, current) => {
    acc[current.day] = (acc[current.day] ?? 0) + current.intervalEnergy;
    return acc;
  }, {});

  const dailyPeakDemand = observations.reduce<Record<string, number>>((acc, current) => {
    acc[current.day] = Math.max(acc[current.day] ?? 0, current.realPower);
    return acc;
  }, {});

  const peakObservation = observations.reduce((peak, row) =>
    row.totalCurrent > peak.totalCurrent ? row : peak
  );

  const phaseTotals = observations.reduce(
    (acc, row) => {
      acc.red += row.ir;
      acc.yellow += row.iy;
      acc.blue += row.ib;
      acc.neutral += row.neutral;
      return acc;
    },
    { red: 0, yellow: 0, blue: 0, neutral: 0 },
  );

  const totalPhaseCurrent = phaseTotals.red + phaseTotals.yellow + phaseTotals.blue;
  const meanDailyEnergy =
    Object.values(dailyEnergy).reduce((sum, value) => sum + value, 0) / Object.keys(dailyEnergy).length;
  const connectedLoadKW = connectedLoads.reduce((sum, row) => sum + row.totalW, 0) / 1000;

  const pvPeakBased = peakObservation.realPower / params.pvDerating;
  const pvEnergyBased = meanDailyEnergy / (params.peakSunHours * params.pvDerating);
  const adoptedPvArray = Math.max(pvPeakBased, pvEnergyBased);
  const inverterRating = peakObservation.realPower * params.inverterSafetyMargin;
  const batteryCapacity =
    (meanDailyEnergy * params.autonomyDays) / (params.batteryDod * params.batteryEfficiency);

  return {
    observations,
    dailyEnergy,
    dailyPeakDemand,
    peakObservation,
    meanDailyEnergy,
    phaseTotals,
    phaseShares: {
      red: (phaseTotals.red / totalPhaseCurrent) * 100,
      yellow: (phaseTotals.yellow / totalPhaseCurrent) * 100,
      blue: (phaseTotals.blue / totalPhaseCurrent) * 100,
    },
    phaseMeans: {
      red: phaseTotals.red / observations.length,
      yellow: phaseTotals.yellow / observations.length,
      blue: phaseTotals.blue / observations.length,
      neutral: phaseTotals.neutral / observations.length,
    },
    neutralMax: Math.max(...observations.map((row) => row.neutral)),
    connectedLoadKW,
    diversityFactor: peakObservation.realPower / connectedLoadKW,
    sizing: {
      pvPeakBased,
      pvEnergyBased,
      adoptedPvArray,
      inverterRating,
      batteryCapacity,
    },
  };
}
