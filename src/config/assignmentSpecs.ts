import { HeatSinkParams } from '../types/heatsink';

export const ASSIGNMENT_SPECS = {
  courseCode: 'BDA30603',
  courseName: 'Heat Transfer',
  limits: {
    maxBaseWidth: 60,     // mm
    maxBaseLength: 60,    // mm
    maxTotalHeight: 50,   // mm
    minFinGap: 1.5,       // mm
    minBaseThickness: 2,  // mm
  },
  thermal: {
    tAmbient: 30,         // °C
    tMaxChip: 85,         // °C
    timAllowance: 0.8,    // °C/W
  },
  chip: {
    width: 40,            // mm
    length: 40,           // mm
    thickness: 2,         // mm
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
    finish: 'raw',
    showAirflow: false,
  } as HeatSinkParams,
  industrialPresets: [
    {
      id: 'base-case',
      label: 'Base Case (Fasa 1&2)',
      desc: '6 sirip segi empat, celah 9.6 mm (Model Rujukan).',
      params: {
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
        finish: 'raw',
        showAirflow: false,
      } as HeatSinkParams,
    },
    {
      id: 'power-extruded',
      label: 'Power Extruded',
      desc: '7 sirip anodized hitam, tapak tebal 6 mm untuk elektronik kuasa.',
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
        finish: 'black-anodized',
        showAirflow: true,
      } as HeatSinkParams,
    },
    {
      id: 'led-pinfin',
      label: 'LED Pin Fin',
      desc: '5×5 pin silinder untuk aliran udara bebas dari semua arah.',
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
        finish: 'black-anodized',
        showAirflow: true,
      } as HeatSinkParams,
    },
    {
      id: 'high-density',
      label: 'Uji Aliran Tercekik',
      desc: '12 sirip rapat (celah 3.3 mm) — contoh risiko choked flow.',
      params: {
        finType: 'rectangular',
        baseWidth: 60,
        baseLength: 60,
        baseThickness: 4,
        finHeight: 42,
        finThickness: 2,
        finCount: 12,
        pinCountX: 5,
        pinCountY: 5,
        showChip: true,
        finish: 'raw',
        showAirflow: true,
      } as HeatSinkParams,
    },
  ],
};
