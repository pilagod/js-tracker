JavaScript Tracker
==================

A chrome extension tracks front-end JavaScript which using DOM or jQuery APIs to manipulate html dom elements (e.g., change style, attach event listener) on web page at runtime.

## Demo

[![JavaScript Tracker Demo](http://i.imgur.com/JWC9xut.png)](https://www.youtube.com/watch?v=bHcgtOF9wLw)

## Installation

Add JavaScript Tracker to your Google Chrome from [Chrome Web Store]()

## Usage

1. Go to the [example page](https://pilagod.github.io/js-tracker/example/)

2. Click JavaScript Tracker extension

3. Interact with the page (e.g., hover or click the button) opened by JavaScript Tracker

4. Open Elements panel in Chrome DevTools and select the button

5. Check the sidebar pane "JS Tracker" to see information about only those JavaScript code manipulating the button

There are also many cool websites built with jQuery in [Best jQuery Websites](http://www.awwwards.com/websites/jquery/), you can try it out there : )

**NOTE:** Updating information in sidebar pane "JS Tracker" is triggered by selection change among elements in Elements panel, thus it needs to re-select the element to see any new  updates.  

## Contribution

This extension is built on TDD (Test-Driven Development) using [mocha](https://mochajs.org), [karma](http://karma-runner.github.io/1.0/index.html),  [chai](http://chaijs.com) and [sinon](http://sinonjs.org). All production code are written after corresponding test code done first. If you are interesting to contribute, you can contact me for more details.

Suggestions and discussions are highly welcomed. Feel free to share any good ideas : )

## License
MIT
