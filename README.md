# SICT Solar PV Load Analysis & Sizing Suite

Web and offline dashboard for:
**Electrical Load Analysis of Solar Photovoltaic System Suitability: A Case Study of SICT Building, FUT Minna**.

## Project Metadata
- Candidate: **Oche Raphael Idoko (2021/1/83232EL)**
- Department: Materials and Metallurgical Engineering, Federal University of Technology, Minna
- Supervisor: **Prof. Alkali Babawuya**

## Features
- Six-view academic dashboard with FUT Minna branding
- Hardcoded thesis datasets (field currents, connected loads, top-load spaces)
- Interactive PV sizing simulator using thesis equations
- KPI cards for peak demand, mean energy, connected load, and diversity factor
- Charts for phase currents, daily energy vs peak demand, phase share, connected loads, and top spaces
- Filter/searchable field table with CSV export
- Defense presentation accordion with Print / PDF-export-friendly mode
- Static export support for offline CD-ROM use (`out/` folder)

## Tech Stack
- Next.js (App Router, TypeScript)
- Tailwind CSS
- Recharts
- Lucide React

## Quick Start
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Production Build
```bash
npm run build
```
Because `next.config.ts` uses `output: "export"`, build output is generated in:
- `out/` (static site for offline use)

## Deploy to Vercel
1. Import this repository in Vercel.
2. Keep framework preset as **Next.js**.
3. Deploy (a basic `vercel.json` is included).

## Offline Defense Bundle (CD-ROM)
### Windows
Double-click:
- `run_offline.bat`

The script builds the app if needed and opens `out/index.html`.

### Manual (Any OS)
```bash
npm install
npm run build
```
Then open `out/index.html` in a browser.
