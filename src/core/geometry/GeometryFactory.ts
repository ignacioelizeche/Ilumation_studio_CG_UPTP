import { Vector3 } from '../math/Vector3';
import { Mesh } from './Mesh';
import { Material } from '../materials/Material';

export class GeometryFactory {
  static createCube(size: number = 1, material?: Material): Mesh {
    const s = size / 2;
    
    // Define non-shared vertices for flat shading (3 vertices per face)
    const vertices: Vector3[] = [];
    const faces: number[][] = [];
    
    const faceDefinitions = [
      // Right face (+x)
      [new Vector3(s, -s, -s), new Vector3(s, s, -s), new Vector3(s, -s, s), new Vector3(s, s, s)],
      // Left face (-x)
      [new Vector3(-s, -s, s), new Vector3(-s, s, s), new Vector3(-s, -s, -s), new Vector3(-s, s, -s)],
      // Top face (+y)
      [new Vector3(-s, s, -s), new Vector3(-s, s, s), new Vector3(s, s, -s), new Vector3(s, s, s)],
      // Bottom face (-y)
      [new Vector3(-s, -s, s), new Vector3(-s, -s, -s), new Vector3(s, -s, s), new Vector3(s, -s, -s)],
      // Front face (+z)
      [new Vector3(-s, -s, s), new Vector3(s, -s, s), new Vector3(-s, s, s), new Vector3(s, s, s)],
      // Back face (-z)
      [new Vector3(s, -s, -s), new Vector3(-s, -s, -s), new Vector3(s, s, -s), new Vector3(-s, s, -s)]
    ];
    
    let index = 0;
    for (const quad of faceDefinitions) {
      // 0, 1, 2, 3 -> quad corners
      vertices.push(quad[0], quad[1], quad[2], quad[3]);
      // Two triangles per face
      faces.push([index + 0, index + 2, index + 1]);
      faces.push([index + 1, index + 2, index + 3]);
      index += 4;
    }

    return new Mesh(vertices, faces, [], material || new Material());
  }

  static createSphere(
    radius: number = 1,
    widthSegments: number = 32,
    heightSegments: number = 16,
    material?: Material
  ): Mesh {
    const vertices: Vector3[] = [];
    const faces: number[][] = [];

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const sinV = Math.sin((v * Math.PI) - Math.PI / 2);
      const cosV = Math.cos((v * Math.PI) - Math.PI / 2);

      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const sinU = Math.sin(u * Math.PI * 2);
        const cosU = Math.cos(u * Math.PI * 2);

        vertices.push(
          new Vector3(
            radius * cosV * cosU,
            radius * sinV,
            radius * cosV * sinU
          )
        );
      }
    }

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = y * (widthSegments + 1) + x;
        const b = a + widthSegments + 1;

        faces.push([a, b, a + 1]);
        faces.push([a + 1, b, b + 1]);
      }
    }

    return new Mesh(vertices, faces, [], material || new Material());
  }

  static createPlane(
    width: number = 1,
    height: number = 1,
    widthSegments: number = 1,
    heightSegments: number = 1,
    material?: Material
  ): Mesh {
    const vertices: Vector3[] = [];
    const faces: number[][] = [];

    const wh = width / 2;
    const hh = height / 2;
    const wseg = widthSegments + 1;
    const hseg = heightSegments + 1;

    for (let y = 0; y < hseg; y++) {
      for (let x = 0; x < wseg; x++) {
        vertices.push(
          new Vector3(
            (x / widthSegments - 0.5) * width,
            0,
            (y / heightSegments - 0.5) * height
          )
        );
      }
    }

    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = y * wseg + x;
        const b = a + 1;
        const c = a + wseg;
        const d = c + 1;

        faces.push([a, c, b]);
        faces.push([b, c, d]);
      }
    }

    return new Mesh(vertices, faces, [], material || new Material());
  }

  static createCylinder(
    radius: number = 1,
    height: number = 1,
    radialSegments: number = 32,
    heightSegments: number = 4,
    material?: Material
  ): Mesh {
    const vertices: Vector3[] = [];
    const faces: number[][] = [];

    const hh = height / 2;

    // Side vertices
    for (let y = 0; y <= heightSegments; y++) {
      const yPos = (y / heightSegments - 0.5) * height;
      for (let x = 0; x <= radialSegments; x++) {
        const angle = (x / radialSegments) * Math.PI * 2;
        vertices.push(
          new Vector3(
            radius * Math.cos(angle),
            yPos,
            radius * Math.sin(angle)
          )
        );
      }
    }

    // Top cap center
    const topCenter = vertices.length;
    vertices.push(new Vector3(0, hh, 0));

    // Bottom cap center
    const bottomCenter = vertices.length;
    vertices.push(new Vector3(0, -hh, 0));

    // Side faces
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = y * (radialSegments + 1) + x;
        const b = a + radialSegments + 1;
        const c = a + 1;
        const d = c + radialSegments + 1;

        faces.push([a, b, c]);
        faces.push([c, b, d]);
      }
    }

    // Top cap
    for (let x = 0; x < radialSegments; x++) {
      const a = x;
      const b = x + 1;
      faces.push([topCenter, b, a]);
    }

    // Bottom cap
    const bottomStartIdx = heightSegments * (radialSegments + 1);
    for (let x = 0; x < radialSegments; x++) {
      const a = bottomStartIdx + x;
      const b = bottomStartIdx + x + 1;
      faces.push([bottomCenter, a, b]);
    }

    return new Mesh(vertices, faces, [], material || new Material());
  }

  static createTorus(
    majorRadius: number = 1,
    minorRadius: number = 0.4,
    tubeSegments: number = 32,
    radialSegments: number = 16,
    material?: Material
  ): Mesh {
    const vertices: Vector3[] = [];
    const faces: number[][] = [];

    for (let y = 0; y <= radialSegments; y++) {
      const v = (y / radialSegments) * Math.PI * 2;
      const cosV = Math.cos(v);
      const sinV = Math.sin(v);

      for (let x = 0; x <= tubeSegments; x++) {
        const u = (x / tubeSegments) * Math.PI * 2;
        const cosU = Math.cos(u);
        const sinU = Math.sin(u);

        const x1 = (majorRadius + minorRadius * cosV) * cosU;
        const y1 = minorRadius * sinV;
        const z1 = (majorRadius + minorRadius * cosV) * sinU;

        vertices.push(new Vector3(x1, y1, z1));
      }
    }

    for (let y = 0; y < radialSegments; y++) {
      for (let x = 0; x < tubeSegments; x++) {
        const a = y * (tubeSegments + 1) + x;
        const b = a + tubeSegments + 1;
        const c = a + 1;
        const d = c + tubeSegments + 1;

        faces.push([a, b, c]);
        faces.push([c, b, d]);
      }
    }

    return new Mesh(vertices, faces, [], material || new Material());
  }
}
