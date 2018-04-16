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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Pool(size, workerFile) {
  this.taskQueue = [];
  this.workerQueue = [];
  this.poolSize = size;

  this.addWorkerTask = function (workerTask) {
    if (this.workerQueue.length > 0) {
      var workerThread = this.workerQueue.shift();
      workerThread.run(workerTask);
    } else this.taskQueue.push(workerTask);
  };

  this.init = function () {
    for (var i = 0; i < this.poolSize; i++) {
      this.workerQueue.push(new WorkerThread(this, workerFile));
    }
  };

  this.freeWorkerThread = function (workerThread) {
    if (this.taskQueue.length > 0) {
      var workerTask = this.taskQueue.shift();
      workerThread.run(workerTask);
    } else this.workerQueue.push(workerThread);
  };

  this.addWorkerTask.bind(this);
  this.init.bind(this);
  this.freeWorkerThread.bind(this);
}

function WorkerThread(pool, workerFile) {
  this.pool = pool;
  this.workerTask = {};
  var _this = this;

  this.run = function (workerTask) {
    this.workerTask = workerTask;
    if (this.workerTask.funcName !== null) {
      var worker = new workerFile();
      worker.addEventListener('message', dummyCallback, false);
      worker.addEventListener('error', function (msg, line, fileName) {
        console.error(msg + ('\nerror in worker at line ' + line + ' in ' + fileName));
      });
      worker.postMessage({ funcName: workerTask.funcName, payload: workerTask.payload });
    }
  };

  function dummyCallback(event) {
    _this.workerTask.callback(event.data);
    _this.pool.freeWorkerThread(_this); // changed from this to _this
    this.terminate(); // terminates current worker thread - this refers to worker, _this refers to workerThread
  }

  // dummyCallback.bind(this);
  this.run.bind(this);
}

function WorkerTask(funcName, payload, callback) {
  this.funcName = funcName;
  this.payload = payload;
  this.callback = callback;
}

module.exports = { Pool: Pool, WorkerTask: WorkerTask };

/*
  modified from original code by jos.dirksen:
  http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool
*/

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _client = __webpack_require__(2);

var _client2 = _interopRequireDefault(_client);

var _functions = __webpack_require__(9);

var _functions2 = _interopRequireDefault(_functions);

var _functions3 = __webpack_require__(11);

