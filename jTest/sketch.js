var askurl = 'https://qrng.anu.edu.au/API/jsonI.php?length=10&type=uint8';

var ask2 = 'https://api.wolframalpha.com/v1/result?i=Is+a+tomato+a+fruit%3F&appid=GY4UW4-ATAR842QWR&format=image&output=JSON';

var ask3 = 'https://api.wolframalpha.com/v1/conversation.jsp?appid=GY4UW4-ATAR842QWR&i=How+tall+is+michael+jordan%3f&units=metric'

function setup()
{



}



function draw()
{


}



function mousePressed()
{


loadJSON(ask3,whatHappened);

}


function whatHappened(returnData)
{
console.log(returnData);

}