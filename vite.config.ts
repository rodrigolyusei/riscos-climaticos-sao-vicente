import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        referencias: resolve(rootDir, "referencias.html"),
        definicoes: resolve(rootDir, "definicoes.html"),
      },
    },
  },
});
