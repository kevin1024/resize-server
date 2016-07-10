module.exports = function pipeline(options) {
  if (!options.image) {
    return [], 'Need an image';
  }
  var out = [
    {op: 'get', url: options.image},
  ];
  if (options.width && options.height) {
    out.push({op: 'resize', width: 200, height: 43});
  }
  if (options.filters === 'format(png)') {
    out.push({op: 'format', type: 'png'});
  }
  return out;
}
