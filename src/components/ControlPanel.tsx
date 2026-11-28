import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { HeatSinkParams, GeometryMetrics, FinType, SurfaceFinish } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

interface ControlPanelProps {
  params: HeatSinkParams;
  metrics: GeometryMetrics;
  onChange: (updated: HeatSinkParams) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  metrics,
  onChange,
}) => {
  const [activePresetDesc, setActivePresetDesc] = useState<string>(
    ASSIGNMENT_SPECS.industrialPresets[0].desc
  );

  const update = <K extends keyof HeatSinkParams>(key: K, value: HeatSinkParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* 1. Pratetap Rujukan (Grid 2x2) */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-slate-700">1. Pratetap Rujukan Industri</div>
        <div className="grid grid-cols-2 gap-1.5">
          {ASSIGNMENT_SPECS.industrialPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                onChange(preset.params);
                setActivePresetDesc(preset.desc);
              }}
              className="py-1.5 px-2 text-[11px] font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 border border-slate-200 rounded-lg transition text-center truncate"
              title={preset.label}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 leading-snug">{activePresetDesc}</p>
      </div>

      {/* Status Kekangan */}
      {metrics.warnings.length > 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-2.5 space-y-1">
          <div className="flex items-center gap-1.5 text-red-700 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Amaran Had Tugasan
          </div>
          <ul className="text-[11px] text-red-600 list-disc list-inside space-y-0.5">
            {metrics.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-2 flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          Semua had dimensi tugasan dipatuhi.
        </div>
      )}

      {/* 2. Jenis Geometri & Kemasan */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-700">2. Geometri &amp; Kemasan</div>
        <div className="grid grid-cols-3 gap-1.5">
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
              className={`py-1.5 px-1.5 text-[11px] font-semibold rounded-lg border transition ${
                params.finType === item.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              { id: 'raw', label: 'Raw Aluminium' },
              { id: 'black-anodized', label: 'Black Anodized' },
            ] as { id: SurfaceFinish; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => update('finish', item.id)}
              className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border transition ${
                params.finish === item.id
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Dimensi Tapak */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-700">3. Dimensi Tapak</div>

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

      {/* 4. Dimensi Sirip / Pin */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="text-[11px] font-bold text-slate-700">4. Dimensi Sirip / Pin</div>

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
              label="Bilangan Pin X (Nx)"
              value={params.pinCountX}
              min={2}
              max={12}
              step={1}
              unit="baris"
              onChange={(v) => update('pinCountX', v)}
            />
            <SliderField
              label="Bilangan Pin Y (Ny)"
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

      {/* 5. Pilihan Paparan 3D */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
          <span>Papar Cip Silikon (40×40×2 mm)</span>
          <input
            type="checkbox"
            checked={params.showChip}
            onChange={(e) => update('showChip', e.target.checked)}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
          <span>Papar Arah Aliran Udara Panas</span>
          <input
            type="checkbox"
            checked={params.showAirflow}
            onChange={(e) => update('showAirflow', e.target.checked)}
            className="w-4 h-4 accent-orange-500 cursor-pointer"
          />
        </label>
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

const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}) => (
  <div>
    <div className="flex justify-between text-[11px] mb-0.5">
      <span className="text-slate-600">{label}</span>
      <span className="font-mono font-semibold text-slate-900">
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
      className="w-full h-1.5 bg-slate-200 rounded-lg accent-blue-600 cursor-pointer"
    />
  </div>
);
