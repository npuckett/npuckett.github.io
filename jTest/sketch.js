var askurl = 'https://qrng.anu.edu.au/API/jsonI.php?length=10&type=uint8';

var ask2 = 'https://api.wolframalpha.com/v1/result?i=Is+a+tomato+a+fruit%3F&appid=GY4UW4-ATAR842QWR&format=image&output=JSON';



function setup()
{



}



function draw()
{


}



function mousePressed()
{


loadJSON(ask2,whatHappened);

}


function whatHappened(returnData)
{
console.log(returnData);

}