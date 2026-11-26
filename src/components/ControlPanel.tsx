import React from 'react';
import { RotateCcw, AlertTriangle, CheckCircle2, Factory } from 'lucide-react';
import { HeatSinkParams, GeometryMetrics, FinType } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

interface ControlPanelProps {
  params: HeatSinkParams;
  metrics: GeometryMetrics;
  onChange: (updated: HeatSinkParams) => void;
  onResetBaseCase: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  metrics,
  onChange,
  onResetBaseCase,
}) => {
  const update = <K extends keyof HeatSinkParams>(key: K, value: HeatSinkParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="space-y-5">
      {/* Butang Praset Base Case */}
      <button
        onClick={onResetBaseCase}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-medium rounded-lg border border-slate-700 transition"
      >
        <RotateCcw className="w-4 h-4" />
        Tetapkan Semula ke Base Case (Fasa 1 &amp; 2)
      </button>

      {/* Praset Contoh Industri Sebenar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          <Factory className="w-3.5 h-3.5 text-blue-400" />
          Rujukan Reka Bentuk Industri Sebenar:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ASSIGNMENT_SPECS.industrialPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onChange(preset.params)}
              className="py-1.5 px-2.5 text-[11px] font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg transition text-left truncate"
              title={preset.label}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Kekangan */}
      {metrics.warnings.length > 0 ? (
        <div className="bg-red-950/50 border border-red-800/80 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-2 text-red-400 text-xs font-semibold uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Amaran Kekangan Reka Bentuk
          </div>
          <ul className="text-xs text-red-200 list-disc list-inside space-y-1">
            {metrics.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-3 flex items-center gap-2 text-emerald-300 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Semua spesifikasi had tugasan dipatuhi.
        </div>
      )}

      {/* Pilihan Jenis Sirip */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Jenis Geometri Sirip</label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'rectangular', label: 'Rectangular' },
              { id: 'square-pin', label: 'Square Pin' },
              { id: 'circular-pin', label: 'Circular Pin' },
            ] as { id: FinType; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => update('finType', item.id)}
              className={`py-2 px-2 text-xs font-medium rounded-lg border transition ${
                params.finType === item.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensi Tapak */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Dimensi Tapak</div>

        <SliderField
          label="Lebar Tapak (W)"
          value={params.baseWidth}
          min={40}
          max={70}
          step={1}
          unit="mm"
          onChange={(v) => update('baseWidth', v)}
        />
        <SliderField
          label="Panjang Tapak (L)"
          value={params.baseLength}
          min={40}
          max={70}
          step={1}
          unit="mm"
          onChange={(v) => update('baseLength', v)}
        />
        <SliderField
          label="Tebal Tapak (t_b)"
          value={params.baseThickness}
          min={2}
          max={15}
          step={0.5}
          unit="mm"
          onChange={(v) => update('baseThickness', v)}
        />
      </div>

      {/* Dimensi Sirip */}
      <div className="space-y-3 pt-2 border-t border-slate-800">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Dimensi Sirip / Pin</div>

        <SliderField
          label="Tinggi Sirip (L_c)"
          value={params.finHeight}
          min={10}
          max={50}
          step={1}
          unit="mm"
          onChange={(v) => update('finHeight', v)}
        />
        <SliderField
          label={params.finType === 'circular-pin' ? 'Diameter Pin (d)' : 'Tebal Sirip / Pin (t)'}
          value={params.finThickness}
          min={1}
          max={10}
          step={0.5}
          unit="mm"
          onChange={(v) => update('finThickness', v)}
        />

        {params.finType === 'rectangular' ? (
          <SliderField
            label="Bilangan Sirip (N)"
            value={params.finCount}
            min={2}
            max={20}
            step={1}
            unit="keping"
            onChange={(v) => update('finCount', v)}
          />
        ) : (
          <>
            <SliderField
              label="Bilangan Pin Arah X (Nx)"
              value={params.pinCountX}
              min={2}
              max={12}
              step={1}
              unit="baris"
              onChange={(v) => update('pinCountX', v)}
            />
            <SliderField
              label="Bilangan Pin Arah Y (Ny)"
              value={params.pinCountY}
              min={2}
              max={12}
              step={1}
              unit="lajur"
              onChange={(v) => update('pinCountY', v)}
            />
          </>
        )}
      </div>

      {/* Toggle Cip Silikon */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-slate-200">
            Papar Cip Silikon ({ASSIGNMENT_SPECS.chip.width}×{ASSIGNMENT_SPECS.chip.length}×{ASSIGNMENT_SPECS.chip.thickness} mm)
          </div>
          <div className="text-[11px] text-slate-400">Sentiasa disertakan dalam fail eksport .STEP</div>
        </div>
        <input
          type="checkbox"
          checked={params.showChip}
          onChange={(e) => update('showChip', e.target.checked)}
          className="w-4 h-4 accent-blue-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

const SliderField: React.FC<SliderFieldProps> = ({ label, value, min, max, step, unit, onChange }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-300">{label}</span>
      <span className="font-mono text-blue-400 font-medium">
        {value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-blue-500 cursor-pointer"
    />
  </div>
);
