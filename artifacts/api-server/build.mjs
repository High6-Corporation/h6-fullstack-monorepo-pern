import { build } from "esbuild"

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "dist/index.js",
  // pg-native is an optional native addon — skip it
  external: ["pg-native"],
  // Shims so any CJS deps that reference __dirname / __filename still work.
  // Use URL API directly to avoid clashing with explicit imports in the bundle.
  banner: {
    js: [
      `import { createRequire } from "module";`,
      `const require = createRequire(import.meta.url);`,
      `const __filename = new URL(import.meta.url).pathname;`,
      `const __dirname = new URL(".", import.meta.url).pathname.replace(/\\/+$/, "");`,
    ].join("\n"),
  },
})
