//We need to load (require) the webpage module and then create it as an object
var page = require('webpage').create();

//Now we can use this object to open a URL passing in a function that we can use to interact with the loading page
page.open('http://www.chucknorrisfacts.com/', function(s) {
	console.log(s);
	phantom.exit();
});

