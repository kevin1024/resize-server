var sharp = require('sharp');

module.exports = function transform(operations) {
  var transformer = sharp();
  console.log(operations);
  operations.forEach(operation => {
    if (operation.op == 'resize') {
      transformer = transformer.resize(operation.width, operation.height);
      if (operation.fitIn) {
        transformer.max();
      }
    }
    if (operations.op == 'format') {
      if (operation.type == 'png') {
        transformer.png();
      }
    }
  })
  return transformer;
}
