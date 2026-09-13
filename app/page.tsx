"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Download, Printer, RotateCcw } from "lucide-react";
import { computeDashboardMetrics, defaultSimulationParams, round, type SimulationParams } from "./lib/calculations";
import { connectedLoads, fieldMeasurements, highLoadSpaces, projectMeta } from "./lib/data";

const views = [
  "Executive Dashboard",
  "Field Current & Power Profiler",
  "Phase Imbalance & Neutral Analysis",
  "Connected Load Audit & Diversity Factor",
  "Interactive PV System Sizing Simulator",
  "Academic Defense & Presentation Mode",
] as const;

const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday"];
const phaseColors = ["#f59e0b", "#2563eb", "#dc2626"];

function formatKW(value: number) {
  return `${round(value).toFixed(2)} kW`;
}

function formatKWh(value: number) {
  return `${round(value).toFixed(2)} kWh`;
}

function formatKVA(value: number) {
  return `${round(value).toFixed(2)} kVA`;
}

function tooltipValue(value: number | string | undefined, unit: string) {
  const numeric = typeof value === "number" ? value : Number(value ?? 0);
  return `${numeric.toLocaleString()} ${unit}`;
}

function ProgressRing({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dash = (pct / 100) * circumference;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
      <svg viewBox="0 0 100 100" className="mx-auto h-28 w-28">
        <circle cx="50" cy="50" r={radius} className="fill-none stroke-slate-200" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="fill-none stroke-emerald-500"
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          transform="rotate(-90 50 50)"
          strokeLinecap="round"
        />
        <text x="50" y="53" textAnchor="middle" className="fill-slate-800 text-xs font-semibold">
          {round(value).toFixed(2)}
        </text>
      </svg>
      <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<(typeof views)[number]>(views[0]);
  const [params, setParams] = useState<SimulationParams>(defaultSimulationParams);
  const [dayFilter, setDayFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const metrics = useMemo(() => computeDashboardMetrics(params), [params]);

  const filteredRows = useMemo(
    () =>
      fieldMeasurements.filter((row) => {
        const dayOk = dayFilter === "All" ? true : row.day === dayFilter;
        const query = search.toLowerCase();
        const text = `${row.day} ${row.time}`.toLowerCase();
        return dayOk && text.includes(query);
      }),
    [dayFilter, search],
  );

  const dailyChartData = dayOrder.map((day) => ({
    day,
    energy: round(metrics.dailyEnergy[day] ?? 0),
    peak: round(metrics.dailyPeakDemand[day] ?? 0),
  }));

  const phaseShareData = [
    { name: "Yellow", value: metrics.phaseShares.yellow },
    { name: "Blue", value: metrics.phaseShares.blue },
    { name: "Red", value: metrics.phaseShares.red },
  ];

  const connectedLoadTotal = connectedLoads.reduce((sum, row) => sum + row.totalW, 0);

  const csvDownload = () => {
    const header = ["Day", "Time", "IR (A)", "IY (A)", "IB (A)", "IN (A)"];
    const lines = filteredRows.map((row) => [row.day, row.time, row.ir, row.iy, row.ib, row.in].join(","));
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sict_field_measurements.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">FUT Minna · SICT PV Suitability Suite</p>
          <h1 className="text-lg font-bold leading-tight md:text-2xl">{projectMeta.title}</h1>
          <p className="text-sm text-slate-600">{projectMeta.candidate}</p>
          <p className="text-sm text-slate-600">Supervisor: {projectMeta.supervisor}</p>
          <p className="text-sm text-slate-600">{projectMeta.department}</p>
          <p className="text-xs text-slate-500">{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto p-3">
          {views.map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                activeView === view ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl space-y-6 p-4">
        {activeView === "Executive Dashboard" && (
          <section className="space-y-4">
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> Severe phase imbalance detected: Yellow phase carries {round(metrics.phaseShares.yellow, 1)}% of total line current.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Peak Real Demand</p><p className="text-2xl font-bold">{formatKW(metrics.peakObservation.realPower)}</p><p className="text-xs text-slate-500">{round(metrics.peakObservation.totalCurrent, 1)} A @ {params.voltage} V</p></article>
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Mean Observed Energy</p><p className="text-2xl font-bold">{formatKWh(metrics.meanDailyEnergy)}</p></article>
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Installed Connected Load</p><p className="text-2xl font-bold">{round(metrics.connectedLoadKW, 1).toFixed(1)} kW</p><p className="text-xs text-slate-500">Diversity factor: {round(metrics.diversityFactor, 2).toFixed(2)}</p></article>
              <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Dominant Load Driver</p><p className="text-2xl font-bold">Air Conditioning</p><p className="text-xs text-slate-500">75.8% of connected load</p></article>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ProgressRing value={metrics.sizing.adoptedPvArray} max={40} label="PV Array (kWp)" />
              <ProgressRing value={metrics.sizing.inverterRating} max={40} label="Inverter (kW)" />
              <ProgressRing value={metrics.sizing.batteryCapacity} max={150} label="Battery (kWh)" />
            </div>
          </section>
        )}

        {activeView === "Field Current & Power Profiler" && (
          <section className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Current profile across 22 observations</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.observations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" hide />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ir" stroke="#dc2626" name="Red (A)" />
                    <Line type="monotone" dataKey="iy" stroke="#f59e0b" name="Yellow (A)" />
                    <Line type="monotone" dataKey="ib" stroke="#2563eb" name="Blue (A)" />
                    <Line type="monotone" dataKey="neutral" stroke="#16a34a" name="Neutral (A)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Daily energy vs peak demand</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="energy" fill="#0ea5e9" name="Energy (kWh)" />
                    <Line yAxisId="right" type="monotone" dataKey="peak" stroke="#ef4444" name="Peak (kW)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)} className="rounded border border-slate-300 px-2 py-1 text-sm">
                  <option>All</option>
                  {dayOrder.map((day) => <option key={day}>{day}</option>)}
                </select>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search day or time"
                  className="rounded border border-slate-300 px-2 py-1 text-sm"
                />
                <button onClick={csvDownload} className="inline-flex items-center gap-2 rounded bg-emerald-600 px-3 py-1.5 text-sm text-white">
                  <Download size={15} /> Download as CSV
                </button>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="px-2 py-1">Day</th><th className="px-2 py-1">Time</th><th className="px-2 py-1">IR</th><th className="px-2 py-1">IY</th><th className="px-2 py-1">IB</th><th className="px-2 py-1">IN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, idx) => (
                      <tr key={`${row.day}-${row.time}-${idx}`} className="border-b border-slate-100">
                        <td className="px-2 py-1">{row.day}</td><td className="px-2 py-1">{row.time}</td><td className="px-2 py-1">{row.ir}</td><td className="px-2 py-1">{row.iy}</td><td className="px-2 py-1">{row.ib}</td><td className="px-2 py-1">{row.in}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeView === "Phase Imbalance & Neutral Analysis" && (
          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Phase current share</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={phaseShareData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label={({ name, value }) => `${name}: ${round(value as number, 1)}%`}>
                      {phaseShareData.map((entry, index) => <Cell key={entry.name} fill={phaseColors[index]} />)}
                    </Pie>
                    <Tooltip formatter={(value) => `${round(Number(value ?? 0), 2)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Neutral current trajectory</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.observations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" hide />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="neutral" stroke="#16a34a" name="Neutral (A)" />
                    <Line dataKey="totalCurrent" stroke="#334155" name="Total (A)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="font-semibold">Engineering recommendation</p>
                <p>
                  Yellow phase is overburdened ({round(metrics.phaseShares.yellow, 1)}%), increasing conductor heating and neutral losses.
                  Re-distribute single-phase air-conditioning circuits toward red/blue phases, then rebalance at panel level and remeasure.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeView === "Connected Load Audit & Diversity Factor" && (
          <section className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Appliance connected-load breakdown</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={connectedLoads} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="category" width={150} />
                    <Tooltip formatter={(value) => tooltipValue(value as number | string | undefined, "W")} />
                    <Bar dataKey="totalW" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Top 10 high-load spaces</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={highLoadSpaces} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={190} />
                    <Tooltip formatter={(value) => tooltipValue(value as number | string | undefined, "W")} />
                    <Bar dataKey="totalW" fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-600">Connected Nameplate Load</p>
              <p className="text-2xl font-bold">{round(connectedLoadTotal / 1000, 1).toFixed(1)} kW</p>
              <p className="text-sm text-slate-600">Peak Real Demand: {formatKW(metrics.peakObservation.realPower)}</p>
              <p className="text-sm font-semibold text-emerald-700">Implied Diversity Factor: {round(metrics.diversityFactor, 2).toFixed(2)}</p>
            </div>
          </section>
        )}

        {activeView === "Interactive PV System Sizing Simulator" && (
          <section className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-2 font-semibold">Simulation controls</h2>
                {[
                  { key: "voltage", label: "Supply Voltage (V)", min: 200, max: 240, step: 1 },
                  { key: "powerFactor", label: "Power Factor", min: 0.7, max: 1, step: 0.01 },
                  { key: "peakSunHours", label: "Peak Sun Hours", min: 3.5, max: 6.5, step: 0.1 },
                  { key: "pvDerating", label: "PV Derating", min: 0.65, max: 0.9, step: 0.01 },
                  { key: "batteryDod", label: "Battery DoD", min: 0.5, max: 0.9, step: 0.01 },
                  { key: "batteryEfficiency", label: "Battery Efficiency", min: 0.75, max: 0.98, step: 0.01 },
                  { key: "autonomyDays", label: "Autonomy Days", min: 1, max: 3, step: 1 },
                ].map((control) => (
                  <label key={control.key} className="mb-3 block text-sm">
                    <div className="mb-1 flex justify-between"><span>{control.label}</span><span className="font-semibold">{(params as Record<string, number>)[control.key]}</span></div>
                    <input
                      type="range"
                      min={control.min}
                      max={control.max}
                      step={control.step}
                      value={(params as Record<string, number>)[control.key]}
                      onChange={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          [control.key]: Number(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </label>
                ))}
                <button
                  onClick={() => setParams(defaultSimulationParams)}
                  className="inline-flex items-center gap-2 rounded bg-slate-700 px-3 py-2 text-sm text-white"
                >
                  <RotateCcw size={15} /> Reset to thesis defaults
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-2 font-semibold">Sizing outputs</h2>
                <p className="mb-1 text-sm">PV (Peak-based): <strong>{round(metrics.sizing.pvPeakBased).toFixed(2)} kWp</strong></p>
                <p className="mb-1 text-sm">PV (Energy-based): <strong>{round(metrics.sizing.pvEnergyBased).toFixed(2)} kWp</strong></p>
                <p className="mb-1 text-sm">Adopted PV Array: <strong>{round(metrics.sizing.adoptedPvArray).toFixed(2)} kWp</strong></p>
                <p className="mb-1 text-sm">Inverter Capacity: <strong>{round(metrics.sizing.inverterRating).toFixed(2)} kW</strong></p>
                <p className="mb-1 text-sm">Battery Storage: <strong>{round(metrics.sizing.batteryCapacity).toFixed(2)} kWh</strong></p>
                <p className="mt-3 text-xs text-slate-500">Defaults reproduce thesis baseline: PV 30.24 kWp, Inverter 30.24 kW, Battery 117.67 kWh.</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold">Simulation vs thesis baseline</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { metric: "PV (kWp)", baseline: 30.24, simulation: round(metrics.sizing.adoptedPvArray) },
                      { metric: "Inverter (kW)", baseline: 30.24, simulation: round(metrics.sizing.inverterRating) },
                      { metric: "Battery (kWh)", baseline: 117.67, simulation: round(metrics.sizing.batteryCapacity) },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="baseline" fill="#94a3b8" name="Thesis baseline" />
                    <Bar dataKey="simulation" fill="#10b981" name="User simulation" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}

        {activeView === "Academic Defense & Presentation Mode" && (
          <section className="space-y-3">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded bg-emerald-600 px-3 py-2 text-sm text-white">
              <Printer size={15} /> Print / Export Defense Summary
            </button>
            {[
              {
                title: "Objective 1: Load Profile & Daily Energy Analysis",
                body: `Daily observed energy: Mon ${formatKWh(metrics.dailyEnergy.Monday)}, Tue ${formatKWh(metrics.dailyEnergy.Tuesday)}, Wed ${formatKWh(metrics.dailyEnergy.Wednesday)}, Thu ${formatKWh(metrics.dailyEnergy.Thursday)}. Mean is ${formatKWh(metrics.meanDailyEnergy)}.`,
              },
              {
                title: "Objective 2: Major Load Identification & Phase Distribution",
                body: `Air-conditioning drives 75.8% of connected load. Phase share is Yellow ${round(metrics.phaseShares.yellow, 1)}%, Blue ${round(metrics.phaseShares.blue, 1)}%, Red ${round(metrics.phaseShares.red, 1)}%.`,
              },
              {
                title: "Objective 3: Peak Demand Determination",
                body: `Peak occurs at ${metrics.peakObservation.day} ${metrics.peakObservation.time}: ${round(metrics.peakObservation.totalCurrent, 1)} A, ${formatKVA(metrics.peakObservation.apparentPower)}, ${formatKW(metrics.peakObservation.realPower)}.`,
              },
              {
                title: "Objective 4: Sizing PV Array, Inverter, and Battery",
                body: `Conservative sizing yields PV ${round(metrics.sizing.adoptedPvArray).toFixed(2)} kWp, inverter ${round(metrics.sizing.inverterRating).toFixed(2)} kW, battery ${round(metrics.sizing.batteryCapacity).toFixed(2)} kWh.`,
              },
              {
                title: "Objective 5: Grid Energy Displacement & Recommendations",
                body: `Diversity factor ${round(metrics.diversityFactor, 2).toFixed(2)} confirms high displacement potential. Prioritize phase balancing and staged AC redistribution to reduce neutral stress and improve power quality.`,
              },
            ].map((item) => (
              <details key={item.title} open className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <summary className="cursor-pointer font-semibold">{item.title}</summary>
                <p className="mt-2 text-sm text-slate-700">{item.body}</p>
              </details>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
