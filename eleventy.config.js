import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
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
