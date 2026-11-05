import fs from "node:fs";
import path from "node:path";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

const MEDIA_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
};

// `npm start` only: answer every request for a file in a media/ folder straight
// from the source folders. Eleventy's watcher doesn't notice files added to media/
// folders while the server runs, so without this a new image is a 404 and a moved
// one is still served from an old copy in _site/ until you restart.
// Supports byte ranges so videos can seek. The real build copies the files as usual.
function serveMediaFromSource(req, res, next) {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (!urlPath.includes("/media/")) return next();

  const root = path.resolve(".");
  const file = path.join(root, urlPath);
  if (!file.startsWith(root + path.sep)) return next();

  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    stat = null;
  }
  if (!stat || !stat.isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end(`Not found: ${urlPath}`);
  }

  const headers = {
    "Content-Type": MEDIA_TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
  };
  let start = 0;
  let end = stat.size - 1;
  let status = 200;

  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (range && (range[1] || range[2])) {
    if (range[1]) {
      start = Number(range[1]);
      if (range[2]) end = Math.min(Number(range[2]), end);
    } else {
      start = Math.max(stat.size - Number(range[2]), 0);
    }
    if (start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
      return res.end();
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
  }

  headers["Content-Length"] = end - start + 1;
  res.writeHead(status, headers);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file, { start, end }).pipe(res);
}

export default function (eleventyConfig) {
  eleventyConfig.setServerOptions({ middleware: [serveMediaFromSource] });

  // Write links as "/assets/..." and "/projects/..."; when the site is built for
  // github.io/Portfolio/ the deploy workflow passes --pathprefix and this plugin
  // adds "/Portfolio" in front of them. Relative links (media/x.png) are left alone.
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Files copied to the site as-is.
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("Docs");
  eleventyConfig.addPassthroughCopy("**/media/**");

  // Not pages.
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("Docs/**");

  // Every page with `project:` in its front matter, in project-number order.
  // Used for the Projects menu, the project list and the home page cards.
  eleventyConfig.addCollection("projects", (api) =>
    api
      .getAll()
      .filter((p) => p.data.project)
      .sort((a, b) => a.data.project.number - b.data.project.number)
  );

  // Projects shown on the home page (featured: true), newest first.
  eleventyConfig.addCollection("featuredProjects", (api) =>
    api
      .getAll()
      .filter((p) => p.data.project && p.data.project.featured)
      .sort((a, b) => b.data.project.number - a.data.project.number)
  );

  // A thumbnail is relative to its project folder unless it starts with "/".
  eleventyConfig.addFilter("projectThumb", (p) => {
    const thumb = p.data.project.thumb;
    return thumb.startsWith("/") ? thumb : p.url + thumb;
  });
}

export const config = {
  dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
};
