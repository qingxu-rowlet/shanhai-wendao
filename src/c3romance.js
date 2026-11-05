/* ============================================================
   山海问道 · 第三章 · 萧烬的心动事件 — met in the 小巷 at night (聊天 there, once the hearts are in):
   2♥「瘸腿的狗」 he splints the stray's leg; a wolf taught him how.
   4♥「赌一局」 at 千金坊's back table, a bet with no stakes but this: the loser answers one question, truthfully.
   6♥「屋顶」 on a roof over the sleeping city; what he does for the 国师, and why.
   8♥「草窝」 the little grave on 安平村's back hill, with flowers on it that never wilt: his mother's. The one who killed
        her was your 大师兄. He has known all along whose 师弟/师妹 you are.
   Each has a picture. His 好感 and 敌意 move with what you answer.
   ============================================================ */
const XJ_DOG=()=>JA6.dog();
Object.assign(PXSCENES,{
  xj_alley:{ gy:.86, base(g,W,H,R){ PX.sky(g,W,0,H*.3,['#0a0e1c','#141c32','#1e2844']); PX.stars(g,W,H*.25,R,30); PX.orb(g,W*.5,H*.12,6,'#ece6cc','#4a5070');
      PX.r(g,0,H*.2,W*.3,H*.7,'#2a2a34'); PX.r(g,W*.7,H*.2,W*.3,H*.7,'#30303a'); for(let y=H*.22;y<H*.86;y+=4) for(let x=0;x<W;x+=6){ if(x>W*.3&&x<W*.7) continue; PX.r(g,x+(y/4%2)*3,y,5,1,'#24242c'); }
      PX.r(g,W*.3,H*.2,W*.4,H*.66,'#1a1a22'); PX.r(g,0,H*.86,W,H*.14,'#22222a'); PX.r(g,W*.38,H*.86,W*.24,H*.14,'#2e3040');
      PX.lantern(g,W*.24,H*.42,true); g.fillStyle='rgba(255,170,90,.15)'; g.fillRect(W*.14,H*.4,W*.2,H*.5); },
    cast:[{who:'me',beats:[{at:0,x:-.15,pose:'stand',face:1},{at:1,x:.3,pose:'stand',face:1},{at:3,x:.42,pose:'kneel',face:1}]},
          {look:LOOK_XIAO,beats:[{at:0,x:.62,pose:'crouch',face:-1},{at:5,x:.62,pose:'stand',face:-1}]}, {get cv(){ return XJ_DOG(); }, x:.52, y:.88, s:1.4, face:1}]},
  xj_dice:{ gy:.86, base(g,W,H,R){ PX.r(g,0,0,W,H,'#2a1a14'); for(let x=0;x<W;x+=8) PX.r(g,x,0,1,H*.8,'#3a2418');
      PX.r(g,0,H*.62,W,H*.04,'#5e3a20'); PX.r(g,W*.2,H*.5,W*.6,H*.14,'#2a6a3a'); PX.r(g,W*.2,H*.5,W*.6,2,'#3a8a4a'); PX.r(g,W*.48,H*.38,8,10,'#a8803a'); PX.r(g,W*.48,H*.38,8,2,'#c8a050');
      for(const [x,y] of [[.3,.56],[.66,.55]]){ PX.r(g,W*x,H*y,3,3,'#f0ece0'); PX.r(g,W*x+1,H*y+1,1,1,'#c8413b'); }
      PX.lantern(g,W*.12,H*.2,true); PX.lantern(g,W*.88,H*.2,true); g.fillStyle='rgba(255,180,90,.12)'; g.fillRect(0,0,W,H); },
    cast:[{who:'me',x:.26,pose:'sit',face:1},{look:LOOK_XIAO,x:.74,pose:'sit',face:-1}]},
  xj_roof:{ gy:.62, base(g,W,H,R){ PX.sky(g,W,0,H*.62,['#05081a','#0c1430','#1a2448','#2a3460']); PX.stars(g,W,H*.5,R,90); PX.orb(g,W*.8,H*.16,9,'#f4f0dc','#5a6490');
      for(let k=0;k<7;k++){ const x=W*(k/6), y=H*(.7+R()*.08); PX.roof(g,x,y,W*.14,'#141828','#1c2236'); PX.r(g,x-W*.05,y+6,W*.1,H,'#0e1220'); if(R()<.6) PX.r(g,x+R()*8-4,y+9,2,2,'#f0c060'); }
      for(let x=0;x<W;x++){ const y=Math.round(H*.62+Math.abs(x-W*.5)*.04); PX.r(g,x,y,1,3,x%4<2?'#3a3e4c':'#2e3240'); } },
    cast:[{who:'me',x:.38,pose:'sit',face:1},{look:LOOK_XIAO,x:.56,pose:'sit',face:-1}]},
  xj_grave:{ gy:.84, base(g,W,H,R){ PX.sky(g,W,0,H*.6,['#2a1a24','#6a3a3a','#c8784a','#e8b070']); PX.orb(g,W*.2,H*.5,10,'#f8d090','#c87850');
      PX.ridge(g,W,H,H*.56,H*.1,'#4a3a3a','#5a4440',R); PX.ridge(g,W,H,H*.66,H*.06,'#3a3030',null,R);
      PX.r(g,0,H*.84,W,H*.16,'#4a4a30'); for(let i=0;i<40;i++) PX.grass(g,R()*W,H*(.86+R()*.12),'#3a4a28','#5a6a38');
      PX.rock(g,W*.5,H*.86,W*.14,H*.08); for(const dx of [-3,-1,1,3]) PX.r(g,W*.5+dx*2,H*.8,1,4,'#2a2420');            // the little cairn, four claw marks
      for(const [dx,c] of [[-8,'#f2f2a0'],[-5,'#f5a3c0'],[6,'#ffffff'],[9,'#b9a3f5']]) PX.flower(g,W*.5+dx,H*.84,c);
      PX.tree(g,W*.86,H*.86,H*.34,R,'pine',{d:'#1a1a14',m:'#24261c',l:'#34382a',t:'#1a1a14'}); },
    cast:[{who:'me',x:.28,pose:'stand',face:1},{look:LOOK_XIAO,beats:[{at:0,x:.6,pose:'kneel',face:-1},{at:6,x:.6,pose:'stand',face:-1}]}]},
});
HEART_CG.xiao={
  2:{scene:'xj_alley', title:'瘸腿的狗', steps:[
    ['旁白','夜里的小巷。那条瘸腿的黄狗趴在萧烬脚边，哼哼唧唧的。'],
    ['萧烬','（他折断一根竹片，削得又平又直）……帮我按住它。'],
    ['旁白','你蹲下来，按住黄狗。萧烬捏着它的后腿，一摸，一拉，「咔」的一声。黄狗惨叫了一声，然后不叫了。'],
    ['旁白','他用竹片夹住那条腿，拿布条一圈一圈地缠紧。手很稳。'],
    ['萧烬','好了。过半个月，能跑。'],
    {choice:'你想说：', options:[{text:'你从哪儿学的？', go:'xj2a'},{text:'（摸了摸黄狗的头）', go:'xj2b'}]}]},
  4:{scene:'xj_dice', title:'赌一局', steps:[
    ['旁白','千金坊的后堂，只点了一盏灯。萧烬坐在桌子那头，手里转着骰盅。'],
    ['萧烬','赌一局？'],
    ['萧烬','不赌灵石。输的人，回答对方一个问题。'],
    ['萧烬','必须说真话。'],
    ['旁白','骰盅「啪」地扣在桌上。'],
    {choice:'押——', options:[{text:'大', go:'xj4w'},{text:'小', go:'xj4l'}]}]},
  6:{scene:'xj_roof', title:'屋顶', steps:[
    ['旁白','萧烬带你上了屋顶。整个京城睡着了，屋脊一道一道排到天边。'],
    ['萧烬','（他躺下来，枕着胳膊）我第一次进京城，也是在屋顶上睡的。'],
    ['萧烬','没有钱，没有人认识我。只有一身狼味。'],
    ['萧烬','后来有一个人找到我。他说，你鼻子灵，替我找人。我给你一个位置。'],
    ['我','……国师？'],
    ['萧烬','（他没有回答，只是看着天）我替他找的人，都很好找。没有人会找他们。'],
    {choice:'你：', options:[{text:'那些人，后来去哪儿了？', go:'xj6a'},{text:'（陪他看星星，什么也不问）', go:'xj6b'},{text:'你不该替他做事。', go:'xj6c'}]}]},
  8:{scene:'xj_grave', title:'草窝', steps:[
    ['旁白','黄昏。安平村的后山。那个小小的石堆还在，石头上四道爪痕。石堆前的野花，开得正好。'],
    ['萧烬','（他跪下来，把一束新摘的野花放在石堆前）……每年都开。'],
    ['萧烬','因为每年，我都来。'],
    ['旁白','你想起来了。那一年，大师兄说过：草窝里的狼妖，到死都挡在洞口。'],
    ['萧烬','这里埋的，是我娘。'],
    ['萧烬','我是她从雪地里叼回来的。她把我养大。'],
    ['萧烬','那年我七岁。我趴在草丛里，看着一个穿你们宗门衣服的人，一剑刺穿了她。'],
    ['萧烬','（他看着你）……你的大师兄。'],
    ['萧烬','我一直都知道，你是他的什么人。'],
    {choice:'你：', options:[{text:'他是我大师兄。我替他向你赔罪。', go:'xj8a'},{text:'他已经不在了。他被穷奇吃了。', go:'xj8b'},{text:'……你想报仇吗？', go:'xj8c'}]}]},
};
Object.assign(SCRIPTS,{
  xj2a:[['萧烬','狼教的。'],['萧烬','我娘的腿也断过一回。她自己咬着一根树枝，躺了一个月。我在旁边看着。'],['萧烬','……看会了。'],{love:{xiao:40}},{cgend:true}],
  xj2b:[['旁白','黄狗舔了舔你的手。'],['萧烬','（他看着你，很久）……它不怕你。'],['萧烬','它怕人。'],{love:{xiao:50}},{cgend:true}],
  xj4w:[['旁白','开！四、五、六——大。'],['萧烬','（他笑了一下）你赢了。问吧。'],{choice:'你问：', options:[{text:'你为什么帮我？', go:'xj4q1'},{text:'你娘，是什么样的？', go:'xj4q2'}]}],
  xj4q1:[['萧烬','……'],['萧烬','因为在山脊上，你没有杀我的狼。'],['萧烬','你本来可以的。'],{love:{xiao:50}},{cgend:true}],
  xj4q2:[['萧烬','（他愣了一下，很久没有说话）'],['萧烬','……她是一头狼。灰的。左耳缺了一块。'],['萧烬','她很凶。可她从来没有咬过我。'],{love:{xiao:60}},{cgend:true}],
  xj4l:[['旁白','开！一、二、二——小。'],['萧烬','我赢了。'],['萧烬','（他把骰盅推到一边，看着你）……你怕不怕我？'],{choice:'说真话：', options:[{text:'怕。', go:'xj4f'},{text:'不怕。', go:'xj4n'}]}],
  xj4f:[['萧烬','（他点了点头）……好。'],['萧烬','说实话的人，比不怕的人少。'],{love:{xiao:40}},{cgend:true}],
  xj4n:[['萧烬','（他看了你很久，然后笑了，笑得很温和）……傻子。'],{love:{xiao:50}},{cgend:true}],
  xj6a:[['萧烬','（他翻了个身，背对着你）……别问。'],['萧烬','问了，你就不会再上来了。'],{love:{xiao:20}},{run:()=>{ XX.st().hate+=5; }},{cgend:true}],
  xj6b:[['旁白','一颗流星划过去。你们谁也没有说话。'],['萧烬','（过了很久，他轻轻地说）……从来没有人陪我看过。'],{love:{xiao:60}},{cgend:true}],
  xj6c:[['萧烬','（他坐起来，看着你）我该替谁做事？'],['萧烬','你们宗门？'],['旁白','他没有生气。可那句话，像一把刀。'],{love:{xiao:30}},{run:()=>{ XX.st().hate+=10; }},{cgend:true}],
  xj8a:[['萧烬','（他看着你，没有说话）'],['萧烬','……你替他赔罪。'],['萧烬','你知道这有多可笑吗？'],['萧烬','（他转过头去，声音低了下去）……可是没有人对我说过这句话。十几年了，一个也没有。'],{love:{xiao:80}},{run:()=>{ XX.st().hate=Math.max(0,XX.st().hate-10); }},{cgend:true}],
  xj8b:[['萧烬','（他愣住了）……被穷奇吃了？'],['萧烬','（他忽然笑了起来，笑得停不下来，笑到最后，声音变了）……那我恨了这么多年，恨的是什么。'],['旁白','你在他身边坐下。他没有推开你。'],{love:{xiao:70}},{cgend:true}],
  xj8c:[['萧烬','想过。'],['萧烬','想了十几年。'],['萧烬','（他看着你）后来我遇见了你。'],['萧烬','……我不知道了。'],{love:{xiao:60}},{run:()=>{ XX.st().hate+=5; }},{cgend:true}],
});
// in his 人物 tab, the events can be watched again like everyone's