var _functions4 = _interopRequireDefault(_functions3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var woven = new _client2.default();
woven.connect(_functions2.default);

window.onload = function () {

  // Add 10 functionality
  // const add10Button = document.getElementById('add-10-btn');
  // const numbers = Array.from(document.getElementsByClassName('number'));
  // add10Button.onclick = function() {
  //   numbers.forEach(node => {
  //     let num = Number(node.innerHTML);
  //     woven.run('addTen', num)  
  //       .then(newNum => node.innerHTML = newNum);
  //   });
  // }


  // Fib functionality
  function wovenCalcFib(num) {
    woven.run('nthFib', num).then(function (fib) {
      var li = document.createElement('li');
      li.textContent = num + ' = ' + fib;
      wovenFibList.appendChild(li);
    });
  }

  function nthFib(num) {
    if (num === 0) return 0;
    if (num === 1) return 1;
    return nthFib(num - 1) + nthFib(num - 2);
  }

  function browserCalcFib(num) {
    var fibNumber = nthFib(num);
    var li = document.createElement('li');
    li.textContent = num + ' = ' + fibNumber;
    browserFibList.appendChild(li);
  }

  function asyncCalcFib(num) {
    var fibPromise = new Promise(function (resolve, reject) {
      resolve(nthFib(num));
    });
    fibPromise.then(function (fib) {
      var li = document.createElement('li');
      li.textContent = num + ' = ' + fib;
      browserFibList.appendChild(li);
    });
  }

  var wovenFibList = document.getElementById('woven-fib-list');
  var wovenFibNumber = document.getElementById('woven-fib-number');
  var wovenFibButton = document.getElementById('woven-calc-fib');

  var browserFibList = document.getElementById('browser-fib-list');
  var browserFibNumber = document.getElementById('browser-fib-number');
  var browserFibButton = document.getElementById('browser-calc-fib');

  wovenFibButton.addEventListener('click', function () {
    return wovenCalcFib(wovenFibNumber.value || 8);
  });
  browserFibButton.addEventListener('click', function () {
    return asyncCalcFib(browserFibNumber.value || 8);
  });

  //--- Woven color box functionality ----------------------------//
  // function getColor(e) {
  //   woven.run('generateRandomColor')
  //     .then(color => {
  //       e.target.style.backgroundColor = `rgb(${color.red},${color.green},${color.blue})`;
  //     });
  // }

  //--- Browser color box functionality --------------------------//
  function getColor(e) {
    var color = (0, _functions4.default)();
    e.target.style.backgroundColor = 'rgb(' + color.red + ',' + color.green + ',' + color.blue + ')';
  }

  var colorBoxes = Array.from(document.getElementsByClassName('color-box'));
  colorBoxes.forEach(function (colorBox) {
    return colorBox.addEventListener('click', getColor);
  });
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var options = __webpack_require__(3);
var optimal = __webpack_require__(4);
var Pool = __webpack_require__(0).Pool; // does this need to reference options object? only time will tell
var WorkerTask = __webpack_require__(0).WorkerTask;
var performance = __webpack_require__(5);
var getLocation = __webpack_require__(6)(optimal);
var connect = __webpack_require__(7)(optimal, Pool, performance);
var run = __webpack_require__(8)(optimal, WorkerTask);

var instance = void 0;

module.exports = function Woven() {
  if (!instance) {
    instance = {
      connect: connect,
      run: run,
      WorkerTask: WorkerTask,
      getLocation: getLocation
    };
  }
  return instance;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  alwaysClient: false,
  alwaysServer: false,
  dynamicMax: 500,
  fallback: 'server',
  functions: null,
  maxThreads: 12,
  pingSize: 100,
  stringPing: null
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  clientDefaults: true,
  location: null, // set this way for testing only
  pool: null,
  serverDefaults: true,
  threads: null
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function combinedOptimization(clientData, optimal) {
  if (clientData.alwaysClient === false) networkCheck();
  if (optimal.location === 'client') {
    browserCheck();
    threadCheck();
  }
  // troubleshoot();
  console.info('optimized location is: ' + optimal.location + ' with ' + optimal.threads + ' threads.');

  function browserCheck() {
    var browserOptions = ['Chrome', 'Firefox', 'Safari', 'Opera', 'IE'];
    var firstIndex = Infinity;

    for (var i = 0; i < browserOptions.length; i++) {
      if (clientData.userAgent.includes(browserOptions[i])) {
        var index = clientData.userAgent.indexOf(browserOptions[i]);
        if (index >= 0 && index < firstIndex) {
          firstIndex = index;
          clientData.browser = browserOptions[i];
        }
      }
    }
  }

  function networkCheck() {
    if (clientData.dynamicSpeed > clientData.dynamicMax) {
      clientData.networkSpeed = false;
      optimal.location = 'client';
    } else if (!clientData.dynamicSpeed) {
      clientData.missingDeviceInfo = true;
    } else {
      optimal.location = 'server';
    }
  }

  function threadCheck() {

    if (clientData.threads) {
      if (clientData.threads > clientData.maxThreads) clientData.threads = clientData.maxThreads;
      if (clientData.browser === 'Chrome') {
        if (clientData.threads > 25) optimal.threads = 25;else optimal.threads = clientData.threads;
      } else if (clientData.browser === 'Firefox' || clientData.browser === 'Safari') {
        if (clientData.threads > 14) optimal.threads = 14;else optimal.threads = clientData.threads;
      } else if (clientData.browser === 'Opera') {
        if (clientData.threads > 10) optimal.threads = 10;else optimal.threads = clientData.threads;
      } else clientData.threads < 4 ? optimal.threads = clientData.threads : optimal.threads = 4;
    } else optimal.threads = 4;
  }

  // function troubleshoot() {
  //   const ideals = {
  //     Chrome: 40,
  //     Firefox: 20,
  //     Safari: 16,
  //     Opera: 16,
  //     IE: 4,
  //     Edge: 4
  //   }
  //   //if dev options exceed recommendations given client browser -->
  //   //reduce threads to below threshold...
  //   if (clientData.missingDeviceInfo === true) {
  //     console.log("Warning: missing client device data");
  //     optimal.location = clientData.fallback;
  //   } else if (clientData.maxThreads > ideal[clientData.browser]) {
  //     optimal.threads = ideal[clientData.browser];
  //   } else {
  //     optimal.threads = clientData.maxThreads;
  //   }
  //   console.log('will be processed here: ', optimal.location);
  // }
}

module.exports = combinedOptimization;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (optimal) {
  return function () {
    return optimal.location;
  };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function connectWrapper(optimal, Pool, performance) {

  return function connect(workerFile) {

    var pingMarkerClient = Date.now();

    fetch('/__woven_first__', {
      method: 'GET'
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      var clientData = {
        dynamicSpeed: Date.now() - pingMarkerClient,
        userAgent: navigator.userAgent, // risky
        networkSpeed: null,
        threads: navigator.hardwareConcurrency,
        browser: null,
        missingDeviceInfo: false,
        dynamicMax: data.dynamicMax,
        maxThreads: data.maxThreads,
        fallback: data.fallback,
        alwaysClient: data.alwaysClient
      };
      optimal.serverDefaults = false;
      if (data.alwaysServer === true) {
        optimal.location = 'server';
        optimal.clientDefaults = false;
        return;
      } else if (data.alwaysClient === true) {
        optimal.location = 'client';
        clientData.alwaysClient = true;
        performance(clientData, optimal);
        optimal.clientDefaults = false;
      } else {
        performance(clientData, optimal);
        optimal.clientDefaults = false;
      }
      if (optimal.location === null) optimal.location = data.fallback;
      if (optimal.location === 'client') {
        optimal.pool = new Pool(optimal.threads, workerFile);
        optimal.pool.init();
      }
    });
  };
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 
 * @param {Object} optimal - optimal computing location (optimal.location) and thread number 
 *                     (optimal.threads) based on client optimization function
 */

module.exports = function runWrapper(optimal, WorkerTask) {

  /**
   * @param {string} funcName: string referring to name of a function in functions.js
   * @param {Object} payload: arguments to be passed into the function
   */

  return function run(funcName) {
    for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      payload[_key - 1] = arguments[_key];
    }

    if (optimal.location === 'client') {

      return new Promise(function (resolve, reject) {
        function workerCallback(output) {
          resolve(output);
        }
        var workerTask = new WorkerTask(funcName, payload, workerCallback);

        optimal.pool.addWorkerTask(workerTask);
      });
    } else if (optimal.location === 'server') {
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
  return __webpack_require__(10)("/******/ (function(modules) { // webpackBootstrap\n/******/ \t// The module cache\n/******/ \tvar installedModules = {};\n/******/\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/\n/******/ \t\t// Check if module is in cache\n/******/ \t\tif(installedModules[moduleId]) {\n/******/ \t\t\treturn installedModules[moduleId].exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = installedModules[moduleId] = {\n/******/ \t\t\ti: moduleId,\n/******/ \t\t\tl: false,\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/\n/******/ \t\t// Execute the module function\n/******/ \t\tmodules[moduleId].call(module.exports, module, module.exports, __webpack_require__);\n/******/\n/******/ \t\t// Flag the module as loaded\n/******/ \t\tmodule.l = true;\n/******/\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/\n/******/\n/******/ \t// expose the modules object (__webpack_modules__)\n/******/ \t__webpack_require__.m = modules;\n/******/\n/******/ \t// expose the module cache\n/******/ \t__webpack_require__.c = installedModules;\n/******/\n/******/ \t// define getter function for harmony exports\n/******/ \t__webpack_require__.d = function(exports, name, getter) {\n/******/ \t\tif(!__webpack_require__.o(exports, name)) {\n/******/ \t\t\tObject.defineProperty(exports, name, {\n/******/ \t\t\t\tconfigurable: false,\n/******/ \t\t\t\tenumerable: true,\n/******/ \t\t\t\tget: getter\n/******/ \t\t\t});\n/******/ \t\t}\n/******/ \t};\n/******/\n/******/ \t// getDefaultExport function for compatibility with non-harmony modules\n/******/ \t__webpack_require__.n = function(module) {\n/******/ \t\tvar getter = module && module.__esModule ?\n/******/ \t\t\tfunction getDefault() { return module['default']; } :\n/******/ \t\t\tfunction getModuleExports() { return module; };\n/******/ \t\t__webpack_require__.d(getter, 'a', getter);\n/******/ \t\treturn getter;\n/******/ \t};\n/******/\n/******/ \t// Object.prototype.hasOwnProperty.call\n/******/ \t__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };\n/******/\n/******/ \t// __webpack_public_path__\n/******/ \t__webpack_require__.p = \"\";\n/******/\n/******/ \t// Load entry module and return exports\n/******/ \treturn __webpack_require__(__webpack_require__.s = 0);\n/******/ })\n/************************************************************************/\n/******/ ([\n/* 0 */\n/***/ (function(module, exports, __webpack_require__) {\n\n\"use strict\";\n\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nonmessage = function onmessage(e) {\n  var addTen = function addTen(num) {\n    return num + 10;\n  };\n\n  var nthFib = function nthFib(num) {\n    if (num === 0) return 0;\n    if (num === 1) return 1;\n    return nthFib(num - 1) + nthFib(num - 2);\n  };\n\n  var generateRandomColor = function generateRandomColor() {\n    var red = Math.floor(Math.random() * 256);\n    var green = Math.floor(Math.random() * 256);\n    var blue = Math.floor(Math.random() * 256);\n\n    return { red: red, green: green, blue: blue };\n  };\n\n  var funcHash = { addTen: addTen, nthFib: nthFib };\n  var output = funcHash[e.data.funcName].apply(funcHash, _toConsumableArray(e.data.payload));\n  postMessage(output);\n};\n\n/***/ })\n/******/ ]);", __webpack_require__.p + "woven-worker.js");
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

module.exports = function (content, url) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      return new Worker(URL.createObjectURL(blob));
    } catch (e) {
      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new Worker(url);
  }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var browserGenerateRandomColor = function browserGenerateRandomColor() {
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);

  return { red: red, green: green, blue: blue };
};

exports.default = browserGenerateRandomColor;

/***/ })
/******/ ]);