import React, { useMemo } from 'react';
import { Factory, Flame, Wind, Sparkles } from 'lucide-react';
import { HeatSinkParams, GeometryMetrics } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';
import { analyzeIndustrialDFM } from '../core/industrialAnalysis';

interface IndustrialPanelProps {
  params: HeatSinkParams;
  metrics: GeometryMetrics;
}

const badgeStyles = {
  emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800',
  amber: 'bg-amber-950/60 text-amber-300 border-amber-800',
  red: 'bg-red-950/60 text-red-300 border-red-800',
};

export const IndustrialPanel: React.FC<IndustrialPanelProps> = ({ params, metrics }) => {
  const report = useMemo(() => analyzeIndustrialDFM(params, metrics), [params, metrics]);
  const { thermal, chip } = ASSIGNMENT_SPECS;

  return (
    <div className="space-y-4">
      {/* 1. Bajet Rintangan Haba Industri */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
          <Flame className="w-4 h-4 text-orange-400" />
          Bajet Rintangan Haba (Spec Industri)
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[11px] text-slate-400">Had Maksimum (Total)</div>
            <div className="text-lg font-bold text-white">
              {report.maxThermalBudget.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400">°C/W</span>
            </div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5">
            <div className="text-[11px] text-slate-400">Sasaran Heat Sink*</div>
            <div className="text-lg font-bold text-blue-400">
              ≤ {report.netHeatSinkBudget.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400">°C/W</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dikira daripada ({thermal.tMaxChip}°C &minus; {thermal.tAmbient}°C) &divide; {chip.heatPower} W.
          *Di industri, ~{thermal.timAllowance} °C/W ditolak untuk rintangan{' '}
          <strong className="text-slate-200">TIM (Thermal Paste)</strong> antara cip dan tapak.
        </p>
      </div>

      {/* 2. Kebolehbuatan & Kos (DFM) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Factory className="w-4 h-4 text-blue-400" />
            Kebolehbuatan (DFM)
          </div>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              badgeStyles[report.costColor]
            }`}
          >
            Kos: {report.costTier}
          </span>
        </div>

        <div className="text-sm font-semibold text-slate-100">{report.manufacturingMethod}</div>
        <div className="text-xs text-slate-400">
          Nisbah Tinggi-ke-Celah (Aspect Ratio):{' '}
          <span className="font-mono text-slate-200">{report.aspectRatio.toFixed(1)} : 1</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{report.dfmNote}</p>
      </div>

      {/* 3. Realiti Perolakan Semula Jadi */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Wind className="w-4 h-4 text-cyan-400" />
            Aliran Udara (Natural)
          </div>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              badgeStyles[report.convectionColor]
            }`}
          >
            {report.convectionStatus}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{report.convectionNote}</p>
      </div>

      {/* 4. Nota Amalan Industri: Black Anodizing */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          Tip Industri: Kemasan Black Anodized
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dalam <em>natural convection</em> (udara tenang), sinaran haba (<em>radiation</em>) menyumbang{' '}
          <strong className="text-slate-200">20%–30%</strong> jumlah penyejukan. Sebab itu heat sink
          industri hampir selalu di-anodize hitam (&epsilon; &approx; 0.85) berbanding aluminium berkilat
          (&epsilon; &approx; 0.1).
        </p>
      </div>
    </div>
  );
};
