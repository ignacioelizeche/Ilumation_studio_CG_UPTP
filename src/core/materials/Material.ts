import { Vector3 } from '../math/Vector3';

export interface MaterialProperties {
  ambient: Vector3;
  diffuse: Vector3;
  specular: Vector3;
  shininess: number;
}

export class Material implements MaterialProperties {
  ambient: Vector3;
  diffuse: Vector3;
  specular: Vector3;
  shininess: number;

  constructor(
    ambient: Vector3 = new Vector3(0.1, 0.1, 0.1),
    diffuse: Vector3 = new Vector3(0.8, 0.6, 0.4),
    specular: Vector3 = new Vector3(1.0, 1.0, 1.0),
    shininess: number = 32.0
  ) {
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }

  clone(): Material {
    return new Material(
      this.ambient.clone(),
      this.diffuse.clone(),
      this.specular.clone(),
      this.shininess
    );
  }

  static red(): Material {
    return new Material(
      new Vector3(0.1, 0.05, 0.05),
      new Vector3(0.8, 0.2, 0.2),
      new Vector3(1.0, 1.0, 1.0),
      32.0
    );
  }

  static green(): Material {
    return new Material(
      new Vector3(0.05, 0.1, 0.05),
      new Vector3(0.2, 0.8, 0.2),
      new Vector3(1.0, 1.0, 1.0),
      32.0
    );
  }

  static blue(): Material {
    return new Material(
      new Vector3(0.05, 0.05, 0.1),
      new Vector3(0.2, 0.2, 0.8),
      new Vector3(1.0, 1.0, 1.0),
      32.0
    );
  }

  static gold(): Material {
    return new Material(
      new Vector3(0.1, 0.08, 0.02),
      new Vector3(0.8, 0.7, 0.1),
      new Vector3(1.0, 1.0, 1.0),
      64.0
    );
  }

  static plastic(): Material {
    return new Material(
      new Vector3(0.0, 0.0, 0.0),
      new Vector3(0.5, 0.5, 0.5),
      new Vector3(1.0, 1.0, 1.0),
      128.0
    );
  }

  static metal(): Material {
    return new Material(
      new Vector3(0.2, 0.2, 0.2),
      new Vector3(0.5, 0.5, 0.5),
      new Vector3(1.0, 1.0, 1.0),
      256.0
    );
  }
}
