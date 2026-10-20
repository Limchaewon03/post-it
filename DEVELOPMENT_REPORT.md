# 🚀 `AI 코딩을 활용한 창의적 앱 개발` 레포트

- **과제명**: Post-it Todo List 웹 서비스 제작
- **작성자**: 202200453 임채원 (chaewon lim)
- **제출 일시**: 2026년 10월 21일 24시까지
- **보내는 곳**: ckyonam@gmail.com
- **메일 제목**: [AI코딩] 202200453 임채원
- **기술 스택**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, @dnd-kit, Google Apps Script, Google Sheets API
- **Vercel 배포 URL**: (배포 후 링크 입력)
- **GitHub 저장소 링크**: (깃허브 업로드 후 링크 입력)
- **구글 시트 공개 링크**: https://docs.google.com/spreadsheets/d/19QMuJa7RXSba3Ye4kSBHg9ATTpvAyo4yB_AHTZu2CLs/edit?usp=sharing
- **구글 앱스 스크립트 웹 앱 URL**: https://script.google.com/macros/s/AKfycbwAIEsrlfYbWyl0d4_Xcl0YvST9Gz3jW2Oa7XN9soFwnzPD_bGn4W6l40vXfun5vs_1FQ/exec

---

## 📌 1. 프로젝트 개요

본 프로젝트는 실제 사무용 포스트잇(Post-it)의 아날로그 감성과 현대적인 인터랙티브 웹 UI를 결합한 **Post-it Todo List 웹 서비스**입니다.  
Next.js 14 App Router 환경에서 구축되었으며, 구글 스프레드시트와의 실시간 양방향 CRUD 연동, 3D 플로팅 드래그 앤 드롭 정렬, 물리 탄성 애니메이션, 라이트/다크 모드 및 카테고리 필터링을 지원합니다.

---

## 🛠️ 2. 단계별 개발 및 개선 과정

### 1단계: 초기 환경 설정 및 시스템 구축 (`npm run dev`)
1. **Node.js LTS (v24.20.0) 및 npm 설치 및 PATH 환경변수 설정**
   - 개발 환경 구동을 위한 런타임 세팅 및 PowerShell 스크립트 실행 권한 정비.
2. **Next.js 14 프로젝트 초기화 및 핵심 라이브러리 구성**
   - Next.js (App Router), TypeScript, Tailwind CSS, `@dnd-kit` (Drag & Drop), `lucide-react` 패키지 구성.
3. **기본 요구 명세 1차 구현**
   - 메인 타이틀: `Post-it Todo List` 설정.
   - 한 행에 최대 4개까지 배치되는 4열 반응형 그리드 (`lg:grid-cols-4`).
   - 4가지 무작위 파스텔 색상 (노랑, 분홍, 초록, 파랑) 적용.
   - 메모 추가 시 위에서 회전하며 착 달라붙는 물리 스프링 애니메이션 (`animate-stick-in`) 구현.
   - 각 메모 좌측 하단에 연월일 시간 요일 흐릿한 폰트 표기 (`2026.10.09 (금) 22:12`).
   - 라이트 모드 및 다크 모드 토글 (기본값: 라이트 모드).
   - 카테고리(`전체`, `할 일`, `아이디어`, `기타`) 분류 및 필터 드롭다운 기능.
   - 메모 CRUD: 체크 완료 표시, 내용/카테고리 인라인 수정, 즉시 삭제 버튼.

---

### 2단계: 참고 디자인 화면 일치 및 개인 구글 시트 CRUD 스크립트 작성
1. **참고 스크린샷 기반 UI 디테일 리뉴얼**
   - 아날로그 감성의 미색 도트 그리드(Dot-grid) 배경 패턴 적용.
   - 상단 헤더: `📝 포스트잇 보드` + `Sticky Board` 뱃지, `🌙 다크 모드` 텍스트 버튼 디자인 반영.
   - 메모 입력창: `● 포스트잇 작성 란`, 실시간 글자 수 카운터(`0자`), 카테고리 알약 버튼(`📌 할 일`, `💡 아이디어`, `☕ 기타`), 다크 네이비 톤의 `+ 포스트잇 붙이기` 버튼.
   - 포스트잇 카드: 상단 반투명 테이프 클립 핀, 우측 상단 `✕` 즉시 삭제 버튼, 좌측 하단 시계 아이콘(`🕒`) 추가.
