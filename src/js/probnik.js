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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/main.js":
/*!**********************!*\
  !*** ./demo/main.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _probnik_probnik_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../probnik/probnik.ts */ "./probnik/probnik.ts");
/* harmony import */ var _probnik_probnik_ts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_probnik_probnik_ts__WEBPACK_IMPORTED_MODULE_0__);



var probnik_pulses = 3;
var probnik_target_data = new Map();
var probnik_target_data_init = false;

var toggleButtonProbnik = document.getElementById('toggle-button-probnik');
var testingMessageProbnik = document.getElementById('testing-message-probnik');

var probnikTesterActive = false;
var probnikTesterTimer = null;

var recipeProvider = new _probnik_probnik_ts__WEBPACK_IMPORTED_MODULE_0__["RestRecipeProvider"]('/recipe');


function onCompleteProbnik(data) {
    if (probnikTesterActive) {
        loadDataProbnik(data);
        let data_list = Array.from(probnik_target_data.values());
        data_list.sort((a, b) => {
            return a[3]/a[4] < b[3]/b[4] ? -1 : 1;
        });
        populateTable(data_list, 'result-table-probnik');
        probnikTesterTimer = setTimeout(runProbeProbnik, 500);
    }
}


function loadDataProbnik(data) {
    if (!probnik_target_data_init) {
        for (const target of data.data) {
            probnik_target_data.set(
                target.name,
                [target.name, Infinity, 0, 0, 0]
            );
        }
        probnik_target_data_init = true;
    }
    for (const target of data.data) {
        for (const pulse of target.data) {
            probnik_target_data.set(target.name, [
                target.name,
                Math.min(probnik_target_data.get(target.name)[1], Math.round(pulse.d)),
                Math.max(probnik_target_data.get(target.name)[2], Math.round(pulse.d)),
                probnik_target_data.get(target.name)[3] + Math.round(pulse.d),
                probnik_target_data.get(target.name)[4] + 1
            ]);
        }
    }
}


function runProbeProbnik() {
    var probnik_tester = new _probnik_probnik_ts__WEBPACK_IMPORTED_MODULE_0__["BrowserProbe"](recipeProvider, onCompleteProbnik);
    probnik_tester.start();
}


function toggleButtonProbnikHandler() {
    probnikTesterActive = !probnikTesterActive;
    toggleButtonProbnik.innerHTML = probnikTesterActive ? 'Stop' : 'Start';
    testingMessageProbnik.innerHTML = probnikTesterActive ? 'Testing...' : '';
    clearTimeout(probnikTesterTimer);
    if (probnikTesterActive)
        runProbeProbnik();
}


toggleButtonProbnik.addEventListener('click', toggleButtonProbnikHandler);


/***/ }),

/***/ "./probnik/probe.ts":
/*!**************************!*\
  !*** ./probnik/probe.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./probnik/probes/browser_probe.ts":
/*!*****************************************!*\
  !*** ./probnik/probes/browser_probe.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserProbe = void 0;
/**
 * Probe implementation to run in a browser.
 */
var pulse_probe_1 = __webpack_require__(/*! ./pulse_probe */ "./probnik/probes/pulse_probe.ts");
var xhr_requester_1 = __webpack_require__(/*! ../requesters/xhr_requester */ "./probnik/requesters/xhr_requester.ts");
/**
 * Probe implementation to run in a browser.
 */
var BrowserProbe = /** @class */ (function (_super) {
    __extends(BrowserProbe, _super);
    function BrowserProbe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BrowserProbe;
}(pulse_probe_1.PulseProbe));
exports.BrowserProbe = BrowserProbe;
BrowserProbe.requester = new xhr_requester_1.XhrHttpRequester();


/***/ }),

/***/ "./probnik/probes/pulse_probe.ts":
/*!***************************************!*\
  !*** ./probnik/probes/pulse_probe.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PulseProbe = void 0;
var testers_1 = __webpack_require__(/*! ../testers/testers */ "./probnik/testers/testers.ts");
/**
 * Probe implementation
 */
