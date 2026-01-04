import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define your website URL
const SITE_URL = 'https://snorq.xyz';

// Define your routes
const routes = [
    {
        url: '/',
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/how-it-works',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/login',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/register',
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/privacy',
        changefreq: 'monthly',
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/terms',
        changefreq: 'monthly',
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/legal',
        changefreq: 'monthly',
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
    },
    {
        url: '/security',
        changefreq: 'monthly',
        priority: 0.3,
        lastmod: new Date().toISOString().split('T')[0]
    },
    // Add more routes as you create them
    // {
    //     url: '/blog',
    //     changefreq: 'daily',
    //     priority: 0.9,
    //     lastmod: new Date().toISOString().split('T')[0]
    // },
];

// Generate sitemap XML
function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${routes.map(route => `    <url>
        <loc>${SITE_URL}${route.url}</loc>
        <lastmod>${route.lastmod}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

    return sitemap;
}

// Write sitemap to public directory
const sitemap = generateSitemap();
const publicDir = path.join(__dirname, '../public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

console.log('✅ Sitemap generated successfully at:', sitemapPath);
console.log(`📍 Total URLs: ${routes.length}`);
console.log(`🌐 Site URL: ${SITE_URL}`);
