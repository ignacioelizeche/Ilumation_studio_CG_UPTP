'use client';

export default function TransformationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Lesson 1: 3D Transformations
        </h1>

        <div className="prose prose-invert max-w-none">
          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Understanding 3D Transformations
            </h2>

            <p className="text-gray-300 mb-4">
              Transformations are fundamental to 3D graphics. They allow us to
              move, rotate, and scale objects in 3D space. In computer graphics,
              we represent transformations using 4×4 matrices.
            </p>

            <div className="bg-gray-900 p-4 rounded border border-gray-600 my-4">
              <p className="font-mono text-sm text-gray-400 mb-2">
                Mathematical Representation:
              </p>
              <code className="text-blue-400">
                p&apos; = M × p
                <br />
                where p is a 3D point (as homogeneous coordinates)
                <br />
                and M is a 4×4 transformation matrix
              </code>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">
              Types of Transformations
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-bold text-blue-400 mb-2">Translation</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Moves an object along the X, Y, Z axes.
                </p>
                <code className="text-green-400 text-xs">
                  Matrix4.translation(x, y, z)
                </code>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-bold text-blue-400 mb-2">Rotation</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Rotates an object around one of the axes. Angles are in radians.
                </p>
                <code className="text-green-400 text-xs">
                  Matrix4.rotationY(angleInRadians)
                </code>
              </div>

              <div className="bg-gray-700 p-4 rounded">
                <h4 className="font-bold text-blue-400 mb-2">Scaling</h4>
                <p className="text-gray-300 text-sm mb-2">
                  Changes the size of an object. Values &gt; 1 enlarge,
                  values &lt; 1 shrink.
                </p>
                <code className="text-green-400 text-xs">
                  Matrix4.scale(sx, sy, sz)
                </code>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">
              Transformation Pipeline
            </h3>

            <p className="text-gray-300 mb-3">
              In 3D graphics, transformations happen in a specific order:
            </p>

            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <code className="text-yellow-400 text-sm block">
                Object Space
                <span className="text-gray-500"> ─── Model Matrix ───→</span>
                <br />
                World Space
                <span className="text-gray-500"> ─── View Matrix ───→</span>
                <br />
                Camera Space
                <span className="text-gray-500"> ─── Projection Matrix ───→</span>
                <br />
                Normalized Device Coordinates
                <span className="text-gray-500"> ─── Viewport Transform ───→</span>
                <br />
                Screen Space
              </code>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">
              Try It Yourself
            </h3>

            <p className="text-gray-300 mb-4">
              Go to the <a href="/playground" className="text-blue-400 hover:text-blue-300">Playground</a> and experiment
              with different transformations. Notice how the cube changes position,
              rotation, and size.
            </p>
          </section>

          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              Key Concepts
            </h2>

            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>
                <strong>Homogeneous Coordinates:</strong> We use 4D coordinates
                (x, y, z, w) to represent 3D points. This allows us to represent
                translations with matrices.
              </li>
              <li>
                <strong>Matrix Multiplication Order:</strong> Transformations are
                applied right-to-left. M₃ × M₂ × M₁ × v means apply M₁ first,
                then M₂, then M₃.
              </li>
              <li>
                <strong>Perspective Division:</strong> After applying the
                projection matrix, we divide by the w coordinate to get screen
                coordinates.
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
          >
            ← Home
          </a>
          <a
            href="/tutorials/02-lighting"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Next: Lighting →
          </a>
        </div>
      </div>
    </main>
  );
}
