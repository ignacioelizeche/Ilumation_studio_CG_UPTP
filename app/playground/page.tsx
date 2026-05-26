'use client';

import { useState } from 'react';
import {
  CanvasRenderer,
  type PlaygroundGeometry,
  type PlaygroundMaterial,
  type PlaygroundRenderSettings,
} from '@/src/components/CanvasRenderer';

const geometryOptions: Array<{
  value: PlaygroundGeometry;
  label: string;
  description: string;
  triangles: number;
}> = [
  { value: 'cube', label: 'Cube', description: 'Best for transforms and face normals.', triangles: 12 },
  { value: 'sphere', label: 'Sphere', description: 'Smooth shading and specular highlights.', triangles: 1008 },
  { value: 'cylinder', label: 'Cylinder', description: 'Great for caps, sides, and seams.', triangles: 320 },
  { value: 'torus', label: 'Torus', description: 'Useful to study curved surfaces.', triangles: 1008 },
  { value: 'plane', label: 'Plane', description: 'A minimal surface for lighting demos.', triangles: 2 },
];

const materialOptions: Array<{
  value: PlaygroundMaterial;
  label: string;
  description: string;
}> = [
  { value: 'gold', label: 'Gold', description: 'Strong specular response with warm color.' },
  { value: 'plastic', label: 'Plastic', description: 'Diffuse surface with a tight highlight.' },
  { value: 'metal', label: 'Metal', description: 'Sharper highlight and reflective look.' },
  { value: 'red', label: 'Red', description: 'Simple colored material for diffuse study.' },
  { value: 'green', label: 'Green', description: 'Useful to compare channel response.' },
  { value: 'blue', label: 'Blue', description: 'Good for observing light falloff.' },
];

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-200">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-cyan-300">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400"
      />
    </label>
  );
}

