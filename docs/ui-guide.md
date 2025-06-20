# 🎨 Folks UI 구현 가이드 (Codex 전용 템플릿)

이 문서는 ChatGPT Codex 또는 GitHub Copilot Chat에게 Folks 프로젝트의 주요 페이지 UI를 기반으로 컴포넌트를 구현하도록 지시하는 문서입니다.

## ✅ 구현 대상

- Post 상세 페이지 (`/post/:id`)
- CREW 페이지 (`/crew/:id`)
- BRAND 페이지 (`/brand/:id`)

## 🧾 공통 사항

- **Tailwind CSS 사용**
- **모바일 퍼스트 레이아웃 우선**
- **Framer Motion은 후순위에서 고려**
- 각 페이지는 `/apps/web/pages/` 디렉토리 내에 구현

---

## 📄 1. Post 상세 페이지 (`/post/:id`)

**구조**

```plaintext
[Header] ← 뒤로가기 / 공유 / 좋아요
[작성자 정보] ← 프로필 이미지 + 닉네임 + 등급 뱃지
[제목]
[본문] ← ProseMirror 기반
[태그] ← Topic 기반
[CREW 연결 정보 (optional)] ← CREW 이름 배너형 노출
[BRAND 표시 (optional)] ← 광고 뱃지 노출
[댓글 리스트]
[댓글 작성창]
```

**UI 고려사항**

- CREW에서 작성된 글은 “by CLUB MIST”와 같은 CREW 정보 노출 필요
- BRAND 게시글은 `AD` 뱃지 상단 고정 필요

---

## 🏴‍☠️ 2. CREW 페이지 (`/crew/:id`)

**구조**

```plaintext
[CREW Cover 이미지]
[CREW 소개글] + [외부 링크 (인스타, 유튜브 등)]
[탭 메뉴] ← 피드 / 이벤트 / 공지 / 소개

-- 피드 탭
  [CREW 소속 글 리스트] ← PostCard로 구성

-- 이벤트 탭
  [이벤트 카드 리스트] ← 포스터 + 날짜 + 장소

-- 공지 탭
  [공지 리스트] ← 운영진만 작성 가능

-- 소개 탭
  CREW 설명 + (후순위: 멤버 리스트)
```

**UI 고려사항**

- CREW 전용 테마 색상 사용 고려 (후순위)
- 이벤트는 예정 / 종료 구분 필요

---

## 🧳 3. BRAND 페이지 (`/brand/:id`)

**구조**

```plaintext
[Brand 로고 + 소개글]
[외부 링크] ← 브랜드 홈페이지, SNS 등
[브랜드 게시물 리스트] ← BRAND 타입 포스트만 표시
[상단 고정글] ← 광고 콘텐츠일 경우 AD 뱃지
```

**UI 고려사항**

- 브랜드 글은 CARD 우상단에 AD 표기
- 브랜드 글만 필터링된 리스트 필요

---

## 📌 컴포넌트 구조 (예시)

- `<PostCard />`: POST 리스트 아이템 (CREW/BRAND 구분 포함)
- `<UserProfile />`: 작성자 정보 + 뱃지
- `<TagList />`: 태그 모음
- `<CommentList />`, `<CommentForm />`
- `<CrewBanner />`: CREW 소속 글의 CREW 표시용
- `<AdBadge />`: 브랜드 광고 뱃지

---

## 🗂️ 작업 경로 예시

```bash
/apps/src/post/[id].tsx
/apps/src/crew/[id].tsx
/apps/src/brand/[id].tsx
```

컴포넌트는 `/src/components/` 하위에 나누어 구현

---

## 📎 참고

- 기획 문서: https://www.notion.so/folks-ui-guide (예시 링크)
- 디자인 와이어프레임: 내부 Figma 링크 연결 예정

---

이 구조를 기반으로 UI를 구현해주세요. 각 페이지는 SSR을 고려하되 초기에는 CSR 기반으로 작성해도 무방합니다.
