"use client";

export default function MaterialsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Lesson 3: Materials</h1>

        <div className="prose prose-invert max-w-none">
          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Surface Materials</h2>

            <p className="text-gray-300 mb-4">
              Materials define how surfaces react to light. We commonly describe
              materials using parameters like albedo (base color), roughness and metalness.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Common Parameters</h3>

            <ul className="list-disc list-inside text-gray-300 mb-4">
              <li><strong>Albedo:</strong> base diffuse color.</li>
              <li><strong>Roughness:</strong> controls specular spread (low = shiny).</li>
              <li><strong>Metalness:</strong> blends between dielectric and metallic BRDFs.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Simple PBR Workflow</h3>

            <p className="text-gray-300 mb-3">
              In a basic PBR model: evaluate the diffuse and specular BRDFs, modulate
              by Fresnel and energy conservation, then sum with ambient/environment lighting.
            </p>

            <div className="bg-gray-900 p-4 rounded border border-gray-600">
              <pre className="text-xs text-gray-300 overflow-x-auto">{`// pseudocode
vec3 albedo = texture(albedoMap, uv);
float roughness = texture(roughnessMap, uv).r;
float metal = texture(metalnessMap, uv).r;

vec3 diffuse = (1.0 - metal) * lambert(albedo, n, l);
vec3 specular = cookTorrance(n, v, l, roughness, F0);
vec3 color = ambient + diffuse + specular;`}</pre>
            </div>
          </section>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/tutorials" className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">← Tutorials</a>
          <a href="/tutorials/04-rendering" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Next: Rendering →</a>
        </div>
      </div>
    </main>
  );
}
