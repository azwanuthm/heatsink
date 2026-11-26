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
  thermal: {
    tAmbient: 30,         // °C (Stagnant Air)
    tMaxChip: 85,         // °C (Had selamat cip)
    timAllowance: 0.8,    // °C/W (Anggaran rintangan Thermal Paste industri)
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
  industrialPresets: [
    {
      id: 'power-extruded',
      label: 'Power Electronics (Extruded)',
      params: {
        finType: 'rectangular',
        baseWidth: 60,
        baseLength: 60,
        baseThickness: 6,
        finHeight: 38,
        finThickness: 2.5,
        finCount: 7,
        pinCountX: 5,
        pinCountY: 5,
        showChip: true,
      } as HeatSinkParams,
    },
    {
      id: 'led-pinfin',
      label: 'LED / Embedded (Pin Fin)',
      params: {
        finType: 'circular-pin',
        baseWidth: 60,
        baseLength: 60,
        baseThickness: 5,
        finHeight: 30,
        finThickness: 4,
        finCount: 6,
        pinCountX: 5,
        pinCountY: 5,
        showChip: true,
      } as HeatSinkParams,
    },
  ],
};
