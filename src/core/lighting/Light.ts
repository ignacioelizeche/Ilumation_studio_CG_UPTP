import { Vector3 } from '../math/Vector3';

export type LightType = 'point' | 'directional' | 'spot';

export class Light {
  position: Vector3;
  color: Vector3;
  intensity: number;
  type: LightType;

  constructor(
    position: Vector3 = new Vector3(0, 5, 5),
    color: Vector3 = new Vector3(1, 1, 1),
    intensity: number = 1.0,
    type: LightType = 'point'
  ) {
    this.position = position;
    this.color = color;
    this.intensity = intensity;
    this.type = type;
  }

  clone(): Light {
    return new Light(
      this.position.clone(),
      this.color.clone(),
      this.intensity,
      this.type
    );
  }

  static white(position: Vector3 = new Vector3(0, 5, 5)): Light {
    return new Light(position, new Vector3(1, 1, 1), 1.0, 'point');
  }

  static red(position: Vector3 = new Vector3(0, 5, 5)): Light {
    return new Light(position, new Vector3(1, 0, 0), 1.0, 'point');
  }

  static green(position: Vector3 = new Vector3(0, 5, 5)): Light {
    return new Light(position, new Vector3(0, 1, 0), 1.0, 'point');
  }

  static blue(position: Vector3 = new Vector3(0, 5, 5)): Light {
    return new Light(position, new Vector3(0, 0, 1), 1.0, 'point');
  }
}
