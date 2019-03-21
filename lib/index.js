// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"J4Nk":[function(require,module,exports) {
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
'use strict';
/* eslint-disable no-unused-vars */

var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === undefined) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) {
      return false;
    } // Detect buggy property enumeration order in older V8 versions.
    // https://bugs.chromium.org/p/v8/issues/detail?id=4118


    var test1 = new String('abc'); // eslint-disable-line no-new-wrappers

    test1[5] = 'de';

    if (Object.getOwnPropertyNames(test1)[0] === '5') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test2 = {};

    for (var i = 0; i < 10; i++) {
      test2['_' + String.fromCharCode(i)] = i;
    }

    var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
      return test2[n];
    });

    if (order2.join('') !== '0123456789') {
      return false;
    } // https://bugs.chromium.org/p/v8/issues/detail?id=3056


    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });

    if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
      return false;
    }

    return true;
  } catch (err) {
    // We don't expect any of the above to throw, but better to be safe.
    return false;
  }
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  var from;
  var to = toObject(target);
  var symbols;

  for (var s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);

      for (var i = 0; i < symbols.length; i++) {
        if (propIsEnumerable.call(from, symbols[i])) {
          to[symbols[i]] = from[symbols[i]];
        }
      }
    }
  }

  return to;
};
},{}],"+CtU":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

var emptyObject = {};

if ("development.javierzen" !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
},{}],"wRU+":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';
/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if ("development.javierzen" !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;

    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame

    throw error;
  }
}

module.exports = invariant;
},{}],"UQex":[function(require,module,exports) {
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],"F5Lz":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

var emptyFunction = require('./emptyFunction');
/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */


var warning = emptyFunction;

if ("development.javierzen" !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });

    if (typeof console !== 'undefined') {
      console.error(message);
    }

    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
},{"./emptyFunction":"UQex"}],"Asjh":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],"Qo3t":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

if ("development.javierzen" !== 'production') {
  var invariant = require('fbjs/lib/invariant');

  var warning = require('fbjs/lib/warning');

  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

  var loggedTypeFailures = {};
}
/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */


