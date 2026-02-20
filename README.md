# image-process

Cloudflare Worker image processing demo with:
- OCR (Baidu document OCR)
- Image translate (OCR + frontend redraw)
- Format conversion
- Basic background removal

## Run locally

```bash
npm create cloudflare@latest . -- --type=hello-world
```

If your project already has Wrangler:

```bash
npx wrangler dev
```

## Required secrets

Set Baidu OCR credentials in Worker secrets:

```bash
npx wrangler secret put BAIDU_API_KEY
npx wrangler secret put BAIDU_SECRET_KEY
```

## Deploy

Push to GitHub and connect this repository in Cloudflare Workers + Pages.
Cloudflare will auto-deploy on new commits.

## Notes

- `/api/ocr` returns recognized text + bounding boxes.
- `/api/image-translate` currently returns OCR lines; translated image composition is done in browser canvas.
- The browser translation step uses `window.Translator` when available; otherwise it uses a simple fallback marker.
