import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { HeatSinkParams } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

interface Viewport3DProps {
  params: HeatSinkParams;
  isValid: boolean;
}

const HeatSinkMesh: React.FC<Viewport3DProps> = ({ params, isValid }) => {
  const {
    finType,
    baseWidth: W,
    baseLength: L,
    baseThickness: tb,
    finHeight: Lc,
    finThickness: t,
    finCount: N,
    pinCountX: Nx,
    pinCountY: Ny,
    showChip,
  } = params;

  const { chip } = ASSIGNMENT_SPECS;

  // Kira kedudukan semua sirip/pin sekali sahaja apabila parameter berubah
  const finPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const yCenter = tb + Lc / 2;

    if (finType === 'rectangular') {
      const pitchX = N > 1 ? (W - t) / (N - 1) : 0;
      for (let i = 0; i < N; i++) {
        const x = N > 1 ? -W / 2 + t / 2 + i * pitchX : 0;
        positions.push([x, yCenter, 0]);
      }
    } else {
      const pitchX = Nx > 1 ? (W - t) / (Nx - 1) : 0;
      const pitchZ = Ny > 1 ? (L - t) / (Ny - 1) : 0;
      for (let i = 0; i < Nx; i++) {
        const x = Nx > 1 ? -W / 2 + t / 2 + i * pitchX : 0;
        for (let j = 0; j < Ny; j++) {
          const z = Ny > 1 ? -L / 2 + t / 2 + j * pitchZ : 0;
          positions.push([x, yCenter, z]);
        }
      }
    }
    return positions;
  }, [finType, W, L, tb, Lc, t, N, Nx, Ny]);

  // Warna Aluminium 6061 (atau merah lembut jika melanggar had kekangan)
  const metalColor = isValid ? '#cbd5e1' : '#fca5a5';

  return (
    <group>
      {/* Tapak Heat Sink */}
      <mesh position={[0, tb / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, tb, L]} />
        <meshStandardMaterial color={metalColor} metalness={0.75} roughness={0.28} />
      </mesh>

      {/* Sirip / Pin */}
      {finPositions.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow receiveShadow>
          {finType === 'rectangular' && <boxGeometry args={[t, Lc, L]} />}
          {finType === 'square-pin' && <boxGeometry args={[t, Lc, t]} />}
          {finType === 'circular-pin' && <cylinderGeometry args={[t / 2, t / 2, Lc, 24]} />}
          <meshStandardMaterial color={metalColor} metalness={0.75} roughness={0.28} />
        </mesh>
      ))}

      {/* Blok Cip Silikon (40 x 40 x 2 mm di bawah tapak) */}
      {showChip && (
        <mesh position={[0, -chip.thickness / 2, 0]} receiveShadow>
          <boxGeometry args={[chip.width, chip.thickness, chip.length]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
        </mesh>
      )}
    </group>
  );
};

export const Viewport3D: React.FC<Viewport3DProps> = ({ params, isValid }) => {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      <Canvas shadows camera={{ position: [95, 75, 95], fov: 40 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[80, 120, 60]} intensity={1.2} castShadow />
        <Environment preset="city" />

        <HeatSinkMesh params={params} isValid={isValid} />

        <Grid
          position={[0, -ASSIGNMENT_SPECS.chip.thickness - 0.1, 0]}
          args={[160, 160]}
          cellSize={10}
          cellThickness={0.6}
          cellColor="#334155"
          sectionSize={50}
          sectionThickness={1}
          sectionColor="#475569"
          fadeDistance={250}
        />

        <OrbitControls makeDefault target={[0, 20, 0]} minDistance={40} maxDistance={260} />
      </Canvas>

      {/* Petunjuk Kawalan Tetikus */}
      <div className="absolute bottom-3 left-3 text-xs text-slate-400 bg-slate-950/70 px-3 py-1.5 rounded-lg backdrop-blur-sm">
        Klik kiri: Pusing &bull; Skrol: Zum &bull; Klik kanan: Alih
      </div>
    </div>
  );
};