function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if ("development.javierzen" !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }

        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);

        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;
          var stack = getStack ? getStack() : '';
          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;
},{"fbjs/lib/invariant":"wRU+","fbjs/lib/warning":"F5Lz","./lib/ReactPropTypesSecret":"Asjh"}],"dkFq":[function(require,module,exports) {
/** @license React v16.2.0
 * react.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

if ("development.javierzen" !== "production") {
  (function () {
    'use strict';

    var _assign = require('object-assign');

    var emptyObject = require('fbjs/lib/emptyObject');

    var invariant = require('fbjs/lib/invariant');

    var warning = require('fbjs/lib/warning');

    var emptyFunction = require('fbjs/lib/emptyFunction');

    var checkPropTypes = require('prop-types/checkPropTypes'); // TODO: this is special because it gets imported during build.


    var ReactVersion = '16.2.0'; // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
    // nor polyfill, then a plain number is used for performance.

    var hasSymbol = typeof Symbol === 'function' && Symbol['for'];
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
    var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
    var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;
    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator';

    function getIteratorFn(maybeIterable) {
      if (maybeIterable === null || typeof maybeIterable === 'undefined') {
        return null;
      }

      var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

      if (typeof maybeIterator === 'function') {
        return maybeIterator;
      }

      return null;
    }
    /**
     * WARNING: DO NOT manually require this module.
     * This is a replacement for `invariant(...)` used by the error code system
     * and will _only_ be required by the corresponding babel pass.
     * It always throws.
     */

    /**
     * Forked from fbjs/warning:
     * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
     *
     * Only change is we use console.warn instead of console.error,
     * and do nothing when 'console' is not supported.
     * This really simplifies the code.
     * ---
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */


    var lowPriorityWarning = function () {};

    {
      var printWarning = function (format) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });

        if (typeof console !== 'undefined') {
          console.warn(message);
        }

        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };

      lowPriorityWarning = function (condition, format) {
        if (format === undefined) {
          throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
        }

        if (!condition) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          printWarning.apply(undefined, [format].concat(args));
        }
      };
    }
    var lowPriorityWarning$1 = lowPriorityWarning;
    var didWarnStateUpdateForUnmountedComponent = {};

    function warnNoop(publicInstance, callerName) {
      {
        var constructor = publicInstance.constructor;
        var componentName = constructor && (constructor.displayName || constructor.name) || 'ReactClass';
        var warningKey = componentName + '.' + callerName;

        if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
          return;
        }

        warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
        didWarnStateUpdateForUnmountedComponent[warningKey] = true;
      }
    }
    /**
     * This is the abstract API for an update queue.
     */


    var ReactNoopUpdateQueue = {
      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function (publicInstance) {
        return false;
      },

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueForceUpdate: function (publicInstance, callback, callerName) {
        warnNoop(publicInstance, 'forceUpdate');
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} callerName name of the calling function in the public API.
       * @internal
       */
      enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
        warnNoop(publicInstance, 'replaceState');
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @param {?function} callback Called after component is updated.
       * @param {?string} Name of the calling function in the public API.
       * @internal
       */
      enqueueSetState: function (publicInstance, partialState, callback, callerName) {
        warnNoop(publicInstance, 'setState');
      }
    };
    /**
     * Base class helpers for the updating state of a component.
     */

    function Component(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
      // renderer.

      this.updater = updater || ReactNoopUpdateQueue;
    }

    Component.prototype.isReactComponent = {};
    /**
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */

    Component.prototype.setState = function (partialState, callback) {
      !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
      this.updater.enqueueSetState(this, partialState, callback, 'setState');
    };
    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
     */


    Component.prototype.forceUpdate = function (callback) {
      this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
    };
    /**
     * Deprecated APIs. These APIs used to exist on classic React classes but since
     * we would like to deprecate them, we're not going to move them over to this
     * modern base class. Instead, we define a getter that warns if it's accessed.
     */


    {
      var deprecatedAPIs = {
        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
      };

      var defineDeprecationWarning = function (methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function () {
            lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
            return undefined;
          }
        });
      };

      for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
      }
    }
    /**
     * Base class helpers for the updating state of a component.
     */

    function PureComponent(props, context, updater) {
      // Duplicated from Component.
      this.props = props;
      this.context = context;
      this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
      // renderer.

      this.updater = updater || ReactNoopUpdateQueue;
    }

    function ComponentDummy() {}

    ComponentDummy.prototype = Component.prototype;
    var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
    pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

    _assign(pureComponentPrototype, Component.prototype);

    pureComponentPrototype.isPureReactComponent = true;

    function AsyncComponent(props, context, updater) {
      // Duplicated from Component.
      this.props = props;
      this.context = context;
      this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
      // renderer.

      this.updater = updater || ReactNoopUpdateQueue;
    }

    var asyncComponentPrototype = AsyncComponent.prototype = new ComponentDummy();
    asyncComponentPrototype.constructor = AsyncComponent; // Avoid an extra prototype jump for these methods.

    _assign(asyncComponentPrototype, Component.prototype);

    asyncComponentPrototype.unstable_isAsyncReactComponent = true;

    asyncComponentPrototype.render = function () {
      return this.props.children;
    };
    /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
     */


    var ReactCurrentOwner = {
      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };
    var specialPropKeyWarningShown;
    var specialPropRefWarningShown;

    function hasValidRef(config) {
      {
        if (hasOwnProperty.call(config, 'ref')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.ref !== undefined;
    }

    function hasValidKey(config) {
      {
        if (hasOwnProperty.call(config, 'key')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.key !== undefined;
    }

    function defineKeyPropWarningGetter(props, displayName) {
      var warnAboutAccessingKey = function () {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;
          warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
        }
      };

      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }

    function defineRefPropWarningGetter(props, displayName) {
      var warnAboutAccessingRef = function () {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;
          warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
        }
      };

      warnAboutAccessingRef.isReactWarning = true;
      Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true
      });
    }
    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, no instanceof check
     * will work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} key
     * @param {string|object} ref
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @param {*} owner
     * @param {*} props
     * @internal
     */


    var ReactElement = function (type, key, ref, self, source, owner, props) {
      var element = {
        // This tag allow us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,
        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,
        // Record the component responsible for creating this element.
        _owner: owner
      };
      {
        // The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
        // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.

        Object.defineProperty(element._store, 'validated', {
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        }); // self and source are DEV only properties.

        Object.defineProperty(element, '_self', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: self
        }); // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.

        Object.defineProperty(element, '_source', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: source
        });

        if (Object.freeze) {
          Object.freeze(element.props);
          Object.freeze(element);
        }
      }
      return element;
    };
    /**
     * Create and return a new ReactElement of the given type.
     * See https://reactjs.org/docs/react-api.html#createelement
     */


    function createElement(type, config, children) {
      var propName; // Reserved names are extracted

      var props = {};
      var key = null;
      var ref = null;
      var self = null;
      var source = null;

      if (config != null) {
        if (hasValidRef(config)) {
          ref = config.ref;
        }

        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      } // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.


      var childrenLength = arguments.length - 2;

      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);

        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }

        {
          if (Object.freeze) {
            Object.freeze(childArray);
          }
        }
        props.children = childArray;
      } // Resolve default props


      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;

        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }

      {
        if (key || ref) {
          if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
            var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }

            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
        }
      }
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
    }
    /**
     * Return a function that produces ReactElements of a given type.
     * See https://reactjs.org/docs/react-api.html#createfactory
     */


    function cloneAndReplaceKey(oldElement, newKey) {
      var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
      return newElement;
    }
    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://reactjs.org/docs/react-api.html#cloneelement
     */


    function cloneElement(element, config, children) {
      var propName; // Original props are copied

      var props = _assign({}, element.props); // Reserved names are extracted


      var key = element.key;
      var ref = element.ref; // Self is preserved since the owner is preserved.

      var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.

      var source = element._source; // Owner will be preserved, unless ref is overridden

      var owner = element._owner;

      if (config != null) {
        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }

        if (hasValidKey(config)) {
          key = '' + config.key;
        } // Remaining properties override existing props


        var defaultProps;

        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }

        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      } // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.


      var childrenLength = arguments.length - 2;

      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);

        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }

        props.children = childArray;
      }

      return ReactElement(element.type, key, ref, self, source, owner, props);
    }
    /**
     * Verifies the object is a ReactElement.
     * See https://reactjs.org/docs/react-api.html#isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a valid component.
     * @final
     */


    function isValidElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    }

    var ReactDebugCurrentFrame = {};
    {
      // Component that is being worked on
      ReactDebugCurrentFrame.getCurrentStack = null;

      ReactDebugCurrentFrame.getStackAddendum = function () {
        var impl = ReactDebugCurrentFrame.getCurrentStack;

        if (impl) {
          return impl();
        }

        return null;
      };
    }
    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';
    /**
     * Escape and wrap key so it is safe to use as a reactid
     *
     * @param {string} key to be escaped.
     * @return {string} the escaped key.
     */

    function escape(key) {
      var escapeRegex = /[=:]/g;
      var escaperLookup = {
        '=': '=0',
        ':': '=2'
      };
      var escapedString = ('' + key).replace(escapeRegex, function (match) {
        return escaperLookup[match];
      });
      return '$' + escapedString;
    }
    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     */


    var didWarnAboutMaps = false;
    var userProvidedKeyEscapeRegex = /\/+/g;

    function escapeUserProvidedKey(text) {
      return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
    }

    var POOL_SIZE = 10;
    var traverseContextPool = [];

    function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
      if (traverseContextPool.length) {
        var traverseContext = traverseContextPool.pop();
        traverseContext.result = mapResult;
        traverseContext.keyPrefix = keyPrefix;
        traverseContext.func = mapFunction;
        traverseContext.context = mapContext;
        traverseContext.count = 0;
        return traverseContext;
      } else {
        return {
          result: mapResult,
          keyPrefix: keyPrefix,
          func: mapFunction,
          context: mapContext,
          count: 0
        };
      }
    }

    function releaseTraverseContext(traverseContext) {
      traverseContext.result = null;
      traverseContext.keyPrefix = null;
      traverseContext.func = null;
      traverseContext.context = null;
      traverseContext.count = 0;

      if (traverseContextPool.length < POOL_SIZE) {
        traverseContextPool.push(traverseContext);
      }
    }
    /**
     * @param {?*} children Children tree container.
     * @param {!string} nameSoFar Name of the key path so far.
     * @param {!function} callback Callback to invoke with each child found.
     * @param {?*} traverseContext Used to pass information throughout the traversal
     * process.
     * @return {!number} The number of children in this subtree.
     */


    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
      var type = typeof children;

      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        children = null;
      }

      var invokeCallback = false;

      if (children === null) {
        invokeCallback = true;
      } else {
        switch (type) {
          case 'string':
          case 'number':
            invokeCallback = true;
            break;

          case 'object':
            switch (children.$$typeof) {
              case REACT_ELEMENT_TYPE:
              case REACT_CALL_TYPE:
              case REACT_RETURN_TYPE:
              case REACT_PORTAL_TYPE:
                invokeCallback = true;
            }

        }
      }

      if (invokeCallback) {
        callback(traverseContext, children, // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
        return 1;
      }

      var child;
      var nextName;
      var subtreeCount = 0; // Count of children found in the current subtree.

      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getComponentKey(child, i);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        var iteratorFn = getIteratorFn(children);

        if (typeof iteratorFn === 'function') {
          {
            // Warn about using Maps as children
            if (iteratorFn === children.entries) {
              warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', ReactDebugCurrentFrame.getStackAddendum());
              didWarnAboutMaps = true;
            }
          }
          var iterator = iteratorFn.call(children);
          var step;
          var ii = 0;

          while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else if (type === 'object') {
          var addendum = '';
          {
            addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
          }
          var childrenString = '' + children;
          invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
        }
      }

      return subtreeCount;
    }
    /**
     * Traverses children that are typically specified as `props.children`, but
     * might also be specified through attributes:
     *
     * - `traverseAllChildren(this.props.children, ...)`
     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
     *
     * The `traverseContext` is an optional argument that is passed through the
     * entire traversal. It can be used to store accumulations or anything else that
     * the callback might find relevant.
     *
     * @param {?*} children Children tree object.
     * @param {!function} callback To invoke upon traversing each child.
     * @param {?*} traverseContext Context for traversal.
     * @return {!number} The number of children in this subtree.
     */


    function traverseAllChildren(children, callback, traverseContext) {
      if (children == null) {
        return 0;
      }

      return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }
    /**
     * Generate a key string that identifies a component within a set.
     *
     * @param {*} component A component that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */


    function getComponentKey(component, index) {
      // Do some typechecking here since we call this blindly. We want to ensure
      // that we don't block potential future ES APIs.
      if (typeof component === 'object' && component !== null && component.key != null) {
        // Explicit key
        return escape(component.key);
      } // Implicit key determined by the index in the set


      return index.toString(36);
    }

    function forEachSingleChild(bookKeeping, child, name) {
      var func = bookKeeping.func,
          context = bookKeeping.context;
      func.call(context, child, bookKeeping.count++);
    }
    /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#react.children.foreach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */


    function forEachChildren(children, forEachFunc, forEachContext) {
      if (children == null) {
        return children;
      }

      var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
      traverseAllChildren(children, forEachSingleChild, traverseContext);
      releaseTraverseContext(traverseContext);
    }

    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
      var result = bookKeeping.result,
          keyPrefix = bookKeeping.keyPrefix,
          func = bookKeeping.func,
          context = bookKeeping.context;
      var mappedChild = func.call(context, child, bookKeeping.count++);

      if (Array.isArray(mappedChild)) {
        mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
      } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
          mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
        }

        result.push(mappedChild);
      }
    }

    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
      var escapedPrefix = '';

      if (prefix != null) {
        escapedPrefix = escapeUserProvidedKey(prefix) + '/';
      }

      var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
      traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
      releaseTraverseContext(traverseContext);
    }
    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#react.children.map
     *
     * The provided mapFunction(child, key, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */


    function mapChildren(children, func, context) {
      if (children == null) {
        return children;
      }

      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, func, context);
      return result;
    }
    /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://reactjs.org/docs/react-api.html#react.children.count
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */


    function countChildren(children, context) {
      return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
    }
    /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://reactjs.org/docs/react-api.html#react.children.toarray
     */


    function toArray(children) {
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
      return result;
    }
    /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://reactjs.org/docs/react-api.html#react.children.only
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */


    function onlyChild(children) {
      !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
      return children;
    }

    var describeComponentFrame = function (name, source, ownerName) {
      return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
    };

    function getComponentName(fiber) {
      var type = fiber.type;

      if (typeof type === 'string') {
        return type;
      }

      if (typeof type === 'function') {
        return type.displayName || type.name;
      }

      return null;
    }
    /**
     * ReactElementValidator provides a wrapper around a element factory
     * which validates the props passed to the element. This is intended to be
     * used only in DEV and could be replaced by a static type checker for languages
     * that support it.
     */


    {
      var currentlyValidatingElement = null;
      var propTypesMisspellWarningShown = false;

      var getDisplayName = function (element) {
        if (element == null) {
          return '#empty';
        } else if (typeof element === 'string' || typeof element === 'number') {
          return '#text';
        } else if (typeof element.type === 'string') {
          return element.type;
        } else if (element.type === REACT_FRAGMENT_TYPE) {
          return 'React.Fragment';
        } else {
          return element.type.displayName || element.type.name || 'Unknown';
        }
      };

      var getStackAddendum = function () {
        var stack = '';

        if (currentlyValidatingElement) {
          var name = getDisplayName(currentlyValidatingElement);
          var owner = currentlyValidatingElement._owner;
          stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
        }

        stack += ReactDebugCurrentFrame.getStackAddendum() || '';
        return stack;
      };

      var VALID_FRAGMENT_PROPS = new Map([['children', true], ['key', true]]);
    }

    function getDeclarationErrorAddendum() {
      if (ReactCurrentOwner.current) {
        var name = getComponentName(ReactCurrentOwner.current);

        if (name) {
          return '\n\nCheck the render method of `' + name + '`.';
        }
      }

      return '';
    }

    function getSourceInfoErrorAddendum(elementProps) {
      if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
        var source = elementProps.__source;
        var fileName = source.fileName.replace(/^.*[\\\/]/, '');
        var lineNumber = source.lineNumber;
        return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
      }

      return '';
    }
    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */


    var ownerHasKeyUseWarning = {};

    function getCurrentComponentErrorInfo(parentType) {
      var info = getDeclarationErrorAddendum();

      if (!info) {
        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

        if (parentName) {
          info = '\n\nCheck the top-level render call using <' + parentName + '>.';
        }
      }

      return info;
    }
    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */


    function validateExplicitKey(element, parentType) {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }

      element._store.validated = true;
      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

      if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
        return;
      }

      ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.

      var childOwner = '';

      if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
        // Give the component that originally created this child.
        childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
      }

      currentlyValidatingElement = element;
      {
        warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum());
      }
      currentlyValidatingElement = null;
    }
    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */


    function validateChildKeys(node, parentType) {
      if (typeof node !== 'object') {
        return;
      }

      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
          var child = node[i];

          if (isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = true;
        }
      } else if (node) {
        var iteratorFn = getIteratorFn(node);

        if (typeof iteratorFn === 'function') {
          // Entry iterators used to provide implicit keys,
          // but now we print a separate warning for them later.
          if (iteratorFn !== node.entries) {
            var iterator = iteratorFn.call(node);
            var step;

            while (!(step = iterator.next()).done) {
              if (isValidElement(step.value)) {
                validateExplicitKey(step.value, parentType);
              }
            }
          }
        }
      }
    }
    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */


    function validatePropTypes(element) {
      var componentClass = element.type;

      if (typeof componentClass !== 'function') {
        return;
      }

      var name = componentClass.displayName || componentClass.name;
      var propTypes = componentClass.propTypes;

      if (propTypes) {
        currentlyValidatingElement = element;
        checkPropTypes(propTypes, element.props, 'prop', name, getStackAddendum);
        currentlyValidatingElement = null;
      } else if (componentClass.PropTypes !== undefined && !propTypesMisspellWarningShown) {
        propTypesMisspellWarningShown = true;
        warning(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
      }

      if (typeof componentClass.getDefaultProps === 'function') {
        warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
      }
    }
    /**
     * Given a fragment, validate that it can only be provided with fragment props
     * @param {ReactElement} fragment
     */


    function validateFragmentProps(fragment) {
      currentlyValidatingElement = fragment;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(fragment.props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (!VALID_FRAGMENT_PROPS.has(key)) {
            warning(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.%s', key, getStackAddendum());
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (fragment.ref !== null) {
        warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.%s', getStackAddendum());
      }

      currentlyValidatingElement = null;
    }

    function createElementWithValidation(type, props, children) {
      var validType = typeof type === 'string' || typeof type === 'function' || typeof type === 'symbol' || typeof type === 'number'; // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.

      if (!validType) {
        var info = '';

        if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
        }

        var sourceInfo = getSourceInfoErrorAddendum(props);

        if (sourceInfo) {
          info += sourceInfo;
        } else {
          info += getDeclarationErrorAddendum();
        }

        info += getStackAddendum() || '';
        warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info);
      }

      var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
      // TODO: Drop this when these are no longer allowed as the type argument.

      if (element == null) {
        return element;
      } // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing errors.
      // We don't want exception behavior to differ between dev and prod.
      // (Rendering will throw with a helpful message and as soon as the type is
      // fixed, the key warnings will appear.)


      if (validType) {
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      }

      if (typeof type === 'symbol' && type === REACT_FRAGMENT_TYPE) {
        validateFragmentProps(element);
      } else {
        validatePropTypes(element);
      }

      return element;
    }

    function createFactoryWithValidation(type) {
      var validatedFactory = createElementWithValidation.bind(null, type); // Legacy hook TODO: Warn if this is accessed

      validatedFactory.type = type;
      {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
      return validatedFactory;
    }

    function cloneElementWithValidation(element, props, children) {
      var newElement = cloneElement.apply(this, arguments);

      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], newElement.type);
      }

      validatePropTypes(newElement);
      return newElement;
    }

    var React = {
      Children: {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray: toArray,
        only: onlyChild
      },
      Component: Component,
      PureComponent: PureComponent,
      unstable_AsyncComponent: AsyncComponent,
      Fragment: REACT_FRAGMENT_TYPE,
      createElement: createElementWithValidation,
      cloneElement: cloneElementWithValidation,
      createFactory: createFactoryWithValidation,
      isValidElement: isValidElement,
      version: ReactVersion,
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
        ReactCurrentOwner: ReactCurrentOwner,
        // Used by renderers to avoid bundling object-assign twice in UMD bundles:
        assign: _assign
      }
    };
    {
      _assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
        // These should not be included in production.
        ReactDebugCurrentFrame: ReactDebugCurrentFrame,
        // Shim for React DOM 16.0.0 which still destructured (but not used) this.
        // TODO: remove in React 17.0.
        ReactComponentTreeHook: {}
      });
    }
    var React$2 = Object.freeze({
      default: React
    });
    var React$3 = React$2 && React || React$2; // TODO: decide on the top-level export form.
    // This is hacky but makes it work with both Rollup and Jest.

    var react = React$3['default'] ? React$3['default'] : React$3;
    module.exports = react;
  })();
}
},{"object-assign":"J4Nk","fbjs/lib/emptyObject":"+CtU","fbjs/lib/invariant":"wRU+","fbjs/lib/warning":"F5Lz","fbjs/lib/emptyFunction":"UQex","prop-types/checkPropTypes":"Qo3t"}],"1n8/":[function(require,module,exports) {
'use strict';

if ("development.javierzen" === 'production') {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
},{"./cjs/react.development.js":"dkFq"}],"LL1E":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

var emptyFunction = require('fbjs/lib/emptyFunction');

var invariant = require('fbjs/lib/invariant');

var warning = require('fbjs/lib/warning');

var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

var checkPropTypes = require('./checkPropTypes');

module.exports = function (isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */

  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);

    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }
  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */


  var ANONYMOUS = '<<anonymous>>'; // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),
    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker
  };
  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */

  /*eslint-disable no-self-compare*/

  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */


  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  } // Make `instanceof Error` still work for returned errors.


  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if ("development.javierzen" !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }

    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(false, 'Calling PropTypes validators directly is not supported by the `prop-types` package. ' + 'Use `PropTypes.checkPropTypes()` to call them. ' + 'Read more at http://fb.me/use-check-prop-types');
        } else if ("development.javierzen" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;

          if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
          manualPropTypeWarningCount < 3) {
            warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will throw in the standalone `prop-types` package. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName);
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }

      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }

          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }

        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);
    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }

      var propValue = props[propName];

      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }

      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);

        if (error instanceof Error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      "development.javierzen" !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];

      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }

      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }

      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

          if (error instanceof Error) {
            return error;
          }
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      "development.javierzen" !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];

      if (typeof checker !== 'function') {
        warning(false, 'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' + 'received %s at index %s.', getPostfixForTypeWarning(checker), i);
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];

        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }

    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }

      for (var key in shapeTypes) {
        var checker = shapeTypes[key];

        if (!checker) {
          continue;
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);

      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      } // We need to check all keys in case some are required but missing from
      // props.


      var allKeys = assign({}, props[propName], shapeTypes);

      for (var key in allKeys) {
        var checker = shapeTypes[key];

        if (!checker) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' + '\nBad object: ' + JSON.stringify(props[propName], null, '  ') + '\nValid keys: ' + JSON.stringify(Object.keys(shapeTypes), null, '  '));
        }

        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);

        if (error) {
          return error;
        }
      }

      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;

      case 'boolean':
        return !propValue;

      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }

        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);

        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;

          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;

              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;

      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    } // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'


    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    } // Fallback for non-spec compliant Symbols which are polyfilled.


    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  } // Equivalent of `typeof` but with special handling for array and regexp.


  function getPropType(propValue) {
    var propType = typeof propValue;

    if (Array.isArray(propValue)) {
      return 'array';
    }

    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }

    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }

    return propType;
  } // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.


  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }

    var propType = getPropType(propValue);

    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }

    return propType;
  } // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"


  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);

    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;

      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;

      default:
        return type;
    }
  } // Returns class name of the object, if any.


  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }

    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;
  return ReactPropTypes;
};
},{"fbjs/lib/emptyFunction":"UQex","fbjs/lib/invariant":"wRU+","fbjs/lib/warning":"F5Lz","object-assign":"J4Nk","./lib/ReactPropTypesSecret":"Asjh","./checkPropTypes":"Qo3t"}],"5D9O":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
if ("development.javierzen" !== 'production') {
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

  var isValidElement = function (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }; // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod


  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}
},{"./factoryWithTypeCheckers":"LL1E"}],"mdfe":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
'use strict';

