/* ============================================================
   山海问道 · music: a tiny pentatonic sequencer (guzheng, flute, drums, drone) built on WebAudio
   Each theme is generated from a mode, a tempo and a few motifs, so nothing needs to be downloaded.
   ============================================================ */
const Music = (()=>{
  let ac=null, master=null, cur=null, timer=null, nextT=0, step=0, enabled=true;
  const MODES = { gong:[0,2,4,7,9], shang:[0,2,5,7,10], jue:[0,3,5,8,10], zhi:[0,2,5,7,9], yu:[0,3,5,7,10] };
  const THEMES = {
    day:   {mode:'gong', root:62, bpm:84,  feel:'pluck', drum:0,   drone:0,   flute:.35, density:.55, motif:[0,2,4,2,1,0,-1,0, 2,4,5,4,2,1,0,0]},
    night: {mode:'yu',   root:57, bpm:60,  feel:'flute', drum:0,   drone:.04, flute:.8,  density:.3,  motif:[0,0,2,1,0,-1,-2,0, 1,2,4,2,1,0,-1,-1], crickets:true},
    town:  {mode:'zhi',  root:64, bpm:100, feel:'pluck', drum:.3,  drone:0,   flute:.3,  density:.7,  motif:[0,1,2,4,2,1,2,0, 4,5,4,2,1,2,1,0]},
    forest:{mode:'yu',   root:57, bpm:92,  feel:'pluck', drum:.45, drone:.05, flute:.25, density:.5,  motif:[0,-1,0,2,1,0,-2,-1, 0,2,3,2,0,-1,-2,0]},
    battle:{mode:'shang',root:59, bpm:132, feel:'pluck', drum:.9,  drone:.06, flute:0,   density:.85, motif:[0,2,1,0,3,2,1,2, 0,4,3,2,1,0,-1,0]},
    qiongqi:{mode:'shang',root:52,bpm:148, feel:'tremolo',drum:1,  drone:.1,  flute:0,   density:.9,  motif:[0,0,3,2,0,-1,0,2, 4,3,2,0,-1,-2,-1,0], gong:true},
    huli:  {mode:'jue',  root:60, bpm:96,  feel:'bell',  drum:.5,  drone:.08, flute:.7,  density:.6,  motif:[4,2,3,1,2,0,1,-1, 0,2,4,5,4,2,1,0]},
    taotie:{mode:'yu',   root:45, bpm:70,  feel:'pluck', drum:1,   drone:.14, flute:0,   density:.35, motif:[0,0,-1,0,1,0,-2,-1, 0,0,1,2,1,0,-1,0], gong:true},
    calm:  {mode:'gong', root:60, bpm:70,  feel:'bell',  drum:0,   drone:.05, flute:.6,  density:.4,  motif:[0,2,4,7,4,2,0,-1, 0,2,4,2,0,-1,-2,0]},
  };
  const midi=n=>440*Math.pow(2,(n-69)/12);
  function ensure(){ if(ac) return ac; try{ ac=new (window.AudioContext||window.webkitAudioContext)(); master=ac.createGain(); master.gain.value=.5; master.connect(ac.destination); }catch(e){ ac=null; } return ac; }
  function note(th, deg, oct=0){ const sc=MODES[th.mode], n=sc.length; const o=Math.floor(deg/n), i=((deg%n)+n)%n; return th.root+sc[i]+12*(o+oct); }
  function pluck(t, f, vol, dur=1.2){ const o=ac.createOscillator(), o2=ac.createOscillator(), g=ac.createGain(), lp=ac.createBiquadFilter();
    o.type='triangle'; o2.type='sawtooth'; o.frequency.value=f; o2.frequency.value=f*1.003; lp.type='lowpass'; lp.frequency.setValueAtTime(f*6,t); lp.frequency.exponentialRampToValueAtTime(f*1.5,t+dur*.6);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.006); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    const g2=ac.createGain(); g2.gain.value=.25; o.connect(lp); o2.connect(g2).connect(lp); lp.connect(g).connect(master); o.start(t); o2.start(t); o.stop(t+dur+.05); o2.stop(t+dur+.05); }
  function bell(t,f,vol){ const o=ac.createOscillator(), m=ac.createOscillator(), mg=ac.createGain(), g=ac.createGain();
    o.type='sine'; m.type='sine'; o.frequency.value=f; m.frequency.value=f*3.5; mg.gain.value=f*1.2; m.connect(mg).connect(o.frequency);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol*.8,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+2.2); o.connect(g).connect(master); o.start(t); m.start(t); o.stop(t+2.3); m.stop(t+2.3); }
  function flute(t,f,vol,dur){ const o=ac.createOscillator(), v=ac.createOscillator(), vg=ac.createGain(), g=ac.createGain();
    o.type='sine'; o.frequency.value=f; v.frequency.value=5.2; vg.gain.value=f*.012; v.connect(vg).connect(o.frequency);
    g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(vol,t+.12); g.gain.setValueAtTime(vol,t+dur*.7); g.gain.linearRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(master); o.start(t); v.start(t); o.stop(t+dur+.05); v.stop(t+dur+.05); }
  let noiseBuf=null; function noise(){ if(noiseBuf) return noiseBuf; noiseBuf=ac.createBuffer(1,ac.sampleRate*.5,ac.sampleRate); const d=noiseBuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1; return noiseBuf; }
  function drum(t,vol,low){ const o=ac.createOscillator(), g=ac.createGain(); o.type='sine'; o.frequency.setValueAtTime(low?70:140,t); o.frequency.exponentialRampToValueAtTime(low?38:70,t+.18);
    g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+.3); o.connect(g).connect(master); o.start(t); o.stop(t+.32);
    const s=ac.createBufferSource(), sg=ac.createGain(), f=ac.createBiquadFilter(); s.buffer=noise(); f.type='bandpass'; f.frequency.value=low?300:1800; sg.gain.setValueAtTime(vol*.4,t); sg.gain.exponentialRampToValueAtTime(.0001,t+.09);
    s.connect(f).connect(sg).connect(master); s.start(t); s.stop(t+.1); }
  function gongHit(t,vol){ [1,1.48,2.02,2.7].forEach((r,i)=>{ const o=ac.createOscillator(), g=ac.createGain(); o.type='sine'; o.frequency.value=110*r; g.gain.setValueAtTime(vol/(i+1),t); g.gain.exponentialRampToValueAtTime(.0001,t+3); o.connect(g).connect(master); o.start(t); o.stop(t+3.1); }); }
  function cricket(t){ for(let i=0;i<3;i++){ const o=ac.createOscillator(), g=ac.createGain(); o.type='square'; o.frequency.value=4200+Math.random()*300; const s=t+i*.06;
    g.gain.setValueAtTime(.0001,s); g.gain.exponentialRampToValueAtTime(.012,s+.01); g.gain.exponentialRampToValueAtTime(.0001,s+.04); o.connect(g).connect(master); o.start(s); o.stop(s+.05); } }
  let droneNodes=null;
  function setDrone(th){ if(droneNodes){ droneNodes.g.gain.setTargetAtTime(.0001,ac.currentTime,.4); const d=droneNodes; setTimeout(()=>{ try{ d.o1.stop(); d.o2.stop(); }catch(e){} },1500); droneNodes=null; }
    if(!th||!th.drone) return; const o1=ac.createOscillator(), o2=ac.createOscillator(), g=ac.createGain(), lp=ac.createBiquadFilter();
    o1.type='sawtooth'; o2.type='sawtooth'; o1.frequency.value=midi(th.root-12); o2.frequency.value=midi(th.root-12)*1.006; lp.type='lowpass'; lp.frequency.value=320;
    g.gain.value=.0001; g.gain.setTargetAtTime(th.drone,ac.currentTime,.8); o1.connect(lp); o2.connect(lp); lp.connect(g).connect(master); o1.start(); o2.start(); droneNodes={o1,o2,g}; }
  function tick(){
    if(!cur||!ac) return; const th=THEMES[cur], beat=60/th.bpm/2;
    while(nextT < ac.currentTime+0.25){
      const t=nextT, i=step%32, m=th.motif[i%16]+(i>=16&&i%4===3?1:0);
      if(Math.random()<th.density || i%4===0){
        const f=midi(note(th,m));
        if(th.feel==='pluck') pluck(t,f,.16);
        else if(th.feel==='tremolo'){ for(let k=0;k<3;k++) pluck(t+k*beat/3,f,.11,.4); }
        else if(th.feel==='bell') bell(t,f,.12);
        else if(th.feel==='flute' && i%2===0) flute(t,midi(note(th,m,1)),.08,beat*3);
      }
      if(th.flute && i%8===0 && Math.random()<th.flute) flute(t,midi(note(th,th.motif[(i+3)%16]+2,1)),.05,beat*6);
      if(i%8===0) pluck(t,midi(note(th,0,-1)),.12,1.8);                        // bass on the downbeat
      if(th.drum){ if(i%8===0) drum(t,.32*th.drum,true); if(i%8===4) drum(t,.22*th.drum,false); if(th.drum>.8&&i%2===1) drum(t,.07*th.drum,false); }
      if(th.gong && step%64===0) gongHit(t,.12);
      if(th.crickets && Math.random()<.2) cricket(t);
      nextT+=beat; step++;
    }
  }
  /* ---------- composed pieces (古风): written melodies with guzheng / xiao / pipa, arpeggios, bass and percussion ----------
     deg: steps in the pentatonic mode (0 = 宫; 5 = an octave up; -1 = 羽 below). mel: [deg, beats]; null = rest.
     arp: 8 eighth-notes per bar, each an index into the bar's chord. perc: 8 steps — K big drum, s small drum, w woodblock, g gong. */
  const SCORES = {
    village:{ mode:'gong', root:62, bpm:96, lead:'zheng', lead2:'xiao', arp:[0,1,2,1,0,1,2,1], arpVol:.06, bass:[0,2], perc:'..w...w.', bars:[
      {chord:[0,2,3], mel:[[3,1],[4,.5],[3,.5],[2,1],[1,1]]},
      {chord:[-1,1,3], mel:[[2,.5],[3,.5],[2,.5],[1,.5],[0,2]]},
      {chord:[1,3,5], mel:[[1,1],[2,1],[3,1],[5,1]]},
      {chord:[3,5,7], mel:[[6,1.5],[5,.5],[4,2]]},
      {chord:[3,5,7], mel:[[5,1],[6,.5],[5,.5],[3,1],[2,1]]},
      {chord:[-1,1,3], mel:[[3,.5],[2,.5],[1,1],[0,2]]},
      {chord:[-2,0,2], mel:[[-1,1],[0,1],[1,1],[2,1]]},
      {chord:[0,2,3], mel:[[1,1.5],[2,.5],[0,2]]}]},
    battle:{ mode:'shang', root:52, bpm:150, lead:'pipa', arp:[0,0,1,0,0,1,2,1], arpVol:.07, arpLen:.3, bass:[0,1,2,3], perc:'K.sKK.ss', gongEvery:8, bars:[
      {chord:[0,2,3], mel:[[5,.5],[6,.5],[7,1],[8,1],[7,.5],[6,.5]]},
      {chord:[0,2,4], mel:[[7,.5],[8,.5],[9,1],[10,1.5],[9,.5]]},
      {chord:[-1,1,3], mel:[[8,1],[7,.5],[6,.5],[7,1],[5,1]]},
      {chord:[0,2,3], mel:[[6,.5],[5,.5],[4,1],[5,2]]},
      {chord:[2,4,5], mel:[[10,1],[10,.5],[9,.5],[8,1],[9,1]]},
      {chord:[3,5,7], mel:[[10,.5],[11,.5],[12,1],[11,1],[10,1]]},
      {chord:[1,3,5], mel:[[9,.5],[8,.5],[7,.5],[8,.5],[9,1],[7,1]]},
      {chord:[0,2,3], mel:[[6,1],[7,.5],[6,.5],[5,2]]}]},
    romance:{ mode:'gong', root:60, bpm:68, lead:'xiao', arp:[0,1,2,3,2,1,0,1], arpVol:.05, arpLen:1.6, bass:[0], pad:true, bells:true, bars:[
      {chord:[0,2,3,5], mel:[[7,2],[6,1],[7,1]]},
      {chord:[-1,1,3,4], mel:[[8,1.5],[7,.5],[6,2]]},
      {chord:[0,2,4,5], mel:[[5,1],[6,1],[7,1],[8,1]]},
      {chord:[1,3,5,6], mel:[[7,4]]},
      {chord:[3,5,7,8], mel:[[10,2],[9,1],[10,1]]},
      {chord:[1,3,6,8], mel:[[11,1.5],[10,.5],[8,2]]},
      {chord:[-1,1,4,6], mel:[[7,1],[8,1],[7,1],[6,1]]},
      {chord:[0,2,3,5], mel:[[5,4]]}]},
  };
  // iPhone's ring/silent switch mutes Web Audio. Playing a looping silent <audio> element inside a tap moves the page
  // to the "media playback" audio session, so the music is heard even with the switch on silent.
  let unmuted=null;
  function iosUnmute(){
    if(unmuted) return; try{
      const rate=8000, n=rate/4, buf=new ArrayBuffer(44+n*2), v=new DataView(buf), w=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
      w(0,'RIFF'); v.setUint32(4,36+n*2,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
      v.setUint32(24,rate,true); v.setUint32(28,rate*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*2,true);
      unmuted=new Audio(URL.createObjectURL(new Blob([buf],{type:'audio/wav'}))); unmuted.loop=true; unmuted.setAttribute('playsinline',''); unmuted.volume=0.01;
      const p=unmuted.play(); if(p&&p.catch) p.catch(()=>{ unmuted=null; });
    }catch(e){ unmuted=null; }
  }
  let bar=0, barT=0;
  function wood(t){ const o=ac.createOscillator(), g=ac.createGain(); o.type='sine'; o.frequency.setValueAtTime(1500,t); o.frequency.exponentialRampToValueAtTime(900,t+.05);
    g.gain.setValueAtTime(.09,t); g.gain.exponentialRampToValueAtTime(.0001,t+.07); o.connect(g).connect(master); o.start(t); o.stop(t+.08); }
  function pad(t,freqs,dur){ freqs.forEach(f=>{ const o=ac.createOscillator(), g=ac.createGain(); o.type='sine'; o.frequency.value=f/2;
    g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(.028,t+dur*.3); g.gain.linearRampToValueAtTime(.0001,t+dur); o.connect(g).connect(master); o.start(t); o.stop(t+dur+.05); }); }
  function lead(sc,loop,t,f,dur){
    const inst=sc.lead2&&loop%2===1?sc.lead2:sc.lead;
    if(inst==='zheng'){ pluck(t,f,.22,Math.max(.7,dur*1.5)); if(dur>=1) pluck(t+dur*.5,f*1.002,.06,.5); }
    if(inst==='xiao') flute(t,f,.13,Math.max(.25,dur*.97));
    if(inst==='pipa'){ const k=Math.max(1,Math.round(dur/.085)); for(let i=0;i<k;i++) pluck(t+i*dur/k,f,i?.09:.16,.22); }
  }
  function scheduleBar(sc,b,t0,spb,loop,index){
    const n=d=>midi(note(sc,d));
    let t=t0; for(const [d,len] of b.mel){ if(d!=null) lead(sc,loop,t,n(d),len*spb); t+=len*spb; }
    if(sc.arp) sc.arp.forEach((ci,i)=>{ const d=b.chord[ci%b.chord.length]; pluck(t0+i*spb/2, n(d-5), sc.arpVol||.06, sc.arpLen||1.1); });
    (sc.bass||[0]).forEach(bt=>pluck(t0+bt*spb, n(b.chord[0]-10), .15, sc.bpm>120?.5:1.8));
    if(sc.perc) [...sc.perc].forEach((c,i)=>{ const tt=t0+i*spb/2; if(c==='K') drum(tt,.4,true); if(c==='s') drum(tt,.16,false); if(c==='w') wood(tt); });
    if(sc.gongEvery && index%sc.gongEvery===0) gongHit(t0,.14);
    if(sc.pad) pad(t0, b.chord.slice(0,3).map(n), 4*spb);
    if(sc.bells && index%4===3) bell(t0+3*spb, n(b.chord[b.chord.length-1]+5), .05);
  }
  function scoreTick(){
    const sc=SCORES[cur], spb=60/sc.bpm;
    while(barT < ac.currentTime+.35){ const i=bar%sc.bars.length; scheduleBar(sc, sc.bars[i], barT, spb, Math.floor(bar/sc.bars.length), bar); barT+=4*spb; bar++; }
  }
  return {
    THEMES, SCORES,
    debug(){ return {state:ac?ac.state:'none', cur, want:this._want, enabled, time:ac?ac.currentTime:0, gain:master?master.gain.value:0}; },
    unlock(){ if(!ensure()) return; try{ if(ac.state!=='running') ac.resume(); const b=ac.createBuffer(1,1,22050), s=ac.createBufferSource(); s.buffer=b; s.connect(ac.destination); s.start(0); }catch(e){} iosUnmute(); },
    get enabled(){ return enabled; },
    setEnabled(v){ enabled=v; if(!v) this.stop(); else if(this._want) this.play(this._want,true); },
    play(name, force){
      this._want=name; if(!enabled||(S&&S.music===false)) return; if(cur===name&&!force) return; if(!ensure()) return; if(ac.state==='suspended') ac.resume();
      cur=name; step=0; nextT=ac.currentTime+.08; bar=0; barT=ac.currentTime+.1; setDrone(SCORES[name]?null:THEMES[name]); clearInterval(timer); timer=setInterval(()=>SCORES[cur]?scoreTick():tick(),90); SCORES[cur]?scoreTick():tick();
    },
    stop(){ cur=null; clearInterval(timer); if(ac) setDrone(null); },
    stinger(kind){ if(!ensure()||(S&&S.music===false)) return; const t=ac.currentTime+.02;
      if(kind==='boss'){ gongHit(t,.25); drum(t,.5,true); drum(t+.35,.5,true); drum(t+.7,.6,true); }
      if(kind==='win'){ [0,2,4,7].forEach((d,i)=>pluck(t+i*.12,midi(62+[0,2,4,7][i]),.18,1.4)); }
      if(kind==='thunder'){ const s=ac.createBufferSource(), g=ac.createGain(), f=ac.createBiquadFilter(); s.buffer=noise(); f.type='lowpass'; f.frequency.value=900; g.gain.setValueAtTime(.6,t); g.gain.exponentialRampToValueAtTime(.0001,t+.5); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t+.5); drum(t,.6,true); }
    },
  };
})();
function areaTheme(){ if(!RT.mapId) return 'village'; const h=S.min/60; if(h>=19||h<6) return 'night'; return RT.mapId==='forest'?'forest':'village'; }
