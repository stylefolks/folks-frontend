# Folks-Frontend

## 사용 기술

| 기술             | 선택 이유                    |
| ---------------- | ---------------------------- |
| **React + Vite** | 빠른 개발 환경과 모던 번들링 |
| **Express**      | 간단한 SSR 환경 구현         |
| **Tailwind CSS** | 빠른 스타일링                |

# 페이지별 UI 진행상황 MVP v1

## ✅ 메인 페이지

- [x] Hot Hashtags
  - [x] 게시글 많은 순으로 해시태그 10개 뽑아오기
  - [x] 해시태그 클릭 시 검색 페이지에서 해당 해시태그로 전체 포스트 검색 결과 보여주기
- [x] Crews
  - [x] updatedAt 가장 최근인 Crews 리스트 5개 뽑아오기
  - [x] 해당 크루 클릭 시 크루 상세 페이지로 이동
- [x] Latest Posts
  - [x] 최신순으로 글 Infinite scroll
  - [x] 클릭 시 게시글 상세로 이동
  - [x] 게시글은 Masonary UI + 좋아요 수 + 작성자 이름 + 게시글 타이틀 보여주기

## ✅ 크루 디렉토리 (Search페이지와 다소 겹쳐 고민 필요)

- [x] Hot Hashtags
  - [x] 게시글 많은 순으로 해시태그 10개 뽑아오기
  - [x] 해시태그 클릭 시 검색 페이지에서 해당 해시태그로 전체 포스트 검색 결과 보여주기
- [x] 크루 명 검색 가능하도록 Input
  - [x] 디바운스 처리 필요
- [x] Latest Event
  - [x] 크루에서 개최한 최신 이벤트 게시물 보여주기
  - [x] 메인의 Crews와 같은 작은 카드 형태 UI(클릭 시, 해당 게시글로 이동)
- [x] 크루 전체 보여주기
  - [x] 크루 카드(크루 메인 해시태그[크루 게시글에 가장 많이 태그된 해시태그 2개 뽑기], 멤버 수, 크루 이름, 클릭 시 해당 크루 상세로 이동)

## ✅ 검색 페이지

- [x] Input
  - [x] 검색 시 query로 posts?query=검색어
  - [x] 디바운스 처리
- [x] Tab
  - [x] Tab(전체, Basic, Column) 클릭 시 posts?tab=탭이름
- [x] Hashtags
  - [x] 조인 가장 많이된 해시태그 10개 렌더, 클릭 시 posts?tags=태그명1,태그명2...
- [x] 게시글 카드들
  - [x] 게시글은 Masonary UI + 좋아요 수 + 작성자 이름 + 게시글 타이틀 보여주기

## 게시글 작성 페이지

- [x] 뒤로가기 & postType tab(설명) & 타이틀 작성
- [x] ProseMirror editor
- [x] @멘션 및 #멘션 별도 노드 파싱
- [x] 크루에서 Manager나 Master글 작성 시 BrandMetaTag or CrewMetaTag 설정 가능하도록 하기
- [ ] 이미지 업로드 후 url 렌더로 변경해줘야 함.
  - [ ] 타이틀 미작성 또는 게시글 미작성시에 대한 validation추가 필요 (가능하면 사진 업로드 유무 또는 해시 태그 유무에 따라 가이드 Alert제공)
  - [ ] body에 내용 담아서 post api 호출(디바운스 필요 | 서버에서 타임아웃 걸어야함)

## ✅ 게시글 보기 페이지

- [x] 뒤로가기 버튼 & 글작성 시 사용된 해시태그들
  - [x] 뒤로가기 버튼 클릭시 history back, 해시태그 클릭 시 Search페이지로 tags쿼리로 검색
- [x] 작성자 보여주기 & 작성날짜(createdAt, updatedAt이 있는 경우 updatedAt으로 보여주고 편집됨 표기)
  - [x] 작성자 클릭 시 해당작성자 프로필 (profile/유저아이디)로 이동
- [x] Prosemirror컨텐츠 보여주기
- [x] 좋아요 아이콘 + 좋아요 개수 표시 & 덧글아이콘 + 덧글 카운트
- [x] 좋아요 클릭 시 좋아요 카운트 올리고 좋아요 색상 변경

