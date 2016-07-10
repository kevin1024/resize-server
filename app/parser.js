module.exports = function parsePath(path) {
  // Kind of based on thumbor: https://github.com/thumbor/libthumbor/blob/master/libthumbor/url.py
  const pattern = RegExp([
    String.raw`/(?:(?:(unsafe|resize)|thumbnail/?(.+?))/)?`,
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
    const options  = {
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
    return options;
  }
}