var _assign = require('object-assign');

var emptyObject = require('fbjs/lib/emptyObject');

var _invariant = require('fbjs/lib/invariant');

if ("development.javierzen" !== 'production') {
  var warning = require('fbjs/lib/warning');
}

var MIXINS_KEY = 'mixins'; // Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.

function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;

if ("development.javierzen" !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */
  var injectedMixins = [];
  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */

  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',
    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',
    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',
    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };
  /**
   * Similar to ReactClassInterface but for static methods.
   */

  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };
  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */

  var RESERVED_SPEC_KEYS = {
    displayName: function (Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function (Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function (Constructor, childContextTypes) {
      if ("development.javierzen" !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }

      Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
    },
    contextTypes: function (Constructor, contextTypes) {
      if ("development.javierzen" !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }

      Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
    },

    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function (Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function (Constructor, propTypes) {
      if ("development.javierzen" !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }

      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function (Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function () {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if ("development.javierzen" !== 'production') {
          warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName);
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null; // Disallow overriding of base class methods unless explicitly allowed.

    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(specPolicy === 'OVERRIDE_BASE', 'ReactClassInterface: You are attempting to override ' + '`%s` from your class specification. Ensure that your method names ' + 'do not overlap with React methods.', name);
    } // Disallow defining methods more than once unless explicitly allowed.


    if (isAlreadyDefined) {
      _invariant(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED', 'ReactClassInterface: You are attempting to define ' + '`%s` on your component more than once. This conflict may be due ' + 'to a mixin.', name);
    }
  }
  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */


  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if ("development.javierzen" !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if ("development.javierzen" !== 'production') {
          warning(isMixinValid, "%s: You're attempting to include a mixin that is either null " + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec);
        }
      }

      return;
    }

    _invariant(typeof spec !== 'function', "ReactClass: You're attempting to " + 'use a component class or function as a mixin. Instead, just use a ' + 'regular object.');

    _invariant(!isValidElement(spec), "ReactClass: You're attempting to " + 'use a component as a mixin. Instead, just use a regular object.');

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs; // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.

    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name]; // These cases should already be caught by validateMethodOverride.

            _invariant(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY'), 'ReactClass: Unexpected spec policy %s for key %s ' + 'when mixing in component specs.', specPolicy, name); // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.


            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;

            if ("development.javierzen" !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];

      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;

      _invariant(!isReserved, 'ReactClass: You are attempting to define a reserved ' + 'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' + 'as an instance property instead; it will still be accessible on the ' + 'constructor.', name);

      var isAlreadyDefined = name in Constructor;

      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name) ? ReactClassStaticInterface[name] : null;

        _invariant(specPolicy === 'DEFINE_MANY_MERGED', 'ReactClass: You are attempting to define ' + '`%s` on your component more than once. This conflict may be ' + 'due to a mixin.', name);

        Constructor[name] = createMergedResultFunction(Constructor[name], property);
        return;
      }

      Constructor[name] = property;
    }
  }
  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */


  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(one && two && typeof one === 'object' && typeof two === 'object', 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.');

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(one[key] === undefined, 'mergeIntoWithNoDuplicateKeys(): ' + 'Tried to merge two objects with the same key: `%s`. This conflict ' + 'may be due to a mixin; in particular, this may be caused by two ' + 'getInitialState() or getDefaultProps() methods returning objects ' + 'with clashing keys.', key);

        one[key] = two[key];
      }
    }

    return one;
  }
  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */


  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);

      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }

      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }
  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */


  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }
  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */


  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);

    if ("development.javierzen" !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;

      boundMethod.bind = function (newThis) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        } // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.


        if (newThis !== component && newThis !== null) {
          if ("development.javierzen" !== 'production') {
            warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName);
          }
        } else if (!args.length) {
          if ("development.javierzen" !== 'production') {
            warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName);
          }

          return boundMethod;
        }

        var reboundMethod = _bind.apply(boundMethod, arguments);

        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }

    return boundMethod;
  }
  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */


  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;

    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function () {
      this.__isMounted = true;
    }
  };
  var IsMountedPostMixin = {
    componentWillUnmount: function () {
      this.__isMounted = false;
    }
  };
  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */

  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function (newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function () {
      if ("development.javierzen" !== 'production') {
        warning(this.__didWarnIsMounted, '%s: isMounted is deprecated. Instead, make sure to clean up ' + 'subscriptions and pending requests in componentWillUnmount to ' + 'prevent memory leaks.', this.constructor && this.constructor.displayName || this.name || 'Component');
        this.__didWarnIsMounted = true;
      }

      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function () {};

  _assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);
  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */


  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function (props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.
      if ("development.javierzen" !== 'production') {
        warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory');
      } // Wire up auto-binding


      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;
      this.state = null; // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;

      if ("development.javierzen" !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (initialState === undefined && this.getInitialState._isMockFunction) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }

      _invariant(typeof initialState === 'object' && !Array.isArray(initialState), '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent');

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];
    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));
    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin); // Initialize the defaultProps property after all mixins have been merged.

    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if ("development.javierzen" !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }

      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(Constructor.prototype.render, 'createClass(...): Class specification must implement a `render` method.');

    if ("development.javierzen" !== 'production') {
      warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component');
      warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component');
      warning(!Constructor.prototype.UNSAFE_componentWillRecieveProps, '%s has a method called UNSAFE_componentWillRecieveProps(). ' + 'Did you mean UNSAFE_componentWillReceiveProps()?', spec.displayName || 'A component');
    } // Reduce time spent doing lookups by setting these on the prototype.


    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;
},{"object-assign":"J4Nk","fbjs/lib/emptyObject":"+CtU","fbjs/lib/invariant":"wRU+","fbjs/lib/warning":"F5Lz"}],"IAnx":[function(require,module,exports) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var React = require('react');
var factory = require('./factory');

if (typeof React === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React.Component().updater;

module.exports = factory(
  React.Component,
  React.isValidElement,
  ReactNoopUpdateQueue
);

},{"react":"1n8/","./factory":"mdfe"}],"JiK/":[function(require,module,exports) {
var define;
(function(root, factory) {
    if (typeof exports !== "undefined") {
        var React = require("react");
        var PropTypes = require("prop-types");
        var createReactClass = require("create-react-class");
        module.exports = factory(React, PropTypes, createReactClass);
    }
    else if (typeof define === "function" && define.amd) {
        define(["react", "prop-types", "create-react-class"], function(React, PropTypes, createReactClass) {
            return factory(React, PropTypes, createReactClass);
        });
    }
    else {
        factory(root.React, root.PropTypes, root.createReactClass);
    }
}(this, function(React, PropTypes, createReactClass) {

    var FileDrop = createReactClass({
        displayName: "FileDrop",

        propTypes: {
            onDrop: PropTypes.func,
            onDragOver: PropTypes.func,
            onDragLeave: PropTypes.func,
            dropEffect: PropTypes.oneOf(["copy", "move", "link", "none"]),
            targetAlwaysVisible: PropTypes.bool,
            frame: function (props, propName, componentName) {
                var prop = props[propName];
                if (prop == null) {
                    return new Error("Warning: Required prop `" + propName + "` was not specified in `" + componentName + "`");
                }
                if (prop !== document && prop !== window && !(prop instanceof HTMLElement)) {
                    return new Error("Warning: Prop `" + propName + "` must be one of the following: document, window, or an HTMLElement!");
                }
            },
            onFrameDragEnter: PropTypes.func,
            onFrameDragLeave: PropTypes.func,
            onFrameDrop: PropTypes.func
        },

        getDefaultProps: function () {
            return {
                dropEffect: "copy",
                frame: document,
                targetAlwaysVisible: false
            };
        },

        // getInitialState: in componentWillMount, we call this.resetDragging();

        resetDragging: function () {
            this._dragCount = 0;
            this.setState({draggingOverFrame: false, draggingOverTarget: false});
        },

        _handleDrop: function (event) {
            event.preventDefault();
            if (this.props.onDrop) {
                var files = (event.dataTransfer) ? event.dataTransfer.files : (event.frame) ? event.frame.files : undefined;
                this.props.onDrop(files, event);
                this.resetDragging();
            }
        },

        _handleDragOver: function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.dataTransfer.dropEffect = this.props.dropEffect;

            // set active drag state only when file is dragged into
            // (in mozilla when file is dragged effect is "uninitialized")
            var effectAllowed = event.dataTransfer.effectAllowed;
            if (effectAllowed === "all" || effectAllowed === "uninitialized") {
                this.setState({draggingOverTarget: true});
            }

            if (this.props.onDragOver) this.props.onDragOver(event);
        },

        _handleDragLeave: function (event) {
            this.setState({draggingOverTarget: false});
            if (this.props.onDragLeave) this.props.onDragLeave(event);
        },

        _handleFrameDrag: function (event) {
            // We are listening for events on the 'frame', so every time the user drags over any element in the frame's tree,
            // the event bubbles up to the frame. By keeping count of how many "dragenters" we get, we can tell if they are still
            // "draggingOverFrame" (b/c you get one "dragenter" initially, and one "dragenter"/one "dragleave" for every bubble)
            this._dragCount += (event.type === "dragenter" ? 1 : -1);
            if (this._dragCount === 1) {
                if (this.props.onFrameDragEnter) {
					if (this.props.onFrameDragEnter(event) === false) {
						return;
					}
				}
                this.setState({draggingOverFrame: true});
            } else if (this._dragCount === 0) {
                if (this.props.onFrameDragLeave) this.props.onFrameDragLeave(event);
                this.setState({draggingOverFrame: false});
            }
        },

        _handleFrameDrop: function(event) {
            if (!this.state.draggingOverTarget) {
                this.resetDragging();
                if (this.props.onFrameDrop) this.props.onFrameDrop(event);
            }
            this._handleDrop(event);
        },

        render: function () {
            var fileDropTarget;
            var fileDropTargetClassName = "file-drop-target";
            if (this.props.targetAlwaysVisible || this.state.draggingOverFrame) {
                if (this.state.draggingOverFrame) fileDropTargetClassName += " file-drop-dragging-over-frame";
                if (this.state.draggingOverTarget) fileDropTargetClassName += " file-drop-dragging-over-target";
                fileDropTarget = (
                    React.createElement("div", {className: fileDropTargetClassName},
                        this.props.children
                    )
                );
            }
            var className = "file-drop";
            if (this.props.className) {
                className += " " + this.props.className;
            }
            return (
                React.createElement("div", {className: className, onDrop: this._handleDrop, onDragLeave: this._handleDragLeave, onDragOver: this._handleDragOver},
                    fileDropTarget
                )
            );
        },

        _handleWindowDragOverOrDrop: function(event) {
            event.preventDefault();
        },

        componentWillReceiveProps: function(nextProps) {
            if (nextProps.frame !== this.props.frame) {
                this.resetDragging();
                this.stopFrameListeners(this.props.frame);
                this.startFrameListeners(nextProps.frame);
            }
        },

        componentWillMount: function() {
            this.startFrameListeners();
            this.resetDragging();
            window.addEventListener("dragover", this._handleWindowDragOverOrDrop);
            window.addEventListener("drop", this._handleWindowDragOverOrDrop);
        },

        componentWillUnmount: function() {
            this.stopFrameListeners();
            window.removeEventListener("dragover", this._handleWindowDragOverOrDrop);
            window.removeEventListener("drop", this._handleWindowDragOverOrDrop);
        },

        stopFrameListeners: function(frame) {
            frame = frame || this.props.frame;
            frame.removeEventListener("dragenter", this._handleFrameDrag);
            frame.removeEventListener("dragleave", this._handleFrameDrag);
            frame.removeEventListener("drop", this._handleFrameDrop);
        },

        startFrameListeners: function(frame) {
            frame = frame || this.props.frame;
            frame.addEventListener("dragenter", this._handleFrameDrag);
            frame.addEventListener("dragleave", this._handleFrameDrag);
            frame.addEventListener("drop", this._handleFrameDrop);
        }
    });

    if (typeof exports === "undefined" && typeof define !== "function" && !this.ReactFileDrop) {
        this.ReactFileDrop = FileDrop;
    }

    return FileDrop;
}));

},{"react":"1n8/","prop-types":"5D9O","create-react-class":"IAnx"}],"ltHz":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class PreprocessorsSelector extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      preprocessors: [//TODO: Until parcel fixes https://github.com/parcel-bundler/parcel/issues/758, we cannot
      // use the same class both here and the CoreWorker. So, a plain object is used
      {
        name: 'RemoveSpecialChars',
        enabled: false
      }, {
        name: 'RemoveStopWords',
        enabled: false
      }]
    };
    props.onChange(this.state.preprocessors);
  }

  btnClick(preprocessor) {
    preprocessor.enabled = !preprocessor.enabled;
    this.setState({
      preprocessors: this.state.preprocessors
    });
    this.props.onChange(this.state.preprocessors);
  }

  render() {
    let buttons = [];
    this.state.preprocessors.forEach((pre, i) => buttons.push(_react.default.createElement("button", {
      type: "button",
      key: i,
      className: 'btn btn-sm ' + (pre.enabled ? 'btn-info' : 'btn-outline-secondary'),
      onClick: this.btnClick.bind(this, pre)
    }, pre.name, " ", pre.enabled ? '(ON)' : '(OFF)')));
    return _react.default.createElement("span", {
      style: {
        zoom: 0.8
      }
    }, _react.default.createElement("span", {
      className: "btn-group"
    }, buttons));
  }

}

