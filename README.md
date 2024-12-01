# SimpleKit Proxy

A simple proxy service for AI APIs.

## Environment Variables

The following environment variable will be set automatically when you create Edge Config:

```
EDGE_CONFIG=your-edge-config-id
```

## Setup in Vercel

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Save the changes

## Vercel Edge Config Setup

1. Install Vercel CLI if not already installed:
   ```bash
   npm i -g vercel
   ```

2. Create a new Edge Config in your Vercel project:
   ```bash
   vercel edge-config add
   ```

3. Add the API configuration:
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

## Local Development

For local development, make sure your Edge Config is linked to your local environment:
```bash
vercel link
vercel env pull
```
