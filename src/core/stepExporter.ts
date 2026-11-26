import { HeatSinkParams } from '../types/heatsink';
import { ASSIGNMENT_SPECS } from '../config/assignmentSpecs';

let isOCInitialized = false;

/**
 * Muatkan enjin CAD OpenCascade (WebAssembly) secara lazy-loading
 * hanya apabila pelajar menekan butang eksport .STEP.
 */
async function initOpenCascade() {
  if (isOCInitialized) return;

  const { setOC } = await import('replicad');
  // @ts-ignore - fail wasm diuruskan oleh Vite ?url
  const opencascade = (await import('replicad-opencascadejs/src/replicad_single.js')).default;
  // @ts-ignore
  const opencascadeWasm = (await import('replicad-opencascadejs/src/replicad_single.wasm?url')).default;

  const OC = await opencascade({
    locateFile: () => opencascadeWasm,
  });

  setOC(OC);
  isOCInitialized = true;
}

/**
 * Jana dan muat turun fail .STEP (Multi-Body: Heat Sink + Chip)
 */
export async function exportHeatSinkSTEP(params: HeatSinkParams): Promise<void> {
  await initOpenCascade();

  const { makeBaseBox, makeCylinder, makeCompound } = await import('replicad');
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
  } = params;

  const { chip } = ASSIGNMENT_SPECS;

  // 1. Bina Tapak Heat Sink (z = 0 hingga tb)
  let heatSink = makeBaseBox(W, L, tb);

  // 2. Bina Sirip & Gabungkan (Fuse) dengan Tapak
  if (finType === 'rectangular') {
    const pitchX = N > 1 ? (W - t) / (N - 1) : 0;
    for (let i = 0; i < N; i++) {
      const xPos = N > 1 ? -W / 2 + t / 2 + i * pitchX : 0;
      const fin = makeBaseBox(t, L, Lc).translate([xPos, 0, tb]);
      heatSink = heatSink.fuse(fin);
    }
  } else {
    const pitchX = Nx > 1 ? (W - t) / (Nx - 1) : 0;
    const pitchY = Ny > 1 ? (L - t) / (Ny - 1) : 0;

    for (let i = 0; i < Nx; i++) {
      const xPos = Nx > 1 ? -W / 2 + t / 2 + i * pitchX : 0;
      for (let j = 0; j < Ny; j++) {
        const yPos = Ny > 1 ? -L / 2 + t / 2 + j * pitchY : 0;

        const pin =
          finType === 'square-pin'
            ? makeBaseBox(t, t, Lc).translate([xPos, yPos, tb])
            : makeCylinder(t / 2, Lc, [xPos, yPos, tb], [0, 0, 1]);

        heatSink = heatSink.fuse(pin);
      }
    }
  }

  // 3. Bina Cip Silikon (Separate Solid Body di bawah tapak: z = -chip.thickness hingga 0)
  const chipBody = makeBaseBox(chip.width, chip.length, chip.thickness).translate([
    0,
    0,
    -chip.thickness,
  ]);

  // 4. Gabung sebagai Multi-Body Compound (TIDAK di-fuse supaya kekal 2 Solid Bodies di SolidWorks)
  const assembly = makeCompound([heatSink, chipBody]);
  const blob = assembly.blobSTEP();

  // 5. Muat turun fail secara automatik
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const finLabel = finType === 'rectangular' ? `Rect_N${N}` : `${finType}_${Nx}x${Ny}`;
  link.href = url;
  link.download = `HeatSink_${finLabel}_H${tb + Lc}mm.step`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
