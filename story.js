// ===== ストーリー: 冒頭〜ゼノア案内 (index.html の </body> の直前で読み込む) =====
(()=>{
const BGMDIR='BGM/'; // BGM/mati1.mp3
let bgm=null,bgmName='';
const MAPBGM={0:'mati1',1:'sougen1',2:'doukutu1',3:'boss1'}; // フィールド番号 → BGM(森・火山は曲ができるまで前の曲のまま)
function playBGM(n){
 if(n==bgmName&&bgm&&!bgm.paused)return;
 bgmName=n;if(bgm)bgm.pause();
 const ex=['MP3','mp3','wav','ogg','m4a'];let k=0;
 const a=bgm=new Audio();a.loop=true;a.volume=SET.bgm/100; // 音量は設定(Tabメニュー→設定)で変更
 a.onerror=()=>{if(++k<ex.length){a.src=BGMDIR+n+'.'+ex[k];a.play().catch(()=>{})}else console.warn('BGMが見つかりません: '+BGMDIR+n+'.(mp3/wav/ogg/m4a)')};
 a.src=BGMDIR+n+'.'+ex[0];a.play().catch(()=>{});
}
P.name='アルト';P.tour=0;
const Ru='ルミ',L=(n,t)=>({n,t});
let DQ=[],DI=0,DCB=null,DCH=null,CI=0;
let END1=0; // 1=クリスタルドレイクを倒した直後(職業選択が終わったら終幕の会話を始める)
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
 SE('talk');talk(l.n.replace(/\{p\}/g,P.name),l.t.replace(/\{p\}/g,P.name));
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
 ring(400,240,500,'#fff',.8);SE('flash'); // 町の人が水晶になる瞬間の音(koukaon/flash.mp3)
 if(bgm){bgm.pause();setTimeout(()=>{if(bgm)bgm.play().catch(()=>{})},2200)}
 setCry();
}
function setCry(){const n=NPC[3];n.c='#bfefff';n.n='水晶';n.fn=()=>talk('','水晶になった町の人。冷たく、動かない')}
// 暗転(DK)を to(0〜1)まで sec 秒かけて動かす
function fade(to,sec,cb){const from=DK,t0=performance.now();(function f(){const k=Math.min(1,(performance.now()-t0)/(sec*1000));DK=from+(to-from)*k;if(k<1)requestAnimationFrame(f);else if(cb)cb()})()}
function shatter(){ring(400,110,240,'#bfefff',.9);ring(400,110,120,'#fff',.6);if(bgm)bgm.pause();SE('flash')} // 竜が水晶のかけらになって砕ける音(koukaon/flash.mp3)
// ===== 記憶シーン: 星空の画像(RPG/galactic.png)の上に文章を出す。クリック / E / Enter / Space で次へ =====
// 文字は黒。画像が暗くて読めないので、後ろに白い半透明の板を敷いている(MEMPANEL を 'transparent' にすると板なし)
const MEMPANEL='rgba(255,255,255,.82)',MEMCOLOR='#000';
const MEMPAGES=[
 'ただ、主人公には一つだけ引っかかる。\n水晶竜が最後に言った、\n「その記憶を取り戻すことが、世界を救うとは限らぬ。」',
 'その意味が分からない。',
 'そして水晶竜を倒した瞬間、\n主人公の中に短い記憶が戻る。',
 '主人公の記憶\n\n真っ暗な場所。\n誰かと話している。',
 '「……まだ、竜を倒すつもりなのか?」',
 '主人公:\n「そうしなきゃ、この世界は――」'];
let MEM=null;
// 記憶シーン中はゲーム側のキー処理に渡さない(下の会話用の keydown より先に登録しておく)
addEventListener('keydown',e=>{
 if(!MEM)return;
 e.stopImmediatePropagation();e.preventDefault();
 if(!e.repeat&&['KeyE','Enter','Space'].includes(e.code))MEM();
},true);
function memScene(cb){
 const d=document.createElement('div');
 d.style.cssText='position:fixed;inset:0;z-index:35;background:#000 url(RPG/galactic.png) center/cover no-repeat;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity 1s';
 const box=document.createElement('div');
 box.style.cssText='position:relative;max-width:min(86vw,760px);min-width:min(86vw,420px);box-sizing:border-box;padding:26px 34px 34px;border-radius:10px;background:'+MEMPANEL+';color:'+MEMCOLOR+';font-size:20px;line-height:1.9;white-space:pre-line;text-align:center';
 const tx=document.createElement('div'),mk=document.createElement('div');
 mk.textContent='▼';mk.style.cssText='position:absolute;right:16px;bottom:6px;font-size:14px;opacity:.55';
 box.appendChild(tx);box.appendChild(mk);d.appendChild(box);document.body.appendChild(d);
 let i=0,fin=0;
 const show=()=>{tx.textContent=MEMPAGES[i];SE('talk')};
 const next=()=>{
  if(fin)return;
  if(++i<MEMPAGES.length){show();return}
  fin=1;MEM=null;d.style.transition='opacity .9s';d.style.opacity=0;setTimeout(()=>{d.remove();cb()},900);
 };
 d.onclick=next;MEM=next;show();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.opacity=1}));
}
// ===== 絵を全画面で見せる(世界樹の絵など)。クリック / E / Enter / Space / Esc で閉じる =====
// 使い方: viewImage('RPG/ygg6.png')  /  閉じたあとに何かしたいときは viewImage('RPG/ygg5.png',()=>{ ... })
let VIEW=null;
addEventListener('keydown',e=>{ // 絵を見ている間は、ゲーム側のキー処理に渡さない
 if(!VIEW)return;
 e.stopImmediatePropagation();e.preventDefault();
 if(!e.repeat&&['KeyE','Enter','Space','Escape'].includes(e.code))VIEW();
},true);
function viewImage(src,cb){
 const d=document.createElement('div');
 d.style.cssText='position:fixed;inset:0;z-index:35;background:#000;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .6s';
 const im=new Image();im.style.cssText='max-width:100vw;max-height:100vh;object-fit:contain';
 im.onerror=()=>{im.remove();d.style.color='#e8ecf5';d.textContent='(画像が見つかりません: '+src+')'}; // 画像が読めないときの代わり
 im.src=src;d.appendChild(im);
 const hn=document.createElement('div');hn.textContent='E / クリックで閉じる';
 hn.style.cssText='position:absolute;right:18px;bottom:12px;font-size:13px;color:#fff;opacity:.55;text-shadow:0 0 4px #000';d.appendChild(hn);
 document.body.appendChild(d);
 const prev=state;state='view';SE('open');let done=0;
 const close=()=>{if(done)return;done=1;VIEW=null;d.style.transition='opacity .4s';d.style.opacity=0;setTimeout(()=>{d.remove();state=prev;if(cb)cb()},400)};
 d.onclick=close;VIEW=close;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.opacity=1}));
}
// 水晶竜を倒すと、水晶になっていた町の人が元に戻る
function uncrystal(){
 const n=NPC[3];n.c='#d8d2c0';n.n='町の人';n.fn=()=>talk('町の人','ありがとう、旅の人! ……長い夢を見ていたみたいだ');
 const c=NPC.find(o=>o.n=='水晶');if(c){c.c='#e8d9b8';c.n='パン屋';c.hint='E: 話す';c.fn=()=>talk('パン屋のおじさん','おお、あんたが助けてくれたのか! 今度、焼きたてをご馳走するよ')}
}
function toTown(){goField(0,0);P.x=t9(252);P.y=t9(345);P.hp=maxHp();P.mp=maxMp();P.hit=0;E=[];B=null;clr();uncrystal();mv(ru,330,400)}
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
const S_CRY=[L(Ru,'……ね。それが、今この町で起きてること'),L(Ru,'まずは鍛冶屋に行こう。広場の奥の大きな建物だよ'),L(Ru,'外は危ないから、武器を持っておかなきゃ')];
const S_SMITH=[L('鍛冶屋','いらっしゃい。……客は久しぶりだ'),L('鍛冶屋','丸腰で町を出るのは危ない。始まりの剣を、20Gで売ってやる'),L('鍛冶屋','金がないなら、少しだけ持たせてやる。買ってみな'),L('','(20Gを受け取った)'),L('鍛冶屋','「剣」のタブで始まりの剣を選んで、Enterだ')];
const S_BOUGHT=[L(Ru,'買えたね! 装備は、Tabのメニューでも確認できるよ'),L(Ru,'ポーションは道具屋で買えるよ。使うときはキー1')];
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
 L(Ru,'南の道から、エルフィア草原に出られるよ。……待ってるね')];
