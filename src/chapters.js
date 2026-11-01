/* ============================================================
   山海问道 · 章节交接单 — what each chapter needs when it starts and what it leaves when it ends, written down once.
   「从第 N 章开始」, the review saves, the developer panel and the self-tests all build their saves from here, so a save
   made for testing looks like one a player really has.
     第一章「青丘狐影」 leaves: 筑基 (炼气九层圆满 → 筑基初期), roots tested, a sect, 穷奇 driven off, 九尾狐 befriended,
       苏小棠 and 顾长歌 known (their hearts are the player's own), the fox hair (kept for good).
     第二章「秘境」 needs only that; it leaves its own list below.
   ============================================================ */
const Chapters={
  C1:{ name:'青丘狐影',
    flags:{intro_done:true, chest:true, met_ahe:true, sect_open:true, qiongqi_done:true, tang_sect:true, huli_friend:true, chapter1_done:true},
    inv:{hu_wei:1},
    // fill in whatever a finished chapter one has that this save lacks (never takes anything away, never moves the quest)
    ensure(s,o={}){ Object.assign(s.flags, Chapters.C1.flags); for(const k in Chapters.C1.inv) if(!s.inv[k]) s.inv[k]=Chapters.C1.inv[k];
      s.L=Math.max(s.L||0,10); s.root=s.root||{els:['火','木','水'],n:3}; s.sect=o.sect||s.sect||'jian';
      if(s.sect==='shou'&&!s.pet) s.pet={kind:'dangkang',lv:3,xp:0};       // 万兽谷 disciples have a companion by then
      s.side=s.side||{}; if(!s.side.zhenfeng&&!s.flags.fx_rematch) s.side.zhenfeng='active';   // the master's 传音 about 狂暴穷奇 comes right after 拜师
      return s; },
    // a save standing at the end of chapter one, before the master in the square
    end(s,o){ Chapters.C1.ensure(s,o); s.quest=s.questStarted=QUESTS.findIndex(q=>q.id==='end'); s.track='main'; return s; },
  },
  /* 第二章「秘境」 leaves: back in the sect after the 秘境, 筑基后期 (the three bosses carry a player there), 大师兄 inside
     穷奇 (lu_gone), 二师兄 gone north with 顾长歌 (c2_man_gone), the 八卦镜 sealed away by the master (not in the pack),
     大师兄's jade token. Taken from a save played to the end (#selftest2's epilogue).
     What the player chose along the way is theirs and is not filled in: c2_defend_xie (spoke up for 大师姐), c2_mc_looked
     (looked into the shard), c2_mold, c2_trust_man, c2_bun, c2_ge_r (what you said to 顾长歌), c2_lu_mourn. */
  C2:{ name:'秘境',
    flags:{c2_arrive:true, c2_order:true, c2_depart:true, lu_gone:true, c2_cliff_in:true, c2_token:true, c2_mirror:true, c2_qq_sealed:true,
      c2_xin_night:true, c2_xin_start:true, c2_lake_in:true, c2_xin_met:true, c2_xin_done:true, c2_man_gone:true,
      c2_south_in:true, c2_ge_met:true, c2_cave_in:true, c2_dream_in:true, c2_mc_shard:true, c2_awake:true, c2_sealed:true, c2_man_saved:true,
      c2_back:true, c2_master_back:true, c2_done:true},
    inv:{c2_lutoken:1},
    ensure(s,o={}){ Chapters.C1.ensure(s,o); Object.assign(s.flags, Chapters.C2.flags); for(const k in Chapters.C2.inv) if(!s.inv[k]) s.inv[k]=Chapters.C2.inv[k];
      delete s.inv.c2_bagua; s.L=Math.max(s.L,12);
      if(typeof C2!=='undefined'&&!s.c2){ s.c2=C2.fresh(); s.c2.days=6; s.c2.counted=s.c2.n; }
      return s; },
    // a save in the sect after chapter two, the morning after the master put the mirror away
    end(s,o){ Chapters.C2.ensure(s,o); s.quest=s.questStarted=QUESTS.findIndex(q=>q.id==='c2z'); s.track='main'; return s; },
  },
};
