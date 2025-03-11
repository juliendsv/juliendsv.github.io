const postcss = require("postcss");
const fs = require("fs");
const path = require("path");

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
