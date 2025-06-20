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
- [ ] 크루 개별 페이지 및 정보 수정
- [ ] 팔로우한 회원 리스트 관리
- [ ] 유저가 크루 팔로우 하기
- [ ] 팔로우한 유저 크루 내 등급 변경
- [ ] 팔로우한 유저의 등급에 따른 포스팅(OOTD 한정) 노출
- [ ] 일정 등급 이상의 회원 크루 생성

### 🏷️ BRAND (개발 보류)
- [ ] 브랜드 개별 페이지
- [ ] 브랜드 정보 수정
- [ ] 크루와 연결 시스템

### Main Page
- [x] 메인 페이지 게시글 무한 스크롤
- [ ] Talks, Column, CREW, Brand 섹션 무한 스크롤

### Testing
- [x] auth/profile 유닛 테스트
- [ ] Playwright 기반 E2E 테스트 (빌드 후 `npm run test:e2e`)

### Mock API
개발 편의를 위해 [MSW](https://mswjs.io/) 기반의 목 API가 준비되어 있습니다.
개발 모드에서는 기본적으로 MSW가 활성화되며, 필요한 경우 아래와 같이 명시적으로 설정할 수 있습니다.

```bash
# MSW 사용
PUBLIC_API_MOCKING=enabled npm run dev
# 실제 API 사용
PUBLIC_API_MOCKING=disabled npm run dev
```

프로덕션 빌드에서는 기본적으로 MSW가 비활성화됩니다.

로그인은 아래 계정으로 가능합니다.

- 이메일: `folks@gmail.com`
- 사용자명: `folks`
- 비밀번호: `folks-password`

`/profile/[userId]` 경로로 접근하면 임의의 랜덤 프로필 정보를 확인할 수 있습니다.

본 프로젝트는 [stylefolks-frontend](https://github.com/stylefolks/stylefolks-frontend) 의 명세를 참고하여 개발되고 있습니다.
