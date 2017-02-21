// These two dependencies remain the same
  var tessel = require('tessel');
  var servolib = require('servo-pca9685');
  var http = require('http');

  // Require two other core Node.js modules
  var fs = require('fs');
  var url = require('url');


  var server = http.createServer(function (request, response) {
    // Break up the url into easier-to-use parts
    var urlParts = url.parse(request.url, true);

    // Create a regular expression to match requests to toggle LEDs
    var ledRegex = /leds/;
    var moveRegex = /move/;

    if (urlParts.pathname.match(ledRegex)) {
      // If there is a request containing the string 'leds' call a function, toggleLED
      toggleLED(urlParts.pathname, request, response);
    }
    else if (urlParts.pathname.match(moveRegex)){
      move(urlParts.pathname, request, response);
    }
    else {
      // All other request will call a function, showIndex
      showIndex(urlParts.pathname, request, response);
    }
  });

  // Stays the same
  server.listen(8080);

  // Stays the same
  console.log('Server running at http://192.168.1.101:8080/');

  // Respond to the request with our index.html page
  function showIndex (url, request, response) {
    // Create a response header telling the browser to expect html
    response.writeHead(200, {"Content-Type": "text/html"});

    // Use fs to read in index.html
    fs.readFile(__dirname + '/index.html', function (err, content) {
      // If there was an error, throw to stop code execution
      if (err) {
        throw err;
      }

      // Serve the content of index.html read in by fs.readFile
      response.end(content);
    });
  }

  function move (url, request, response) {
    console.log("trying to move")
    // Create a regular expression to find the number at the end of the url
    var positionRegex = /(\d)$/;

    // Capture the number, returns an array
    var result = positionRegex.exec(url);

    // Grab the captured result from the array
    var position = result[1];
    console.log("position: ", position);

    var servo = servolib.use(tessel.port['A']);
    var servo1 = 1;

    servo.on('ready', function(){
      console.log("inside servo on ready");
      servo.configure(servo1, 0.05, 0.12, function () {
        console.log('Position (in range 0-1):', position);
        position = position * 0.1
        //  Set servo #1 to position pos.
        servo.move(servo1, position);
        response.writeHead(200, {"Content-Type": "application/json"});
        response.end();
      });
    });
  }


