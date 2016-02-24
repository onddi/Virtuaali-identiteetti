var port = 8080;
var screenshotCount = 0;

var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    querystring = require('querystring');

function postHandler(request, callback) {
  var query_ = { };
  var content_ = '';

  request.addListener('data', function(chunk) {
    content_ += chunk;
  });

  request.addListener('end', function() {
    query_ = JSON.parse(content_);
    callback(query_);
  });
}

function sendJSONResponse(res, object) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write(JSON.stringify(object), 'utf8');
  res.end();
}

function startsWith(str, start) {
  return (str.length >= start.length &&
          str.substr(0, start.length) == start);
}

function saveScreenshotFromDataURL(dataURL) {
  var EXPECTED_HEADER = "data:image/png;base64,";
  if (startsWith(dataURL, EXPECTED_HEADER)) {
    var filename = "img/screenshot-" + (pad(screenshotCount++, 3)) + ".png";
    fs.writeFile(
        filename,
        dataURL.substr(
            EXPECTED_HEADER.length,
            dataURL.length - EXPECTED_HEADER.length),
        'base64');
    util.print("Saved Screenshot: " + filename + "\n");
  }
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

server = http.createServer(function(req, res) {
  if (req.method == "POST") {
    postHandler(req, function(query) {
      switch (query.cmd) {
        case 'screenshot':
          saveScreenshotFromDataURL(query.dataURL);
          sendJSONResponse(res, { ok: true });
          break;
        default:
          util.print("err: unknown post: " + query + "\n");
          break;
      }
    });
  }
}),

server.listen(port);