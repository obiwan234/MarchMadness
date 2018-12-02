/* Notes:
	order of seeds might have probems caused by the order in which brackets are created
*/
let bracketWidth;
let bracketHeight;
let canvas;
let marchMadness;
let div1=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];//put teams in order of seeds
let div2=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
let div3=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
let div4=["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];

let allTeams=[div1,div2,div3,div4];//somehow propogate through bracket; divs:first play last-move inwards
let teams=[];
let convertList=[0,15,7,8,4,11,3,12,5,10,2,13,6,9,1,14];
for(let seedOrderList of allTeams) {//in order of seed
	let seedList=[];
	for(let i=0; i<seedOrderList.length; i++) {
		seedList[i]=seedOrderList[convertList[i]];
	}
	teams.push(seedList);
}

function bracket(numLevels,currDepth,direction,parent,x,y,lineHeight,teamList) {
	this.x=x;
	this.y=y;
	this.depth=currDepth;
	this.numLevels=numLevels;
	this.lineHeight=lineHeight;
	let numWidths=2*this.numLevels-1;
	this.lineLength=bracketWidth/numWidths;
	this.dir=0;
	if(parent) {
		this.parent=parent;
		this.dir=direction;
	}
	if(!Array.isArray(teamList)) {
		this.team=teamList;
	} else {
		this.teamList=teamList;
	}
	if(this.depth<this.numLevels-1) {//numlevels is like length, depth is like index
		this.children=[null,null];
		let tempTeams;
		if(this.teamList.length>2) {//teamList is by definition is a list bec only exec if children
			let a2=this.teamList.slice(0);
			let a1=a2.splice(0,a2.length/2);
			tempTeams=[a1,a2];
		} else if(this.teamList.length==2) {
			tempTeams=this.teamList;
		}
		for(let i=0; i<2; i++) {
			let tempDir=this.dir;
			let newY=(i-0.5)*this.lineHeight+this.y;
			let newHeight=this.lineHeight/2;
			if(this.dir==0) {
				tempDir=(i-0.5)*2;
				newY=this.y;
				newHeight=bracketHeight/2;//canvas height
			}
			let newX=this.x+tempDir*this.lineLength;
			let newTeam=tempTeams[i];
			if(Array.isArray(tempTeams[i])) {
				newTeam=tempTeams[i].slice(0);
			}
			this.children[i]=new bracket(this.numLevels,this.depth+1,tempDir,this,newX,newY,newHeight,newTeam);//1-i if cause problems
		}
	}
	this.display=function() {
		strokeWeight(3);
		if(!parent) {//middle one
			rect(this.x,this.y,this.lineLength,this.lineLength/2);
		} else {
			line(this.x-this.lineLength/2,this.y,this.x+this.lineLength/2,this.y);//horizontal line
		}
		if(this.children) {
			if(parent) {
				line(this.x+this.dir*this.lineLength/2,this.y+this.lineHeight/2,this.x+this.dir*this.lineLength/2,this.y-this.lineHeight/2);//vertical line
			}
			for(let child of this.children) {
				child.display();
			}
		}
		if(this.team) {
			push();
			textAlign(CENTER);
			textSize(10);
			text(this.team,this.x+this.dir*(this.lineLength/2+10),this.y);
			pop();
		}
	}
}


function setup() {
	canvas=createCanvas(windowWidth,windowHeight);
	canvas.position(0,0);
	bracketWidth=0.95*width;
	bracketHeight=0.95*height;
	rectMode(CENTER);
	marchMadness=new bracket(7,0,false,false,width/2,height/2,0,teams.slice(0));//slice to clone array
}

function draw() {
	background(255);
	marchMadness.display();
	textSize(0.0377*width);
	text("March Madness",0.36*width,0.15*height);
}


