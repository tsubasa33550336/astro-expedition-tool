import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/astro-expedition-tool/",
  plugins: [react()],
});
