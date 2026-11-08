(()=>{'use strict';
const cfg=window.LAUNDRY_GRADE5_CONFIG||{};
const form=document.getElementById('feedbackForm'),choice=document.getElementById('classSelect'),nickname=document.getElementById('nickname'),msg=document.getElementById('message'),status=document.getElementById('status'),button=document.getElementById('submitBtn'),count=document.getElementById('count');
document.querySelectorAll('[data-target]').forEach(a=>a.addEventListener('click',()=>{choice.value=a.dataset.target;}));
msg.addEventListener('input',()=>{count.textContent=msg.value.length+' / 500자';});
if(cfg.feedbackEndpoint){document.getElementById('feedbackMode').textContent='소감은 교사가 관리하는 구글 시트로 제출 요청됩니다. 제출 결과는 담당 선생님이 확인합니다.';}
form.addEventListener('submit',async(e)=>{e.preventDefault();if(!form.reportValidity())return;
const entry={grade:'5',classroom:choice.value,nickname:nickname.value.trim(),message:msg.value.trim()};
if(!entry.nickname||!entry.message)return;
status.textContent='';button.disabled=true;
try{if(cfg.feedbackEndpoint){const url=new URL(cfg.feedbackEndpoint);if(url.protocol!=='https:'||url.hostname!=='script.google.com')throw Error('올바른 구글 Apps Script URL이 아닙니다');await fetch(url.toString(),{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(entry)});status.textContent='✅ 소감 전송 요청을 보냈어요! 실제 저장 여부는 선생님이 구글 시트에서 확인해 주세요.';}
else{const key='laundry_grade5_feedback_draft_v1';const prev=JSON.parse(localStorage.getItem(key)||'[]');prev.push({...entry,createdAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(prev));status.textContent='✅ 체험판: 이 기기에 소감을 저장했어요. 선생님에게 전달되지는 않았습니다.';}
form.reset();count.textContent='0 / 500자';}
catch(err){status.textContent='⚠️ 소감을 저장하거나 보내지 못했습니다. 설정과 인터넷 연결을 확인해 주세요.';}
finally{button.disabled=false;}
});
})();
