let canvas;
let marchMadness;
let div1=["1a","1b","1c","1d","1e","1f","1g","1h","1i","1j","1k","1l","1m","1n","1o","1p"];//16 per div
let div2=["2a","2b","2c","2d","2e","2f","2g","2h","2i","2j","2k","2l","2m","2n","2o","2p"];
let div3=["3a","3b","3c","3d","3e","3f","3g","3h","3i","3j","3k","3l","3m","3n","3o","3p"];
let div4=["4a","4b","4c","4d","4e","4f","4g","4h","4i","4j","4k","4l","4m","4n","4o","4p"];
let teams=[div1,div2,div3,div4];//somehow propogate through bracket; divs:first play last-move inwards

function bracket(numLevels,currDepth,direction,parent,x,y,lineHeight) {
	this.x=x;
	this.y=y;
	this.depth=currDepth;
	this.numLevels=numLevels;
	this.lineHeight=lineHeight;
	let numWidths=2*this.numLevels-1;
	this.lineLength=width/numWidths;
	this.dir=0;
	if(parent) {
		this.parent=parent;
		this.dir=direction;
	}
	if(this.depth<this.numLevels-1) {//numlevels is like length, depth is like index
		this.children=[null,null];
		for(let i=0; i<2; i++) {
			let tempDir=this.dir;
			let newY=(i-0.5)*this.lineHeight+this.y;
			let newHeight=this.lineHeight/2;
			if(this.dir==0) {
				tempDir=(i-0.5)*2;
				newY=this.y;
				newHeight=height/2;//canvas height
			}
			let newX=this.x+tempDir*this.lineLength;
			this.children[i]=new bracket(this.numLevels,this.depth+1,tempDir,this,newX,newY,newHeight);
		}
	}
	this.display=function() {
		strokeWeight(4);
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
	}
}


function setup() {
	canvas=createCanvas(0.95*windowWidth,0.95*windowHeight);
	canvas.position(0.025*windowWidth,0.025*windowHeight);
	rectMode(CENTER);
	marchMadness=new bracket(6,0,false,false,width/2,height/2,0);
}

function draw() {
	background(255);
	marchMadness.display();
	textSize(55);
	text("March Madness",0.36*width,0.15*height);
}


