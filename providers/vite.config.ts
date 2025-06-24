export default defineConfig({
  server: {
    port: 3002,
    host: true,
    strictPort: true,
    allowedHosts: ["sms-licking-arising-carefully.trycloudflare.com"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  preview: {
    fallback: true,
  },
});