2. **구글 스프레드시트 맞춤형 Google Apps Script (Code.gs) 제작**
   - 연동 시트: `https://docs.google.com/spreadsheets/d/19QMuJa7RXSba3Ye4kSBHg9ATTpvAyo4yB_AHTZu2CLs/edit`
   - 스키마 7개 열(A열: `timestamp`, B열: `datetime`, C열: `category`, D열: `content`, E열: `color`, F열: `state`, G열: `order`)에 대한 GET(조회), POST(생성/수정/삭제/순서 동기화) 백엔드 API 작성 (`google-apps-script.js`).

---

### 3단계: 구글 앱스 스크립트 웹 앱 배포 URL 실시간 연동
1. **배포 URL 등록**
   - 배포된 웹 앱 URL(`https://script.google.com/macros/s/AKfycbwAIEsrlfYbWyl0d4_Xcl0YvST9Gz3jW2Oa7XN9soFwnzPD_bGn4W6l40vXfun5vs_1FQ/exec`)을 프론트엔드 환경변수(`.env.local`) 및 소스코드 기본값으로 연결.
2. **실시간 통신 검증**
   - 실제 POST/GET 통신 테스트를 진행하여 구글 스프레드시트에 실시간으로 데이터가 추가되고 웹 화면과 양방향 연동되는 것을 확인.

---

### 4단계: 포스트잇 색상 복구 및 '전체보기' 기능 추가
1. **포스트잇 색상 출력 버그 해결**
   - Tailwind 동적 클래스 컴파일 이슈를 해결하여 노랑, 분홍, 초록, 파랑 4색의 파스텔 배경색, 테두리, 카테고리 뱃지 색상이 100% 정상 출력되도록 인라인 스타일 매핑 추가.
2. **기본 4개 노출 및 `전체보기` 토글 버튼 구현**
   - 화면이 과도하게 길어지는 것을 방지하기 위해 기본 상태에서는 상위 4개만 깔끔하게 노출.
   - 포스트잇 목록 상단 우측에 `전체보기 (+N개 더보기)` 버튼을 배치하여 클릭 시 전체 목록이 펼쳐지고 다시 누르면 `접기 (4개만 보기)`로 전환되도록 구현.

---

### 5단계: 중복 데이터 누적 버그 해결 (Deduplication)
1. **중복 생성 문제 원인 분석**
   - 구글 시트와 브라우저 로컬스토리지에 동일한 timestamp를 가진 테스트 데이터가 누적되어 화면에 수십 개로 복제 출력되던 현상 확인.
2. **고유 키 기반 중복 제거 필터링 적용**
   - 구글 시트 로드 및 로컬스토리지 캐시 저장 시 `timestamp`를 기준으로 중복 데이터를 1개로 압축.
   - 빈 행(`""`)이 카드로 생성되지 않도록 필터링 추가.
   - 로컬스토리지 캐시 키를 갱신하여 이전에 남아있던 중복 캐시 자동 정리.

---

### 6단계: 타이틀 및 Footer 저작권 문구 최종 반영
1. **Title 태그 설정**
   - 메인 페이지 브라우저 탭 제목: `Post-it Todo List` (`src/app/layout.tsx`).
2. **Footer 저작권자 이름 설정**
   - 페이지 최하단 푸터: `Copyright INU Post-it Todo List by chaewon lim` (`src/components/Footer.tsx`).

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

---

## 📊 3. 구글 스프레드시트 열 명세

