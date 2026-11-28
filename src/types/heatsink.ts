export type FinType = 'rectangular' | 'square-pin' | 'circular-pin';
export type SurfaceFinish = 'raw' | 'black-anodized';
export type CameraView = 'isometric' | 'front' | 'side' | 'top';

export interface HeatSinkParams {
  finType: FinType;
  baseWidth: number;      // mm (X)
  baseLength: number;     // mm (Y)
  baseThickness: number;  // mm (t_b)
  finHeight: number;      // mm (L_c)
  finThickness: number;   // mm (t atau diameter d)
  finCount: number;       // Bilangan sirip (rectangular)
  pinCountX: number;      // Bilangan pin arah X
  pinCountY: number;      // Bilangan pin arah Y
  showChip: boolean;      // Paparkan blok cip silikon 40x40x2mm
  finish: SurfaceFinish;  // Raw Aluminium vs Black Anodized
  showAirflow: boolean;   // Paparkan anak panah aliran apungan udara panas
}

export interface GeometryMetrics {
  totalHeight: number;      // mm (t_b + L_c)
  massGrams: number;        // gram
  surfaceAreaCm2: number;   // cm²
  surfaceAreaM2: number;    // m²
  finGapX: number;          // mm
  finGapY: number | null;   // mm
  totalFins: number;
  warnings: string[];
  isValid: boolean;
}
