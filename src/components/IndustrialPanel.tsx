import React, { useMemo } from 'react';
import { Factory, Flame, Wind, Scale, ClipboardCheck } from 'lucide-react';
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

  const formatPct = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

  return (
    <div className="space-y-4">
      {/* 1. Perbandingan Langsung vs Base Case */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Scale className="w-4 h-4 text-blue-400" />
            Perbandingan vs Base Case
          </div>
          {report.isBaseCase && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
              Model Rujukan
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
            <div className="text-[10px] text-slate-400">Jisim Bahan</div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                report.massDiffPct > 15
                  ? 'text-amber-400'
                  : report.massDiffPct < -2
                  ? 'text-emerald-400'
                  : 'text-white'
              }`}
            >
              {report.isBaseCase ? '0.0%' : formatPct(report.massDiffPct)}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
            <div className="text-[10px] text-slate-400">Luas Penyejukan</div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                report.areaDiffPct > 2
                  ? 'text-emerald-400'
                  : report.areaDiffPct < -2
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {report.isBaseCase ? '0.0%' : formatPct(report.areaDiffPct)}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2">
            <div className="text-[10px] text-slate-400">Kecekapan Bahan</div>
            <div
              className={`text-sm font-bold mt-0.5 ${
                report.efficiencyIndex >= report.baseEfficiencyIndex
                  ? 'text-emerald-400'
                  : 'text-slate-200'
              }`}
            >
              {report.efficiencyIndex.toFixed(2)}{' '}
              <span className="text-[10px] font-normal text-slate-400">cm²/g</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cabaran Justifikasi Laporan (PO3 - Dinamik) */}
      <div className="bg-blue-950/30 border border-blue-800/60 rounded-xl p-3.5 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
          <ClipboardCheck className="w-4 h-4 shrink-0" />
          Fokus Analisis &amp; Justifikasi (PO3)
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{report.po3Challenge}</p>
      </div>

      {/* 3. Kebolehbuatan & Kos (DFM) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Factory className="w-4 h-4 text-slate-300" />
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
        <p className="text-xs text-slate-400 leading-relaxed">{report.dfmNote}</p>
      </div>

      {/* 4. Realiti Perolakan Semula Jadi (Panduan Flow Simulation) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
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

      {/* 5. Rujukan Ringkas Bajet Rintangan Haba */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Bajet Rintangan Haba ({chip.heatPower} W)
          </span>
          <span className="font-mono text-blue-400 font-semibold">
            ≤ {report.netHeatSinkBudget.toFixed(2)} °C/W
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Had sistem: {report.maxThermalBudget.toFixed(2)} °C/W ({thermal.tMaxChip}°C &minus;{' '}
          {thermal.tAmbient}°C) ditolak ≈{thermal.timAllowance} °C/W untuk rintangan TIM. Nota:
          kemasan <em>Black Anodized</em> (ε ≈ 0.85) menambah 20%–30% penyejukan sinaran dalam
          udara tenang.
        </p>
      </div>
    </div>
  );
};
