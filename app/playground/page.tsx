'use client';

import { useState } from 'react';
import {
  CanvasRenderer,
  type PlaygroundGeometry,
  type PlaygroundMaterial,
  type PlaygroundRenderSettings,
  type RenderMode,
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
    renderMode: 'phong',
    autoRotate: true,
    scale: 1,
    rotation: { x: 0.45, y: 0.75, z: 0.05 },
    lights: [
      { id: '1', position: { x: 3.5, y: 2.5, z: 3.5 }, intensity: 1, color: [1, 1, 1] }
    ],
    ambientLight: 0.28,
    cameraPosition: { x: 0, y: 0.35, z: 4.5 },
    backgroundColor: [0.04, 0.07, 0.12],
  });

  const activeGeometry = geometryOptions.find(option => option.value === settings.geometry)!;
  const activeMaterial = materialOptions.find(option => option.value === settings.material)!;

  const updateVector = (
    key: 'rotation' | 'cameraPosition',
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

  const updateLight = (
    index: number,
    updates: Partial<typeof settings.lights[number]>
  ) => {
    setSettings(current => {
      const newLights = [...current.lights];
      newLights[index] = { ...newLights[index], ...updates };
      return { ...current, lights: newLights };
    });
  }

  return (
    <main className="relative h-screen max-h-screen overflow-hidden bg-[#050b16] text-slate-100 flex flex-col">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_25%),linear-gradient(180deg,_rgba(2,6,23,0.92),_rgba(2,6,23,1))]" />
      <div className="pointer-events-none absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8%] right-[-8%] h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[120rem] px-4 py-4 sm:px-6 lg:px-8 flex-1 flex flex-col min-h-0">
        <header className="mb-4 flex flex-none items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-white">
              Illumination Studio
            </h1>
            <div className="hidden sm:inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Interactive Playground
            </div>
          </div>
          <div className="hidden lg:block text-xs text-slate-400">
            <span className="font-medium text-cyan-100">Click/Drag:</span> Rotate Camera • <span className="font-medium text-cyan-100">Right Click/Shift+Drag:</span> Move Light • <span className="font-medium text-cyan-100">Scroll:</span> Zoom
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] flex-1 min-h-0">
          <div className="w-full relative flex-1 min-h-0 rounded-[1.5rem] overflow-hidden flex items-center justify-center p-0 border border-white/10 shadow-2xl shadow-cyan-950/20 bg-black/40">
            <CanvasRenderer 
              width={2048} 
              height={2048} 
              settings={settings} 
              onSettingsChange={(updates) => setSettings(current => ({ ...current, ...updates }))}
            />
          </div>

          <aside className="relative rounded-[1.5rem] border border-white/10 bg-slate-950/60 shadow-2xl shadow-cyan-950/20 backdrop-blur min-h-0">
             <div className="absolute inset-0 p-4 flex flex-col">
                <div className="space-y-4 flex-none mt-2">
                    <h2 className="text-lg font-semibold text-white">Renderer Controls</h2>
                </div>

                <div className="overflow-y-auto flex-1 mt-4 space-y-5 pr-2 pb-4 scrollbar-thin">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                        type="checkbox"
                        checked={settings.autoRotate}
                        onChange={(e) => setSettings(current => ({ ...current, autoRotate: e.target.checked }))}
                        className="rounded border-slate-700 bg-slate-800 accent-cyan-500"
                    />
                    Auto-Rotate
                </label>

              <OptionGrid<RenderMode>
                label="Render Mode"
                options={[
                  { value: 'phong', label: 'Phong', description: 'Per-pixel lighting' },
                  { value: 'flat', label: 'Flat', description: 'Per-face lighting' },
                  { value: 'wireframe', label: 'Wireframe', description: 'Just edges' },
                ]}
                value={settings.renderMode}
                onChange={(renderMode) => setSettings(current => ({ ...current, renderMode }))}
              />

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

              <details className="group space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 marker:content-[''] flex justify-between">
                    Transform
                     <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="pt-4 space-y-4">
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
              </details>

              <details className="group space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4" open>
                <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 marker:content-[''] flex justify-between items-center">
                    Lights
                     <div className="flex gap-2 items-center">
                         <button
                            className="bg-cyan-500/20 text-cyan-200 px-2 py-1 rounded text-xs hover:bg-cyan-500/40"
                            onClick={(e) => {
                                e.preventDefault();
                                setSettings(s => ({
                                    ...s,
                                    lights: [...s.lights, {
                                        id: Math.random().toString(),
                                        position: { x: -3, y: 1, z: -2 },
                                        color: [1, 1, 1],
                                        intensity: 0.5
                                    }]
                                }))
                            }}
                         >
                            + Add Light
                         </button>
                         <span className="transition group-open:rotate-180">▼</span>
                     </div>
                </summary>
                <div className="pt-4 space-y-6">
                    {settings.lights.map((light, i) => (
                        <div key={light.id} className="space-y-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                            <div className="flex justify-between items-center text-sm font-medium text-white">
                                Light {i + 1}
                                {settings.lights.length > 1 && (
                                    <button
                                        onClick={() => setSettings(s => ({ ...s, lights: s.lights.filter((_, idx) => idx !== i)}))}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <SliderRow
                              label="X"
                              value={light.position.x}
                              min={-5}
                              max={5}
                              step={0.1}
                              onChange={(value) => updateLight(i, { position: { ...light.position, x: value } })}
                            />
                            <SliderRow
                              label="Y"
                              value={light.position.y}
                              min={-5}
                              max={5}
                              step={0.1}
                              onChange={(value) => updateLight(i, { position: { ...light.position, y: value } })}
                            />
                            <SliderRow
                              label="Z"
                              value={light.position.z}
                              min={-5}
                              max={5}
                              step={0.1}
                              onChange={(value) => updateLight(i, { position: { ...light.position, z: value } })}
                            />
                            <SliderRow
                              label="Intensity"
                              value={light.intensity}
                              min={0}
                              max={2.5}
                              step={0.05}
                              onChange={(intensity) => updateLight(i, { intensity })}
                            />
                        </div>
                    ))}
                    
                    <div className="border-t border-white/10 pt-4 space-y-4">
                        <SliderRow
                          label="Ambient Light"
                          value={settings.ambientLight}
                          min={0}
                          max={0.8}
                          step={0.01}
                          onChange={(ambientLight) => setSettings(current => ({ ...current, ambientLight }))}
                        />
                    </div>
                </div>
              </details>

              <details className="group space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-semibold uppercase tracking-[0.24em] text-slate-400 marker:content-[''] flex justify-between">
                    Camera & Environment
                     <span className="transition group-open:rotate-180">▼</span>
                </summary>
                <div className="pt-4 space-y-4">
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
              </details>
              </div>

              <button
                type="button"
                onClick={() => setSettings({
                  geometry: 'cube',
                  material: 'gold',
                  renderMode: 'phong',
                  autoRotate: true,
                  scale: 1,
                  rotation: { x: 0.45, y: 0.75, z: 0.05 },
                  lights: [{ id: '1', position: { x: 3.5, y: 2.5, z: 3.5 }, intensity: 1, color: [1, 1, 1] }],
                  ambientLight: 0.28,
                  cameraPosition: { x: 0, y: 0.35, z: 4.5 },
                  backgroundColor: [0.04, 0.07, 0.12],
                })}
                className="w-full flex-none mt-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/15"
              >
                Reset to demo values
              </button>
             </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