### ✅ 게시글 보기 페이지의 덧글 달기

- [x] 덧글 리스트 보여주기
  - [x] 프로필 이미지 & 닉네임 + 작성일 & 댓글 내용
  - [x] 프로필 클릭 시 해당 유저 프로필 페이지로 이동 (profile/유저아이디)
  - [x] 내 덧글이면 수정 & 삭제 가능하게 UI(comment/?:id, PATCH, DELETE)
- [x] profile이미지 & Input창 & 등록 버튼
- [x] TODO: 덧글 타이핑 시 리렌더 막기

## 크루 상세 페이지

- 타이틀 이미지 & 크루 이름 & 크루 멤버 수
  - [ ] 크루 멤버 리스트로 보여주는 UI
  - [ ] 크루 Manager또는 Owner면 crew-settings로 넘어가는 UI보여주기
- 크루 description
- [ ] 미 가입인 경우 join버튼 가입인 경우 dismiss버튼 노출 (크루 description우측으로 이동 시키고 작은 아이콘으로 변경하기)
  - [ ] All Posts, Topic, Notice, Event 탭 UI 재 정립 필요
    - [x] All Posts : 게시글은 Masonary UI + 좋아요 수 + 작성자 이름 + 게시글 타이틀 보여주기
    - [x] Topic : 게시글은 Masonary UI + 좋아요 수 + 작성자 이름 + 게시글 타이틀 보여주기
    - [x] Notice : 게시글은 좌측 작은 이미지 중간 타이틀 우측 덧글 개수 및 좋아요 개수 간단하게 렌더 (테이블 형태의 리스트로 렌더)
    - [ ] Event : 게시글은 좌측 작은 이미지 중간 타이틀 우측 덧글 개수 및 좋아요 개수 간단하게 렌더 (나중에 위치 멘션 넣으면 위치도 렌더되도록 하자)

## 크루 설정 페이지

- [ ] 해당 크루의 Manager 또는 Owner판별 필요
- [x] 가입된 유저의 등급 변경 UI
- [x] 탭 관리 UI
  - [x] 탭 이름 및 타입 지정 가능 CRUD 가능

## 유저 상세 페이지

- [x] 유저 프로필이미지 + 유저 닉네임 + 유저 설명
- [x] 본인 페이지로 이동 시 Nav 밑에 설정 버튼 제공
  - [x] 로그아웃, Settings 등
- [x] 팔로워 팔로잉 개수
- [x] 팔로워 팔로잉 클릭 시 해당 유저 리스트 보여주는 모달 UI(삭제 차단 등은 MVP 미지원, glass UI)
- [x] 가입한 크루 리스트
  - [x] 클릭 시 해당 크루로 이동
- [x] 본인이 작성한 게시글 리스트
  - [x] 게시글은 Masonary UI + 좋아요 수 + 게시글 타이틀 보여주기
    - [ ] 해당글의 hashtags

## 회원가입

- [x] 이메일, 비밀번호, 닉네임, 프로필이미지, 한줄소개
- [ ] 프로필 이미지 업로드 시 링크로 반환 필요
- [x] 약관동의 체크박스
- [ ] 약관 링크 (서비스, 개인정보)

## ✅ 로그인

- [x] 이메일 및 비밀번호 입력으로 로그인
- [x] 간단한 validation

## ✅ 비밀번호 찾기

- [x] 이메일 입력 시 비밀번호 랜덤 생성으로 보내기

## ✅ Nav

- [x] 로그인 안되어있을 경우 Nav는 검색 & 회원가입 & 로그인만 존재
- [x] 로그인 되어 있을 경우 검색 & 크루 & 작성 만 존재

# 페이지별 API 연결 진행상황 MVP v1

# Remind

