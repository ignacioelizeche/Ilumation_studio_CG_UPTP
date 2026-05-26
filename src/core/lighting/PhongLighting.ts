import { Vector3 } from '../math/Vector3';
import { Material } from '../materials/Material';

export interface PhongLightingInput {
  normal: Vector3;
  lightDirection: Vector3;
  viewDirection: Vector3;
  material: Material;
  lightColor: Vector3;
  lightIntensity: number;
  ambientLight: Vector3;
}

export function phongLighting(input: PhongLightingInput): Vector3 {
  const {
    normal,
    lightDirection,
    viewDirection,
    material,
    lightColor,
    lightIntensity,
    ambientLight,
  } = input;

  const normalizedNormal = normal.normalize();
  const normalizedLightDir = lightDirection.normalize();
  const normalizedViewDir = viewDirection.normalize();

  const modulate = (base: Vector3, tint: Vector3): Vector3 =>
    new Vector3(
      base.x * tint.x,
      base.y * tint.y,
      base.z * tint.z
    );

  // Ambient component
  const ambient = modulate(material.ambient, ambientLight);

  // Diffuse component: dot(N, L)
  const diffuseFactor = Math.max(0, normalizedNormal.dot(normalizedLightDir));
  const diffuse = material.diffuse
    .multiply(diffuseFactor)
    .multiply(lightIntensity);

  // Specular component: (R · V)^n
  const reflected = normalizedLightDir
    .multiply(-1)
    .add(normalizedNormal.multiply(2 * normalizedNormal.dot(normalizedLightDir)))
    .normalize();

  const specularFactor = Math.pow(
    Math.max(0, reflected.dot(normalizedViewDir)),
    material.shininess
  );
  const specular = material.specular
    .multiply(specularFactor)
    .multiply(lightIntensity);

  // Combine components
  const result = ambient
    .add(modulate(diffuse, lightColor))
    .add(modulate(specular, lightColor));

  // Clamp to [0, 1]
  return new Vector3(
    Math.max(0, Math.min(1, result.x)),
    Math.max(0, Math.min(1, result.y)),
    Math.max(0, Math.min(1, result.z))
  );
}

export function phongLightingRGB(
  normal: Vector3,
  lightDirection: Vector3,
  viewDirection: Vector3,
  material: Material,
  lightColor: Vector3,
  lightIntensity: number,
  ambientLight: Vector3
): [number, number, number] {
  const result = phongLighting({
    normal,
    lightDirection,
    viewDirection,
    material,
    lightColor,
    lightIntensity,
    ambientLight,
  });

  return [
    Math.round(result.x * 255),
    Math.round(result.y * 255),
    Math.round(result.z * 255),
  ];
}
