import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The C++ engine (Boost.Beast) serves the REST API on :8080. In dev we proxy
// the engine's routes through Vite so the frontend can use relative paths
// (no CORS, no hard-coded host). For a deployed backend, set VITE_API_BASE
// instead and these proxy rules are simply unused.
const ENGINE = "http://localhost:8080";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/account": ENGINE,
      "/positions": ENGINE,
      "/trades": ENGINE,
      "/book": ENGINE,
      "/order": ENGINE,
      "/seed": ENGINE,
    },
  },
});
