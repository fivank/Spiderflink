const assert=require('assert/strict'),fs=require('fs');const {game,createCanvas}=require('./game-harness.cjs');const clean="enemies=[];pickups=[];obstacles=[];civilians=[];nextRow=-1e9;";
const near=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const base=(reduced=false,height=800)=>{const g=game(reduced,height);g.run("start();mode='practice';"+clean+'p={x:74,y:600,side:-1};camera=0;t=5;grace=999');return g;};
{
const a=base(),b=base();for(const g of [a,b])g.run('launch({x:346,y:250,side:1});update(.1)');b.event('pointerdown',200,400);b.event('pointermove',265,400);for(let i=0;i<30;i++){for(const g of [a,b])g.run('update(.02)');near(b.run('p.x'),a.run('p.x'));near(b.run('p.y'),a.run('p.y'));}b.event('pointerup',265,400);assert.equal(b.run('shots.length'),0);
const g=base(),r=g.run;r('launch({x:74,y:250,side:-1});update(.1)');g.event('pointerdown',150,400);g.event('pointermove',190,400);assert(r('jump.crossWall'));while(r('jump'))r('update(.02)');near(r('p.x'),347);near(r('p.y'),250);assert.equal(r('shots.length'),0);
console.log('Cross-wall trajectory is fixed; climb-to-opposite-wall kick retained');
}
{
const g=base(),r=g.run;r('upgrades.laser=1');g.event('pointerdown',160,450,1);g.event('pointerdown',280,220,2);r('update(.1)');assert(r('laserActive'));assert.equal(r('press'),null);assert.equal(r('jump'),null);g.event('pointermove',290,200,2);r('update(.02)');near(r('laserActive.aim.x'),290);g.event('pointerup',160,450,1);assert.equal(r('laserActive'),null);g.event('pointerup',290,200,2);assert.equal(r('jump'),null);assert.equal(r('shots.length'),0);
// The old tap-plus-hold can no longer fire a laser.
g.event('pointerdown',340,250);r('update(.05)');g.event('pointerup',340,250);g.event('pointerdown',340,250);r('update(.3)');assert.equal(r('laserActive'),null);g.event('pointerup',340,250);assert(r('jump'));
const h=base();h.run('upgrades.laser=1');h.event('pointerdown',340,620,1);h.event('pointerdown',74,200,2);h.run('update(.2)');assert.equal(h.run('laserActive'),null);assert.equal(h.run('press'),null);h.event('pointermove',74,400,1);h.run('update(.1)');assert(h.run('laserActive'));h.run('pauseGame();resume()');assert.equal(h.run('activePointers.size'),0);assert.equal(h.run('laserActive'),null);
const locked=base();locked.event('pointerdown',160,450,1);locked.event('pointerdown',280,220,2);locked.run('update(.2)');assert.equal(locked.run('laserActive'),null);locked.event('pointerup',160,450,1);locked.event('pointerup',280,220,2);assert.equal(locked.run('jump'),null);
console.log('Two-finger laser alignment, aiming, release, pause, locked power, and removal of old gesture OK');
}
{
const g=base(),r=g.run;r('levelStartY=2000;globalThis.border=finishY();p.y=border+160;camera=p.y-H*.66;globalThis.dest=border-200;globalThis.a=target({x:R-17,y:dest});globalThis.coin={x:L+17,y:border-50,type:"coin",phase:0};pickups=[coin];globalThis.enemyObj={x:L+17,y:border-90,hp:3,side:-1,type:0,age:0,fire:100};enemies=[enemyObj];launch(a)');assert(r('a.y<border'));let crossed=false;while(r('jump')){r('update(.02)');if(r('level')===2&&r('jump'))crossed=true;}assert(crossed);assert.equal(r('state'),'playing');assert.equal(r('level'),2);near(r('p.y'),r('a.y'));near(r('levelStartY'),r('border'));assert(r('enemies.includes(enemyObj)'));assert(r('pickups.includes(coin)'));assert.equal(r('passedGates[0].y'),r('border'));assert(g.node('reward').hidden);r('draw()');
console.log('Gate can be crossed mid-jump, keeping destination, enemies, pickups, and passed force field');
}
{
const g=base(),r=g.run;g.event('pointerdown',300,250);r('update(1.6)');assert.equal(r('shots.length'),0);assert.equal(r('upgrades.trap'),0);g.event('pointerup',300,250);assert(r('jump'));
r('jump=null;upgrades.trap=1');g.event('pointerdown',300,250);r('update(1.5)');assert(r('press.trapFired'));g.event('pointerup',300,250);r('level=15;beginBoss();bindEnemy(boss)');near(r('boss.webUntil-t'),7);r('t+=6.99');assert(r('isWebbed(boss)'));r('t+=.02');assert(!r('isWebbed(boss)'));r('bossTune().trapDuration=5;bindEnemy(boss)');near(r('boss.webUntil-t'),5);
console.log('Trapping web locked until reward; seven-second boss default and hidden duration setting OK');
}
for(let level=25;level<=30;level++){
const g=base(),r=g.run;r(`level=${level};enemies=[];rows=0;nextRow=500;spawn(-10000)`);assert.equal(r('enemies.some(e=>e.samurai)'),level>=27);assert.equal(r('enemies.some(e=>e.leaper)'),level>=29);if(level>=27){r('globalThis.sam=enemies.find(e=>e.samurai)');assert.equal(r('sam.hp'),r('8*Math.max(1,Math.ceil((1+Math.floor((combatLevel()-1)/6))*settings().health))'));assert(r('sam.climber'));}assert(r('enemies.length<=18'));r('draw()');
}
console.log('Samurai only in levels 27–30, with exactly eightfold basic health; acrobats only in 29–30');
{
const g=base(),r=g.run;r('level=29;globalThis.e={x:R-17,y:300,side:1,hp:3,leaper:true,age:0,jumpWait:5};enemies=[e]');r('updateLeaper(e,4.99)');assert(!r('e.leap'));r('updateLeaper(e,.02)');assert(r('e.leap'));r('badShots=[];fireEnemy(e)');assert.equal(r('badShots.length'),0);r('bindEnemy(e)');const x=r('e.x');r('updateLeaper(e,2)');near(r('e.x'),x);r('e.webbed=false;updateLeaper(e,1.2)');assert.equal(r('e.side'),-1);assert.equal(r('e.jumpWait'),5);r('p.y=e.y-150');const y=r('e.y');r('updateLeaper(e,.2)');assert(r('e.y')<y);r('p.y=e.y+150');const y2=r('e.y');r('updateLeaper(e,.2)');assert(r('e.y')>y2);
console.log('Acrobat climbs both ways, waits five visible seconds, jumps to hero wall, never fires and can be trapped');
}
{
const g=base(),r=g.run;r('level=30;beginBoss()');assert.equal(r('boss.kind'),9);assert.equal(r('boss.name'),'SPIDER-MALO');assert(r('t>=boss.senseReadyAt'));r('globalThis.s={life:2};globalThis.hp=boss.hp');assert(r('spiderBossDodge(boss,s)'));assert.equal(r('boss.hp'),r('hp'));near(r('boss.senseReadyAt-t'),20);r('t+=1;hitBoss(1)');near(r('boss.senseReadyAt-t'),20);r('bindEnemy(boss)');const x=r('boss.x'),y=r('boss.y');r('updateBoss(1)');near(r('boss.x'),x);near(r('boss.y'),y);assert(!r('spiderBossDodge(boss,{life:2})'));r('t+=7.1;boss.fire=0;updateBoss(.1)');assert(r('badShots.every(s=>s.web&&!s.trap)'));assert.equal(r('laserActive'),null);
let jumped=false,changedSide=false;for(let i=0;i<300;i++){r('t+=.02;updateBoss(.02)');if(r('boss.travel'))jumped=true;if(r('boss.side')===1)changedSide=true;}assert(jumped&&changedSide);r('draw()');
console.log('Spider-Malo: slower wall movement, web jumps/shots, rechargeable dodge, no laser or trapping weapon');
}
for(const reduced of [false,true]){
const g=base(reduced),r=g.run;r('start();mode="practice"');const names=[];
for(let n=1;n<=30;n++){
assert.equal(r('level'),n);r(clean+'globalThis.oldGate=finishY();p.y=oldGate+150;camera=p.y-H*.66;launch({x:p.side<0?R-17:L+17,y:oldGate-120,side:-p.side})');
let steps=0;while(r('jump')&&steps++<100)r('update(.02)');assert(steps<100);
if(n%3){assert.equal(r('level'),n+1);assert.equal(r('state'),'playing');}
else{assert(r('boss'));names.push(r('boss.name'));if(n===12)r('health=3');r('hitBoss(1e9)');while(r('bossDeath'))r('updateBossDeath(.02)');if(n<30){r('updateCelebration(2)');assert.equal(r('state'),'reward');if(n===12){assert.equal(r('health'),3);assert.equal(r('maxHearts'),6);}if(n===15)assert.equal(r('upgrades.trap'),1);if(n===24)assert.equal(r('upgrades.sense'),0);if(n===27)assert.equal(r('upgrades.sense'),1);r('nextLevel()');while(r('transition'))r('updateTransition(.02)');}else assert.equal(r('state'),'won');}
r('draw()');}
assert.equal(names.length,10);assert.equal(names[4],'TEJEDOR');assert.equal(names[9],'SPIDER-MALO');assert.equal(r('bossesDefeated'),10);r('start()');assert.equal(r('upgrades.trap'),0);assert.equal(r('maxHearts'),5);console.log(`${reduced?'Reduced':'Normal'} motion: full 30-stage/10-boss progression and reward mapping OK`);
}
{
const storage=new Map(),g=game(false,800,storage),r=g.run;r('openTuning();labDraft.normal.bosses[9].moveSpeed=.5;labDraft.normal.enemies.leaper.jumpDelay=6;saveTuning()');assert.equal(game(false,800,storage).run('tuning.normal.bosses[9].moveSpeed'),.5);r('globalThis.old={bosses:Array.from({length:8},(_,i)=>({health:1+i*.1})),stages:Array.from({length:24},(_,i)=>({scroll:i===12?1.5:1}))};globalThis.m=makeProfile(old)');near(r('m.bosses[5].health'),1.4);assert.equal(r('m.stages[15].scroll'),1.5);assert.equal(r('m.bosses.length'),10);assert.equal(r('m.stages.length'),30);assert.equal(r('m.bosses[4].trapDuration'),7);
console.log('Hidden settings save/reload and existing 24-stage settings migration OK');
}
// Render real game art, including the two new opponents and the final boss.
const g=base(),r=g.run;r("ctx.fillStyle='#101522';ctx.fillRect(0,0,W,H);hero(90,140,1,0,1);hero(295,140,2,0,-1,0,0,false,null,true);ctx.save();ctx.translate(110,340);ctx.scale(1.6,1.6);enemy({x:0,y:0,side:1,hp:32,maxHp:32,samurai:true,climbPhase:1},0);ctx.restore();ctx.save();ctx.translate(300,340);ctx.scale(1.8,1.8);enemy({x:0,y:0,side:-1,hp:3,leaper:true,age:0,jumpWait:5,climbPhase:1},0);ctx.restore();level=15;beginBoss();boss.x=110;boss.y=610;drawBoss();level=30;boss=null;beginBoss();boss.x=290;boss.y=640;boss.goalY=500;boss.age=.2;drawBoss();");fs.writeFileSync('tmp/30-sprites-check.png',g.canvas.toBuffer('image/png'));
console.log('Artwork contact sheet rendered');
