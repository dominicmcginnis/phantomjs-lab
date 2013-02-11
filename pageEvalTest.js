//Expanding on the page loading test, this time we'll evaluate some script on the page as it comes in
//We need to load (require) the webpage module and then create it as an object
var page = require('webpage').create();

//Now we can use this object to open a URL passing in a function that we can use to interact with the loading page
page.open('http://www.chucknorrisfacts.com/', function(s) {
	//We are going to manipulate the page by changing the background to the header image.
    	var logo = page.evaluate(function () {
        	var img = document.getElementById("logo-floater");
        	img.style.backgroundColor = "#000000";
        	return document.img;
   	});
   
	//Now we are going to render the page as a png and store it on the filesystem, clipping it to the dimensions we want.
	//Basically this is taking a screen shot 
	page.clipRect = { top: 0, left: 0, width: 600, height: 700 };
    	page.render("logo.png");
    	phantom.exit();
});