- PostType은 두가지로 축약
  - TALK(BASIC): 일상적인 소통, 질문, 후기, 정보 공유 등 자유로운 커뮤니티형 게시물
  - COLUMN: 인사이트, 칼럼, 리뷰, 분석 등 크리에이터/브랜드/마스터가 제공하는 고품질 콘텐츠
  - CREW, BRAND, NOTICE, 기타 특수 포스트들은 별도의 메타데이터(예: postType이 아니라 postCategory, tag, 혹은 CREW 연동 등)로 처리해서 메인 포스트 타입은 2개로 간소화하는 것이 유지보수 측면에서 뛰어나다고 판단.
  - 참고: 이후에 CREW 내 공지/브랜드 소식 등은 postType이 아니라, 별도 플래그/카테고리/연관 테이블로 분리해서 구현
- 카테고리에 따른 게시글 CRUD
  - BrandMetaType(Notice, Promotion...), CrewMetaType(Notice, Event...)

### 🎪 CREW

- 크루 Owner&Manager 혹은 Master 등급 이상의 계정으로 로그인 시 크루 상세 페이지에서
  커버 이미지, 소개글 등을 직접 수정하고 삭제할 수 있습니다.
- @crewname으로 멘션된 글의 hashtag를 통해 해당 글을 필터링함.
- @crewname + crewMetaType으로 관리하도록 함.
- CrewTabType은 ('OVERVIEW','POSTS','NOTICE','EVENT','TOPIC')가 존재하며 크루별로 타입에 따라 다른 네이밍을 쓸 수 있음.
  - Topic: 특정 해시태그들을 기반으로 모음집을 만들 수 있는 타입
    - 유저 프로필의 활동이 CREW 활동 히스토리에 연결되는 것이 가능
  - Overview: 크루에 대한 소개글 작성
  - POSTS: 크루가 멘션된 전체 글
  - NOTICE: 공지사항들
  - EVENT: 오프라인 이벤트 공지
    - 추후 v2에서 지도또는 길찾기 관련 UI/UX추가 하면 좋을 것으로 사료됨

### COLUMN

1. COLUMN 작성 권한 조건 (CREW & BRAND)
   BRAND 전역등급을 가진자가 생성한 CREW가 브랜드의 페이지를 생성하고 유지하는 권한을 가지게 된다.(별도 승인으로 등급 부여)

> COLUMN은 전체 열람 가능하나, 작성은 아래 1,2 조건을 만족한 유저만 가능

| 조건              | 설명                                    |
| ----------------- | --------------------------------------- |
| 1. 전역 등급      | `BRAND` 이상일 것                       |
| 2. CREW 내부 역할 | 해당 CREW의 `owner` 또는 `manager`일 것 |

### 권한

1. 플랫폼 전역 유저 등급 (User Tier)

| 등급       | 키값         | 설명                                 |
| ---------- | ------------ | ------------------------------------ |
| 일반 유저  | `USER`       | 가입만 한 상태. CREW 생성 불가       |
| 인플루언서 | `INFLUENCER` | CREW 생성 가능, 활동 중심 유저       |
| 브랜드     | `BRAND`      | CREW 생성 가능, 활동 중심 유저       |
| 운영진     | `MASTER`     | Folks 플랫폼 관리자 계정 (슈퍼 권한) |

2. CREW 내부 역할 (Crew Role)

| 역할        | 키값      | 설명                               |
| ----------- | --------- | ---------------------------------- |
| CREW 생성자 | `OWNER`   | CREW를 최초 생성한 유저 (1명 한정) |
| CREW 관리자 | `MANAGER` | Owner가 지정한 관리자. 다수 가능   |
| 일반 멤버   | `MEMBER`  | CREW에 속한 유저 (팔로워/가입자)   |

- CREW 내부 권한은 CREW마다 별도로 관리됨
- CREW 생성자는 자동으로 `owner` 역할 부여
- `manager`는 CREW 내 설정 탭 등에서 지정 가능

# 개발 관련

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
- 크루 상세 데이터를 호출하면 해당 크루를 팔로우한 회원 리스트가 함께 반환됩니다.

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

## MVP 기능 최종