var PulseProbe = /** @class */ (function () {
    /**
     * @param recipeProvider An object that provides Recipe to test against.
     * @param reporter A reporter to use to send Probe results to.
     */
    function PulseProbe(recipeProvider, reporter) {
        this.recipeProvider = recipeProvider;
        this.reporter = reporter;
        this.iteration = 0;
        this.completed = false;
        this.requester = this.constructor.requester;
        this.testerFactory = this.constructor.testerFactory;
    }
    /** Starts/resumes execution of the test. */
    PulseProbe.prototype.start = function () {
        if (this.nextJob) {
            // Already started
            return;
        }
        // TODO: should we allow running the test from the same Probnik object several times?
        // Isn't the iteration property created exactly for this purpose?
        if (this.completed) {
            // The test session is completed
            return;
        }
        this.nextJob = this.scheduleAfter(0, this.run.bind(this));
    };
    /** Stops execution of the test. */
    PulseProbe.prototype.stop = function () {
        if (this.nextJob) {
            this.nextJob.cancel();
            this.nextJob = undefined;
        }
    };
    /** Runs the test. */
    PulseProbe.prototype.run = function () {
        this.recipeProvider.getRecipe(this.iteration, this.executeTest.bind(this));
    };
    PulseProbe.prototype.forEachTarget = function (recipe, fn) {
        for (var i = 0, l = recipe.targets.length; i < l; i++) {
            fn.bind(this)(recipe.targets[i]);
        }
    };
    PulseProbe.prototype.executeTest = function (recipe) {
        if (!recipe) {
            // Invalid test recipe, abort
            this.stop();
            return;
        }
        var tester = this.testerFactory.getTester(this.requester, recipe);
        var reports = [];
        var wg = new WaitGroup(recipe.targets.length);
        var scheduleAfter = this.scheduleAfter;
        this.forEachTarget(recipe, function (target) {
            var pulses = [];
            var handler = function (done, report) {
                pulses.push(report);
                done();
            };
            var nested = function finish() {
                reports.push({
                    'name': target.name,
                    'target': target.target,
                    'data': pulses
                });
                wg.done();
            };
            for (var i = recipe.pulses - 1; i >= 0; i--) {
                nested = (function probe(next, delay) {
                    var task = tester.run.bind(tester, target, handler.bind(null, next));
                    scheduleAfter(delay, task);
                }).bind(null, nested, i > 0 ? recipe.pulse_delay : 0);
            }
            // Unwrap timeout(0), probe, timeout(delay), probe, timeout(delay), probe, finish
            nested();
        });
        var finish = this.handleResult.bind(this);
        wg.wait(function () {
            finish(recipe, reports);
        });
    };
    PulseProbe.prototype.scheduleAfter = function (delayMilliseconds, task) {
        var id = setTimeout(task, delayMilliseconds);
        return { cancel: function () { clearTimeout(id); } };
    };
    PulseProbe.prototype.handleResult = function (recipe, reports) {
        // Use the injected logger to log report
        this.reporter({
            ctx: recipe.ctx,
            name: recipe.name,
            type: recipe.type,
            data: reports
        });
        // Schedule next round if necessary
        if (!this.nextJob) {
            // Tester is stopped
            return;
        }
        if (recipe.next > 0) {
            this.nextJob = this.scheduleAfter(recipe.next, this.run.bind(this));
        }
        else {
            this.completed = true;
            this.stop();
        }
    };
    return PulseProbe;
}());
exports.PulseProbe = PulseProbe;
/**
 * Syncronizes ProbeTester runs between pulses.
 */
var WaitGroup = /** @class */ (function () {
    function WaitGroup(total) {
        this.total = total;
    }
    WaitGroup.prototype.done = function () {
        this.total--;
        if (this.total === 0 && this.cb) {
            this.cb();
            this.cb = undefined;
        }
    };
    WaitGroup.prototype.wait = function (cb) {
        if (this.total === 0) {
            cb();
        }
        else {
            this.cb = cb;
        }
    };
    return WaitGroup;
}());
;
PulseProbe.testerFactory = new testers_1.TesterFactory();


