/* ============================================================
   山海问道 · 插画的配乐 — a story picture used to leave the area's everyday tune playing under it. Now each picture has
   music for its mood (heart events keep their own romance theme): a few new moods built on the same little sequencer,
   and the old ones (night, 饕餮, 九尾, 穷奇) where they fit. When the picture closes, the area's music comes back.
   ============================================================ */
Object.assign(Music.THEMES,{
  sorrow: {mode:'yu',   root:55, bpm:54,  feel:'flute', drum:0,   drone:.07, flute:.85, density:.28, motif:[0,-1,-2,0,1,0,-1,-3, -2,-1,0,2,1,0,-1,-2]},    // 悲：往事、牌位、大火
  mystery:{mode:'jue',  root:52, bpm:62,  feel:'bell',  drum:.1,  drone:.11, flute:.35, density:.32, motif:[0,3,2,0,-1,0,3,4, 2,0,-1,-3,-1,0,2,0]},      // 秘：雾、镜、心魔
  tense:  {mode:'shang',root:50, bpm:112, feel:'tremolo',drum:.65,drone:.12, flute:0,   density:.7,  motif:[0,0,1,0,3,2,0,-1, 0,1,3,4,3,1,0,-1]},       // 紧：别出声、封
  epic:   {mode:'gong', root:55, bpm:78,  feel:'pluck', drum:.55, drone:.1,  flute:.5,  density:.6,  motif:[0,2,4,7,4,5,4,2, 4,7,9,7,5,4,2,0], gong:true},   // 壮：雷云、镜收
  solemn: {mode:'gong', root:57, bpm:66,  feel:'bell',  drum:.35, drone:.08, flute:.4,  density:.42, motif:[0,0,2,4,2,0,-1,0, 4,4,5,4,2,0,2,0], gong:true}, // 肃：开幕式
});
const CG_MUSIC={
  // 第二章
  '雾中背影':'mystery', '安平村':'sorrow', '后山':'sorrow', '那一夜':'sorrow', '封':'tense', '心镜湖':'mystery', '九尾':'huli', '镜中人':'mystery',
  '入门那年':'sorrow', '那位师兄':'sorrow', '宗门大比':'sorrow', '洞口':'mystery', '饿':'taotie', '丰年村':'calm', '别出声':'tense', '大火':'sorrow',
  '镜中的你':'mystery', '扣下':'mystery', '饕餮':'taotie', '镜收':'epic', '长歌':'calm', '早课':'calm',
  // 第三章
  '裂开的牌位':'sorrow', '山脊':'night', '心魔':'mystery', '雷云':'epic', '小巷':'night', '开幕式的高台':'solemn', '鼎':'taotie',
};
// 奇遇: by how rare it is
const QY_MUSIC={common:'calm', rare:'mystery', legend:'epic'};
CG.musicFor=o=>{ if(!o) return null; const small=o.small||'';
  if(/^心动事件/.test(small)) return null;                                              // CG.open plays the romance theme itself
  if(/^奇遇/.test(small)){ const q=typeof QIYU!=='undefined'&&QIYU.find(q=>q.title===o.title); return q&&QY_MUSIC[q.tier]||'calm'; }
  return CG_MUSIC[o.title]||'night'; };
{ const _o=PixCG.open; PixCG.open=function(o){ const r=_o.apply(PixCG,arguments); const m=CG.musicFor(o); if(m){ PixCG._music=m; Music.play(m,true); } return r; }; }
// a picture that changes scene under one title (镜中往事 → 后山 → 那一夜) follows the new scene's title
{ const _cg=typeof C2C!=='undefined'&&C2C.cg; if(_cg) C2C.cg=function(n){ const r=_cg.apply(C2C,arguments); const t=$('#cg .cg-title b'), m=t&&CG_MUSIC[t.textContent]; if(m&&Music.debug().cur!==m){ PixCG._music=m; Music.play(m,true); } return r; }; }
// when the picture closes, back to the area's music (heart events already do this in CG.close)
{ const _c=PixCG.close; PixCG.close=function(){ const had=PixCG._music; PixCG._music=null; const r=_c.apply(PixCG,arguments);
    if(had&&!Battle.s&&typeof RT!=='undefined'&&RT.mapId&&!(typeof Gallery!=='undefined'&&Gallery._sb)) Music.play(areaTheme(),true); return r; }; }

/* ---------- the investigation: from the night the losers' carriage turns east (宗门来信) until the thing in the 鼎 is
   dead, the capital no longer sounds like an everyday town. Every 京城 map plays 暗查 (a low drone, tremolo strings,
   a soft drum, slower than 紧); the night carriage and the 地宫 under the 宗庙 play 紧. Afterwards, the town's own music
   again. (Put first, so it wins over the town's everyday tune.) ---------- */
Music.THEMES.suspense={mode:'shang',root:48, bpm:80, feel:'tremolo', drum:.3, drone:.15, flute:.18, density:.42, motif:[0,1,0,-2,0,3,1,0, -1,0,1,3,4,3,1,-2]};
CG.caseTheme=id=>{ const F=S&&S.flags; if(!F||!id||!id.startsWith('jc_')||!F.c3_lt_done||F.c3_a5_win) return null;
  return id==='jc_yejie'||id==='jc_digong'?'tense':'suspense'; };
On._theme.unshift(CG.caseTheme);
