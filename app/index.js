const http = require('http');
const https = require('https');
const querystring = require('querystring');
const url = require('url');
const sharp = require('sharp');
const throng = require('throng');
const blocked = require('blocked');
const debug = require('debug')('blocked-stats');
const parser = require('./parser');

const hostname = '127.0.0.1';
const port = 3000;

console.log('enabling SIMD support...');
sharp.simd(true);
console.log('SIMD support is: ' + sharp.simd());

function getTransformer(options) {
  return sharp().resize(options.width, options.height).max().png();
}

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;
  const options = parser(path);
  console.log(options);
  if (!options) {
    res.write('Not Found');
    res.end();
    return;
  }
  http.get(options.image, (data) => {
    res.statusCode = 200;
    var transformer = getTransformer(options);
    data.pipe(transformer).pipe(res, {end: true});
  });
});

const timer = blocked((ms) => debug(`IO loop blocked for ${ms}ms`));

throng((id) => {
  console.log(`started worker ${id}`);
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
