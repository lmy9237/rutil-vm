import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// import path from "path";

let RUTIL_VM_ENV = {}
const VITE_CONFIG = ({ mode }) => {
  RUTIL_VM_ENV = { ...process.env, ...loadEnv(mode, process.cwd())}
  console.log(`vite.config.js ... mode: ${mode}`)
  console.log(`vite.config.js ... process.env.NODE_ENV: ${RUTIL_VM_ENV.NODE_ENV}`)
  console.log(`vite.config.js ... process.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: ${RUTIL_VM_ENV.VITE_RUTIL_VM_OVIRT_IP_ADDRESS}`)

  RUTIL_VM_ENV.__API_URL__ = `https://${RUTIL_VM_ENV.VITE_RUTIL_VM_OVIRT_IP_ADDRESS ?? "localhost"}:6690`;
  return defineConfig({
    // root: path.resolve(__dirname, 'public'),
    plugins: [react(), mkcert()],
    css: {
      devSourcemap: true,
    },
    define: {
      global: 'window',
    },
    server: {
      https: true,
      port: Number(process.env.SSL_PORT) || 3443,
      proxy: {
        "/api": {
          target: RUTIL_VM_ENV.__API_URL__,
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
    build: {
      minify: true, 
    }
  });
}

export { RUTIL_VM_ENV } ;

export default VITE_CONFIG

