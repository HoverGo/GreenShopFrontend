import { defineConfig } from "vite";
import ViteSSR from "vite-plugin-ssr/plugin";

export default defineConfig({
    plugins: [ViteSSR()],
});
