// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;
let isFirstTime = true;
let song;
let songPlaying = false;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  var context = new AudioContext();
 
  document.querySelector('button').addEventListener('click', function() {
  context.resume().then(() => {
    //  song = new Pizzicato.Sound('biisi.mp3', function() {
      song = new Pizzicato.Sound('https://foodadvisor.s3.us-east-2.amazonaws.com/song.wav', function() {
      // Sound loaded!
      console.log('Playback resumed successfully');
      song.play();
      songPlaying = true;
      console.log('PLAYING')
      
  });
});
});
poseNet.on('pose', gotPoses);
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var delay_flag = 1;
var reverb_ins_flag = 1;
var delay_ins_flag = 1;

// JK's new variables //
var reverb_flag = 0;
// end //

//Magda new variable
var flanger_flag = 0;



function gotPoses(poses) {

  // Decide which part you want to track
    let leftShoulder = {};

    //sound effect for Flanger
    var flanger = new Pizzicato.Effects.Flanger(); ({
        time: 0.45,
        speed: 0.2,
        depth: 0.1,
        feedback: 0.1,
        mix: 0.5
    })

  
   // sound effect for REVERB
   var reverb = new Pizzicato.Effects.Reverb({
    time: 1,
    decay: 0.01,
    reverse: true,
    mix: 0.5
  });
  // sound effect for Compressor
  var comp = new Pizzicato.Effects.Compressor({
      threshold: -20,
      knee: 22,
      attack: 0.05,
      release: 0.05,
      ratio: 18
  });

  var highPassFilter = new Pizzicato.Effects.HighPassFilter({
    frequency: 10,
    peak: 10
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
let delay = new Pizzicato.Effects.Delay({
  feedback: 0.3,
  time: 1.0,
  mix: 0.5
});


  
  if (poses.length > 0) {
    pose = poses[0].pose;

    let lW_x = Math.round(pose.leftWrist.x);
    let lW_y = Math.round(pose.leftWrist.y);

    let rW_x = Math.round(pose.rightWrist.x);
    let rW_y = Math.round(pose.rightWrist.y);

    skeleton = poses[0].skeleton;
    if (skeleton.length > 0) {
      skeleton[0].forEach(element => {

        // check if your selected part has been detected by the webcam
        if(element.part === 'leftShoulder') {
          leftShoulder = element
        }
      });
    }



   //APPLYING FLANGER EFFECT
//@@@@@@@@@@@@@@@@@@@@@@@@@@@
      if (lW_x > 400 && lW_x < 625) {
          // Flanger Button == flag 2
          if (lW_y > 347 && lW_y < 440 ) {
              document.getElementById("flanger").src = "imgs/Flanger.png"
             // this resets all other effects
              delay_flag = 0;
              song.removeEffect(flanger)
              // end Magda Code
              flanger_flag = 2;
              song.addEffect(flanger);

              setTimeout(() => {
                  console.log('removing flanger trigger')
                  song.removeEffect(flanger)
              }, 3000)
         }
      }



  // APPLYING REVERB EFFECT
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@
    if(lW_x>527 && lW_x<625) {
      // Reverb Button == flag 1
      if(lW_y>288 && lW_y<466){
        document.getElementById("reverb").src = "imgs/Reverb_click.png"
        // START OF JK's CODE ////
        // this resets all other effects
        delay_flag = 0;
        song.removeEffect(delay)    
            // end JK Code
        reverb_flag = 1;
        song.addEffect(reverb);
      // reverb gesture = when the right wrist is close to the left elbow. The reverb effect will change as you move this
      // position from left -> right of the screen.
      if (reverb_flag ==1) {
        let rightWristPos = Math.round(pose.rightWrist.x);
        let leftElbowPos = Math.round(pose.leftElbow.x);

        let diff = Math.abs(leftElbowPos - rightWristPos)
        console.log('leftElbowPos', leftElbowPos)
        console.log('rightWristPos', rightWristPos) 
 

        if (diff < 50){
          console.log('THE GESTURE IS WORKINGGGG') 
          reverb.decay = Math.round((rightWristPos +0.01)/100)
          console.log('The reverb decay is ', reverb.decay) 

        if(reverb_ins_flag == 1){
          document.getElementById("ins_main").src = "imgs/Reverb_ins.png"
          setTimeout(() => {
            document.getElementById("ins_main").src = ""
            document.getElementById("ins_min").src = "imgs/Reverb_min.png"
          }, 3000)

          setTimeout(() => {
            document.getElementById("ins_min").src = ""
            document.getElementById("reverb").src = "imgs/Reverb.png"
            reverb_ins_flag = 0;
            console.log('removing effect')
            song.removeEffect(reverb)
          }, 6000)      
        } 

        else {
          document.getElementById("ins_min").src = "imgs/reverb_min.png"
          setTimeout(() => {
            document.getElementById("ins_min").src = ""
            document.getElementById("reverb").src = "imgs/Reverb.png"
            console.log('removing effect')
            song.removeEffect(reverb)         
          }, 3000)
        }




        }  

      }
      } 
    }

      // APPLYING HIGH PASS EFFECT
      if (lW_x > 496 && lW_x < 625) {
          if (lW_y > 93 && lW_y < 271) {
              console.log('Applying high pass effect');
              song.addEffect(highPassFilter);

              setTimeout(() => {
                  console.log('removing high pass effect')
                  song.removeEffect(highPassFilter)
              }, 3000)
          }
      }



     //   @@@@@@@@@@@@@@@@@@@@@@@@@@@
        if(rW_x>0 && rW_x<97) {
          if(rW_y>291 && rW_y<469){

            // JK's Code
            // this resets all other effects
            reverb_flag = 0;
            song.removeEffect(reverb)    
            // end JK Code


            document.getElementById("delay").src = "imgs/Delay_click.png"
            if(delay_flag==1){ //delay_flag makes sure effect only be added for once
              console.log('Applying delay');
              song.addEffect(delay);
              delay_flag = 0;
            }
            let nosePos = Math.round(pose.nose.x);
            //@@@@@@@@@@@@@@ 
            /** 320 and 640(or 580, which can amplify the effect)
             * need to be modified according to width
             * of the window
             */
            delay.time = ((nosePos-320)/580 + 0.5)*2;
            delay.mix = (nosePos-320)/580 + 0.5;
            console.log("delay_mix", delay.mix);
            console.log("delay_time", delay.time);
    
            // setTimeout(() => {
            //   console.log('removing delay')
            //   song.removeEffect(delay)
            //   delay_flag = 1; 
            // }, 8000)

            // TRIGGER THE BUTTON FOR THE FIRST TIME
            if(delay_ins_flag == 1){
              document.getElementById("ins_main").src = "imgs/Delay_ins.png"
              setTimeout(() => {
                document.getElementById("ins_main").src = ""
                document.getElementById("ins_min").src = "imgs/Delay_min.png"
              }, 3000)

              setTimeout(() => {
                document.getElementById("ins_min").src = ""
                document.getElementById("delay").src = "imgs/Delay.png"
                console.log('removing effect')
                song.removeEffect(delay)
                
                delay_ins_flag = 0;
                delay_flag = 1; 
              }, 6000)      
            } 

            else {
              document.getElementById("ins_min").src = "imgs/Delay_min.png"
              setTimeout(() => {
                document.getElementById("ins_min").src = ""
                document.getElementById("delay").src = "imgs/Delay.png"
                console.log('removing effect')
                song.removeEffect(delay)
                delay_flag = 1; 
              }, 4000)
            }
          } 
        }

        //PAUSING AND PLAYING
      if(lW_x>401 && lW_x<569) {
        if(lW_y>459 && lW_y<552){
          if (songPlaying === false && song) {
            song.play();
            songPlaying = true;
          } else if (songPlaying === true && song) {
            song.pause();
            songPlaying = false;
          }
        } 
      }
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

/*function draw() {
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
  }
}*/



function draw() {

 /* translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);*/
    image(video, 0, 0);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
}

