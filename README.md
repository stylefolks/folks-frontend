# Folks-Frontend

## 사용 기술

| 기술 | 선택 이유 |
| ---- | -------- |
| **React + Vite** | 빠른 개발 환경과 모던 번들링 |
| **Express** | 간단한 SSR 환경 구현 |
| **Tailwind CSS** | 빠른 스타일링 |

## 진행 상황

### 회원가입/로그인
- [x] 로그인 페이지
- [x] 회원가입 페이지
- [ ] 이메일 인증
- [ ] 비밀번호 찾기
- [ ] 로그인, 로그아웃 고도화

### 🧑‍💼 유저 프로필
- [x] 기본 프로필 수정 기능
- [x] 개인정보(닉네임, 개인 링크, 비밀번호, 프로필사진, 프로필 배경사진) 변경
- [x] 개인 페이지 카테고리(OOTD, Column, Review)별 포스트
- [x] Follow한 크루 리스트
- [x] 개인 작성한 게시글 전체보기

### 📝 게시글
- [x] ProseMirror 기반 글 작성 페이지
- [x] 임시 게시글 저장 기능
- [x] 게시글 상세 페이지 및 댓글 작성
- [ ] 카테고리에 따른 게시글 CRUD
- [ ] 댓글 CRUD

### 🎪 CREW
- [ ] 크루 생성/수정/삭제
- [ ] 크루 전용 포스트 및 후기 등록
- [ ] 크루 공지 및 외부 링크 관리
- [ ] 팔로우한 회원 리스트 관리
- [ ] 팔로우한 유저 크루 내 등급 변경
- [ ] 팔로우한 유저의 등급에 따른 포스팅(OOTD 한정) 노출

### 📆 오프라인 연동
- [ ] CREW 이벤트 탭 등록(날짜, 장소, 링크)
- [ ] 이벤트 리스트 뷰
- [ ] CREW 활동 히스토리 → 유저 프로필 연결

### 🏷️ BRAND
- [ ] 브랜드 개별 페이지
- [ ] 브랜드 정보 수정
- [ ] BRAND 글 상단 고정
- [ ] CREW 페이지 스폰서 영역
- [ ] 크루와 연결 시스템
- [ ] 프리미엄 COLUMN 표시

### Main Page
- [x] 메인 페이지 게시글 무한 스크롤
- [ ] Talks, Column, CREW, Brand 섹션 무한 스크롤

### Testing & Feedback
- [x] auth/profile 유닛 테스트
- [ ] Playwright 기반 E2E 테스트 (빌드 후 `npm run test:e2e`)
- [ ] 디자인 개선 및 UX 피드백 대응

### Mock API
개발 편의를 위해 [MSW](https://mswjs.io/) 기반의 목 API가 준비되어 있습니다.
현재는 별도의 환경 변수 설정 없이도 모든 환경에서 MSW가 기본적으로 활성화되며,
빌드 후 CSR 환경에서도 목 API가 동작합니다.

로그인은 아래 계정으로 가능합니다.

- 이메일: `folks@gmail.com`
- 사용자명: `folks`
- 비밀번호: `folks-password`

`/profile/[userId]` 경로로 접근하면 임의의 랜덤 프로필 정보를 확인할 수 있습니다.

본 프로젝트는 [stylefolks-frontend](https://github.com/stylefolks/stylefolks-frontend) 의 명세를 참고하여 개발되고 있습니다.
## Fly.io 배포

Fly.io에서 SSR과 MSW를 사용한 MVP를 배포하려면 Fly CLI와 Docker가 필요합니다.

1. 앱 초기화
   ```bash
   flyctl launch
   ```
   저장소에 포함된 `fly.toml`을 사용해 바로 배포할 수 있습니다.


2. 배포
   ```bash
   flyctl deploy
   ```
  배포 후 출력되는 `https://<app>.fly.dev` 주소로 접속하면 프로덕션 모드에서도 MSW가 실행된 화면을 확인할 수 있습니다.

