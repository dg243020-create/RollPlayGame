// ===== ストーリー: 冒頭〜ゼノア案内 (index.html の </body> の直前で読み込む) =====
(()=>{
const BGMDIR='BGM/'; // BGM/mati1.mp3
let bgm=null;
function playBGM(n){
 if(bgm)bgm.pause();
 const ex=['MP3','mp3','wav','ogg','m4a'];let k=0;
 const a=bgm=new Audio();a.loop=true;a.volume=.5;
 a.onerror=()=>{if(++k<ex.length){a.src=BGMDIR+n+'.'+ex[k];a.play().catch(()=>{})}else console.warn('BGMが見つかりません: '+BGMDIR+n+'.(mp3/wav/ogg/m4a)')};
 a.src=BGMDIR+n+'.'+ex[0];a.play().catch(()=>{});
}
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
 L('','……。'),L('','(見知らぬ天井。柔らかいベッドの上で、目が覚めた)'),
 L(Ru,'あ、目が覚めた! ……よかった。ねえ、あなた、どこから来たの?'),
 {o:[{t:'わからない。何も、思い出せないんだ',r:[L(Ru,'そっか……。無理に思い出さなくていいよ')]},{t:'……ここは、どこ?',r:[]}]},
 L(Ru,'ここはゼノアの町。私の家の前で倒れてたから、ベッドに運んだの'),
 L(Ru,'私はルミ。名前、思い出せる? 呼ぶとき困るから'),
 L('','……たぶん、こうだったと思う。'),
 {as:askName},
 L(Ru,'{p}、だね。……まず町を案内するね。ちょっと変な町だけど'),
 L('','【操作】WASD / 矢印キーで移動、E で話す・調べる、Tab でメニュー'),
 L(Ru,'外に出よう。扉の前で、Eを押してみて')];
const S_PLAZA=[L(Ru,'ここが広場。人が少ないでしょ。みんな家に閉じこもってるの'),L(Ru,'あそこに立ってる人、動かないの。近づいて、Eで調べてみて')];
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
const HINT={0.5:'扉の前で、Eを押して外に出よう',0.6:'外に出てみよう',1:'あそこの水晶の人影を、Eで調べてみて',2:'右上の道具屋に行ってみよう',4:'次は鍛冶屋。広場の奥の大きな建物だよ',6:'教会は左上だよ。神父様に会いに行こう'};
addN({x:tx(1100),y:ty(560),n:'水晶',c:'#bfefff',hint:'E: 調べる',fn:()=>{const t=L('','冷たく、透き通っている。人の形をした水晶だ');if(P.tour==1){P.tour=2;scene([t,...S_CRY])}else talk('',t.t)}});
addN({x:tx(860),y:ty(560),n:'ルミ',c:'#ffb3d1',r:40,hint:'E: 話す',fn:()=>talk(Ru,HINT[P.tour]||'南の道から、はじまりの草原に行けるよ')});
const f0=NPC[0].fn,f1=NPC[1].fn,f2=NPC[2].fn;
NPC[0].fn=()=>P.tour==6?(P.tour=7,scene(S_CH,f0)):f0();
NPC[1].fn=()=>P.tour==2?(P.tour=3,scene(S_SHOP,()=>{P.gold+=20;f1()})):f1();
NPC[2].fn=()=>P.tour==4?(P.tour=5,scene(S_SMITH,f2)):f2();
function onSt(o,s){if(s!='play')return;
 if(o=='shop'&&P.tour==3){P.tour=4;scene([L(Ru,'ポーションはキー1で使えるよ'),L(Ru,'次は鍛冶屋。広場の奥の大きな建物だよ')])}
 else if(o=='smith'&&P.tour==5){P.tour=6;scene(S_CRYSTAL)}
 else if(o=='church'&&P.tour==7){P.tour=8;scene(S_ELDER,()=>{P.tour=9})}}
// 溶岩ブロック(画像の40x40マス。col,row): 触れている間、0.8秒ごとに最大HPの5%
const LAVA={2:[[1,5],[3,6],[0,7],[2,7],[4,7],[4,8],[5,8],[3,9],[2,10],[4,10],[5,11]],3:[[1,1],[4,1],[13,1],[9,2],[16,2],[5,4],[9,4],[14,4],[11,6],[18,6],[4,7],[7,7],[10,9],[2,10],[17,10]]};
let lavaT=0;
function lava(now){
 const c=LAVA[FI];if(!c||state!='play'||now<lavaT)return;
 for(const[x,y]of c){const cx=Math.max(x*40,Math.min(P.x,x*40+40)),cy=Math.max(y*40,Math.min(P.y,y*40+40));
  if(Math.hypot(P.x-cx,P.y-cy)<10){const d=Math.max(1,Math.ceil(maxHp()*.05));P.hp-=d;lavaT=now+800;fl(P.x,P.y-24,'-'+d,'#ff8a3a',16);ring(P.x,P.y,30,'#ff6a2a',.25);return}}
}
// ルミがチュートリアル中ついてくる(プレイヤーの通った道を少し遅れて辿る)/ 家を出たら広場の説明
let RU=null;const trail=[];
function tick(){
 if(!RU||state!='play')return;
 if(P.tour==0.6&&FI==0&&P.y<t9(620)){P.tour=1;scene(S_PLAZA);return}
 if(P.tour>=9||FI!=0)return;
 const l=trail[trail.length-1];
 if(!l||Math.hypot(P.x-l.x,P.y-l.y)>=4){trail.push({x:P.x,y:P.y});if(trail.length>11)trail.shift()}
 if(trail.length>=11){RU.x+=(trail[0].x-RU.x)*.2;RU.y+=(trail[0].y-RU.y)*.2}
}
// 画面の状態が変わったことを検知(お店や教会を閉じたときにイベントを起こす)
let ps=state;(function watch(){if(state!=ps){const o=ps;ps=state;onSt(o,state)}lava(performance.now());tick();requestAnimationFrame(watch)})();
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
ov.onclick=()=>{ov.remove();playBGM('mati1');scene(S_INTRO,()=>{P.tour=0.5})};
document.body.appendChild(ov);
// ===== マップ画像の差し替え(1440x864 = 画面と同じ縦横比) =====
const setImg=(i,src)=>{const im=new Image();im.onload=()=>{FD[i].imOK=1};im.src=src;FD[i].im=im;FD[i].img=src};
setImg(1,'RPG/sougen1.png');setImg(2,'RPG/doukutu1.png');setImg(3,'RPG/doukutu2.png');
// 洞窟の出入口: 画像の黒い部分(右端 / 左端)に合わせる。黒の中には立たないよう、到着位置を内側にずらす
FD[2].ex[1]={r:[W-50,130,W,350],to:3,p:[110,240],b:[W-10,130,10,220]};
FD[1].ex[2].p=[400,60]; // 草原の南の出口 → 洞窟の上から入る
FD[2].ex[0]={r:[320,0,480,45],to:1,p:[360,345],b:[320,0,160,8]}; // 洞窟から戻る出口も上側に
FD[3].ex=[]; // 最深部は左から入り、戻れない
const sb=startBoss;startBoss=function(){sb();P.x=110;P.y=240}; // ボス戦開始時も左側から
const gf=goField;goField=function(i,s,x,y){gf(i,s,x,y);if(i==2&&x===undefined){P.x=690;P.y=240}}; // 敗北して洞窟に戻るときは黒い部分の内側へ
// 町(mati1.png): 画像の横幅が 1584→1440 に変わったので、建物・NPCの位置を新しい画像に合わせて取り直す
const t9=v=>v*W/1440,R9=(a,b,c,d,o)=>({x:t9(a),y:t9(b),w:t9(c-a),h:t9(d-b),...o});
const doorB=R9(200,646,304,654,{n:'扉'});let doorOpen=false;
BLD.length=0;
BLD.push(R9(72,72,432,288,{c:'#a8a0c0',n:'教会'}),R9(570,66,1014,366,{c:'#7a4a4a',n:'鍛冶屋'}),R9(1152,72,1368,288,{c:'#4a6a8a',n:'道具屋'}),R9(72,646,200,654,{}),R9(304,646,432,654,{}),R9(428,646,436,792,{}),R9(360,650,432,790,{n:'ベッド'}),doorB,R9(1300,720,1368,792,{c:'#c9a24a',n:'樽'}));
Object.assign(WK,R9(72,72,1368,792,{}));Object.assign(CR,R9(648,792,936,864,{}));
const mv=(o,x,y)=>{o.x=t9(x);o.y=t9(y)};
mv(NPC[0],252,318);mv(NPC[1],1259,318);mv(NPC[2],792,405);mv(NPC[3],500,610);
const ru=NPC.find(n=>n.n=='ルミ'),cr=NPC.find(n=>n.n=='水晶');mv(ru,860,560);mv(cr,1100,560);
const brl=FD[0].ix.find(n=>n.hint=='E: 調べる'&&!n.n);mv(brl,1332,755);brl.fn=()=>{if(P.ch.brl){talk('','樽はもう空っぽだ');return}P.ch.brl=1;addG(5);talk('','樽の中を調べた! 5ゴールドを手に入れた')};
// 最初は家の前(扉の外)から。ルミもそばに置く
P.x=t9(310);P.y=t9(730);mv(ru,230,700); // 最初は家の中、ベッドの横
RU=ru;
const doorIx={x:t9(252),y:t9(660),r:50,get hint(){return doorOpen?'E: 扉':'E: 扉を開ける'},fn:()=>{
 if(doorOpen){talk('','開いている扉だ');return}
 doorOpen=true;const i=BLD.indexOf(doorB);if(i>=0)BLD.splice(i,1);
 if(P.tour==0.5){P.tour=0.6;talk(Ru,'行こう!')}else talk('','扉を開けた');
}};
FD[0].ix.splice(FD[0].ix.indexOf(ru),0,doorIx); // ルミより優先して反応させる
drawTown=function(){
 if(!FD[FI].town)return;
 g.save();g.textAlign='center';
 if(TOWNOK)g.drawImage(TOWNIMG,0,0,W,H);else{g.fillStyle='#12421e';g.fillRect(0,0,W,H)}
 if(doorOpen){g.fillStyle='#2b1f12';g.fillRect(t9(228),t9(656),t9(48),t9(62))}
 for(const n of NPC){g.fillStyle=n.c;g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(n.x,n.y,12,0,7);g.fill();g.stroke();g.fillStyle='#fff';g.font='11px sans-serif';g.fillText(n.n,n.x,n.y-18)}
 g.restore();
};
})();
