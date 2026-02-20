export const APP_JS = `const fileInput = document.getElementById("fileInput");
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

function setStatus(text, warn) {
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

function fileToDataUrl(file) {
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
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "请求失败");
  }
  return data;
}

async function translateTextsWithGlm(texts, target) {
  const data = await postJson("/api/translate-texts", { texts, targetLang: target });
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
  const family = '"Noto Sans SC", sans-serif';
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
  const left = line.bbox.left;
  const top = line.bbox.top;
  const width = line.bbox.width;
  const height = line.bbox.height;
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
  for (let i = 0; i < layout.lines.length; i += 1) {
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
  setStatus("当前功能：" + btn.textContent, false);
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
    setStatus("图片加载完成，可执行处理。", false);
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
    setStatus("处理中，请稍候...", false);
    drawImage(originalImage);

    if (selectedFeature === "ocr") {
      const data = await postJson("/api/ocr", {
        imageBase64: getBase64FromDataUrl(currentDataUrl),
        languageType: "auto_detect"
      });
      const lines = data.lines || [];
      for (const line of lines) {
        ctx.strokeStyle = "rgba(0,112,243,0.85)";
        ctx.lineWidth = 2;
        ctx.strokeRect(line.bbox.left, line.bbox.top, line.bbox.width, line.bbox.height);
      }
      setResult(lines.map((line, idx) => (idx + 1) + ". " + line.text).join("\\n") || "未识别到文本");
      setStatus("OCR 完成，共识别 " + lines.length + " 行。", false);
      return;
    }

    if (selectedFeature === "translate") {
      const data = await postJson("/api/image-translate", {
        imageBase64: getBase64FromDataUrl(currentDataUrl),
        languageType: "auto_detect"
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

      for (let i = 0; i < lines.length; i += 1) {
        blurAndDrawLine(lines[i], translated[i], sourceCanvas);
      }
      setResult(lines.map((line, i) => line.text + " -> " + translated[i]).join("\\n") || "未识别到文本");
      setStatus("图片翻译完成（GLM-4.5-Flash），共处理 " + lines.length + " 行。", false);
      return;
    }

    if (selectedFeature === "convert") {
      const format = outputFormat.value;
      const convertedDataUrl = canvas.toDataURL(format, 0.92);
      const convertedImage = await dataUrlToImage(convertedDataUrl);
      drawImage(convertedImage);
      currentDataUrl = convertedDataUrl;
      setResult("格式转换完成：" + format);
      setStatus("格式转换完成。", false);
      return;
    }

    if (selectedFeature === "remove-bg") {
      removeBackgroundBasic();
      setResult("去背景完成（基础版：按角落背景色阈值透明化）。");
      setStatus("去背景完成（基础算法）。", false);
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
`;