exports.default = PreprocessorsSelector;
},{"react":"1n8/"}],"1qbm":[function(require,module,exports) {
module.exports = {
  "file-drop": "_file-drop_zmsp6_1",
  "file-drop-target": "_file-drop-target_zmsp6_8",
  "file-drop-dragging-over-frame": "_file-drop-dragging-over-frame_zmsp6_38",
  "file-drop-dragging-over-target": "_file-drop-dragging-over-target_zmsp6_53"
};
},{}],"M/0n":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactFileDrop = _interopRequireDefault(require("react-file-drop"));

var _PreprocessorsSelector = _interopRequireDefault(require("./PreprocessorsSelector"));

require("../../public/stylesheets/file-drop.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// getJSON(url, sucessCbk, errCbk = ()=>console.error(err)) {
//   let request = new XMLHttpRequest();
//   request.open('GET', url, true);
//
//   request.onload = function () {
//     if (request.status >= 200 && request.status < 400) {
//       sucessCbk(JSON.parse(request.responseText));
//     } else {
//       errCbk("Error " + request.status)
//     }
//   };
//
//   request.onerror = function (err) {
//     errCbk(err)
//   };
//
//   request.send();
// }
// Sample data loaded
// parseDataObject(sampleData)
// function nonCircularObjectToString(doc) {
//   if (typeof doc === "object") {
//     return _.map(_.values(doc), doc => this.nonCircularObjectToString(doc)).join(" ||| ")
//   } else {
//     return (doc || "").toString()
//   }
// }
class DataLoader {
  static loadFileData(file, data) {
    let fileName = file.name.toLowerCase();

    if (fileName.endsWith('.txt')) {
      return data.split('\n');
    } else if (fileName.endsWith('.json')) {
      return JSON.parse(data);
    } else {
      console.warn('Unsupported file format, treating as text');
      return data.split('\n');
    }
  }

}

class InputBar extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentInput: this.props.value
    };
  } // changes from the outside


  componentWillReceiveProps(nextProps) {
    const currentInput = nextProps.currentInput;

    if (this.state.currentInput != currentInput && currentInput) {
      this.setState({
        currentInput
      });
    }
  }

  handleFileDrop(files, event) {
    // Disables Native Event -- relying on Proxy Event -- prevents double firing
    // if (!event.nativeEvent) {
    //   return;
    // }
    const file = files[0];

    if (!file) {
      return;
    }

    this.setState({
      currentInput: {
        name: file.name,
        size: file.size
      }
    });
    const reader = new FileReader();

    function errorHandler(evt) {
      switch (evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
          alert('File Not Found!');
          break;

        case evt.target.error.NOT_READABLE_ERR:
          alert('File is not readable');
          break;

        case evt.target.error.ABORT_ERR:
          break;
        // noop

        default:
          alert('An error occurred reading this file.');
      }
    }

    reader.onerror = errorHandler;

    reader.onprogress = ({
      lengthComputable,
      loaded,
      total
    }) => {
      // evt is an ProgressEvent.
      if (lengthComputable) {
        const percentLoaded = Math.round(loaded / total * 100);

        if (percentLoaded < 100) {
          this.props.onInputProgress(`Loading ${percentLoaded}% (${file.name})`);
        }
      }
    };

    reader.onabort = e => alert('File read cancelled');

    reader.onloadstart = e => {};

    reader.onload = e => {
      // Ensure that the progress bar displays 100% at the end.
      // angular.element($(".resultsarea")).scope().loadingFileProgress(`Loading ${100}% (${file.name})`);
      this.props.onInputProgress(`Loaded 100%. Parsing... (${file.name})`);

      if (this.props.onChange) {
        this.fileContent = reader.result; // Use a timeout to give time to the UI to update progress

        setTimeout(() => this.props.onChange({
          name: file.name,
          data: DataLoader.loadFileData(file, this.fileContent)
        }), 5);
      }
    }; // Read in the image file as a binary string.


    reader.readAsText(file);
  }

  preprocessorsChanged(preprocessors) {
    this.props.onPreprocessorChange(preprocessors);
  }

  render() {
    let fileInfo = [];
    let file = this.state.currentInput;

    if (this.state.currentInput) {
      fileInfo = _react.default.createElement("div", null, _react.default.createElement("strong", null, file.name), "\xA0 ", Math.ceil(file.size / (1024 * 1024) * 10) / 10, " MB");
    } else {
      fileInfo = "Drag and drop a text/json/csv file here";
    }

    return _react.default.createElement("div", {
      className: 'container-fluid bg-dark '
    }, _react.default.createElement("div", {
      className: 'row align-items-center pt-2'
    }, _react.default.createElement("div", {
      className: "col-md-6 text-white text-center"
    }, fileInfo, _react.default.createElement(_reactFileDrop.default, {
      frame: document,
      onDrop: this.handleFileDrop.bind(this)
    }, _react.default.createElement("div", {
      className: "",
      id: "navbarSupportedContent"
    }, "Drag your file here"))), _react.default.createElement("div", {
      className: 'col-md-6 text-right'
    }, _react.default.createElement(_PreprocessorsSelector.default, {
      onChange: this.preprocessorsChanged.bind(this)
    }))));
  }

}

