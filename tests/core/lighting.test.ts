import { describe, it, expect } from 'vitest';
import { Material, Vector3, phongLighting } from '@/src/core';

describe('Phong lighting', () => {
  it('should apply specular tint per color channel', () => {
    const material = new Material(
      Vector3.zero(),
      Vector3.zero(),
      Vector3.one(),
      1
    );

    const result = phongLighting({
      normal: new Vector3(0, 0, 1),
      lightDirection: new Vector3(0, 0, 1),
      viewDirection: new Vector3(0, 0, 1),
      material,
      lightColor: new Vector3(1, 0, 0),
      lightIntensity: 1,
      ambientLight: Vector3.zero(),
    });

    expect(result.x).toBeCloseTo(1, 5);
    expect(result.y).toBeCloseTo(0, 5);
    expect(result.z).toBeCloseTo(0, 5);
  });
});