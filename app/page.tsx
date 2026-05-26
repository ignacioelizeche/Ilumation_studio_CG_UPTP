export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Illumination Studio
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Interactive 3D Graphics Learning Platform
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/playground"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              Launch Playground
            </a>
            <a
              href="/tutorials/01-transformations"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
            >
              Start Learning
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-2">3D Rendering</h2>
            <p className="text-gray-400">
              Learn how 3D models are transformed and rendered on screen
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Lighting Models</h2>
            <p className="text-gray-400">
              Understand Phong, PBR, and other illumination algorithms
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-2">Interactive Learning</h2>
            <p className="text-gray-400">
              Experiment with shaders, materials, and geometries in real-time
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
