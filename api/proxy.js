import { createClient } from '@vercel/edge-config';

export const config = {
  runtime: 'edge'
};

async function handleRequest(request) {
  // 从 Edge Config 获取配置
  const edgeConfig = createClient(process.env.EDGE_CONFIG);

  // 验证 token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const token = authHeader.slice(7).trim();
  const password = await edgeConfig.get('password');
  if (token !== password) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 解析路径和目标服务
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  if (pathParts.length < 1) {
    return new Response(JSON.stringify({ error: 'Invalid path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const target = pathParts[0];
  const backendInfo = await edgeConfig.get(target);
  if (!backendInfo || target === 'password') {
    return new Response(JSON.stringify({ error: 'Invalid target' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 构建转发请求
  let newPath;
  if (backendInfo.backend.includes('mistral') || backendInfo.apikey.includes('ollama')) {
    newPath = pathParts.slice(1).filter(part => part !== 'openai').join('/');
  } else {
    newPath = pathParts.slice(1).join('/');
  }
  
  const backendUrl = `${backendInfo.backend}/${newPath}${url.search}`;
  
  // 准备请求头
  const headers = new Headers(request.headers);
  headers.delete('host');
  
  if (backendInfo.apikey.includes('ollama')) {
    headers.delete('authorization');
  } else {
    headers.set('authorization', `Bearer ${backendInfo.apikey}`);
  }

  // 转发请求
  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: headers,
      body: request.method !== 'GET' ? request.body : undefined,
      duplex: 'half'
    });

    // 构建响应
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default async function handler(request) {
  // 处理 CORS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  return handleRequest(request);
}
