import { Vector3, Matrix4 } from '../math';
import { Material } from '../materials/Material';

export class Mesh {
  vertices: Vector3[];
  faces: number[][];
  normals: Vector3[];
  material: Material;

  constructor(
    vertices: Vector3[] = [],
    faces: number[][] = [],
    normals: Vector3[] = [],
    material: Material = new Material()
  ) {
    this.vertices = vertices;
    this.faces = faces;
    this.normals = normals.length > 0 ? normals : this.computeNormals();
    this.material = material;
  }

  computeNormals(): Vector3[] {
    const normals = this.vertices.map(() => Vector3.zero());

    for (const face of this.faces) {
      if (face.length !== 3) continue;

      const v0 = this.vertices[face[0]];
      const v1 = this.vertices[face[1]];
      const v2 = this.vertices[face[2]];

      const edge1 = v1.subtract(v0);
      const edge2 = v2.subtract(v0);
      const faceNormal = edge1.cross(edge2);

      for (const vertexIndex of face) {
        normals[vertexIndex] = normals[vertexIndex].add(faceNormal);
      }
    }

    return normals.map(n => {
      const mag = n.magnitude();
      return mag > 0 ? n.divide(mag) : Vector3.zero();
    });
  }

  clone(): Mesh {
    return new Mesh(
      this.vertices.map(v => v.clone()),
      this.faces.map(f => [...f]),
      this.normals.map(n => n.clone()),
      this.material.clone()
    );
  }

  applyTransform(matrix: Matrix4): void {
    this.vertices = this.vertices.map(v => matrix.transformVector(v));

    const inverseTranspose = matrix.inverse().transpose();
    this.normals = this.normals.map(n =>
      inverseTranspose.transformDirection(n).normalize()
    );
  }

  getBounds(): { min: Vector3; max: Vector3 } {
    if (this.vertices.length === 0) {
      return {
        min: Vector3.zero(),
        max: Vector3.zero(),
      };
    }

    const min = this.vertices[0].clone();
    const max = this.vertices[0].clone();

    for (const v of this.vertices) {
      if (v.x < min.x) min.x = v.x;
      if (v.y < min.y) min.y = v.y;
      if (v.z < min.z) min.z = v.z;

      if (v.x > max.x) max.x = v.x;
      if (v.y > max.y) max.y = v.y;
      if (v.z > max.z) max.z = v.z;
    }

    return { min, max };
  }
}
