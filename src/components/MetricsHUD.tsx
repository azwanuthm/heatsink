import React from 'react';
import { GeometryMetrics } from '../types/heatsink';
import { IndustrialReport } from '../core/industrialAnalysis';

interface MetricsHUDProps {
  metrics: GeometryMetrics;
  report: IndustrialReport;
}

export const MetricsHUD: React.FC<MetricsHUDProps> = ({ metrics, report }) => {
  const formatPct = (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;

  return (
    <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 border border-slate-700/80 shadow-xl rounded-2xl p-3.5 w-[275px] space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-bold tracking-tight text-white">Metrik Fizikal &amp; DFM</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40">
          Al 6061
        </span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        <Row label="Jisim Bahan" value={`${metrics.massGrams.toFixed(1)} g`} />
        <Row
          label="Beza vs Base Case"
          value={report.isBaseCase ? '0.0%' : formatPct(report.massDiffPct)}
          valueClass={
            report.massDiffPct > 15
              ? 'text-amber-400'
              : report.massDiffPct < -2
              ? 'text-emerald-400'
              : 'text-slate-200'
          }
        />
        <Row label="Luas Terdedah" value={`${metrics.surfaceAreaCm2.toFixed(1)} cm²`} />
        <Row label="Kecekapan Bahan" value={`${report.efficiencyIndex.toFixed(2)} cm²/g`} />
        <Row
          label="Tinggi Keseluruhan"
          value={`${metrics.totalHeight.toFixed(1)} / 50 mm`}
          valueClass={metrics.totalHeight > 50 ? 'text-red-400' : 'text-emerald-400'}
        />
        <Row label="Celah Min (Gap)" value={`${metrics.finGapX.toFixed(1)} mm`} />
        <Row label="Nisbah Aspek (L/g)" value={`${report.aspectRatio.toFixed(1)} : 1`} />
      </div>

      <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
        <Row
          label="Bajet Heat Sink"
          value={`≤ ${report.netHeatSinkBudget.toFixed(2)} °C/W`}
          valueClass="text-sky-400"
        />
        <Row
          label="Kos Pengilangan"
          value={report.costTier}
          valueClass={
            report.costColor === 'emerald'
              ? 'text-emerald-400'
              : report.costColor === 'amber'
              ? 'text-amber-400'
              : 'text-red-400'
          }
        />
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; valueClass?: string }> = ({
  label,
  value,
  valueClass = 'text-white',
}) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <span className={`font-mono font-semibold ${valueClass}`}>{value}</span>
  </div>
);
