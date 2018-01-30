JavaScript Tracker [![Build Status](https://travis-ci.org/pilagod/js-tracker.svg?branch=master)](https://travis-ci.org/pilagod/js-tracker)
==================

A chrome extension tracks front-end JavaScript which using DOM or jQuery APIs to manipulate html dom elements (e.g., change style, attach event listener) on web page at runtime.

## Features

* **Live Tracking**, what changes you see on page is what code you get.
* **Code by Elements**, only listing the code that affects selected element.
* **Brief Overview**, getting rough code information at a glance.
* **Easy Filtering**, grouping manipulations into 5 types.
* **Link to Source**, one click to see all details.

## Demo

[![JavaScript Tracker Demo](http://i.imgur.com/JWC9xut.png)](https://www.youtube.com/watch?v=bHcgtOF9wLw)

## Installation

Add JavaScript Tracker to your Google Chrome from [Chrome Web Store](https://goo.gl/D6WVAX)

## Usage

1. Go to the [example page](https://pilagod.github.io/js-tracker/example/)

2. Click JavaScript Tracker extension

3. Interact with the page (e.g., hover or click the button) opened by JavaScript Tracker

4. Open Elements panel in Chrome DevTools and select the button

5. Check the sidebar pane "JS-Tracker" to see information about those JavaScript code manipulating the button

There are also many cool websites built with jQuery in [Best jQuery Websites](http://www.awwwards.com/websites/jquery/), you can try it out there : )

## Contribution

This extension is built on TDD (Test-Driven Development) using [mocha](https://mochajs.org), [karma](http://karma-runner.github.io/1.0/index.html),  [chai](http://chaijs.com) and [sinon](http://sinonjs.org). All production code are written after corresponding test code done first. If you are interesting to contribute, you can contact me for more details.

Suggestions and discussions are highly welcomed. Feel free to share any good ideas : )

## License
MIT
