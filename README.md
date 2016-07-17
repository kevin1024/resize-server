# Speed Graphic

Image resize server in nodejs using the awesome sharp bindings.  Loosely based
on thumbor

# Motivation

I'm a big fan of Thumbor, but when running it at scale I started running into
some memory usage problems.  Thumbor is VERY fast, but it turns out that sharp
and nodejs is faster, at least for my use case.

# Operations
  * resize
  * fit-in (resizes so entire image fits in boundaries without cropping)
  * trim - removes whitespace or "boring" parts from outside of image
  * format (set output format, jpg or png)

## Thumbor Compatiblity

I have implemented a subset of thumbor's functionality and kept URLs that look
the same, but there is no guarantee that I will keep them this way.

## Running the app

```
npm start
```

## Running tests

```
npm install
npm run test
```

## Why the name?

I love old cameras, and one of my favorites is called the Speed Graphic.  Also,
this project is for manipulating graphics, and an important feature is its
speed.