exports.default = InputBar;
},{"react":"1n8/","react-file-drop":"JiK/","./PreprocessorsSelector":"ltHz","../../public/stylesheets/file-drop.css":"1qbm"}],"5M00":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class SearchBar extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value;

    try {
      // Try converting it to regex
      new RegExp(value);
      this.setState({
        invalidRegex: false
      });
    } catch (err) {
      this.setState({
        invalidRegex: true
      });
    }

    this.setState({
      value
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  preventFormSubmitOnEnter(e) {
    var keyCode = e.keyCode || e.which;
    let KEYCODE_ENTER = 13;
    let KEYCODE_BACKSPACE = 8;

    if (keyCode === KEYCODE_ENTER) {
      if (e.shiftKey && this.state.value) {
        this.props.onDrilldownAction('addFilter');
      }

      if (e.ctrlKey && this.state.value) {
        this.props.onDrilldownAction('addExclusion');
      }

      e.preventDefault();
      return false;
    }

    if (keyCode === KEYCODE_BACKSPACE && e.shiftKey && !this.state.value) {
      this.props.onDrilldownAction('remove');
    }
  } // changes from the outside


  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;

    if (this.state.value != value) {
      this.setState({
        value
      });
    }
  }

  render() {
    return _react.default.createElement("div", {
      className: "bg-dark container-fluid p-2"
    }, _react.default.createElement("div", {
      className: "",
      id: "navbarSupportedContent"
    }, _react.default.createElement("form", {
      className: "my-0 my-lg-0"
    }, _react.default.createElement("input", {
      type: "search",
      autoFocus: this.props.autoFocus,
      placeholder: "Search text with regex...",
      onKeyDown: this.preventFormSubmitOnEnter.bind(this),
      className: "form-control" + (this.state.invalidRegex ? ' text-danger' : ''),
      value: this.state.value,
      onChange: this.handleChange
    }))));
  }

}

exports.default = SearchBar;
},{"react":"1n8/"}],"8Sed":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = downloadFile;

function downloadFile(textData, fileName, mimeType = 'text/plain') {
  function createDownloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {
      type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    a.remove();
  }

  createDownloadFile(textData, fileName, mimeType);
}
},{}],"fpv7":[function(require,module,exports) {
module.exports = {
  "ResultsTable": "_ResultsTable_wq1ez_1",
  "TopMatchesTable": "_TopMatchesTable_wq1ez_12",
  "markj": "_markj_wq1ez_21"
};
},{}],"1JXR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _downloadFile = _interopRequireDefault(require("../utils/downloadFile"));