// 水晶竜との初対面(ペルセ洞窟 最深部に初めて入ったとき1回だけ)。話者名の {p} は主人公の名前になる
const D='水晶竜',H0='{p}';
const S_MEET=[
 L(D,'……来たか。'),
 L(H0,'……お前が、この村を襲ったのか?'),
 L(D,'襲った……?'),L(D,'ふっ……人間というものは、いつもそうだ。'),L(D,'己の目に映ったものだけを見て、答えを決める。'),
 L(H0,'何を言ってる……?'),
 L(D,'お前には……何も見えていない。'),L(D,'いや――見えているのに、思い出せないのか。'),
 L(H0,'……俺のことを知っているのか?'),
 L(D,'…………。'),L(D,'……その目。'),L(D,'やはり……お前なのか。'),
 L(H0,'何の話だ!'),
 L(D,'ならば、確かめるがいい。'),L(D,'この身を砕けば、お前の失った記憶の欠片が戻るだろう。'),L(D,'だが――'),L(D,'その記憶を取り戻すことが、世界を救うとは限らぬ。'),
 L(H0,'……!'),
 L(D,'来い、人の子よ。'),L(D,'お前が何者なのか――'),L(D,'我が、その記憶の中へ返してやろう。')];
// 転職: 会話の途中で職業選択画面を開き、選び終わったら会話の続きに戻る(戻す処理は onSt の 'select' → 'play')
let JCB=null;
const selectJob=n=>{JCB=()=>{state='talk';n()};state='select'};
// Lv10以上で職業が見習いのまま教会の神父に話しかけたとき(ボス撃破後の流れで選び終えていない場合など)
const S_JOB=[L('神父','……旅の方。あなたの内に、まだ形を持たない力が眠っています'),L('神父','その力に、形を与えましょう'),{as:selectJob},L('神父','……それが、あなたの選んだ道ですか。迷わず進みなさい')];
// クリスタルドレイクを倒したあと: 撃破 → 暗転して星空の記憶シーン(memScene) → ゼノアの教会で目覚める → 長老と火山の異変
const S_END1=[
 L('クリスタルドレイク','なぜ……我を……'),
 {fn:shatter},
 L('','(竜の体が水晶のかけらになって、静かに砕け散った)'),
 L('','……。'),
 {as:n=>fade(1,1,n)},{as:memScene},{fn:toTown},{as:n=>fade(0,.9,n)},
 L('','(見慣れた天井。教会のベッドの上で、目が覚めた)'),
 L(Ru,'{p}! ……よかった、目が覚めたのね'),
 L(Ru,'見て。水晶になってた人たち、みんな元に戻ったの。{p}が、水晶竜を倒してくれたんだよね'),
 {o:[{t:'……ああ。みんなが無事で、よかった',r:[L(Ru,'うん。……ありがとう、{p}')]},
     {t:'……倒したのに、胸が苦しいんだ',r:[L(Ru,'……何か、思い出したの? 無理に話さなくていいよ。そばにいるから')]}]},
 L('神父','……目覚めましたか。水晶竜の力が消え、あなたの内に眠っていたものが、動き出しています'),
 L('神父','その力に、形を与えましょう。ここは、そのための場所です'),
 L('','(神父が静かに祈りを捧げると、胸の奥で、何かが熱を帯びた)'),
 {as:selectJob},
 L('神父','……それが、あなたの選んだ道ですか。迷わず進みなさい'),
 L('','(杖をつく音が近づいてきた)'),
 L('長老','……よくやってくれた、旅の者。町を代表して、礼を言う'),
 L('長老','だが……気のせいかの。空が、少し暗くなった気がせんか'),
 L(Ru,'……え? いつもと、変わらないと思うけど'),
 L('','(そのとき、遠くで、地を揺らす轟音が響いた)'),
 L('長老','今のは……東の火山か。ラグナ火山が、噴火しておる'),
 L('長老','あの山には、炎の竜が棲むという。水晶竜の次は、炎竜か……'),
 L(Ru,'……行くんでしょ、{p}。ハルシアの森を抜けた先だよ。気をつけてね')];
