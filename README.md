JavaScript Tracker 
[![Build Status](https://travis-ci.org/pilagod/js-tracker.svg?branch=master)](https://travis-ci.org/pilagod/js-tracker)
[![Coverage Status](https://coveralls.io/repos/github/pilagod/js-tracker/badge.svg?branch=dev-v3)](https://coveralls.io/github/pilagod/js-tracker?branch=dev-v3)
==================

A chrome extension tracks front-end JavaScript that uses DOM or jQuery APIs to manipulate html dom elements (e.g., change style, attach event listener) on web page at runtime.

## Features

* **Live Tracking**, what changes you see on page is what code you get.
* **Code by Elements**, only listing the code that affects selected element.
* **Brief Overview**, getting rough code information at a glance.
* **Easy Filtering**, grouping manipulations into 5 types.
* **Link to Source**, one click to see all details.
* **Performance Improvement**, take advantage of browser JavaScript engine

## Demo Video

[![JavaScript Tracker Demo](https://i.imgur.com/SLCEL8S.png)](https://youtu.be/8AxKYsUHn1Q)

## Installation

Add JavaScript Tracker to your Google Chrome from [Chrome Web Store](https://goo.gl/D6WVAX)

## Usage (see [Demo Video](#demo-video) for visual guide)

1. Go to the page you want to track (you can use [example page](https://pilagod.github.io/js-tracker/example/) to give it a try).

2. Click JavaScript Tracker icon on Chrome  browser extension bar.

3. Interact with the page opened by JavaScript Tracker.

4. Open Elements panel in Developer Tools and select the element you are interested in.

5. Go to the "JS-Tracker" sidebar to see what JavaScript code affects the selected element.

There are also [some websites](https://github.com/pilagod/js-tracker/blob/gh-pages/README.md) selected by me that you can try JavaScript Tracker as much as you like. 😄

## Limitations

Those elements wrapped in `<iframe>` can not be tracked, since `<iframe>` creates an independent executive environment of its parent.

## Future Works

* Track [jQuery-UI](https://jqueryui.com)
* Optimize resouce usage

## Contribution

Suggestions and discussions are highly welcome. Feel free to open issues or email me for any bug, question, idea or feature wish. 😃

## Special Thanks

Special thanks to Fiti, a fantastic UI/UX designer, for the design of logo, banner, music, and sidebar materials. Without her I will never give birth to this project. 🙂️

## License
MIT
