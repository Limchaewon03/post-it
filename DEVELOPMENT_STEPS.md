# 📋 Post-it Todo List 웹 서비스 개발 및 개선 과정 보고서

- **프로젝트명**: Post-it Todo List 웹 서비스
- **작성자**: chaewon lim
- **기술 스택**: Next.js 14 (App Router), TypeScript, Tailwind CSS, @dnd-kit, Google Apps Script, Google Sheets API
- **제출용 개발 단계 정리 마크다운 문서**

---

## 📌 전체 개발 및 요구사항 반영 단계별 정리

### 1단계: 초기 환경 설정 및 시스템 구축 (`npm run dev`)
1. **Node.js LTS (v24.20.0) 및 npm 설치 및 PATH 환경변수 설정**
   - 개발 환경 구동을 위한 런타임 세팅 및 터미널 권한 정비.
2. **Next.js 14 프로젝트 초기화 및 핵심 라이브러리 구성**
   - Next.js (App Router), TypeScript, Tailwind CSS, `@dnd-kit` (Drag & Drop), `lucide-react` 설치.
3. **기본 명세 준수 레이아웃 구축**
   - 페이지 제목: `Post-it Todo List`
   - 한 행에 최대 4개까지 배치되는 4열 반응형 그리드 (`lg:grid-cols-4`).
   - 4가지 무작위 파스텔 색상 (노랑, 분홍, 초록, 파랑) 적용.
   - 메모 추가 시 위에서 회전하며 착 달라붙는 물리 스프링 애니메이션 (`animate-stick-in`) 구현.
   - 각 메모 좌측 하단에 연월일 시간 요일 흐릿한 폰트 표기 (`2026.10.09 (금) 22:12`).
   - 라이트 모드 및 다크 모드 토글 (기본값: 라이트 모드).
   - 카테고리(`전체`, `할 일`, `아이디어`, `기타`) 분류 및 필터 드롭다운 기능.
   - 메모 CRUD: 체크 완료 표시, 내용/카테고리 인라인 수정, 즉시 삭제 버튼.

---

### 2단계: 참고 디자인 화면 일치 및 개인 구글 시트 CRUD 스크립트 작성
1. **참고 이미지 기반 UI 디테일 리뉴얼**
   - 감성적인 아날로그 도트 그리드(Dot-grid) 배경 적용.
   - 상단 헤더: `📝 포스트잇 보드` + `Sticky Board` 뱃지, `🌙 다크 모드` 텍스트 버튼 디자인 반영.
   - 메모 입력창: `● 포스트잇 작성 란`, 실시간 글자 수 카운터(`0자`), 카테고리 알약 버튼(`📌 할 일`, `💡 아이디어`, `☕ 기타`), 다크 네이비 톤의 `+ 포스트잇 붙이기` 버튼.
   - 포스트잇 카드: 상단 반투명 테이프 클립 핀, 우측 상단 `✕` 즉시 삭제 버튼, 좌측 하단 시계 아이콘(`🕒`) 추가.
2. **구글 스프레드시트 맞춤형 Google Apps Script (Code.gs) 제작**
   - 연동 시트: `https://docs.google.com/spreadsheets/d/19QMuJa7RXSba3Ye4kSBHg9ATTpvAyo4yB_AHTZu2CLs/edit`
   - 스키마 7개 열(A열: `timestamp`, B열: `datetime`, C열: `category`, D열: `content`, E열: `color`, F열: `state`, G열: `order`)에 대한 GET(조회), POST(생성/수정/삭제/순서 동기화) 백엔드 API 작성 (`google-apps-script.js`).

---

### 3단계: 구글 앱스 스크립트 웹 앱 배포 URL 실시간 연동
1. **배포 URL 등록**
   - 사용자가 배포한 웹 앱 URL(`https://script.google.com/macros/s/AKfycbwAIEsrlfYbWyl0d4_Xcl0YvST9Gz3jW2Oa7XN9soFwnzPD_bGn4W6l40vXfun5vs_1FQ/exec`)을 프론트엔드 환경변수(`.env.local`) 및 코드 기본값으로 연결.
