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

export interface PlaygroundVector3 {
  x: number;
  y: number;
  z: number;
}

export interface PlaygroundRenderSettings {
  geometry: PlaygroundGeometry;
  material: PlaygroundMaterial;
  scale: number;
  rotation: PlaygroundVector3;
  lightPosition: PlaygroundVector3;
  lightIntensity: number;
  ambientLight: number;
  cameraPosition: PlaygroundVector3;
  backgroundColor: [number, number, number];
}

interface CanvasRendererProps {
  width: number;
  height: number;
  settings: PlaygroundRenderSettings;
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

export function CanvasRenderer({ width, height, settings, onRender }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer] = useState(() => new Renderer(width, height));

  useEffect(() => {
    renderer.setSize(width, height);
  }, [renderer, width, height]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const scene = new Scene();
    scene.camera.setAspectRatio(width, height);
    scene.camera.position = new Vector3(
      settings.cameraPosition.x,
      settings.cameraPosition.y,
      settings.cameraPosition.z
    );
    scene.backgroundColor = settings.backgroundColor;
    scene.ambientLight = [settings.ambientLight, settings.ambientLight, settings.ambientLight];

    const material = materialFactory[settings.material].clone();
    material.shininess = settings.material === 'metal'
      ? Math.max(48, Math.round(32 + settings.lightIntensity * 160))
      : Math.max(8, Math.round(16 + settings.lightIntensity * 64));

    const mesh = geometryFactory[settings.geometry](material);
    mesh.applyTransform(buildTransform(settings.rotation, settings.scale));
    scene.addMesh(mesh);

    const light = new Light(
      new Vector3(
        settings.lightPosition.x,
        settings.lightPosition.y,
        settings.lightPosition.z
      ),
      new Vector3(1, 1, 1),
      settings.lightIntensity,
      'point'
    );
    scene.addLight(light);

    const imageData = renderer.render(scene);
    ctx.putImageData(imageData, 0, 0);

    if (onRender) {
      onRender(imageData);
    }
  }, [height, onRender, renderer, settings, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-auto w-full rounded-2xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/20"
    />
  );
}
