const assert=require('assert/strict'),fs=require('fs');const {game}=require('./game-harness.cjs');const clean="enemies=[];pickups=[];obstacles=[];civilians=[];nextRow=-1e9;";
const near=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} != ${b}`);
(async()=>{
{
const g=game(),r=g.run;r("tuning.hard.campaign.rewards[0]=[...REWARD_IDS];start()");assert.equal(r('upgrades.power'),2);assert(r('REWARD_IDS.every(k=>upgrades[k]>0)'));assert.equal(r('health'),5);assert.equal(r('maxHearts'),6);assert.equal(r('shield'),2);assert.equal(r('senseReadyAt'),20);r('tuning.hard.campaign.rewards[3]=[...REWARD_IDS];level=3;unlockRewards(3)');assert.equal(r('upgrades.power'),2);assert.equal(r('maxHearts'),6);assert.equal(r('unlockRewards(3).length'),0);r('tuning.hard.campaign.rewards[0]=[];start()');assert.equal(r('upgrades.laser'),0);assert.equal(r('maxHearts'),5);
console.log('All eight rewards can be granted at start; repeat rewards do not stack; restart resets powers');
}
{
const g=game(),r=g.run;r("tuning.hard.campaign.bosses[1]='spider_malo';tuning.hard.campaign.bosses[2]=null;tuning.hard.bosses[9].moveSpeed=0;tuning.hard.bosses[9].trapDuration=4;start();level=2;beginBoss()");assert.equal(r('boss.name'),'SPIDER-MALO');assert.equal(r('boss.tuningIndex'),9);assert.equal(r('bossTune().moveSpeed'),0);r('bindEnemy(boss)');near(r('boss.webUntil-t'),4);r('boss=null;level=3;beginBoss()');assert.equal(r('boss'),null);assert.equal(r('isBossLevel()'),false);
r("tuning.hard.campaign.bosses[29]='goliat';level=30;beginBoss();hitBoss(1e9)");while(r('bossDeath'))r('updateBossDeath(.02)');assert.equal(r('state'),'won');assert(g.node('winMessage').textContent.startsWith('GOLIAT'));
console.log('Boss assignment works outside multiples of three; archetype parameters follow the boss; final text is dynamic');
}
{
const g=game(),r=g.run;r("tuning.hard.campaign.bosses.fill(null);tuning.hard.campaign.rewards=Array.from({length:31},()=>[]);tuning.hard.campaign.rewards[2]=['laser','trap'];tuning.hard.campaign.rewards[7]=['heart','armor'];tuning.hard.campaign.rewards[30]=['sense'];start();mode='practice'");
for(let n=1;n<=30;n++){assert.equal(r('level'),n);r(clean+'p.y=finishY()+100;camera=p.y-H*.66;launch({x:p.side<0?R-17:L+17,y:finishY()-100,side:-p.side})');for(let i=0;i<100&&r('level')===n&&r('state')==='playing';i++)r('update(.02)');if(n===2){assert.equal(r('upgrades.laser'),1);assert.equal(r('upgrades.trap'),1);}if(n===7){assert.equal(r('maxHearts'),6);assert.equal(r('shield'),2);}r('draw()');}
assert.equal(r('state'),'won');assert.equal(r('bossesDefeated'),0);assert.equal(r('upgrades.sense'),1);assert(g.node('winMessage').textContent.includes('30 niveles'));
console.log('Entire campaign without bosses completes; multi-rewards on ordinary stages and final-stage rewards work');
}
{
const g=game(),r=g.run;r("tuning.hard.general.scroll=2;tuning.hard.hero.bulletDamage=1.5;tuning.practice.profiles.hard.general.scroll=.5;tuning.practice.profiles.hard.hero.bulletDamage=3;mode='practice'");assert.equal(r('tune().general.scroll'),2);r('tuning.practice.inheritArcade=false');assert.equal(r('tune().general.scroll'),.5);assert.equal(r('tune().hero.bulletDamage'),3);r("mode='arcade'");assert.equal(r('tune().hero.bulletDamage'),1.5);
r("mode='practice';tuning.practice.profiles.hard.campaign.rewards[0]=['laser'];start();"+clean+'damage()');assert.equal(r('upgrades.laser'),1);assert.equal(r('health'),5);r('tuning.practice.damageEnabled=true;damage()');assert.equal(r('health'),4);
r('tuning.practice.autoScroll=true;p.y=500;camera=0;grace=0;update(.02)');assert(r('camera')<0);r('tuning.practice.damageEnabled=false;camera=p.y-H+50;update(.02)');assert(r('p.y-camera')<=690.01);r('home();openTuning()');assert.equal(r('labMode'),'practice');r('labDraft.practice.inheritArcade=true;renderTuning()');assert(g.node('tuningEditor').disabled);const own=r('labDraft.practice.profiles.hard.hero.bulletDamage');r('labDraft.practice.inheritArcade=false;renderTuning()');assert.equal(r('labDraft.practice.profiles.hard.hero.bulletDamage'),own);assert(!g.node('tuningEditor').disabled);
g.node('practiceCopy').onclick();assert.equal(r('labDraft.practice.profiles.hard.hero.bulletDamage'),1.5);r('labDraft.practice.profiles.hard.hero.bulletDamage=2');assert.equal(r('labDraft.hard.hero.bulletDamage'),1.5);
console.log('Practice inherits or uses independent profiles; rules, profile preservation and copy isolation work');
}
{
const g=game(),r=g.run;r("openTuning();$('tuningSection').value='campaign';renderTuning(true);selectRewards(true)");assert.equal(r('labDraft.hard.campaign.rewards[0].length'),8);g.node('campaignBulk').value='3, 6-9, 30';g.node('campaignApply').onclick();for(const n of [3,6,7,8,9,30])assert.equal(r(`labDraft.hard.campaign.rewards[${n}].length`),8);assert.equal(r('labDraft.hard.campaign.bosses[29]'),'spider_malo');r('selectRewards(false)');assert.equal(r('labDraft.hard.campaign.rewards[0].length'),0);assert.equal(r('parseLevelList("todos").length'),31);assert.throws(()=>r('parseLevelList("31")'));assert.throws(()=>r('parseLevelList("8-3")'));
r("$('tuningTarget').value='2';campaignChange({target:{id:'campaignBoss',value:'nexo'}})");assert.equal(r('labDraft.hard.campaign.bosses[1]'),'nexo');assert(g.node('campaignSummary').innerHTML.includes('Nexo'));
console.log('Campaign editor: all/none, bulk ranges, assignment and summary work');
}
{
const storage=new Map(),g=game(false,800,storage),r=g.run;r("openTuning();labDraft.normal.campaign.bosses[0]='umbra';labDraft.normal.campaign.rewards[0]=['laser','heart'];labDraft.practice.inheritArcade=false;labDraft.practice.profiles.easy.hero.swing=1.5;labDraft.practice.damageEnabled=true;exportSettings()");const link=g.node('configDownload');assert.equal(link.download,'SpiderFlink-config.json');assert.equal(link.clickCount,1);const blob=g.downloads.get(link.href);assert(blob);const json=await blob.text(),payload=JSON.parse(json);assert.equal(payload.format,'spiderflink-config');assert.equal(payload.schemaVersion,3);assert.equal(payload.configs.arcade.normal.campaign.bosses[0],'umbra');assert.equal(payload.configs.practice.profiles.easy.hero.swing,1.5);assert.equal(payload.configs.practice.damageEnabled,true);
assert.equal(r('tuning.normal.campaign.bosses[0]'),null); // Export includes the draft but does not apply it.
r('saveTuning()');const reloaded=game(false,800,storage);assert.equal(reloaded.run('tuning.normal.campaign.bosses[0]'),'umbra');assert.equal(reloaded.run('tuning.practice.profiles.easy.hero.swing'),1.5);
const fresh=game(),f=fresh.run;f('openTuning()');await f(`importSettings({target:{value:'file',files:[{size:${Buffer.byteLength(json)},text:async()=>${JSON.stringify(json)}}]}})`);assert.equal(f('labDraft.normal.campaign.bosses[0]'),'umbra');assert.equal(f('tuning.normal.campaign.bosses[0]'),null);f('saveTuning()');assert.equal(f('tuning.normal.campaign.bosses[0]'),'umbra');
assert.deepEqual(JSON.parse(f('JSON.stringify(exportConfigObject().configs)')),payload.configs);
// Invalid imports are atomic: nothing is changed.
f('openTuning()');const before=f('JSON.stringify(labDraft)');for(const mutate of [p=>p.schemaVersion=99,p=>p.configs.arcade.hard.campaign.bosses[0]='unknown',p=>p.configs.arcade.hard.campaign.rewards[0]=['laser','laser'],p=>p.configs.practice.profiles.easy.hero.swing=999,p=>p.configs.arcade.normal.bosses=[],p=>p.configs.arcade.normal.hero.swing=1.013]){const bad=JSON.parse(json);mutate(bad);await f(`importSettings({target:{value:'file',files:[{size:1000,text:async()=>${JSON.stringify(JSON.stringify(bad))}}]}})`);assert.equal(f('JSON.stringify(labDraft)'),before);assert(fresh.node('tuningStatus').textContent.startsWith('No se importó nada.'));}
await f("importSettings({target:{value:'file',files:[{size:3000000,text:async()=>''}]}})");assert.equal(f('JSON.stringify(labDraft)'),before);
fs.writeFileSync('tmp/SpiderFlink-config-default.json',game().run('JSON.stringify(exportConfigObject(),null,2)'));
console.log('JSON download payload, saved reload, exact import/export round-trip, and rejection of invalid files OK');
}
console.log('All campaign/settings checks passed');
})().catch(e=>{console.error(e);process.exitCode=1});
