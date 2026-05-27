import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const areasCsvPath = path.join(root, "data", "areas.csv");
const servicesPath = path.join(root, "data", "services.json");
const templatesDir = path.join(root, "templates");
const distDir = path.join(root, "dist");

const SITE_INFO = {
  brandName: "우리동네전문가",
  phone: "1668-1321",
  email: "kim01057765882@kakao.com",
  siteUrl: "https://preeminent-fenglisu-4251ae.netlify.app"
};

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
  });
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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
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
    fs.copyFileSync(
      path.join(root, file),
      path.join(distDir, file)
    );
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function makeSitemap(urls) {
  const now = new Date().toISOString();

  const xmlUrls = urls
    .map((url) => {
      const safeUrl = escapeXml(encodeURI(url));

      return `  <url>
    <loc>${safeUrl}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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

  for (const service of services) {
    const templatePath = path.join(templatesDir, service.template);
    const template = fs.readFileSync(templatePath, "utf8");

    for (const area of areas) {
      const html = replaceAllText(template, area, service);
      const outDir = path.join(distDir, service.urlPrefix, area.slug);

      ensureDir(outDir);
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");

      sitemapUrls.push(
        `${SITE_INFO.siteUrl}/${service.urlPrefix}/${area.slug}/`
      );
    }
  }

  const indexPath = path.join(templatesDir, "index.html");

  if (fs.existsSync(indexPath)) {
    const indexTemplate = fs.readFileSync(indexPath, "utf8");
    const indexHtml = replaceCommonText(indexTemplate);

    fs.writeFileSync(
      path.join(distDir, "index.html"),
      indexHtml,
      "utf8"
    );
  }

  const successTemplate = fs.readFileSync(
    path.join(templatesDir, "success.html"),
    "utf8"
  );

  const successHtml = replaceCommonText(successTemplate);

  const successDir = path.join(distDir, "success");
  ensureDir(successDir);

  fs.writeFileSync(
    path.join(successDir, "index.html"),
    successHtml,
    "utf8"
  );

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

  copyAssets();
  copyPublicFiles();
  copyGoogleVerificationFiles();

  fs.writeFileSync(
    path.join(distDir, "sitemap.xml"),
    makeSitemap(sitemapUrls),
    "utf8"
  );

  fs.writeFileSync(
    path.join(distDir, "robots.txt"),
    makeRobots(),
    "utf8"
  );

  console.log(
    `생성 완료: 지역 ${areas.length}개 × 서비스 ${services.length}개 = ${
      areas.length * services.length
    }페이지`
  );

  console.log(`sitemap.xml 생성 완료: ${sitemapUrls.length}개 URL`);
  console.log("robots.txt 생성 완료");
  console.log("Google verification file 복사 완료");
  console.log("public 폴더 파일 복사 완료");
}

build();