const addN=o=>{NPC.push(o);FD[0].ix.push(o)};
const HINT={0.5:'扉の前で、Eを押して外に出よう',0.6:'外に出てみよう',1:'あそこの水晶の人影を、Eで調べてみて',2:'広場の奥の鍛冶屋に行ってみよう',3:'鍛冶屋で、始まりの剣を買ってみよう',6:'教会は左上だよ。神父様に会いに行こう',10:'ハルシアの森を抜けた先が、ラグナ火山だよ'};
addN({x:tx(1100),y:ty(560),n:'水晶',c:'#bfefff',hint:'E: 調べる',fn:()=>{const t=L('','冷たく、透き通っている。人の形をした水晶だ');if(P.tour==1){P.tour=2;scene([t,...S_CRY])}else talk('',t.t)}});
addN({x:tx(860),y:ty(560),n:'ルミ',c:'#ffb3d1',r:40,hint:'E: 話す',fn:()=>talk(Ru,HINT[P.tour]||'南の道から、エルフィア草原に行けるよ')});
const f0=NPC[0].fn,f2=NPC[2].fn;let gift=0; // gift: 鍛冶屋でもらう20Gは1回だけ
NPC[0].fn=()=>P.tour==6?(P.tour=7,scene(S_CH,f0)):P.lv>=10&&P.job=='none'?scene(S_JOB):f0();
NPC[2].fn=()=>P.tour==2?(P.tour=3,scene(S_SMITH,()=>{if(!gift){gift=1;P.gold+=20}f2()})):f2();
function onSt(o,s){if(s!='play')return;
 if(o=='select'&&JCB){const f=JCB;JCB=null;f();return}
 if(o=='smith'&&P.tour==3){
  if(P.cr.w0){P.tour=6;scene([...S_BOUGHT,...S_CRYSTAL])} // 始まりの剣を買ったら次へ
  else scene([L(Ru,'あれ、剣は買わないの? 外は危ないから、持っておこうよ')])}
 else if(o=='church'&&P.tour==7){P.tour=8;scene(S_ELDER,()=>{P.tour=9})}}
