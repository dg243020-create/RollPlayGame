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

// 黒い壁の中に立たないよう、位置を直す(負けて戻ったとき / Fキーで移動したとき)
const gf0=goField;
goField=function(i,s,x,y){gf0(i,s,x,y);if(x===undefined){if(i===14){P.x=100;P.y=120}else if(i===N&&s>0){P.x=690;P.y=120}}};
})();
