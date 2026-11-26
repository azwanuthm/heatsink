export type FinType = 'rectangular' | 'square-pin' | 'circular-pin';

export interface HeatSinkParams {
  finType: FinType;
  baseWidth: number;      // mm (X)
  baseLength: number;     // mm (Y)
  baseThickness: number;  // mm (t_b)
  finHeight: number;      // mm (L_c)
  finThickness: number;   // mm (t untuk rectangular/square pin, diameter d untuk circular pin)
  finCount: number;       // Bilangan sirip (untuk rectangular)
  pinCountX: number;      // Bilangan pin arah X (untuk pin fin)
  pinCountY: number;      // Bilangan pin arah Y (untuk pin fin)
  showChip: boolean;      // Paparkan blok cip silikon 40x40x2mm
}

export interface GeometryMetrics {
  totalHeight: number;      // mm (t_b + L_c)
  massGrams: number;        // gram
  surfaceAreaCm2: number;   // cm² (luas permukaan terdedah)
  surfaceAreaM2: number;    // m²
  finGapX: number;          // mm (jarak celah antara sirip/pin)
  finGapY: number | null;   // mm (untuk pin fin sahaja)
  totalFins: number;        // Jumlah sirip atau pin
  warnings: string[];       // Senarai amaran jika melanggar had tugasan
  isValid: boolean;         // True jika semua kekangan dipatuhi
}
