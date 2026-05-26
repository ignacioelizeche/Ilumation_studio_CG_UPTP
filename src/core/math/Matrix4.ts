import { Vector3 } from './Vector3';

export class Matrix4 {
  private data: number[][];

  constructor(data?: number[][]) {
    if (data) {
      this.data = data.map(row => [...row]);
    } else {
      this.data = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
    }
  }

  static identity(): Matrix4 {
    return new Matrix4([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  static zero(): Matrix4 {
    return new Matrix4([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  }

  static translation(x: number, y: number, z: number): Matrix4 {
    return new Matrix4([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1],
    ]);
  }

  static rotationX(angleRad: number): Matrix4 {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Matrix4([
      [1, 0, 0, 0],
      [0, cos, -sin, 0],
      [0, sin, cos, 0],
      [0, 0, 0, 1],
    ]);
  }

  static rotationY(angleRad: number): Matrix4 {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Matrix4([
      [cos, 0, sin, 0],
      [0, 1, 0, 0],
      [-sin, 0, cos, 0],
      [0, 0, 0, 1],
    ]);
  }

  static rotationZ(angleRad: number): Matrix4 {
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return new Matrix4([
      [cos, -sin, 0, 0],
      [sin, cos, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  static scale(sx: number, sy: number, sz: number): Matrix4 {
    return new Matrix4([
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ]);
  }

  static perspective(
    fovY: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const f = 1 / Math.tan(fovY / 2);
    const nf = near - far;
    return new Matrix4([
      [f / aspect, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (far + near) / nf, (2 * far * near) / nf],
      [0, 0, -1, 0],
    ]);
  }

  static lookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
    const forward = center.subtract(eye).normalize();
    const right = forward.cross(up).normalize();
    const newUp = right.cross(forward);

    const result = new Matrix4([
      [right.x, right.y, right.z, -right.dot(eye)],
      [newUp.x, newUp.y, newUp.z, -newUp.dot(eye)],
      [-forward.x, -forward.y, -forward.z, forward.dot(eye)],
      [0, 0, 0, 1],
    ]);

    return result;
  }

  clone(): Matrix4 {
    return new Matrix4(this.data);
  }

  multiply(other: Matrix4): Matrix4 {
    const result = Matrix4.zero();
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.data[row][k] * other.data[k][col];
        }
        result.data[row][col] = sum;
      }
    }
    return result;
  }

  transformVector(v: Vector3): Vector3 {
    const homogeneous = [v.x, v.y, v.z, 1];
    const result = [0, 0, 0, 0];

    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let col = 0; col < 4; col++) {
        sum += this.data[row][col] * homogeneous[col];
      }
      result[row] = sum;
    }

    // Perspective division
    if (result[3] !== 0) {
      return new Vector3(result[0] / result[3], result[1] / result[3], result[2] / result[3]);
    }

    return new Vector3(result[0], result[1], result[2]);
  }

  transformDirection(v: Vector3): Vector3 {
    const result = [0, 0, 0];
    for (let row = 0; row < 3; row++) {
      let sum = 0;
      for (let col = 0; col < 3; col++) {
        sum += this.data[row][col] * v.toArray()[col];
      }
      result[row] = sum;
    }
    return new Vector3(result[0], result[1], result[2]);
  }

  transpose(): Matrix4 {
    const result = Matrix4.zero();
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result.data[row][col] = this.data[col][row];
      }
    }
    return result;
  }

