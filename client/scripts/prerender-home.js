import { readFile, writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const htmlPath = resolve(scriptDirectory, "../dist/index.html");
const manifestPath = resolve(scriptDirectory, "../dist/.vite/manifest.json");
const vite = await createServer({
  configFile: resolve(scriptDirectory, "../vite.config.js"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { AppRoutes } = await vite.ssrLoadModule("/src/App.jsx");
  const renderedApp = renderToString(
    createElement(
      StaticRouter,
      { location: "/" },
      createElement(AppRoutes),
    ),
  );
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  let html = await readFile(htmlPath, "utf8");
  let prerenderedMarkup = renderedApp;
  const rootPlaceholder = '<div id="root"></div>';

  if (!html.includes(rootPlaceholder)) {
    throw new Error("Could not find the app root in the generated HTML.");
  }

  for (const [source, asset] of Object.entries(manifest)) {
    if (asset.file) {
      prerenderedMarkup = prerenderedMarkup.replaceAll(
        `/${source}`,
        `/${asset.file}`,
      );
    }
  }

  if (prerenderedMarkup.includes("/src/assets/")) {
    throw new Error("A prerendered asset URL was not found in the build manifest.");
  }

  await writeFile(
    htmlPath,
    html.replace(rootPlaceholder, `<div id="root">${prerenderedMarkup}</div>`),
  );
} finally {
  await vite.close();
}
