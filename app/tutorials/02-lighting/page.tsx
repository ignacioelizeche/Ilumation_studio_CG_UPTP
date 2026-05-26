"use client";

export default function LightingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Lesson 2: Lighting</h1>

        <div className="prose prose-invert max-w-none">
          <section className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction to Lighting</h2>

            <p className="text-gray-300 mb-4">
              Lighting determines how surfaces are shaded and how scenes appear realistic.
              We usually compose lighting models from three terms: ambient, diffuse and specular.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Components</h3>

            <ul className="list-disc list-inside text-gray-300 mb-4">
              <li><strong>Ambient:</strong> constant base illumination.</li>
              <li><strong>Diffuse:</strong> Lambertian term proportional to max(0, n·l).</li>
              <li><strong>Specular:</strong> highlights depending on view direction and shininess.</li>
            </ul>

            <div className="bg-gray-900 p-4 rounded border border-gray-600 mb-4">
              <code className="text-yellow-400 text-sm block">
                color = ambient + diffuse + specular
              </code>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Diffuse (Lambert)</h3>

            <p className="text-gray-300 mb-3">
              The diffuse contribution uses the surface normal `n` and light
              direction `l`: <span className="font-mono text-sm text-green-300">diffuse = kd * (n · l) * lightColor</span>.
            </p>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Specular (Phong)</h3>

            <p className="text-gray-300 mb-3">
              One simple model for specular highlights is Phong: compute the
              reflection vector `r` and use (r·v)^s where `v` is view dir and `s` shininess.
            </p>

            <div className="bg-gray-800 p-4 rounded border border-gray-700">
              <pre className="text-xs text-gray-300 overflow-x-auto">{`// pseudocode
vec3 n = normalize(normal);
vec3 l = normalize(lightDir);
vec3 v = normalize(viewDir);
float NdotL = max(dot(n, l), 0.0);
vec3 diffuse = kd * NdotL * lightColor;

vec3 r = reflect(-l, n);
float spec = pow(max(dot(r, v), 0.0), shininess);
vec3 specular = ks * spec * lightColor;`}</pre>
            </div>

            <h3 className="text-xl font-bold text-white mt-6 mb-3">Try it in the Playground</h3>

            <p className="text-gray-300 mb-4">
              Open the <a href="/playground" className="text-blue-400 hover:text-blue-300">Playground</a>, enable a point light
              and change the shininess value to see how specular highlights behave.
            </p>
          </section>
        </div>

        <div className="mt-8 flex gap-4">
          <a href="/tutorials" className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">← Tutorials</a>
          <a href="/tutorials/03-materials" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">Next: Materials →</a>
        </div>
      </div>
    </main>
  );
}
