function touches(a, b) {
	// has horizontal gap
	if (a.x1 > b.x2 || b.x1 > a.x2) return false;

	// has vertical gap
	if (a.y1 > b.y2 || b.y1 > a.y2) return false;

	return true;
}//stolen code
function convertToObj(pos,HBsize=10) {
	return {x1:pos[0]-HBsize/2,x2:pos[0]+HBsize/2,y1:pos[1]-HBsize/2,y2:pos[1]+HBsize/2}
}
var todo=[]
var temps={}
var gamespeed=1
var x=0
function vecMag(x) {
	x=x.reduce((y,z)=>(y+(z**2)))
	return x**0.5
}
function toUnit(x) {
	let mag=vecMag(x)
	x=x.map((y)=>y/mag)
	return x
}
function init() {
	pos=[250,250]
	bullets=[]
	bullets.push(new genericMover(2,[250,0],[0,250]))
	temps={
		time4:{
			iter:50,
			base:{time:4,func:()=>{bullets.push(new genericMover(2,[250,0],((s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*250)))([250,0])));if (temps.time4.iter>0) {todo.push({time:0.35,func:temps.time4.base.func});temps.time4.iter--}}}
		},
		time7:{
			iter:34,
			base:{time:7,func:()=>{bullets.push(new genericMover(2,[250,0],((s)=>(toUnit([s[0]-pos[0],-s[1]+pos[1]]).map((x)=>x*250)))([250,0])));if (temps.time7.iter>0) {todo.push({time:0.35,func:temps.time7.base.func});temps.time7.iter--}}}
		},
		time13: {
			iter:10,
			base:{time:13,func:()=>{waveGaps([0,0],[70,0],5,(s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*150)),5);if (temps.time13.iter>0) {todo.push({time:0.65,func:temps.time13.base.func});temps.time13.iter--}}}
		}
	}
	todo=[{time:1,func:()=>{waveGaps([0,0],[70,0],11,[0,200],5)}},
		  {time:1.5,func:()=>{waveGaps([-35,0],[70,0],11,[0,200],5)}},
		  {time:2.5,func:()=>{waveGaps([-35,0],[70,0],11,(s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*150)),5)}},
		  {time:3,func:()=>{bullets.push(new genericMover(2,[250,0],((s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*250)))([250,0])));if (temps.time4.iter>0) {todo.push({time:0.35,func:temps.time4.base.func});temps.time4.iter--}}},
		  {time:6,func:()=>{waveGaps([0,0],[70,0],11,[0,100],5)}},
		  {time:6.5,func:()=>{waveGaps([-35,0],[70,0],11,[0,200],5)}},
		  {time:7.125,func:()=>{bullets.push(new genericMover(2,[250,0],((s)=>(toUnit([s[0]-pos[0],-s[1]+pos[1]]).map((x)=>x*250)))([250,0])));if (temps.time7.iter>0) {todo.push({time:0.35,func:temps.time7.base.func});temps.time7.iter--}}},
		  {time:11.5,func:()=>{waveGaps([-35,0],[70,0],11,(s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*150)),5)}},
		  {time:12.5,func:()=>{waveGaps([-35,0],[70,0],11,(s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*100)),5)}},
		  {time:13,func:()=>{waveGaps([-35,0],[70,0],11,(s)=>(toUnit([-s[0]+pos[0],-s[1]+pos[1]]).map((x)=>x*150)),5);if (temps.time13.iter>0) {todo.push({time:0.35,func:temps.time13.base.func});temps.time13.iter--}}},
		  ]
		  for (let temp=0;temp<6;temp++) {
			  todo.push({time:1+temp*1.5,func:()=>{waveGaps([0,0],[70,0],11,[0,200],5)}});
			  todo.push({time:temp*1.5+1.75,func:()=>{waveGaps([-35,0],[70,0],11,[0,200],5)}});
		  }
}
class bullet {
	constructor(does=()=>{},despawn=0,pos=[0,0],other={}) {
		this.does=does;
		this.despawn=despawn;
		this.pos=pos;
		Object.keys(other).forEach((x)=>{this[x]=other[x]})
	}
	tick(difff) {
		this.does(difff,this)
		this.despawn -= difff
		if (touches(convertToObj(this.pos),convertToObj(pos))) {init()}
	}
}
class genericMover extends bullet {
	constructor(despawn=0,pos=[0,0],vel=[0,0]) {
		super((diff)=>{this.pos=[this.pos[0]+this.vel[0]*diff,this.pos[1]+this.vel[1]*diff]},despawn,pos,{vel:vel})
	}
}
function waveGaps(start=[0,0],diff=[0,0],iters=0,vel=[0,0],despawn=0) {
	let tempII=JSON.parse(JSON.stringify(start))
	for (let temp=0;temp<iters;temp++) {
		bullets.push(new genericMover(despawn,tempII,((typeof vel)=="object")?vel:vel(tempII)))
		tempII=[tempII[0]+diff[0],tempII[1]+diff[1]]
	}
}
input={right:false,left:false,up:false,down:false}
window.addEventListener("keyup", function(event) {
    switch (event.code) {
        case "ArrowRight":
            input.right = false
            break;
        case "ArrowLeft":
            input.left = false
            break
        case "ArrowUp":
            input.up = false
            break;
        case "ArrowDown":
            input.down = false
            break;
    }
});
window.addEventListener("keydown", function(event) {
    switch (event.code) {
        case "ArrowRight":
            input.right = true
            break;
        case "ArrowLeft":
            input.left = true
            break;
        case "ArrowUp":
            input.up = true
            break;
        case "ArrowDown":
            input.down = true
            break;
		case "KeyR":
			init()
			break;
		case "KeyP":
			let y=x
			x=gamespeed
			gamespeed=y
			break;
}})
 var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');
var pos=[250,250]
var bullets=[]
currentDate=new Date().getTime()
document.body.appendChild(canvas)
setInterval(()=>{
	let temp=new Date().getTime()
	temp-=currentDate
	currentDate=new Date().getTime()
	temp/=1000
	let diff=temp*gamespeed
	bullets.forEach((x)=>{
		x.tick(diff)
	})
	bullets=bullets.filter((x)=>x.despawn>0)
	todo.forEach((x,i)=>{
		x.time-=diff
		if (x.time<0) {
			x.func()
			todo.splice(i,1)
		}
	})
	canvas.height = 500;
	canvas.width = 500;
	context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
	if (input.left) {pos[0]-=300*diff}
	if (input.down) {pos[1]+=300*diff}
	if (input.up)   {pos[1]-=300*diff}
	if (input.right){pos[0]+=300*diff}
	if (pos[0]<10) {pos[0]=10}
	if (pos[1]<10) {pos[1]=10}
	if (pos[0]>490) {pos[0]=490}
	if (pos[1]>490) {pos[1]=490}
	context.fillStyle = '#00f';
    context.fillRect(pos[0]-5, pos[1]-5, 10, 10);
	context.fillStyle = '#f00';
	bullets.forEach((x)=>{
		context.fillRect(x.pos[0]-5, x.pos[1]-5, 10, 10);
	})
},12)
init()