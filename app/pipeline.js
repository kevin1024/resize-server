module.exports = function pipeline(options) {
  if (!options.image) {
    return [], 'Need an image';
  }
  var out = [
    {op: 'get', url: options.image},
  ];
  if (options.width && options.height) {
    out.push({op: 'resize', width: options.width, height: options.height, fitIn: !!options.fitIn});
  }
  if (options.filters === 'format(png)') {
    out.push({op: 'format', type: 'png'});
  }
  if (options.trim) {
    //trim:top-left:15
    var params = options.trim.split(':');
    out.push({op: 'trim', tolerance:parseInt(params[2])});
  }
  return out;
}
