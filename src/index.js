const HTML = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Image Process Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f3f7fb;
      --panel: rgba(255, 255, 255, 0.88);
      --text: #0b1b2b;
      --muted: #4c5f73;
      --line: rgba(23, 56, 88, 0.16);
      --brand: #0070f3;
      --brand-2: #00b894;
      --warn: #b45309;
      --shadow: 0 20px 45px rgba(9, 29, 51, 0.12);
      --radius-xl: 24px;
      --radius-md: 14px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: "Noto Sans SC", sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 8% 8%, #d8ecff 0, transparent 34%),
        radial-gradient(circle at 90% 12%, #dcfff0 0, transparent 30%),
        linear-gradient(160deg, #f2f7fc 0%, #edf5ff 40%, #eefaf5 100%);
      min-height: 100vh;
    }

    .app {
      width: min(1120px, 92vw);
      margin: 28px auto 40px;
      display: grid;
      gap: 18px;
    }

    .hero, .panel {
      background: var(--panel);
      backdrop-filter: blur(8px);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
    }

    .hero {
      padding: 28px;
      display: grid;
      gap: 8px;
      animation: rise .5s ease both;
    }

    h1 {
      font-family: "Space Grotesk", sans-serif;
      margin: 0;
      font-size: clamp(1.6rem, 2.2vw, 2.3rem);
      letter-spacing: 0.01em;
    }

    .subtitle {
      margin: 0;
      color: var(--muted);
      font-size: 0.98rem;
      line-height: 1.55;
    }

    .grid {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 18px;
    }

    .panel {
      padding: 18px;
      animation: rise .6s ease both;
    }

    .section-title {
      font-family: "Space Grotesk", sans-serif;
      margin: 0 0 12px;
      font-size: 1.1rem;
    }

    .upload {
      border: 1.5px dashed #7ea2c2;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(0,112,243,.07), rgba(0,184,148,.06));
      padding: 16px;
      text-align: center;
    }

    input[type="file"] {
      width: 100%;
      margin-top: 10px;
      border: 1px solid var(--line);
      border-radius: 10px;
      background: white;
      padding: 8px;
    }

    .hint {
      font-size: .86rem;
      color: var(--muted);
      margin-top: 8px;
      line-height: 1.5;
    }

    .feature-list {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }

    .feature-btn {
      width: 100%;
      border: 1px solid var(--line);
      background: #fff;
      color: var(--text);
      border-radius: 12px;
      padding: 12px;
      text-align: left;
      cursor: pointer;
      transition: .22s ease;
      font-weight: 600;
    }

    .feature-btn:hover { transform: translateY(-1px); border-color: #8bb4d7; }

    .feature-btn.active {
      border-color: #4b92d8;
      background: linear-gradient(135deg, rgba(0,112,243,.10), rgba(0,184,148,.10));
      box-shadow: inset 0 0 0 1px rgba(0,112,243,.14);
    }

    .control-row {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    select, button {
      border-radius: 10px;
      border: 1px solid var(--line);
      padding: 10px 12px;
      font-family: inherit;
      font-size: .92rem;
    }

    select { background: #fff; }

    button.primary {
      background: linear-gradient(135deg, var(--brand), #3397ff);
      color: #fff;
      border: none;
      font-weight: 700;
      cursor: pointer;
    }

    button.ghost {
      background: #fff;
      color: var(--text);
      cursor: pointer;
    }

    .canvas-wrap {
      border-radius: 16px;
      border: 1px solid var(--line);
      background: #fff;
      min-height: 320px;
      padding: 12px;
      display: grid;
      place-items: center;
      overflow: auto;
    }

    canvas {
      max-width: 100%;
      border-radius: 12px;
      box-shadow: 0 14px 28px rgba(7, 30, 57, .16);
    }

    .placeholder {
      color: var(--muted);
      font-size: .95rem;
    }

    .result {
      margin-top: 12px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fbfdff;
      padding: 12px;
      max-height: 220px;
      overflow: auto;
      font-size: .9rem;
      line-height: 1.55;
      white-space: pre-wrap;
    }

    .status { margin-top: 10px; color: var(--muted); font-size: .88rem; }
    .status.warn { color: var(--warn); }

    @keyframes rise {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main class="app">
    <section class="hero">
      <h1>Image Process Studio</h1>
      <p class="subtitle">上传图片后可进行 OCR、图片翻译、格式转换、去背景。OCR 由后端调用百度文档 OCR，翻译文本由后端调用 GLM-4.5-Flash，再由前端根据坐标重绘并导出。</p>
    </section>

    <section class="grid">
      <aside class="panel">
        <h2 class="section-title">1. 上传与配置</h2>
        <div class="upload">
          <div>支持 JPG / PNG / BMP</div>
          <input id="fileInput" type="file" accept="image/*" />
          <div class="hint">建议文字区域清晰、无遮挡。大图处理会更慢。</div>
        </div>

        <h3 class="section-title" style="margin-top:14px;">2. 功能选项</h3>
        <div class="feature-list" id="featureList">
          <button class="feature-btn active" data-feature="ocr">OCR（文字识别）</button>
          <button class="feature-btn" data-feature="translate">Image Translate（图片翻译）</button>
          <button class="feature-btn" data-feature="convert">格式转换</button>
          <button class="feature-btn" data-feature="remove-bg">去除背景</button>
        </div>

        <div class="control-row">
          <select id="targetLang">
            <option value="zh">中文</option>
            <option value="en" selected>English</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>

          <select id="outputFormat">
            <option value="image/png" selected>PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </div>

        <div class="control-row">
          <button class="primary" id="runBtn">执行</button>
          <button class="ghost" id="downloadBtn">下载结果</button>
        </div>

        <div id="status" class="status">等待上传图片。</div>
      </aside>

      <section class="panel">
        <h2 class="section-title">3. 预览与结果</h2>
        <div class="canvas-wrap" id="canvasWrap">
          <div id="placeholder" class="placeholder">上传图片后在这里预览处理结果</div>
          <canvas id="canvas" hidden></canvas>
        </div>
        <div class="result" id="resultBox">还没有结果。</div>
      </section>
    </section>
  </main>

  <script>
    const fileInput = document.getElementById("fileInput");
    const featureList = document.getElementById("featureList");
    const runBtn = document.getElementById("runBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const targetLang = document.getElementById("targetLang");
    const outputFormat = document.getElementById("outputFormat");
    const statusEl = document.getElementById("status");
    const resultBox = document.getElementById("resultBox");
    const canvas = document.getElementById("canvas");
    const placeholder = document.getElementById("placeholder");

    const ctx = canvas.getContext("2d");
    let selectedFeature = "ocr";
    let originalImage = null;
    let currentDataUrl = "";

    function setStatus(text, warn = false) {
      statusEl.textContent = text;
      statusEl.className = warn ? "status warn" : "status";
    }

    function setResult(text) {
      resultBox.textContent = text;
    }

    function dataUrlToImage(dataUrl) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
      });
    }

    function getImageSize(img) {
      const width = img && (img.naturalWidth || img.width) ? (img.naturalWidth || img.width) : 0;
      const height = img && (img.naturalHeight || img.height) ? (img.naturalHeight || img.height) : 0;
      return { width, height };
    }

    function drawImage(img) {
      const size = getImageSize(img);
      canvas.hidden = false;
      placeholder.hidden = true;
      canvas.width = size.width;
      canvas.height = size.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }

    async function fileToDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async function fileToDisplayImage(file, dataUrl) {
      if (window.createImageBitmap) {
        try {
          return await createImageBitmap(file, { imageOrientation: "none" });
        } catch (_) {}
      }
      return dataUrlToImage(dataUrl);
    }

    function getBase64FromDataUrl(dataUrl) {
      const commaIndex = dataUrl.indexOf(",");
      return commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
    }

    async function postJson(url, payload) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "请求失败");
      }
      return data;
    }

    async function translateTextsWithGlm(texts, target) {
      const data = await postJson("/api/translate-texts", {
        texts,
        targetLang: target,
      });
      return Array.isArray(data.translations) ? data.translations : [];
    }

    function wrapTextByWidth(text, maxWidth) {
      const chars = Array.from(String(text || ""));
      const lines = [];
      let current = "";
      for (const ch of chars) {
        const test = current + ch;
        if (!current || ctx.measureText(test).width <= maxWidth) {
          current = test;
        } else {
          lines.push(current);
          current = ch;
        }
      }
      if (current) lines.push(current);
      return lines.length ? lines : [""];
    }

    function buildTextLayout(text, boxWidth, boxHeight) {
      const family = "\"Noto Sans SC\", sans-serif";
      let fontSize = Math.max(10, Math.floor(boxHeight * 0.75));
      while (fontSize >= 10) {
        ctx.font = fontSize + "px " + family;
        const lineHeight = Math.max(12, Math.floor(fontSize * 1.2));
        const lines = wrapTextByWidth(text, boxWidth);
        if (lines.length * lineHeight <= boxHeight + 2) {
          return { fontSize, lineHeight, lines, family };
        }
        fontSize -= 1;
      }
      ctx.font = "10px " + family;
      return { fontSize: 10, lineHeight: 12, lines: wrapTextByWidth(text, boxWidth), family };
    }

    function blurAndDrawLine(line, text, sourceCanvas) {
      const { left, top, width, height } = line.bbox;
      const x = Math.max(0, left);
      const y = Math.max(0, top);
      const w = Math.max(1, width);
      const h = Math.max(1, height);

      ctx.save();
      ctx.filter = "blur(12px)";
      ctx.drawImage(sourceCanvas, x, y, w, h, x, y, w, h);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = "#0f172a";
      ctx.textBaseline = "top";
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      const padX = Math.max(2, Math.floor(w * 0.04));
      const padY = Math.max(1, Math.floor(h * 0.08));
      const textWidth = Math.max(1, w - padX * 2);
      const textHeight = Math.max(1, h - padY * 2);
      const layout = buildTextLayout(text, textWidth, textHeight);
      ctx.font = layout.fontSize + "px " + layout.family;
      const totalHeight = layout.lines.length * layout.lineHeight;
      const startY = y + padY + Math.max(0, Math.floor((textHeight - totalHeight) / 2));
      for (let i = 0; i < layout.lines.length; i++) {
        ctx.fillText(layout.lines[i], x + padX, startY + i * layout.lineHeight);
      }
      ctx.restore();
    }

    function removeBackgroundBasic() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      const base = { r: d[0], g: d[1], b: d[2] };
      const threshold = 38;
      for (let i = 0; i < d.length; i += 4) {
        const dr = Math.abs(d[i] - base.r);
        const dg = Math.abs(d[i + 1] - base.g);
        const db = Math.abs(d[i + 2] - base.b);
        if (dr + dg + db < threshold) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    featureList.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-feature]");
      if (!btn) return;
      selectedFeature = btn.dataset.feature;
      for (const el of featureList.querySelectorAll("button[data-feature]")) {
        el.classList.toggle("active", el === btn);
      }
      setStatus("当前功能：" + btn.textContent);
    });

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        currentDataUrl = await fileToDataUrl(file);
        originalImage = await fileToDisplayImage(file, currentDataUrl);
        drawImage(originalImage);
        const size = getImageSize(originalImage);
        setResult("图片已加载：" + file.name + "\\n尺寸：" + size.width + " x " + size.height);
        setStatus("图片加载完成，可执行处理。");
      } catch (err) {
        setStatus("读取图片失败：" + err.message, true);
      }
    });

    runBtn.addEventListener("click", async () => {
      if (!originalImage || !currentDataUrl) {
        setStatus("请先上传图片。", true);
        return;
      }

      try {
        setStatus("处理中，请稍候...");
        drawImage(originalImage);

        if (selectedFeature === "ocr") {
          const data = await postJson("/api/ocr", {
            imageBase64: getBase64FromDataUrl(currentDataUrl),
            languageType: "auto_detect",
          });
          const lines = data.lines || [];
          for (const line of lines) {
            ctx.strokeStyle = "rgba(0,112,243,0.85)";
            ctx.lineWidth = 2;
            ctx.strokeRect(line.bbox.left, line.bbox.top, line.bbox.width, line.bbox.height);
          }
          setResult(lines.map((line, idx) => (idx + 1) + ". " + line.text).join("\\n") || "未识别到文本");
          setStatus("OCR 完成，共识别 " + lines.length + " 行。");
          return;
        }

        if (selectedFeature === "translate") {
          const data = await postJson("/api/image-translate", {
            imageBase64: getBase64FromDataUrl(currentDataUrl),
            languageType: "auto_detect",
          });
          const lines = data.lines || [];
          const target = targetLang.value;
          const sourceTexts = lines.map((line) => line.text);
          const translated = await translateTextsWithGlm(sourceTexts, target);
          if (translated.length !== lines.length) {
            throw new Error("翻译结果数量与 OCR 行数不一致");
          }
          const sourceCanvas = document.createElement("canvas");
          sourceCanvas.width = canvas.width;
          sourceCanvas.height = canvas.height;
          sourceCanvas.getContext("2d").drawImage(canvas, 0, 0);
          for (let i = 0; i < lines.length; i++) {
            blurAndDrawLine(lines[i], translated[i], sourceCanvas);
          }
          setResult(lines.map((line, i) => line.text + " -> " + translated[i]).join("\\n") || "未识别到文本");
          setStatus("图片翻译完成（GLM-4.5-Flash），共处理 " + lines.length + " 行。");
          return;
        }

        if (selectedFeature === "convert") {
          const format = outputFormat.value;
          const convertedDataUrl = canvas.toDataURL(format, 0.92);
          const convertedImage = await dataUrlToImage(convertedDataUrl);
          drawImage(convertedImage);
          currentDataUrl = convertedDataUrl;
          setResult("格式转换完成：" + format);
          setStatus("格式转换完成。");
          return;
        }

        if (selectedFeature === "remove-bg") {
          removeBackgroundBasic();
          setResult("去背景完成（基础版：按角落背景色阈值透明化）。");
          setStatus("去背景完成（基础算法）。");
          return;
        }

        setStatus("未知功能。", true);
      } catch (err) {
        setStatus("处理失败：" + err.message, true);
      }
    });

    downloadBtn.addEventListener("click", () => {
      if (canvas.hidden) {
        setStatus("没有可下载的结果。", true);
        return;
      }
      const format = outputFormat.value;
      const ext = format.split("/")[1] || "png";
      const a = document.createElement("a");
      a.href = canvas.toDataURL(format, 0.92);
      a.download = "image-process-result." + ext;
      a.click();
      setStatus("下载已触发。", false);
    });
  </script>
