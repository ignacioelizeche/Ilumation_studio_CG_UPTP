import { Vector3 } from '../math/Vector3';
import { phongLighting } from '../lighting/PhongLighting';
import { Material } from '../materials/Material';
import { Light } from '../lighting/Light';

export type renderModeType = 'phong' | 'flat' | 'wireframe';

export interface RasterizationData {
  screenVertices: Vector3[];
  worldVertices: Vector3[];
  worldNormals: Vector3[];
  face: number[];
  zbuffer: number[][];
  framebuffer: Uint8ClampedArray;
  width: number;
  height: number;
  // Illumination parameters
  lights: Light[];
  ambientLight: [number, number, number];
  cameraPos: Vector3;
  material: Material;
  renderMode: renderModeType;
}

function barycentricCoordinates(
  p: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3
): [number, number, number] | null {
  const denom = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  
  // Degenerate triangle
  if (Math.abs(denom) < 1e-8) {
    return null;
  }

  const u = ((b.y - c.y) * (p.x - c.x) + (c.x - b.x) * (p.y - c.y)) / denom;
  const v = ((c.y - a.y) * (p.x - c.x) + (a.x - c.x) * (p.y - c.y)) / denom;
  const w = 1 - u - v;

  if (u < -1e-6 || v < -1e-6 || w < -1e-6) {
    return null;
  }

  return [u, v, w];
}

export function rasterizeTriangle(data: RasterizationData): void {
  const {
    screenVertices,
    worldVertices,
    worldNormals,
    face,
    zbuffer,
    framebuffer,
    width,
    height,
    lights,
    ambientLight,
    cameraPos,
    material,
  } = data;

  if (face.length !== 3) return;

  const [i0, i1, i2] = face;
  const v0 = screenVertices[i0];
  const v1 = screenVertices[i1];
  const v2 = screenVertices[i2];

  // Compute bounding box
  const minX = Math.max(
    0,
    Math.floor(Math.min(v0.x, v1.x, v2.x))
  );
  const maxX = Math.min(
    width - 1,
    Math.ceil(Math.max(v0.x, v1.x, v2.x))
  );
  const minY = Math.max(
    0,
    Math.floor(Math.min(v0.y, v1.y, v2.y))
  );
  const maxY = Math.min(
    height - 1,
    Math.ceil(Math.max(v0.y, v1.y, v2.y))
  );

  let flatColor = new Vector3(0, 0, 0);
  if (data.renderMode === 'flat') {
    const worldPos = worldVertices[i0].add(worldVertices[i1]).add(worldVertices[i2]).multiply(1/3);
    const normal = worldNormals[i0].add(worldNormals[i1]).add(worldNormals[i2]).normalize();
    for (const light of lights) {
      const lightDir = light.position.subtract(worldPos).normalize();
      const viewDir = cameraPos.subtract(worldPos).normalize();

      flatColor = flatColor.add(
        phongLighting({
          normal,
          lightDirection: lightDir,
          viewDirection: viewDir,
          material,
          lightColor: light.color,
          lightIntensity: light.intensity,
          ambientLight: new Vector3(
            ambientLight[0],
            ambientLight[1],
            ambientLight[2]
          ),
        })
      );
    }
  }

  const drawLine = (x0: number, y0: number, x1: number, y1: number, color: [number, number, number]) => {
      let dx = Math.abs(x1 - x0);
      let dy = Math.abs(y1 - y0);
      let sx = (x0 < x1) ? 1 : -1;
      let sy = (y0 < y1) ? 1 : -1;
      let err = dx - dy;

      while(true) {
          if (x0 >= 0 && x0 < width && y0 >= 0 && y0 < height) {
              const index = (Math.floor(y0) * width + Math.floor(x0)) * 4;
              framebuffer[index] = color[0];
              framebuffer[index + 1] = color[1];
              framebuffer[index + 2] = color[2];
              framebuffer[index + 3] = 255;
          }

          if ((x0 === x1) && (y0 === y1)) break;
          let e2 = 2 * err;
          if (e2 > -dy) { err -= dy; x0 += sx; }
          if (e2 < dx) { err += dx; y0 += sy; }
      }
  };

  if (data.renderMode === 'wireframe') {
      drawLine(Math.floor(v0.x), Math.floor(v0.y), Math.floor(v1.x), Math.floor(v1.y), [0, 255, 150]);
      drawLine(Math.floor(v1.x), Math.floor(v1.y), Math.floor(v2.x), Math.floor(v2.y), [0, 255, 150]);
      drawLine(Math.floor(v2.x), Math.floor(v2.y), Math.floor(v0.x), Math.floor(v0.y), [0, 255, 150]);
      return;
  }

  // Iterate over pixels in bounding box
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = new Vector3(x + 0.5, y + 0.5, 0);

      const barycentric = barycentricCoordinates(p, v0, v1, v2);
      if (!barycentric) continue;

      const [w0, w1, w2] = barycentric;

      // Interpolate Z (using screenVertices which holds NDC Z)
      const z =
        w0 * screenVertices[i0].z +
        w1 * screenVertices[i1].z +
        w2 * screenVertices[i2].z;

      // Z-buffer test (closer Z_ndc is smaller/more negative, typically towards -1, but definitely less than zbuffer initialized to Infinity)
      if (z < zbuffer[y][x]) {
        zbuffer[y][x] = z;

        // Interpolate world position and normal
        const worldPos = worldVertices[i0]
          .multiply(w0)
          .add(worldVertices[i1].multiply(w1))
          .add(worldVertices[i2].multiply(w2));

        const normal = worldNormals[i0]
          .multiply(w0)
          .add(worldNormals[i1].multiply(w1))
          .add(worldNormals[i2].multiply(w2))
          .normalize();

        let color = new Vector3(0, 0, 0);

        if (data.renderMode === 'flat') {
            color = flatColor;
        } else {
            // Calculate Pixel Color using Phong
            for (const light of lights) {
              const lightDir = light.position.subtract(worldPos).normalize();
              const viewDir = cameraPos.subtract(worldPos).normalize();

              color = color.add(
                phongLighting({
                  normal,
                  lightDirection: lightDir,
                  viewDirection: viewDir,
                  material,
                  lightColor: light.color,
                  lightIntensity: light.intensity,
                  ambientLight: new Vector3(
                    ambientLight[0],
                    ambientLight[1],
                    ambientLight[2]
                  ),
                })
              );
            }
        }

        // Write to framebuffer
        const index = (y * width + x) * 4;
        framebuffer[index] = Math.round(Math.max(0, Math.min(1, color.x)) * 255);
        framebuffer[index + 1] = Math.round(Math.max(0, Math.min(1, color.y)) * 255);
        framebuffer[index + 2] = Math.round(Math.max(0, Math.min(1, color.z)) * 255);
        framebuffer[index + 3] = 255;
      }
    }
  }
}
