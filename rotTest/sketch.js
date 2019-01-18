/*

Blank pubnub sketch
 */

// server variables

var dataServer;
var pubKey = 'pub-c-a705a585-4407-4f88-8b83-ac846c45e13a';
var subKey = 'sub-c-64587bc8-b0cf-11e6-a7bb-0619f8945a4f';

var mouseSend = 0.000;

//size of the active area
var cSizeX = 900;
var cSizeY = 600;

var rotZ = 0.0;
var rotX = 0.0;
var rotY = 0.0;


//name used to sort your messages. used like a radio station. can be called anything
var channelName = "phoneRotations";

function setup() 
{
  getAudioContext().resume();
  createCanvas(cSizeX, cSizeY);
  background(255);
  
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming});
  dataServer.subscribe({channels: [channelName]});
setInterval(sendMessage, 200);

}

function draw() 
{
rotZ = rotationZ;
rotX = rotationX;
rotY = rotationY;

background(255);
fill(0);
text((rotZ+" "+rotX+" "+rotY), width/2, height/2);

}


///uses built in mouseClicked function to send the data to the pubnub server
function sendMessage() {
 
mouseSend = mouseX+random(0,0.999);
console.log(mouseSend);
  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        rotZ: rotationZ,
        rotX: rotationX,
        rotY: rotationY       //get the value from the text box and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {

    console.log(inMessage.message.messageText);
  }
}

