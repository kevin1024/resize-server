module.exports = function (wallaby) {
  return {
    env: {
      type: 'node'
    },
    files: [
      'app/*.js'
    ],

    tests: [
      'test/*.js'
    ]
  };
};
