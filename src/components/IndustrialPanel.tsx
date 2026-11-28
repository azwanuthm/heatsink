import React from 'react';
import { Factory, Flame, Wind, ClipboardCheck } from 'lucide-react';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';
import { IndustrialReport } from '../core/industrialAnalysis';

interface IndustrialPanelProps {
  report: IndustrialReport;
}

const badgeStyles = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
};

export const IndustrialPanel: React.FC<IndustrialPanelProps> = ({ report }) => {
  const { thermal, chip } = ASSIGNMENT_SPECS;

  return (
    <div className="space-y-3.5">
      {/* 1. Fokus Analisis & Justifikasi Laporan (PO3) */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800">
          <ClipboardCheck className="w-4 h-4 shrink-0" />
          Fokus Analisis &amp; Justifikasi (PO3)
        </div>
        <p className="text-[11px] text-slate-700 leading-relaxed">{report.po3Challenge}</p>
      </div>

      {/* 2. Kebolehbuatan & Kos (DFM) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wide">
            <Factory className="w-3.5 h-3.5 text-slate-500" />
            Kebolehbuatan (DFM)
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              badgeStyles[report.costColor]
            }`}
          >
            Kos: {report.costTier}
          </span>
        </div>

        <div className="text-xs font-bold text-slate-900">{report.manufacturingMethod}</div>
        <p className="text-[11px] text-slate-600 leading-relaxed">{report.dfmNote}</p>
      </div>

      {/* 3. Realiti Perolakan Semula Jadi */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wide">
            <Wind className="w-3.5 h-3.5 text-cyan-600" />
            Aliran Udara (Natural)
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              badgeStyles[report.convectionColor]
            }`}
          >
            {report.convectionStatus}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">{report.convectionNote}</p>
      </div>

      {/* 4. Rujukan Bajet Rintangan Haba & Anodizing */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            Bajet Haba ({chip.heatPower} W)
          </span>
          <span className="font-mono font-bold text-blue-700">
            ≤ {report.netHeatSinkBudget.toFixed(2)} °C/W
          </span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Had sistem: {report.maxThermalBudget.toFixed(2)} °C/W ({thermal.tMaxChip}°C &minus;{' '}
          {thermal.tAmbient}°C) ditolak ≈{thermal.timAllowance} °C/W untuk rintangan TIM. Kemasan{' '}
          <em>Black Anodized</em> (ε ≈ 0.85) menambah 20%–30% penyejukan sinaran dalam udara tenang.
        </p>
      </div>
    </div>
  );
};