var _searchResults = _interopRequireDefault(require("../../public/stylesheets/search-results.less"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// import styles from "../../public/stylesheets/test.css"
class SearchResults extends _react.Component {
  downloadUniqueMatches(matches) {
    (0, _downloadFile.default)(JSON.stringify(matches, true, 4), 'unique-matches.json');
  }

  render() {
    let startTime = new Date();
    let searchRes = this.props.res;

    if (!searchRes) {
      return _react.default.createElement("div", {
        className: "m-3"
      }, _react.default.createElement("h5", {
        className: "pl-2"
      }, "No data has been loaded yet"));
    }

    let items = searchRes.matchSamples || [];
    let stats = searchRes.stats || {};
    let status = this.props.progress || `Searched ${stats.totalCount.toLocaleString()} items in ${stats.searchTime}ms`;
    const results = [];
    items.slice(0, 50).forEach((res, i) => {
      results.push(_react.default.createElement("tr", {
        key: i.toString() + searchRes.searchId,
        className: ""
      }, _react.default.createElement("td", null, " ", _react.default.createElement(RegexSearchResult, {
        result: res
      }))));
    });

    if (!items.length) {
      results.push(_react.default.createElement("tr", {
        key: -1,
        className: ""
      }, _react.default.createElement("td", null, _react.default.createElement("strong", null, "No hay resultados"))));
    }

    const extras = [];

    if (searchRes.extras) {
      let max = 50;
      let top = (searchRes.extras || {}).topMatches;

      if (top) {
        extras.push(_react.default.createElement("h5", {
          key: 'title'
        }, "Unique matches: ", top.length.toLocaleString(), "\xA0", _react.default.createElement("span", {
          className: "zoom-small btn btn-sm btn-link ml-1 p-0",
          onClick: () => this.downloadUniqueMatches(top.map(t => t[0])),
          title: `Download ${top.length} unique matches as json`
        }, _react.default.createElement("i", {
          className: "material-icons align-middle"
        }, "file_download"))));
        extras.push(_react.default.createElement(TopMatches, {
          key: 'top',
          title: `Top ${Math.min(max, top.length)} matches`,
          matches: top.slice(0, max)
        }));

        if (top.length > max) {
          extras.push(_react.default.createElement("hr", {
            key: 'hr'
          }));
          extras.push(_react.default.createElement(TopMatches, {
            key: 'bottom',
            title: `Bottom ${max} matches`,
            matches: top.slice(-Math.min(top.length - max, max))
          }));
        }
      }
    } // console.log("Render time", new Date() - startTime)


    return _react.default.createElement("div", {
      className: "container-fluid"
    }, _react.default.createElement("div", {
      className: "row"
    }, _react.default.createElement("div", {
      className: "col-9 p-3"
    }, _react.default.createElement("div", {
      className: "row"
    }, _react.default.createElement("div", {
      className: "col-9 p-0 pl-3"
    }, _react.default.createElement("h5", {
      className: 'pl-2'
    }, stats.matchesCount.toLocaleString(), " matches \xA0", _react.default.createElement("em", {
      className: "text-info"
    }, status))), _react.default.createElement("div", {
      className: "col-3 p-0 text-right zoom-small"
    }, _react.default.createElement("span", {
      className: "btn btn-sm btn-link",
      onClick: this.props.onDownloadResults,
      title: `Download ${stats.matchesCount} results as json`
    }, _react.default.createElement("i", {
      className: "material-icons align-middle"
    }, "file_download")))), _react.default.createElement("table", {
      className: _searchResults.default.ResultsTable
    }, _react.default.createElement("tbody", null, results))), _react.default.createElement("div", {
      className: "col-3 bg-light p-3"
    }, extras)));
  }

}

exports.default = SearchResults;

class RegexSearchResult extends _react.Component {
  render() {
    const parts = [];
    const {
      itemText,
      matches
    } = this.props.result;
    let from = 0; // debugger;

    matches.forEach((m, i) => {
      parts.push(itemText.slice(from, m.index));
      let to = m.index + m[0].length;
      parts.push(_react.default.createElement("mark", {
        className: _searchResults.default.markj,
        key: i
      }, itemText.slice(m.index, to)));
      from = to;
    });
    parts.push(itemText.slice(from));
    return _react.default.createElement("div", null, parts);
  }

}

class TopMatches extends _react.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let items = this.props.matches || [];
    const matches = [];
    items.slice(0, 100).forEach(([uniqueMatch, count], i) => {
      matches.push(_react.default.createElement("tr", {
        key: i,
        className: ""
      }, _react.default.createElement("td", {
        className: "text-info text-right"
      }, " ", count.toString(), " "), _react.default.createElement("td", null, uniqueMatch.toString(), " ")));
    });
    return _react.default.createElement("div", null, _react.default.createElement("h6", null, this.props.title), _react.default.createElement("table", {
      className: _searchResults.default.TopMatchesTable
    }, _react.default.createElement("tbody", null, matches)));
  }

}
},{"react":"1n8/","../utils/downloadFile":"8Sed","../../public/stylesheets/search-results.less":"fpv7"}],"FUOi":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let singletonWorker = null;

class CoreWorkerProxy {
  constructor() {
    if (singletonWorker) {
      singletonWorker.terminate();
    }

    this.worker = new Worker("worker.3bc4e13d.js");
    singletonWorker = this.worker;
    this.msgCbks = {};
    this.pendingCalls = {}; // Test, used in all examples:

    this.worker.onmessage = ({
      data
    }) => {
      if (data.msg && this.msgCbks[data.msg]) {
        this.msgCbks[data.msg](data.payload);
      } else {
        console.warn(`Received unexpected msg from worker:`, data);
      }
    };

    this.onMsg('proxyCallResponse', ({
      callId,
      res
    }) => {
      if (callId && this.pendingCalls[callId]) {
        this.pendingCalls[callId](res);
      }
    }); // this.worker.onerror(err => alert(err))
  }

  async proxyCall(method, ...args) {
    const callId = "call" + Math.random() + "-" + new Date();
    const responsePromise = new Promise((resolve, reject) => {
      this.pendingCalls[callId] = resolve;
    });
    this.worker.postMessage({
      method,
      args,
      callId
    });
    return responsePromise;
  }

  async loadData(data) {
    return await this.proxyCall('loadData', data);
  }

  async setPreprocessors(preprocessors) {
    return await this.proxyCall('setPreprocessors', preprocessors);
  }

  async search(searchObj) {
    return await this.proxyCall('search', searchObj);
  }

  async drilldownAction(...params) {
    return await this.proxyCall('drilldownAction', ...params);
  }

  async getFilteredData(...params) {
    return await this.proxyCall('getFilteredData', ...params);
  }

  onSearchDone(cbk) {
    this.onMsg('searchDone', cbk);
  }

  onPartialSearchResult(cbk) {
    this.onMsg('partialSearchResult', cbk);
  }

  onLoadProgress(cbk) {
    this.onMsg('loadProgress', cbk);
  }

  onDrilldownStepsUpdate(cbk) {
    this.onMsg('drilldownStepsUpdate', cbk);
  }

  onMsg(msg, cbk) {
    this.msgCbks[msg] = cbk;
  }

}

exports.default = CoreWorkerProxy;

async function fetchSample() {
  return await (await fetch(sampleURL)).json();
}
},{"./..\\worker.js":[["worker.3bc4e13d.js","iltZ"],"worker.3bc4e13d.map","iltZ"]}],"JPvS":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class DrilldownFiltersBar extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const value = event.target.value; // console.log('Original:', value)

    this.setState({
      value
    });

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  } // changes from the outside


  componentWillReceiveProps(nextProps) {
    const value = nextProps.value;

    if (this.state.value != value) {
      this.setState({
        value
      });
    }
  }

  addFilter() {
    this.props.onDrilldownAction('addFilter');
  }

  addExclusion() {
    this.props.onDrilldownAction('addExclusion');
  }

  toggleFilter(step) {
    this.props.onDrilldownAction('toggleFilter', step.id);
  }

  removeStep(step) {
    this.props.onDrilldownAction('remove', step.id);
  }

  render() {
    let steps = this.props.drilldownSteps;
    let filterSteps = steps.map((step, i) => {
      let {
        searchQuery,
        isOn,
        type,
        affectedCount
      } = step;

      let typeIcon = _react.default.createElement("i", {
        className: "material-icons align-middle"
      }, type === 'filter' ? 'filter_list' : 'remove_circle');

      let baseColor = isOn ? type === 'filter' ? 'primary' : 'danger' : 'light';
      return _react.default.createElement("span", {
        key: i
      }, _react.default.createElement("span", {
        className: `btn btn-sm btn-${isOn ? baseColor : 'outline-' + baseColor}`,
        onClick: this.toggleFilter.bind(this, step)
      }, typeIcon, "\xA0", searchQuery.replace(/[igm]+$/, ''), " ", isOn ? `(${affectedCount})` : ''), _react.default.createElement("span", {
        className: 'btn btn-sm btn-link p0 pl-0',
        onClick: this.removeStep.bind(this, step)
      }, _react.default.createElement("i", {
        className: "material-icons"
      }, "close")));
    });
    let stepsBar = [];

    if (filterSteps.length > 0) {
      stepsBar = _react.default.createElement("div", {
        className: "bg-dark container-fluid p-0 pl-2 pb-2 text-white"
      }, filterSteps);
    }

    return _react.default.createElement("div", {
      style: {
        zoom: '0.8'
      },
      className: "drilldown-filters-bar"
    }, stepsBar, _react.default.createElement("div", {
      className: "bg-light container-fluid text-white p-0"
    }, _react.default.createElement("span", {
      className: 'btn btn-link',
      onClick: this.addFilter.bind(this)
    }, _react.default.createElement("i", {
      className: "material-icons align-middle pr-1"
    }, "filter_list"), "Search within results \xA0", _react.default.createElement("span", {
      className: "badge badge-light"
    }, "Shift+Ent")), _react.default.createElement("span", {
      className: 'btn btn-link',
      onClick: this.addExclusion.bind(this)
    }, _react.default.createElement("i", {
      className: "material-icons align-middle pr-1"
    }, "remove_circle_outline"), "Exclude results \xA0", _react.default.createElement("span", {
      className: "badge badge-light"
    }, "Ctrl+Ent")), _react.default.createElement("span", {
      className: 'text-white'
    })));
  }

}

