import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@file-store/design-system": path.resolve(__dirname, "../../packages/design-system/src"),
      "@file-store/schemas": path.resolve(__dirname, "../../packages/schemas"),
      "@file-store/types": path.resolve(__dirname, "../../packages/types"),
    },
  },
});
