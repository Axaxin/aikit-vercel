# SimpleKit Proxy

一个用于 AI API 服务的简单代理服务，支持多个 AI 服务提供商的统一接口代理。

## 功能特点

- 支持多个 AI API 服务提供商（如 Groq、Ollama、Mistral 等）
- 使用 Vercel Edge Config 进行安全配置管理
- 基于 Vercel Edge Runtime 运行，提供低延迟的全球访问
- 统一的认证机制
- 支持 CORS，方便前端集成
- 自动请求转发和响应处理

## 技术栈

- Runtime: Vercel Edge Runtime
- 配置管理: Vercel Edge Config
- 主要依赖:
  - @vercel/edge-config: ^0.4.1
  - vercel: ^32.0.0

## 环境变量

项目需要以下环境变量：

```
EDGE_CONFIG=your-edge-config-id  # 创建 Edge Config 时自动设置
```

## 部署步骤

### 1. Vercel 项目设置

1. Fork 或克隆此仓库
2. 在 Vercel 中导入项目
3. 进入项目设置的 "Environment Variables" 部分
4. 确保环境变量正确设置

### 2. Vercel Edge Config 设置

1. 安装 Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. 创建新的 Edge Config:
   ```bash
   vercel edge-config add
   ```

3. 配置 API 设置:
   ```bash
   vercel edge-config add aiapi-config '{
     "password": "your-secure-password",
     "groq": {
       "apikey": "your-groq-api-key",
       "backend": "https://api.groq.com"
     },
     "ollama1": {
       "apikey": "ollama",
       "backend": "https://your-ollama-backend"
     },
     "mistral": {
       "apikey": "your-mistral-api-key",
       "backend": "https://api.mistral.ai"
     }
   }'
   ```

## 本地开发

1. 克隆仓库:
   ```bash
   git clone <repository-url>
   cd simplekit
   ```

2. 安装依赖:
   ```bash
   npm install
   ```

3. 链接 Edge Config 到本地环境:
   ```bash
   vercel link
   vercel env pull
   ```

4. 启动开发服务器:
   ```bash
   npm run dev
   ```

## API 使用说明

### 认证
所有请求需要在 Header 中携带 Bearer Token：
```
Authorization: Bearer your-secure-password
```

### 请求格式
```
POST /<provider>/<endpoint>
```
例如：
- Groq API: `/groq/chat/completions`
- Mistral API: `/mistral/chat/completions`
- Ollama API: `/ollama1/api/chat`

## 贡献指南

欢迎提交 Issues 和 Pull Requests 来改进项目。

## 许可证

请查看 [LICENSE](LICENSE) 文件了解详情。
