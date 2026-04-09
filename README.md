# AI Gateway Worker

Single Cloudflare Worker supporting multiple AI models via `env.AI`.

## Supported Models
- gemma
- qwen
- nemotron

## Usage

POST request:

```json
{
  "prompt": "Hello",
  "model": "qwen"
}
```

## Deploy

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```
