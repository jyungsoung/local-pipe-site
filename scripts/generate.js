import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const areasCsvPath = path.join(root, "data", "areas.csv");
const servicesPath = path.join(root, "data", "services.json");
const templatesDir = path.join(root, "templates");
const distDir = path.join(root, "dist");

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
  });
}

function replaceAllText(template, area, service) {
  return template
    .replaceAll("[시도명]", area.sido)
    .replaceAll("[구명]", area.sigungu)
    .replaceAll("[동명]", area.dong)
    .replaceAll("[지역슬러그]", area.slug)
    .replaceAll("[서비스명]", service.name)
    .replaceAll("[서비스타입]", service.type)
    .replaceAll("[팜플렛이미지]", `../../assets/${service.pamphlet}`)
    .replaceAll("[브랜드명]", "우리동네전문가")
    .replaceAll("[전화번호]", "1668-1321")
    .replaceAll("[이메일]", "kim01057765882@kakao.com");
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

function build() {
  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(distDir);

  const areas = readCsv(areasCsvPath);
  const services = JSON.parse(fs.readFileSync(servicesPath, "utf8"));

  for (const service of services) {
    const templatePath = path.join(templatesDir, service.template);
    const template = fs.readFileSync(templatePath, "utf8");

    for (const area of areas) {
      const html = replaceAllText(template, area, service);
      const outDir = path.join(distDir, service.urlPrefix, area.slug);
      ensureDir(outDir);
      fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
    }
  }

  const successTemplate = fs.readFileSync(path.join(templatesDir, "success.html"), "utf8");
  const successDir = path.join(distDir, "success");
  ensureDir(successDir);
  fs.writeFileSync(path.join(successDir, "index.html"), successTemplate, "utf8");

  copyAssets();

  console.log(`생성 완료: 지역 ${areas.length}개 × 서비스 ${services.length}개 = ${areas.length * services.length}페이지`);
}

build();
