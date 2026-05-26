import { Vector3, Matrix4 } from '../math';

export class Camera {
  position: Vector3;
  target: Vector3;
  up: Vector3;
  fovy: number;
  aspect: number;
  near: number;
  far: number;

  constructor(
    position: Vector3 = new Vector3(0, 0, 5),
    target: Vector3 = Vector3.zero(),
    up: Vector3 = Vector3.up(),
    fovy: number = Math.PI / 4,
    aspect: number = 1.0,
    near: number = 0.1,
    far: number = 1000.0
  ) {
    this.position = position;
    this.target = target;
    this.up = up;
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
  }

  getViewMatrix(): Matrix4 {
    return Matrix4.lookAt(this.position, this.target, this.up);
  }

  getProjectionMatrix(): Matrix4 {
    return Matrix4.perspective(this.fovy, this.aspect, this.near, this.far);
  }

  clone(): Camera {
    return new Camera(
      this.position.clone(),
      this.target.clone(),
      this.up.clone(),
      this.fovy,
      this.aspect,
      this.near,
      this.far
    );
  }

  setAspectRatio(width: number, height: number): void {
    this.aspect = width / height;
  }
}
