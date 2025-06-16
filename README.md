# Folks-Frontend

Stylefolks 프로젝트의 프론트엔드 저장소입니다. Next.js 15(App Router)과 React 19, TypeScript로 작성되었으며 Tailwind CSS 4를 사용합니다.

## 주요 특징

- **PostGrid**: 임의의 게시글 데이터를 활용한 무한 스크롤 그리드
- **게시글 상세 페이지**
- 로그인/회원가입, 크루, 프로필 등 기본 페이지 골격 제공
- Pretendard 웹폰트 적용
- View Transition API 활성화

## 사용 방법

### 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 프로덕션 빌드

```bash
npm run build
npm start
```

### 코드 린트

```bash
npm run lint
```

## 진행 현황

- [ ] 로그인 페이지 기능 구현
- [ ] 회원가입 페이지 기능 구현
- [x] 메인 페이지에서 게시글 무한 스크롤 목록 노출
- [ ] 게시글 작성 페이지(Prosemirror)
- [x] 게시글 조회 페이지 (상세 조회)
- [ ] 댓글 작성(CRUD)
- [ ] 게시글 임시저장 기능
- [ ] 댓글/대댓글 UI 및 기능
- [ ] Crew 생성 및 조회 기능
- [ ] 개인 프로필 페이지

기능들은 계속 추가/수정되고 있습니다.
