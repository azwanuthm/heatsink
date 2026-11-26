import React, { useState, useMemo } from 'react';
import { Sliders, Box } from 'lucide-react';
import { ASSIGNMENT_SPECS } from './config/assignmentSpecs';
import { HeatSinkParams } from './types/heatsink';
import { calculateMetrics } from './core/geometryMath';
import { Viewport3D } from './components/Viewport3D';
import { MetricsBar } from './components/MetricsBar';
import { ControlPanel } from './components/ControlPanel';
import { SolidWorksGuide } from './components/SolidWorksGuide';

type ActiveTab = 'design' | 'export';

export function App() {
  const [params, setParams] = useState<HeatSinkParams>(ASSIGNMENT_SPECS.baseCase);
  const [activeTab, setActiveTab] = useState<ActiveTab>('design');

  const metrics = useMemo(() => calculateMetrics(params), [params]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Ringkas */}
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">
            Penjana Heat Sink 3D <span className="text-blue-400 font-normal">| {ASSIGNMENT_SPECS.courseCode}</span>
          </h1>
          <p className="text-xs text-slate-400">
            Alat Bantu Reka Bentuk &amp; Eksport CAD ({ASSIGNMENT_SPECS.courseName})
          </p>
        </div>
        <div className="hidden sm:block text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          Had Tugasan: Tapak ≤ {ASSIGNMENT_SPECS.limits.maxBaseWidth}×{ASSIGNMENT_SPECS.limits.maxBaseLength} mm &bull; Tinggi ≤ {ASSIGNMENT_SPECS.limits.maxTotalHeight} mm
        </div>
      </header>

      {/* Ruang Kerja Utama */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1600px] w-full mx-auto">
        {/* Kiri: Paparan 3D + Metrik Langsung */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-h-[480px]">
          <MetricsBar metrics={metrics} />
          <div className="flex-1 min-h-[400px]">
            <Viewport3D params={params} isValid={metrics.isValid} />
          </div>
        </div>

        {/* Kanan: Panel Kawalan Ber-Tab (Modular) */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-900">
            <button
              onClick={() => setActiveTab('design')}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-semibold transition border-b-2 ${
                activeTab === 'design'
                  ? 'border-blue-500 text-blue-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Reka Bentuk (A)
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center justify-center gap-2 py-3 text-xs font-semibold transition border-b-2 ${
                activeTab === 'export'
                  ? 'border-blue-500 text-blue-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-4 h-4" />
              Eksport .STEP (C)
            </button>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {activeTab === 'design' ? (
              <ControlPanel
                params={params}
                metrics={metrics}
                onChange={setParams}
                onResetBaseCase={() => setParams(ASSIGNMENT_SPECS.baseCase)}
              />
            ) : (
              <SolidWorksGuide params={params} isValid={metrics.isValid} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
