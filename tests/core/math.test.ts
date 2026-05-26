import { describe, it, expect } from 'vitest';
import { Vector3, Matrix4 } from '@/src/core/math';

describe('Vector3', () => {
  it('should create a vector with correct values', () => {
    const v = new Vector3(1, 2, 3);
    expect(v.x).toBe(1);
    expect(v.y).toBe(2);
    expect(v.z).toBe(3);
  });

  it('should calculate magnitude correctly', () => {
    const v = new Vector3(3, 4, 0);
    expect(v.magnitude()).toBe(5);
  });

  it('should normalize a vector', () => {
    const v = new Vector3(3, 4, 0);
    const normalized = v.normalize();
    expect(Math.abs(normalized.magnitude() - 1)).toBeLessThan(1e-6);
  });

  it('should calculate dot product correctly', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    expect(v1.dot(v2)).toBe(32); // 1*4 + 2*5 + 3*6
  });

  it('should calculate cross product correctly', () => {
    const v1 = Vector3.right();
    const v2 = Vector3.up();
    const cross = v1.cross(v2);
    expect(cross.x).toBeLessThan(0.1);
    expect(cross.y).toBeLessThan(0.1);
    expect(cross.z).toBeCloseTo(1, 5);
  });

  it('should add vectors correctly', () => {
    const v1 = new Vector3(1, 2, 3);
    const v2 = new Vector3(4, 5, 6);
    const sum = v1.add(v2);
    expect(sum.x).toBe(5);
    expect(sum.y).toBe(7);
    expect(sum.z).toBe(9);
  });

  it('should subtract vectors correctly', () => {
    const v1 = new Vector3(5, 7, 9);
    const v2 = new Vector3(1, 2, 3);
    const diff = v1.subtract(v2);
    expect(diff.x).toBe(4);
    expect(diff.y).toBe(5);
    expect(diff.z).toBe(6);
  });

  it('should multiply by scalar correctly', () => {
    const v = new Vector3(1, 2, 3);
    const scaled = v.multiply(2);
    expect(scaled.x).toBe(2);
    expect(scaled.y).toBe(4);
    expect(scaled.z).toBe(6);
  });
});

describe('Matrix4', () => {
  it('should create identity matrix', () => {
    const m = Matrix4.identity();
    const v = new Vector3(1, 2, 3);
    const transformed = m.transformVector(v);
    expect(transformed.x).toBeCloseTo(1, 5);
    expect(transformed.y).toBeCloseTo(2, 5);
    expect(transformed.z).toBeCloseTo(3, 5);
  });

  it('should apply translation', () => {
    const m = Matrix4.translation(10, 20, 30);
    const v = new Vector3(1, 2, 3);
    const transformed = m.transformVector(v);
    expect(transformed.x).toBeCloseTo(11, 5);
    expect(transformed.y).toBeCloseTo(22, 5);
    expect(transformed.z).toBeCloseTo(33, 5);
  });

  it('should apply rotation Y', () => {
    const m = Matrix4.rotationY(Math.PI / 2); // 90 degrees
    const v = new Vector3(1, 0, 0);
    const transformed = m.transformVector(v);
    expect(Math.abs(transformed.x)).toBeLessThan(1e-6);
    expect(Math.abs(transformed.y)).toBeLessThan(1e-6);
    expect(transformed.z).toBeCloseTo(-1, 5);
  });

  it('should apply scale', () => {
    const m = Matrix4.scale(2, 3, 4);
    const v = new Vector3(1, 1, 1);
    const transformed = m.transformVector(v);
    expect(transformed.x).toBeCloseTo(2, 5);
    expect(transformed.y).toBeCloseTo(3, 5);
    expect(transformed.z).toBeCloseTo(4, 5);
  });

  it('should multiply matrices', () => {
    const t = Matrix4.translation(1, 0, 0);
    const s = Matrix4.scale(2, 1, 1);
    const combined = s.multiply(t);
    const v = new Vector3(1, 0, 0);
    const transformed = combined.transformVector(v);
    expect(transformed.x).toBeCloseTo(4, 5); // (1+1)*2
    expect(transformed.y).toBeCloseTo(0, 5);
    expect(transformed.z).toBeCloseTo(0, 5);
  });

  it('should compute determinant', () => {
    const m = Matrix4.identity();
    expect(m.determinant()).toBe(1);
  });

  it('should compute inverse', () => {
    const m = Matrix4.translation(5, 10, 15);
    const inv = m.inverse();
    const combined = m.multiply(inv);
    const identity = Matrix4.identity();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const expected = i === j ? 1 : 0;
        expect(Math.abs(combined.toArray2D()[i][j] - expected)).toBeLessThan(1e-6);
      }
    }
  });
});
