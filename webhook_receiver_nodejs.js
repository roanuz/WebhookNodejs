const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
var zlib = require('zlib');


function rawBody(req, res, next) {
  req.rawBody = '';
  req.chunks = []

  req.on('data', function(chunk) {
    req.chunks.push(Buffer(chunk));
  });
  req.on('end', function(){
    next();
  });
}

app.use(bodyParser.json())
app.use(rawBody);


app.post('/match/feed/v1/', function(req, res) {
  var buffer = Buffer.concat(req.chunks);
  zlib.unzip(
    buffer,
    // { finishFlush: zlib.constants.Z_SYNC_FLUSH },
    (err, buffer) => {
      if (!err) {
        data = JSON.parse(buffer.toString())
        console.log("Data",  data, typeof(data));
        res.send(JSON.stringify({"status": true}));
      } else {
        res.send(JSON.stringify({"status": false}));
      }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
