import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  base: process.env.PUBLIC_URL ?? "/",
  server: {
    port: 3000,
  },
  define: {
    "process.env.PUBLIC_URL": process.env.PUBLIC_URL,
  },
});
