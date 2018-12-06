/* Notes:
	make teams and put in seed order
*/
const boxHeight=20;
let bracketWidth;
let bracketHeight;
let canvas;
let marchMadness;
let allTeams;
let allBrackets;
let drag;//points to source bracket

//put teams in order of seeds; divs:1=South 2=West 3=East 4=Midwest; 2018 mm is in list
let divName1=["Virginia","Cincinnati","Tennessee","Arizona","Kentucky","Miami(FL)","Nevada","Creighton","Kansas St.",
				"Texas","Loyola(IL)","Davidson","Buffalo","Wright St.","Georgia St.","UMBC"];
let divName2=["Xavier","North Carolina","Michigan","Gonzaga","Ohio St.","Houston","Texas A&M","Missouri","Florida St.",
			"Providence","San Diego St.","South Dakota St.","UNC Greensboro","Montana","Lipscomb","Texas Southern"];
let divName3=["Villanova","Purdue","Texas Tech","Wichita St.","West Virginia","Florida","Arkansas","Virginia Tech",
			"Alabama","Butler","St. Bonaventure","Murray St.","Marshall","Stephen F. Austin","Cal St. Fullerton","Radford"];
let divName4=["Kansas","Duke","Michigan St.","Auburn","Clemson","TCU","Rhode Island","Seton Hall","North Carolina St.",
			"Oklahoma","Syracuse","New Mexico St.","Col. of Charleston","Bucknell","Iona","Penn"];
let teamNames=[divName1,divName2,divName3,divName4];//somehow propogate through bracket; divs:first play last-move inwards

function Team(div,seed) {
	this.seed=seed;
	this.positions=[];
	this.div=div;//which conference the team is in; sorting purposes
	this.name=teamNames[this.div-1][this.seed-1];
	this.display=function(bracket) {
		push();
		textAlign(CENTER,CENTER);
		textSize(14);
		text(this.name,bracket.x,bracket.y);
		pop();
	}
}

function bracket(numLevels,currDepth,direction,parent,x,y,lineHeight,teamList) {
	this.team=false;
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
		this.team.positions.push(this);
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
			allBrackets.push(this.children[i]);
		}
	}
	this.display=function() {
		strokeWeight(3);
		if(!parent) {//middle one
			rect(this.x,this.y,this.lineLength,this.lineLength/2);
		} else {
			if(this.team) {
				push();
				fill(180)
				noStroke();
				rect(this.x,this.y,this.lineLength,boxHeight);
				pop();
			} else {
				line(this.x-this.lineLength/2,this.y,this.x+this.lineLength/2,this.y);//horizontal line
			}
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
			this.team.display(this);
		}
		if(this.depth==this.numLevels-1) {
			push();
			if(this.dir==-1) {
				textAlign(RIGHT,CENTER);
			} else {
				textAlign(LEFT,CENTER);
			}
			textSize(10);
			text(this.team.seed,this.x+this.dir*(this.lineLength/2+5),this.y);
			pop();
		}
	}
	this.contains=function(xPos,yPos) {//give less space
		return xPos>this.x-this.lineLength/2&&xPos<this.x+this.lineLength/2&&yPos>this.y-boxHeight/2&&yPos<this.y+boxHeight/2;
	}
}


function setup() {
	canvas=createCanvas(windowWidth,windowHeight);
	canvas.position(0,0);
	bracketWidth=0.95*width;
	bracketHeight=0.95*height;
	drag=false;
	allBrackets=[];
	rectMode(CENTER);
	allTeams=[[],[],[],[]];
	for(let i=0; i<allTeams.length; i++) {
		for(let j=0; j<16; j++) {
			allTeams[i][j]=new Team(i+1,j+1);
		}
	}
	let teams=[];
	let convertList=[0,15,7,8,4,11,3,12,5,10,2,13,6,9,1,14];
	for(let seedOrderList of allTeams) {//in order of seed
		let seedList=[];
		for(let i=0; i<seedOrderList.length; i++) {
			seedList[i]=seedOrderList[convertList[i]];
		}
		teams.push(seedList);
	}
	marchMadness=new bracket(7,0,false,false,width/2,height/2,0,teams.slice(0));//slice to clone array
	allBrackets.push(marchMadness);
}

function draw() {
	background(255);
	marchMadness.display();
	textSize(0.0377*width);
	text("March Madness",0.36*width,0.15*height);
	if(drag) {
		push();
		fill(220)
		noStroke();
		rect(mouseX,mouseY,drag.lineLength,boxHeight);
		fill(0);
		textAlign(CENTER,CENTER);
		textSize(14);
		text(drag.team.name,mouseX,mouseY);
		pop();
	}
}

function mouseDragged() {
	if(!drag) {//check for bracket to pick up
		for(let bracket of allBrackets) {
			if(bracket.contains(mouseX,mouseY)&&bracket.team) {//add other conditions ie only last instance of team
				drag=bracket;
			}
		}
	}
	return false;
}

function mouseReleased() {
	if(drag) {
		for(let bracket of allBrackets) {
			if(bracket.contains(mouseX,mouseY)&&drag.parent==bracket) {//other conditions?; add way to add several rounds at a time
				bracket.team=drag.team;
				bracket.team.positions.push(bracket);
				if(bracket.team==bracket.parent.team) {
					//fix problem where a team that lost a previous round can be in(maybe functions for add and remove teams)
				}
			}
		}
	}
	drag=false;
}