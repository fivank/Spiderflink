const assert=require('assert/strict');const {game}=require('./game-harness.cjs');
const clean="start();mode='practice';enemies=[];civilians=[];pickups=[];obstacles=[];nextRow=-1e9;upgrades.laser=1;p={x:74,y:600,side:-1};camera=0;";
{
const g=game(),r=g.run;r(clean+"globalThis.e={x:300,y:350,hp:100,type:0,side:1,age:0,fire:100};enemies=[e];activateLaser({x:300,y:350,id:1})");assert.equal(r('e.hp'),100);assert.equal(r('lasers[0].x'),r('playerMuzzle(laserActive.aim).x'));assert.equal(r('Math.hypot(lasers[0].tx-lasers[0].x,lasers[0].ty-lasers[0].y)'),0);
r('updateLaser(.016);updateLaser(.04)');assert.equal(r('e.hp'),100);assert(r('lasers[0].arriving'));r('draw()');r('updateLaser(.06)');assert.equal(r('e.hp'),0);r('stopLaser()');assert.equal(r('lasers.length'),0);
// Boss damage applies once after arrival, unchanged by the visual upgrade.
r(clean+'level=3;beginBoss();globalThis.hp=boss.hp;activateLaser({x:boss.x,y:boss.y,id:1})');assert.equal(r('boss.hp'),r('hp'));r('updateLaser(.016);updateLaser(.1)');assert.equal(r('hp-boss.hp'),r('laserDamage()'));r('updateLaser(.1);updateLaser(.1)');assert.equal(r('hp-boss.hp'),r('laserDamage()'));r('updateLaser(.21)');assert.equal(r('laserActive'),null);
// A pot stops both the animation and the damage.
r(clean+"globalThis.e={x:74,y:300,hp:5,type:0,side:-1,age:0,fire:100};enemies=[e];obstacles=[{x:57,y:400,w:48,h:20,kind:'pot'}];activateLaser({x:74,y:300,id:1});updateLaser(.016);updateLaser(.15)");assert.equal(r('e.hp'),5);assert(r('lasers[0].ty>=400'));assert(!r('lasers[0].arriving'));r('pauseGame()');assert.equal(r('laserActive'),null);
console.log('Laser: hand origin, visible travel, arrival damage once, unchanged boss damage, cover stop, expiry and cancellation OK');
}
{
const g=game(),r=g.run;r('start()');const names=[];for(const n of [1,4,7,10,13,16,19,22,25,28]){r(`level=${n};visualCache.atmosphere=null`);names.push(r('atmosphere().pal.label'));r('draw()');}assert.deepEqual(names,['Noche','Amanecer','Día','Atardecer','Noche','Amanecer','Día','Atardecer','Noche','Amanecer']);
r('level=3;minY=levelStartY-levelDistance()+1;visualCache.atmosphere=null;globalThis.before=atmosphere().pal.top;level=4;levelStartY=minY;visualTime+=.016');assert.equal(r('atmosphere().pal.top'),r('before'));r('home()');assert.equal(r('atmosphere().pal.label'),'Noche');
r('start();level=9;rows=12;nextRow=500;spawn(-3000)');assert.equal(r('new Set(civilians.map(c=>c.variant)).size'),3);for(const kind of [0,1,2])for(const reaction of ['calm','surprise','smile'])r(`drawCivilian({x:100,y:200,side:-1,seed:1,variant:${kind},reaction:'${reaction}'})`);
console.log('Day/night cycle, boundary color continuity, home reset and all three civilian variants/reactions OK');
}
for(const reduced of [false,true]){const g=game(reduced),r=g.run;r("start();level=30;beginBoss();bindEnemy(boss);draw();hero(210,400,2,0,1,0,0,true);rope(74,600,347,200,7);drawLaser({x:80,y:400,tx:300,ty:100,life:.4,arriving:true});");for(let i=0;i<10;i++)r(`boss=null;beginBoss(${i});drawBoss();bindEnemy(boss);drawWeb(boss)`);}
console.log('All bosses, armor and web effects render with regular and reduced motion');
