const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const {createCanvas}=require('@napi-rs/canvas');
fs.mkdirSync('tmp',{recursive:true});
const html=fs.readFileSync(process.argv[2]||require('path').join(__dirname,'..','index.html'),'utf8'),code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function game(reduced=false,height=800,storage=new Map()){
 let now=0;const downloads=new Map();
 const canvas=createCanvas(420,height),nodes=new Map(),audioEvents=[];
 function node(id){if(!nodes.has(id))nodes.set(id,{hidden:false,style:{},textContent:'',handlers:{},classList:{add(){},remove(){}},click(){this.clickCount=(this.clickCount||0)+1},focus(){},reportValidity(){return true},setCustomValidity(v){this.validity=v},setAttribute(){},addEventListener(k,fn){(this.handlers[k]??=[]).push(fn)},querySelector(){return node(id+'-card')},getBoundingClientRect(){return {width:420,height,left:0,top:0}}});return nodes.get(id);}
 Object.assign(node('game'),{getContext:()=>canvas.getContext('2d'),setPointerCapture(){}});
 for(const key of ['width','height'])Object.defineProperty(node('game'),key,{get:()=>canvas[key],set:v=>canvas[key]=v});
 const parameter=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}});
 const soundNode=()=>({connect(){},disconnect(){},start(){audioEvents.push('start')},stop(){},frequency:parameter(),gain:parameter(),Q:parameter()});
 class AudioContext{constructor(){this.currentTime=0;this.sampleRate=44100;this.state='running';this.destination={};audioEvents.push('context')}createBuffer(n,len,rate){const data=new Float32Array(len);audioEvents.push({length:len,rate,data});return {getChannelData:()=>data}}createBufferSource(){return soundNode()}createBiquadFilter(){return soundNode()}createGain(){return soundNode()}createOscillator(){return soundNode()}}
 const context={document:{getElementById:node,addEventListener(){},createElement:tag=>tag==='canvas'?createCanvas(1,1):node(tag)},window:{devicePixelRatio:1,addEventListener(){},matchMedia:()=>({matches:reduced}),AudioContext},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},performance:{now:()=>now},Blob,URL:{createObjectURL(blob){const key='blob:test-'+downloads.size;downloads.set(key,blob);return key},revokeObjectURL(key){downloads.delete(key)}},requestAnimationFrame(){},console};
 vm.createContext(context);vm.runInContext(code.replace(/\}\)\(\);\s*$/,`globalThis.run=source=>eval(source);})();`),context);
 const run=s=>context.run(s),event=(name,x=210,y=250,id=1)=>(node('game').handlers[name]||[]).forEach(fn=>fn({clientX:x,clientY:y,pointerId:id,button:0,preventDefault(){}}));
 return {run,event,node,canvas,audioEvents,storage,downloads,setNow:v=>now=v};
}

module.exports={game,createCanvas};
