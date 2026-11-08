/**
 * 소감 수집용 Google Apps Script.
 * 구글 시트 > 확장 프로그램 > Apps Script에 붙여 넣으세요.
 * 배포 설정과 개인정보 안내는 README.md를 참고하세요.
 */
const SHEET_NAME = '4학년 관람 소감';
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = e && e.parameter ? e.parameter : {};
    const grade = String(p.grade || '').slice(0, 2);
    const classroom = String(p.classroom || '').slice(0, 10);
    const nickname = String(p.nickname || '').trim().slice(0, 20);
    const message = String(p.message || '').trim().slice(0, 500);
    if (grade !== '4' || !['1', '2', 'both'].includes(classroom) || !nickname || !message) {
      return ContentService.createTextOutput('invalid');
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) { sh = ss.insertSheet(SHEET_NAME); sh.appendRow(['작성 시각', '학년', '공연 선택', '별명', '소감']); }
    // 스프레드시트 수식 주입 방지
    const safe = s => /^[=+\-@]/.test(s) ? "'" + s : s;
    sh.appendRow([new Date(), grade, classroom, safe(nickname), safe(message)]);
    return ContentService.createTextOutput('ok');
  } finally { lock.releaseLock(); }
}
