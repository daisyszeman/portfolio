let canvas;
let button;

let water = [];
let waterLimit = 4;
let n = 0;
let gravity = 0.03;
let friction = -0.9;

let angle = 10;
let angleChange = 0;

let glowing = 0;
let blossom = 1;
let flowerState = glowing; //blossom


dx = 0;
dir = 1;

let flowerSize = 4;


function setup() {

  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element

  addGUI();

  colorMode(HSB);
  angleMode(DEGREES);
  noStroke();
  // stroke(0,0,255);
  // strokeWeight(10);
  
  

  for(let i = 0; i < n; i++){
    water.push(new Water());
  }

}

function draw() {
  background(230,50,15);
  orbitControl(4,4);

  drawFlower();
  updateWater();

  let locX = height;
  let locY = width / 2;

  ambientLight(255, 255, 255);
  pointLight(255, 255, 255, 0, -height, 0);

  

  if(flowerState == glowing){
 
    for(let i = 0; i < water.length; i++){
      water[i].move();
      water[i].display();
    }
      if(flowerSize > 13){
        flowerState = blossom
      }

  }else if (flowerState == blossom){
    angleChange = 1;
  }

}

function drawFlower(){
  push();
  translate(0,200,0);
  rotateY(angle);
  angle += angleChange;

  for(let r=0; r<=1; r+=0.03){
        beginShape(POINTS);
        for(let theta = 0; theta <=180*flowerSize; theta +=3){
          stroke(30 *flowerSize , -r*50 + 100 , r*50 + 50);

          let phi = 15*Math.exp(theta/1500); //responsible for verticle direction

          let hangDown = 2 * pow(r,2) * pow(1.3 * r - 1 ,2) 
                          * sin(phi); // the lower verticle direction, the higher sin(phi) (between 0 to 1)

          let petalCut = 1- (1/2)*pow(1- (3.6*theta%360)/180 , 4); //between 1 to 0

          let pX = 250 * petalCut* r * sin(phi) * sin(theta);
          let pY = -250 * petalCut* (r * cos(phi) - hangDown);
          let pZ = 250 * petalCut * r * sin(phi) * cos (theta);
          vertex(pX, pY, pZ);
          
        }
        endShape();

        
    }
    pop();
}

function updateWater(){
  
  translate(0,-300,0);

  console.log(water);

  for(let i = water.length-1; i >= 0 ; i--){
    let distanceY =  0 - water[i].y;
    //console.log(water[i].y);
    

     if(abs(distanceY) > 400){
      water.splice(i,1);
        if(flowerSize < 14){
          flowerSize += 2;
        }else{
          flowerSize = 4;
        }
      
      }
    }
}


function addGUI()
{
  //add a button
  button = createButton("Water");

  button.addClass("button");

  //Add the play button to the parent gui HTML element
  button.parent("gui-container");
  
  //Adding a mouse pressed event listener to the button 
  button.mousePressed(handleButtonPress); 
}

function handleButtonPress()
{
  background(230,50,15);
  addWater = true;
  

  water.push(new Water());

    // if(water.length <= waterLimit-1){
    //   water.push();
    // }
    
    if(flowerSize > 13){
      button.html("DONE");
      button.addClass("inactive");
    }
  
}


class Water{
  constructor(idIn){
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.d = random(30,70);
    this.xVel = 0;
    this.yVel = 0;
    this.id = idIn;
    this.f = 255;
  }
  
  display(){
    fill(this.f)
    ambientMaterial(255);
    //ellipse(this.x,this.y,this.d);
    
    push();
    translate(this.x,this.y,this.z);
    
    sphere(30);
    
    
    

    pop();

  }
  
  move(){
    this.yVel += gravity*2;
    
    this.y += this.yVel;
    
 
    if(this.y + this.d/2 > height){
      this.yVel *= friction;
      this.y = height - this.d/2;
    }
    if(this.y - this.d/2 < 0){
      this.yVel *= friction;
      this.y = this.d/2;
    } 
  }
  

  
  
  
  
  
}