</body>
</html>`;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function extractBase64(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("imageBase64 不能为空");
  }
  const raw = input.trim();
  const comma = raw.indexOf(",");
  const base64 = comma === -1 ? raw : raw.slice(comma + 1);
  return base64.replace(/\s+/g, "");
}

async function getBaiduAccessToken(env) {
  const apiKey = env.BAIDU_OCR_API_KEY;
  const secretKey = env.BAIDU_OCR_SECRET_KEY;
  if (!apiKey || !secretKey) {
    throw new Error("缺少 BAIDU_OCR_API_KEY 或 BAIDU_OCR_SECRET_KEY");
  }

  const tokenUrl =
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials` +
    `&client_id=${encodeURIComponent(apiKey)}` +
    `&client_secret=${encodeURIComponent(secretKey)}`;

  const res = await fetch(tokenUrl, { method: "POST" });
  const payload = await res.json();
  if (!res.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error_msg || "获取百度 access_token 失败");
  }
  return payload.access_token;
}

async function callBaiduDocOcr(base64Image, env, languageType = "auto_detect") {
  const token = await getBaiduAccessToken(env);
  const endpoint = `https://aip.baidubce.com/rest/2.0/ocr/v1/doc_analysis_office?access_token=${encodeURIComponent(token)}`;

  const body = new URLSearchParams();
  body.set("image", base64Image);
  body.set("language_type", languageType);
  body.set("disp_line_poly", "false");
  body.set("result_type", "big");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const payload = await res.json();
  if (!res.ok || payload.error_code) {
    throw new Error(payload.error_msg || "百度 OCR 调用失败");
  }

  return payload;
}

