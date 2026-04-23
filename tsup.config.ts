import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next-themes"],
  // Preserve the "use client" directive at the top of the bundle so Next.js
  // treats every export as a client module. This is required because several
  // components (FilterBar via react-select, SearchableSelect, etc.) rely on
  // browser-only APIs and cannot be evaluated in the React Server Components
  // environment. All downstream consumers already use these components only
  // from client trees.
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
