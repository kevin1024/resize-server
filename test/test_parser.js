var expect    = require("expect");
var parser    = require("../app/parser");

// http://localhost:3000/thumbnail/Tuoif_IPnf-hGzDgV8JK-9QOSsw=/trim:top-left:15/182x144/5300bd6bc2133fa6cf5a-f08d3bc3583f298527886c37bf1e72be.r38.cf1.rackcdn.com/1/4dc0576c99ab13bfcde4143ffcbf12c2.jpg

describe("parser", () => {
  it("parses a fit-in url with png filter", () => {
    const parsed = parser("/thumbnail/hhHBARYkLhFz3p__BzIF7uQbi6g=/fit-in/200x43/filters:format(png)/u.realgeeks.media/hawaiis/hawaiirealestatecompany.png");
    expect(parsed).toInclude({
      width: 200,
      height: 43,
      hash: 'hhHBARYkLhFz3p__BzIF7uQbi6g=',
      filters: "format(png)",
      image: "http://u.realgeeks.media/hawaiis/hawaiirealestatecompany.png",
    })
  })
  it("parses a fit-in url with trim", () => {
    const parsed = parser("/thumbnail/Tuoif_IPnf-hGzDgV8JK-9QOSsw=/trim:top-left:15/182x144/5300bd6bc2133fa6cf5a-f08d3bc3583f298527886c37bf1e72be.r38.cf1.rackcdn.com/1/4dc0576c99ab13bfcde4143ffcbf12c2.jpg");
    expect(parsed).toInclude({
      width: 182,
      height: 144,
      hash: 'Tuoif_IPnf-hGzDgV8JK-9QOSsw=',
      image: "http://5300bd6bc2133fa6cf5a-f08d3bc3583f298527886c37bf1e72be.r38.cf1.rackcdn.com/1/4dc0576c99ab13bfcde4143ffcbf12c2.jpg",
      trim: 'trim:top-left:15'
    })

  });
})