/***/ }),

/***/ "./probnik/probnik.ts":
/*!****************************!*\
  !*** ./probnik/probnik.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Exports
 */
__exportStar(__webpack_require__(/*! ./probe */ "./probnik/probe.ts"), exports);
__exportStar(__webpack_require__(/*! ./probes/browser_probe */ "./probnik/probes/browser_probe.ts"), exports);
__exportStar(__webpack_require__(/*! ./recipe_providers/http_recipe_provider */ "./probnik/recipe_providers/http_recipe_provider.ts"), exports);
__exportStar(__webpack_require__(/*! ./recipe_providers/local_recipe_provider */ "./probnik/recipe_providers/local_recipe_provider.ts"), exports);


/***/ }),

/***/ "./probnik/recipe_providers/http_recipe_provider.ts":
/*!**********************************************************!*\
  !*** ./probnik/recipe_providers/http_recipe_provider.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestRecipeProvider = void 0;
var xhr_requester_1 = __webpack_require__(/*! ../requesters/xhr_requester */ "./probnik/requesters/xhr_requester.ts");
function isObject(o) {
    return !!(o && ("object" === typeof o));
}
function isArray(a) {
    return Object.prototype.toString.call(a) === '[object Array]';
}
function isInt(v) {
    return !isNaN(v) && (function (x) { return (x | 0) === x; })(parseFloat(v));
}
function isString(v) {
    return typeof v === 'string';
}
/**
* Provides Probnik recipe based on an output of a REST HTTP endpoint.
* When acked to provide a recipe, performs an HTTP GET call on a configured URL and provides
* the result back to the caller.
*/
var RestRecipeProvider = /** @class */ (function () {
    /**
     * @param url URL of an API endpoint to call to get a recipe.
     */
    function RestRecipeProvider(url) {
        this.url = url;
    }
    /** Provides recipe to test. */
    RestRecipeProvider.prototype.getRecipe = function (iteration, cb) {
        var url = this.url;
        var delimiter = url.indexOf('?') === -1 ? '?' : '&';
        url = "" + url + delimiter + "iteration=" + iteration;
        RestRecipeProvider.requester.getData(url, 0, function (status, headers, body) {
            if (status != 200 || body == null) {
                cb(null);
                return;
            }
            try {
                var json = JSON.parse(body);
                var errPrefix = 'FTLTester: param';
                if (!isObject(json)) {
                    throw new Error(errPrefix + ": not an object");
                }
                if (!isInt(json.next)) {
                    throw new Error(errPrefix + ".next: not an integer");
                }
                if (!isInt(json.pulses)) {
                    throw new Error(errPrefix + ".pulses: not an integer");
                }
                if (!isInt(json.pulse_delay)) {
                    throw new Error(errPrefix + ".pulse_delay: not an integer");
                }
                if (!isInt(json.pulse_timeout)) {
                    throw new Error(errPrefix + ".pulse_timeout: not an integer");
                }
                if (!isString(json.name)) {
                    throw new Error(errPrefix + ".name: not a string");
                }
                if (!isObject(json.ctx)) {
                    throw new Error(errPrefix + ".ctx: not an object");
                }
                if (!isArray(json.targets)) {
                    throw new Error(errPrefix + ".targets: not an array");
                }
                for (var i = 0, l = json.targets.length; i < l; i++) {
                    var targetInfo = json.targets[i];
                    if (!isObject(targetInfo)) {
                        throw new Error(errPrefix + ".targets[" + i + "]: not an object");
                    }
                    if (!isString(targetInfo.name)) {
                        throw new Error(errPrefix + ".targets[" + i + "].name: not a string");
                    }
                    if (!isString(targetInfo.target)) {
                        throw new Error(errPrefix + ".targets[" + i + "].target: not a string");
                    }
                }
                var params = json;
                cb(params);
            }
            catch (e) {
                if (console && console.error) {
                    console.error(e);
                }
                cb(null);
                return;
            }
        }, { withCookies: true });
    };
    return RestRecipeProvider;
}());
exports.RestRecipeProvider = RestRecipeProvider;
RestRecipeProvider.requester = new xhr_requester_1.XhrHttpRequester();