exports.default = DrilldownFiltersBar;
},{"react":"1n8/"}],"GoA+":[function(require,module,exports) {
module.exports = ["Bomba de agua", "Climatizador", "bujias", "bujias incandescentes", "bujias precalentamientos cortas", "calentadores", "fiesta no arranca", "modelo de bujia endura d 1.8", "no arranca", "no calienta los calentadores", "precalentamiento", "tipos de bujias calentamientos", "Aire", "Bajo rpm en endeavor", "presion de aceite baja", "enciende y apaga de una vez", "prende y se apaga mi renault twingo", "estatus 2001 enciende y se apaga camina y se tironea", "Buenas amigo revisa la valvula PCV tal vez este abierta y pudiera ser el consumo de... Usa semisintético 15w-40 de buena calidad.", "bomba de agua", "bujias", "bujias carbonizadas", "correa de tiempo", "correa de tiempo original", "damper", "multiple de admision", "pcv", "pcv abierto", "pcv se quedo abierto", "refrigerante", "refrigerantes", "sensor  mao original", "sensor map original", "tornillo damper", "valvula pcv tal vez esta abierta", "varilla de aceite", "SE APAGA", "bomba de nafta fiesta", "bomba nafta fiesta", "calienta los relay fiesta", "fiesta lx", "fusible bomba de nafta", "fusible bomba fiesta lx", "fusilera fiesta gnc", "no llega corriente a la bomba fiesta", "correa de tiempo", "Accord", "Accord 2011", "Chevrolet Captiva", "agua con gasolina", "agua con gasolina", "agua y aceite", "agua y gasolina", "caja", "gasolina en el reservorio de agua", "agua y gasolina", "prende la luz de aceite", "Al meter la tercera en mi auto cuesta y hace ruidos", "Aceite de dirección hidraulica", "MO NE TRABAJA EL PILOTO AUTOMATICO", "NO ME TRABAJA EL TRUST CONTROL", "carro acelerado cuan se calienta", "fallas cuando la banda de tiempo se brinca", "se acelera", "sintomas cuando la banda de tiempo se brinca", "tren trasero", "Beetle 2.5", "Relevados 428", "donde queda el tapon de la caja para echarle aceite", "sensor cigueñal", "sensor de detonacion", "sensor golpe", "sensor map", "valvula iac", "cambiar motor de ford explorer", "se apaga", "se apaga renault kangoo", "sensor temperatura", "luz tablero no se apaga.", "no se apagan luces de tablero", "que es la chapa de contacto?", "Range Rover", "Captiva", "Mantenimiento lancer", "Sensor de posicion de arbol de levas a", "Sensor de posicion de arbol de levas", "catalizador optra", "fallas en el catalizador optra", "se apaga", "perdida de agua siena", "Donde queda la valvula de alta sistema", "Sistema A/A", "Emulsión de aceite con refrigerante", "Luz roja de tablero de kangoo 2001 no enciende", "Tengo problemas con la luz roja del tablero deje de parpadear y no me arranca... Es una kangoo", "Gasolina", "Chupe Aire", "Que aceite lleva un sonic 2016", "Soportes del motor", "turbo", "lubricacion", "porque cada vez que se calienta el aceite de mi vw golf iv empieza a sonar los taquetes", "rx8", "ltz", "Mala combustión", "Se apaga", "Sensor de velocidad", "Cómo conectar un sensor de velocidad a un optra", "agua", "motor", "Temporizador de precalentamiento", "reprogramacion tcm nissan pathfinder", "Compresor aire acondicionado fiat palio", "bota aceite al levantar el carro para cambiar un caucho", "no activa la bomba de gasolina", "variadores", "variadores mercedes C 200", "Mazda suena como diesel", "Electro ventilador", "Falla al acelerar", "Falla al acelerar", "deposito limpiaparabrisas", "limpiaàrabrisas", "limpiaparabrisas", "P0299", "balastro", "bujía no tiene chispa", "bujías no tienen chispa", "bujia no tiene chispa", "codigo de error 89", "motor ruido", "CRUCERO", "BATERIA", "BATERIA DEL 207 COMPACT", "NO ME ARRANCA", "QUE BATERIA LLEVA MI AUTO", "TENGO CONTACTO PERO NO ARRANCA", "Neutral switch", "anomalia anticontaminacion", "anomalia anticontaminacion", "anomalia anticontaminacion hdi", "accent se apaga", "Revoluciones", "codigo del esterio", "fiesta2012", "sonido al encender", "sonido al encender", "sonido al encender sonata", "Se apaga de la nada bora gli", "El motor no enciende a veces spark", "A que kilometraje se cambia la correa de distribución de un Jets 2.5", "Correa de reparticion", "Correa de reparticion en una jeta 2.5", "Distribuidor fiat uno scr", "Recalentamiento modulo fiat uno scr", "gol trend", "jetta tdi", "correa dentada de distribución", "distribución cómo sincronizar", "motor recalienta", "por qué recalienta un motor causas y soluciones", "recalentamiento del motor", "recalentamiento del motor causas y soluciones", "recalienta el motor", "código po717", "Mensaje acelere o apague", "Arranque", "Marca erroneo el velocimetro c3 2010", "Buenos dias amigo mi carro vw gol 2002 presenta la misma falla q el de iraima ya le hice mantenimiento completo y sigue igual... solo enfria parado o a bajas velocidades pero en carretera cuando le exijo velocidad al carro deja de enfriar... me comentaron q podria ser la valvula poa pero que este compresor que es el original no usa esa valvula y que por lo tanto ya esta dañado q opinion tu me darias?", "aire acondicionado", "grand picasso", "Se desprogramaron los vidrios eléctricos", "lo enciendo y no acelera", "no marca el kilometraje", "se acelera cuando la valvula de temperatura", "se acelera solo", "se acelera solo cuando arranca el electro", "sensor de electroventilador", "sensor de temperatura", "tablero", "valvula de ventilador", "valvula electro ventilador", "valvula de temperatura", "velocimetro", "alra", "bujías", "bujias", "caudalímetro", "check engine", "coolant", "franklinosayandescott@Gmail.con", "hauswagen", "luz", "oye", "prestamo", "servofrenos", "vibracion volante", "Abs", "Aceite", "Como programar mi toyota camry 1999", "Altima 2002 no hay chispa", "No hay chispa", "peugeot 807", "ACTIVACION DE ALARMA", "ALARMA", "Alarma no funciona", "LUCES AL ACTIVAR ALARMA", "La alarma no suena", "de caladora", "No encienden las luces de niebla", "Tengo un chevrolet optra", "rotura de semieje trasero duster 4wd", "semieje trasero", "no gira la llave", "prende y de apaga las luces baja", "tengo problema con la luces baja prende y se apagan", "en la mañana no agarra los cambios", "en frio no agarra velocidad", "no hace los cambios", "motor no hace cambios", "no cambia de velocidad", "Humo después del lavado de motor", "cambia filtro diesel kia sorento", "filtro diesel", "se", "Consumo", "cierre", "cierre centralizado cristales", "computadora", "Luz de averia de motor", "Consumo de aceite", "Radio", "Radio#select-com58c35f4683da5411005cc5e7", "Mi auto se le activo el paralizador de motor k puedo aser", "falla en la mañana", "fallas de sensor oxigeno", "sensor de oxigeno", "tiembla", "tiembla sensor", "vibra", "BOBINA ENCENDIDO", "Mazda cx5", "cuerpo mariposa", "muy acelerada meriva", "poco caudal de viento", "sensor map", "fuga de liga fiesta bala", "modulo electroventilador", "alternador", "testigo del airbag", "al prenderlo avienta el agua por el tapon de radiador", "Tironeo", "Tironeo vento", "falla de electroventilador", "poner en tiempo el fiat siena", "poner en tiempo fiat siena", "MI AUTO CASCAVEDEA MUCHO CUANDO PRENDO EL AIRE'", "MI AUTO TIEMBLA MUCHO CUANDO PRENDO EL AIRE", "Válvula iac", "hace un ruido en los inyectores es normal", "Alarma", "Revoluciones", "frena en curva", "pita", "toyota", "toyota previa", "30-43le", "P0700", "jeep cherokee 30-43LE", "distribucion", "polea de caladora", "Cuanto aceite lleva el Civic ex 2008", "consumo gasolina", "consume  mucho", "consume mucha gasolina", "consumo  alto", "consumo alto de gasolina", "consumo de gasolina alto", "consumo elevado gasolina", "ecu", "gasolina", "gasolina alta", "no enfria", "sensor", "sensor tps", "sensor de ventilacion del tsuru 1994", "escaner daewoo matiz", "valvulas daewoo matiz", "Temperatura a 70 grados", "falla electrica provoco que de marcha y no prenda es un cavalier 98 2.2", "Chery", "Harina 7", "Mazda ck7", "Captiva pistonea", "Captiva sin fuerza", "Captva sin fuerza en subida", "humo negro", "Swift", "cambios", "transmision", "transmision#select-com58d4338cf0058f11007623b0", "aire acondicionado", "no enciende el aire acondicionado", "mi optra no marca la temperatura", "mi optra no marca la temperatura cuando sube", "orden de encendido ford fiesta 1.6", "civic 2012", "bomba de gasolina sin retorno", "golpea de 2 a 3ra", "Problema de aceleracion", "no arranca", "no arranca", "no arranca aunque le heche gasolina al cuerpo de aceleracion", "tierra a las bobinas de una una ram 4.7", "Sable", "Sable 2001", "Sensor esp", "C0899", "Encendido check engine en peugeot 2014", "base del filtro de aceite terios", "problema con el croche", "problema con el croche terios", "Vibración en el motor", "aire", "combustion", "falta de chispa en la bobina", "moja candelas de combustible", "passat no arranca", "pastilla", "toma de aire", "valvula pcv", "Frenos rav4 2016", "P1737", "Batería sonic ltz 2015", "Batería sonic ltz 2015#select-com58cef57eb4dd7b10003a50de", "Tablero de stratus no marca", "01314", "P0106", "como eliminar mi cuenta", "como eliminar mi perfil", "eliminar mi cuenta", "quitar mi cuenta", "quitar mis dato", "mi camioneta fort ranger pierde potencia al acelerar y povo a poco va responduendo se apaga sola en frenado brusci o pendientes y en topes y baches se quuere apagar o pierde potencia que sera", "mi twingo le cuesta arrancar", "araña", "parrillas delanteras", "porta maza", "Cheyenne 2004", "ford fiesta se descarga la bateria apagado", "potencia  de motor reducida", "se descarga la bateria apagado", "aguja de temperatura", "se ahoga", "se ahoga galloper diesel", "direccion dura", "se subio 2 rayas la temperatura, cascabeleo y se apago", "se subio 2 rayas la temperatura, cascabeleo y se apago sentra 2008", "diagrama electrico de windstar", "testigo de aceite", "2012", "Problema con el compresor", "Sensor de cigüeñal", "P1639 ecosport", "cuerpo aceleracion ecosport", "cuerpo de aceleracion eco sport", "p1639", "p1639 ecosport", "alarma", "problemas con aire acondicionado", "ELANTRA 2016", "FOCUS 2014", "FORD FOCUS", "208", "nivelación de revoluciones", "revoluciones", "Ubicación válvula egr hyundai elantra 2002", "Ubicación válvula ver hyundai delantera 2002", "Frenos", "Se acelera cada tanto", "Slim", "Ruido en balatas", "Ruido en las balatas recien cambiadas", "altima 1999", "No tiene fuerza", "Se apaga", "Se apaga  mi honda odyssey", "Se apaga de repente mi Honda Odyssey 2001", "No enciende", "Encendido luz herramienta", "bateria", "falla nafta no arranca en frio", "Chery tiggo", "Problema de velocimetro chery tiggo", "Velocimetro chery tiggo funciona a veces", "Velocimetro no funciona", "yaris hash bag", "TXL NO TIENE CORRIENTE", "se calienta", "servicio ahora dice en el tablero", "Darc", "Maynar", "Suran", "Parpadea", "Cambio de cubiertas", "Cambio de rodado", "Calentamiento en un fiesta 2006 motor 1.6", "Electroventilador", "golpeaaldesacelerar", "problemasdbimasa", "problemasdeenbrague", "ruidoaldesaselerarcomcruseta", "Aceite de motor", "Tengo una f 150 2009 todo esta aparentemente bien pero de ves en cuando me cancanea como si resbalara la transmision por favor alguien tiene idea de que puede ser", "luz de guantera", "hola Mi eco es 2005 quisiera saber cuales son las Medidas del PUENTE DELANTERO", "hola Mi eco es 2005 quisiera saber cuales son las medidas del puente delantero ya que me esta reventando la Junta Homocinetica", "Clutch de jetta a4 raspa y tira aceite", "Clutch jetta a4", "queda en segunda", "Nissan tiida 2015", "SENTRA 2011", "sentra", "sentra 2011", "como borrar el codigo de mantenimiento al motor", "no arranca town country", "si da marcha pero no arrancada", "A mi honda odyssey 2004 se le prendio la luz  tcs que significa", "2013", "CR-V", "CRV", "Corolla", "For focus", "Ford Focus", "Hond", "Honda", "Honda CRV 2017", "Toyota Rav4", "rav4", "falla chevrolet colorado", "tengo una falla con una chevrolet colorado no llega corriente en tres bobina", "Ruido en el motor", "Ruido en el motor", "falla p0300 p0420", "Mi Astra  2005 no acelera de repente  acelera y de repente no no ase cambios  y aveces no agarra la reversa", "Mi carro lo ase los cambios", "CHAPA JETTA A4", "SPARK NG", "SPARK NG NO QUIERO EL SATFINDER", "mi camioneta le doy vuelta al volante y se apaga", "Cambios la caja", "Jetta", "Jetta automatico a4", "No cambia de velocidad jetta automatico", "No revoluciona", "Se apaga al dar vuelta", "Se apaga al girar volante", "Los cambios no entran bien", "alarma", "golpe en parte trasera", "humo por donde se le deposita el aceite de motor en un beetle", "4x4 parpadea", "al acelerar se detiene el motor", "que significa el codigo u0009 del hyundai elantra año 2005", "Le cuesta trabajo arrancar", "No me arranca el coche", "No me arranca el coche después de clase", "cajuela", "Existe fusible para los ventiladores del nissan sentra", "Los ventiladores no me encienden", "No me encienden los ventiladores", "No me funcionan los ventiladores de mi nissan sentra", "presión de aceite", "Se calienta", "Calienta y se apaga", "Cuando calienta se apaga", "levanta cristales", "Alarma de máxima 1999", "xsara picasso", "Hay dos fichas sueltas", "Hay dos fichas sueltas", "Bluetooth", "Bluetooth golf", "Bluetooth moto g", "Arranque fiesta", "fiat 147", "olor a quemado del motor", "golf tsi embrague", "Mi almera no regula las revoluciones", "BOBINAS DE IGNICION", "EXPLOSIONES", "aire acondicionado", "jalonea cambios", "BOMBA DE GASOLINA", "COMPUTADOR FALLAS", "RANGER 1997", "RELAY", "RELAY BOMBA DE GASOLINA", "RELAY DE GASOLINA"];
},{}],"NQAW":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _InputBar = _interopRequireDefault(require("./InputBar.js"));

