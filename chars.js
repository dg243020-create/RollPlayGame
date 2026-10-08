// ===== chars.js: Character フォルダのドット絵を差し込む =====
// index.html の末尾、story.js の次の行に <script src="chars.js"></script> を足すだけで有効。
// 既存の index.html / story.js は書き換えない。画像が読めないキャラは、これまでの丸表示のまま。
(()=>{
const DIR='Character/character_';
const IM={};
const get=f=>IM[f]||(IM[f]=(()=>{const im=new Image();im.src=DIR+f+'.png';return im})());
const ok=im=>!!(im&&im.complete&&im.naturalWidth>0);

// ---- 雑魚敵(index.html に画像表示の仕組みがあるので、画像を渡すだけ)----
const EM={slime:'monster_slime_big_green',spore:'monster_kinoko_purple',golem:'monster_golem_brown',imp:'monster_devil_red',magma:'monster_hi_red'};
for(const k in EM){const t=TY[k];if(!t)continue;const im=get(EM[k]);t.im=im;if(ok(im))t.imOK=1;else im.onload=()=>{t.imOK=1}}

// ---- プレイヤー(職業ごと)----
const PJ={none:'yusha_01_red',knight:'kishi_man_03_red',mage:'mahotsukai_01_purple',healer:'soryo_green'};
Object.values(PJ).forEach(get);

// ---- ボス ----
const bossImg=e=>get(e.k3?'monster_dragon_02_yellow':e.k2?'monster_dragon_01_red':'monster_dragon_01_white');

// ---- NPC(名前→画像)。名前が変わると画像も変わる(水晶→パン屋 など)----
const man='shakaijin_man_01_black_black',mid='murabito_middle_man_green';
const NM={'神父':'shinpu_green','道具屋':mid,'鍛冶屋':'dwarf_02_brown','町の人':man,'パン屋':man,'水晶':man,'ルミ':'murabito_child_01_woman_pink',
 '住民':'murabito_senior_man_blue','花屋':'shakaijin_woman_04_gray','衛兵':'kishi_man_01_red_brown','神官':'sister_white','商人':mid};
Object.values(NM).forEach(get);
const TC={};
const tint=(im,f)=>{if(TC[f])return TC[f];const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(140,225,255,.65)';x.fillRect(0,0,c.width,c.height);return TC[f]=c};

// bottom=足元のy / h=高さ
const put=(im,x,bottom,h,src)=>{const w=h*im.naturalWidth/im.naturalHeight;g.drawImage(src||im,x-w/2,bottom-h,w,h)};

// ---- 元の丸を描く命令(arc / 名前の文字)を横取りして、画像に置き換える ----
const SK={a:[],t:[]};
const ARC=CanvasRenderingContext2D.prototype.arc,TXT=CanvasRenderingContext2D.prototype.fillText;
g.arc=function(x,y,r,...z){for(const o of SK.a)if(o[0]===x&&o[1]===y&&o[2]===r){o[3]();return}return ARC.call(this,x,y,r,...z)};
g.fillText=function(s,x,y,...z){for(const o of SK.t)if(o[0]===s&&o[1]===x&&o[2]===y)return TXT.call(this,s,x,y-16,...z);return TXT.call(this,s,x,y,...z)};

const od=draw;
draw=function(){
 const A=[],T=[],bs=[];
 // プレイヤー
 const pim=get(PJ[P.job]);
 if(ok(pim))A.push([P.x,P.y,14,()=>{g.save();if(P.hit>.5)g.globalAlpha=.45;put(pim,P.x,P.y+16,40);g.restore()}]);
 // NPC(町は NPC、ユグドラなどは ix のうち v:1 の人物)
 const f=FD[FI],L=f.town?NPC:(f.ix||[]).filter(n=>n.v);
 for(const n of L){
  const file=NM[n.n],im=file&&get(file);if(!ok(im))continue;
  A.push([n.x,n.y,12,()=>put(im,n.x,n.y+14,44,n.n=='水晶'?tint(im,file):null)]);
  T.push([n.n,n.x,n.y-18]);
 }
 // ボス(分身は丸のまま)。丸の半径をほぼ0にして目印にし、そこに画像を描く
 for(const e of E)if(e.boss&&!e.cl){const im=bossImg(e);if(!ok(im))continue;
  bs.push([e,e.rad]);e.rad=.01;
  A.push([e.x,e.y,.01,()=>{if(e.inv>0){g.save();g.beginPath();ARC.call(g,e.x,e.y,56,0,7);g.strokeStyle='#ffe27a';g.lineWidth=4;g.globalAlpha=.6;g.stroke();g.restore();g.beginPath()}put(im,e.x,e.y+55,110)}]); // 無敵中の金の輪は画像の後ろ。描いたあとに beginPath で線を空にしないと、元の処理が輪を塗りつぶしてしまう
 }
 SK.a=A;SK.t=T;
 try{od()}finally{for(const[e,r]of bs)e.rad=r;SK.a=[];SK.t=[]}
};
})();
