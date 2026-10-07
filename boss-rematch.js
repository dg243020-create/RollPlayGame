// ===== ボス再戦 + ボス素材ドロップ + 武器素材の置き換え =====
// index.html の <script src="story.js"></script> の「すぐ下」に、次の1行を足して読み込む:
//   <script src="boss-rematch.js"></script>
(()=>{
// ---- 調整用の数字 ----
// ボスごとのドロップ: id=素材 / p=落ちる確率(0〜1) / min,max=落ちる個数の範囲(初回も再戦も毎回この確率)
const BOSS_DROP={
 1:{id:'dcry',p:.7,min:1,max:2},   // クリスタルドレイク
 2:{id:'dfire',p:.7,min:1,max:2},  // 「炎竜」ファイアードレイク
 3:{id:'dearth',p:.7,min:1,max:2}  // 「地竜」アースドレイク
};
const RMF=.3; // 再戦(2回目以降)の経験値・ゴールドの割合。1にすると初回と同じ(稼ぎ放題になるので注意)

// ---- ボス素材(名前は仮) ----
Object.assign(ITEMS,{dcry:['水晶竜の結晶','#9fe8ff'],dfire:['炎竜の逆鱗','#ff5a3a'],dearth:['地竜の大角','#c9a24a']});
Object.assign(SELL,{dcry:150,dfire:300,dearth:500});

// ---- 武器素材の置き換え(剣・杖で被っていた素材をボス素材へ) ----
// 魔力結晶: 杖(石晶〜竜王)すべてに使われていた月光の羽 → 水晶竜の結晶
// 炎竜の剣 / 業火の杖: 小鬼の角・魔鉱インゴット(剣と杖で被っていた) → 炎竜の逆鱗
// 竜心の剣 / 竜王の杖: 火山の心臓・竜の涙(剣と杖で被っていた) → 炎竜の逆鱗 / 地竜の大角
const rc=id=>RC.find(r=>r.id==id);
const SWAP={
 mcrys:{bgel:2,dcry:1,stone:3},
 w5:{scale:10,ember:5,dfire:2},
 w8:{mflame:4,mdark:2,dfire:2,dearth:1},
 t5:{mcrys:3,mflame:2,dfire:2},
 t6:{mcrys:4,mflame:3,mdark:2,dearth:2}
};
for(const id in SWAP){const r=rc(id);if(r)r.m=SWAP[id]}

// ---- ドロップ ----
function bossDrop(t){
 const d=BOSS_DROP[t];if(!d||Math.random()>=d.p)return;
 const n=d.min+Math.floor(Math.random()*(d.max-d.min+1));
 P.inv[d.id]=(P.inv[d.id]||0)+n;
 fl(P.x,P.y-60,'★'+ITEMS[d.id][0]+' x'+n,'#ffd84a',17);SE('ok');
}

// ---- 再戦の報酬を減らす(2回目以降だけ。経験値は gain、ゴールドは増えた分を割り引く) ----
let RMS=1;
const og=gain;gain=function(n){return og(RMS<1?Math.max(1,Math.round(n*RMS)):n)};
function rm(on,fn){
 if(!on){fn();return}
 RMS=RMF;const g0=P.gold,n0=F.length;
 try{fn()}finally{RMS=1}
 const add=P.gold-g0;
 if(add>0){const s=Math.max(1,Math.round(add*RMF));P.gold=g0+s;for(let i=n0;i<F.length;i++)if(/^\+\d+G$/.test(F[i].tx))F[i].tx='+'+s+'G'}
}

// クリスタルドレイク / 炎竜: 倒した瞬間にドロップ。2回目以降は報酬を割り引く
const oh=hurt;
hurt=function(e,m){
 const live=e&&e.boss&&!e.k3&&e.hp>0,rem=live&&(e.k2?!!P.b2:!!P.ch.k1); // 倒す前に「再戦か」を調べておく
 rm(rem,()=>oh(e,m));
 if(live&&e.hp<=0)bossDrop(e.k2?2:1);
};
// 地竜: 撃破の処理(winB3)に合わせる
const ow=winB3;
winB3=function(){const rem=!!P.b3;rm(rem,ow);bossDrop(3)};

// ---- 再戦の祭壇: ボスを倒したあとのボス部屋の中央でEを押すと、もう一度ボスが出る ----
const altar=()=>({x:400,y:240,r:70,get hint(){return B?' ':'E: 再戦する'},fn:()=>{
 if(B||!bdone())return;
 const k=FD[FI].boss;SE('shutugen');(k==3?startBoss3:k==2?startBoss2:startBoss)();
}});
FD[3].ix=[altar()];FD[13].ix=[altar()];FD[14].ix=[altar()];
FD[3].ex=[{r:[0,170,50,310],to:2,p:[690,240],b:[0,170,10,140]}]; // クリスタルドレイクの部屋: 倒したあとは左から戻れる(戦闘中は出られない)

function drawAltar(){
 const f=FD[FI];if(!f.boss||B||!bdone())return;
 const c=f.boss==3?'#c9a24a':f.boss==2?'#ff6a3a':'#7ad9ff',x=400,y=240,t=Date.now()/400;
 g.save();g.globalAlpha=.3+.15*Math.sin(t);g.fillStyle=c;g.beginPath();g.arc(x,y,34,0,7);g.fill();
 g.globalAlpha=1;g.strokeStyle=c;g.lineWidth=3;g.beginPath();g.arc(x,y,24,0,7);g.stroke();
 g.beginPath();g.moveTo(x,y-14);g.lineTo(x+10,y);g.lineTo(x,y+14);g.lineTo(x-10,y);g.closePath();g.stroke();g.restore();
}
const odg=drawGate;drawGate=function(){drawAltar();odg()};
})();
