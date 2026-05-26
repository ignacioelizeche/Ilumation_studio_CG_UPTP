'use client';

export default function GeometryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Lesson 6: Geometry & Meshes</h1>

        <div className="prose prose-invert max-w-none">
          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Meshes and Topology</h2>

            <p className="text-gray-300 mb-4">
              Geometry defines the shapes we render. This lesson introduces meshes, vertices, indices,
              normals and how we store geometry for rendering.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Vertex Attributes</h3>

            <p className="text-gray-300 mb-3">Typical attributes: position, normal, uv, tangent. Normals are required for lighting calculations.</p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Indexed Geometry</h3>

            <p className="text-gray-300 mb-3">Use an index buffer to reuse vertices across triangles and reduce memory bandwidth.</p>

            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-xs text-gray-300 overflow-x-auto">{`// simple mesh layout
positions: Float32Array [x,y,z ...]
normals: Float32Array [nx,ny,nz ...]
indices: Uint16Array [i0,i1,i2 ...]`}</pre>
            </div>
          </section>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/tutorials" className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">← Tutorials</a>
          <a href="/" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Home →</a>
        </div>
      </div>
    </main>
  );
}
