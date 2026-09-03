const BACKEND_URL = 'https://selectyourcarincongo-backend.onrender.com';

export async function onRequestGet() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/vehicles/public?limit=100`);

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    const vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];

    const staticUrls = [
      'https://selectyourcarincongo.com/',
      'https://selectyourcarincongo.com/vehicles',
      'https://selectyourcarincongo.com/contact',
      'https://selectyourcarincongo.com/terms',
      'https://selectyourcarincongo.com/privacy'
    ];

    const vehicleUrls = vehicles
      .filter((vehicle) => vehicle && vehicle._id)
      .map((vehicle) => `https://selectyourcarincongo.com/vehicles/${encodeURIComponent(vehicle._id)}`);

    const urls = [...staticUrls, ...vehicleUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://selectyourcarincongo.com/</loc></url>
  <url><loc>https://selectyourcarincongo.com/vehicles</loc></url>
  <url><loc>https://selectyourcarincongo.com/contact</loc></url>
  <url><loc>https://selectyourcarincongo.com/terms</loc></url>
  <url><loc>https://selectyourcarincongo.com/privacy</loc></url>
</urlset>`;

    return new Response(fallbackXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=UTF-8',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }
}
