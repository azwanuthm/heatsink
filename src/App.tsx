import React, { useState, useMemo } from 'react';
import { ASSIGNMENT_SPECS } from './config/assignmentSpecs';
import { HeatSinkParams, CameraView } from './types/heatsink';
import { calculateMetrics } from './core/geometryMath';
import { analyzeIndustrialDFM } from './core/industrialAnalysis';
import { Viewport3D } from './components/Viewport3D';
import { ControlPanel } from './components/ControlPanel';
import { IndustrialPanel } from './components/IndustrialPanel';
import { SolidWorksGuide } from './components/SolidWorksGuide';
import { EngineeringDiagrams } from './components/EngineeringDiagrams';
import { MetricsHUD } from './components/MetricsHUD';

type ActiveTab = 'design' | 'industrial' | 'export';

export function App() {
  const [params, setParams] = useState<HeatSinkParams>(ASSIGNMENT_SPECS.baseCase);
  const [activeTab, setActiveTab] = useState<ActiveTab>('design');
  const [cameraView, setCameraView] = useState<CameraView>('isometric');
  const [viewTrigger, setViewTrigger] = useState<number>(0);

  const metrics = useMemo(() => calculateMetrics(params), [params]);
  const report = useMemo(() => analyzeIndustrialDFM(params, metrics), [params, metrics]);

  const handleSelectView = (view: CameraView) => {
    setCameraView(view);
    setViewTrigger((n) => n + 1);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f1f5f9] text-slate-900 select-none">
      {/* KANVAS 3D PENUH */}
      <div className="absolute inset-0">
        <Viewport3D
          params={params}
          isValid={metrics.isValid}
          cameraView={cameraView}
          viewTrigger={viewTrigger}
        />
      </div>

      {/* ZON 1 (KIRI): Panel Kawalan Terapung */}
      <aside className="absolute top-3 left-3 bottom-3 w-[320px] max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-2xl flex flex-col overflow-hidden z-10">
        {/* Header Jenama Makmal Maya */}
        <div className="px-4 pt-3.5 pb-2.5 border-b border-slate-100">
          <div className="inline-block text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md mb-1">
            MAKMAL MAYA &amp; CAD &bull; {ASSIGNMENT_SPECS.courseCode}
          </div>
          <h1 className="text-base font-extrabold text-slate-900 leading-tight">
            Penjana Heat Sink Industri
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Reka bentuk penyejukan pasif, analisis DFM &amp; eksport .STEP untuk SWFS.
          </p>
        </div>

        {/* Tab Navigasi Ringkas */}
        <div className="grid grid-cols-3 p-1.5 gap-1 bg-slate-100/80 border-b border-slate-200/70">
          {(
            [
              { id: 'design', label: '1. Geometri' },
              { id: 'industrial', label: '2. Industri' },
              { id: 'export', label: '3. Eksport' },
            ] as { id: ActiveTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 text-[11px] font-bold rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Kandungan Panel Boleh Skrol */}
        <div className="p-3.5 overflow-y-auto flex-1">
          {activeTab === 'design' && (
            <ControlPanel params={params} metrics={metrics} onChange={setParams} />
          )}
          {activeTab === 'industrial' && <IndustrialPanel report={report} />}
          {activeTab === 'export' && (
            <SolidWorksGuide params={params} isValid={metrics.isValid} />
          )}
        </div>
      </aside>

      {/* ZON 2 (ATAS TENGAH): Pil Pandangan Kamera */}
      <div className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-full p-1 gap-1 z-10">
        {(
          [
            { id: 'isometric', label: 'Isometrik' },
            { id: 'front', label: 'Depan' },
            { id: 'side', label: 'Sisi' },
            { id: 'top', label: 'Atas' },
          ] as { id: CameraView; label: string }[]
        ).map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelectView(v.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
              cameraView === v.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ZON 3 (KANAN ATAS): Keratan Rentas 2D & Litar Haba */}
      <div className="hidden xl:block absolute top-3 right-3 z-10">
        <EngineeringDiagrams params={params} metrics={metrics} report={report} />
      </div>

      {/* ZON 4 (KANAN BAWAH): Kad Metrik Gelap (HUD) */}
      <div className="hidden xl:block absolute bottom-3 right-3 z-10">
        <MetricsHUD metrics={metrics} report={report} />
      </div>
    </div>
  );
}

export default App;
