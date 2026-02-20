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
npx wrangler secret put BAIDU_OCR_API_KEY
npx wrangler secret put BAIDU_OCR_SECRET_KEY
npx wrangler secret put ZHIPU_API_KEY
```

## Deploy

Push to GitHub and connect this repository in Cloudflare Workers + Pages.
Cloudflare will auto-deploy on new commits.

## Notes

- `/api/ocr` returns recognized text + bounding boxes.
- `/api/image-translate` returns OCR lines for image-translation preprocessing.
- `/api/translate-texts` uses `glm-4.5-flash` to translate OCR lines on the backend.
- Final translated image composition (blur + redraw text) is done in browser canvas.
