"use client";

export default function ScenePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Lesson 5: Scene Management</h1>

        <div className="prose prose-invert max-w-none">
          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Scene Graphs & Cameras</h2>

            <p className="text-gray-300 mb-4">
              Managing objects, cameras and lights in a scene is crucial for organizing and rendering complex worlds.
              A scene graph is a hierarchical structure where transforms are inherited from parent to child.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Scene Graph</h3>

            <p className="text-gray-300 mb-3">Nodes typically contain transform, mesh and material references. Updating a parent transform affects its children.</p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Cameras</h3>

            <p className="text-gray-300 mb-3">Cameras define view and projection matrices. Common cameras: perspective and orthographic.</p>
          </section>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/tutorials" className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">← Tutorials</a>
          <a href="/tutorials/06-geometry" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Next: Geometry →</a>
        </div>
      </div>
    </main>
  );
}
