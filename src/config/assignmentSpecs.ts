import { HeatSinkParams } from '../types/heatsink';

export const ASSIGNMENT_SPECS = {
  courseCode: 'BDA30603',
  courseName: 'Heat Transfer',
  limits: {
    maxBaseWidth: 60,     // mm
    maxBaseLength: 60,    // mm
    maxTotalHeight: 50,   // mm (dari permukaan cip)
    minFinGap: 1.5,       // mm (elak sirip terlalu rapat / bertindih)
    minBaseThickness: 2,  // mm
  },
  chip: {
    width: 40,            // mm
    length: 40,           // mm
    thickness: 2,         // mm (standard benchmark multi-body)
    heatPower: 10,        // Watt
    material: 'Silicon',
  },
  material: {
    name: 'Aluminium Alloy 6061',
    density: 2700,        // kg/m³
    k: 170,               // W/m·K
  },
  baseCase: {
    finType: 'rectangular',
    baseWidth: 60,
    baseLength: 60,
    baseThickness: 5,
    finHeight: 40,
    finThickness: 2,
    finCount: 6,
    pinCountX: 5,
    pinCountY: 5,
    showChip: true,
  } as HeatSinkParams,
};
