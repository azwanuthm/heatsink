import { HeatSinkParams, GeometryMetrics } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

export function calculateMetrics(params: HeatSinkParams): GeometryMetrics {
  const {
    finType,
    baseWidth: W,
    baseLength: L,
    baseThickness: tb,
    finHeight: Lc,
    finThickness: t,
    finCount: N,
    pinCountX: Nx,
    pinCountY: Ny,
  } = params;

  const { limits, material } = ASSIGNMENT_SPECS;
  const totalHeight = tb + Lc;

  // 1. Isi padu tapak (mm³)
  const baseVolumeMm3 = W * L * tb;

  let finsVolumeMm3 = 0;
  let exposedAreaMm2 = 0;
  let finGapX = 0;
  let finGapY: number | null = null;
  let totalFins = 0;

  // Luas sisi tepi tapak (4 sisi)
  const baseSidesAreaMm2 = 2 * (W + L) * tb;

  if (finType === 'rectangular') {
    totalFins = N;
    finsVolumeMm3 = N * t * L * Lc;
    // Luas atas tapak + dinding sirip (luas tapak sirip batal dengan hujung sirip)
    exposedAreaMm2 = W * L + N * 2 * Lc * (L + t) + baseSidesAreaMm2;
    finGapX = N > 1 ? (W - N * t) / (N - 1) : W - t;
  } else if (finType === 'square-pin') {
    totalFins = Nx * Ny;
    finsVolumeMm3 = totalFins * (t * t * Lc);
    exposedAreaMm2 = W * L + totalFins * (4 * t * Lc) + baseSidesAreaMm2;
    finGapX = Nx > 1 ? (W - Nx * t) / (Nx - 1) : W - t;
    finGapY = Ny > 1 ? (L - Ny * t) / (Ny - 1) : L - t;
  } else {
    // circular-pin (t = diameter)
    totalFins = Nx * Ny;
    const r = t / 2;
    finsVolumeMm3 = totalFins * (Math.PI * r * r * Lc);
    exposedAreaMm2 = W * L + totalFins * (Math.PI * t * Lc) + baseSidesAreaMm2;
    finGapX = Nx > 1 ? (W - Nx * t) / (Nx - 1) : W - t;
    finGapY = Ny > 1 ? (L - Ny * t) / (Ny - 1) : L - t;
  }

  // 2. Pengiraan Jisim (gram) & Luas Permukaan
  const totalVolumeMm3 = baseVolumeMm3 + finsVolumeMm3;
  const massGrams = (totalVolumeMm3 / 1e9) * material.density * 1000;
  const surfaceAreaCm2 = exposedAreaMm2 / 100;
  const surfaceAreaM2 = exposedAreaMm2 / 1e6;

  // 3. Semakan Kekangan Tugasan (Guardrails)
  const warnings: string[] = [];

  if (W > limits.maxBaseWidth || L > limits.maxBaseLength) {
    warnings.push(`Saiz tapak melebihi had maksimum ${limits.maxBaseWidth} × ${limits.maxBaseLength} mm.`);
  }
  if (totalHeight > limits.maxTotalHeight) {
    warnings.push(`Ketinggian keseluruhan (${totalHeight.toFixed(1)} mm) melebihi had maksimum ${limits.maxTotalHeight} mm.`);
  }
  if (finGapX <= 0 || (finGapY !== null && finGapY <= 0)) {
    warnings.push('Geometri tidak sah: Sirip/pin bertindih atau melebihi saiz tapak.');
  } else if (finGapX < limits.minFinGap || (finGapY !== null && finGapY < limits.minFinGap)) {
    warnings.push(`Jarak celah terlalu sempit (< ${limits.minFinGap} mm) — boleh menyekat aliran perolakan semula jadi.`);
  }

  return {
    totalHeight,
    massGrams,
    surfaceAreaCm2,
    surfaceAreaM2,
    finGapX,
    finGapY,
    totalFins,
    warnings,
    isValid: warnings.length === 0,
  };
}
