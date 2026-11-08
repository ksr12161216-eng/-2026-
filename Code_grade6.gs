/** 구글 시트 > 확장 프로그램 > Apps Script에서 사용. 자세한 내용은 README 참고. */
const GRADE6_SHEET_NAME='6학년 관람 소감';
function doPost(e){
  const lock=LockService.getScriptLock(); lock.waitLock(10000);
  try{
    const p=e&&e.parameter?e.parameter:{};
    const grade=String(p.grade||'').slice(0,2);
    const classroom=String(p.classroom||'').slice(0,10);
    const nickname=String(p.nickname||'').trim().slice(0,20);
    const message=String(p.message||'').trim().slice(0,500);
    if(grade!=='6'||!['1','2','all'].includes(classroom)||!nickname||!message) return ContentService.createTextOutput('invalid');
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    let sh=ss.getSheetByName(GRADE6_SHEET_NAME);
    if(!sh){sh=ss.insertSheet(GRADE6_SHEET_NAME);sh.appendRow(['작성 시각','학년','공연 선택','별명','소감']);}
    const safe=s=>/^[=+\-@]/.test(s)?"'"+s:s;
    sh.appendRow([new Date(),grade,classroom,safe(nickname),safe(message)]);
    return ContentService.createTextOutput('ok');
  }finally{lock.releaseLock();}
}
