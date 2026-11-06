/* ============================================================
   山海问道 · 第三章 — the capital's small stories in the task list (loads after nav.js / chapter2nav.js, which it wraps):
   寻亲, 书生的文章, 卖花的小姑娘, 赌客的债, 老仆的桂花糕, 长命锁. Each shows as 可接 (who to talk to, and where) until you
   start it, then as 支线 with its next step; tracking one and pressing 寻路 walks you there.
   ============================================================ */
const C3S={
  items(){ const F=S.flags; if(!F.c3_sf_in||F.c3_xj_end) return []; const out=[], has=k=>count(S,k)>0;
    const add=(key,kind,title,progress,target)=>out.push({key:'c3s_'+key, kind, tag:kind==='avail'?'可接取':'支线', title, progress, target});
    // 寻亲
    if(!F.c3_sq_qin_ask) add('qin','avail','寻亲','去找朱雀大街城门口那个赶路的人',['jc_zhuque',15,32,'赶路的人']);
    else if(!F.c3_sq_qin_found) add('qin','side','寻亲',F.c3_sq_qin_hint?'赵木匠在西市，给博古斋修架子':'打听赵木匠：东市卖馄饨的也许知道',F.c3_sq_qin_hint?['jc_xishi',20,18,'赵木匠']:['jc_dongshi',21,9,'卖馄饨的']);
    else if(!F.c3_sq_qin_done) add('qin','side','寻亲','回朱雀大街告诉她',['jc_zhuque',15,32,'赶路的人']);
    // 书生的文章
    if(!F.c3_sq_shu_ask) add('shu','avail','书生的文章','去找朱雀大街上的书生',['jc_zhuque',21,13,'书生']);
    else if(!F.c3_sq_shu_print) add('shu','side','书生的文章','把《北村记》拿去西市琅琊阁',['jc_xishi',3,7,'琅琊阁主']);
    else if(!F.c3_sq_shu_done) add('shu','side','书生的文章','回去告诉书生',['jc_zhuque',21,13,'书生']);
    // 卖花的小姑娘
    if(!F.c3_sq_hua_deng) add('hua','avail','卖花的小姑娘','黄昏（六点到九点）去护城河边的花铺门口',['jc_dongkou',21,7,'卖花的小姑娘']);
    else if(!F.c3_sq_hua_done) add('hua','side','卖花的小姑娘','黄昏去河埠头放河灯，写「春娘」',['jc_dongkou',9,12,'河埠头']);
    // 赌客的债
    if(!F.c3_sq_du&&!F.c3_a4_done) add('du','avail','赌客的债','去东市找那个输光了的赌客',['jc_dongshi',12,7,'输光了的赌客']);
    // 老仆的桂花糕
    if(F.c3_xj_met&&!F.c3_xfu_ask) add('gao','avail','萧府外墙','东市再往东，萧府门外有个扫地的老仆',['jc_xiaofu',8,10,'扫地的老仆']);
    else if(F.c3_xfu_ask&&!F.c3_xfu_gao) add('gao','side','老仆的桂花糕',has('jc_gao')?'把桂花糕送给萧烬（宵禁以后，萧府墙角或小巷里）':'去东市小吃铺买一块桂花糕',has('jc_gao')?['jc_xiaofu',19,7,'萧烬（宵禁以后）']:['jc_dongshi',4,6,'小吃铺']);
    // 长命锁
    if(has('jc_lock')&&!F.c3_hd_lock) add('lock','side','长命锁','拿给醉月楼的青禾看看',RT.mapId==='jc_zuiyue'?['jc_zuiyue',9,5,'青禾']:['jc_dongkou',13,7,'醉月楼']);
    return out; },
};
{ const _x=Nav.extraTasks; Nav.extraTasks=()=>[...(_x?_x():[]), ...C3S.items()]; }
{ const _l=Nav.list; Nav.list=function(){ const base=_l.call(Nav), mine=C3S.items(); if(!mine.length) return base;
    const tk=S.track||'main', main=base.filter(x=>x.kind==='main'), rest=base.filter(x=>x.kind!=='main');
    const all=[...main, ...mine.filter(x=>x.kind==='side'), ...rest, ...mine.filter(x=>x.kind==='avail')];
    all.sort((a,b)=>(b.key===tk)-(a.key===tk)); return all.slice(0,3); }; }
{ const _tr=Nav.tracked; Nav.tracked=function(){ if(S.track&&S.track.startsWith('c3s_')){ const it=C3S.items().find(x=>x.key===S.track);
      if(it) return {kind:it.kind, id:it.key, title:it.title, desc:it.progress, progress:it.progress, target:it.target}; S.track='main'; }
    return _tr.call(Nav); }; }
