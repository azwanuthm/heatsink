import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { HeatSinkParams, CameraView } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

interface Viewport3DProps {
  params: HeatSinkParams;
  isValid: boolean;
  cameraView: CameraView;
  viewTrigger: number;
}

const CAMERA_POSITIONS: Record<CameraView, [number, number, number]> = {
  isometric: [105, 80, 105],
  front: [0, 22, 135],
  side: [135, 22, 0],
  top: [0, 145, 0.1],
};

const CameraController: React.FC<{ cameraView: CameraView; viewTrigger: number }> = ({
  cameraView,
  viewTrigger,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const pos = CAMERA_POSITIONS[cameraView];
    camera.position.set(pos[0], pos[1], pos[2]);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 20, 0);
      controlsRef.current.update();
    }
  }, [cameraView, viewTrigger, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[0, 20, 0]}
      minDistance={45}
      maxDistance={280}
    />
  );
};

const AirflowArrows: React.FC<{ params: HeatSinkParams }> = ({ params }) => {
  const { baseWidth: W, baseLength: L, baseThickness: tb, finHeight: Lc } = params;
  const arrowY = tb + Lc + 12;

  const points: [number, number][] = [
    [-W * 0.3, -L * 0.25],
    [0, -L * 0.25],
    [W * 0.3, -L * 0.25],
    [-W * 0.3, L * 0.25],
    [0, L * 0.25],
    [W * 0.3, L * 0.25],
  ];

  return (
    <group>
      {points.map(([x, z], i) => (
        <group key={i} position={[x, arrowY, z]}>
          {/* Batang anak panah */}
          <mesh position={[0, -5, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 10, 12]} />
            <meshStandardMaterial color="#f97316" transparent opacity={0.85} />
          </mesh>
          {/* Kepala anak panah (ke atas — arah apungan udara panas) */}
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[2.2, 5.5, 16]} />
            <meshStandardMaterial color="#ea580c" transparent opacity={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const HeatSinkMesh: React.FC<{ params: HeatSinkParams; isValid: boolean }> = ({
  params,
  isValid,
}) => {
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
    finish,
    showAirflow,
  } = params;

  const { chip } = ASSIGNMENT_SPECS;

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

  // Tetapan bahan mengikut kemasan & status kekangan
  const materialProps = !isValid
    ? { color: '#ef4444', metalness: 0.35, roughness: 0.45 }
    : finish === 'black-anodized'
    ? { color: '#1e293b', metalness: 0.45, roughness: 0.55 }
    : { color: '#cbd5e1', metalness: 0.72, roughness: 0.25 };

  return (
    <group>
      {/* Tapak Heat Sink */}
      <mesh position={[0, tb / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, tb, L]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Sirip / Pin */}
      {finPositions.map((pos, idx) => (
        <mesh key={idx} position={pos} castShadow receiveShadow>
          {finType === 'rectangular' && <boxGeometry args={[t, Lc, L]} />}
          {finType === 'square-pin' && <boxGeometry args={[t, Lc, t]} />}
          {finType === 'circular-pin' && <cylinderGeometry args={[t / 2, t / 2, Lc, 24]} />}
          <meshStandardMaterial {...materialProps} />
        </mesh>
      ))}

      {/* Blok Cip Silikon */}
      {showChip && (
        <mesh position={[0, -chip.thickness / 2, 0]} receiveShadow>
          <boxGeometry args={[chip.width, chip.thickness, chip.length]} />
          <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.6} />
        </mesh>
      )}

      {/* Anak Panah Aliran Udara Panas */}
      {showAirflow && <AirflowArrows params={params} />}
    </group>
  );
};

export const Viewport3D: React.FC<Viewport3DProps> = ({
  params,
  isValid,
  cameraView,
  viewTrigger,
}) => {
  return (
    <div className="w-full h-full bg-[#f1f5f9]">
      <Canvas shadows camera={{ position: [105, 80, 105], fov: 38 }}>
        <color attach="background" args={['#f1f5f9']} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[80, 130, 70]} intensity={1.1} castShadow />
        <directionalLight position={[-60, 40, -60]} intensity={0.4} />
        <Environment preset="studio" />

        <HeatSinkMesh params={params} isValid={isValid} />

        <Grid
          position={[0, -ASSIGNMENT_SPECS.chip.thickness - 0.1, 0]}
          args={[220, 220]}
          cellSize={10}
          cellThickness={0.5}
          cellColor="#cbd5e1"
          sectionSize={50}
          sectionThickness={1}
          sectionColor="#94a3b8"
          fadeDistance={260}
        />

        <CameraController cameraView={cameraView} viewTrigger={viewTrigger} />
      </Canvas>
    </div>
  );
};
