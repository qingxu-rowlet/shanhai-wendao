/* ============================================================
   山海问道 · 自检日志 — every self-test run is kept: when, which build, the page size, each check with ✓/✗, the problems
   found and every line of dialogue it saw. The last five runs stay in this browser (the newest with all its lines), the
   report has a 「下载日志」 button (a .txt anyone can read), and #testlog shows the kept runs. A run on a page with no size
   (a hidden window: nothing can be drawn) says so at the top, so its failures are not taken for the game's.
   ============================================================ */
const TestLog={
  KEY:'shanhai-testlog'+(/\/beta\//.test(location.pathname)?'-beta':''),
  cur:null,
  begin(suite){ const b=document.querySelector('meta[name="build"]');
    TestLog.cur={suite, build:b?b.dataset.build:'本地', at:new Date().toLocaleString('zh-CN',{hour12:false}), view:[innerWidth,innerHeight], items:[], issues:[], lines:[]};
    if(!innerWidth||!innerHeight) TestLog.issue('页面大小是 0（窗口被收起来了），画图都会失败：这次的结果不可信，请在能看见的窗口里重跑。');
    const t0=typeof RT!=='undefined'?RT.t:0; setTimeout(()=>{ if(typeof RT!=='undefined'&&RT.t===t0&&TestLog.cur) TestLog.issue('游戏画面没有在动（窗口在后台或被收起来了）：要等画面动起来的检查可能会失败。'); },2000); },
  item(name,ok,info){ if(TestLog.cur) TestLog.cur.items.push({name, ok:!!ok, info:info||''}); },
  issue(text){ if(TestLog.cur) TestLog.cur.issues.push(String(text)); },
  line(where,kind,text){ const c=TestLog.cur; if(c&&c.lines.length<40000) c.lines.push(`[${where}] ${kind}｜${text}`); },
  end(pass,fail){ const c=TestLog.cur; if(!c) return; c.pass=pass; c.fail=fail; c.done=new Date().toLocaleString('zh-CN',{hour12:false});
    const runs=TestLog.runs().map(r=>({...r, lines:[], linesDropped:r.lines?r.lines.length:r.linesDropped}));   // older runs keep their results, not their lines
    runs.unshift(c); TestLog.save(runs.slice(0,5)); TestLog.cur=null;
    console.log(`[testlog] ${c.suite}：${pass} 项通过，${fail} 项失败，${c.lines.length} 句，${c.issues.length} 个问题（已保存，#testlog 查看）`); return c; },
  runs(){ try{ return JSON.parse(localStorage.getItem(TestLog.KEY)||'[]'); }catch(e){ return []; } },
  save(runs){ for(let n=runs.length;n>0;n--){ try{ localStorage.setItem(TestLog.KEY, JSON.stringify(runs.slice(0,n))); return; }catch(e){ if(runs[0]) runs[0].lines=runs[0].lines.slice(0,Math.floor(runs[0].lines.length/2)); } } },
  text(r){ const L=[`山海问道 · ${r.suite}自检`, `版本 ${r.build}　开始 ${r.at}　结束 ${r.done||'（没跑完）'}　页面 ${r.view[0]}×${r.view[1]}`, `结果：${r.pass} 项通过，${r.fail} 项失败`, ''];
    if(r.issues.length) L.push('问题：', ...r.issues.map(t=>'  ! '+t), '');
    L.push('检查项：', ...r.items.map(i=>`  ${i.ok?'✓':'✗'} ${i.name}${i.info?' — '+i.info:''}`), '');
    L.push(`台词（${r.lines.length} 句${r.linesDropped?`，另有 ${r.linesDropped} 句没有保留`:''}）：`, ...r.lines); return L.join(String.fromCharCode(10)); },
  download(r){ r=r||TestLog.runs()[0]; if(!r) return UI.toast('还没有自检日志');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([TestLog.text(r)],{type:'text/plain;charset=utf-8'}));
    a.download=`山海问道-${r.suite}自检-${r.build}-${(r.done||r.at).replace(/[\/: ]/g,'-')}.txt`; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },1500); },
  // the report's buttons: close, download this run
  buttons(note, onClose){ note.innerHTML=`<button class="btn mini" id="stClose">关闭</button> <button class="btn mini" id="stLog">下载日志</button>　第 3 个存档位已恢复原样。日志已保存（#testlog 查看）。`;
    $('#stClose').onclick=onClose; $('#stLog').onclick=()=>TestLog.download(); },
  // #testlog: the kept runs
  show(){ const runs=TestLog.runs(), el=document.createElement('div'); el.id='selftest';
    el.innerHTML=`<div class="st-box wood"><h3>自检日志（最近 ${runs.length} 次）</h3><ol>${runs.map((r,i)=>`<li class="${r.fail||r.issues.length?'bad':'ok'}">${r.suite} · ${r.build} · ${r.done||r.at}：${r.pass} 项通过${r.fail?`，${r.fail} 项失败`:''}${r.issues.length?`，${r.issues.length} 个问题`:''} <button class="btn mini" data-i="${i}">下载</button></li>`).join('')||'<li>还没有</li>'}</ol><p><button class="btn mini" id="stClose">关闭</button></p></div>`;
    document.body.appendChild(el); el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>TestLog.download(runs[+b.dataset.i])); $('#stClose').onclick=()=>{ el.remove(); UI.title(); }; },
};
if(location.hash==='#testlog') setTimeout(()=>TestLog.show(),600);
