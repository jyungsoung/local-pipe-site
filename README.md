# local-pipe-site

전국 행정동 기반 지역 상담업체 페이지 자동 생성 프로젝트입니다.

큰틀은 2개입니다.

1. `hasugu` - 하수구막힘
2. `nusu` - 누수탐지

## 기본 흐름

```txt
data/areas.csv
전국 행정동 데이터

data/services.json
하수구막힘 / 누수탐지 서비스 설정

templates/
각 서비스별 HTML 템플릿

scripts/generate.js
지역 × 서비스 조합으로 dist 폴더에 HTML 자동 생성

dist/
Netlify에 배포되는 최종 정적 파일
```

## 처음 시작

```bash
npm install
npm run build
```

## Netlify 설정

Build command:

```bash
npm run build
```

Publish directory:

```txt
dist
```
