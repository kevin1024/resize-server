const expect = require('expect');
const pipeline = require('../app/pipeline');

describe("pipeline", () => {
  it("turns an options hash into a list of operations", () => {
    expect(pipeline({
      fitIn: 'fit-in',
      width: 200,
      height: 43,
      filters: 'format(png)',
      image: 'http://u.realgeeks.media/hawaiis/hawaiirealestatecompany.png'
    })).toEqual([
        {op: 'get', url: 'http://u.realgeeks.media/hawaiis/hawaiirealestatecompany.png'},
        {op: 'resize', width: 200, height: 43, fitIn: true},
        {op: 'format', type: 'png'},
    ]);
  })
  it("works for standard (no fit-in)", () => {
    expect(pipeline({
        width: 10,
        height: 20,
        image: 'http://u.realgeeks.media/hawaiis/hawaiirealestatecompany.png'
    })).toEqual([
        {op: 'get', url: 'http://u.realgeeks.media/hawaiis/hawaiirealestatecompany.png'},
        {op: 'resize', width: 10, height: 20, fitIn: false},
    ]);
  })
});
