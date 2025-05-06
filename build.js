const postcss = require("postcss");
const fs = require("fs");
const path = require("path");
const sitemapGenerator = require("./app/sitemap.js"); // Import the sitemap function

// Ensure directories exist
const distDir = path.join(__dirname, "dist");
const srcDir = path.join(__dirname, "src");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}
if (!fs.existsSync(srcDir)) {
  fs.mkdirSync(srcDir);
}

// Ensure src/styles.css exists with Tailwind directives
const stylesPath = path.join(srcDir, "styles.css");
if (!fs.existsSync(stylesPath)) {
  fs.writeFileSync(
    stylesPath,
    "@tailwind base;\n@tailwind components;\n@tailwind utilities;"
  );
}

// --- Sitemap Generation ---
function generateSitemapXml(sitemapData) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemapData.forEach((entry) => {
    xml += "  <url>\n";
    xml += `    <loc>${entry.url}</loc>\n`;
    if (entry.lastModified) {
      // Format date to YYYY-MM-DD
      const date =
        entry.lastModified instanceof Date
          ? entry.lastModified
          : new Date(entry.lastModified);
      xml += `    <lastmod>${date.toISOString().split("T")[0]}</lastmod>\n`;
    }
    if (entry.changeFrequency) {
      xml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`;
    }
    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`;
    }
    xml += "  </url>\n";
  });

  xml += "</urlset>";
  return xml;
}

try {
  const sitemapData = sitemapGenerator.default(); // Get sitemap data
  const sitemapXml = generateSitemapXml(sitemapData); // Generate XML string
  fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemapXml); // Write to root
  console.log("sitemap.xml generated successfully!");
} catch (error) {
  console.error("Error generating sitemap.xml:", error);
  process.exit(1);
}

// Read the input CSS file
const css = fs.readFileSync(stylesPath, "utf8");

// Process the CSS with Tailwind and minification
postcss([
  require("tailwindcss/nesting"),
  require("tailwindcss"),
  require("autoprefixer"),
  require("cssnano")({
    preset: [
      "default",
      {
        discardComments: {
          removeAll: true,
        },
      },
    ],
  }),
])
  .process(css, {
    from: stylesPath,
    to: path.join(distDir, "styles.css"),
  })
  .then((result) => {
    fs.writeFileSync(path.join(distDir, "styles.css"), result.css);
    console.log("CSS built and minified successfully!");
  })
  .catch((error) => {
    console.error("Error processing CSS:", error);
    process.exit(1);
  });
