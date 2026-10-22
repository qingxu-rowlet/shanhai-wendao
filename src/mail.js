/* ============================================================
   山海问道 · 信箱 — friends with 4♥ or more sometimes write in the morning and send a small gift.
   Friendships are independent: there is no jealousy, everyone can reach 8♥ at the same time.
   ============================================================ */
SPR.mailbox=['................','.....rrrrrr.....','....rRRRRRRr....','....rRyyyyRr....','....rRRRRRRr....','....rrrrrrrr....','....rrrrrrrr....','.....rrrrrr.....','.......nn.......','.......nn.......','.......nn.......','.......nn.......','......nNnn......','.....nnnnnn.....','................','................'];
MAPS.home.objects.push({type:'mailbox', x:8, y:5, act:'mail', spr:'mailbox'});

// letters by friend; `min` is the hearts needed; gift is items and/or stones
const LETTERS = {
  tang:[
    {min:4, text:'{名}：\n今天在药圃里发现了一株会发光的灵草。想到你天天打坐辛苦，就给你留了两株。\n别笑我啰嗦呀。\n——小棠', gift:{lingcao:2}},
    {min:4, text:'{名}：\n长老教我配回春丹，我多做了一颗。\n你那么爱逞强，肯定用得上……\n不许又受伤了。\n——小棠', gift:{huichun:1}},
    {min:6, text:'{名}：\n昨晚又梦见池塘边的晚霞了。\n……这句话写完我就后悔了，可是信已经折好了。\n附上一朵野山茶，是今早刚开的。\n——小棠', gift:{flower:1, huichun:1}},
    {min:8, text:'{名}：\n花笺我又做了一张，这次先不给你看。\n等下次灯会，我再亲手交给你。\n先送你一包我晒的灵草茶，打坐前喝一杯，心会静一些。\n——小棠', gift:{juqi:1, lingcao:2}},
  ],
  ge:[
    {min:4, text:'路过山林，顺手斩了一只当康。\n皮给你，找钱掌柜做件护甲。\n——顾', gift:{hide:2}},
    {min:4, text:'北边传来消息，饕餮的踪迹又近了一些。\n你小心。\n附聚气丹一颗，别省着。\n——顾长歌', gift:{juqi:1}},
    {min:6, text:'今晚月色很好。\n……没什么事。\n朱果给你，路边摘的。\n——顾', gift:{zhuguo:2}},
    {min:8, text:'剑穗旧了，我换了一条新的。\n旧的那条……你要是不嫌弃，就留着。\n另附两颗回春丹。下次别一个人去狐祠。\n——长歌', gift:{huichun:2}},
  ],
  ahe:[
    {min:4, text:'{名}！\n芦花今天下了一个双黄蛋！奶奶说要谢谢你，让我给你送点灵草～\n——阿禾', gift:{lingcao:2}},
    {min:6, text:'{名}：\n奶奶的咳嗽全好啦！这是她亲手晒的灵菇干，说是给修士补身子的。\n——阿禾（字是奶奶帮我写的）', gift:{lingmo:3}},
  ],
  qian:[
    {min:4, text:'老主顾：\n本店新到一批货，给您的一点心意，望笑纳。\n有好货记得先拿来我这儿！\n——钱记杂货 钱掌柜', gift:{stones:50}},
    {min:6, text:'老主顾：\n城里药铺又来订灵草了，托您的福生意兴隆。\n这是分成，童叟无欺。\n——钱掌柜', gift:{stones:120}},
  ],
  yunyou:[
    {min:4, text:'{名}：\n老道云游到南边，见此丹成色不错，寄你一颗。\n修行莫懈怠，也莫太累。\n——云游子', gift:{juqi:1}},
    {min:6, text:'{名}：\n南边的山里也有狐火，想起青丘。\n你若遇见那只九尾狐，替老道问声好。\n——云游子', gift:{huichun:1, juqi:1}},
  ],
};
for(const k in SECTS){ const m=SECTS[k].master; LETTERS[m.id]=[
  {min:4, text:`{称}：\n为师寄你一颗聚气丹。宗门的功课，回来再补也不迟。\n——${m.name}`, gift:{juqi:1}},
  {min:6, text:`{称}：\n你的几位师兄师姐都在念叨你，问你什么时候回宗门。\n先寄些盘缠给你。\n——${m.name}`, gift:{stones:80}}]; }

