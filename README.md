# Folks-Frontend

## 사용 기술

| 기술             | 선택 이유                    |
| ---------------- | ---------------------------- |
| **React + Vite** | 빠른 개발 환경과 모던 번들링 |
| **Express**      | 간단한 SSR 환경 구현         |
| **Tailwind CSS** | 빠른 스타일링                |

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
- [x] 카테고리에 따른 게시글 CRUD
  - BrandMetaType(Notice, Promotion...), CrewMetaType(Notice, Event...)
- [x] 댓글 CRUD UI/UX 및 API 연결
- PostType은 두가지로 축약
  - TALK: 일상적인 소통, 질문, 후기, 정보 공유 등 자유로운 커뮤니티형 게시물
  - COLUMN: 인사이트, 칼럼, 리뷰, 분석 등 크리에이터/브랜드/마스터가 제공하는 고품질 콘텐츠
  - CREW, BRAND, NOTICE, 기타 특수 포스트들은 별도의 메타데이터(예: postType이 아니라 postCategory, tag, 혹은 CREW 연동 등)로 처리해서 메인 포스트 타입은 2개로 간소화하는 것이 유지보수 측면에서 뛰어나다고 판단.
  - 참고: 이후에 CREW 내 공지/브랜드 소식 등은 postType이 아니라, 별도 플래그/카테고리/연관 테이블로 분리해서 구현

### 🎪 CREW

- [x] 크루 생성/수정/삭제
- [x] 토큰 기반 권한 확인 후 페이지 수정/삭제 UI 노출
- 크루 생성자 혹은 Master 등급 이상의 계정으로 로그인 시 크루 상세 페이지에서
  커버 이미지, 소개글 등을 직접 수정하고 삭제할 수 있습니다.
- [x] 크루 전용 포스트 및 후기 등록
  - @crewname으로 멘션된 글의 hashtag를 통해 해당 글을 필터링함.
- [x] 크루 공지
  - @crewname + crewMetaType으로 관리하도록 함.
  - CrewTabType은 ('OVERVIEW','POSTS','NOTICE','EVENT','TOPIC')가 존재하며 크루별로 타입에 따라 다른 네이밍을 쓸 수 있음.
    - Topic: 특정 해시태그들을 기반으로 모음집을 만들 수 있는 타입\
    - Overview: 크루에 대한 소개글 작성
    - POSTS: 크루가 멘션된 전체 글
    - NOTICE: 공지사항들
    - EVENT: 오프라인 이벤트 공지
      - 추후 v2에서 지도또는 길찾기 관련 UI/UX추가 하면 좋을 것으로 사료됨
- [x] 크루 외부 링크 관리
  - 일단 모달 내 텍스트와 링크만 기재 가능하도록
- [x] CREW 이벤트 탭 등록(날짜, 장소, 링크)
- [x] 이벤트 리스트 뷰
- [ ] 팔로우한 회원 리스트 관리
- [ ] 팔로우한 유저 크루 내 등급 변경
- [ ] 팔로우한 유저의 등급에 따른 포스팅(OOTD 한정) 노출
- [ ] CREW 활동 히스토리 → 유저 프로필 연결

### 🏷️ BRAND

- [x] 브랜드 개별 페이지
- [ ] 브랜드 정보 수정
- [ ] BRAND 글 상단 고정
- [ ] CREW 페이지 스폰서 영역
- [ ] 크루와 연결 시스템
- [x] 각 페이지들의 게시글은 무한스크롤로 페이지네이션

### COLUMN

- [ ] COLUMN

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

`@`검색은 아래로 가능합니다.

- write페이지에서 `Crew-[id]`로 prefix를 가진 이름이 랜덤으로 생성됩니다.

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