/***/ }),

/***/ "./probnik/recipe_providers/local_recipe_provider.ts":
/*!***********************************************************!*\
  !*** ./probnik/recipe_providers/local_recipe_provider.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalRecipeProvider = void 0;
/**
 * Provides Probnik recipe based on provided provided during an initialization.
 */
var LocalRecipeProvider = /** @class */ (function () {
    /**
     * @param url URL of an API endpoint to call to get a recipe.
     */
    function LocalRecipeProvider(json) {
        this.json = json;
        this.recipe = json;
    }
    /** Provides recipe to test. */
    LocalRecipeProvider.prototype.getRecipe = function (iteration, cb) {
        cb(this.recipe);
    };
    return LocalRecipeProvider;
}());
exports.LocalRecipeProvider = LocalRecipeProvider;


/***/ }),

/***/ "./probnik/requesters/xhr_requester.ts":
/*!*********************************************!*\
  !*** ./probnik/requesters/xhr_requester.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.XhrHttpRequester = void 0;
function getXhr() {
    return new XMLHttpRequest();
}
function now() {
    if (window.performance && window.performance.now) {
        // Use monotonic clock when available
        return performance.now();
    }
    return new Date().getTime();
}
// Build HttpMetrics with calculated metrics or performance API metrics if available.
function getReport(url, status, size, start, duration, ttfb, headers) {
    var report = {
        start: start,
        size: size,
        d: duration,
        ttfb: ttfb,
        sc: status
    };
    if (headers) {
        report.via = headers.via;
    }
    if (!url || !window.performance || !window.performance.getEntriesByName) {
        return report;
    }
    var entries = window.performance.getEntriesByName(url);
    if (entries.length == 0) {
        // In the case the URL does not have a path (i.e.: http://domain.com), the browser
        // adds a trailing slash and thus the entry might not match. Try again by adding the
        // slash by ourself.
        entries = window.performance.getEntriesByName(url + '/');
        if (entries.length == 0) {
            return report;
        }
    }
    var timing = entries[entries.length - 1];
    if ('decodedBodySize' in timing && timing.decodedBodySize > 0) {
        report.size = timing.decodedBodySize;
    }
    if (timing.duration) {
        report.d = timing.duration;
    }
    else if (timing.startTime && timing.responseEnd) {
        report.d = timing.responseEnd - timing.startTime;
    }
    if (timing.requestStart) {
        report.dns = timing.domainLookupEnd - timing.domainLookupStart;
        report.ttfb = timing.responseStart - timing.startTime;
        report.tcp = timing.connectEnd - timing.connectStart;
        // secureConnectionStart can be 0 instead of timestamp when connection is reused
        if (timing.secureConnectionStart === 0) {
            // Chrome has a known bug setting the secureConnectionStart to 0 when the
            // TLS connection is reused. The spec says that 0 should be used when TLS
            // is not used. Probes are always HTTPS to avoid mixed content issue,
            // so it is safe to assume that 0 means reused and not HTTP.
            report.tls = 0;
        }
        else if (timing.secureConnectionStart !== undefined) {
            report.tls = timing.connectEnd - timing.secureConnectionStart;
            // The TCP metric must not include the TLS handshake (we want to
            // approximate the TCP handshake time).
            report.tcp -= report.tls;
        }
    }
    return report;
}
function parseHeaders(headerStr) {
    var headers = {};
    if (!headerStr) {
        return headers;
    }
    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
        var headerPair = headerPairs[i];
        // Can't use split() here because it does the wrong thing
        // if the header value has the string ": " in it.
        var index = headerPair.indexOf('\u003a\u0020');
        if (index > 0) {
            var key = headerPair.substring(0, index).toLowerCase();
            var val = headerPair.substring(index + 2);
            headers[key] = val;
        }
    }
    return headers;
}
/**
 * Runs HTTP Probe tests using XHR object.
 */
