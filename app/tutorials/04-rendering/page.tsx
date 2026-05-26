"use client";

export default function RenderingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Lesson 4: Rendering</h1>

        <div className="prose prose-invert max-w-none">
          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Rasterization & Shading</h2>

            <p className="text-gray-300 mb-4">
              Rendering converts scene data into pixels. We'll overview the rasterization
              pipeline: vertex processing, primitive assembly, rasterization and fragment shading.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Pipeline Steps</h3>

            <ol className="list-decimal list-inside text-gray-300 mb-4">
              <li>Vertex shading: transform vertices to clip space.</li>
              <li>Clipping & assembly: build triangles.</li>
              <li>Rasterization: determine covered fragments.</li>
              <li>Fragment shading: compute color per-pixel (lighting, texturing).</li>
            </ol>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Optimizations</h3>

            <p className="text-gray-300 mb-3">Basic optimizations include back-face culling, coarse z-test and batching draw calls.</p>
          </section>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/tutorials" className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">← Tutorials</a>
          <a href="/tutorials/05-scene" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Next: Scene →</a>
        </div>
      </div>
    </main>
  );
}