function OptionGrid<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string; description: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          {label}
        </h3>
        <span className="text-xs text-slate-500">Click to switch instantly</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={[
                'rounded-2xl border px-3 py-3 text-left transition-all duration-200',
                active
                  ? 'border-cyan-400/80 bg-cyan-400/10 shadow-lg shadow-cyan-900/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10',
              ].join(' ')}
            >
              <div className="text-sm font-semibold text-white">{option.label}</div>
              <div className="mt-1 text-xs leading-5 text-slate-400">
                {option.description}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function PlaygroundPage() {
  const [settings, setSettings] = useState<PlaygroundRenderSettings>({
    geometry: 'cube',
    material: 'gold',
    scale: 1,
    rotation: { x: 0.45, y: 0.75, z: 0.05 },
    lightPosition: { x: 3.5, y: 2.5, z: 3.5 },
    lightIntensity: 1,
    ambientLight: 0.28,
    cameraPosition: { x: 0, y: 0.35, z: 4.5 },
    backgroundColor: [0.04, 0.07, 0.12],
  });

  const activeGeometry = geometryOptions.find(option => option.value === settings.geometry)!;
  const activeMaterial = materialOptions.find(option => option.value === settings.material)!;

  const updateVector = (
    key: 'rotation' | 'lightPosition' | 'cameraPosition',
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    setSettings(current => ({
      ...current,
      [key]: {
        ...current[key],
        [axis]: value,
      },
    }));
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b16] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,_rgba(2,6,23,0.92),_rgba(2,6,23,1))]" />
      <div className="pointer-events-none absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8%] right-[-8%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Interactive Playground
            </div>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Modifica geometrías, luz y materiales en tiempo real.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Este laboratorio conecta el pipeline de rasterización con controles didácticos para que puedas ver cómo cambian las normales, el brillo especular y la forma final del objeto.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Geometry</div>
              <div className="mt-1 text-lg font-semibold text-white">{activeGeometry.label}</div>
              <div className="mt-2 text-sm text-slate-400">{activeGeometry.description}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Material</div>
              <div className="mt-1 text-lg font-semibold text-white">{activeMaterial.label}</div>
              <div className="mt-2 text-sm text-slate-400">{activeMaterial.description}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Triángulos</div>
              <div className="mt-1 text-lg font-semibold text-white">{activeGeometry.triangles}</div>
              <div className="mt-2 text-sm text-slate-400">Con la malla actual del generador.</div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-950/20 backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Viewport</h2>
                  <p className="text-sm text-slate-400">
                    Render en vivo con z-buffer, barycentric interpolation y Phong lighting.
                  </p>
                </div>
                <div className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100 sm:block">
                  Drag the controls to update the frame
                </div>
              </div>
              <CanvasRenderer width={720} height={720} settings={settings} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Phong</div>
                <div className="mt-2 text-lg font-semibold text-white">Ambient</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Base light that keeps the back faces visible even when the diffuse term falls off.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Phong</div>
                <div className="mt-2 text-lg font-semibold text-white">Diffuse</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Changes with the angle between the surface normal and the light direction.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Phong</div>
                <div className="mt-2 text-lg font-semibold text-white">Specular</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Highlights tighten as shininess grows, which is easier to study on curved surfaces.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Controls</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Move light, rotate the model, and switch geometry or material without reloading.
                </p>
              </div>

              <OptionGrid
                label="Geometry"
                options={geometryOptions}
                value={settings.geometry}
                onChange={(geometry) => setSettings(current => ({ ...current, geometry }))}
              />

              <OptionGrid
                label="Material"
                options={materialOptions}
                value={settings.material}
                onChange={(material) => setSettings(current => ({ ...current, material }))}
              />

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Transform</h3>
                <SliderRow
                  label="Scale"
                  value={settings.scale}
                  min={0.6}
                  max={1.8}
                  step={0.05}
                  onChange={(scale) => setSettings(current => ({ ...current, scale }))}
                />
                <SliderRow
                  label="Rotation X"
                  value={settings.rotation.x}
                  min={-3.14}
                  max={3.14}
                  step={0.01}
                  unit=" rad"
                  onChange={(value) => updateVector('rotation', 'x', value)}
                />
                <SliderRow
                  label="Rotation Y"
                  value={settings.rotation.y}
                  min={-3.14}
                  max={3.14}
                  step={0.01}
                  unit=" rad"
                  onChange={(value) => updateVector('rotation', 'y', value)}
                />
                <SliderRow
                  label="Rotation Z"
                  value={settings.rotation.z}
                  min={-3.14}
                  max={3.14}
                  step={0.01}
                  unit=" rad"
                  onChange={(value) => updateVector('rotation', 'z', value)}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Light</h3>
                <SliderRow
                  label="Position X"
                  value={settings.lightPosition.x}
                  min={-5}
                  max={5}
                  step={0.1}
                  onChange={(value) => updateVector('lightPosition', 'x', value)}
                />
                <SliderRow
                  label="Position Y"
                  value={settings.lightPosition.y}
                  min={-5}
                  max={5}
                  step={0.1}
                  onChange={(value) => updateVector('lightPosition', 'y', value)}
                />
                <SliderRow
                  label="Position Z"
                  value={settings.lightPosition.z}
                  min={-5}
                  max={5}
                  step={0.1}
                  onChange={(value) => updateVector('lightPosition', 'z', value)}
                />
                <SliderRow
                  label="Intensity"
                  value={settings.lightIntensity}
                  min={0.25}
                  max={2.5}
                  step={0.05}
                  onChange={(lightIntensity) => setSettings(current => ({ ...current, lightIntensity }))}
                />
                <SliderRow
                  label="Ambient"
                  value={settings.ambientLight}
                  min={0.05}
                  max={0.8}
                  step={0.01}
                  onChange={(ambientLight) => setSettings(current => ({ ...current, ambientLight }))}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Camera</h3>
                <SliderRow
                  label="Position Z"
                  value={settings.cameraPosition.z}
                  min={2.5}
                  max={7.5}
                  step={0.05}
                  onChange={(value) => updateVector('cameraPosition', 'z', value)}
                />
                <SliderRow
                  label="Position Y"
                  value={settings.cameraPosition.y}
                  min={-1}
                  max={2}
                  step={0.05}
                  onChange={(value) => updateVector('cameraPosition', 'y', value)}
                />
              </div>

              <button
                type="button"
                onClick={() => setSettings({
                  geometry: 'cube',
                  material: 'gold',
                  scale: 1,
                  rotation: { x: 0.45, y: 0.75, z: 0.05 },
                  lightPosition: { x: 3.5, y: 2.5, z: 3.5 },
                  lightIntensity: 1,
                  ambientLight: 0.28,
                  cameraPosition: { x: 0, y: 0.35, z: 4.5 },
                  backgroundColor: [0.04, 0.07, 0.12],
                })}
                className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/15"
              >
                Reset to demo values
              </button>
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Pipeline</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Transform + light</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              El objeto se transforma en CPU y se ilumina con Phong antes de rasterizarse en el canvas.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Normals</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Shading pedagógico</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Cambia a esfera o toro para ver cómo la curvatura altera el brillo especular.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Material</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Shininess</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Los materiales metálicos concentran el highlight, mientras que los plásticos lo suavizan.
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Exercise</div>
            <h3 className="mt-2 text-lg font-semibold text-white">Mueve la luz atrás</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Observa cómo la componente ambiental mantiene legible la geometría cuando la luz sale del frente.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