2. **실시간 통신 검증**
   - 테스트 데이터 송수신(POST -> GET)을 거쳐 구글 스프레드시트에 실시간으로 행이 추가·수정·삭제되는 것을 확인 후 테스트 행 정리.

---

### 4단계: 포스트잇 색상 복구 및 '전체보기' 기능 추가
1. **포스트잇 색상 출력 버그 해결**
   - Tailwind 동적 클래스 컴파일 누락 이슈를 방지하기 위해 노랑, 분홍, 초록, 파랑 4색의 인라인 스타일 매핑을 추가하여 스크린샷과 동일한 파스텔 색상이 100% 정상 출력되도록 수정.
2. **기본 4개 노출 및 `전체보기` 토글 버튼 구현**
   - 화면이 과도하게 길어지는 것을 방지하기 위해 기본 상태에서는 상위 4개만 깔끔하게 노출.
   - 포스트잇 목록 상단 우측에 `전체보기 (+N개 더보기)` 버튼을 배치하여 클릭 시 전체 목록이 펼쳐지고 다시 누르면 `접기 (4개만 보기)`로 전환되도록 구현.

---

### 5단계: 중복 데이터 누적 버그 해결 (Deduplication)
1. **중복 생성 문제 원인 분석**
   - 구글 시트와 브라우저 로컬스토리지에 동일한 timestamp를 가진 테스트 데이터가 누적되어 화면에 수십 개로 복제 출력되는 현상 포착.
2. **고유 키 기반 디듀플리케이션(중복 제거) 필터링 적용**
   - 구글 시트 로드 및 로컬스토리지 캐시 저장 시 `timestamp`를 기준으로 중복 데이터를 1개로 압축.
   - 빈 행(`""`)이 카드로 생성되지 않도록 필터링 추가.
   - 로컬스토리지 키 갱신(`v4`)으로 브라우저에 남아있던 중복 캐시 자동 정리.

---

### 6단계: 타이틀 및 Footer 저작권 문구 최종 반영
1. **Title 태그 설정**
   - 메인 페이지 브라우저 탭 제목: `Post-it Todo List` ([src/app/layout.tsx](file:///c:/Users/ltiee/Downloads/post.it/src/app/layout.tsx)).
2. **Footer 저작권자 이름 설정**
   - 페이지 최하단 푸터: `Copyright INU Post-it Todo List by chaewon lim` ([src/components/Footer.tsx](file:///c:/Users/ltiee/Downloads/post.it/src/components/Footer.tsx)).

---

### 7단계: 포스트잇 드래그 앤 드롭 부드러운 물리 이동 개선
1. **`DragOverlay` (3D 플로팅 레이어) 도입**
   - 드래그 중인 포스트잇이 다른 카드와 부딪히며 버벅거리던 현상을 개선하기 위해, 잡는 순간 공중에 붕 떠올라 마우스 커서를 가볍게 따라오는 플로팅 오버레이 적용.
   - 드래그 중인 본래 자리는 반투명 점선 박스로 유지하여 이동 위치를 직관적으로 파악 가능.
2. **스프링 착지 애니메이션 (`dropAnimationConfig`) 적용**
   - 드래그를 놓았을 때 툭 끊기지 않고 원래 목표 지점에 쫀득하게 '착' 달라붙는 물리 탄성 곡선(`cubic-bezier`) 적용.
3. **센서 반응성 최적화**
   - 터치 및 마우스 드래그 딜레이(200ms)를 제거하고 `PointerSensor(4px 이동 시 즉시 감지)`로 반응 속도를 대폭 향상.
   - 텍스트 수정 및 삭제 버튼 클릭 이벤트와 드래그 이벤트가 충돌하지 않도록 분리 완료.
