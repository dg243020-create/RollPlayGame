// ===== 魔法の名前入れ替え + 魔法の効果音 (index.html の最後、sabaku.js の次で読み込む) =====
// メイジ: 広範囲・CT短め → 氷の技「ブリザード」(効果音 ice) / 狭範囲・超高威力 → 「ワイドフレア」(効果音 fire)
// ヒーラー: ホーリーライト → holylight / ヒール → heal
(()=>{
const mg=JOBS.mage.sk,hl=JOBS.healer.sk;
mg[0].n='ブリザード';mg[0].se='ice';   // 元の「ワイドフレア」(威力・範囲・CTはそのまま)
mg[1].n='ワイドフレア';mg[1].se='fire'; // 元の「メテオ」(威力・範囲・CTはそのまま)
hl[0].se='holylight';hl[1].se='heal';
// 効果音ファイル(koukaon/ フォルダ)。max=最大再生秒数(長い音を途中で切る)
Object.assign(SEF,{ice:{v:1,max:2},fire:{v:1,max:1.2},holylight:{v:1,max:1.4},heal:{v:1}});
['ice','fire','holylight','heal'].forEach(seBase);
// スキルを使った瞬間だけ、そのスキルの se に音を差し替える
let OV=null;
const SE0=SE;
SE=function(n,v){if(OV&&(n=='mag2'||n=='heal'||n=='ken')){n=OV;OV=null}return SE0(n,v)};
const use1=use;
use=function(i){const s=i>0&&J().sk?J().sk[i-1]:null;OV=s&&s.se||null;try{use1(i)}finally{OV=null}};
})();
