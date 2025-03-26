import { defineConfig, createLogger, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
// import path from "path";

const logger = createLogger();
const loggerWarn = logger.warn
logger.warn = (msg, options) => {
  // Ignore empty CSS files warning
  if (msg.includes('vite:css') && msg.includes(' is empty')) return
  loggerWarn(msg, options)
}

let RUTIL_VM_ENV = {}
const VITE_CONFIG = ({ mode }) => {
  RUTIL_VM_ENV = { ...process.env, ...loadEnv(mode, process.cwd())}
  console.log(`vite.config.js ... mode: ${mode}`)
  console.log(`vite.config.js ... process.env.NODE_ENV: ${RUTIL_VM_ENV.NODE_ENV}`)
  console.log(`vite.config.js ... process.env.VITE_RUTIL_VM_OVIRT_IP_ADDRESS: ${RUTIL_VM_ENV.VITE_RUTIL_VM_OVIRT_IP_ADDRESS}`)

  RUTIL_VM_ENV.__API_URL__ = `https://${RUTIL_VM_ENV.VITE_RUTIL_VM_OVIRT_IP_ADDRESS ?? "localhost"}:6690`;
  RUTIL_VM_ENV.__WSPROXY_URL__ = `http://${RUTIL_VM_ENV.VITE_RUTIL_VM_OVIRT_IP_ADDRESS ?? "localhost"}:9999`; // 사용불가능
  console.log(`vite.config.js ... RUTIL_VM_ENV.__API_URL__: ${RUTIL_VM_ENV.__API_URL__}`)
  console.log(`vite.config.js ... RUTIL_VM_ENV.__WSPROXY_URL__: ${RUTIL_VM_ENV.__WSPROXY_URL__}`)

  return defineConfig({
    // root: path.resolve(__dirname, 'public'),
    plugins: [react(), mkcert()],
    customLogger: logger,
    css: {
      devSourcemap: true,
    },
    define: {
      global: 'window',
    },
    server: {
      https: true,
      port: Number(process.env.SSL_PORT) || 443,
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
          },
        },
        "/ws": {
          target: RUTIL_VM_ENV.__WSPROXY_URL__,
          ws: true,
          changeOrigin: true,
          // Remove the '/ws' prefix before forwarding the request
          rewrite: (path) => {
            console.info(`on rewrite ... path: ${path}`);
            return path.replace(/^\/ws/, '')
          },
        },
        watch: {
          usePolling: true
        },
      },
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