// 溶岩ブロック(画像の40x40マス。col,row): 触れている間、0.8秒ごとに最大HPの5%
const LAVA={2:[[1,5],[3,6],[0,7],[2,7],[4,7],[4,8],[5,8],[3,9],[2,10],[4,10],[5,11]],3:[[1,1],[4,1],[13,1],[9,2],[16,2],[5,4],[9,4],[14,4],[11,6],[18,6],[4,7],[7,7],[10,9],[2,10],[17,10]]};
let lavaT=0;
function lava(now){
 const c=LAVA[FI];if(!c||state!='play'||now<lavaT)return;
 for(const[x,y]of c){const cx=Math.max(x*40,Math.min(P.x,x*40+40)),cy=Math.max(y*40,Math.min(P.y,y*40+40));
  if(Math.hypot(P.x-cx,P.y-cy)<10){const d=Math.max(1,Math.ceil(maxHp()*.05));P.hp-=d;SE('dmg');lavaT=now+800;fl(P.x,P.y-24,'-'+d,'#ff8a3a',16);ring(P.x,P.y,30,'#ff6a2a',.25);return}}
}
// 死亡演出: 暗転 → 神父のメッセージ → 教会で復活(デスペナルティなし)
let DK=0,dk=0,lastMsg=msg,lastT=performance.now(); // DK=暗転の濃さ(0〜1) / dk=0なし 1暗転中 2神父の会話 3明るくなる中
const od=draw;draw=function(){od();if(DK>0){g.fillStyle='rgba(0,0,0,'+DK+')';g.fillRect(0,0,W,H)}};
function death(now){
 const dt=Math.min(.05,(now-lastT)/1000);lastT=now;
 if(msg!==lastMsg){lastMsg=msg;
  if(!dk&&state=='play'&&/^(ボスに敗れた|倒れた)/.test(msg.s)){dk=1;state='dead';msg={t:0,s:''};lastMsg=msg}}
 if(dk==1){DK=Math.min(1,DK+dt/.9);
  if(DK>=1){dk=2;goField(0,0);P.x=t9(252);P.y=t9(345);P.hp=maxHp();P.mp=maxMp();P.hit=0;E=[];B=null;clr();
   scene([L('神父','おお、{p}よ。死んでしまうとはなさけない……'),L('神父','だが、世界はまだ終わってはおらぬ。もう一度、立ち上がるのだ'),L('','(教会で目を覚ました。HPとMPが全回復した)')],()=>{dk=3})}}
 else if(dk==3){DK=Math.max(0,DK-dt/.8);if(DK<=0)dk=0}
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
// 現在の目標(画面下、ゴールドの左の枠)。進行度 P.tour から決める。空なら「―」
// FD の番号: 5=ユグドラ北西 6=ラグナ火山 下層 7=ユグドラ北東 8=ユグドラ南西 9=ユグドラ南東 11=火山 中層 12=火山 上層 13=火山 最深部(ボス部屋)
function goalText(){
 const k=P.tour;
 if(P.lv>=10&&P.job=='none')return '教会で転職する';
 if(k==0.5||k==0.6)return '家の外に出る';
 if(k==1)return '広場の水晶を調べる';
 if(k==2)return '鍛冶屋に行く';
 if(k==3)return '鍛冶屋で始まりの剣を買う';
 if(k==6)return '教会に行く';
 if(k==7||k==8)return '長老の話を聞く';
 if(k==9)return P.gk?'':'「水晶竜」を探しに行く';
 if(k==10&&P.b2)return 'ユグドラの東から、アラディア砂漠へ';
 if(k==10)return (FI==6||FI==11||FI==12||FI==13)?'炎竜を探す':(FI==5||FI==7||FI==8||FI==9)?'ユグドラの南(左下)から、ラグナ火山へ':'ハルシアの森を抜けて、ラグナ火山へ';
 return '';
}
// 画面の状態が変わったことを検知(お店や教会を閉じたときにイベントを起こす)
// BGMの音量は毎フレーム設定(SET.bgm)に合わせる
let ps=state;(function watch(){if(state!=ps){const o=ps;ps=state;onSt(o,state)}if(bgm)bgm.volume=Math.max(0,Math.min(1,SET.bgm/100));if(END1&&state=='play'){END1=0;scene(S_END1,()=>{P.tour=10})}
st($('goal').children[1],goalText()||'―');lava(performance.now());tick();death(performance.now());requestAnimationFrame(watch)})();
// キー入力: 会話中・選択中・開始前は、元のキー処理より先に受け取って止める
addEventListener('keydown',e=>{
 if(state=='wait'||state=='dead'){e.stopImmediatePropagation();return}
 if(state!='talk'&&state!='choice')return;
 e.stopImmediatePropagation();
 if(['Space','Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 if(state=='talk'){if(!e.repeat&&['KeyE','Enter','Space'].includes(e.code))nextLine();return}
 const n=DCH.o.length;
 if(e.code=='KeyW'||e.code=='ArrowUp'){CI=(CI+n-1)%n;showCh();SE('cur')}
 else if(e.code=='KeyS'||e.code=='ArrowDown'){CI=(CI+1)%n;showCh();SE('cur')}
 else if(!e.repeat&&(e.code=='KeyE'||e.code=='Enter')){SE('ok');DQ.splice(DI,0,...DCH.o[CI].r);state='talk';nextLine()}
},true);
// 最初の画面: クリックでBGM開始(ブラウザは1回クリックされるまで音を出せないため)
state='wait';
const ov=document.createElement('div');
ov.style.cssText='position:fixed;inset:0;background:#10141fee;display:flex;align-items:center;justify-content:center;z-index:30;cursor:pointer;color:#e8ecf5;font-size:20px';
ov.textContent='クリックではじめる';
// ロゴ(RPG/logo1.png): 白地にフェードイン → 少し見せて → フェードアウト。クリックで飛ばせる
function showLogo(cb){
 const d=document.createElement('div');
 d.style.cssText='position:fixed;inset:0;background:#fff;z-index:40;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .8s;cursor:pointer';
 const im=new Image();im.style.cssText='width:min(96vw,900px);max-height:90vh;object-fit:contain';
 im.onerror=()=>{im.remove();d.textContent='RE:DRAKELIA';d.style.color='#111';d.style.font='bold 40px sans-serif'}; // 画像が読めないときの代わり
 im.src='RPG/logo1.png';d.appendChild(im);document.body.appendChild(d);
 let done=0;const end=()=>{if(done)return;done=1;d.style.opacity=0;setTimeout(()=>{d.remove();cb()},800)};
 d.onclick=end;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.opacity=1}));
 setTimeout(end,3200);
}
// セーブデータで始めるとき(beginGame に d が渡される): ロゴのあと、ゼノアの教会で再開する
let RESUME=0,STARTED=0;
function resume(){state='play';goField(0,0);P.x=t9(252);P.y=t9(345);P.hp=maxHp();P.mp=maxMp();P.hit=0;E=[];B=null;clr();if(P.ch.k1)uncrystal();else if(P.tour>=6)setCry();talkClear()}
const bg0=beginGame;beginGame=function(d){bg0(d);if(d&&Number.isFinite(d.lv)){state='wait';RESUME=1;if(STARTED){DQ=[];DCB=null;showLogo(()=>{RESUME=0;resume()})}}};
ov.onclick=()=>{STARTED=1;state='wait';ov.remove();playBGM('mati1');showLogo(()=>{if(RESUME){RESUME=0;resume()}else scene(S_INTRO,()=>{P.tour=0.5})})};
document.body.appendChild(ov);
// ===== マップ画像の差し替え(1440x864 = 画面と同じ縦横比) =====
const setImg=(i,src)=>{const im=new Image();im.onload=()=>{FD[i].imOK=1};im.src=src;FD[i].im=im;FD[i].img=src};
setImg(1,'RPG/sougen1.png');setImg(2,'RPG/doukutu1.png');setImg(3,'RPG/doukutu2.png');
// 洞窟の出入口: 画像の黒い部分(右端 / 左端)に合わせる。黒の中には立たないよう、到着位置を内側にずらす
FD[2].ex[1]={r:[W-50,130,W,350],to:3,p:[110,240],b:[W-10,130,10,220]};
FD[1].ex[2].p=[400,60]; // 草原の南の出口 → 洞窟の上から入る
FD[2].ex[0]={r:[320,0,480,45],to:1,p:[360,345],b:[320,0,160,8]}; // 洞窟から戻る出口も上側に
FD[3].ex=[]; // 最深部は左から入り、戻れない
// ユグドラ(4画面): 画像の中心(4画面がぶつかる所)にある森。各画面の「中心に近い角」の濃い森の近くでE → 世界樹の絵(RPG/ygg6.png)
// ygg5.png(赤い空の世界樹)は物語用。出したい場面で viewImage('RPG/ygg5.png') を呼ぶ。x,y は画面(800x480)の座標
const treeIx=(x,y)=>({x,y,r:110,hint:'E: 世界樹を見る',fn:()=>viewImage('RPG/ygg6.png')});
// 人物: 画像(1440x864)のピクセル座標で置く。v:1 で丸い人物として描かれる
const y9=v=>v*W/1440,yNpc=(x,y,n,c,hint,fn)=>({x:y9(x),y:y9(y),r:70,n,c,v:1,hint,fn});
FD[5].ix=[treeIx(760,440)];
FD[7].ix=[yNpc(468,335,'道具屋','#7ad9ff','E: 買い物',()=>NPC[1].fn()),yNpc(1189,335,'鍛冶屋','#e0453f','E: 作る',()=>f2()),treeIx(40,440)];
FD[8].ix=[yNpc(300,430,'神父','#e8e4f0','E: 祈る',()=>NPC[0].fn()),treeIx(760,40)];
FD[9].ix=[treeIx(40,40)];
const sb=startBoss;startBoss=function(){sb();P.x=110;P.y=240;if(FI==3&&!P.ch.k0){P.ch.k0=1;scene(S_MEET,()=>playBGM('boss1'))}}; // ボス戦開始時も左側から / 初対面の会話が終わったら boss1 を流す
const gf=goField;goField=function(i,s,x,y){gf(i,s,x,y);if(bgm&&MAPBGM[i]){if(i==3&&!P.ch.k0){bgm.pause();bgmName=''}else playBGM(MAPBGM[i])}if(i==2&&x===undefined){P.x=690;P.y=240}}; // 敗北して洞窟に戻るときは黒い部分の内側へ
// クリスタルドレイク(ボス1)を倒したら、職業選択のあと(play に戻ってから)終幕の会話を始める
const oh=hurt;hurt=function(e,m){const b=e&&e.boss&&!e.k2;oh(e,m);if(b&&e.hp<=0&&!P.ch.k1){P.ch.k1=1;END1=1}};
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