| 열 | 헤더명 | 설명 | 데이터 타입 | 예시 |
|:---:|:---:|:---:|:---:|:---:|
| **A열** | `timestamp` | 시트 기록 날짜 및 고유 ID | 문자열 (고유키) | `1791551561282-p16e4` |
| **B열** | `datetime` | 메모 생성 날짜 및 시간 | 문자열 | `2026.10.09 (금) 22:12` |
| **C열** | `category` | 메모 범주 | 문자열 (`할 일`, `아이디어`, `기타`) | `아이디어` |
| **D열** | `content` | 메모 본문 내용 | 문자열 | `디자인 회의 준비` |
| **E열** | `color` | 메모 색상 (1: 노랑, 2: 분홍, 3: 초록, 4: 파랑) | 색상(숫자) 타입 | `3` |
| **F열** | `state` | 완료 여부 상태 | 문자열 (`미완료`, `완료`) | `미완료` |
| **G열** | `order` | 정렬 순서 | 숫자 타입 | `1` |

---

## 📜 4. 구글 앱스 스크립트 소스 코드 (`google-apps-script.js`)

```javascript
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return responseJSON({ status: "success", data: [] });
    }

    const rows = data.slice(1);
    const result = rows
      .filter(r => r[0] !== "" || r[3] !== "")
      .map(r => ({
        timestamp: String(r[0] || "").trim(),
        datetime: String(r[1] || "").trim(),
        category: String(r[2] || "기타").trim(),
        content: String(r[3] || "").trim(),
        color: String(r[4] || "1").trim(),
        state: String(r[5] || "미완료").trim(),
        order: Number(r[6]) || 1
      }))
      .sort((a, b) => a.order - b.order);

    return responseJSON({ status: "success", data: result });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const contents = e.postData.contents;
    const payload = JSON.parse(contents);
    const action = payload.action;
    const data = payload.data;

    const HEADERS = ["timestamp", "datetime", "category", "content", "color", "state", "order"];

    if (action === "SYNC_ALL" && Array.isArray(data)) {
      sheet.clearContents();
      sheet.appendRow(HEADERS);
      data.forEach(item => {
        sheet.appendRow([
          item.timestamp,
          item.datetime,
          item.category,
          item.content,
          item.color,
          item.state,
          item.order
        ]);
      });
      return responseJSON({ status: "success", message: "전체 동기화 완료" });
    }

    if (action === "CREATE") {
      sheet.appendRow([
        data.timestamp,
        data.datetime,
        data.category || "할 일",
        data.content,
        data.color || "1",
        data.state || "미완료",
        data.order || 1
      ]);
      return responseJSON({ status: "success", message: "생성 완료" });
    }

    if (action === "UPDATE") {
      const allRows = sheet.getDataRange().getValues();
      let updated = false;

      for (let i = 1; i < allRows.length; i++) {
        const rowTimestamp = String(allRows[i][0]).trim();
        if (rowTimestamp === String(data.timestamp).trim()) {
          sheet.getRange(i + 1, 1, 1, 7).setValues([[
            data.timestamp,
            data.datetime,
            data.category,
            data.content,
            data.color,
            data.state,
            data.order
          ]]);
          updated = true;
          break;
        }
      }
      return responseJSON({
        status: updated ? "success" : "not_found",
        message: updated ? "수정 완료" : "해당 timestamp를 찾을 수 없음"
      });
    }

    if (action === "DELETE") {
      const allRows = sheet.getDataRange().getValues();
      let deleted = false;

      for (let i = 1; i < allRows.length; i++) {
        const rowTimestamp = String(allRows[i][0]).trim();
        if (rowTimestamp === String(data.timestamp).trim()) {
          sheet.deleteRow(i + 1);
          deleted = true;
          break;
        }
      }
      return responseJSON({
        status: deleted ? "success" : "not_found",
        message: deleted ? "삭제 완료" : "해당 timestamp를 찾을 수 없음"
      });
    }

    return responseJSON({ status: "error", message: "알 수 없는 action" });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```
