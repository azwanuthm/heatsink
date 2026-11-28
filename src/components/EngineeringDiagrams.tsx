import React from 'react';
import { HeatSinkParams, GeometryMetrics } from '../types/heatsink';
import { IndustrialReport } from '../core/industrialAnalysis';

interface EngineeringDiagramsProps {
  params: HeatSinkParams;
  metrics: GeometryMetrics;
  report: IndustrialReport;
}

export const EngineeringDiagrams: React.FC<EngineeringDiagramsProps> = ({
  params,
  metrics,
  report,
}) => {
  const { baseWidth: W, baseThickness: tb, finHeight: Lc, finThickness: t, finType } = params;
  const count = finType === 'rectangular' ? params.finCount : params.pinCountX;

  // Skala lukisan SVG (kotak 240 x 95)
  const svgW = 240;
  const svgH = 92;
  const scale = Math.min(180 / Math.max(W, 60), 68 / Math.max(tb + Lc, 50));
  const drawW = W * scale;
  const drawTb = tb * scale;
  const drawLc = Lc * scale;
  const drawT = Math.max(t * scale, 1.5);
  const startX = (svgW - drawW) / 2;
  const baseY = svgH - 10;

  const pitch = count > 1 ? (W - t) / (count - 1) : 0;
  const isRestricted = report.convectionStatus === 'Aliran Terhad';

  return (
    <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg rounded-2xl p-3.5 w-[275px] space-y-3">
      {/* Tajuk Kad */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-800">Keratan 2D &amp; Lapisan Sempadan</div>
<span
  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
    isRestricted
      ? 'bg-amber-100 text-amber-700'
      : report.convectionStatus === 'Optimum'
      ? 'bg-emerald-100 text-emerald-700'
      : 'bg-slate-100 text-slate-600'
  }`}
>
  {report.convectionStatus}
</span>
      </div>

      {/* 1. Rajah Keratan Rentas 2D */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-1.5">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-[88px]">
          {/* Garisan had maksimum 50 mm */}
          <line
            x1={14}
            y1={baseY - 50 * scale}
            x2={svgW - 14}
            y2={baseY - 50 * scale}
            stroke="#ef4444"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          <text x={svgW - 14} y={baseY - 50 * scale - 2} textAnchor="end" fontSize="7" fill="#ef4444">
            Had 50mm
          </text>

          {/* Lapisan Sempadan Haba (warna merah jika tercekik, biru lembut jika optimum) */}
          {Array.from({ length: Math.max(0, count - 1) }).map((_, i) => {
            const x1 = startX + (i * pitch + t) * scale;
            const x2 = startX + (i + 1) * pitch * scale;
            const gapPx = Math.max(0, x2 - x1);
            if (gapPx <= 0.5) return null;
            return (
              <rect
                key={`gap-${i}`}
                x={x1}
                y={baseY - drawTb - drawLc + 2}
                width={gapPx}
                height={drawLc - 2}
                fill={isRestricted ? 'rgba(245, 158, 11, 0.22)' : 'rgba(56, 189, 248, 0.15)'}
              />
            );
          })}

          {/* Tapak */}
          <rect
            x={startX}
            y={baseY - drawTb}
            width={drawW}
            height={drawTb}
            fill={params.finish === 'black-anodized' ? '#334155' : '#94a3b8'}
            stroke="#1e293b"
            strokeWidth="0.8"
          />

          {/* Sirip */}
          {Array.from({ length: count }).map((_, i) => {
            const fx = count > 1 ? startX + i * pitch * scale : svgW / 2 - drawT / 2;
            return (
              <rect
                key={`fin-${i}`}
                x={fx}
                y={baseY - drawTb - drawLc}
                width={drawT}
                height={drawLc}
                fill={params.finish === 'black-anodized' ? '#334155' : '#94a3b8'}
                stroke="#1e293b"
                strokeWidth="0.7"
              />
            );
          })}

          {/* Cip Silikon di bawah tapak */}
          <rect
            x={(svgW - 40 * scale) / 2}
            y={baseY}
            width={40 * scale}
            height={Math.max(2 * scale, 2.5)}
            fill="#0f172a"
          />
        </svg>
        <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-0.5 font-mono">
          <span>W={W}mm | H={metrics.totalHeight.toFixed(0)}mm</span>
          <span>Gap={metrics.finGapX.toFixed(1)}mm</span>
        </div>
      </div>

      {/* 2. Skematik Litar Rintangan Haba (Rujukan Fasa 1) */}
      <div className="space-y-1">
        <div className="text-[11px] font-semibold text-slate-700">Litar Rintangan Haba (Fasa 1)</div>
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-2 py-2">
          <svg viewBox="0 0 240 42" className="w-full h-[38px]">
            {/* Garisan sambungan */}
            <line x1="22" y1="20" x2="62" y2="20" stroke="#475569" strokeWidth="1.4" />
            <line x1="108" y1="20" x2="132" y2="20" stroke="#475569" strokeWidth="1.4" />
            <line x1="178" y1="20" x2="216" y2="20" stroke="#475569" strokeWidth="1.4" />

            {/* Nod T_chip */}
            <circle cx="22" cy="20" r="3.5" fill="#ea580c" />
            <text x="22" y="10" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#c2410c">
              T_chip
            </text>
            <text x="22" y="34" textAnchor="middle" fontSize="7" fill="#64748b">
              10W
            </text>

            {/* Kotak R_cond */}
            <rect x="62" y="11" width="46" height="18" rx="4" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.2" />
            <text x="85" y="23" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">
              R_cond
            </text>

            {/* Kotak R_conv */}
            <rect x="132" y="11" width="46" height="18" rx="4" fill="#ffffff" stroke="#0891b2" strokeWidth="1.2" />
            <text x="155" y="23" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0e7490">
              R_conv
            </text>

            {/* Nod T_inf */}
            <circle cx="216" cy="20" r="3.5" fill="#0284c7" />
            <text x="216" y="10" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0369a1">
              T_∞
            </text>
            <text x="216" y="34" textAnchor="middle" fontSize="7" fill="#64748b">
              30°C
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};
