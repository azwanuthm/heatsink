import React, { useState } from 'react';
import { Download, Loader2, CheckSquare, AlertCircle } from 'lucide-react';
import { HeatSinkParams } from '../types/heatsink';
import { exportHeatSinkSTEP } from '../core/stepExporter';

interface SolidWorksGuideProps {
  params: HeatSinkParams;
  isValid: boolean;
}

export const SolidWorksGuide: React.FC<SolidWorksGuideProps> = ({ params, isValid }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMsg(null);
    try {
      await exportHeatSinkSTEP(params);
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal menjana fail .STEP. Sila pastikan geometri tidak bertindih dan cuba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Kad Eksport .STEP */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="text-sm font-semibold text-white">Eksport Model 3D (.STEP Multi-Body)</div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Fail yang dimuat turun mengandungi <strong>2 Solid Bodies</strong> berasingan (Heat Sink + Cip Silikon 40×40×2 mm). Terus buka menggunakan <em>File &gt; Open</em> dalam SolidWorks Student Edition.
        </p>

        <button
          onClick={handleExport}
          disabled={isExporting || !isValid}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition ${
            !isValid
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : isExporting
              ? 'bg-blue-700 text-blue-100 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menjana Fail .STEP (Sila tunggu)...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Muat Turun Fail .STEP
            </>
          )}
        </button>

        {!isValid && (
          <p className="text-[11px] text-amber-400">
            * Sila patuhi had dimensi pada tab Reka Bentuk sebelum mengeksport model.
          </p>
        )}

        {errorMsg && (
          <div className="flex items-start gap-2 text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Senarai Semak Pantas SolidWorks Flow Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <CheckSquare className="w-4 h-4 text-blue-400" />
          Senarai Semak Flow Simulation (Fasa 2)
        </div>

        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Analysis Type</span>
            <span className="font-medium text-white">External Flow</span>
          </li>
          <li className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Physical Features</span>
            <span className="font-medium text-white">Heat Conduction in Solids, Gravity (ON)</span>
          </li>
          <li className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Fluids &amp; Suhu Ambien</span>
            <span className="font-medium text-white">Air (Gases), 30 °C</span>
          </li>
          <li className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Material Heat Sink</span>
            <span className="font-medium text-white">Aluminium 6061</span>
          </li>
          <li className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">Material Cip</span>
            <span className="font-medium text-white">Silicon</span>
          </li>
          <li className="flex justify-between">
            <span className="text-slate-400">Heat Source (pada Cip)</span>
            <span className="font-medium text-emerald-400">Volume Source: 10 W</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
