import { APP_HTML } from "./web/html.js";
import { APP_CSS } from "./web/styles.js";
import { APP_JS } from "./web/app.js";
import { ocrFromRequest, translateTextsFromRequest } from "./lib/api.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function text(content, contentType) {
  return new Response(content, {
    headers: {
      "content-type": contentType,
      "cache-control": "no-store"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return text(APP_HTML, "text/html; charset=utf-8");
    }

    if (request.method === "GET" && url.pathname === "/static/app.css") {
      return text(APP_CSS, "text/css; charset=utf-8");
    }

    if (request.method === "GET" && url.pathname === "/static/app.js") {
      return text(APP_JS, "application/javascript; charset=utf-8");
    }

    if (request.method === "POST" && url.pathname === "/api/ocr") {
      try {
        const payload = await ocrFromRequest(request, env);
        return json(payload);
      } catch (error) {
        return json({ ok: false, error: error.message || "OCR 请求失败" }, 400);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/image-translate") {
      try {
        const payload = await ocrFromRequest(request, env);
        return json(payload);
      } catch (error) {
        return json({ ok: false, error: error.message || "图片翻译预处理失败" }, 400);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/translate-texts") {
      try {
        const payload = await translateTextsFromRequest(request, env);
        return json(payload);
      } catch (error) {
        return json({ ok: false, error: error.message || "文本翻译失败" }, 400);
      }
    }

    return json({ ok: false, error: "Not Found" }, 404);
  }
};
