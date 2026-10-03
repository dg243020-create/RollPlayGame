// ===== ストーリー: 冒頭〜ゼノア案内 (index.html の </body> の直前で読み込む) =====
(()=>{
const BGMDIR='BGM/'; // BGM/mati1.mp3
let bgm=null;
function playBGM(n){if(bgm)bgm.pause();bgm=new Audio(BGMDIR+n+'.mp3');bgm.loop=true;bgm.volume=.5;bgm.play().catch(()=>{})}
P.name='アルト';P.tour=0;
const Ru='ルミ',L=(n,t)=>({n,t});
let DQ=[],DI=0,DCB=null,DCH=null,CI=0;
$('ttext').style.whiteSpace='pre-line';
$('tbox').onclick=()=>{if(state=='talk')nextLine()};
function scene(q,cb){DQ=q.slice();DI=0;DCB=cb||null;state='talk';nextLine()}
function showCh(){talk('',DCH.o.map((c,i)=>(i==CI?'▶ ':'　 ')+c.t).join('\n'))}
function nextLine(){
 const l=DQ[DI++];
 if(!l){state='play';talkClear();const f=DCB;DCB=null;if(f)f();return}
 if(l.o){DCH=l;CI=0;state='choice';showCh();return}
 if(l.as){l.as(nextLine);return}
 if(l.fn){l.fn();nextLine();return}
 talk(l.n,l.t.replace(/\{p\}/g,P.name));
}
function askName(cb){
 state='name';const d=document.createElement('div');
 d.style.cssText='position:fixed;inset:0;background:#000b;display:flex;align-items:center;justify-content:center;z-index:20';
 d.innerHTML='<div style="background:#1b2233;border:2px solid #2c3a52;border-radius:10px;padding:24px 30px;text-align:center"><div style="margin-bottom:12px">名前を入力してください</div><input maxlength=8 style="font:inherit;padding:6px;width:160px;text-align:center"><br><button style="margin-top:12px;font:inherit;font-weight:bold;padding:8px 20px;border:0;border-radius:6px;background:#ffe27a;cursor:pointer">決定</button></div>';
 document.body.appendChild(d);const i=d.querySelector('input');i.focus();
 const ok=()=>{P.name=i.value.trim()||'アルト';d.remove();state='talk';cb()};
 d.querySelector('button').onclick=ok;
 i.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'&&!e.isComposing)ok()};
}
function crystalize(){
 ring(400,240,500,'#fff',.8);
 if(bgm){bgm.pause();setTimeout(()=>{if(bgm)bgm.play().catch(()=>{})},2200)}
 const n=NPC[3];n.c='#bfefff';n.n='水晶';n.fn=()=>talk('','水晶になった町の人。冷たく、動かない');
}
const S_INTRO=[
 L('','……。'),L('','(まぶたが重い。誰かの声が聞こえる)'),
 L(Ru,'あ、動いた! ……よかった。ねえ、あなた、どこから来たの?'),
 {o:[{t:'わからない。何も、思い出せないんだ',r:[L(Ru,'そっか……。無理に思い出さなくていいよ')]},{t:'……ここは、どこ?',r:[]}]},
 L(Ru,'ここはゼノアの町。倒れてたから、びっくりしたよ'),
 L(Ru,'私はルミ。名前、思い出せる? 呼ぶとき困るから'),
 L('','……たぶん、こうだったと思う。'),
 {as:askName},
 L(Ru,'{p}、だね。……まず町を案内するね。ちょっと変な町だけど'),
 L(Ru,'ここが広場。人が少ないでしょ。みんな家に閉じこもってるの'),
 L('','【操作】WASD / 矢印キーで移動、E で話す・調べる、Tab でメニュー'),
 L(Ru,'あそこに立ってる人、動かないの。近づいて、Eで調べてみて')];
const S_CRY=[L(Ru,'……ね。それが、今この町で起きてること'),L(Ru,'次は道具屋に行こう。右上のお店だよ')];
const S_SHOP=[L('道具屋の主人','いらっしゃい。……お客さんは久しぶりだ'),L('道具屋の主人','HPポーションは10G。少しだけ持たせてやる、買ってみな'),L('','(20Gを受け取った)')];
const S_SMITH=[L('鍛冶屋','武器と防具は、魔物の素材から作る。集めてきな'),L('鍛冶屋','作ったら、Tabのメニューで装備できる')];
const S_CRYSTAL=[
 L('','(広場のほうから、キィン……と高い音が響いた)'),{fn:crystalize},
 L(Ru,'……また'),L(Ru,'さっき広場に立ってた町の人。昨日はパン屋のおじさんだった'),
 L(Ru,'だんだん、増えてるの。……教会に行こう。神父様なら、何か知ってるかも')];
const S_CH=[L('神父','……旅の方ですか。ここでは、祈りを捧げて旅の記録を残せます'),L('神父','傷も癒せますが……水晶になった者たちには、もう祈りが届かない'),L(Ru,'教会に毎日来る人もいたの。……今日は、いなかったけど')];
const S_ELDER=[
 L('','(杖をつく音が近づいてきた)'),L('長老','……目を覚ましたのか、旅の者。わしは、水晶竜の仕業だと思っておる'),
 L(Ru,'長老様は、水晶竜のせいだって言ってる。でも、誰も確かめに行けないの'),
 {o:[{t:'……僕が、行ってみる',r:[L(Ru,'……ほんとに? ありがとう。気をつけてね')]},
     {t:'まず、状況をもう少し聞かせてくれ',r:[L('長老','水晶になるのは町の者だけではない。森も洞窟も、少しずつな'),L(Ru,'……行くって決めたら、教えてね')]}]},
 L(Ru,'南の道から、はじまりの草原に出られるよ。……待ってるね')];
const addN=o=>{NPC.push(o);FD[0].ix.push(o)};
const HINT={1:'あそこの水晶の人影を、Eで調べてみて',2:'右上の道具屋に行ってみよう',4:'次は鍛冶屋。広場の奥の大きな建物だよ',6:'教会は左上だよ。神父様に会いに行こう'};
addN({x:tx(860),y:ty(560),n:'ルミ',c:'#ffb3d1',hint:'E: 話す',fn:()=>talk(Ru,HINT[P.tour]||'南の道から、はじまりの草原に行けるよ')});
addN({x:tx(1100),y:ty(560),n:'水晶',c:'#bfefff',hint:'E: 調べる',fn:()=>{const t=L('','冷たく、透き通っている。人の形をした水晶だ');if(P.tour==1){P.tour=2;scene([t,...S_CRY])}else talk('',t.t)}});
const f0=NPC[0].fn,f1=NPC[1].fn,f2=NPC[2].fn;
NPC[0].fn=()=>P.tour==6?(P.tour=7,scene(S_CH,f0)):f0();
NPC[1].fn=()=>P.tour==2?(P.tour=3,scene(S_SHOP,()=>{P.gold+=20;f1()})):f1();
NPC[2].fn=()=>P.tour==4?(P.tour=5,scene(S_SMITH,f2)):f2();
function onSt(o,s){if(s!='play')return;
 if(o=='shop'&&P.tour==3){P.tour=4;scene([L(Ru,'ポーションはキー1で使えるよ'),L(Ru,'次は鍛冶屋。広場の奥の大きな建物だよ')])}
 else if(o=='smith'&&P.tour==5){P.tour=6;scene(S_CRYSTAL)}
 else if(o=='church'&&P.tour==7){P.tour=8;scene(S_ELDER,()=>{P.tour=9})}}
// 画面の状態が変わったことを検知(お店や教会を閉じたときにイベントを起こす)
let ps=state;(function watch(){if(state!=ps){const o=ps;ps=state;onSt(o,state)}requestAnimationFrame(watch)})();
// キー入力: 会話中・選択中・開始前は、元のキー処理より先に受け取って止める
addEventListener('keydown',e=>{
 if(state=='wait'){e.stopImmediatePropagation();return}
 if(state!='talk'&&state!='choice')return;
 e.stopImmediatePropagation();
 if(['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 if(state=='talk'){if(!e.repeat&&['KeyE','Enter','Space'].includes(e.code))nextLine();return}
 const n=DCH.o.length;
 if(e.code=='KeyW'||e.code=='ArrowUp'){CI=(CI+n-1)%n;showCh()}
 else if(e.code=='KeyS'||e.code=='ArrowDown'){CI=(CI+1)%n;showCh()}
 else if(!e.repeat&&(e.code=='KeyE'||e.code=='Enter')){DQ.splice(DI,0,...DCH.o[CI].r);state='talk';nextLine()}
},true);
// 最初の画面: クリックでBGM開始(ブラウザは1回クリックされるまで音を出せないため)
state='wait';
const ov=document.createElement('div');
ov.style.cssText='position:fixed;inset:0;background:#10141fee;display:flex;align-items:center;justify-content:center;z-index:30;cursor:pointer;color:#e8ecf5;font-size:20px';
ov.textContent='クリックではじめる';
ov.onclick=()=>{ov.remove();playBGM('mati1');scene(S_INTRO,()=>{P.tour=1})};
document.body.appendChild(ov);
})();
