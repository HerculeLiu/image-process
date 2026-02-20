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
    "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials" +
    "&client_id=" + encodeURIComponent(apiKey) +
    "&client_secret=" + encodeURIComponent(secretKey);

  const res = await fetch(tokenUrl, { method: "POST" });
  const payload = await res.json();
  if (!res.ok || !payload.access_token) {
    throw new Error(payload.error_description || payload.error_msg || "获取百度 access_token 失败");
  }
  return payload.access_token;
}

async function callBaiduDocOcr(base64Image, env, languageType) {
  const token = await getBaiduAccessToken(env);
  const endpoint =
    "https://aip.baidubce.com/rest/2.0/ocr/v1/doc_analysis_office?access_token=" +
    encodeURIComponent(token);

  const body = new URLSearchParams();
  body.set("image", base64Image);
  body.set("language_type", languageType || "auto_detect");
  body.set("disp_line_poly", "false");
  body.set("result_type", "big");

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: body.toString()
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

  for (let i = 0; i < rawLines.length; i += 1) {
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
        height: Number(loc.height) || 0
      },
      wordsType: rawLines[i].words_type || "unknown"
    });
  }

  return lines;
}

function parseJsonArrayFromModel(content) {
  if (typeof content !== "string") {
    throw new Error("翻译模型返回内容为空");
  }
  const cleaned = content.trim()
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
      authorization: "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: "glm-4.5-flash",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  const payload = await res.json();
  if (!res.ok) {
    const errMsg = payload.error && payload.error.message ? payload.error.message : "GLM 翻译请求失败";
    throw new Error(errMsg);
  }

  const content =
    payload && payload.choices && payload.choices[0] && payload.choices[0].message
      ? payload.choices[0].message.content
      : "";

  const translations = parseJsonArrayFromModel(content);
  if (translations.length !== texts.length) {
    throw new Error("GLM 翻译返回条目数量不匹配");
  }
  return translations;
}

export async function ocrFromRequest(request, env) {
  const body = await request.json();
  const base64Image = extractBase64(body.imageBase64);
  const languageType = typeof body.languageType === "string" ? body.languageType : "auto_detect";

  const ocrPayload = await callBaiduDocOcr(base64Image, env, languageType);
  const lines = normalizeLines(ocrPayload);
  return {
    ok: true,
    lines,
    resultsNum: ocrPayload.results_num || lines.length,
    logId: ocrPayload.log_id || null
  };
}

export async function translateTextsFromRequest(request, env) {
  const body = await request.json();
  const targetLang = typeof body.targetLang === "string" && body.targetLang.trim() ? body.targetLang.trim() : "en";
  const texts = Array.isArray(body.texts) ? body.texts.map((item) => String(item || "")) : [];
  const translations = await callGlmTranslate(texts, targetLang, env);
  return {
    ok: true,
    translations,
    model: "glm-4.5-flash"
  };
}
