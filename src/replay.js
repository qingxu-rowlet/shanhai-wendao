/* ============================================================
   山海问道 · 往事回廊 — replay key story moments in a sandbox.
   The current game is copied before the replay and put back afterwards; nothing is saved meanwhile.
   ============================================================ */
const Replay = {
  active:null, snap:null, idle:0, timer:0,
  NODES:[
    {id:'root',    title:'测灵根',        unlock:s=>!!s.root,                desc:'再站到测灵石前（只是回忆，不会改变你的灵根）。'},
    {id:'qiongqi', title:'讨伐穷奇',      unlock:s=>!!s.flags.qiongqi_done,  desc:'狐祠前，与穷奇的第一战。（以炼气五层、三颗回春丹重温）'},
    {id:'zhuji',   title:'筑基 · 心魔与天劫', unlock:s=>s.L>=10,            desc:'服下筑基丹，直面心魔，渡过天劫。'},
    {id:'sect',    title:'拜师大典',      unlock:s=>!!s.sect,                desc:'四大宗门齐聚桃源镇。（可以试试选别的宗门，回忆结束后不会改变）'},
    {id:'huli',    title:'青丘狐影',      unlock:s=>!!s.flags.chapter1_done, desc:'九尾狐道谢，饕餮苏醒。（可以试试另一个问题）'},
  ],
  start(id){
    if(Replay.active) return;
    UI.closePanel(); Replay.snap=JSON.stringify(S); Replay.active=id; Replay.idle=0;
    const st=()=>{ const x=stats(); S.hp=x.hp; S.mp=x.mp; };
    UI.banner('往事 · '+Replay.NODES.find(n=>n.id===id).title);
    setTimeout(()=>{
      if(id==='root'){ S.root=null; Sect.rootTest(()=>{}); }
      if(id==='qiongqi'){ S.L=5; S.sect=null; S.inv.huichun=3; S.flags.qiongqi_done=false; st(); UI.say(SCRIPTS.qiongqi_meet); }
      if(id==='zhuji'){ S.L=9; S.exp=expNeed(9); S.inv.zhuji=1; S.inv.huichun=3; st(); Mini.breakthrough(); }
      if(id==='sect'){ S.sect=null; S.flags.tang_sect=false; S.look={...S.look}; UI.say(SCRIPTS.ceremony, ()=>Sect.choose()); }
      if(id==='huli'){ S.L=Math.max(10,S.L); S.inv.huichun=Math.max(4,S.inv.huichun||0); st(); UI.say(SCRIPTS.huli_meet); }
      clearInterval(Replay.timer); Replay.timer=setInterval(Replay.watch,400);
    },900);
  },
  // the replay ends once the player is back to walking around
  watch(){ if(!Replay.active) return clearInterval(Replay.timer); if(UI.busy()||Battle.s){ Replay.idle=0; return; } if(++Replay.idle>=2) Replay.end(); },
  end(){
    clearInterval(Replay.timer); if(!Replay.active) return; const back=JSON.parse(Replay.snap); Replay.active=null; Replay.snap=null;
    S=back; enterMap(S.map,S.x,S.y); UI.hud(); UI.sync(); Music.play(areaTheme(),true); UI.toast('回忆结束，回到了现在。');
  },
  html(){
    return `<p class="muted">经历过的重要时刻，可以在这里重温。回忆里的一切都不会影响你现在的存档。</p><div class="book">${Replay.NODES.map(n=>{ const ok=n.unlock(S);
      return `<div class="bk ${ok?'':'unk'}"><div class="rp-ico">${ok?'忆':'？'}</div><div><b>${ok?n.title:'尚未经历'}</b><p>${ok?esc(n.desc):'继续推进剧情就会解锁。'}</p>${ok?`<button class="btn mini main" data-replay="${n.id}">重温</button>`:''}</div></div>`; }).join('')}</div>
      <p class="muted">心动事件可以在「人物」页回放。</p>`;
  },
};
