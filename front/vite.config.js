import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// import path from "path";

const VITE_CONFIG = ({ mode }) => {
  console.log(`mode: ${mode}`)
  process.env = { ...process.env, ...loadEnv(mode, process.cwd())}
  console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`process.env.VITE_RUTIL_VM_OVIRT_IP: ${process.env.VITE_RUTIL_VM_OVIRT_IP}`)

  const apiUrl = process.env.VITE_RUTIL_VM_OVIRT_IP ?? "localhost";
  return defineConfig({
    // root: path.resolve(__dirname, 'public'),
    plugins: [react(), mkcert()],
    css: {
      devSourcemap: true,
    },
    define: {
      global: 'window'
    },
    server: {
      https: true,
      port: Number(process.env.SSL_PORT) || 3443,
      proxy: {
        "/api": {
          target: `https://${apiUrl}:6690`,
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
        watch: {
          usePolling: true
        }
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