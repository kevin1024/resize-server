const http = require('http');
const https = require('https');
const querystring = require('querystring');
const url = require('url');
const sharp = require('sharp');
const throng = require('throng');
const blocked = require('blocked');
const debug = require('debug')('blocked-stats');
const parser = require('./parser');
const pipeline = require('./pipeline');
const transform = require('./transform');

const hostname = '127.0.0.1';
const port = 3000;

console.log('enabling SIMD support...');
sharp.simd(true);
console.log('SIMD support is: ' + sharp.simd());

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;
  const options = parser(path);
  console.log(options);
  if (!options) {
    res.write('Not Found');
    res.end();
    return;
  }
  var operations = pipeline(options);
  http.get(options.image, (data) => {
    res.statusCode = 200;
    data.pipe(transform(operations)).pipe(res, {end: true});
  });
});

const timer = blocked((ms) => debug(`IO loop blocked for ${ms}ms`));

throng((id) => {
  console.log(`started worker ${id}`);
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
