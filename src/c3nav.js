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
    else if(!F.c3_sq_qin_found) add('qin','side','寻亲',F.c3_sq_qin_hint?'赵木匠在西市，给博古斋修架子':'打听赵木匠：东市卖馄饨的也许知道',F.c3_sq_qin_hint?['jc_xishi',20,18,'赵木匠']:['jc_dongshi',23,10,'卖馄饨的']);
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
    // the other sects' entrants: a favour each, once you've asked (while they're still in the capital)
    const fav=typeof DAY3!=='undefined'?DAY3.st().fav:{}, at=(id)=>{ const o=MAPS.jc_sifang.objects.find(e=>e.id===id); return ['jc_sifang',o.x,o.y,NPCS[id].name]; };
    const FV={
      sf_wulan:['乌兰：找阿毛', ()=>fav.amao==='found'?'带阿毛回四方馆找乌兰':'阿毛跑去东市偷糖人了，去糖人摊底下找找', ()=>fav.amao==='found'?at('sf_wulan'):['jc_dongshi',8,12,'阿毛（糖人摊底下）']],
      sf_wenxuan:['温玄：三枚旧铜钱', ()=>has('c3_coins')?'把前朝铜钱交给温玄（四方馆）':'去西市古董贩子那儿买三枚前朝铜钱（30 灵石）', ()=>has('c3_coins')?at('sf_wenxuan'):['jc_xishi',24,9,'古董贩子']],
      sf_cheng:['程小剑：剑穗', ()=>has('c3_suizi')?'把剑穗还给程小剑（四方馆）':'剑穗被西市的八哥叼走了，去问问鸟贩', ()=>has('c3_suizi')?at('sf_cheng'):['jc_xishi',22,9,'鸟贩']],
      sf_bu:['卜小鱼：小老虎糖人', ()=>has('jc_tangren')?'把糖人给卜小鱼（四方馆）':'去东市糖人师傅那儿买一只小老虎糖人', ()=>has('jc_tangren')?at('sf_bu'):['jc_dongshi',5,11,'糖人师傅']],
    };
    for(const [id,[title,prog,tgt]] of Object.entries(FV)) if(fav[id]==='asked'&&!(typeof LT!=='undefined'&&LT.gone(id))) add('fav_'+id,'side',title,prog(),tgt());
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
