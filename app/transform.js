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
    if (operation.op == 'format') {
      if (operation.type == 'png') {
        transformer.png();
      }
      if (operation.type == 'jpg') {
        transformer.jpeg();
      }
    }
    if (operation.op == 'trim') {
      transformer.trim(operation.tolerance);
    }
  })
  return transformer;
}
