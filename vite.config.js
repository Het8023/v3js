import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        // 这里的名称要和主应用改造是配置项中的name保持一致
        plugins: [vue()],
        server: {
            open: true,
            port: 8888,
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: env.VITE_APP_BASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ""),
                },
            },
            // 防止开发阶段的assets 静态资源加载问题
            origin: "//localhost:8888",
        },
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
    };
});