| #   | 항목                                                    | 상태                                                                                                                                       |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | 유저 간 팔로우/팔로워 기능                              | ✅ 있음 (`Follow` 테이블)                                                                                                                  |
| 2   | 유저 → 크루 팔로우                                      | ✅ 있음 (`CrewMember`)                                                                                                                     |
| 3   | 크루는 Influencer만 생성 가능                           | ✅ 명시됨                                                                                                                                  |
| 4   | Influencer당 1개 크루 제한                              | ✅ 중요 제한사항                                                                                                                           |
| 5   | 크루 내 등급: Owner/Manager/User                        | ✅ (`CrewMember.role`)                                                                                                                     |
| 6   | 브랜드도 동일 등급 구조를 따르되 전역 `BRAND` 권한 가짐 | ✅                                                                                                                                         |
| 7   | 브랜드 → 크루 후원 가능                                 | ✅ (`Sponsorship`)                                                                                                                         |
| 8   | 유저 → 크루 후원 가능                                   | ✅ (같은 구조 재사용 가능)                                                                                                                 |
| 9   | Stripe로 후원 시스템 예정                               | ✅ 설계 및 Test Mode 포함                                                                                                                  |
| 10  | Column 작성 조건: Owner 또는 Manager만 가능             | ✅                                                                                                                                         |
| 11  | 브랜드 광고: Crew 또는 Folks 대상                       | ✅ (`AdCampaign`)                                                                                                                          |
| 12  | 크루 탭 관리 가능: `CrewTabType`으로 관리               | ✅ 탭 커스터마이징 구조 명확                                                                                                               |
| 13  | Topic: 특정 해시태그를 탭화                             | ✅ CREW 커뮤니티 큐레이션 기능                                                                                                             |
| 14  | 탭에서 Post/Topic은 해당 CREW를 @멘션해야 나타남        | ✅ 멘션 기반 필터링 로직                                                                                                                   |
| 15  | PostType = TALK, COLUMN → Brand 또는 Crew만 작성 가능   | ✅                                                                                                                                         |
| 16  | 회원가입 = 간단 이메일 인증 기반                        | ✅ MVP에 적합한 방식                                                                                                                       |
| 17  | Post 작성자 검증                                        | COLUMN이 "Crew만 작성 가능"하다고 했지만 어떤 CREW의 COLUMN인지 식별 필요 → post.crewId 반드시 필요                                        |
| 18  | CREW 탈퇴 처리 플로우                                   | Owner가 탈퇴하거나 강제 탈퇴 시 Manager 승계로 갈음                                                                                        |
| 19  | 브랜드 후원/광고 승인 구조                              | 광고/후원은 플랫폼 즉시 집행으로 설정                                                                                                      |
| 20  | 탭/토픽 관리 UI/UX                                      | CREW가 탭을 어떻게 추가/정렬/숨김 처리는 권한에 따라 크루 탭에 설정 버튼이 생기며 해당 설정버튼 클릭시 별도의 모달 또는 페이지를 통해 진행 |
| 21  | 브랜드 계정 생성 방법                                   | 일반 유저가 가입 후 브랜드 심사를 플랫폼에 요청 시 계정 변환 진행                                                                          |
| 22  | 회원 상태 관리                                          | 정지 계정, 탈퇴 유저, 휴면 계정 등 사용자 상태는 별도의 컬럼을 추가 🧠 `UserStatus` Enum : `ACTIVE`, `BANNED`, `DELETED`, `INACTIVE`       |
| 23  | 크루 콘텐츠 외부 노출 범위                              | COLUMN이나 TOPIC 등은 전체 공개                                                                                                            |
| 24  | 크루 상태 관리                                          | 🧠 `CrewStatus` Enum : 운영중, 비공개, 정지                                                                                                |
| 25  | 게시글 상태 관리                                        | 🧠 `PostVisibility`: PUBLIC / CREW_ONLY / FOLLOWER_ONLY 등 나중에 확장 고려                                                                |
| 26  | 크루 탭 관리 configuration                              | 🧠 `CrewTabConfig` Table : 탭 순서, 토픽 연결 해시태그, 표시 여부 등 설정 저장용                                                           |

## MVP 이후 추가할 내용

