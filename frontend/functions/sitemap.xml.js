const BACKEND_URL = "https://selectyourcarincongo-backend.onrender.com";
const SITE_URL = "https://selectyourcarincongo.com";
const PAGE_SIZE = 100;
const MAX_URLS = 50000;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatLastModified(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function onRequestGet() {
  const urls = [
    { loc: `${SITE_URL}/` },
    { loc: `${SITE_URL}/vehicles` },
    { loc: `${SITE_URL}/contact` },
    { loc: `${SITE_URL}/terms` },
    { loc: `${SITE_URL}/privacy` },
  ];

  try {
    let skip = 0;
    let total = null;

    while (urls.length < MAX_URLS) {
      const response = await fetch(
        `${BACKEND_URL}/api/vehicles/public?skip=${skip}&limit=${PAGE_SIZE}`,
        {
          headers: { Accept: "application/json" },
          cf: { cacheTtl: 300, cacheEverything: true },
        }
      );

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();
      const vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
      total = Number.isFinite(data.total) ? data.total : null;

      for (const vehicle of vehicles) {
        if (!vehicle?._id) continue;

        const lastmod = formatLastModified(vehicle.updated_at || vehicle.created_at);
        urls.push({
          loc: `${SITE_URL}/vehicles/${encodeURIComponent(vehicle._id)}`,
          lastmod,
        });

        if (urls.length >= MAX_URLS) break;
      }

      skip += vehicles.length;

      if (vehicles.length === 0 || vehicles.length < PAGE_SIZE) break;
      if (total !== null && skip >= total) break;
    }

    const body = urls
      .map(({ loc, lastmod }) => {
        const lastmodTag = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : "";
        return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodTag}\n  </url>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=UTF-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    });
  } catch (error) {
    return new Response(
      `Sitemap generation failed: ${escapeXml(error?.message || "Unknown error")}`,
      {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=UTF-8" },
      }
    );
  }
}
