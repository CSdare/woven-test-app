/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_woven_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_woven_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_woven_js__);
 // need to add npm module

__WEBPACK_IMPORTED_MODULE_0_woven_js___default.a.connect();

window.onload = function () {
  // Add 10 functionality
  const add10Button = document.getElementById('add-10-btn');
  const numbers = Array.from(document.getElementsByClassName('number'));
  add10Button.onclick = function () {
    numbers.forEach(node => {
      let num = Number(node.innerHTML);
      __WEBPACK_IMPORTED_MODULE_0_woven_js___default.a.run('addTen', num).then(newNum => node.innerHTML = newNum);
    });
  };

  // Fib functionality
  function calcFib(num) {
    __WEBPACK_IMPORTED_MODULE_0_woven_js___default.a.run('nthFib', num).then(fib => {
      const li = document.createElement('li');
      li.textContent = fib;
      fibList.appendChild(li);
    });
  }

  const fibList = document.getElementById('fib-list');
  const fibNumber = document.getElementById('fib-number');
  const fibButton = document.getElementById('calc-fib');

  fibButton.addEventListener('click', () => calcFib(fibNumber.value || 8));
};

// setTimeout(woven.run('addTen', 20).then(output => console.log('output from run function is ', output)), 1000);

// woven.run('addTen', 30)
//   .then(output => console.log('output from run function is ', output));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


console.log('hello from woven');

var options = __webpack_require__(2);
var optimal = __webpack_require__(3);
var run = __webpack_require__(4)(options, optimal);
var configure = __webpack_require__(5)(options);
var optimize = __webpack_require__(6)(options);
var connect = __webpack_require__(7)(options);

module.exports = { run: run, optimize: optimize, configure: configure, connect: connect };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  pingSize: 100,
  stringPing: null,
  maxThreads: 4,
  alwaysClient: false,
  alwaysServer: false,
  functions: null,
  devServer: null,
  defaults: true
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  location: null, // set this way for testing only
  threads: null
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 
 * @param {Object} options - options object that will be configured in server.js file by developer
 * @param {Object} optimal - optimal computing location (optimal.location) and thread number 
 *                     (optimal.threads) based on client optimization function
 */

module.exports = function runWrapper(options, optimal) {

  /**
   * @param {string} funcName: string referring to name of a function in functions.js
   * @param {Object} payload: arguments to be passed into the function
   */

  return function run(funcName, payload) {
    console.log(options);
    // logic to determine if function sould be run on client or server
    // what order to handle logic for running?
    // options.alwaysServer, options.alwaysClient, optimal.location
    if (options.alwaysClient || optimal.location === 'client') {} /* reference optimal.threads here */ // run web worker pool
    else if (options.alwaysServer || optimal.location === 'server') {
        return fetch('/__woven__', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ funcName: funcName, payload: payload })
        }).then(function (res) {
          return res.json();
        });
      }
  };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// const fs = require('fs');

module.exports = function configureWrapper(options) {

  return function configure(functions, userOptions) {

    if ((typeof functions === 'undefined' ? 'undefined' : _typeof(functions)) !== 'object') {
      throw new Error(functions + ' must be an export object.');
    }

    options.functions = functions;

    //add a check for the 'devServer' options object property...!
    for (var field in userOptions) {
      if (options.hasOwnProperty(field)) {
        if (field === 'pingSize') {
          if (typeof userOptions[field] !== 'number') {
            throw new Error(field + ' - incorrect data type.');
          }
        } else if (field === 'stringPing') {
          if (typeof userOptions[field] !== 'string') {
            throw new Error(field + ' - incorrect data type.');
          }
        } else if (field === 'maxThreads') {
          if (typeof userOptions[field] !== 'number') {
            throw new Error(field + ' - incorrect data type.');
          }
        } else if (field === 'alwaysClient') {
          if (typeof userOptions[field] !== 'boolean') {
            throw new Error(field + ' - incorrect data type.');
          }
        } else if (field === 'alwaysServer') {
          if (typeof userOptions[field] !== 'boolean') {
            throw new Error(field + ' - incorrect data type.');
          }
        } else if (field === 'functions') {
          throw new Error('Use first argument of configure function to assign ' + field + '.');
        } else if (field === 'defaults') {
          throw new Error(field + ' is not a configurable option.');
        }
        options[field] = userOptions[field];
      } else throw new Error(field + ' is not a configurable option');
    }
    // pingCheck(options);
  };
};

// //first check if the ping data already exists &&
// //whether it is the right size according to preferences...
// function pingCheck(options) {
//   if (options.stringPing !== null) {
//     let preferredPingSize = options.pingSize;
//     let currentPingSize = 0;

//     //to check file size against expected...
//     fs.stat('./pingdata.txt', function(error, stats) {
//       currentPingSize = stats.size;
//     });

//     //if file size doesn't match preferences, remove it and build new ping that does
//     if (preferredPingSize !== currentPingSize) {
//       fs.unlink('pingdata.txt', function (err) {
//         if (err) console.log('error with deleting ping file');
//         console.log('Ping data file deleted!');
//       });
//       buildPing(options.pingSize);
//     } else console.log('ping size matches dev preferences!');
//   } else buildPing(options.pingSize);
// }

// //function to generate ping according to data size preferences:
// function buildPing(pingSize) {
//   let stringPing = '';
//   let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < pingSize/2; i++) {
//     stringPing += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
//   }

//   fs.appendFile('pingdata.txt', stringPing, function (err) {
//     if (err) console.log('error with creating ping file');
//     console.log('Saved!');
//   });
// //need to assign the path to new ping file to options.stringPing...HALP?
//   options.stringPing = './pingdata.txt';
// }

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 
 */

module.exports = function optimizeWrapper(options) {
  return function optimize(req, res, next) {

    if (req.url === '/__woven_first__') {
      // compare options from server with options on client side
      // need to be more specific about which options are sent
      options.defaults = false;
      console.log('back end options before sending:', options);
      res.json(options);
    } else if (req.url === '/__woven__') {
      var output = options.functions[req.body.funcName](req.body.payload);
      res.json(output);
    } else next();
  };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function connectWrapper(options) {
  return function connect() {
    fetch('/__woven_first__', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options: options })
    }).then(function (res) {
      return res.json();
    }).then(function (newOptions) {
      for (var field in options) {
        options[field] = newOptions[field];
      }
      console.log('changed front end options:', options);
    });
  };
};

/***/ })
/******/ ]);