const Mail = {
  list(){ S.mail=S.mail||[]; return S.mail; },
  unread(){ return Mail.list().filter(m=>!m.read).length; },
  newDay(){
    if(!S.rel) return; let sent=0; const ids=Object.keys(NPCS).sort(()=>Math.random()-.5);
    for(const id of ids){
      if(sent>=2) break; const h=Social.hearts(id); if(h<4||!LETTERS[id]) continue;
      const rom=NPCS[id].romance, chance=rom?(h>=8?.45:h>=6?.35:.25):(h>=6?.18:.1);
      if(Math.random()>=chance) continue;
      const pool=LETTERS[id].map((l,i)=>[l,i]).filter(([l])=>h>=l.min), seen=(S.mailSeen=S.mailSeen||{})[id]||[];
      const fresh=pool.filter(([,i])=>!seen.slice(-2).includes(i)), pick=(fresh.length?fresh:pool)[Math.floor(Math.random()*(fresh.length||pool.length))];
      if(!pick) continue; S.mailSeen[id]=[...seen,pick[1]].slice(-4);
      Mail.list().unshift({id, from:NPCS[id].name, li:pick[1], day:S.day, read:false, taken:false}); sent++;
    }
    if(Mail.list().length>30) S.mail=Mail.list().slice(0,30);
  },
  open(){
    const L=Mail.list();
    UI.panel('信箱', L.length?`<p class="muted">好感 4 心以上的朋友，偶尔会在清晨寄信和小礼物来。大家的好感各自独立，不会吃醋～</p><div class="mails">${L.map((m,i)=>`<button class="mailrow${m.read?'':' new'}" data-m="${i}"><b>${esc(m.from)}</b><span>第 ${m.day} 天${m.taken||!Mail.gift(m)?'':' · 附礼物'}</span></button>`).join('')}</div>`
      :'<p class="muted">信箱空空的。和镇上的人多聊聊天、送送礼物，好感 4 心以上的朋友会偶尔寄信来。</p>', b=>{
      b.querySelectorAll('[data-m]').forEach(x=>x.onclick=()=>{ Sound.tick(); Mail.read(+x.dataset.m); }); });
  },
  gift(m){ const l=LETTERS[m.id]&&LETTERS[m.id][m.li]; return l?l.gift:null; },
  read(i){
    const m=Mail.list()[i]; if(!m) return; m.read=true; const l=LETTERS[m.id][m.li], g=l.gift||{};
    const text=l.text.replace(/\{名\}/g,S.name).replace(/\{称\}/g,S.look&&S.look.g==='f'?'小师妹':'小师弟');
    const gifts=Object.entries(g).map(([k,n])=>k==='stones'?`灵石 ×${n}`:`${ITEMS[k].name} ×${n}`).join('、');
    UI.panel('来自 '+esc(m.from)+' 的信', `<div class="letter">${esc(text).replace(/\n/g,'<br>')}</div>${gifts?`<div class="lgift">随信附上：${gifts}</div>`:''}
      <div class="mg-btns">${gifts&&!m.taken?'<button class="btn main" id="mTake">收下</button>':''}<button class="btn" id="mBack">返回信箱</button></div>`, b=>{
      const tk=$('#mTake'); if(tk) tk.onclick=()=>{ for(const [k,n] of Object.entries(g)){ if(k==='stones') S.stones+=n; else addItem(k,n); } m.taken=true; Sound.coin(); UI.toast('收下了：'+gifts); UI.closePanel(); Mail.open(); };
      $('#mBack').onclick=()=>{ UI.closePanel(); Mail.open(); }; });
    UI.hud();
  },
  drawFlag(g, ox, oy, T, Z){
    if(!Mail.unread()) return; const o=RT.ents.find(x=>x.type==='mailbox'); if(!o) return;   // the mailbox at home, or the one in the sect
    const cx=ox+(o.x+.5)*T, cy=oy+o.y*T-6*Z+Math.sin(RT.t*5)*1.5*Z;
    g.fillStyle='#c8413b'; g.beginPath(); g.arc(cx,cy,5*Z,0,7); g.fill(); g.strokeStyle='#fff3dc'; g.lineWidth=Z*.8; g.stroke();
    g.fillStyle='#fff3dc'; g.font=`bold ${Math.round(8*Z)}px system-ui,Arial,sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText('!',cx,cy+Z*.4);
  },
};
{ const _nd=Hooks.newDay; Hooks.newDay=function(){ _nd.apply(this,arguments); Mail.newDay(); }; }
