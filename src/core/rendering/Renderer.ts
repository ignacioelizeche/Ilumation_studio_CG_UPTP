import { Vector3, Matrix4 } from '../math';
import { Mesh } from '../geometry/Mesh';
import { Scene } from '../scene/Scene';
import { phongLighting } from '../lighting/PhongLighting';
import { rasterizeTriangle } from './Rasterizer';

export class Renderer {
  width: number;
  height: number;

  constructor(width: number = 800, height: number = 600) {
    this.width = width;
    this.height = height;
  }

  render(scene: Scene): ImageData {
    const framebuffer = new Uint8ClampedArray(this.width * this.height * 4);
    const zbuffer: number[][] = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(Infinity));

    // Clear framebuffer with background color
    const bgColor = scene.backgroundColor;
    for (let i = 0; i < framebuffer.length; i += 4) {
      framebuffer[i] = Math.round(bgColor[0] * 255);
      framebuffer[i + 1] = Math.round(bgColor[1] * 255);
      framebuffer[i + 2] = Math.round(bgColor[2] * 255);
      framebuffer[i + 3] = 255;
    }

    const viewMatrix = scene.camera.getViewMatrix();
    const projMatrix = scene.camera.getProjectionMatrix();
    const vpMatrix = projMatrix.multiply(viewMatrix);

    // Render each mesh
    for (const mesh of scene.meshes) {
      this.renderMesh(
        mesh,
        Matrix4.identity(),
        viewMatrix,
        projMatrix,
        vpMatrix,
        scene.lights,
        scene.ambientLight,
        scene.camera.position,
        framebuffer,
        zbuffer
      );
    }

    return new ImageData(framebuffer, this.width, this.height);
  }

  private renderMesh(
    mesh: Mesh,
    modelMatrix: Matrix4,
    viewMatrix: Matrix4,
    projMatrix: Matrix4,
    vpMatrix: Matrix4,
    lights: any[],
    ambientLight: [number, number, number],
    cameraPos: Vector3,
    framebuffer: Uint8ClampedArray,
    zbuffer: number[][]
  ): void {
    const mvMatrix = viewMatrix.multiply(modelMatrix);

    // Transform vertices for rasterization
    const transformedVertices = mesh.vertices.map(v => mvMatrix.transformVector(v));

    // World space vertices and normals for lighting
    const worldVertices = mesh.vertices.map(v => modelMatrix.transformVector(v));
    const normalMatrix = modelMatrix.inverse().transpose();
    const worldNormals = mesh.normals.map(n =>
      normalMatrix
        .transformDirection(n)
        .normalize()
    );

    // Screen space vertices
    const screenVertices = mesh.vertices.map(v =>
      this.worldToScreen(vpMatrix.multiply(modelMatrix).transformVector(v))
    );

    // Rasterize triangles using Phong Shading (per-pixel lighting)
    for (const face of mesh.faces) {
      rasterizeTriangle({
        screenVertices,
        worldVertices,
        worldNormals,
        face,
        zbuffer,
        framebuffer,
        width: this.width,
        height: this.height,
        lights,
        ambientLight,
        cameraPos,
        material: mesh.material,
      });
    }
  }

  private worldToScreen(v: Vector3): Vector3 {
    return new Vector3(
      (v.x + 1) * (this.width / 2),
      (1 - v.y) * (this.height / 2),
      v.z
    );
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}
