import { Vector3 } from '../math/Vector3';

export interface RasterizationData {
  screenVertices: Vector3[];
  cameraVertices: Vector3[];
  vertexColors: Vector3[];
  face: number[];
  zbuffer: number[][];
  framebuffer: Uint8ClampedArray;
  width: number;
  height: number;
}

function barycentricCoordinates(
  p: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3
): [number, number, number] | null {
  const v0 = c.subtract(a);
  const v1 = b.subtract(a);
  const v2 = p.subtract(a);

  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
  const w = 1 - u - v;

  if (w < -1e-6 || u < -1e-6 || v < -1e-6) {
    return null;
  }

  return [w, u, v];
}

export function rasterizeTriangle(data: RasterizationData): void {
  const {
    screenVertices,
    cameraVertices,
    vertexColors,
    face,
    zbuffer,
    framebuffer,
    width,
    height,
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

        // Interpolate color
        const color = vertexColors[i0]
          .multiply(w0)
          .add(vertexColors[i1].multiply(w1))
          .add(vertexColors[i2].multiply(w2));

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
