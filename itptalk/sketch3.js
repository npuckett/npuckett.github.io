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
let totalImages = 51;
let slideNumber = 0;

let vidSlideNumber = [2,20,15,24,26,29,33,38,40,41,42,43,45,48];
let vidID = [
    136869177,
    194774588,
    194766883,
    193783285,
    27003262,
    207381031,
    194772784,
    427928071,
    427938564,
    428148623,
    318330598,
    397476627,
    427924759,
    427922725
];


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



function setup() 
{
  getAudioContext().resume();
  thecanvas = createCanvas(1000, 720);
  thecanvas.parent('p555');
  background(255);
  

//imageMode(CENTER);
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

    playVideo(231601301);

  
    dataServer.history(
        {
            channel: channelName,
            count: 1,
            reverse: false
        },
        function (status, response)
          {
            console.log(response.messages);
    
            for(let i =0; i<response.messages.length;i++)
            {
              //console.log(response.messages[i].entry);
              slideNumber = response.messages[i].entry.slide;
              slidehold = loadImage("slf/Slide" + slideNumber + ".JPG");
            }
          }
    
        );



}

function draw() 
{
    background(255);
    if(slideNumber>0)
    {
    image(slidehold,0,0); //show the image corresponds to the slide number in the array
    }
}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               
    
    slideNumber = inMessage.message.slide;
    slidehold = loadImage("slf/Slide" + slideNumber + ".JPG");
    
    for(let i=0;i<vidSlideNumber.length;i++)
    {
        if(slideNumber==vidSlideNumber[i])
        {
            changeVid(vidID[i]);
            break;
        }
    }
}



function playVideo (videoNumber)
{
     console.log('tried'); 
    var options = {
        id: videoNumber,
        width: 960,
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
/*
    var options = {
        id: 231601301,
        width: 640,
        loop: true,
    };
*/

}


function changeVid(newvidnum)
{
    var player = new Vimeo.Player('videos');


    player.loadVideo(newvidnum).then(function(id) {
        // the video successfully loaded
    }).catch(function(error) {
        switch (error.name) {
            case 'TypeError':
                // the id was not a number
                break;
    
            case 'PasswordError':
                // the video is password-protected and the viewer needs to enter the
                // password first
                break;
    
            case 'PrivacyError':
                // the video is password-protected or private
                break;
    
            default:
                // some other error occurred
                break;
        }
    });





}
