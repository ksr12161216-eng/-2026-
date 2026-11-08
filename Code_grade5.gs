/** 구글 시트 > 확장 프로그램 > Apps Script에 입력. README 안내 참고. */
const GRADE5_SHEET_NAME = '5학년 관람 소감';
function doPost(e) {
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try {
    const p=e&&e.parameter?e.parameter:{};
    const grade=String(p.grade||'').slice(0,2);
    const classroom=String(p.classroom||'').slice(0,10);
    const nickname=String(p.nickname||'').trim().slice(0,20);
    const message=String(p.message||'').trim().slice(0,500);
    if(grade!=='5'||!['1','2','3','all'].includes(classroom)||!nickname||!message)return ContentService.createTextOutput('invalid');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    let sheet=ss.getSheetByName(GRADE5_SHEET_NAME);
    if(!sheet){sheet=ss.insertSheet(GRADE5_SHEET_NAME);sheet.appendRow(['작성 시각','학년','공연 선택','별명','소감']);}
    const safe=s=>/^[=+\-@]/.test(s)?"'"+s:s;
    sheet.appendRow([new Date(),grade,classroom,safe(nickname),safe(message)]);
    return ContentService.createTextOutput('ok');
  } finally {lock.releaseLock();}
}
