// ===== sabaku.js: アラディア砂漠(1個目 Lv22〜27 / 2個目 Lv28〜34 / ボス部屋)=====
// index.html の末尾、story.js の次の行に <script src="sabaku.js"></script> を足すだけで有効。
// 既存の index.html / story.js は書き換えない。
// 道順: ユグドラ南東 ⇔ 砂漠1(sabaku1) ⇔ 砂漠2(sabaku2) ⇔ ボス部屋(sabaku3)
(()=>{
const IMG='RPG/', CHR='Character/character_';
const ld=src=>{const im=new Image();im.src=src;return im};

// ---- 素材(砂漠の敵のドロップ)----
Object.assign(ITEMS,{
 bandage:['古い包帯','#e8e0c0'],amulet:['王家の護符','#ffd84a'],
 sandst:['砂岩のかけら','#c9b27a'],score:['砂漠の核','#ffb347'],
 dbone:['乾いた骨','#d8d4c4'],cring:['呪われた指輪','#b04adf'],
 sscale:['蛇の鱗','#4aa870'],seye:['石化の瞳','#7dff9d'],
 gstone:['石像の欠片','#9a9a9a'],gwing:['魔石の翼','#6a6a8a'],
 tskin:['トロルの皮','#7aa84a'],tblood:['怪力の血','#e0453f']});
Object.assign(SELL,{bandage:26,amulet:300,sandst:28,score:330,dbone:25,cring:320,sscale:32,seye:360,gstone:34,gwing:380,tskin:36,tblood:400});

// ---- 敵(f=画像ファイル名)。数字の意味は index.html の TY と同じ:
//   hp=体力 / dm=攻撃力 / sp=速さ / xp=経験値 / dr=[[素材,確率],...] / rg:1=遠距離型(矢を撃つ)
const EN={
 mummy:  {n:'ミイラ',c:'#d8d0b0',r:13,hp:1.3,dm:1.2,sp:.9,xp:1.8,dr:[['bandage',.55],['amulet',.06]],f:'monster_mummy_02_yellow'},
 sgolem: {n:'サンドゴーレム',c:'#a09880',r:17,hp:2.4,dm:1.4,sp:.5,xp:2.1,dr:[['sandst',.55],['score',.06]],f:'monster_golem_gray'},
 szombie:{n:'砂ゾンビ',c:'#8a7a5a',r:13,hp:1.6,dm:1.2,sp:.7,xp:1.9,dr:[['dbone',.55],['cring',.06]],f:'monster_zombie_02_brown'},
 medusa: {n:'サンドメデューサ',c:'#4aa870',r:14,hp:1.2,dm:1.2,sp:.9,xp:2.4,dr:[['sscale',.5],['seye',.06]],rg:1,f:'monster_medusa_green'},
 gargoyle:{n:'ガーゴイル',c:'#9a9a9a',r:15,hp:2,dm:1.5,sp:1.2,xp:2.5,dr:[['gstone',.5],['gwing',.06]],f:'monster_gargoyle_stone'},
 troll:  {n:'トロル',c:'#7aa84a',r:17,hp:2.8,dm:1.6,sp:.6,xp:2.8,dr:[['tskin',.5],['tblood',.06]],f:'monster_troll_01_02'}
};
for(const k in EN){const{f,...t}=EN[k];t.im=ld(CHR+f+'.png');t.im.onload=()=>{t.imOK=1};TY[k]=t}

// ---- マップ ----
const setImg=(i,src)=>{const im=new Image();im.onload=()=>{FD[i].imOK=1};im.src=src;FD[i].im=im;FD[i].img=src};
const ARA={e:'ARADIA',bg:'#3a3020',gr:'#4a3f2a'};

// 入れない四角 [x1,y1,x2,y2](画面 800x480 の座標)を並べて、当たり判定の関数にする
const mk=blk=>(x,y)=>{const r=8;for(const b of blk)if(x>b[0]-r&&x<b[2]+r&&y>b[1]-r&&y<b[3]+r)return 0;return 1};

// 砂漠1(sabaku1): 左上が石畳 / 左下がオアシス(池と木)/ サボテン。入口は左(y200〜280)、出口は右
Object.assign(FD[10],{lv:[22,27],en:[['mummy',4],['sgolem',3],['szombie',3]]});
setImg(10,IMG+'sabaku1.png');
FD[10].ok=mk([[80,280,160,320],[40,320,200,440],[180,300,250,435],[622,75,700,165],[480,345,560,435]]); // 池 / 木 / サボテン2本

// 砂漠2(sabaku2・新しく追加): 右端の黒い入口(y40〜200)がボス部屋への道
const N=FD.push({n:'アラディア砂漠 奥地',...ARA,lv:[28,34],en:[['medusa',3],['gargoyle',3],['troll',3]]})-1;
setImg(N,IMG+'sabaku2.png');
FD[N].ok=mk([[720,0,800,40],[759,40,800,201],[720,201,800,240],[145,115,218,205],[602,355,678,445]]); // 右の黒い壁 / サボテン2本

// ボス部屋(sabaku3): 左端の黒い入口(y40〜200)
setImg(14,IMG+'sabaku3.png');
FD[14].ok=mk([[0,0,80,40],[0,40,40,200],[0,200,80,240]]); // 左の黒い壁

// 出口のつなぎ直し(fw:1=先へ進む=黄色 / fw:0=戻る=水色)
FD[10].ex=[rdL(9),exR(N)];
FD[N].ex=[exL(10),{r:[730,50,800,191],to:14,p:[100,120],b:[W-10,40,10,161],fw:1}];
FD[14].ex=[{r:[40,40,75,200],to:N,p:[700,120],b:[0,40,10,160],fw:0}];
FD[14].bk=N; // ボスに負けたら砂漠2に戻る

// ===== サンドメデューサの石化ビーム =====
// 予告の線(緑の点線)が出て、1秒後にビームが走る。当たると少しダメージを受けて、1秒動けなくなる(攻撃・スキル・道具も使えない)。
// 予告の間に横へ動けば避けられる。メデューサを先に倒せば、ビームは消える。
// 調整用の数字: FREEZE=動けない時間(秒) / WIND=予告の長さ(秒) / BDMG=ダメージ倍率(0で無ダメージ) / GRACE=石化が解けたあと、また石化しない時間(秒)
const FREEZE=1,WIND=1,BDMG=.6,GRACE=1.5;
let BM=[];
const startBeam=e=>{BM.push({e,x:e.x,y:e.y,a:Math.atan2(P.y-e.y,P.x-e.x),w:WIND,on:0,hit:0});SE('cur')};
function petrify(b){
 P.stone=FREEZE;P.sImm=FREEZE+GRACE;
 fl(P.x,P.y-30,'石化!','#cfcfcf',22);ring(P.x,P.y,36,'#9a9a9a',.4);
 if(BDMG>0){const d=tk(Math.max(1,Math.round(b.e.dm*BDMG)));P.hp-=d;SE('dmg');fl(P.x,P.y-12,'-'+d,'#ff6b6b',16)}
}
const up0=update;
update=function(dt){
 // 石化中は、押しているキーを無いものとして扱う
 let sv=null;
 if(P.stone>0){sv={...K};for(const k in K)K[k]=0}
 up0(dt);
 if(sv)Object.assign(K,sv);
 P.stone=Math.max(0,(P.stone||0)-dt);P.sImm=Math.max(0,(P.sImm||0)-dt);
 // メデューサが矢を撃った瞬間(次に撃つまでの時間がジャンプした)に、矢を消してビームの予告に替える
 for(const e of E){
  if(e.t!==TY.medusa)continue;
  if(e._p!==undefined&&e.sT>e._p+.5){const i=AR.findIndex(a=>Math.hypot(a.x-e.x,a.y-e.y)<14);if(i>=0)AR.splice(i,1);startBeam(e)}
  e._p=e.sT;
 }
 for(const b of BM){
  if(b.w>0){
   if(!E.includes(b.e)){b.dead=1;continue}
   b.w-=dt;if(b.w<=0){b.on=.25;SE('mag2');ring(b.x,b.y,40,'#7dff9d',.3)}
  }else{
   b.on-=dt;
   if(!b.hit&&P.stone<=0&&P.sImm<=0){
    const c=Math.cos(b.a),s=Math.sin(b.a),dx=P.x-b.x,dy=P.y-b.y;
    if(dx*c+dy*s>0&&Math.abs(-dx*s+dy*c)<8+13){b.hit=1;petrify(b)}
   }
  }
 }
 BM=BM.filter(b=>!b.dead&&(b.w>0||b.on>0));
};
// 石化中は、道具(1〜4)とE(話す・調べる)も使えない
addEventListener('keydown',e=>{if(P.stone>0&&state=='play'&&(/^Digit[1-4]$/.test(e.code)||e.code=='KeyE')){e.stopImmediatePropagation();e.preventDefault()}},true);
// ビームの予告線・ビーム・石化したプレイヤーの描画
const dr0=draw;
draw=function(){
 dr0();
 for(const b of BM){
  g.save();g.translate(b.x,b.y);g.rotate(b.a);
  if(b.w>0){g.globalAlpha=.3+.2*Math.sin(Date.now()/60);g.strokeStyle='#7dff9d';g.lineWidth=2;g.setLineDash([10,8]);g.beginPath();g.moveTo(0,0);g.lineTo(1000,0);g.stroke()}
  else{g.globalAlpha=.9;g.fillStyle='#7dff9d';g.fillRect(0,-8,1000,16);g.fillStyle='#fff';g.fillRect(0,-3,1000,6)}
  g.restore();
 }
 if(P.stone>0){
  g.save();g.globalAlpha=.78;g.fillStyle='#9a9a9a';g.strokeStyle='#555';g.lineWidth=3;g.beginPath();g.arc(P.x,P.y,19,0,7);g.fill();g.stroke();
  g.globalAlpha=1;g.textAlign='center';g.font='bold 13px sans-serif';g.fillStyle='#fff';g.fillText('石化 '+P.stone.toFixed(1),P.x,P.y-28);g.restore();
 }
};

// 黒い壁の中に立たないよう、位置を直す(負けて戻ったとき / Fキーで移動したとき)。場所を移ったらビームと石化を消す
const gf0=goField;
goField=function(i,s,x,y){gf0(i,s,x,y);BM=[];P.stone=0;if(x===undefined){if(i===14){P.x=100;P.y=120}else if(i===N&&s>0){P.x=690;P.y=120}}};
})();
