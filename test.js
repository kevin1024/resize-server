const http = require('http');
const https = require('https');
const querystring = require('querystring');
const url = require('url');
const sharp = require('sharp');
const throng = require('throng');
const blocked = require('blocked');
const debug = require('debug')('blocked-stats');

const hostname = '127.0.0.1';
const port = 3000;

console.log('enabling SIMD support...');
sharp.simd(true);
console.log('SIMD support is: ' + sharp.simd());

function getTransformer(options) {
  return sharp().resize(options.dimensions[0], options.dimensions[1]).max().png();
}

function parsePath(path) {
  // Kind of based on thumbor: https://github.com/thumbor/libthumbor/blob/master/libthumbor/url.py
  const pattern = RegExp([
    String.raw`/(?:(?:(unsafe|resize)|(?:thumbnail/)?(.+?))/)?`,
    String.raw`(?:(debug)/)?`,
    String.raw`(?:(meta)/)?`,
    String.raw`(?:(trim(?::(?:top-left|bottom-right))?(?::\d+)?)/)?`,
    String.raw`(?:(\d+)x(\d+):(\d+)x(\d+)/)?`,
    String.raw`(?:(adaptive-)?(full-)?(fit-in)/)?`,
    String.raw`(?:(-)?((?:\d+|orig))?x(-)?((?:\d+|orig))?/)?`,
    String.raw`(?:(left|right|center)/)?`,
    String.raw`(?:(top|bottom|middle)/)?`,
    String.raw`(?:(smart)/)?`,
    String.raw`(?:filters:(.+?\))/)?`,
    String.raw`(.+)`,
  ].join(''))
  // Whyyy doesn't javascript have named capture groups????
  const match = path.match(pattern, path);
  if (match) {
    const matches = {
      unsafe: match[1],
      hash: match[2],
      debug: match[3],
      meta: match[4],
      trim: match[5],
      cropLeft: match[6],
      cropTop: match[7],
      cropRight: match[8],
      cropBottom: match[9],
      adaptive: match[10],
      full: match[11],
      fitIn: match[12],
      horizontalFlip: match[13],
      width: match[14],
      verticalFlip: match[15],
      height: match[16],
      halign: match[17],
      valign: match[18],
      smart: match[19],
      filters: match[20],
      image: match[21],
    }
    console.log(matches)
    var out = {
      dimensions: [parseInt(matches.width), parseInt(matches.height)],
      filters: matches.filters,
      url: matches.image
    }
    if (!out.url.startsWith('http')) {
      out.url = 'http://' + out.url;
    }
    return out
  }
}

// http://t.realgeeks.media/thumbnail/hhHBARYkLhFz3p__BzIF7uQbi6g=/fit-in/200x43/filters:format(png)/u.realgeeks.media/hawaiis/hawaiirealestatecompany.png
// http://localhost:3000/thumbnail/Tuoif_IPnf-hGzDgV8JK-9QOSsw=/trim:top-left:15/182x144/5300bd6bc2133fa6cf5a-f08d3bc3583f298527886c37bf1e72be.r38.cf1.rackcdn.com/1/4dc0576c99ab13bfcde4143ffcbf12c2.jpg

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).pathname;
  const options = parsePath(path);
  console.log(options);
  if (!options) {
    res.write('Not Found');
    res.end();
    return;
  }
  parsePath(path);
  http.get(options.url, (data) => {
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