var XhrHttpRequester = /** @class */ (function () {
    function XhrHttpRequester() {
    }
    XhrHttpRequester.prototype.get = function (url, timeout, cb, options) {
        var req;
        try {
            req = getXhr();
        }
        catch (e) {
            cb(getReport(url, 0, 0, 0, 0, 0));
            return;
        }
        if (!('withCredentials' in req)) {
            // Missing CORS support
            cb(getReport(url, 0, 0, 0, 0, 0));
            return;
        }
        if (options.withCookies) {
            req.withCredentials = true;
        }
        if (timeout) {
            req.timeout = timeout;
        }
        var start = now();
        var ttfb = 0;
        req.open('GET', url, true);
        req.onreadystatechange = function () {
            switch (req.readyState) {
                case 2:
                    ttfb = now() - start;
                    break;
                case 4:
                    var headers = {};
                    if ('getAllResponseHeaders' in req) {
                        headers = parseHeaders(req.getAllResponseHeaders());
                    }
                    var body = req.responseText;
                    var length_1 = body.length;
                    if (req.response) {
                        length_1 = req.response.length;
                    }
                    var duration = now() - start;
                    cb(getReport(url, req.status, length_1, start, duration, ttfb, headers));
                    break;
            }
        };
        req.send();
    };
    XhrHttpRequester.prototype.getData = function (url, timeout, cb, options) {
        var req;
        try {
            req = getXhr();
        }
        catch (e) {
            cb(0, {}, null);
            return;
        }
        if (!('withCredentials' in req)) {
            // Missing CORS support
            cb(0, {}, null);
            return;
        }
        if (options.withCookies) {
            req.withCredentials = true;
        }
        if (timeout) {
            req.timeout = timeout;
        }
        var start = now();
        req.open('GET', url, true);
        req.onreadystatechange = function () {
            switch (req.readyState) {
                case 4:
                    var headers = {};
                    if ('getAllResponseHeaders' in req) {
                        headers = parseHeaders(req.getAllResponseHeaders());
                    }
                    var body = req.responseText;
                    if (req.response) {
                        length = req.response.length;
                    }
                    cb(req.status, headers, body);
                    break;
            }
        };
        req.send();
    };
    return XhrHttpRequester;
}());
exports.XhrHttpRequester = XhrHttpRequester;


/***/ }),

/***/ "./probnik/testers/http_tester.ts":
/*!****************************************!*\
  !*** ./probnik/testers/http_tester.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpTester = void 0;
/**
 * Test performance of HTTP(s) GET endpoint.
 */
var HttpTester = /** @class */ (function () {
    function HttpTester(requester, timeout) {
        this.requester = requester;
        this.timeout = timeout;
    }
    HttpTester.prototype.run = function (target, cb) {
        this.requester.get(target.target, this.timeout, cb, { withCookies: false });
    };
    return HttpTester;
}());
exports.HttpTester = HttpTester;


/***/ }),

/***/ "./probnik/testers/testers.ts":
/*!************************************!*\
  !*** ./probnik/testers/testers.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 *
 *  Copyright 2019 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TesterFactory = void 0;
var http_tester_1 = __webpack_require__(/*! ./http_tester */ "./probnik/testers/http_tester.ts");
/**
 * Initializes ProbeTesters for given recipes.
 */
var TesterFactory = /** @class */ (function () {
    function TesterFactory() {
    }
    TesterFactory.prototype.getTester = function (requester, recipe) {
        if (recipe.type == 'http_get') {
            return new http_tester_1.HttpTester(requester, recipe.pulse_timeout);
        }
        throw new Error(recipe.type + ": inknown recipe type");
    };
    return TesterFactory;
}());
exports.TesterFactory = TesterFactory;


/***/ })

/******/ });
//# sourceMappingURL=probnik.js.map