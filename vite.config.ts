import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        // Настройка перенаправления всех необработанных запросов на index.html
        // Это позволит React Router обрабатывать маршруты на клиентской стороне.
        fs: {
            strict: false,
        },
        proxy: {
            "/api": {
                target: "https://greenshopfrontend-production.up.railway.app/", // замените на ваш адрес API
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        // Перенаправление всех необработанных запросов на index.html
        // (если это не файл и не начинается с '/api')
        hmr: {
            host: "localhost",
            port: 3000,
        },
    },
});
