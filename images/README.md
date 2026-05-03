# 일러스트 인벤토리

총 **60장**. 아래 정해진 경로에 그대로 떨어뜨리면 페이지에 자동 매칭됩니다. 누락된 슬롯은 `<img onerror>` 폴백으로 자연스럽게 숨겨지므로 일부만 먼저 올라가도 페이지는 정상 동작합니다.

## 1. 메인 일러스트 — `types/` (10장)

각 가족 유형의 핵심 비주얼. 결과 화면 상단에 노출되며, **결과 저장하기 / SNS 공유하기** 버튼이 이 이미지를 그대로 저장·공유합니다 (별도 공유 카드 없음).

| 파일 | 가족 유형 | 무드 키워드 |
|---|---|---|
| `types/library.png` | 포근한 도서관 가족 | 조용, 정적, 책, 은은한 조명 |
| `types/playground.png` | 에너지 뿜뿜 운동장 가족 | 활동적, 운동, 야외, 땀 |
| `types/gourmet.png` | 미식가 맛집 탐방 가족 | 음식, 식탁, 즐거운 대화 |
| `types/guide.png` | 꼼꼼한 베테랑 가이드 가족 | 계획적, 지도, 동선 |
| `types/artist.png` | 감성 충만 아티스트 가족 | 예술, 낭만, 노을, 꽃 |
| `types/party.png` | 왁자지껄 홈파티 가족 | 사교, 시끌벅적, 모임 |
| `types/fireplace.png` | 따뜻한 난로형 배려 가족 | 세심, 묵묵한 배려, 따뜻함 |
| `types/explorer.png` | 호기심 천국 탐험대 가족 | 도전, 새로움, 얼리어답터 |
| `types/camping.png` | 자유로운 영혼 캠핑 가족 | 자연, 캠핑, 별, 자유 |
| `types/bodyguard.png` | 든든한 보디가드 가족 | 결속, 의리, 든든함 |

## 2. 섹션 브릿지 — `sections/{slug}/` (50장)

각 가족 유형마다 5장씩, 결과 화면 본문 섹션 위에 띠처럼 들어가는 분위기 컷.

**섹션별 의미**
- `traits.png` — 주요 특징 본문 위 (가족의 일상 스냅)
- `signature.png` — "이게 바로 찐모습" 위 (인용/유머 한 컷)
- `power.png` — "함께여서 POWER UP" 위 (가족의 힘이 드러나는 장면)
- `bridge.png` — "사실은" 연결 메시지 위 (입양 이야기로 넘어가는 분위기)
- `slogan.png` — 슬로건 위 (한 아이의 온 세상 — 따뜻한 마무리 컷)

**전체 50장 경로** (10유형 × 5섹션)

```
sections/library/{traits,signature,power,bridge,slogan}.png
sections/playground/{traits,signature,power,bridge,slogan}.png
sections/gourmet/{traits,signature,power,bridge,slogan}.png
sections/guide/{traits,signature,power,bridge,slogan}.png
sections/artist/{traits,signature,power,bridge,slogan}.png
sections/party/{traits,signature,power,bridge,slogan}.png
sections/fireplace/{traits,signature,power,bridge,slogan}.png
sections/explorer/{traits,signature,power,bridge,slogan}.png
sections/camping/{traits,signature,power,bridge,slogan}.png
sections/bodyguard/{traits,signature,power,bridge,slogan}.png
```

## 사양 가이드

| 항목 | 메인 일러스트 (`types/`) | 섹션 브릿지 (`sections/`) |
|---|---|---|
| CSS 표시 폭 | 320px | 220px |
| 권장 원본 (2x 레티나) | **640 × 640** (1:1) 또는 **640 × 800** (4:5) | **440 × 330** (4:3) 또는 **440 × 290** (3:2) |
| 권장 원본 (3x HiDPI) | 960 × 960 / 960 × 1200 | 660 × 495 / 660 × 440 |
| 포맷 | PNG-24 + 알파 (배경 투명) | PNG-24 + 알파 |
| 개당 용량 목표 | 100~200KB | 50~120KB |
| 여백 | 사방 8~10% (잘림 방지) | 양 끝 페이드아웃 권장 |

**전체 60장 합계 용량 목표**: 5~10MB 이내

## 작업 우선순위

1. **메인 일러스트 10장 우선** — 결과 화면 핵심 + 공유 자산
2. 섹션 브릿지는 점진 입고 가능 — 일부만 들어와도 페이지 정상 동작

## 파일명 규칙

- 슬러그(slug)는 영문 소문자, 위 표 그대로
- 디렉터리 구조 유지 (`types/` vs `sections/{slug}/`)
- 확장자 `.png` 통일
