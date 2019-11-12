/*

Blank pubnub sketch
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-f7c6e88a-fd33-4fe4-9b76-a27626e5227d';
let subKey = 'sub-c-efd3536c-e6a6-11e8-b4a9-e69ca2f1dc0c';

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "imageSend";

function setup() 
{
  
  createCanvas(windowWidth,windowHeight);
  background(255);
  ellipse(100,100,100,100);
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true,  //enables a secure connection. This option has to be used if using the OCAD webspace
    uuid: "Nick"
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming});
  dataServer.subscribe({channels: [channelName]});

      var dataURL = compressImage(canvas, 32);

    if (dataURL == null) {
        alert("We couldn't compress the image small enough");
        return;
    }  



}

function draw() 
{


}


///uses built in mouseClicked function to send the data to the pubnub server
function mouseClicked() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        messageText: "testText"       //get the value from the text box and send it as part of the message   
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {

    console.log(inMessage);
  }
}

function compressImage(canvas, size) {
    var compression = 1.0;
    while(compression > 0.01) {
        var dataURL = canvas.toDataURL('image/jpeg', compression);
        if (dataURL.length/1012 < size) return dataURL;
        if (compression <= 0.1) {
            compression -= 0.01;
        } else {
            compression -= 0.1;
        }
    }
    return null;
}


