/*
PubNub  
 * Receiver file that cycles through images based on the input from the controller 
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;


let subKey = 'sub-c-fc2a3f56-3865-11ea-afe9-722fee0ed680';

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "powerpoint";


//image variables
var slidehold;
let totalImages = 50;
let slideNumber = 0;

let thecanvas;
/*
function preload() 
{
  //rather than making separate variables we are loading them all into an array
  for (let i = 0; i<totalImages; i++) 
  {
    img[i] = loadImage("slideimg/Slide" + (i+1) + ".JPG");
  }

}
*/

var options = {
    id: 231601301,
    width: 640,
    loop: true,
    autoplay: true
};

var player = new Vimeo.Player('videos',options);
player.setVolume(0);

player.on('play', function() {
    console.log('played the video!');
});

function setup() 
{
  getAudioContext().resume();
  thecanvas = createCanvas(windowWidth, 800);
  thecanvas.parent('p555');
  background(255);
  

imageMode(CENTER);
   // initialize pubnub
  dataServer = new PubNub(
  {
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});


    //display a waiting message
    background(255);
    noStroke();
    fill(0);  
    textSize(30)
    text("Waiting", width/2, height/2);

    playVideo(397476627);

  

}

function draw() 
{
    background(100);
    if(slideNumber>0)
    {
    image(slidehold,mouseX,mouseY); //show the image corresponds to the slide number in the array
    }
}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               
    
    slideNumber = inMessage.message.slide;
    slidehold = loadImage("slideimg/Slide" + slideNumber + ".JPG");
    

}



function playVideo (videoNumber)
{
     console.log('tried'); 
    var options = {
        id: videoNumber,
        width: 640,
        loop: true,
        autoplay: true
    };

    var player = new Vimeo.Player('videos',options);

    player.setVolume(0);

    player.on('play', function() {
        console.log('played the video!');
    });


}


function mouseClicked()
{
    console.log("why??");
    playVideo(231601301);
}
