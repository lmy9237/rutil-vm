import { ConfigEnv, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import fs from "fs";
import dotenv from 'dotenv';
// import path from "path";

dotenv.config();
// const tailwindcss = require('@tailwindcss/vite');

const VITE_CONFIG = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd())}

  const isDevelop = process.env.VITE_DEVELOP === "true";

  return defineConfig({
    // root: path.resolve(__dirname, 'public'),
    plugins: [react(), mkcert()],
    define: {
      global: 'window'
    },
    server: {
      https: true,
      // {
      //   key: fs.readFileSync(".cert/localhost-key.pem"),
      //   cert: fs.readFileSync(".cert/localhost.pem"),
      // },
      port: Number(process.env.SSL_PORT) || 3000,
      proxy: {
        "/api": {
          target: "https://192.168.0.70:8443",
          changeOrigin: true,
          secure: false, // Set to true if the target uses a valid SSL certificate
          configure: (proxy, options) => {
            proxy.on("proxyReq", (proxyReq, req, res) => {
              console.log("Proxying request:", req.method, req.url);
            });
            proxy.on("proxyRes", (proxyRes, req, res) => {
              console.log("Received proxy response for:", req.method, req.url, proxyRes.statusCode);
            });
            proxy.on("error", (err, req, res) => {
              console.error("Proxy error:", err);
            });
          }
        },
      }
    },
    resolve: {
      alias: {
        // Example: resolve @ to src folder
        "@": "/src",
      },
    },
  });
}

export default VITE_CONFIG