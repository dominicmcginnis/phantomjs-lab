//this example loads a supplied page, renders it and takes a snapshot naming the snapshot based on the current time and supplied PageName.
var page = require('webpage').create(),
    system = require('system'),
    t, address,pageName;

if (system.args.length < 3) {
    console.log('Usage: suppliedPageEval.js <some URL> <page Name>');
    phantom.exit();
}

t = Date.now();
address = system.args[1];
pageName = system.args[2] + "_" + t + ".png";
page.open(address, function (status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
	phantom.exit();
    } else {
	console.log("Rendering page...");
            window.setTimeout(function () {
                page.render(pageName);
                phantom.exit();
            }, 200);
    }
});