var _SearchBar = _interopRequireDefault(require("./SearchBar.js"));

var _SearchResults = _interopRequireDefault(require("./SearchResults.js"));

var _CoreWorkerProxy = _interopRequireDefault(require("../core/CoreWorkerProxy"));

var _DrilldownFiltersBar = _interopRequireDefault(require("./DrilldownFiltersBar"));

var _downloadFile = _interopRequireDefault(require("../utils/downloadFile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

//const sampleURL = 'https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json';
const sampleData = require('../../public/samples/sample-data.json');

async function fetchSample() {
  return await (await fetch(sampleURL)).json();
}

class CrunchyText extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: {
        name: 'sample',
        data: []
      },
      search: 'de \\w+',
      results: null,
      drillDownSteps: [],
      inputSettings: null,
      stats: {}
    };
    this.searchChanged = this.searchChanged.bind(this);
    this.inputDataChanged = this.inputDataChanged.bind(this);
    this.coreWorker = new _CoreWorkerProxy.default();
    this.coreWorker.loadData(sampleData);
    setTimeout(() => {
      this.search();
    }, 20);
    this.coreWorker.onLoadProgress(progress => this.setState({
      progress
    }));
    this.coreWorker.onSearchDone(results => this.setState({
      results,
      stats: results.stats,
      progress: ""
    }));
    this.coreWorker.onPartialSearchResult(results => {
      if (!results.extras) {
        results.extras = this.state.results.extras;
      }

      this.setState({
        results,
        stats: results.stats
      });
    });
    this.coreWorker.onDrilldownStepsUpdate(steps => this.setState({
      drillDownSteps: steps
    }));
  }

  onInputProgress(progress) {
    this.setState({
      progress
    });
  }

  search() {
    try {
      this.coreWorker.search(new RegExp(this.state.search, 'igm'));
    } catch (err) {
      this.setState({
        invalidInput: true
      });
    }
  }

  inputDataChanged(textInput) {
    this.setState({
      textInput,
      progress: "Sending data to worker..."
    }); // Set timeout to ensure progress is show

    setTimeout(() => {
      this.coreWorker.loadData(textInput.data);
      this.search();
    }, 1);
  }

  preprocessorsChanged(preprocessors) {
    preprocessors.forEach(p => p.className = p.name);
    this.coreWorker.setPreprocessors(preprocessors);
  }

  searchChanged(search) {
    this.setState({
      search
    }, () => this.search());
  }

  async downloadResults() {
    const data = await this.coreWorker.getFilteredData();
    const exportedData = data.map(({
      itemText
    }) => itemText);
    let fileName = `${this.state.textInput.name}-filtered.json`;
    (0, _downloadFile.default)(JSON.stringify(exportedData, true, 4), fileName, 'text/plain');
  }

  drilldownAction(actionName, ...params) {
    this.coreWorker.drilldownAction(actionName, ...params);

    if (actionName === "addFilter" || actionName === "addExclusion") {
      this.setState({
        search: ""
      });
      setTimeout(() => this.search(), 20);
    }
  }

  render() {
    let {
      search,
      inputSettings,
      drillDownSteps,
      progress,
      results
    } = this.state;
    return _react.default.createElement("div", null, _react.default.createElement(_InputBar.default, {
      value: inputSettings,
      onChange: this.inputDataChanged.bind(this),
      onInputProgress: this.onInputProgress.bind(this),
      onPreprocessorChange: this.preprocessorsChanged.bind(this)
    }), _react.default.createElement(_SearchBar.default, {
      value: search,
      onChange: this.searchChanged.bind(this),
      onDrilldownAction: this.drilldownAction.bind(this)
    }), _react.default.createElement(_DrilldownFiltersBar.default, {
      drilldownSteps: drillDownSteps,
      onDrilldownAction: this.drilldownAction.bind(this)
    }), _react.default.createElement(_SearchResults.default, {
      progress: progress,
      res: results,
      onDownloadResults: this.downloadResults.bind(this)
    }));
  }

}

exports.default = CrunchyText;
},{"react":"1n8/","./InputBar.js":"M/0n","./SearchBar.js":"5M00","./SearchResults.js":"1JXR","../core/CoreWorkerProxy":"FUOi","./DrilldownFiltersBar":"JPvS","../utils/downloadFile":"8Sed","../../public/samples/sample-data.json":"GoA+"}],"Focm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CrunchyText", {
  enumerable: true,
  get: function () {
    return _CrunchyText.default;
  }
});
Object.defineProperty(exports, "SearchBar", {
  enumerable: true,
  get: function () {
    return _SearchBar.default;
  }
});
Object.defineProperty(exports, "SearchResults", {
  enumerable: true,
  get: function () {
    return _SearchResults.default;
  }
});
Object.defineProperty(exports, "DrilldownFiltersBar", {
  enumerable: true,
  get: function () {
    return _DrilldownFiltersBar.default;
  }
});
Object.defineProperty(exports, "InputBar", {
  enumerable: true,
  get: function () {
    return _InputBar.default;
  }
});
Object.defineProperty(exports, "CoreWorkerProxy", {
  enumerable: true,
  get: function () {
    return _CoreWorkerProxy.default;
  }
});

var _CrunchyText = _interopRequireDefault(require("./ui/CrunchyText"));

var _SearchBar = _interopRequireDefault(require("./ui/SearchBar"));

var _SearchResults = _interopRequireDefault(require("./ui/SearchResults"));

var _DrilldownFiltersBar = _interopRequireDefault(require("./ui/DrilldownFiltersBar"));

var _InputBar = _interopRequireDefault(require("./ui/InputBar"));

var _CoreWorkerProxy = _interopRequireDefault(require("./core/CoreWorkerProxy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./ui/CrunchyText":"NQAW","./ui/SearchBar":"5M00","./ui/SearchResults":"1JXR","./ui/DrilldownFiltersBar":"JPvS","./ui/InputBar":"M/0n","./core/CoreWorkerProxy":"FUOi"}]},{},["Focm"], null)
//# sourceMappingURL=index.map