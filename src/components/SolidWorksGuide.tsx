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
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div className="text-xs font-bold text-slate-800">Eksport Model 3D (.STEP Multi-Body)</div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Fail yang dimuat turun mengandungi <strong>2 Solid Bodies</strong> berasingan (Heat Sink + Cip Silikon 40×40×2 mm). Terus buka menggunakan <em>File &gt; Open</em> dalam SolidWorks Student Edition.
        </p>

        <button
          onClick={handleExport}
          disabled={isExporting || !isValid}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
            !isValid
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : isExporting
              ? 'bg-blue-500 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
          }`}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menjana Fail .STEP...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Muat Turun Fail .STEP
            </>
          )}
        </button>

        {!isValid && (
          <p className="text-[10px] text-amber-600 font-medium">
            * Sila patuhi had dimensi pada tab Geometri sebelum mengeksport model.
          </p>
        )}

        {errorMsg && (
          <div className="flex items-start gap-2 text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Senarai Semak Pantas SolidWorks Flow Simulation */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <CheckSquare className="w-4 h-4 text-blue-600" />
          Senarai Semak Flow Simulation (Fasa 2)
        </div>

        <ul className="space-y-1.5 text-[11px] text-slate-600">
          <li className="flex justify-between border-b border-slate-200/80 pb-1">
            <span>Analysis Type</span>
            <span className="font-semibold text-slate-900">External Flow</span>
          </li>
          <li className="flex justify-between border-b border-slate-200/80 pb-1">
            <span>Physical Features</span>
            <span className="font-semibold text-slate-900">Heat Conduction, Gravity ON</span>
          </li>
          <li className="flex justify-between border-b border-slate-200/80 pb-1">
            <span>Fluids &amp; Ambien</span>
            <span className="font-semibold text-slate-900">Air (Gases), 30 °C</span>
          </li>
          <li className="flex justify-between border-b border-slate-200/80 pb-1">
            <span>Material Heat Sink</span>
            <span className="font-semibold text-slate-900">Aluminium 6061</span>
          </li>
          <li className="flex justify-between border-b border-slate-200/80 pb-1">
            <span>Material Cip</span>
            <span className="font-semibold text-slate-900">Silicon</span>
          </li>
          <li className="flex justify-between">
            <span>Heat Source (Cip)</span>
            <span className="font-bold text-emerald-700">Volume Source: 10 W</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
