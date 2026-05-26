# Illumination Studio - TypeScript Edition

Interactive 3D Graphics Educational Engine - A learning platform for Computer Graphics built with TypeScript and React.

## Overview

Illumination Studio is a complete rewrite of the original Python graphics engine, now in **TypeScript** with a modern web interface. It's designed to teach Computer Graphics concepts through interactive visualization and hands-on experimentation.

### Key Features

- **3D Rendering Pipeline**: Complete implementation from scratch
  - Transformations (object → camera → screen space)
  - Phong illumination model (ambient, diffuse, specular)
  - Rasterization with z-buffer for hidden surface removal
  - Anti-aliasing (SSAA)

- **Multiple Geometries**: Cube, Sphere, Cylinder, Torus, Plane
- **Interactive Playground**: Real-time control of lights, materials, and camera
- **Educational Content**: Tutorials, concept explanations, and interactive examples
- **Type Safety**: Full TypeScript for better developer experience

## Project Structure

```
illumination-studio-ts/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Landing page
│   ├── playground/page.tsx       # Interactive renderer
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── core/                     # Rendering engine (TypeScript)
│   │   ├── math/                 # Linear algebra (Vector3, Matrix4)
│   │   ├── geometry/             # 3D geometry (Mesh, GeometryFactory)
│   │   ├── materials/            # Material properties
│   │   ├── lighting/             # Phong lighting implementation
│   │   ├── scene/                # Scene management (Camera, Scene)
│   │   └── rendering/            # Renderer, Rasterizer
│   └── components/               # React components
│       └── CanvasRenderer.tsx    # 3D canvas component
├── public/                       # Static assets
│   ├── models/                   # 3D models (.obj)
│   ├── images/
│   └── docs/
├── tests/                        # Vitest test suites
│   ├── core/
│   │   ├── math.test.ts
│   │   ├── geometry.test.ts
│   │   └── rendering.test.ts
│   └── web/
├── docs/                         # Documentation
│   ├── tutoriales/
│   ├── conceptos/
│   └── api/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── vitest.config.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
cd illumination-studio-ts
pnpm install
```

### Development

```bash
pnpm dev
```

Opens http://localhost:3000

### Building

```bash
pnpm build
pnpm start
```

### Running Tests

```bash
pnpm test          # Run tests once
pnpm test:ui       # Run tests with UI
```

## Core Components

### Math (`src/core/math/`)
- **Vector3**: 3D vector with operations (dot, cross, normalize, etc.)
- **Matrix4**: 4×4 transformation matrix with perspective division

### Geometry (`src/core/geometry/`)
- **Mesh**: Triangle mesh with vertices, faces, normals
- **GeometryFactory**: Factory for creating standard shapes
  - `createCube(size)`
  - `createSphere(radius, widthSegments, heightSegments)`
  - `createCylinder(radius, height, radialSegments)`
  - `createTorus(majorRadius, minorRadius, tubeSegments, radialSegments)`
  - `createPlane(width, height, widthSegments, heightSegments)`

### Lighting (`src/core/lighting/`)
- **phongLighting()**: Implements Phong reflection model
  - Ambient component: Global illumination
  - Diffuse component: Matte surface reflection
  - Specular component: Glossy highlight
- **Light**: Positional light source with intensity and color

### Scene (`src/core/scene/`)
- **Camera**: Perspective camera with view/projection matrices
- **Scene**: Container for meshes, lights, camera

### Rendering (`src/core/rendering/`)
- **Renderer**: Main renderer orchestrating the pipeline
- **Rasterizer**: Triangle rasterization with barycentric interpolation
- Phong lighting calculation per vertex/fragment

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **TypeScript** | Type safety, better IDE support, self-documenting code |
| **Next.js** | Server-side rendering, routing, component framework |
| **Canvas API** | Direct pixel manipulation, matches Python implementation |
| **Vitest** | Fast unit testing, TypeScript-first |
| **Factory Pattern** | Easy to extend geometries without modifying core |
| **Modular Core** | Separated from web, reusable in Node.js, CLI, etc. |

## Phong Lighting Model

```
I = Kₐ·Iₐ + Kd·(N̂·L̂)·Id + Ks·(R̂·V̂)ⁿ·Is

Where:
- Kₐ, Kd, Ks: Material ambient, diffuse, specular coefficients
- Iₐ, Id, Is: Ambient, diffuse, specular light intensities
- N̂: Surface normal
- L̂: Light direction
- V̂: View direction
- R̂: Reflection direction
- n: Shininess (specular exponent)
```

## Implementation Notes

### Transformations
- Uses column-major 4×4 matrices
- Transformation chain: Object → World → Camera → NDC → Screen
- Homogeneous coordinates with perspective division

### Rasterization
- Barycentric coordinates for point-in-triangle test
- Z-buffer for depth testing
- Gouraud shading (per-vertex lighting with interpolation)

### Performance
- Framebuffer: Uint8ClampedArray (optimized for Canvas)
- Direct pixel writes with 4-byte RGBA format
- No GPU (CPU-based software renderer for educational clarity)

## What's Next (Roadmap)

### Phase 1: ✅ Core Pipeline
- [x] Vector3 and Matrix4 classes
- [x] Mesh and Material classes
- [x] Phong lighting implementation
- [x] Rasterizer with z-buffer
- [x] Renderer orchestrator
- [x] GeometryFactory with 5 geometry types

### Phase 2: 🔄 Interactive Playground
- [x] Canvas renderer component
- [ ] Real-time control sliders
- [ ] Light position controls
- [ ] Material property editor
- [ ] Geometry selector

### Phase 3: 📚 Educational Content
- [ ] Tutorials (transformations, lighting, rasterization)
- [ ] Concept pages with visualizations
- [ ] Code examples
- [ ] Interactive demos

### Phase 4: 🚀 Advanced Features
- [ ] PBR (Physically-Based Rendering)
- [ ] Texture mapping and normal maps
- [ ] Reflections/Refractions
- [ ] More geometry types

## Testing

Tests validate:
- ✅ Vector/matrix operations
- ✅ Geometric transformations
- ✅ Phong lighting calculations
- ✅ Rasterization correctness
- ✅ Z-buffer occlusion
- ✅ Renderer output

Run tests with: `pnpm test`

## Contributing

This is an educational project. Feel free to explore, modify, and learn!

## License

Educational use - feel free to learn and modify.

## References

- [Computer Graphics: Principles and Practice](https://www.oreilly.com/library/view/computer-graphics-principles/9780321399266/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Phong Reflection Model](https://en.wikipedia.org/wiki/Phong_reflection_model)
