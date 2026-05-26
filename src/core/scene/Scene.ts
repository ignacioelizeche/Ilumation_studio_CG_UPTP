import { Mesh } from '../geometry/Mesh';
import { Light } from '../lighting/Light';
import { Camera } from './Camera';

export class Scene {
  meshes: Mesh[] = [];
  lights: Light[] = [];
  camera: Camera;
  backgroundColor: [number, number, number] = [0.2, 0.2, 0.2];
  ambientLight: [number, number, number] = [0.3, 0.3, 0.3];

  constructor(camera: Camera = new Camera()) {
    this.camera = camera;
  }

  addMesh(mesh: Mesh): void {
    this.meshes.push(mesh);
  }

  removeMesh(mesh: Mesh): void {
    const index = this.meshes.indexOf(mesh);
    if (index > -1) {
      this.meshes.splice(index, 1);
    }
  }

  addLight(light: Light): void {
    this.lights.push(light);
  }

  removeLight(light: Light): void {
    const index = this.lights.indexOf(light);
    if (index > -1) {
      this.lights.splice(index, 1);
    }
  }

  clone(): Scene {
    const newScene = new Scene(this.camera.clone());
    newScene.meshes = this.meshes.map(m => m.clone());
    newScene.lights = this.lights.map(l => l.clone());
    newScene.backgroundColor = [...this.backgroundColor];
    newScene.ambientLight = [...this.ambientLight];
    return newScene;
  }

  clear(): void {
    this.meshes = [];
    this.lights = [];
  }
}
