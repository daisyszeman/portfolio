
let loadbar = 0;
let failedLoads = [];
let jsonDocuments = [
  "./json/Dickens.json",
  //"./NotARealJsonFile.json", //note p5 editor handles errors weirdly here
  "./json/Short1.json"
];

let canvas;
let files = [];
let displayText = "";

//data structure
let phrases = []; // for cut up generator


//spinner
const slices = 5;
const colors = [];
let needleColor;
let randomChoice = Math.floor(Math.random() * slices);
let countDownTime = 1000;
let speed = 0.0025;
let choice = 4;
let GoSpin = false;

let click;
let lastMod = 0;
let myButton;


function setup() {
  canvas = createCanvas(500, 500);
  canvas.parent("sketch-container"); //move our canvas inside this HTML element
  
  loadFile(0);
  
  
  //spinner
    for(let i = 0; i<5; i++){
   colors.push(color(random(255), random(255), random(255), 255)); 
  }
  
  needleColor = color(random(255), random(255), random(255), 255);
  
  const offset = random(TWO_PI/slices) - (TWO_PI/slices)/2
  choice = int(choice)/slices * TWO_PI ;//+ offset ;
  
  canvas.parent("sketch-container"); //move our canvas inside this HTML element
  

  textSize(32);
  
  addGUI();
}

function addGUI()
{
  //add a button
  myButton = createButton("SPIN");
  myButton.addClass("myButton");
  myButton.parent("gui-container");
  myButton.mousePressed(handleCanvasPressed);
}

function draw() {
  
  background(200);

  if(loadbar < jsonDocuments.length){

    let barLength = width*0.5;
    let length = map(loadbar,0,jsonDocuments.length,barLength/jsonDocuments.length,barLength);
    rect(width*0.25,height*0.5,length,20);

  }else{
    let fontSize = map(displayText.length,0,200,30,20,true);
    textSize(fontSize);
    textWrap(WORD);
    textAlign(CENTER);
    text(displayText,50, 250, 400);

  }
  
  
  
  //spinner
    const rotation = countDownTime;

  push();
    translate(0,-100);
    push();
      translate(width/2, height/4);
      rotate(rotation);
      // rotate(-TWO_PI / slices);
      drawSpinner(rotation);
    pop();
    push();
      translate(width/2, height/4);
      drawNeedle();
    pop();
    fill(0); 
  
  if(GoSpin == true){
    //countDownTime -=100;
   countDownTime -= 0.3 * Math.max(0, (1.0 - deltaTime*speed)); 
    console.log(countDownTime);
    //console.log(frameCount);
  }
  pop();

}

function handleCanvasPressed(){
  //original text
  //show text in HTML
  // showText(displayText);
  
  
  //spinner
    if(GoSpin == false){
      GoSpin = true;
      displayText = generateCutUpPhrases(0);
      myButton.html("STOP");
      myButton.addClass("inactive");
      
    //countDownTime = 1000;
  }else if (GoSpin == true){
    GoSpin = false;
    countDownTime = 1000;
    displayText = generateCutUpPhrases(1);
    myButton.html("SPIN");
    myButton.removeClass("inactive");
    
  }

}

function buildModel(){
  console.log("run buildModel()");

  //create and store phrases
  
  for (let i = 0; i < files.length; i++){
    let text = files[i].text;
    console.log(text);
    
    let textPhrases = text.split(/(?=[.])/);
    console.log(textPhrases);
    
    for(let j = 0; j < textPhrases.length; j++){
      let puntuationless = textPhrases[j].replace(/[^a-zA-Z- ']/g,"");
      let lowerCase = puntuationless.toLowerCase();
      let trimmed = lowerCase.trim();
    console.log(trimmed);
      
    phrases.push(trimmed);
    }

  }

}

//Text Generator Function ----------------------------------

function generateCutUpPhrases(numPhrases){
  let output = " ";

  //implement your code to generate the output
  
  for(let i = 0; i<numPhrases; i++){
    let randomIndex = int(random(0,phrases.length));
    let randomPhrases = phrases[randomIndex];
    
    output += randomPhrases + ".";
  }
  return output;
}


//Generic Helper functions ----------------------------------

function loadFile(index){

  if(index < jsonDocuments.length){
    let path = jsonDocuments[index]; 

    fetch(path).then(function(response) {
      return response.json();
    }).then(function(data) {
    
      console.log("Loaded File");
      console.log(data);
      files.push(data);

      //showText("Training text number " + (index+1));
      //showText(data.text);
  
      loadbar ++;
      loadFile(index+1);
  
    }).catch(function(err) {
      console.log(`Something went wrong: ${err}`);
  
      let failed = jsonDocuments.splice(index,1);
      console.log(`Something went wrong with: ${failed}`);
      failedLoads.push(failed);// keep track of what failed
      loadFile(index); // we do not increase by 1 because we spliced the failed one out of our array

    });
  }else{
    buildModel();//change this to whatever function you want to call on successful load of all texts
  }

}

//add text as html element
function showText(text){

  let textContainer = select("#text-container");
//  textContainer.elt.innerHTML = "";//add this in if you want to replace the text each time

  let p = createP(text);
  p.parent("text-container");

}



function drawSpinner(rotation){
  
  const rot = (rotation) % (TWO_PI);
  for(let i =0; i<slices; i++){

    const pct = i / slices;
    const open = pct * TWO_PI ;
    const close = pct * TWO_PI + TWO_PI / slices ;
    const sliceW = TWO_PI/slices;
    
    if(open > TWO_PI-sliceW-rot && close < TWO_PI+sliceW-rot ){
       fill(255,0,0, 255);
      
     }
     else {
       fill(colors[i]);
    }

    arc(0, 0, width-100, width-100, open, close) ; 
  }
}


function drawNeedle(){
  
 const th = 200;
  const tw = 20;
  const tx = 0;
  const ty = 0;
  fill(needleColor);
 triangle(tx-tw/2, ty-th/2, tx+tw/2, ty-th/2, tx, ty + th/2); 
  
}




  