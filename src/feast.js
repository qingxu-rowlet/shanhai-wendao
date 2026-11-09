/* ============================================================
   山海问道 · 吃的喝的 — with gifts gone (bonds.js), what the shops sell is for you: food and drink give you something
   for the rest of the day (until you sleep), as a share of your own strength so it still counts in chapter three:
   桃花酿 attack, 桂花糕 defence, 糖葫芦 life, 明前茶 and 糖人 灵力; 包子 fills you up; 旧书 is read for 修为.
   Different things add up; the same thing twice doesn't. 钱掌柜 also sells 聚气丹 now (灵力 in a fight).
   What was only ever a present (绣帕, 玉簪, 野山茶) is no longer sold; what you have can still be sold.
   In the story, the 桃花酿 is something you bring 顾长歌 (月下拭剑).
   ============================================================ */
const FEAST={
  // k: which stat, p: how much (share of your own); heal: share of life restored now
  FX:{ wine:{k:'atk', p:.15, t:'攻击'}, jc_gao:{k:'def', p:.2, t:'防御'}, jc_hulu:{k:'hp', p:.12, t:'生命上限'},
       jc_tea:{k:'mp', p:.25, t:'灵力上限', fill:true}, jc_tangren:{k:'mp', p:.1, t:'灵力上限'}, jc_bao:{heal:.3} },
  on:()=>S&&S.feast&&S.feast.day===S.day?S.feast:null,
  eat(id){ const f=FEAST.FX[id], it=ITEMS[id]; if(!f) return false;
    if(!f.heal&&FEAST.on()&&(FEAST.on()[f.k]||0)>=f.p){ UI.toast(`今天的${f.t}已经加过了，留着明天吧。`); return true; }   // the same again would be wasted
    addItem(id,-1); Sound.magic();
    if(f.heal){ const st=stats(); S.hp=Math.min(st.hp,S.hp+Math.round(st.hp*f.heal)); UI.toast(`吃了${it.name}，生命恢复`); UI.hud(); save(); return true; }
    if(!FEAST.on()) S.feast={day:S.day}; const fe=S.feast; fe[f.k]=Math.max(fe[f.k]||0,f.p);
    const st=stats(); if(f.fill) S.mp=st.mp; if(f.k==='hp') S.hp=Math.min(st.hp,S.hp+Math.round(st.hp*f.p));
    UI.toast(`${it.name}：今天${f.t} +${Math.round(f.p*100)}%（睡一觉就散了）`); UI.hud(); save(); return true; },
};
// today's food on top of everything else
{ const _st=stats; stats=function(){ const st=_st.apply(this,arguments), fe=FEAST.on(); if(fe) for(const k of ['hp','mp','atk','def']) if(fe[k]) st[k]=Math.round(st[k]*(1+fe[k])); return st; }; }
// eating from the bag / hotbar
for(const id in FEAST.FX) if(ITEMS[id]){ ITEMS[id].use='feast'; const f=FEAST.FX[id];
  ITEMS[id].desc=ITEMS[id].desc.replace(/可以送人。?/,'')+(f.heal?`吃下去恢复 ${f.heal*100}% 生命。`:`服用：今天${f.t} +${Math.round(f.p*100)}%${f.fill?'，灵力回满':''}（到睡觉为止）。`); }
{ const _u=UI.useItem; UI.useItem=function(id){ const it=ITEMS[id]; if(it&&it.use==='feast'&&S.inv[id]) return FEAST.eat(id); return _u.apply(UI,arguments); }; }
// 旧书: read it
if(ITEMS.jc_oldbook){ Object.assign(ITEMS.jc_oldbook,{use:'exp', amount:30}); ITEMS.jc_oldbook.desc+='翻一翻：修为 +30。'; }
// 钱掌柜: 聚气丹 too
if(ITEMS.juqi&&!ITEMS.juqi.price) ITEMS.juqi.price=60; if(!SHOP.sell.includes('juqi')) SHOP.sell.splice(1,0,'juqi');
// presents only: no longer on sale (the 花铺 still has its 河灯 at dusk)
{ const _s=SHOP3.stall; SHOP3.stall=o=>{ const k=RT.mapId+':'+o.act+':'+(o.si!=null?o.si:o.id||'');
    if(k==='jc_zhuque:jcstall:0') return UI.say([['旁白','布摊上挂满了绣帕，一角一角绣着花草。'],['旁白','好看。可你用不上。']]),true;
    if(k==='jc_zhuque:jcstall:1') return UI.say([['旁白','首饰摊上摆着一排玉簪，簪头雕着玉兰、梅花。'],['旁白','你看了一会儿，没有买。']]),true;
    if(k==='jc_dongkou:zyflower:'&&!(typeof HD!=='undefined'&&HD.dusk())) return UI.say([['旁白','花铺门口摆着一桶一桶的鲜花。'],['卖花的','河灯黄昏才有！']]),true;
    return _s(o); }; }
{ const _s=SHOP3.sell; SHOP3.sell=(who,items)=>_s(who,items.filter(([id])=>id!=='flower')); }
SHOP.sell=SHOP.sell.filter(id=>id!=='flower');
// 月下拭剑: you bring him the 桃花酿
if(typeof HEART_CG!=='undefined'&&HEART_CG.ge&&HEART_CG.ge[4]) HEART_CG.ge[4].steps.splice(1,0,['旁白','你带了一壶桃花酿。他看了一眼，接过去，仰头喝了一口。']);
