///Setup the script
var page = require('webpage').create(),
    system = require('system'),
    timeStamp, urlToGetResultsFor, fileName, apiKey;

var fs = require('fs');

if (system.args.length < 4) {
    console.log('Usage: pagespeed.js <URL to run> <page Name> <api key>');
    phantom.exit();
}

timeStamp = Date.now();

// Specify the URL you want PageSpeed results for here:
urlToGetResultsFor = system.args[1];

//fileName = "test.json";
fileName = system.args[2] + "_" + timeStamp + ".json";

// Specify your actual API key here:
apiKey = system.args[3];

var apiURL = 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?';

var query = [
  'url=' + urlToGetResultsFor,
  'key=' + apiKey,
].join('&');

var URL = apiURL + query;

console.log("running pagespeed for: " + urlToGetResultsFor);
page.open(URL, function(status) {
    if (status !== 'success') {
        console.log('Unable to load URL');
        phantom.exit();
    } else {

      //Get the result from the request page and convert to a JSON object
      var jsonSource = page.plainText;
      var resultObject = JSON.parse(jsonSource);

      //If there is an error, then log it and exit
      if (resultObject.error) {
        var errors = resultObject.error.errors;
        for (var i = 0, len = errors.length; i < len; ++i) {
          if (errors[i].reason == 'badRequest' && apiKey == 'yourAPIKey') {
            console.log('Please specify your Google API key in the apiKey variable.');
            phantom.exit();
          } else {
            console.log(errors[i].message);
            phantom.exit();
          }
        }
      }

      // No errors, process the JSON object and exit
      fs.write(fileName, jsonSource, 'w');
      phantom.exit();
    }      
}); 
