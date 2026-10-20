/**
 * Google Apps Script (Code.gs)
 * 구글 스프레드시트 연동용 스크립트
 * 시트 링크: https://docs.google.com/spreadsheets/d/19QMuJa7RXSba3Ye4kSBHg9ATTpvAyo4yB_AHTZu2CLs/edit
 *
 * 열 정보:
 * A열: timestamp (시트기록날짜및시간/고유ID)
 * B열: datetime (메모생성날짜및시간)
 * C열: category (메모범주)
 * D열: content (메모내용)
 * E열: color (메모색상)
 * F열: state (상태)
 * G열: order (메모순서)
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return responseJSON({ status: "success", data: [] });
    }

    const rows = data.slice(1);
    const result = rows
      .filter(r => r[0] !== "" || r[3] !== "") // 빈 행 제외
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

    // 헤더 행 정의 (공백 제거 표준화)
    const HEADERS = ["timestamp", "datetime", "category", "content", "color", "state", "order"];

    // 1. 전체 동기화 (SYNC_ALL / 순서 이동 등)
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

    // 2. 신규 생성 (CREATE)
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

    // 3. 수정 (UPDATE - content, category, state 등 수정)
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
      return responseJSON({ status: updated ? "success" : "not_found", message: updated ? "수정 완료" : "해당 timestamp를 찾을 수 없음" });
    }

    // 4. 삭제 (DELETE)
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
      return responseJSON({ status: deleted ? "success" : "not_found", message: deleted ? "삭제 완료" : "해당 timestamp를 찾을 수 없음" });
    }

    return responseJSON({ status: "error", message: "알 수 없는 action: " + action });
  } catch (error) {
    return responseJSON({ status: "error", message: error.toString() });
  }
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
