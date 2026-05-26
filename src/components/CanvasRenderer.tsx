'use client';

import { useEffect, useRef, useState } from 'react';
import {
  GeometryFactory,
  Light,
  Material,
  Matrix4,
  Mesh,
  Renderer,
  Scene,
  Vector3,
} from '@/src/core';

export type PlaygroundGeometry = 'cube' | 'sphere' | 'cylinder' | 'torus' | 'plane';
export type PlaygroundMaterial = 'gold' | 'plastic' | 'metal' | 'red' | 'green' | 'blue';
export type RenderMode = 'phong' | 'flat' | 'wireframe';

export interface PlaygroundVector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlaygroundLight {
  id: string;
  position: PlaygroundVector3;
  intensity: number;
  color: [number, number, number];
}

export interface PlaygroundRenderSettings {
  geometry: PlaygroundGeometry;
  material: PlaygroundMaterial;
  renderMode: RenderMode;
  autoRotate: boolean;
  scale: number;
  rotation: PlaygroundVector3;
  lights: PlaygroundLight[];
  ambientLight: number;
  cameraPosition: PlaygroundVector3;
  backgroundColor: [number, number, number];
}

interface CanvasRendererProps {
  width: number;
  height: number;
  settings: PlaygroundRenderSettings;
  onSettingsChange?: (newSettings: Partial<PlaygroundRenderSettings>) => void;
  onRender?: (imageData: ImageData) => void;
}

const geometryFactory: Record<PlaygroundGeometry, (material: Material) => Mesh> = {
  cube: material => GeometryFactory.createCube(1.6, material),
  sphere: material => GeometryFactory.createSphere(1, 28, 18, material),
  cylinder: material => GeometryFactory.createCylinder(0.9, 1.8, 28, 4, material),
  torus: material => GeometryFactory.createTorus(1, 0.35, 28, 18, material),
  plane: material => GeometryFactory.createPlane(2.2, 2.2, 1, 1, material),
};

const materialFactory: Record<PlaygroundMaterial, Material> = {
  gold: Material.gold(),
  plastic: Material.plastic(),
  metal: Material.metal(),
  red: Material.red(),
  green: Material.green(),
  blue: Material.blue(),
};

function buildTransform(rotation: PlaygroundVector3, scale: number): Matrix4 {
  return Matrix4.scale(scale, scale, scale)
    .multiply(Matrix4.rotationX(rotation.x))
    .multiply(Matrix4.rotationY(rotation.y))
    .multiply(Matrix4.rotationZ(rotation.z));
}

export function CanvasRenderer({ width, height, settings, onSettingsChange, onRender }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer] = useState(() => new Renderer(width, height));

  // Interaction State
  const isDraggingRef = useRef(false);
  const dragModeRef = useRef<'camera' | 'light' | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    // Shift+Click or Right Click orbits the light, normal Left Click orbits the camera
    if (e.button === 2 || e.shiftKey) {
      dragModeRef.current = 'light';
    } else {
      dragModeRef.current = 'camera';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !onSettingsChange) return;

    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.01;
    const mode = dragModeRef.current;
    
    if (mode === 'camera') {
      const { x, y, z } = settings.cameraPosition;
      
      let r = Math.sqrt(x*x + y*y + z*z);
      let theta = Math.atan2(x, z);
      let phi = Math.acos(y / r);

      theta -= deltaX * sensitivity;
      phi -= deltaY * sensitivity;

      // Clamp phi to avoid flipping over at the poles
      phi = Math.max(0.01, Math.min(Math.PI - 0.01, phi));

      onSettingsChange({
        cameraPosition: {
          x: r * Math.sin(phi) * Math.sin(theta),
          y: r * Math.cos(phi),
          z: r * Math.sin(phi) * Math.cos(theta),
        }
      });
    } else if (mode === 'light' && settings.lights.length > 0) {
      const { x, y, z } = settings.lights[0].position;
      
      let r = Math.sqrt(x*x + y*y + z*z);
      let theta = Math.atan2(x, z);
      let phi = Math.acos(y / r);

      theta -= deltaX * sensitivity;
      phi -= deltaY * sensitivity;

      phi = Math.max(0.01, Math.min(Math.PI - 0.01, phi));

      const newLights = [...settings.lights];
      if (newLights.length > 0) {
          newLights[0] = {
              ...newLights[0],
              position: {
                  x: r * Math.sin(phi) * Math.sin(theta),
                  y: r * Math.cos(phi),
                  z: r * Math.sin(phi) * Math.cos(theta),
              }
          };
          onSettingsChange({ lights: newLights });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    dragModeRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (!onSettingsChange) return;
    e.preventDefault();
    
    const { x, y, z } = settings.cameraPosition;
    let r = Math.sqrt(x*x + y*y + z*z);
    
    // Zoom in / out based on wheel delta
    r += e.deltaY * 0.01;
    r = Math.max(1.0, Math.min(20.0, r)); // Clamp zoom distances

    const factor = r / Math.sqrt(x*x + y*y + z*z);

    onSettingsChange({
      cameraPosition: {
        x: x * factor,
        y: y * factor,
        z: z * factor,
      }
    });
  };

  useEffect(() => {
    renderer.setSize(width, height);
  }, [renderer, width, height]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    let animationFrameId: number;

    const renderLoop = (time: number) => {
      const elapsed = time - startTime;
      
      let { x, y, z } = settings.cameraPosition;
      
      if (settings.autoRotate && !isDraggingRef.current) {
         const angle = elapsed * 0.0005;
         // Orbitamos la cámara alrededor del eje Y (plano XZ), lo que permite que 
         // recorra el objeto horizontalmente ("girando sobre X/Z").
         const currentR = Math.sqrt(x*x + z*z);
         const currentTheta = Math.atan2(x, z);
         const newTheta = currentTheta + angle;
         x = currentR * Math.sin(newTheta);
         z = currentR * Math.cos(newTheta);
      }

      const scene = new Scene();
      scene.camera.setAspectRatio(width, height);
      scene.camera.position = new Vector3(x, y, z);
      scene.backgroundColor = settings.backgroundColor;
      scene.ambientLight = [settings.ambientLight, settings.ambientLight, settings.ambientLight];

      const material = materialFactory[settings.material].clone();
      // Combine intensities for shininess heuristics based on the primary light
      const primaryLightIntensity = settings.lights[0] ? settings.lights[0].intensity : 1;
      material.shininess = settings.material === 'metal'
        ? Math.max(48, Math.round(32 + primaryLightIntensity * 160))
        : Math.max(8, Math.round(16 + primaryLightIntensity * 64));

      const mesh = geometryFactory[settings.geometry](material);

      mesh.applyTransform(buildTransform(settings.rotation, settings.scale));
      scene.addMesh(mesh);

      for (const settingsLight of settings.lights) {
        const light = new Light(
          new Vector3(
            settingsLight.position.x,
            settingsLight.position.y,
            settingsLight.position.z
          ),
          new Vector3(settingsLight.color[0], settingsLight.color[1], settingsLight.color[2]),
          settingsLight.intensity,
          'point'
        );
        scene.addLight(light);
      }

      const imageData = renderer.render(scene, settings.renderMode);
      ctx.putImageData(imageData, 0, 0);

      if (onRender) {
        onRender(imageData);
      }

      if (settings.autoRotate && !isDraggingRef.current) {
          animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [height, onRender, renderer, settings, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-full w-full object-contain cursor-grab rounded-2xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/20 active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