  determinant(): number {
    const m = this.data;
    let det = 0;

    det += m[0][0] * (
      m[1][1] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) -
      m[1][2] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) +
      m[1][3] * (m[2][1] * m[3][2] - m[2][2] * m[3][1])
    );

    det -= m[0][1] * (
      m[1][0] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) -
      m[1][2] * (m[2][0] * m[3][3] - m[2][3] * m[3][0]) +
      m[1][3] * (m[2][0] * m[3][2] - m[2][2] * m[3][0])
    );

    det += m[0][2] * (
      m[1][0] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) -
      m[1][1] * (m[2][0] * m[3][3] - m[2][3] * m[3][0]) +
      m[1][3] * (m[2][0] * m[3][1] - m[2][1] * m[3][0])
    );

    det -= m[0][3] * (
      m[1][0] * (m[2][1] * m[3][2] - m[2][2] * m[3][1]) -
      m[1][1] * (m[2][0] * m[3][2] - m[2][2] * m[3][0]) +
      m[1][2] * (m[2][0] * m[3][1] - m[2][1] * m[3][0])
    );

    return det;
  }

  inverse(): Matrix4 {
    const det = this.determinant();
    if (Math.abs(det) < 1e-10) {
      throw new Error('Matrix is singular and cannot be inverted');
    }

    const m = this.data;
    const inv = Matrix4.zero();

    inv.data[0][0] = (
      m[1][1] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) -
      m[1][2] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) +
      m[1][3] * (m[2][1] * m[3][2] - m[2][2] * m[3][1])
    ) / det;

    inv.data[0][1] = -(
      m[0][1] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) -
      m[0][2] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) +
      m[0][3] * (m[2][1] * m[3][2] - m[2][2] * m[3][1])
    ) / det;

    inv.data[0][2] = (
      m[0][1] * (m[1][2] * m[3][3] - m[1][3] * m[3][2]) -
      m[0][2] * (m[1][1] * m[3][3] - m[1][3] * m[3][1]) +
      m[0][3] * (m[1][1] * m[3][2] - m[1][2] * m[3][1])
    ) / det;

    inv.data[0][3] = -(
      m[0][1] * (m[1][2] * m[2][3] - m[1][3] * m[2][2]) -
      m[0][2] * (m[1][1] * m[2][3] - m[1][3] * m[2][1]) +
      m[0][3] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
    ) / det;

    inv.data[1][0] = -(
      m[1][0] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) -
      m[1][2] * (m[2][0] * m[3][3] - m[2][3] * m[3][0]) +
      m[1][3] * (m[2][0] * m[3][2] - m[2][2] * m[3][0])
    ) / det;

    inv.data[1][1] = (
      m[0][0] * (m[2][2] * m[3][3] - m[2][3] * m[3][2]) -
      m[0][2] * (m[2][0] * m[3][3] - m[2][3] * m[3][0]) +
      m[0][3] * (m[2][0] * m[3][2] - m[2][2] * m[3][0])
    ) / det;

    inv.data[1][2] = -(
      m[0][0] * (m[1][2] * m[3][3] - m[1][3] * m[3][2]) -
      m[0][2] * (m[1][0] * m[3][3] - m[1][3] * m[3][0]) +
      m[0][3] * (m[1][0] * m[3][2] - m[1][2] * m[3][0])
    ) / det;

    inv.data[1][3] = (
      m[0][0] * (m[1][2] * m[2][3] - m[1][3] * m[2][2]) -
      m[0][2] * (m[1][0] * m[2][3] - m[1][3] * m[2][0]) +
      m[0][3] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
    ) / det;

    inv.data[2][0] = (
      m[1][0] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) -
      m[1][1] * (m[2][0] * m[3][3] - m[2][3] * m[3][0]) +
      m[1][3] * (m[2][0] * m[3][1] - m[2][1] * m[3][0])
    ) / det;

    inv.data[2][1] = -(
      m[0][0] * (m[2][1] * m[3][3] - m[2][3] * m[3][1]) -
      m[0][1] * (m[2][0] * m[3][3] - m[2][3] * m[3][0]) +
      m[0][3] * (m[2][0] * m[3][1] - m[2][1] * m[3][0])
    ) / det;

    inv.data[2][2] = (
      m[0][0] * (m[1][1] * m[3][3] - m[1][3] * m[3][1]) -
      m[0][1] * (m[1][0] * m[3][3] - m[1][3] * m[3][0]) +
      m[0][3] * (m[1][0] * m[3][1] - m[1][1] * m[3][0])
    ) / det;

    inv.data[2][3] = -(
      m[0][0] * (m[1][1] * m[2][3] - m[1][3] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][3] - m[1][3] * m[2][0]) +
      m[0][3] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    ) / det;

    inv.data[3][0] = -(
      m[1][0] * (m[2][1] * m[3][2] - m[2][2] * m[3][1]) -
      m[1][1] * (m[2][0] * m[3][2] - m[2][2] * m[3][0]) +
      m[1][2] * (m[2][0] * m[3][1] - m[2][1] * m[3][0])
    ) / det;

    inv.data[3][1] = (
      m[0][0] * (m[2][1] * m[3][2] - m[2][2] * m[3][1]) -
      m[0][1] * (m[2][0] * m[3][2] - m[2][2] * m[3][0]) +
      m[0][2] * (m[2][0] * m[3][1] - m[2][1] * m[3][0])
    ) / det;

    inv.data[3][2] = -(
      m[0][0] * (m[1][1] * m[3][2] - m[1][2] * m[3][1]) -
      m[0][1] * (m[1][0] * m[3][2] - m[1][2] * m[3][0]) +
      m[0][2] * (m[1][0] * m[3][1] - m[1][1] * m[3][0])
    ) / det;

    inv.data[3][3] = (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    ) / det;

    return inv;
  }

  toArray(): number[] {
    return this.data.flat();
  }

  toArray2D(): number[][] {
    return this.data.map(row => [...row]);
  }
}
