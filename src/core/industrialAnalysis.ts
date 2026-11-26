import { HeatSinkParams, GeometryMetrics } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

export interface IndustrialReport {
  maxThermalBudget: number;        // °C/W (keseluruhan)
  netHeatSinkBudget: number;       // °C/W (selepas tolak anggaran TIM)
  aspectRatio: number;             // Nisbah L_c / gap
  manufacturingMethod: string;
  costTier: 'Rendah' | 'Sederhana' | 'Tinggi';
  costColor: 'emerald' | 'amber' | 'red';
  dfmNote: string;
  convectionStatus: 'Optimum' | 'Tercekik (Choked)' | 'Terlalu Jarang';
  convectionColor: 'emerald' | 'red' | 'amber';
  convectionNote: string;
}

export function analyzeIndustrialDFM(
  params: HeatSinkParams,
  metrics: GeometryMetrics
): IndustrialReport {
  const { chip, thermal } = ASSIGNMENT_SPECS;

  // 1. Bajet Rintangan Haba Industri (R_th = ΔT / Q)
  const maxThermalBudget = (thermal.tMaxChip - thermal.tAmbient) / chip.heatPower;
  const netHeatSinkBudget = Math.max(0, maxThermalBudget - thermal.timAllowance);

  // 2. Analisis Kebolehbuatan (DFM - Extrusion Ratio & Jenis Sirip)
  const minGap =
    metrics.finGapY !== null
      ? Math.min(metrics.finGapX, metrics.finGapY)
      : metrics.finGapX;
  const safeGap = Math.max(minGap, 0.1);
  const aspectRatio = params.finHeight / safeGap;

  let manufacturingMethod = '';
  let costTier: 'Rendah' | 'Sederhana' | 'Tinggi' = 'Rendah';
  let costColor: 'emerald' | 'amber' | 'red' = 'emerald';
  let dfmNote = '';

  if (params.finType === 'rectangular') {
    if (aspectRatio <= 8 && params.finThickness >= 1.5) {
      manufacturingMethod = 'Standard Aluminium Extrusion';
      costTier = 'Rendah';
      costColor = 'emerald';
      dfmNote =
        'Nisbah tinggi-ke-celah (≤ 8:1) dan tebal sirip sesuai untuk pengeluaran besar-besaran yang ekonomik.';
    } else if (aspectRatio <= 12 && params.finThickness >= 1.0) {
      manufacturingMethod = 'High-Aspect Extrusion / Die Casting';
      costTier = 'Sederhana';
      costColor = 'amber';
      dfmNote =
        'Memerlukan acuan (die) berketepatan tinggi; kos perkakasan meningkat dan kadar kecacatan lebih tinggi.';
    } else {
      manufacturingMethod = 'CNC Machining / Skived Fin';
      costTier = 'Tinggi';
      costColor = 'red';
      dfmNote =
        'Sirip terlalu nipis atau nisbah celah > 12:1 tidak praktikal untuk extrusion biasa. Hanya untuk aplikasi kritikal.';
    }
  } else {
    // Pin Fin (Square atau Circular)
    if (aspectRatio <= 6 && params.finThickness >= 2.5) {
      manufacturingMethod = 'Cold Forging / Die Casting';
      costTier = 'Sederhana';
      costColor = 'amber';
      dfmNote =
        'Pin fin tidak boleh di-extrude secara terus; lazimnya menggunakan kaedah cold forging bagi volum sederhana-tinggi.';
    } else {
      manufacturingMethod = 'CNC Machining (Multi-Axis)';
      costTier = 'Tinggi';
      costColor = 'red';
      dfmNote =
        'Pin yang tinggi dan rapat memerlukan pemesinan CNC yang memakan masa serta pembaziran bahan mentah yang tinggi.';
    }
  }

  // 3. Status Aliran Perolakan Semula Jadi (Natural Convection Boundary Layer)
  let convectionStatus: 'Optimum' | 'Tercekik (Choked)' | 'Terlalu Jarang' = 'Optimum';
  let convectionColor: 'emerald' | 'red' | 'amber' = 'emerald';
  let convectionNote = '';

  if (minGap < 5.0) {
    convectionStatus = 'Tercekik (Choked)';
    convectionColor = 'red';
    convectionNote =
      'Celah < 5 mm menyebabkan lapisan sempadan haba bertindih dalam udara tenang, menyekat aliran udara panas naik ke atas.';
  } else if (minGap <= 12.0) {
    convectionStatus = 'Optimum';
    convectionColor = 'emerald';
    convectionNote =
      'Julat celah 5–12 mm adalah ideal untuk perolakan semula jadi (stagnant air) tanpa menyekat aliran apungan udara.';
  } else {
    convectionStatus = 'Terlalu Jarang';
    convectionColor = 'amber';
    convectionNote =
      'Aliran udara sangat bebas, tetapi ruang tapak tidak dimanfaatkan sepenuhnya untuk menambah luas permukaan penyejukan.';
  }

  return {
    maxThermalBudget,
    netHeatSinkBudget,
    aspectRatio,
    manufacturingMethod,
    costTier,
    costColor,
    dfmNote,
    convectionStatus,
    convectionColor,
    convectionNote,
  };
}
