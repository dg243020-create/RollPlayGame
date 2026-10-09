// ===== ストーリー: 冒頭〜ゼノア案内 (index.html の </body> の直前で読み込む) =====
(()=>{
const BGMDIR='BGM/'; // BGM/mati1.mp3
let bgm=null,bgmName='';
const MAPBGM={0:'mati1',1:'sougen1',2:'doukutu1',3:'boss1',5:'yggdra',7:'yggdra',8:'yggdra',9:'yggdra',10:'sabaku1',15:'sabaku1',13:'boss2',14:'boss3'}; // フィールド番号 → BGM(森・火山は曲ができるまで前の曲のまま)
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
let END2=0; // 1=炎竜を倒した直後(play に戻ってから終幕の会話を始める)
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
 L(D,'来い、人の子よ。'),L(D,'お前が何者なのか――'),{fn:()=>playBGM('boss1')}, // 最後のセリフを表示する瞬間に boss1 の BGM へ切り替える
 L(D,'我が、その記憶の中へ返してやろう。')];
// 転職: 会話の途中で職業選択画面を開き、選び終わったら会話の続きに戻る(戻す処理は onSt の 'select' → 'play')
let JCB=null;
const selectJob=n=>{JCB=()=>{state='talk';n()};state='select'};
// Lv10以上で職業が見習いのまま教会の神父に話しかけたとき(ボス撃破後の流れで選び終えていない場合など)
const S_JOB=[L('神父','……旅の方。あなたの内に、まだ形を持たない力が眠っています'),L('神父','その力に、形を与えましょう'),{as:selectJob},L('神父','……それが、あなたの選んだ道ですか。迷わず進みなさい')];
// クリスタルドレイクを倒したあと: 撃破 → 暗転して星空の記憶シーン(memScene) → ゼノアの教会で目覚める → 長老と火山の異変
const S_END1=[
 L('クリスタルドレイク','なぜ……我を……'),
 {fn:()=>{if(bgm)bgm.pause();SE('flash')}},{as:n=>viewImage('RPG/suishouryuu.png',n)},
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
// ===== ⑤〜⑨: ユグドラ到着 → 街の人の話 → 生命樹の異変 → 火山の爆発 → 南区の神殿 → ラグナ火山へ =====
// 進行度 P.tour: 10=ユグドラへ向かう / 11=街の人から話を聞く(4人) / 12=生命樹を調べる / 14=南区の神殿へ / 15=南門からラグナ火山へ / 16=ラグナ火山(下層)に入った / 17=炎竜を倒した
// 街の人から聞いた話は P.ch.yi のビット(1=生命樹の葉 2=枯れる植物 4=地面の揺れ 8=火山の煙)で覚えている
const yi=()=>{const b=P.ch.yi||0;return (b&1)+(b>>1&1)+(b>>2&1)+(b>>3&1)};
const kz=()=>{const b=P.ch.kz||0;return (b&1)+(b>>1&1)+(b>>2&1)+(b>>3&1)}; // 火山 下層で灯した火皿の数
function boom(){SE('bakuhatu');ring(400,240,420,'#ff6a2a',.9);ring(400,420,300,'#ffb347',.8)}
// ===== 素材(sozai/ フォルダ)の画像エフェクト: キラキラ(kirakira)と隕石(meteor)。見た目だけの演出で、ダメージなどはなし =====
// フォルダ名を変えるときは SZ を直す(index.html から見た場所)
const SZ='sozai/',szImg=n=>{const i=new Image();i.src=SZ+n;return i};
const IMG={kkY:szImg('kirakira_02_yellow.png'),kkR:szImg('kirakira_02_red.png'),met:szImg('meteor_gray.png')};
const FX=[];
function sparkle(x,y,n,red){for(let i=0;i<n;i++)FX.push({k:'kk',img:red?IMG.kkR:IMG.kkY,x:x+(Math.random()*2-1)*46,y:y+(Math.random()*2-1)*40,s:18+Math.random()*22,t0:performance.now()+i*70,d:700+Math.random()*400})}
function meteors(n){for(let i=0;i<n;i++)FX.push({k:'met',img:IMG.met,x:300+Math.random()*560,y:-50,dx:-(300+Math.random()*120),dy:300+Math.random()*120,s:44+Math.random()*24,t0:performance.now()+i*220,d:1100+Math.random()*400})}
function fxDraw(){
 if(!FX.length)return;
 const now=performance.now();g.save();g.imageSmoothingEnabled=false;
 for(let i=FX.length-1;i>=0;i--){const f=FX[i],t=(now-f.t0)/f.d;
  if(t>=1){FX.splice(i,1);continue}
  if(t<0||!f.img.complete||!f.img.naturalWidth)continue;
  if(f.k=='kk'){const z=f.s*Math.sin(Math.PI*t);g.globalAlpha=1-t*.5;g.drawImage(f.img,f.x-z/2,f.y-z/2,z,z)}
  else{g.globalAlpha=1;g.drawImage(f.img,f.x+f.dx*t-f.s/2,f.y+f.dy*t-f.s/2,f.s,f.s)}
 }
 g.restore();
}
// ⑤ 森を抜けてユグドラへ(初めて入った瞬間に1回)
const S_YGG=[
 L('','(森を抜けると、視界が一気にひらけた)'),
 L('','(空を覆うほど巨大な樹。その根元に、白い石造りの街が広がっている)'),
 L('','巨大都市ユグドラ。街の中心には、天を貫く生命樹がそびえていた'),
 L('{p}','……すごい。こんな場所が、あったのか'),
 L('','(まずは、街の人から話を聞いてみよう)')];
// ⑥⑦ 中央区の生命樹を調べる → 学者の説明 → ラグナ火山の爆発
const S_TREE=[
 L('','(街の中心。見上げるほどの生命樹に、そっと手を触れた)'),
 {as:n=>viewImage('RPG/ygg5.png',n)}, // ygg5.png=異変のあとの生命樹
 L('','(……樹の一部が、黒く変色している)'),
 L('','(学者らしき人物が、同じように樹を見上げていた)'),
 L('学者','……君も、気づいたかね。この黒ずみに'),
 L('学者','わたしは、この樹を長年調べている者だ。生命樹には、膨大な魔力が流れている'),
 L('学者','その流れが、今、乱れておる。このままでは、樹は少しずつ弱っていくだろう'),
 L('{p}','……原因は、何なんだ?'),
 L('学者','魔力の流れを辿ってみた。……乱れの源は、南。ラグナ火山に行き着く'),
 L('','(そのとき、街の外から、腹に響くような爆発音が轟いた)'),
 {fn:()=>SE('bakuhatu')},{as:n=>viewImage('RPG/kazanhunka.png',n)},
 L('','(南の空に、黒い煙が噴き上がっていく)'),
 L('学者','今のは……ラグナ火山か!'),
 L('学者','……普通の噴火ではない。魔力が、噴き出している'),
 L('学者','このままでは、ユグドラにも被害が及ぶかもしれん'),
 L('{p}','……行くしかない。あの火山へ'),
 L('学者','行くのか。ならば、南区の神殿で調べるといい。火山の記録が残っているはずだ'),
 L('','(ラグナ火山へ向かう。その前に、南区の神殿で火山について調べよう)')];
// ⑧ 南区の神殿の神官
const S_TEMPLE=[
 L('神官','……生命樹の異変に、火山の煙。旅の方、あなたも感じておられるのですね'),
 L('{p}','ラグナ火山のことを、知りたい'),
 L('神官','ラグナ火山には、古代の火山制御施設が存在します'),
 L('神官','火山の力を抑えるために造られた施設です。その奥には「炉」があり、かつて火山の力を制御していました'),
 L('{p}','その炉は、今も動いているのか?'),
 L('神官','……わかりません。今では、炉の使い方を知る者は、誰ひとり残っていないのです'),
 L('神官','それでも向かわれるのなら、南門からお行きなさい。……どうか、お気をつけて'),
 L('','(古代の火山制御施設と、火山の力を制御する「炉」……)'),
 L('','(ユグドラの南門から、ラグナ火山へ向かおう)')];
// ⑨ 南門を出て、ラグナ火山(下層)に入った瞬間
const S_GATE=[
 L('','(ユグドラの南門を出ると、遠くに、赤く染まった山が見えた)'),
 L('','(ラグナ火山。山頂から立ちのぼる煙が、空を覆いはじめている)'),
 L('{p}','……行こう')];
// ===== 炎竜編: 中層・上層の揺れ → 炎竜との初遭遇 → 撃破 → 火山崩壊 → 脱出 =====
const D2='炎竜';
// 画面を揺らす(canvas を ms ミリ秒、px ピクセルぶん揺らす)
const shake=(ms,px)=>{const cv=g.canvas;if(!cv)return;const t0=performance.now();
 (function f(){const k=(performance.now()-t0)/ms;if(k>=1){cv.style.transform='';return}
  const a=px*(1-k);cv.style.transform='translate('+((Math.random()*2-1)*a)+'px,'+((Math.random()*2-1)*a)+'px)';requestAnimationFrame(f)})()};
const quakeFx=()=>{boom();shake(900,7);meteors(4)};
// 中層・上層に初めて入ったとき
const S_MID=[
 L('','(梯子を登ると、中層。肌を刺すような熱気が満ちている)'),
 {fn:quakeFx},L('','ゴゴゴゴゴ……'),
 L('','(火山が大きく揺れた。天井から、小石がぱらぱらと落ちてくる)'),
 L('{p}','……噴火が、激しくなっている。急がないと')];
const S_UP=[
 L('','(さらに奥へ。上層に出ると、足もとの岩肌が赤く脈打っていた)'),
 {fn:quakeFx},L('','ゴゴゴゴゴ……!'),
 L('','(火山が、何度も大きく揺れる。溶岩の流れが、さっきよりずっと速い)'),
 L('{p}','……この先に、何かいる')];
// ボス部屋に初めて入ったとき(咆哮のあと暗転して、炎竜のBGM boss2 に切り替わる)
const S_FMEET=[
 L('','(右の道を抜けると、火山の奥深く。溶岩が流れる巨大な空間に出た)'),
 L('','(足を踏み入れた、その瞬間――)'),
 {fn:quakeFx},L('','ゴゴゴゴゴ……'),
 L('','(地面が大きく揺れる。溶岩が激しく波打ち、巨大な影が、その中から立ちのぼった)'),
 {fn:()=>{boom();ring(400,200,260,'#ff6a2a',.9)}},
 L('','炎竜が、姿を現した'),
 L('{p}','……お前が、炎竜か。'),
 L(D2,'…………。'),
 L('{p}','お前のせいで、火山が噴火しているんだな。'),
 L(D2,'人間よ。'),L(D2,'ここから立ち去れ。'),
 L('{p}','できない。'),L('{p}','このままじゃ、火山の被害が広がる。'),
 L(D2,'……ならば、力ずくで追い返すまでだ。'),
 L('','(炎竜が、ゆっくりと翼を広げた)'),
 {fn:boom},L('','ゴォォォォ……'),
 L('','(周囲の溶岩が、一斉に吹き上がる)'),
 L('{p}','……やるしかないな。'),
 L(D2,'その覚悟――'),L(D2,'炎で示してみろ。'),
 L('','グォォォォォォン!!!'),
 {fn:()=>{SE('bakuhatu');shake(700,9)}},
 {as:n=>fade(1,.5,n)},{fn:()=>playBGM('boss2')},{as:n=>fade(0,.6,n)},
 L('','BOSS\n炎竜 ― ラグナドレイク')];
// 火山からの脱出: 下層(古代施設)→ ユグドラ南門の外へ
const toLow=()=>{goField(6,0);P.x=200;P.y=100;P.hit=0;E=[];B=null;clr()};
const toOut=()=>{goField(8,0);P.x=400;P.y=H-80;P.hit=0;E=[];B=null;clr()};
const S_END2=[
 L('','(炎竜が、ゆっくりと膝をついた)'),
 {fn:()=>{if(bgm)bgm.pause()}},
 L('','(周囲の炎が、少しずつ弱まっていく)'),
 L('{p}','……終わった……のか?'),
 L(D2,'…………。'),
 L('','(炎竜が、{p}をじっと見つめる)'),
 L(D2,'……人間よ。'),L(D2,'見事だ。'),
 L('{p}','……。'),
 L(D2,'我が敗れた以上……この山を支配する炎も、いずれ鎮まる。'),
 L('{p}','なら……これで火山も止まるんだな。'),
 L(D2,'……ああ。'),
 {fn:()=>{ring(400,200,200,'#ffb347',.9);ring(400,200,100,'#fff',.6);SE('flash')}},
 L('','(炎竜の身体が、徐々に光へと変わっていく)'),
 L('{p}','待て。'),L('{p}','お前は……なぜ火山を暴れさせていた?'),
 L(D2,'…………。'),
 L('','(炎竜は、少しだけ{p}を見た)'),
 L(D2,'……我は、ただ――'),
 {fn:()=>{ring(400,200,320,'#fff',.9);SE('flash')}},
 L('','(言葉が途切れる。炎竜の姿が、完全に消えた)'),
 // ④ 火山の異変
 {fn:quakeFx},L('','ゴゴゴゴゴゴゴゴ……!!'),
 L('{p}','……何だ!?'),
 L('','(火山全体が、激しく揺れはじめる)'),
 {fn:()=>{quakeFx();ring(400,420,320,'#ff6a2a',.9)}},
 L('','(溶岩が、一気に噴き上がった)'),
 L('{p}','まずい……!'),
 L('','(足場が崩れていく。来た道を、全力で走って戻る)'),
 // ⑤ 脱出
 {as:n=>fade(1,.8,n)},{fn:toLow},{as:n=>fade(0,.6,n)},
 L('','(下層へ向かって走る。背後から、次々と岩が落ちてくる)'),
 {fn:()=>{SE('bakuhatu');shake(500,6)}},L('','ドォン!'),
 {fn:()=>{SE('bakuhatu');shake(500,6)}},L('','ドォン!'),
 L('{p}','急げ……!'),
 L('','(なんとか、古代施設まで戻ってきた)'),
 // ⑥ 火山の外へ
 {as:n=>fade(1,1,n)},{fn:toOut},{as:n=>fade(0,1.2,n)},
 L('','(しばらくして、ようやく火山の外へ出た)'),
 L('','(空には、まだ黒い煙が残っている。しかし、先ほどまで激しく噴き上がっていた火山は、少しずつ静かになっていく)'),
 L('{p}','……終わった。'),
 L('','(遠くに見えるラグナ火山を、じっと見つめる)'),
 L('{p}','炎竜は……もういない。'),
 L('','({p}は、その場を後にした)')];
const addN=o=>{NPC.push(o);FD[0].ix.push(o)};
const HINT={0.5:'扉の前で、Eを押して外に出よう',0.6:'外に出てみよう',1:'あそこの水晶の人影を、Eで調べてみて',2:'広場の奥の鍛冶屋に行ってみよう',3:'鍛冶屋で、始まりの剣を買ってみよう',6:'教会は左上だよ。神父様に会いに行こう',10:'ハルシアの森を抜けた先に、ユグドラっていう大きな街があるよ'};
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
// ラグナ火山(kazan1〜5)の溶岩: 6=下層 / 11=中層 / 12=上層 / 13=ボス部屋(画像のオレンジのマス)
Object.assign(LAVA,{
 6:[[2,2],[7,2],[15,2],[4,4],[9,4],[14,6],[11,7],[7,8],[17,8],[14,9],[2,10],[11,10]],
 11:[[1,1],[7,1],[16,2],[12,3],[1,5],[8,5],[4,7],[16,7],[2,9],[6,9],[12,9]],
 12:[[16,2],[6,3],[9,3],[15,5],[6,6],[2,7],[11,7],[4,9],[17,9],[9,10]],
 13:[[7,2],[10,2],[4,3],[15,3],[9,4],[12,5],[5,6],[15,6],[2,8],[8,8],[11,8],[13,9],[17,9]]});
let lavaT=0;
function lava(now){
 const c=LAVA[FI];if(!c||state!='play'||now<lavaT)return;
 for(const[x,y]of c){const cx=Math.max(x*40,Math.min(P.x,x*40+40)),cy=Math.max(y*40,Math.min(P.y,y*40+40));
  if(Math.hypot(P.x-cx,P.y-cy)<10){const d=Math.max(1,Math.ceil(maxHp()*.05));P.hp-=d;SE('dmg');lavaT=now+800;fl(P.x,P.y-24,'-'+d,'#ff8a3a',16);ring(P.x,P.y,30,'#ff6a2a',.25);return}}
}
// 死亡演出: 暗転 → 神父のメッセージ → 教会で復活(デスペナルティなし)
let DK=0,dk=0,lastMsg=msg,lastT=performance.now(); // DK=暗転の濃さ(0〜1) / dk=0なし 1暗転中 2神父の会話 3明るくなる中
const od=draw;draw=function(){od();if(FI==6)kzDraw();fxDraw();if(DK>0){g.fillStyle='rgba(0,0,0,'+DK+')';g.fillRect(0,0,W,H)}};
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
 const k=P.tour,inY=(FI==5||FI==7||FI==8||FI==9),inV=(FI==6||FI==11||FI==12||FI==13);
 if(P.lv>=10&&P.job=='none')return '教会で転職する';
 if(k==0.5||k==0.6)return '家の外に出る';
 if(k==1)return '広場の水晶を調べる';
 if(k==2)return '鍛冶屋に行く';
 if(k==3)return '鍛冶屋で始まりの剣を買う';
 if(k==6)return '教会に行く';
 if(k==7||k==8)return '長老の話を聞く';
 if(k==9)return P.gk?'':'「水晶竜」を探しに行く';
 if(k>=10&&P.b2)return 'ユグドラの東から、アラディア砂漠へ';
 if(k==10)return inY?'街の人から話を聞く(0/4)':'ハルシアの森を抜けて、ユグドラへ';
 if(k==11)return '街の人から話を聞く('+yi()+'/4)';
 if(k==12)return '街の中心の生命樹を調べる';
 if(k==14)return '南区の神殿で、火山について調べる';
 if(k==15)return 'ユグドラの南門(左下)から、ラグナ火山へ';
 if(k>=16){
  if(FI==6)return P.ch.vs?'右上の梯子から、中層へ':'炉の謎を解く(炉 '+kz()+'/4)';
  if(FI==11)return '左の梯子から、上層へ';
  if(FI==12)return '右の道から、炎竜のもとへ';
  if(FI==13)return '「炎竜」を倒す';
  return inY?'ユグドラの南(左下)から、ラグナ火山へ':'ラグナ火山へ向かう'}
 return '';
}
// 画面の状態が変わったことを検知(お店や教会を閉じたときにイベントを起こす)
// BGMの音量は毎フレーム設定(SET.bgm)に合わせる
let ps=state;(function watch(){if(state!=ps){const o=ps;ps=state;onSt(o,state)}if(bgm)bgm.volume=Math.max(0,Math.min(1,SET.bgm/100));if(END1&&state=='play'){END1=0;scene(S_END1,()=>{P.tour=10})}
if(END2&&state=='play'){END2=0;scene(S_END2,()=>{P.tour=17;P.b2=P.b2||1})} // 炎竜を倒したあとの終幕
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
// ユグドラ(4画面): 画像の中心(4画面がぶつかる所)にある森。各画面の「中心に近い角」の濃い森の近くでE
//   ふだんは世界樹の絵(RPG/ygg6.png)を見せる / 進行度12(生命樹を調べる)のときは、異変のストーリー(S_TREE)が始まる
// ygg5.png(異変のあとの世界樹)は S_TREE の中で使う。x,y は画面(800x480)の座標
const treeIx=(x,y)=>({x,y,r:110,get hint(){return P.tour==12?'E: 生命樹を調べる':'E: 世界樹を見る'},fn:()=>{if(P.tour==12)scene(S_TREE,()=>{P.tour=14});else viewImage('RPG/ygg6.png')}});
// 人物: 画像(1440x864)のピクセル座標で置く。v:1 で丸い人物として描かれる
const y9=v=>v*W/1440,yNpc=(x,y,n,c,hint,fn)=>({x:y9(x),y:y9(y),r:70,n,c,v:1,hint,fn});
// 街の人の話(⑤): 進行度11のとき初めて話すと、その話を覚える。4人そろったら次(生命樹を調べる)へ。bit=聞いた話の印 / lines=セリフ(1つ目が、あとで話しかけたときの返事)
const yTalk=(bit,n,lines)=>()=>{
 if(P.tour==10)P.tour=11; // 到着の場面を飛ばしてユグドラにいる場合の保険
 if(P.tour!=11||(P.ch.yi||0)&bit){talk(n,lines[0]);return}
 P.ch.yi=(P.ch.yi||0)|bit;
 const q=lines.map(t=>L(n,t));
 if(P.ch.yi==15)q.push(L('','(生命樹の葉、枯れていく植物、揺れる地面、火山の煙……)'),L('','(ばらばらに見えて、どこかで繋がっている気がする)'),L('','街の中心にある、生命樹を調べてみよう'));
 scene(q,()=>{if(P.ch.yi==15)P.tour=12});
};
FD[5].ix=[treeIx(760,440),yNpc(300,430,'住民','#d8c8a0','E: 話す',yTalk(1,'住民',['生命樹の葉が、やたらと落ちてくるんだ。','いつも青々としているのが自慢の樹だったのに……掃いても掃いても、すぐ積もっちまう。こんなこと、初めてだよ。']))];
FD[7].ix=[yNpc(468,335,'道具屋','#7ad9ff','E: 買い物',()=>NPC[1].fn()),yNpc(1189,335,'鍛冶屋','#e0453f','E: 作る',()=>f2()),treeIx(40,440),yNpc(900,430,'花屋','#f0a8c8','E: 話す',yTalk(2,'花屋',['店の花が、次々に枯れていくの。','街じゅうの植物が、一部だけど枯れ始めてるのよ。水も土も、いつも通りなのに……']))];
// ⑧ 南区の神殿の神官(南東の画面に置く)
const templeIx=yNpc(1115,425,'神官','#d8e8c0','E: 話す',()=>{ // ⑧ 南区の神殿(ygg4.png=南東の画面、右上の神殿の入口の前。位置を変えたいときは、この行の 1115,425 を直す)
  if(P.tour==14)scene(S_TEMPLE,()=>{P.tour=15});
  else if(P.tour>=15)talk('神官','ラグナ火山の炉のことを、お忘れなく。……どうか、お気をつけて。');
  else talk('神官','ここは、生命樹に祈りを捧げる神殿です。')});
FD[8].ix=[yNpc(300,430,'神父','#e8e4f0','E: 祈る',()=>NPC[0].fn()),treeIx(760,40),
 yNpc(1000,430,'衛兵','#9aa8c0','E: 話す',yTalk(4,'衛兵',['最近、地面が時々揺れるんだ。ほんの一瞬だが、気味が悪い。','この街は、昔から地震なんてほとんど無いはずなんだがな。'])),
];
FD[9].ix=[treeIx(40,40),yNpc(500,430,'商人','#c8b070','E: 話す',yTalk(8,'商人',['南のラグナ火山を見たかい? 大量の煙が出ててね。','あれじゃ、商売で南へ行けやしない。あんな煙、初めて見たよ。'])),templeIx];
// ===== ラグナ火山(画像 kazan1〜5): 下層=kazan1(仕掛けを解くと kazan2 の梯子が出る) / 中層=kazan3 / 上層=kazan4 / ボス部屋=kazan5 =====
// 画像は1440x864。当たり判定は C(列,行,列,行)=72px のマスで「入れない四角」を指定(画像を見て決めた値)
setImg(6,'RPG/kazan1.png');setImg(11,'RPG/kazan3.png');setImg(12,'RPG/kazan4.png');setImg(13,'RPG/kazan5.png');
const kz1=FD[6].im,kz2=new Image();kz2.src='RPG/kazan2.png'; // kazan2 = 仕掛けを解いたあとの下層(右上に梯子)
const C=(a,b,c,d)=>[a*72,b*72,(c+1)*72,(d+1)*72];
FD[6].ok=yOK([C(0,0,2,0),C(7,0,19,0),C(0,11,19,11),C(0,0,0,11),C(19,0,19,11),[683,395,757,469],[692,152,748,208],[188,404,244,460],[1196,404,1252,460],[692,692,748,748]]); // 上の壁(ユグドラへの隙間は左から4〜7マス目)・下左右の壁・炉・火皿4つ
FD[11].ok=yOK([C(0,0,19,0),C(0,11,19,11),C(0,0,0,11),C(19,0,19,11),C(4,1,4,4),C(13,1,13,7),C(14,5,14,5),C(8,7,8,10)]);
FD[12].ok=yOK([C(0,0,19,0),C(0,11,19,11),C(0,0,0,11),C(19,5,19,11),C(4,1,4,4),C(13,1,13,7),C(8,7,8,10)]); // 右の壁は途中まで(上側がボス部屋への道)
FD[13].ok=yOK([C(0,0,19,0),C(0,11,19,11),C(0,0,0,11),C(19,0,19,11),C(1,5,1,5)]);
// 出口: 梯子(x1〜x2が梯子の幅。p=行き先で立つ位置)
const lad=(to,p,x1,x2)=>({r:[x1,10,x2,150],to,p,b:[x1+10,0,x2-x1-20,8]});
FD[6].ex=[{r:[120,0,280,45],to:8,p:[400,H-80],b:[120,0,160,8],fw:0}]; // 下層: 上の隙間からユグドラ(南西)へ戻る。右上の梯子は仕掛けを解くと追加される
FD[11].ex=[lad(6,[700,160],650,750),lad(12,[100,160],55,145)]; // 中層: 右の梯子=下層 / 左の梯子=上層
FD[12].ex=[lad(11,[100,160],55,145),{r:[W-50,40,W,200],to:13,p:[90,120],b:[W-10,40,10,160]}]; // 上層: 左上の梯子=中層 / 右の道=ボス部屋
FD[13].ex=[{r:[0,40,90,200],to:12,p:[W-70,120],b:[0,40,10,160]}]; // ボス部屋: 左=上層(ボスがいる間は出られない)
FD[8].ex.find(e=>e.to==6).p=[200,60]; // ユグドラ南門 → 下層の上の隙間から入る
const kzLad=lad(11,[700,160],650,750);
function kzSync(){if(!P.ch.vs&&![0,1,3,7,15].includes(P.ch.kz||0))P.ch.kz=0; // 仕掛けを解いたかどうかで、下層の画像(kazan1/kazan2)と右上の梯子を切り替える
 FD[6].im=P.ch.vs?kz2:kz1;
 const i=FD[6].ex.indexOf(kzLad);
 if(P.ch.vs&&i<0)FD[6].ex.push(kzLad);
 if(!P.ch.vs&&i>=0)FD[6].ex.splice(i,1);
}
// 下層の謎解き: 山 → 川 → 太陽 → 灰 の順に、炉へ炎を灯す。炉に E で絵を表示 / Enter で灯す / E で閉じる
// 順番を間違えると、すべての炉の炎が消えてやり直し。灯した炉は P.ch.kz のビット(山1・川2・太陽4・灰8)、解いたら P.ch.vs=1
// KZP = [x, y, ビット, 炎の色(RGB), 表示する絵]  ※炉の位置は kazan1.png の4つの台座(右=山 / 左=川 / 上=太陽 / 下=灰)
const KZP=[[680,240,1,'255,106,42','RPG/ro_yama.png'],[120,240,2,'60,160,255','RPG/ro_kawa.png'],[400,100,4,'255,200,60','RPG/ro_taiyou.png'],[400,400,8,'180,100,255','RPG/ro_hai.png']];
function kzSolve(){P.ch.vs=1;kzSync();sparkle(400,240,14);sparkle(700,80,10);ring(400,240,260,'#ff7a2a',.9);ring(700,80,120,'#ffe27a',.9);SE('shutugen');SE('bakuhatu')}
function kzDraw(){ // 灯った火皿の光 / 解いたあとの炉の光
 g.save();const b=P.ch.kz||0,now=Date.now();
 for(const[x,y,m,c]of KZP)if(b&m){const gr=g.createRadialGradient(x,y,2,x,y,40);gr.addColorStop(0,'#ffffff');gr.addColorStop(.4,'rgba('+c+',1)');gr.addColorStop(1,'rgba('+c+',0)');g.globalAlpha=.65+.15*Math.sin(now/130+x);g.fillStyle=gr;g.beginPath();g.arc(x,y,40,0,7);g.fill()}
 if(P.ch.vs){const gr=g.createRadialGradient(400,240,4,400,240,60);gr.addColorStop(0,'#ffe27a');gr.addColorStop(.5,'#ff6a2a');gr.addColorStop(1,'rgba(255,60,20,0)');g.globalAlpha=.45+.15*Math.sin(now/260);g.fillStyle=gr;g.beginPath();g.arc(400,240,60,0,7);g.fill()}
 g.restore();
}
// 炉の絵を全画面で見せる。Enter=灯す / E・Esc=閉じる(絵を見ている間は、ゲーム側のキー処理に渡さない)
let FV=null;
addEventListener('keydown',e=>{
 if(!FV)return;
 e.stopImmediatePropagation();e.preventDefault();
 if(e.repeat)return;
 if(e.code=='Enter')FV.light();
 else if(e.code=='KeyE'||e.code=='Escape')FV.close();
},true);
function furnaceView(src,lit,onLight){
 const d=document.createElement('div');
 d.style.cssText='position:fixed;inset:0;z-index:35;background:#000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .5s';
 const im=new Image();im.style.cssText='max-width:100vw;max-height:100vh;object-fit:contain';
 im.onerror=()=>{im.remove();d.style.color='#e8ecf5';d.textContent='(画像が見つかりません: '+src+')'};
 im.src=src;d.appendChild(im);
 const bar=document.createElement('div');
 bar.style.cssText='position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center;gap:14px;font-size:14px;color:#fff;text-shadow:0 0 4px #000';
 const mkBtn=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='font:inherit;padding:6px 16px;border:1px solid #fff8;border-radius:6px;background:#000a;color:#fff;cursor:pointer';b.onclick=f;return b};
 document.body.appendChild(d);
 const prev=state;state='view';SE('open');let done=0;
 const end=cb=>{if(done)return;done=1;FV=null;d.style.transition='opacity .35s';d.style.opacity=0;setTimeout(()=>{d.remove();state=prev;if(cb)cb()},350)};
 FV={close:()=>end(),light:()=>{if(!lit)end(onLight)}};
 if(!lit)bar.appendChild(mkBtn('Enter: 炎を灯す',()=>FV&&FV.light()));else{const t=document.createElement('span');t.textContent='(すでに炎が灯っている)';bar.appendChild(t)}
 bar.appendChild(mkBtn('E: 閉じる',()=>FV&&FV.close()));
 d.appendChild(bar);
 requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.opacity=1}));
}
// 炉に炎を灯す: 正しい順(kz() 個目の次)なら灯る / 違えばすべて消える
function kzLight(i){
 const[x,y,bit]=KZP[i];
 if(i!=kz()){
  for(const[px,py,m]of KZP)if((P.ch.kz||0)&m)ring(px,py,60,'#8a8a8a',.6);
  ring(x,y,60,'#8a8a8a',.6);P.ch.kz=0;SE('dmg');
  talk('','……すべての炉の炎が、ふっと消えてしまった。順番が違うようだ');return}
 P.ch.kz=(P.ch.kz||0)|bit;ring(x,y,60,'#ffb347',.6);SE('heal');sparkle(x,y,8);
 if(kz()==4)scene([L('','(最後の炉に、炎が灯った)'),L('','(中央の炉が、赤く脈打ちはじめる)'),{fn:kzSolve},L('','(ゴゴゴ……と音を立てて、右上の壁に梯子が現れた)')]);
 else talk('','炉に炎が灯った。('+kz()+'/4)');
}
const kzBr=i=>{const[x,y,bit,c,src]=KZP[i];return{x,y,r:60,hint:'E: 炉を調べる',fn:()=>furnaceView(src,!!((P.ch.kz||0)&bit),()=>kzLight(i))}};
FD[6].ix=[kzBr(0),kzBr(1),kzBr(2),kzBr(3),
 {x:400,y:240,r:70,hint:'E: 炉を調べる',fn:()=>talk('','文字が刻まれている。山から生まれた炎が、川を流れ、太陽に照らされ、最後に灰となる。')}];