function normalizeLines(ocrPayload) {
  const rawLines = Array.isArray(ocrPayload.results) ? ocrPayload.results : [];
  const lines = [];

  for (let i = 0; i < rawLines.length; i++) {
    const wordsObj = rawLines[i] && rawLines[i].words ? rawLines[i].words : null;
    const text = wordsObj && typeof wordsObj.word === "string" ? wordsObj.word : "";
    const loc = wordsObj && wordsObj.words_location ? wordsObj.words_location : null;
    if (!text || !loc) continue;

    lines.push({
      id: i + 1,
      text,
      bbox: {
        left: Number(loc.left) || 0,
        top: Number(loc.top) || 0,
        width: Number(loc.width) || 0,
        height: Number(loc.height) || 0,
      },
      wordsType: rawLines[i].words_type || "unknown",
    });
  }

  return lines;
}

function parseJsonArrayFromModel(content) {
  if (typeof content !== "string") {
    throw new Error("翻译模型返回内容为空");
  }
  const trimmed = content.trim();
  const cleaned = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) {
    throw new Error("翻译模型返回格式错误，期望 JSON 数组");
  }
  return parsed.map((item) => String(item));
}

async function callGlmTranslate(texts, targetLang, env) {
  const apiKey = env.ZHIPU_API_KEY;
  if (!apiKey) {
    throw new Error("缺少 ZHIPU_API_KEY");
  }
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("texts 不能为空");
  }

  const systemPrompt =
    "You are a translation engine. Translate each input item into the target language. " +
    "Keep the order and return ONLY a valid JSON array of translated strings. " +
    "Do not add explanation.";
  const userPrompt =
    "target_lang: " + targetLang + "\n" +
    "texts: " + JSON.stringify(texts);

  const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + apiKey,
    },
    body: JSON.stringify({
      model: "glm-4.5-flash",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  const payload = await res.json();
  if (!res.ok) {
    const errMsg = payload.error && payload.error.message ? payload.error.message : "GLM 翻译请求失败";
    throw new Error(errMsg);
  }
  const content =
    payload &&
    payload.choices &&
    payload.choices[0] &&
    payload.choices[0].message &&
    payload.choices[0].message.content
      ? payload.choices[0].message.content
      : "";

  const translations = parseJsonArrayFromModel(content);
  if (translations.length !== texts.length) {
    throw new Error("GLM 翻译返回条目数量不匹配");
  }
  return translations;
}

async function handleOcr(request, env) {
  const body = await request.json();
  const base64Image = extractBase64(body.imageBase64);
  const languageType = typeof body.languageType === "string" ? body.languageType : "auto_detect";

  const ocrPayload = await callBaiduDocOcr(base64Image, env, languageType);
  const lines = normalizeLines(ocrPayload);

  return json({
    ok: true,
    lines,
    resultsNum: ocrPayload.results_num || lines.length,
    logId: ocrPayload.log_id || null,
  });
}

async function handleTranslateTexts(request, env) {
  const body = await request.json();
  const targetLang = typeof body.targetLang === "string" && body.targetLang.trim() ? body.targetLang.trim() : "en";
  const texts = Array.isArray(body.texts) ? body.texts.map((item) => String(item || "")) : [];
  const translations = await callGlmTranslate(texts, targetLang, env);
  return json({ ok: true, translations, model: "glm-4.5-flash" });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HTML, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/ocr") {
      try {
        return await handleOcr(request, env);
      } catch (error) {
        return json({ ok: false, error: error.message || "OCR 请求失败" }, 400);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/image-translate") {
      try {
        return await handleOcr(request, env);
      } catch (error) {
        return json({ ok: false, error: error.message || "图片翻译预处理失败" }, 400);
      }
    }

    if (request.method === "POST" && url.pathname === "/api/translate-texts") {
      try {
        return await handleTranslateTexts(request, env);
      } catch (error) {
        return json({ ok: false, error: error.message || "文本翻译失败" }, 400);
      }
    }

    return json({ ok: false, error: "Not Found" }, 404);
  },
};
