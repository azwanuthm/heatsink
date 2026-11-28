import { HeatSinkParams, GeometryMetrics } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';
import { calculateMetrics } from './geometryMath';

export interface IndustrialReport {
  // Perbandingan Dinamik vs Base Case
  massDiffPct: number;             // % perubahan jisim berbanding Base Case
  areaDiffPct: number;             // % perubahan luas permukaan berbanding Base Case
  efficiencyIndex: number;         // cm²/g (luas penyejukan per gram aluminium)
  baseEfficiencyIndex: number;     // cm²/g bagi Base Case
  isBaseCase: boolean;

  // Bajet Haba Industri
  maxThermalBudget: number;        // °C/W (keseluruhan)
  netHeatSinkBudget: number;       // °C/W (selepas tolak anggaran TIM)

  // DFM & Aliran Udara Kontekstual
  aspectRatio: number;
  manufacturingMethod: string;
  costTier: 'Rendah' | 'Sederhana' | 'Tinggi';
  costColor: 'emerald' | 'amber' | 'red';
  dfmNote: string;

  convectionStatus: 'Optimum' | 'Aliran Terhad' | 'Terlalu Jarang';
  convectionColor: 'emerald' | 'red' | 'amber';
  convectionNote: string;

  // Cabaran Justifikasi Laporan (PO3)
  po3Challenge: string;
}

export function analyzeIndustrialDFM(
  params: HeatSinkParams,
  metrics: GeometryMetrics
): IndustrialReport {
  const { chip, thermal, baseCase } = ASSIGNMENT_SPECS;

  // 1. Kira Metrik Base Case sebagai penanda aras dinamik
  const baseMetrics = calculateMetrics(baseCase);
  const massDiffPct = ((metrics.massGrams - baseMetrics.massGrams) / baseMetrics.massGrams) * 100;
  const areaDiffPct =
    ((metrics.surfaceAreaCm2 - baseMetrics.surfaceAreaCm2) / baseMetrics.surfaceAreaCm2) * 100;

  const efficiencyIndex = metrics.massGrams > 0 ? metrics.surfaceAreaCm2 / metrics.massGrams : 0;
  const baseEfficiencyIndex = baseMetrics.surfaceAreaCm2 / baseMetrics.massGrams;
  const isBaseCase = Math.abs(massDiffPct) < 0.2 && Math.abs(areaDiffPct) < 0.2;

  // 2. Bajet Rintangan Haba Industri (R_th = ΔT / Q)
  const maxThermalBudget = (thermal.tMaxChip - thermal.tAmbient) / chip.heatPower;
  const netHeatSinkBudget = Math.max(0, maxThermalBudget - thermal.timAllowance);

  // 3. Analisis Kebolehbuatan (DFM) Kontekstual
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
      dfmNote = `Nisbah tinggi-ke-celah (${aspectRatio.toFixed(1)}:1) dan tebal ${params.finThickness} mm berada dalam had selamat extrusion industri (≤ 8:1). Ekonomik untuk pengeluaran besar-besaran.`;
    } else if (aspectRatio <= 12 && params.finThickness >= 1.0) {
      manufacturingMethod = 'High-Aspect Extrusion / Die Casting';
      costTier = 'Sederhana';
      costColor = 'amber';
      dfmNote = `Nisbah ${aspectRatio.toFixed(1)}:1 melebihi had extrusion biasa. Boleh dikilangkan, tetapi kos acuan (die) dan risiko sirip bengkok meningkat.`;
    } else {
      manufacturingMethod = 'CNC Machining / Skived Fin';
      costTier = 'Tinggi';
      costColor = 'red';
      dfmNote = `Dengan tebal ${params.finThickness} mm dan nisbah ${aspectRatio.toFixed(1)}:1, reka bentuk ini sukar di-extrude. Kos pengeluaran tinggi — pastikan penurunan suhu cip benar-benar berbaloi.`;
    }
  } else {
    if (aspectRatio <= 6 && params.finThickness >= 2.5) {
      manufacturingMethod = 'Cold Forging / Die Casting';
      costTier = 'Sederhana';
      costColor = 'amber';
      dfmNote = `Geometri Pin Fin tidak boleh di-extrude secara terus. Saiz pin ${params.finThickness} mm sesuai untuk proses cold forging bagi volum pengeluaran sederhana.`;
    } else {
      manufacturingMethod = 'CNC Machining (Multi-Axis)';
      costTier = 'Tinggi';
      costColor = 'red';
      dfmNote = `Pin setinggi ${params.finHeight} mm dengan celah ${minGap.toFixed(1)} mm memerlukan pemesinan CNC yang mahal dan banyak pembaziran bahan mentah.`;
    }
  }

  // 4. Status Aliran Perolakan Semula Jadi (Panduan Simulasi SolidWorks)
  let convectionStatus: 'Optimum' | 'Aliran Terhad' | 'Terlalu Jarang' = 'Optimum';
  let convectionColor: 'emerald' | 'red' | 'amber' = 'emerald';
  let convectionNote = '';