const sb=startBoss;startBoss=function(){sb();P.x=110;P.y=240;if(FI==3&&!P.ch.k0){P.ch.k0=1;scene(S_MEET)}}; // ボス戦開始時も左側から / 初対面の会話(最後のセリフの表示と同時に boss1 のBGMへ)
const gf=goField;goField=function(i,s,x,y){gf(i,s,x,y);kzSync();if(bgm&&MAPBGM[i]){if((i==3&&!P.ch.k0)||(i==13&&!P.ch.f0)){bgm.pause();bgmName=''}else playBGM(MAPBGM[i])}if(i==2&&x===undefined){P.x=690;P.y=240}
 if(i==5&&P.tour==10){P.tour=11;scene(S_YGG)} // ⑤ 初めてユグドラに入ったとき
 else if(i==6&&P.tour==15){P.tour=16;scene(S_GATE)} // ⑨ 南門からラグナ火山(下層)に入ったとき / 敗北して洞窟に戻るときは黒い部分の内側へ
 else if(i==11&&!P.ch.q1){P.ch.q1=1;scene(S_MID)} // 中層に初めて入ったとき(火山が揺れる)
 else if(i==12&&!P.ch.q2){P.ch.q2=1;scene(S_UP)} // 上層に初めて入ったとき(さらに揺れる)
 else if(i==13&&!P.ch.f0){P.ch.f0=1;scene(S_FMEET)}}; // ボス部屋に初めて入ったとき(炎竜との初遭遇。1回だけ)
// クリスタルドレイク(ボス1)を倒したら、職業選択のあと(play に戻ってから)終幕の会話を始める
const oh=hurt;hurt=function(e,m){const b=e&&e.boss&&!e.k2&&!e.k3;oh(e,m);if(b&&e.hp<=0&&!P.ch.k1){P.ch.k1=1;END1=1}};
// 炎竜(ボス部屋13のボス)を倒したら、play に戻ってから終幕の会話(S_END2)を始める
const oh2=hurt;hurt=function(e,m){const b=e&&e.boss&&FI==13;oh2(e,m);if(b&&e.hp<=0&&!P.ch.f1){P.ch.f1=1;END2=1}};
// 中層・上層を歩いている間、ときどき火山が揺れる(上層のほうが間隔が短い)
let quakeT=0;
(function qk(){const now=performance.now();
 if((FI==11||FI==12)&&state=='play'){
  if(!quakeT)quakeT=now+18000;
  if(now>=quakeT){SE('bakuhatu');ring(400,240,360,'#ff6a2a',.5);shake(600,4);meteors(2);quakeT=now+(FI==12?12000:20000)+Math.random()*8000}
 }else quakeT=0;
 requestAnimationFrame(qk)})();
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
