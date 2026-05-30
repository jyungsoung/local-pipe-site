import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const areasCsvPath = path.join(root, "data", "areas.csv");
const servicesPath = path.join(root, "data", "services.json");
const templatesDir = path.join(root, "templates");
const distDir = path.join(root, "dist");

const SITE_INFO = {
  brandName: "응급배관119",
  phone: "1668-1321",
  email: "kim01057765882@kakao.com",
  siteUrl: "https://preeminent-fenglisu-4251ae.netlify.app"
};

const CATEGORY_CONTENT = {
  hasugu: {
    label: "하수",
    title: "서울·경기·인천 하수구막힘, 싱크대막힘·변기막힘 상담 | 응급배관119",
    description:
      "서울·경기·인천 하수구막힘 상담. 싱크대막힘, 변기막힘, 배수구역류 확인.",
    h1: "서울·경기·인천 하수구막힘 상담",
    subtitle: "물이 안 내려가는 모든 증상을 확인합니다.",
    image: "hasugu-pamphlet.png",
    intro: [
      "싱크대 물이 안 내려가거나, 변기 물이 차오르거나, 화장실·세탁실 배수구에서 냄새와 역류가 생긴다면 하수 배관 내부 막힘을 확인해야 합니다.",
      "응급배관119는 하수구막힘, 싱크대막힘, 변기막힘, 배수구막힘, 맨홀막힘, 오수관역류처럼 물이 안 내려가는 모든 하수 문제를 현장 상황에 맞게 확인합니다.",
      "증상에 따라 전동 스프링 장비, 샤프트 장비, 배관내시경, 고압세척 장비 등을 활용해 막힘 원인을 확인하고 필요한 작업을 안내드립니다."
    ],
    symptoms: [
      "싱크대 물이 안 내려가는 경우",
      "변기 물이 차오르거나 역류하는 경우",
      "화장실 배수구에서 냄새가 올라오는 경우",
      "세탁실 배수구에서 물이 역류하는 경우",
      "맨홀이나 오수관에 물이 차오르는 경우",
      "여러 배수구가 동시에 막히는 경우"
    ],
    keywords: [
      "하수구막힘",
      "싱크대막힘",
      "변기막힘",
      "배수구막힘",
      "맨홀막힘",
      "오수관역류",
      "고압세척",
      "배관내시경"
    ],
    closing:
      "서울·경기·인천 하수구막힘, 싱크대막힘, 변기막힘, 배수구역류 문제는 증상 사진이나 영상을 먼저 보내주시면 확인 방향을 안내드릴 수 있습니다."
  },

  nusu: {
    label: "누수",
    title: "서울·경기·인천 누수탐지, 아래층누수·난방배관누수 상담 | 응급배관119",
    description:
      "서울·경기·인천 누수탐지 상담. 아래층누수, 천장누수, 난방배관누수 확인.",
    h1: "서울·경기·인천 누수탐지 상담",
    subtitle: "물이 새어나오는 모든 증상을 확인합니다.",
    image: "nusu-pamphlet.png",
    intro: [
      "아래층 천장에 물자국이 생기거나, 세탁실·화장실 주변에서 물이 새거나, 난방배관누수가 의심된다면 눈에 보이는 위치만 보고 원인을 단정하기 어렵습니다.",
      "응급배관119는 누수탐지, 아래층누수, 천장누수, 세탁실누수, 화장실누수, 난방배관누수처럼 물이 새어나오는 모든 누수 문제를 현장 상황에 맞게 확인합니다.",
      "현장 상태에 따라 공압검사, 청음탐지, 가스탐지, UV 형광검사 등을 활용해 누수 가능성을 좁혀가며 원인을 확인합니다."
    ],
    symptoms: [
      "아래층에서 누수 연락을 받은 경우",
      "천장에 물자국이 생긴 경우",
      "세탁실이나 화장실 주변에 물이 고이는 경우",
      "보일러 압력이 떨어지는 경우",
      "난방배관누수가 의심되는 경우",
      "오래 해결되지 않은 누수가 반복되는 경우"
    ],
    keywords: [
      "누수탐지",
      "아래층누수",
      "천장누수",
      "세탁실누수",
      "화장실누수",
      "난방배관누수",
      "공압검사",
      "청음탐지",
      "가스탐지",
      "UV형광검사"
    ],
    closing:
      "서울·경기·인천 누수탐지, 아래층누수, 천장누수, 난방배관누수 문제는 증상 사진이나 영상을 먼저 보내주시면 확인 방향을 안내드릴 수 있습니다."
  }
};

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();

  if (!text) {
    return [];
  }

  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines
    .filter((line) => line.trim())
    .map((line) => {
      const values = line.split(",").map((v) => v.trim());
      return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
    });
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizePrefix(prefix) {
  return String(prefix || "").replace(/^\/+|\/+$/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function replaceCommonText(template) {
  return template
    .replaceAll("[브랜드명]", SITE_INFO.brandName)
    .replaceAll("[전화번호]", SITE_INFO.phone)
    .replaceAll("[이메일]", SITE_INFO.email);
}

function replaceAllText(template, area, service) {
  return replaceCommonText(template)
    .replaceAll("[시도명]", area.sido)
    .replaceAll("[구명]", area.sigungu)
    .replaceAll("[동명]", area.dong)
    .replaceAll("[지역슬러그]", area.slug)
    .replaceAll("[서비스명]", service.name)
    .replaceAll("[서비스타입]", service.type)
    .replaceAll("[팜플렛이미지]", `../../assets/${service.pamphlet}`);
}

function copyAssets() {
  const src = path.join(root, "assets");
  const dest = path.join(distDir, "assets");

  if (!fs.existsSync(src)) return;

  ensureDir(dest);

  for (const file of fs.readdirSync(src)) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

function copyPublicFiles() {
  const src = path.join(root, "public");

  if (!fs.existsSync(src)) return;

  fs.cpSync(src, distDir, { recursive: true });
}

function copyGoogleVerificationFiles() {
  const files = fs.readdirSync(root).filter((file) => {
    return file.startsWith("google") && file.endsWith(".html");
  });

  for (const file of files) {
    fs.copyFileSync(path.join(root, file), path.join(distDir, file));
  }
}

function getAreaName(area) {
  return [area.sido, area.sigungu, area.dong].filter(Boolean).join(" ");
}

function getAreaShortName(area) {
  return [area.sigungu, area.dong].filter(Boolean).join(" ");
}

function renderAreaLinks(areas, prefix, label, limit = 120) {
  const selectedAreas = areas.slice(0, limit);

  if (selectedAreas.length === 0) {
    return "";
  }

  return `
    <section class="section">
      <h2>주요 지역 ${label} 상담 페이지</h2>
      <p class="muted">
        아래 지역 외에도 서울·경기·인천 주요 지역 상담이 가능합니다.
      </p>
      <div class="area-grid">
        ${selectedAreas
          .map((area) => {
            const areaName = escapeHtml(getAreaShortName(area));
            const href = `/${prefix}/${area.slug}/`;

            return `<a href="${href}">${areaName} ${escapeHtml(label)}</a>`;
          })
          .join("\n")}
      </div>
    </section>
  `;
}

function renderBasePage({ title, description, canonical, body }) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:site_name" content="${escapeHtml(SITE_INFO.brandName)}" />

  <style>
    :root {
      --blue: #0b5ed7;
      --dark: #111827;
      --gray: #6b7280;
      --light: #f3f6fb;
      --line: #e5e7eb;
      --green: #138a36;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans KR", "Segoe UI", sans-serif;
      color: var(--dark);
      line-height: 1.65;
      background: #ffffff;
      padding-bottom: 82px;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .topbar {
      background: var(--dark);
      color: #fff;
      padding: 10px 20px;
      font-size: 14px;
    }

    .header {
      border-bottom: 1px solid var(--line);
      background: #fff;
    }

    .header-inner {
      max-width: 1080px;
      margin: 0 auto;
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand {
      font-weight: 800;
      font-size: 24px;
      color: var(--blue);
    }

    .nav {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 15px;
      color: #374151;
    }

    .nav a {
      padding: 8px 12px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: #fff;
    }

    .hero {
      background: linear-gradient(135deg, #0b5ed7, #063b85);
      color: #fff;
      padding: 56px 20px;
    }

    .hero-inner {
      max-width: 1080px;
      margin: 0 auto;
    }

    .hero h1 {
      margin: 0 0 14px;
      font-size: clamp(30px, 5vw, 52px);
      line-height: 1.18;
      letter-spacing: -0.04em;
    }

    .hero p {
      margin: 8px 0;
      max-width: 760px;
      font-size: 18px;
    }

    .hero-buttons {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 13px 18px;
      border-radius: 10px;
      font-weight: 800;
      background: #fff;
      color: var(--blue);
    }

    .button.dark {
      background: #111827;
      color: #fff;
    }

    .container {
      max-width: 1080px;
      margin: 0 auto;
      padding: 34px 20px;
    }

    .section {
      margin: 0 0 34px;
      padding: 28px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: #fff;
    }

    .section.light {
      background: var(--light);
    }

    h2 {
      margin: 0 0 14px;
      font-size: 26px;
      letter-spacing: -0.03em;
    }

    h3 {
      margin: 0 0 10px;
      font-size: 20px;
    }

    .muted {
      color: var(--gray);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .card {
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 22px;
      background: #fff;
    }

    .card strong {
      display: block;
      margin-bottom: 8px;
      font-size: 20px;
      color: var(--blue);
    }

    .list {
      padding-left: 20px;
      margin: 12px 0 0;
    }

    .list li {
      margin: 7px 0;
    }

    .keyword-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }

    .keyword {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: #eef4ff;
      color: #12489b;
      font-size: 14px;
      font-weight: 700;
    }

    .area-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 18px;
    }

    .area-grid a {
      display: block;
      border: 1px solid var(--line);
      border-radius: 10px;
      padding: 10px 12px;
      background: #fff;
      font-size: 14px;
    }

    .pamphlet {
      width: 100%;
      max-width: 720px;
      height: auto;
      border-radius: 18px;
      border: 1px solid var(--line);
      display: block;
      margin: 18px auto 0;
    }

    .fixed-call {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 30;
      background: #111827;
      padding: 12px 16px;
      box-shadow: 0 -8px 30px rgba(0,0,0,0.18);
    }

    .fixed-call-inner {
      max-width: 1080px;
      margin: 0 auto;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
      color: #fff;
    }

    .fixed-call a {
      background: #16a34a;
      color: #fff;
      padding: 12px 18px;
      border-radius: 10px;
      font-weight: 900;
      white-space: nowrap;
    }

    @media (max-width: 760px) {
      .header-inner {
        display: block;
      }

      .nav {
        margin-top: 12px;
      }

      .grid,
      .area-grid {
        grid-template-columns: 1fr;
      }

      .section {
        padding: 22px;
      }

      .fixed-call-inner {
        display: block;
      }

      .fixed-call a {
        display: block;
        margin-top: 8px;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="topbar">서울·경기·인천 하수·누수 상담 | 대표번호 ${escapeHtml(SITE_INFO.phone)}</div>

  <header class="header">
    <div class="header-inner">
      <a class="brand" href="/">${escapeHtml(SITE_INFO.brandName)}</a>
      <nav class="nav">
        <a href="/hasugu/">하수 상담</a>
        <a href="/nusu/">누수 상담</a>
        <a href="tel:${escapeHtml(SITE_INFO.phone)}">전화 ${escapeHtml(SITE_INFO.phone)}</a>
      </nav>
    </div>
  </header>

  ${body}

  <div class="fixed-call">
    <div class="fixed-call-inner">
      <div>
        <strong>${escapeHtml(SITE_INFO.brandName)}</strong>
        <span>증상 사진·영상 상담 가능</span>
      </div>
      <a href="tel:${escapeHtml(SITE_INFO.phone)}">전화 상담 ${escapeHtml(SITE_INFO.phone)}</a>
    </div>
  </div>
</body>
</html>`;
}

function renderHomeIndex(areas) {
  const title = "24시간 상담가능 | 서울·경기·인천 하수구막힘·누수탐지 상담";
  const description =
    "서울·경기·인천 하수구막힘·누수탐지 상담. 변기막힘, 싱크대막힘, 아래층누수,누수탐지, 확인.";

  const body = `
    <section class="hero">
      <div class="hero-inner">
        <h1>하수는 물이 안 내려가는 문제,<br />누수는 물이 새는 문제부터 확인합니다.</h1>
        <p>
          하수구막힘, 싱크대막힘, 변기막힘, 배수구역류부터
          누수탐지, 아래층누수, 천장누수, 난방배관누수까지 현장 상황에 맞게 상담합니다.
        </p>
        <p><strong>${escapeHtml(SITE_INFO.brandName)} 대표번호 ${escapeHtml(SITE_INFO.phone)}</strong></p>
        <div class="hero-buttons">
          <a class="button" href="/hasugu/">하수 문제 보기</a>
          <a class="button" href="/nusu/">누수 문제 보기</a>
          <a class="button dark" href="tel:${escapeHtml(SITE_INFO.phone)}">바로 전화하기</a>
        </div>
      </div>
    </section>

    <main class="container">
      <section class="section">
        <h2>응급배관119 상담 분야</h2>
        <div class="grid">
          <a class="card" href="/hasugu/">
            <strong>하수 상담</strong>
            <p>
              물이 안 내려가는 모든 증상입니다.
              하수구막힘, 싱크대막힘, 변기막힘, 배수구막힘, 맨홀막힘, 오수관역류를 확인합니다.
            </p>
          </a>

          <a class="card" href="/nusu/">
            <strong>누수 상담</strong>
            <p>
              물이 새어나오는 모든 증상입니다.
              누수탐지, 아래층누수, 천장누수, 세탁실누수, 화장실누수, 난방배관누수를 확인합니다.
            </p>
          </a>
        </div>
      </section>

      <section class="section light">
        <h2>문의 전 보내주시면 좋은 사진</h2>
        <ul class="list">
          <li>물이 고인 배수구 또는 싱크대 하부 사진</li>
          <li>변기 물이 차오른 상태 사진</li>
          <li>맨홀이나 바닥 배수구 역류 사진</li>
          <li>천장 물자국 또는 아래층 누수 부위 사진</li>
          <li>보일러 배관, 세탁실, 화장실 주변 사진</li>
        </ul>
      </section>

      ${renderAreaLinks(areas, "hasugu", "하수구막힘", 60)}
      ${renderAreaLinks(areas, "nusu", "누수탐지", 60)}
    </main>
  `;

  return renderBasePage({
    title,
    description,
    canonical: `${SITE_INFO.siteUrl}/`,
    body
  });
}

function renderServiceIndex(prefix, areas) {
  const content = CATEGORY_CONTENT[prefix];

  if (!content) {
    throw new Error(`대표 페이지 콘텐츠가 없습니다: ${prefix}`);
  }

  const paragraphsHtml = content.intro
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");

  const symptomsHtml = content.symptoms
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");

  const keywordsHtml = content.keywords
    .map((keyword) => `<span class="keyword">${escapeHtml(keyword)}</span>`)
    .join("\n");

  const body = `
    <section class="hero">
      <div class="hero-inner">
        <h1>${escapeHtml(content.h1)}</h1>
        <p>${escapeHtml(content.subtitle)}</p>
        <p><strong>${escapeHtml(SITE_INFO.brandName)} 대표번호 ${escapeHtml(SITE_INFO.phone)}</strong></p>
        <div class="hero-buttons">
          <a class="button" href="tel:${escapeHtml(SITE_INFO.phone)}">전화 상담하기</a>
          <a class="button dark" href="/">메인으로 이동</a>
        </div>
      </div>
    </section>

    <main class="container">
      <section class="section">
        <h2>${escapeHtml(content.label)} 문제는 이렇게 확인합니다</h2>
        ${paragraphsHtml}
        <div class="keyword-wrap">
          ${keywordsHtml}
        </div>
      </section>

      <section class="section light">
        <h2>주요 증상</h2>
        <ul class="list">
          ${symptomsHtml}
        </ul>
      </section>

      <section class="section">
        <h2>작업 전 확인이 중요한 이유</h2>
        <p>
          증상만 보고 원인을 단정하면 같은 문제가 반복될 수 있습니다.
          현장에서는 배관 구조, 물 흐름, 압력 상태, 냄새와 역류 여부, 물샘 위치를 함께 확인해야 합니다.
        </p>
        <p>
          ${escapeHtml(content.closing)}
        </p>
        <p><strong>${escapeHtml(SITE_INFO.brandName)} 대표번호 ${escapeHtml(SITE_INFO.phone)}</strong></p>
        <img
          class="pamphlet"
          src="../assets/${escapeHtml(content.image)}"
          alt="${escapeHtml(SITE_INFO.brandName)} ${escapeHtml(content.label)} 상담 안내"
        />
      </section>

      ${renderAreaLinks(areas, prefix, content.label === "하수" ? "하수구막힘" : "누수탐지", 120)}
    </main>
  `;

  return renderBasePage({
    title: content.title,
    description: content.description,
    canonical: `${SITE_INFO.siteUrl}/${prefix}/`,
    body
  });
}

function makeSitemap(urls) {
  const now = new Date().toISOString();

  const uniqueUrls = [...new Set(urls)];

  const xmlUrls = uniqueUrls
    .map((url) => {
      const safeUrl = escapeXml(encodeURI(url));

      let priority = "0.8";

      if (url === `${SITE_INFO.siteUrl}/`) {
        priority = "1.0";
      } else if (
        url === `${SITE_INFO.siteUrl}/hasugu/` ||
        url === `${SITE_INFO.siteUrl}/nusu/`
      ) {
        priority = "0.9";
      }

      return `  <url>
    <loc>${safeUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;
}

function makeRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_INFO.siteUrl}/sitemap.xml
`;
}

function build() {
  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(distDir);

  const areas = readCsv(areasCsvPath);
  const services = JSON.parse(fs.readFileSync(servicesPath, "utf8"));

  const sitemapUrls = [];

  copyAssets();
  copyPublicFiles();
  copyGoogleVerificationFiles();

  fs.writeFileSync(
    path.join(distDir, "index.html"),
    renderHomeIndex(areas),
    "utf8"
  );

  sitemapUrls.push(`${SITE_INFO.siteUrl}/`);

  for (const service of services) {
    const prefix = normalizePrefix(service.urlPrefix);

    if (CATEGORY_CONTENT[prefix]) {
      const serviceDir = path.join(distDir, prefix);
      ensureDir(serviceDir);

      fs.writeFileSync(
        path.join(serviceDir, "index.html"),
        renderServiceIndex(prefix, areas),
        "utf8"
      );

      sitemapUrls.push(`${SITE_INFO.siteUrl}/${prefix}/`);
    }
  }

  for (const service of services) {
    const prefix = normalizePrefix(service.urlPrefix);
    const templatePath = path.join(templatesDir, service.template);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`템플릿 파일을 찾을 수 없습니다: ${templatePath}`);
    }

    const template = fs.readFileSync(templatePath, "utf8");

    for (const area of areas) {
      if (!area.slug) {
        console.warn(`slug가 없는 지역을 건너뜁니다: ${getAreaName(area)}`);
        continue;
      }

      const html = replaceAllText(template, area, service);
      const outDir = path.join(distDir, prefix, area.slug);

      ensureDir(outDir);

      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");

      sitemapUrls.push(`${SITE_INFO.siteUrl}/${prefix}/${area.slug}/`);
    }
  }

  const successPath = path.join(templatesDir, "success.html");

  if (fs.existsSync(successPath)) {
    const successTemplate = fs.readFileSync(successPath, "utf8");
    const successHtml = replaceCommonText(successTemplate);

    const successDir = path.join(distDir, "success");
    ensureDir(successDir);

    fs.writeFileSync(path.join(successDir, "index.html"), successHtml, "utf8");
  }

  const formsDetectPath = path.join(templatesDir, "forms-detect.html");

  if (fs.existsSync(formsDetectPath)) {
    const formsDetectTemplate = fs.readFileSync(formsDetectPath, "utf8");
    const formsDetectHtml = replaceCommonText(formsDetectTemplate);

    fs.writeFileSync(
      path.join(distDir, "forms-detect.html"),
      formsDetectHtml,
      "utf8"
    );
  }

  fs.writeFileSync(
    path.join(distDir, "sitemap.xml"),
    makeSitemap(sitemapUrls),
    "utf8"
  );

  fs.writeFileSync(path.join(distDir, "robots.txt"), makeRobots(), "utf8");

  console.log(
    `생성 완료: 지역 ${areas.length}개 × 서비스 ${services.length}개 = ${
      areas.length * services.length
    }개 지역 페이지`
  );

  console.log("대표 페이지 생성 완료: /, /hasugu/, /nusu/");
  console.log(`sitemap.xml 생성 완료: ${new Set(sitemapUrls).size}개 URL`);
  console.log("robots.txt 생성 완료");
  console.log("assets/public/Google verification file 복사 완료");
}

build();
