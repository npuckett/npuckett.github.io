/*
 *PubNub 
 * remote controller that sends a variable to all the listening devices
 */

// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project

let dataServer;
let pubKey = 'pub-c-349733f3-ce8d-4185-bd21-aee35c06db00';
let subKey = 'sub-c-fc2a3f56-3865-11ea-afe9-722fee0ed680';

//input variables

let nextButton;
let slideNumber=0;
let totalImages = 50;


//name used to sort your messages. used like a radio station. can be called anything
let channelName = "powerpoint";

function setup() 
{

  createCanvas(windowWidth, windowHeight);
  background(255);
  
  

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  

  //create the button
 
  sendButton = createButton('NEXT');
  sendButton.position(0, 0);
  sendButton.mousePressed(sendTheMessage(1));
  sendButton.size(200,200);

}

function draw() 
{


}


//sends from the button press
function sendTheMessage(let how) 
{
if(how==1)
{
slideNumber = ((slideNumber+1)<=(totalImages)) ? slideNumber+=1 : 1; //shorthand for conditional assignment
}
if(how==2)
{
slideNumber = ((slideNumber-1)>=1) ? slideNumber-=1 : 1; //shorthand for conditional assignment
}
if(how==0)
{
slideNumber = 1; //shorthand for conditional assignment
}
console.log(slideNumber);

  //publish the number to everyone.
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        slide: slideNumber       
      }
    });

}


