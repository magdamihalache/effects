// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let song;
let bong;


function preload() {
  song = loadSound('song.mp3');
  hev = loadSound('heaven.mp3');
  bong = loadSound('thunder.mp3');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses)
  song.loop();
}

function gotPoses(poses) {
  
let leftShoulder = {};
let rightShoulder = {};
  
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  if (skeleton.length > 0) {
      skeleton[0].forEach(element => {

        // check if your selected part has been detected by the webcam
        if(element.part === 'leftShoulder') {
          leftShoulder = element}
   });
  }
  
   if('score' in leftShoulder) {
      console.log('leftShoulder MOVED ', leftShoulder)
    
    let freq = Math.round(leftShoulder.position.y);
    //let freq2 = Math.round(leftElbow.position.x);
     
    if(leftShoulder.position.y <= 170){
    hev.play();}
    else {
    hev.pause(); }
     
  }
}
   
   if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  if (skeleton.length > 0) {
      skeleton[0].forEach(element => {

        // check if your selected part has been detected by the webcam
        if(element.part === 'rightShoulder') {
          rightShoulder = element}
   });
  }
  
   if('score' in rightShoulder) {
      console.log('rightShoulder MOVED ', rightShoulder)
    
    let freq2 = Math.round(rightShoulder.position.y);
     
     if(rightShoulder.position.y <= 170){
    bong.play();}
    else {
    bong.pause(); }
  }
}
  
  
}





function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);   
    } 
    
   // line(0, 170, 640, 170)
  }
}