| #   | 항목                            | 설명                                                                                                                           |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 27  | **PostReaction (좋아요 등)**    | 게시글 단위의 좋아요/싫어요/🔥 등 반응 저장 테이블<br>`PostReaction { id, postId, userId, type (LIKE, CLAP, etc), createdAt }` |
| 28  | **PostViewLog (조회수 기록)**   | 조회수를 누적하는 것이 아니라 유저별 조회 로그를 기록 (bot 방지 및 사용자 분석용)                                              |
| 29  | **AnalyticsLog (행동 로그)**    | 검색어, 버튼 클릭, 탭 이동 등 UX 개선을 위한 행동 로그 테이블 (MVP에선 console 기반만 두어도 좋음)                             |
| 30  | **CrewJoinRequest (가입 신청)** | Crew가 `승인제`로 운영되도록 확장하고 싶을 경우 필요<br>`CrewJoinRequest { id, userId, crewId, status, requestedAt }`          |
| 31  | **NotificationTemplate**        | 알림 템플릿을 설정해두고 동적으로 처리하도록 (ex. “OO님이 게시글을 작성했습니다”)                                              |
| 32  | **ContentReport (신고 기능)**   | 유저가 부적절한 댓글/게시글을 신고할 수 있도록 하는 테이블                                                                     |
| 33  | **UserDevice (디바이스 기록)**  | 유저의 알림 발송이나 보안 강화(2FA 등)를 위한 기초 데이터 수집                                                                 |
| 34  | **BannerCampaign**              | Folks 플랫폼 메인에 띄울 배너를 관리하는 시스템 (운영 툴 고려 시 유용)                                                         |
| 35  | **ReferralCode / InviteLink**   | 초대 기반 가입 시에 필요 (커뮤니티 성장 모델 시 유용)                                                                          |
| 36  | **TagCategory (태그 분류화)**   | 태그가 너무 많아졌을 때 필터링 및 랭킹에 유리한 구조                                                                           |
| 37  | **CrewSlug, PostSlug (SEO용)**  | 추후 SEO 및 공유 시 유저친화 URL로 확장할 수 있도록 slug 필드 정의                                                             |

- [ERD LINK](https://dbdiagram.io/d/6861ec8cf413ba35086e3ead)
  ![erd](./erd.png)

## API 연결 체크리스트

### 인증

- [x] `POST /auth/signup`
- [ ] `POST /auth/verify-email`
- [ ] `POST /auth/request-email-verification`

### 유저

- [ ] `GET /users/:id/followers`
- [ ] `GET /users/:id/following`
- [ ] `POST /users/:id/follow`
- [ ] `DELETE /users/:id/unfollow`
- [ ] `PATCH /users/me/status`
- [ ] `POST /users/request-brand-role`
- [ ] `POST /users/approve-brand-role`

### 크루

- [x] `POST /crews`
- [x] `GET /crews/:id`
- [ ] `POST /crews/:id/join`
- [ ] `POST /crews/:id/leave`
- [ ] `PATCH /crews/:id/status`
- [ ] `PATCH /crews/:id/transfer-ownership`

### 크루 멤버

- [ ] `GET /crews/:crewId/members`
- [ ] `PATCH /crews/:crewId/members/:userId/role`
- [ ] `DELETE /crews/:crewId/members/:userId`

### 크루 탭/토픽

- [ ] `POST /crews/:crewId/tabs`
- [ ] `PATCH /crews/:crewId/tabs/:tabId`
- [ ] `DELETE /crews/:crewId/tabs/:tabId`
- [ ] `POST /topics`

### 게시글

- [x] `POST /posts`
- [ ] `PATCH /posts/:id`
- [ ] `DELETE /posts/:id`
- [ ] `PATCH /posts/:id/visibility`
- [ ] `GET /posts?mention=crewId`
- [ ] `GET /posts?type=`
- [ ] `POST /posts/:id/parse-mentions`

### 후원

- [ ] `POST /sponsorships`
- [ ] `POST /sponsorships/webhook`

### 광고

- [ ] `POST /ad-campaigns`
- [ ] `PATCH /ad-campaigns/:id/status`

### 신고

- [ ] `POST /reports`

### 알림 템플릿

- [ ] `GET /notification-templates`
- [ ] `POST /notification-templates`

### 설정

- [ ] `GET /config/post-types`
- [ ] `GET /config/user-roles`
- [ ] `GET /config/crew-status`
- [ ] `GET /config/post-visibility`
