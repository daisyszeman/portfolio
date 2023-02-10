//"Is it a deer or a horse?"
//There is an Chinese idiom "call a stag a horse" describing the action of  twisting the truth / turn black into white, which is what the government and politicians in Hong Kong is doing today, twisting and manipulating the truth. 
//“The rules are simple: They lie to us, we know they’re lying, they know we know they’re lying, but they keep lying to us.” This work is to visualise the ridiculousness of the government today by training a machine which actually "call a stag a horse". It can be a installation asking audiences to show the camera any picture of a deer / a horse and ask the machine what it is, and the machine will give the answer by placing the picture to the category of "deer" or "horse", and keep the all the answers on the screen.


/*
  Data and machine learning for artistic practice (DMLAP)
  Week 2
  
  Image classifier via model trained with Teachable Machines
  adapted from https://github.com/ml5js/Intro-ML-Arts-IMA-F21
*/

let myDiv;
let deerTitleDiv;
let horseTitleDiv;

let canvas;
// Classifier Variable
let classifier;
// Model URL (replace with your model trained on teachablemachine.withgoogle.com)
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/U6bqoeULx/'; // Deer vs Horse

let instruction;
let myButton;
let buttonClassify;
let iX = 100;

let cameraCaptureSize = 150;
let snapSize = 100;
let snapx, snapy, destsnapx, destsnapy;

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let confidence = 0.0;

// Load the model first
function preload() {
  // eslint-disable-next-line prefer-template
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-container");
  background(100,0,0,10);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();

  
  //draw background
  fill(254,122,2);
  rect(0,0,width/2,height);
  
  fill(6,50,255);
  rect(width/2,0,width/2,height);

  snapx =  width/2-cameraCaptureSize/2;
  snapy = height/2-cameraCaptureSize/2;
  destsnapx = snapx; destsnapy = snapy;
  addGUI();

}

function draw() {
  //draw background
  fill(254,122,2);
  rect(0,0,width/2,height);
  
  fill(6,50,255);
  rect(width/2,0,width/2,height);background(100,0,0,10);
  //image(video, iX, random(0+snapSize,height-snapSize),snapSize,snapSize); //draw the image being captured on webcam onto the canvas 
  snapx = lerp(snapx, destsnapx, 0.3);; //lerp(snapx, destsnapx, 0.3);
  snapy = lerp(snapy, destsnapy, 0.3); //snapy + 0.3 * (destsnapy - snapy);
  
  image(flippedVideo, width/2-cameraCaptureSize/2, height/2-cameraCaptureSize/2,cameraCaptureSize, cameraCaptureSize);
  image(video, snapx, snapy,snapSize,snapSize); //draw the image being captured on webcam onto the canvas 
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  //console.log(results);
  label = results[0].label;
  confidence = results[0].confidence;
  
  if (results[0].label == "Deer"){
      iX = random(width/2 + cameraCaptureSize/2,width-snapSize/2);
      }else if (results[0].label == "Horse"){
        iX = random(0,width/2-cameraCaptureSize/2);
      }
  // Classifiy again!
  classifyVideo();
}

function takesnap() {
  destsnapx = iX;
  destsnapy = random(0+snapSize,height-snapSize);
  //image(video, iX, random(0+snapSize,height-snapSize),snapSize,snapSize); //draw the image being captured on webcam onto the canvas 
}

function addGUI()
{
  
  //add a button
  myButton = createButton("What is it?");
  myButton.addClass("button");
  myButton.parent("gui-container");
  myButton.mousePressed(takesnap);

  //add text
  
  myDiv = createDiv('Show the camera a picture of horse or deer, \n click the button to check what it is.');
  myDiv.addClass('divClass');
  myDiv.parent("text-container");

  deerTitleDiv = createDiv('Horse');
  deerTitleDiv.addClass('title');
  deerTitleDiv.parent("title-container");

  horseTitleDiv = createDiv('Deer');
  horseTitleDiv.addClass('title');
  horseTitleDiv.parent("title-container");
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}
