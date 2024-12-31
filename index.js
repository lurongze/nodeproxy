const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3000;

// 定义代理的目标 URL
const targetUrl = "http://34.126.65.173:54268"; // 替换为你要代理的目标 URL

// 创建代理中间件
const proxyMiddleware = createProxyMiddleware({
  target: targetUrl,
  changeOrigin: true,
  pathRewrite: {
    "^/conversation": "", // 可以根据需要重写路径，这里将 /api 前缀去掉
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log("Proxy request:", req.method, req.url);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log("Proxy response:", proxyRes.statusCode, req.url);
  },
  onError: (err, req, res) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error occurred");
  },
});

// 使用代理中间件，这里假设你将代理请求的路径设置为 /api
app.use("/conversation", proxyMiddleware);

// 简单的健康检查端点
app.get("/health", (req, res) => {
  res.send("Proxy server is running");
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});
