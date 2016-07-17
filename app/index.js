const querystring = require('querystring');
const url = require('url');
const http = require('http');
const request = require('request');
const sharp = require('sharp');
const throng = require('throng');
const blocked = require('blocked');
const debug = require('debug')('blocked-stats');
const parser = require('./parser');
const pipeline = require('./pipeline');
const transform = require('./transform');

const hostname = '0.0.0.0';
const port = 3000;

console.log('enabling SIMD support...');
sharp.simd(true);
console.log('SIMD support is: ' + sharp.simd());

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;
  const options = parser(path);
  console.log(options);
  if (!options) {
    res.statusCode = 404;
    res.write('Problem parsing your request');
    res.end();
    return;
  }
  var operations = pipeline(options);
  res.statusCode = 200;
  request(options.image)
    .on('error', (err) => {
      res.write(`Error retrieving image ${options.image}: ${err}`);
      res.statusCode = 400;
      res.end();
    })
    .pipe(transform(operations)).pipe(res, {end: true});
});

const timer = blocked((ms) => debug(`IO loop blocked for ${ms}ms`));

throng((id) => {
  console.log(`started worker ${id}`);
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
});
