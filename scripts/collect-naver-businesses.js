import fs from "node:fs";
import path from "node:path";
import { removeHtmlTags, makeBusinessKey } from "./utils.js";

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
  console.log("NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 필요합니다.");
  process.exit(1);
}

const root = process.cwd();
const areasPath = path.join(root, "data", "areas.csv");
const servicesPath = path.join(root, "data", "services.json");
const outputDir = path.join(root, "data", "businesses");

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  const [headerLine, ...lines] = text.split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.trim());

  return lines.map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
  });
}

async function searchNaverLocal(query) {
  const url = new URL("https://openapi.naver.com/v1/search/local.json");
  url.searchParams.set("query", query);
  url.searchParams.set("display", "5");
  url.searchParams.set("start", "1");
  url.searchParams.set("sort", "random");

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`Naver API Error ${res.status}: ${bodyText}`);
  }

  try {
    return await res.json();
  } catch (error) {
    throw new Error(`Naver API JSON parse error: ${error.message}`);
  }
}

function isNearby(item, area) {
  const text = `${item.address || ""} ${item.roadAddress || ""}`;
  return text.includes(area.dong) || text.includes(area.sigungu) || text.includes(area.sido);
}

async function collect() {
  fs.mkdirSync(outputDir, { recursive: true });

  const areas = readCsv(areasPath);
  const services = JSON.parse(fs.readFileSync(servicesPath, "utf8"));

  for (const service of services) {
    const serviceResult = [];

    for (const area of areas) {
      const collected = new Map();

      for (const keyword of service.keywords) {
        const queries = [
          `${area.sido} ${area.sigungu} ${area.dong} ${keyword}`,
          `${area.sido} ${area.sigungu} ${keyword}`
        ];

        for (const query of queries) {
          const data = await searchNaverLocal(query);

          for (const item of data.items || []) {
            if (!isNearby(item, area)) continue;

            const key = makeBusinessKey(item);
            if (collected.has(key)) continue;

            collected.set(key, {
              name: removeHtmlTags(item.title),
              category: item.category,
              description: removeHtmlTags(item.description),
              address: item.address,
              roadAddress: item.roadAddress,
              link: item.link,
              mapx: item.mapx,
              mapy: item.mapy,
              keyword
            });
          }
        }
      }

      serviceResult.push({
        area,
        nearbyCompanies: Array.from(collected.values()).slice(0, 10)
      });

      console.log(`${service.name} / ${area.sido} ${area.sigungu} ${area.dong} 수집 완료`);
    }

    fs.writeFileSync(
      path.join(outputDir, `${service.type}.json`),
      JSON.stringify(serviceResult, null, 2),
      "utf8"
    );
  }

  console.log("네이버 업체 수집 완료");
}

collect();
