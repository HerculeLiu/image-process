export const APP_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Image Process Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/static/app.css" />
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
        <div class="canvas-wrap">
          <div id="placeholder" class="placeholder">上传图片后在这里预览处理结果</div>
          <canvas id="canvas" hidden></canvas>
        </div>
        <div class="result" id="resultBox">还没有结果。</div>
      </section>
    </section>
  </main>

  <script type="module" src="/static/app.js"></script>
</body>
</html>`;
