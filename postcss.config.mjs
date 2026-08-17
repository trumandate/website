import tailwindcss from "tailwindcss";

// Astro's Vite pipeline picks up a root-level PostCSS config automatically.
// No autoprefixer: the target set is evergreen browsers on Cloudflare Pages
// and the utilities in use (flex, grid, logical properties) need no prefixing,
// so the dependency is left out rather than added on spec.
export default {
  plugins: [tailwindcss()],
};
