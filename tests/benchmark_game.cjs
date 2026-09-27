const {performance}=require('perf_hooks');
const {game}=require('./game-harness.cjs');
const g=game(),r=g.run;r("start();mode='practice';shield=2;upgrades.armor=1;level=18;enemies=[];pickups=[];obstacles=[];civilians=[];nextRow=-1e9;");
function bench(label,code,n=100){r(`for(let j=0;j<12;j++){${code}}`);const samples=[];for(let k=0;k<3;k++){const begin=performance.now();r(`for(let j=0;j<${n};j++){visualTime+=.016;${code}}`);samples.push((performance.now()-begin)/n);}samples.sort((a,b)=>a-b);console.log(label+': '+samples[1].toFixed(3)+' ms/draw (native canvas, not phone FPS)');}
bench('Hero without armor','ctx.clearRect(0,0,W,H);hero(210,400,1,0,1,0,0,false);');
bench('Hero with armor','ctx.clearRect(0,0,W,H);hero(210,400,1,0,1,0,0,true);');
r('enemies=Array.from({length:45},(_,i)=>({x:i%2?L+17:R-17,y:i<7?120+i*85:H+150+(i-7)*80,side:i%2?-1:1,type:i%3,hp:3,fire:2,age:0,flash:0,climber:true,chasing:true}));');
bench('Late scene: 7 visible + 38 offscreen enemies','draw();',60);
