'use client';

import Link from 'next/link';

export default function TutorialsIndex() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">Tutorials</h1>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <ul className="space-y-3">
            <li>
              <Link href="/tutorials/01-transformations" className="text-blue-400">01 - Transformations</Link>
            </li>
            <li>
              <Link href="/tutorials/02-lighting" className="text-blue-400">02 - Lighting</Link>
            </li>
            <li>
              <Link href="/tutorials/03-materials" className="text-blue-400">03 - Materials</Link>
            </li>
            <li>
              <Link href="/tutorials/04-rendering" className="text-blue-400">04 - Rendering</Link>
            </li>
            <li>
              <Link href="/tutorials/05-scene" className="text-blue-400">05 - Scene Management</Link>
            </li>
            <li>
              <Link href="/tutorials/06-geometry" className="text-blue-400">06 - Geometry & Meshes</Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
