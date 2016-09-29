JavaScript Tracker
==================

A chrome extension tracks front-end JavaScript which using DOM or jQuery APIs to manipulate html dom elements (e.g., change style, attach event listener) on web page at runtime.

## Demo

## Installation

Add JavaScript Tracker to your Google Chrome from [Chrome Web Store]()

## Usage

1. Go to the [example page](https://pilagod.github.io/js-tracker/example/)

2. Click JavaScript Tracker extension

3. Interact with the page (e.g., hover or click the button) opened by JavaScript Tracker

4. Open Elements panel in Chrome DevTools and select the button

5. Check the sidebar pane "JS Tracker" to see information about only those JavaScript code manipulating the button

There are many cool websites built with jQuery in [Best jQuery Websites](http://www.awwwards.com/websites/jquery/), try JavaScript Tracker out : )

**NOTE:** Updating information in sidebar pane "JS Tracker" is triggered by selection change among elements in Elements panel, thus it needs to re-select the element to see any new  updates.  

**NOTE:** This extension focuses on DOM and jQuery APIs, those web pages using template to render updates are not sufficiently effective. (try [jQuery TodoMVC](http://todomvc.com/examples/jquery/#/all) example)

## Contribution

This extension is built on TDD (Test-Driven Development) using [mocha](https://mochajs.org), [karma](http://karma-runner.github.io/1.0/index.html),  [chai](http://chaijs.com) and [sinon](http://sinonjs.org), here is a website introduce TDD for JavaScript - [A GENTLE INTRODUCTION TO JAVASCRIPT TEST DRIVEN DEVELOPMENT](http://jrsinclair.com/articles/2016/gentle-introduction-to-javascript-tdd-intro/)

Suggestions and discussions are highly welcomed. Feel free to share any good ideas : )

### Setup

``` sh
$ git clone https://github.com/pilagod/js-tracker.git
```

and then run

``` sh
$ npm install
```

at the directory root

### Reminding

All unit tests and integration tests are in` test/lib/EsprimaParser-unit` and `test/lib/EsprimaParser-integration` respectively.

Code added to `lib` should have corresponding unit tests, and new feature added to extension should have associated integration tests.

If there is any question, it's welcome to communicate with me : )

### Test

**unit test:**
``` sh
$ npm run test-unit
```

**integration test:**
``` sh
$ npm run test-integration
```

## License
MIT
