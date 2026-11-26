import React from 'react';
import { GeometryMetrics } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

interface MetricsBarProps {
  metrics: GeometryMetrics;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  const { limits } = ASSIGNMENT_SPECS;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="text-xs text-slate-400">Anggaran Jisim (Al 6061)</div>
        <div className="text-xl font-semibold text-white mt-0.5">
          {metrics.massGrams.toFixed(1)} <span className="text-sm font-normal text-slate-400">g</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="text-xs text-slate-400">Luas Permukaan Terdedah</div>
        <div className="text-xl font-semibold text-white mt-0.5">
          {metrics.surfaceAreaCm2.toFixed(1)} <span className="text-sm font-normal text-slate-400">cm²</span>
        </div>
        <div className="text-[11px] text-slate-500">{metrics.surfaceAreaM2.toFixed(4)} m²</div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="text-xs text-slate-400">Ketinggian Keseluruhan</div>
        <div
          className={`text-xl font-semibold mt-0.5 ${
            metrics.totalHeight > limits.maxTotalHeight ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {metrics.totalHeight.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ {limits.maxTotalHeight} mm</span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="text-xs text-slate-400">Jarak Celah (Gap)</div>
        <div
          className={`text-xl font-semibold mt-0.5 ${
            metrics.finGapX < limits.minFinGap ? 'text-amber-400' : 'text-white'
          }`}
        >
          {metrics.finGapX.toFixed(1)}
          {metrics.finGapY !== null ? ` × ${metrics.finGapY.toFixed(1)}` : ''}{' '}
          <span className="text-sm font-normal text-slate-400">mm</span>
        </div>
      </div>
    </div>
  );
};
