# 입양의날 인터랙티브 퍼즐 — 프로토타입

관객이 모바일에서 메시지를 보내면, 무대 스크린에서 키비주얼 이미지가 한 조각씩 채워지는 실시간 퍼포먼스 시스템입니다.

## 구성

```
[관객 모바일]  ──POST──▶  [Node.js + Socket.io]  ──emit──▶  [무대 스크린(브라우저)]
   /mobile.html             server/index.js                     /display.html
```

- 메시지 큐: 서버는 들어온 메시지를 큐에 쌓고, `REVEAL_INTERVAL_MS`(기본 2.5초) 마다 한 건씩 꺼내 한 조각을 공개합니다.
- 조각 순서: `SHUFFLE_SEED`로 시드 고정된 셔플 순서를 사용합니다(재현 가능).
- 가득 찬 후: 추가 메시지는 `gallery-message` 이벤트로 흘러서 토스트로만 표시됩니다.

## 실행

```bash
npm install
npm start
# 또는 개발 모드(파일 변경 시 자동 재시작)
npm run dev
```

기본 URL:
- 모바일 입력 폼: http://localhost:3000/mobile.html
- 무대 디스플레이: http://localhost:3000/display.html

## 환경변수

| 변수 | 기본값 | 설명 |
|---|---|---|
| `PORT` | `3000` | 서버 포트 |
| `GRID_COLS` | `20` | 가로 조각 수 |
| `GRID_ROWS` | `12` | 세로 조각 수 |
| `KEY_VISUAL` | `/assets/keyvisual.svg` | 디스플레이가 로드할 이미지 URL |
| `REVEAL_INTERVAL_MS` | `2500` | 한 조각 공개 간격(ms) |
| `SHUFFLE_SEED` | `20260511` | 조각 노출 순서 시드 |

## 키비주얼 교체

1. 실제 이미지를 `public/assets/`에 넣습니다 (예: `keyvisual.jpg`, 권장 해상도 2000×1200 이상)
2. `KEY_VISUAL=/assets/keyvisual.jpg npm start` 으로 실행

현재 포함된 `keyvisual.svg`는 자리표시용 일러스트입니다. 행사 전 실사 이미지로 교체하세요.

## 모더레이션

- `server/filter.js`에 단순 금칙어 리스트가 있습니다. 행사 주제와 예상 입력에 맞춰 실제 운영 전 보강이 필요합니다.
- 운영자 승인 큐(관리자 페이지)는 본 프로토타입 범위 밖입니다. 필요한 경우 `messageQueue`를 `pendingQueue`로 분리하고, `/admin` 엔드포인트에서 승인 시 메인 큐로 이동시키는 구조로 확장할 수 있습니다.
- IP 기준 간단한 레이트 리밋(10초당 3건)이 적용되어 있습니다.

## 리허설

```bash
# 가짜 메시지 20건 자동 주입
curl -X POST 'http://localhost:3000/api/demo?count=20'
```

## 무대 운영 팁

- 디스플레이 PC: Chrome `--kiosk --start-fullscreen http://stage-server:3000/display.html`
- 모바일 진입 QR: `http://공인-IP-또는-도메인/mobile.html` 을 인쇄/스크린에 노출
- 네트워크: 무대-서버 LAN을 별도 분리 권장. 관객 트래픽이 많으면 별도 Wi-Fi/통신사 회선
- 백업: 디스플레이는 마지막 상태를 메모리에 들고 있으며, 새로고침 시 서버에서 `hello` 이벤트로 즉시 복원됩니다

## 다음 단계 후보

- 운영자 모더레이션 큐 + 비밀번호 보호 `/admin`
- 메시지 영속화(SQLite) — 현재는 인메모리
- 메시지 갤러리 모드(완성 후 메시지가 떠다니는 형태)
- 직쏘 모양 마스킹(SVG `<clipPath>`)
- 폰트/조각 등장 사운드, 완성 시 팡파레