if (minGap < 5.0) {
    convectionStatus = 'Aliran Terhad';
    convectionColor = 'amber';
    convectionNote = `Celah semasa (${minGap.toFixed(1)} mm) mula meningkatkan rintangan aliran udara tenang. Sesuai dijadikan salah satu iterasi dalam Flow Simulation untuk menguji sama ada pertambahan luas permukaan masih berbaloi.`;
  } else if (minGap <= 12.0) {
    convectionStatus = 'Optimum';
    convectionColor = 'emerald';
    convectionNote = `Celah ${minGap.toFixed(1)} mm berada dalam julat ideal (5–12 mm) untuk perolakan semula jadi. Udara panas dapat naik bebas tanpa rintangan geseran berlebihan.`;
  } else {
    convectionStatus = 'Terlalu Jarang';
    convectionColor = 'amber';
    convectionNote = `Celah ${minGap.toFixed(1)} mm memberi aliran udara sangat bebas, tetapi ruang tapak belum dimanfaatkan sepenuhnya. Cuba tambah bilangan sirip untuk melihat sama ada suhu cip turun lagi.`;
  }

  // 5. Cabaran Justifikasi Laporan (PO3 - Complex Problem Solving)
  let po3Challenge = '';
  if (isBaseCase) {
    po3Challenge =
      'Ini adalah model rujukan (Base Case). Gunakan jisim (126.4 g) dan suhu simulasi model ini sebagai penanda aras untuk membuktikan peningkatan prestasi dalam Fasa 3.';
  } else if (convectionStatus === 'Aliran Terhad') {
    po3Challenge = `Walaupun luas permukaan berubah sebanyak ${areaDiffPct >= 0 ? '+' : ''}${areaDiffPct.toFixed(1)}%, celah ${minGap.toFixed(1)} mm berisiko menyekat aliran udara. Bincangkan dalam laporan jika graf suhu anda mula naik semula pada iterasi ini.`;
  } else if (massDiffPct > 20) {
    po3Challenge = `Reka bentuk ini ${massDiffPct.toFixed(1)}% lebih berat daripada Base Case. Dalam laporan Fasa 3, anda perlu buktikan penurunan suhu cip cukup signifikan untuk mewajarkan pertambahan kos bahan ini.`;
  } else if (costTier === 'Tinggi') {
    po3Challenge = `Kaedah pengilangan (${manufacturingMethod}) melibatkan kos tinggi. Jelaskan dalam kesimpulan laporan sama ada kelebihan suhu yang dicapai berbaloi berbanding reka bentuk extrusion biasa.`;
  } else if (massDiffPct < -5 && areaDiffPct >= 0) {
    po3Challenge = `Calon reka bentuk optimum! Ia ${Math.abs(massDiffPct).toFixed(1)}% lebih ringan tetapi mengekalkan/menambah luas penyejukan (+${areaDiffPct.toFixed(1)}%). Sahkan dalam SolidWorks bahawa suhu cip kekal jauh di bawah 85 °C.`;
  } else {
    po3Challenge = `Indeks kecekapan bahan anda ialah ${efficiencyIndex.toFixed(2)} cm²/g (Base Case: ${baseEfficiencyIndex.toFixed(2)} cm²/g). Bandingkan trend ini dengan keputusan suhu simulasi dalam graf kajian parametrik anda.`;
  }

  return {
    massDiffPct,
    areaDiffPct,
    efficiencyIndex,
    baseEfficiencyIndex,
    isBaseCase,
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
    po3Challenge,
  };
}
