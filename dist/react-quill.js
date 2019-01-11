(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("quill"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "quill"], factory);
	else if(typeof exports === 'object')
		exports["ReactQuill"] = factory(require("react"), require("quill"));
	else
		root["ReactQuill"] = factory(root["React"], root["Quill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_23__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

	/*
	React-Quill v0.3.0
	https://github.com/zenoamaro/react-quill
	*/
	module.exports = __webpack_require__(/*! ./component */ 1);
	module.exports.Mixin = __webpack_require__(/*! ./mixin */ 22);
	module.exports.Toolbar = __webpack_require__(/*! ./toolbar */ 17);


/***/ }),
/* 1 */
/*!**************************!*\
  !*** ./src/component.js ***!
  \**************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 2),
	  PropTypes = __webpack_require__(/*! prop-types */ 3),
		createReactClass = __webpack_require__(/*! create-react-class */ 10),
		QuillToolbar = __webpack_require__(/*! ./toolbar */ 17),
		QuillMixin = __webpack_require__(/*! ./mixin */ 22),
		T = PropTypes;
	
	// Support React 0.11 and 0.12
	// FIXME: Remove with React 0.13
	if (React.createFactory) {
		QuillToolbar = React.createFactory(QuillToolbar);
	}
	
	// Support React 0.12 and 0.13+
	// FIXME: Remove with React 0.13
	if (React.cloneElement) {
		var cloneElement = React.cloneElement;
	} else if (React.addons && React.addons.cloneWithProps) {
		var cloneElement = React.addons.cloneWithProps;
	} else {
		throw new Error('React addons are required when using React 0.12 or less.');
	}
	
	var QuillComponent = createReactClass({
	
		displayName: 'Quill',
	
		mixins: [ QuillMixin ],
	
		propTypes: {
			id: T.string,
			className: T.string,
			style: T.object,
			value: T.string,
			defaultValue: T.string,
			readOnly: T.bool,
			modules: T.object,
			toolbar: T.oneOfType([ T.array, T.oneOf([false]), ]),
			formats: T.array,
			styles: T.oneOfType([ T.object, T.oneOf([false]) ]),
			theme: T.string,
			pollInterval: T.number,
			onKeyPress: T.func,
			onKeyDown: T.func,
			onKeyUp: T.func,
			onChange: T.func,
			onChangeSelection: T.func,
	    children: T.string,
	    ondragStar: T.func,
	    ondrag: T.func,
	    onClick: T.func,
	    ondropas: T.func,
	    ondragOver: T.func,
	    feature: T.string,
	    ondragEndLink: T.func,
	    link: T.string
		},
	
		/*
		Changing one of these props should cause a re-render.
		*/
		dirtyProps: [
			'id',
			'className',
			'modules',
			'toolbar',
			'formats',
			'styles',
			'theme',
			'pollInterval'
		],
	
		getDefaultProps: function() {
			return {
				className: '',
				theme: 'base',
				modules: {
					'link-tooltip': true
				}
			};
		},
	
		/*
		We consider the component to be controlled if
		whenever `value` is bein sent in props.
		*/
		isControlled: function() {
			return 'value' in this.props;
		},
	
		getInitialState: function() {
			return {
				value: this.isControlled()
					? this.props.value
					: this.props.defaultValue
			};
		},
	
		componentWillReceiveProps: function(nextProps) {
			var editor = this.state.editor;
			// If the component is unmounted and mounted too quickly
			// an error is thrown in setEditorContents since editor is
			// still undefined. Must check if editor is undefined
			// before performing this call.
			if (editor) {
				// Update only if we've been passed a new `value`.
				// This leaves components using `defaultValue` alone.
				if ('value' in nextProps) {
					// NOTE: Seeing that Quill is missing a way to prevent
					//       edits, we have to settle for a hybrid between
					//       controlled and uncontrolled mode. We can't prevent
					//       the change, but we'll still override content
					//       whenever `value` differs from current state.
					if (nextProps.value !== this.getEditorContents()) {
						this.setEditorContents(editor, nextProps.value);
					}
				}
				// We can update readOnly state in-place.
				if ('readOnly' in nextProps) {
					if (nextProps.readOnly !== this.props.readOnly) {
						this.setEditorReadOnly(editor, nextProps.readOnly);
					}
				}
			}
		},
	
		componentDidMount: function() {
			var editor = this.createEditor(
				this.getEditorElement(),
				this.getEditorConfig());
	
			this.setCustomFormats(editor);
	
			// NOTE: Custom formats will be stripped when creating
			//       the editor, since they are not present there yet.
			//       Therefore, we re-set the contents from state.
			this.setState({ editor:editor }, function() {
				this.setEditorContents(editor, this.state.value);
			}.bind(this));
		},
	
		componentWillUnmount: function() {
			this.destroyEditor(this.state.editor);
			// NOTE: Don't set the state to null here
			//       as it would generate a loop.
		},
	
		shouldComponentUpdate: function(nextProps, nextState) {
			// Check if one of the changes should trigger a re-render.
			for (var i=0; i< this.dirtyProps.length; i++) {
				var prop = this.dirtyProps[i];
				if (nextProps[prop] !== this.props[prop]) {
					return true;
				}
			}
			// Never re-render otherwise.
			return false;
		},
	
		/*
		If for whatever reason we are rendering again,
		we should tear down the editor and bring it up
		again.
		*/
		componentWillUpdate: function() {
			this.componentWillUnmount();
		},
	
		componentDidUpdate: function() {
			this.componentDidMount();
		},
	
		setCustomFormats: function (editor) {
			if (!this.props.formats) {
				return;
			}
	
			for (var i = 0; i < this.props.formats.length; i++) {
				var format = this.props.formats[i];
				editor.addFormat(format.name || format, format);
			}
		},
	
		getEditorConfig: function() {
			var config = {
				readOnly:     this.props.readOnly,
				theme:        this.props.theme,
				// Let Quill set the defaults, if no formats supplied
				formats:      this.props.formats ? [] : undefined,
				styles:       this.props.styles,
				modules:      this.props.modules,
				pollInterval: this.props.pollInterval
			};
			// Unless we're redefining the toolbar, or it has been explicitly
			// disabled, attach to the default one as a ref.
			if (this.props.toolbar !== false && !config.modules.toolbar) {
				// Don't mutate the original modules
				// because it's shared between components.
				config.modules = JSON.parse(JSON.stringify(config.modules));
				config.modules.toolbar = {
					container: this.refs.toolbar
				};
			}
			return config;
		},
	
		getEditor: function() {
			return this.state.editor;
		},
	
		getEditorElement: function() {
			return this.refs.editor;
		},
	
		getEditorContents: function() {
			return this.state.value;
		},
	
		getEditorSelection: function() {
			return this.state.selection;
		},
	
		/*
		Renders either the specified contents, or a default
		configuration of toolbar and contents area.
		*/
		renderContents: function() {
			if (React.Children.count(this.props.children)) {
				// Clone children to own their refs.
				return React.Children.map(
					this.props.children,
					function(c) { return cloneElement(c, { ref: c.ref }); }
				);
			} else {
				return [
					// Quill modifies these elements in-place,
					// so we need to re-render them every time.
	
					// Render the toolbar unless explicitly disabled
					React.createElement('div', {
						key: 'editor-' + Math.random(),
						ref: 'editor',
						className: 'quill-contents',
						dangerouslySetInnerHTML: { __html:this.getEditorContents() },
	          onDragOver: this.props.ondragOver,
	          onDrop: this.props.ondrop,
	          onClick: this.props.onClick,
					}),
	        React.createElement('div', {
	          key: 'link-container ' + Math.random(),
						ref: 'linkContainer',
						className: 'aui-core-form-editor-link-container',
					}, React.createElement('div', {
						     className: 'aui-core-form-editor-link-text-wrapper',
	          }, React.createElement('span', {
	  					    className: 'aui-core-form-editor-link-text',
	                children: 'Enlace permanente '+ this.props.feature,
	            })
	          ),
	          React.createElement('div', {
	              key: 'text-link ' + Math.random(),
	              ref: 'textLink',
						    className: 'aui-core-form-editor-link-draggrable',
	              draggable: true,
	              onDrag: this.props.ondrag,
	              onDragStart: this.props.ondragStar,
	              onDragEnd: this.props.ondragEndLink,
	          }, React.createElement('span', {
						    className: 'aui-core-form-editor-link-text-draggrable',
	              children: this.props.link,
	            })
	          )
	        ),
	        this.props.toolbar !== false ? QuillToolbar({
						key: 'toolbar-' + Math.random(),
						ref: 'toolbar',
						items: this.props.toolbar
					}) : false
				];
			}
		},
	
		render: function() {
			return React.createElement('div', {
				id: this.props.id,
				style: this.props.style,
				className: 'quill ' + this.props.className,
				onKeyPress: this.props.onKeyPress,
				onKeyDown: this.props.onKeyDown,
				onKeyUp: this.props.onKeyUp,
				onChange: this.preventDefault },
				this.renderContents()
			);
		},
	
		onEditorChange: function(value, delta, source) {
			if (value !== this.getEditorContents()) {
				this.setState({ value: value });
				if (this.props.onChange) {
					this.props.onChange(value, delta, source);
				}
			}
		},
	
		onEditorChangeSelection: function(range, source) {
			var s = this.getEditorSelection() || {};
			var r = range || {};
			if (r.start !== s.start || r.end !== s.end) {
				this.setState({ selection: range });
				if (this.props.onChangeSelection) {
					this.props.onChangeSelection(range, source);
				}
			}
		},
	
		focus: function() {
			this.state.editor.focus();
		},
	
		blur: function() {
			this.setEditorSelection(this.state.editor, null);
		},
	
		/*
		Stop change events from the toolbar from
		bubbling up outside.
		*/
		preventDefault: function(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	
	});
	
	module.exports = QuillComponent;


/***/ }),
/* 2 */
/*!**************************************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react","root":"React"} ***!
  \**************************************************************************************/
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/*!*******************************!*\
  !*** ./~/prop-types/index.js ***!
  \*******************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	if (process.env.NODE_ENV !== 'production') {
	  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
	    Symbol.for &&
	    Symbol.for('react.element')) ||
	    0xeac7;
	
	  var isValidElement = function(object) {
	    return typeof object === 'object' &&
	      object !== null &&
	      object.$$typeof === REACT_ELEMENT_TYPE;
	  };
	
	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(/*! ./factoryWithTypeCheckers */ 5)(isValidElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = __webpack_require__(/*! ./factoryWithThrowingShims */ 9)();
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 4 */
/*!**********************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/process/browser.js ***!
  \**********************************************************/
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 5 */
/*!*************************************************!*\
  !*** ./~/prop-types/factoryWithTypeCheckers.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var assign = __webpack_require__(/*! object-assign */ 6);
	
	var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ 7);
	var checkPropTypes = __webpack_require__(/*! ./checkPropTypes */ 8);
	
	var printWarning = function() {};
	
	if (process.env.NODE_ENV !== 'production') {
	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
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
	}
	
	function emptyFunctionThatReturnsNull() {
	  return null;
	}
	
	module.exports = function(isValidElement, throwOnDirectAccess) {
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
	
	  var ANONYMOUS = '<<anonymous>>';
	
	  // Important!
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
	    exact: createStrictShapeTypeChecker,
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
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;
	
	  function createChainableTypeChecker(validate) {
	    if (process.env.NODE_ENV !== 'production') {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;
	
	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          var err = new Error(
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	          err.name = 'Invariant Violation';
	          throw err;
	        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            printWarning(
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
	            );
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
	    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
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
	      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
	      return emptyFunctionThatReturnsNull;
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
	      process.env.NODE_ENV !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunctionThatReturnsNull;
	    }
	
	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        printWarning(
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
	        );
	        return emptyFunctionThatReturnsNull;
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
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
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
	    }
	
	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }
	
	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }
	
	    return false;
	  }
	
	  // Equivalent of `typeof` but with special handling for array and regexp.
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
	  }
	
	  // This handles more types than `getPropType`. Only used for error messages.
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
	  }
	
	  // Returns a string that is postfixed to a warning about an invalid type.
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
	  }
	
	  // Returns class name of the object, if any.
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 6 */
/*!***********************************************!*\
  !*** ./~/prop-types/~/object-assign/index.js ***!
  \***********************************************/
/***/ (function(module, exports) {

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
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
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


/***/ }),
/* 7 */
/*!**************************************************!*\
  !*** ./~/prop-types/lib/ReactPropTypesSecret.js ***!
  \**************************************************/
/***/ (function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';
	
	module.exports = ReactPropTypesSecret;


/***/ }),
/* 8 */
/*!****************************************!*\
  !*** ./~/prop-types/checkPropTypes.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var printWarning = function() {};
	
	if (process.env.NODE_ENV !== 'production') {
	  var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ 7);
	  var loggedTypeFailures = {};
	
	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
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
	  if (process.env.NODE_ENV !== 'production') {
	    for (var typeSpecName in typeSpecs) {
	      if (typeSpecs.hasOwnProperty(typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error(
	              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
	              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
	            );
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning(
	            (componentName || 'React class') + ': type specification of ' +
	            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
	            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
	            'You may have forgotten to pass an argument to the type checker ' +
	            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
	            'shape all require an argument).'
	          )
	
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;
	
	          var stack = getStack ? getStack() : '';
	
	          printWarning(
	            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
	          );
	        }
	      }
	    }
	  }
	}
	
	module.exports = checkPropTypes;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 9 */
/*!**************************************************!*\
  !*** ./~/prop-types/factoryWithThrowingShims.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	var ReactPropTypesSecret = __webpack_require__(/*! ./lib/ReactPropTypesSecret */ 7);
	
	function emptyFunction() {}
	
	module.exports = function() {
	  function shim(props, propName, componentName, location, propFullName, secret) {
	    if (secret === ReactPropTypesSecret) {
	      // It is still safe when called from React.
	      return;
	    }
	    var err = new Error(
	      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	      'Use PropTypes.checkPropTypes() to call them. ' +
	      'Read more at http://fb.me/use-check-prop-types'
	    );
	    err.name = 'Invariant Violation';
	    throw err;
	  };
	  shim.isRequired = shim;
	  function getShim() {
	    return shim;
	  };
	  // Important!
	  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
	  var ReactPropTypes = {
	    array: shim,
	    bool: shim,
	    func: shim,
	    number: shim,
	    object: shim,
	    string: shim,
	    symbol: shim,
	
	    any: shim,
	    arrayOf: getShim,
	    element: shim,
	    instanceOf: getShim,
	    node: shim,
	    objectOf: getShim,
	    oneOf: getShim,
	    oneOfType: getShim,
	    shape: getShim,
	    exact: getShim
	  };
	
	  ReactPropTypes.checkPropTypes = emptyFunction;
	  ReactPropTypes.PropTypes = ReactPropTypes;
	
	  return ReactPropTypes;
	};


/***/ }),
/* 10 */
/*!***************************************!*\
  !*** ./~/create-react-class/index.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	var React = __webpack_require__(/*! react */ 2);
	var factory = __webpack_require__(/*! ./factory */ 11);
	
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


/***/ }),
/* 11 */
/*!*****************************************!*\
  !*** ./~/create-react-class/factory.js ***!
  \*****************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	var _assign = __webpack_require__(/*! object-assign */ 12);
	
	var emptyObject = __webpack_require__(/*! fbjs/lib/emptyObject */ 13);
	var _invariant = __webpack_require__(/*! fbjs/lib/invariant */ 14);
	
	if (process.env.NODE_ENV !== 'production') {
	  var warning = __webpack_require__(/*! fbjs/lib/warning */ 15);
	}
	
	var MIXINS_KEY = 'mixins';
	
	// Helper function to allow the creation of anonymous functions which do not
	// have .name set to the name of the variable being assigned to.
	function identity(fn) {
	  return fn;
	}
	
	var ReactPropTypeLocationNames;
	if (process.env.NODE_ENV !== 'production') {
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
	    displayName: function(Constructor, displayName) {
	      Constructor.displayName = displayName;
	    },
	    mixins: function(Constructor, mixins) {
	      if (mixins) {
	        for (var i = 0; i < mixins.length; i++) {
	          mixSpecIntoComponent(Constructor, mixins[i]);
	        }
	      }
	    },
	    childContextTypes: function(Constructor, childContextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, childContextTypes, 'childContext');
	      }
	      Constructor.childContextTypes = _assign(
	        {},
	        Constructor.childContextTypes,
	        childContextTypes
	      );
	    },
	    contextTypes: function(Constructor, contextTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, contextTypes, 'context');
	      }
	      Constructor.contextTypes = _assign(
	        {},
	        Constructor.contextTypes,
	        contextTypes
	      );
	    },
	    /**
	     * Special case getDefaultProps which should move into statics but requires
	     * automatic merging.
	     */
	    getDefaultProps: function(Constructor, getDefaultProps) {
	      if (Constructor.getDefaultProps) {
	        Constructor.getDefaultProps = createMergedResultFunction(
	          Constructor.getDefaultProps,
	          getDefaultProps
	        );
	      } else {
	        Constructor.getDefaultProps = getDefaultProps;
	      }
	    },
	    propTypes: function(Constructor, propTypes) {
	      if (process.env.NODE_ENV !== 'production') {
	        validateTypeDef(Constructor, propTypes, 'prop');
	      }
	      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
	    },
	    statics: function(Constructor, statics) {
	      mixStaticSpecIntoComponent(Constructor, statics);
	    },
	    autobind: function() {}
	  };
	
	  function validateTypeDef(Constructor, typeDef, location) {
	    for (var propName in typeDef) {
	      if (typeDef.hasOwnProperty(propName)) {
	        // use a warning instead of an _invariant so components
	        // don't show up in prod but only in __DEV__
	        if (process.env.NODE_ENV !== 'production') {
	          warning(
	            typeof typeDef[propName] === 'function',
	            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
	              'React.PropTypes.',
	            Constructor.displayName || 'ReactClass',
	            ReactPropTypeLocationNames[location],
	            propName
	          );
	        }
	      }
	    }
	  }
	
	  function validateMethodOverride(isAlreadyDefined, name) {
	    var specPolicy = ReactClassInterface.hasOwnProperty(name)
	      ? ReactClassInterface[name]
	      : null;
	
	    // Disallow overriding of base class methods unless explicitly allowed.
	    if (ReactClassMixin.hasOwnProperty(name)) {
	      _invariant(
	        specPolicy === 'OVERRIDE_BASE',
	        'ReactClassInterface: You are attempting to override ' +
	          '`%s` from your class specification. Ensure that your method names ' +
	          'do not overlap with React methods.',
	        name
	      );
	    }
	
	    // Disallow defining methods more than once unless explicitly allowed.
	    if (isAlreadyDefined) {
	      _invariant(
	        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
	        'ReactClassInterface: You are attempting to define ' +
	          '`%s` on your component more than once. This conflict may be due ' +
	          'to a mixin.',
	        name
	      );
	    }
	  }
	
	  /**
	   * Mixin helper which handles policy validation and reserved
	   * specification keys when building React classes.
	   */
	  function mixSpecIntoComponent(Constructor, spec) {
	    if (!spec) {
	      if (process.env.NODE_ENV !== 'production') {
	        var typeofSpec = typeof spec;
	        var isMixinValid = typeofSpec === 'object' && spec !== null;
	
	        if (process.env.NODE_ENV !== 'production') {
	          warning(
	            isMixinValid,
	            "%s: You're attempting to include a mixin that is either null " +
	              'or not an object. Check the mixins included by the component, ' +
	              'as well as any mixins they include themselves. ' +
	              'Expected object but got %s.',
	            Constructor.displayName || 'ReactClass',
	            spec === null ? null : typeofSpec
	          );
	        }
	      }
	
	      return;
	    }
	
	    _invariant(
	      typeof spec !== 'function',
	      "ReactClass: You're attempting to " +
	        'use a component class or function as a mixin. Instead, just use a ' +
	        'regular object.'
	    );
	    _invariant(
	      !isValidElement(spec),
	      "ReactClass: You're attempting to " +
	        'use a component as a mixin. Instead, just use a regular object.'
	    );
	
	    var proto = Constructor.prototype;
	    var autoBindPairs = proto.__reactAutoBindPairs;
	
	    // By handling mixins before any other properties, we ensure the same
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
	        var shouldAutoBind =
	          isFunction &&
	          !isReactClassMethod &&
	          !isAlreadyDefined &&
	          spec.autobind !== false;
	
	        if (shouldAutoBind) {
	          autoBindPairs.push(name, property);
	          proto[name] = property;
	        } else {
	          if (isAlreadyDefined) {
	            var specPolicy = ReactClassInterface[name];
	
	            // These cases should already be caught by validateMethodOverride.
	            _invariant(
	              isReactClassMethod &&
	                (specPolicy === 'DEFINE_MANY_MERGED' ||
	                  specPolicy === 'DEFINE_MANY'),
	              'ReactClass: Unexpected spec policy %s for key %s ' +
	                'when mixing in component specs.',
	              specPolicy,
	              name
	            );
	
	            // For methods which are defined more than once, call the existing
	            // methods before calling the new property, merging if appropriate.
	            if (specPolicy === 'DEFINE_MANY_MERGED') {
	              proto[name] = createMergedResultFunction(proto[name], property);
	            } else if (specPolicy === 'DEFINE_MANY') {
	              proto[name] = createChainedFunction(proto[name], property);
	            }
	          } else {
	            proto[name] = property;
	            if (process.env.NODE_ENV !== 'production') {
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
	      _invariant(
	        !isReserved,
	        'ReactClass: You are attempting to define a reserved ' +
	          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
	          'as an instance property instead; it will still be accessible on the ' +
	          'constructor.',
	        name
	      );
	
	      var isAlreadyDefined = name in Constructor;
	      if (isAlreadyDefined) {
	        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
	          ? ReactClassStaticInterface[name]
	          : null;
	
	        _invariant(
	          specPolicy === 'DEFINE_MANY_MERGED',
	          'ReactClass: You are attempting to define ' +
	            '`%s` on your component more than once. This conflict may be ' +
	            'due to a mixin.',
	          name
	        );
	
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
	    _invariant(
	      one && two && typeof one === 'object' && typeof two === 'object',
	      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
	    );
	
	    for (var key in two) {
	      if (two.hasOwnProperty(key)) {
	        _invariant(
	          one[key] === undefined,
	          'mergeIntoWithNoDuplicateKeys(): ' +
	            'Tried to merge two objects with the same key: `%s`. This conflict ' +
	            'may be due to a mixin; in particular, this may be caused by two ' +
	            'getInitialState() or getDefaultProps() methods returning objects ' +
	            'with clashing keys.',
	          key
	        );
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
	    if (process.env.NODE_ENV !== 'production') {
	      boundMethod.__reactBoundContext = component;
	      boundMethod.__reactBoundMethod = method;
	      boundMethod.__reactBoundArguments = null;
	      var componentName = component.constructor.displayName;
	      var _bind = boundMethod.bind;
	      boundMethod.bind = function(newThis) {
	        for (
	          var _len = arguments.length,
	            args = Array(_len > 1 ? _len - 1 : 0),
	            _key = 1;
	          _key < _len;
	          _key++
	        ) {
	          args[_key - 1] = arguments[_key];
	        }
	
	        // User is trying to bind() an autobound method; we effectively will
	        // ignore the value of "this" that the user is trying to use, so
	        // let's warn.
	        if (newThis !== component && newThis !== null) {
	          if (process.env.NODE_ENV !== 'production') {
	            warning(
	              false,
	              'bind(): React component methods may only be bound to the ' +
	                'component instance. See %s',
	              componentName
	            );
	          }
	        } else if (!args.length) {
	          if (process.env.NODE_ENV !== 'production') {
	            warning(
	              false,
	              'bind(): You are binding a component method to the component. ' +
	                'React does this for you automatically in a high-performance ' +
	                'way, so you can safely remove this call. See %s',
	              componentName
	            );
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
	    componentDidMount: function() {
	      this.__isMounted = true;
	    }
	  };
	
	  var IsMountedPostMixin = {
	    componentWillUnmount: function() {
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
	    replaceState: function(newState, callback) {
	      this.updater.enqueueReplaceState(this, newState, callback);
	    },
	
	    /**
	     * Checks whether or not this composite component is mounted.
	     * @return {boolean} True if mounted, false otherwise.
	     * @protected
	     * @final
	     */
	    isMounted: function() {
	      if (process.env.NODE_ENV !== 'production') {
	        warning(
	          this.__didWarnIsMounted,
	          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
	            'subscriptions and pending requests in componentWillUnmount to ' +
	            'prevent memory leaks.',
	          (this.constructor && this.constructor.displayName) ||
	            this.name ||
	            'Component'
	        );
	        this.__didWarnIsMounted = true;
	      }
	      return !!this.__isMounted;
	    }
	  };
	
	  var ReactClassComponent = function() {};
	  _assign(
	    ReactClassComponent.prototype,
	    ReactComponent.prototype,
	    ReactClassMixin
	  );
	
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
	    var Constructor = identity(function(props, context, updater) {
	      // This constructor gets overridden by mocks. The argument is used
	      // by mocks to assert on what gets mounted.
	
	      if (process.env.NODE_ENV !== 'production') {
	        warning(
	          this instanceof Constructor,
	          'Something is calling a React component directly. Use a factory or ' +
	            'JSX instead. See: https://fb.me/react-legacyfactory'
	        );
	      }
	
	      // Wire up auto-binding
	      if (this.__reactAutoBindPairs.length) {
	        bindAutoBindMethods(this);
	      }
	
	      this.props = props;
	      this.context = context;
	      this.refs = emptyObject;
	      this.updater = updater || ReactNoopUpdateQueue;
	
	      this.state = null;
	
	      // ReactClasses doesn't have constructors. Instead, they use the
	      // getInitialState and componentWillMount methods for initialization.
	
	      var initialState = this.getInitialState ? this.getInitialState() : null;
	      if (process.env.NODE_ENV !== 'production') {
	        // We allow auto-mocks to proceed as if they're returning null.
	        if (
	          initialState === undefined &&
	          this.getInitialState._isMockFunction
	        ) {
	          // This is probably bad practice. Consider warning here and
	          // deprecating this convenience.
	          initialState = null;
	        }
	      }
	      _invariant(
	        typeof initialState === 'object' && !Array.isArray(initialState),
	        '%s.getInitialState(): must return an object or null',
	        Constructor.displayName || 'ReactCompositeComponent'
	      );
	
	      this.state = initialState;
	    });
	    Constructor.prototype = new ReactClassComponent();
	    Constructor.prototype.constructor = Constructor;
	    Constructor.prototype.__reactAutoBindPairs = [];
	
	    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));
	
	    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
	    mixSpecIntoComponent(Constructor, spec);
	    mixSpecIntoComponent(Constructor, IsMountedPostMixin);
	
	    // Initialize the defaultProps property after all mixins have been merged.
	    if (Constructor.getDefaultProps) {
	      Constructor.defaultProps = Constructor.getDefaultProps();
	    }
	
	    if (process.env.NODE_ENV !== 'production') {
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
	
	    _invariant(
	      Constructor.prototype.render,
	      'createClass(...): Class specification must implement a `render` method.'
	    );
	
	    if (process.env.NODE_ENV !== 'production') {
	      warning(
	        !Constructor.prototype.componentShouldUpdate,
	        '%s has a method called ' +
	          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
	          'The name is phrased as a question because the function is ' +
	          'expected to return a value.',
	        spec.displayName || 'A component'
	      );
	      warning(
	        !Constructor.prototype.componentWillRecieveProps,
	        '%s has a method called ' +
	          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
	        spec.displayName || 'A component'
	      );
	      warning(
	        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
	        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
	          'Did you mean UNSAFE_componentWillReceiveProps()?',
	        spec.displayName || 'A component'
	      );
	    }
	
	    // Reduce time spent doing lookups by setting these on the prototype.
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 12 */
/*!*******************************************************!*\
  !*** ./~/create-react-class/~/object-assign/index.js ***!
  \*******************************************************/
/***/ (function(module, exports) {

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
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
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


/***/ }),
/* 13 */
/*!********************************************************!*\
  !*** ./~/create-react-class/~/fbjs/lib/emptyObject.js ***!
  \********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	var emptyObject = {};
	
	if (process.env.NODE_ENV !== 'production') {
	  Object.freeze(emptyObject);
	}
	
	module.exports = emptyObject;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 14 */
/*!******************************************************!*\
  !*** ./~/create-react-class/~/fbjs/lib/invariant.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
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
	
	if (process.env.NODE_ENV !== 'production') {
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 15 */
/*!****************************************************!*\
  !*** ./~/create-react-class/~/fbjs/lib/warning.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 *
	 */
	
	'use strict';
	
	var emptyFunction = __webpack_require__(/*! ./emptyFunction */ 16);
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = emptyFunction;
	
	if (process.env.NODE_ENV !== 'production') {
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 16 */
/*!**********************************************************!*\
  !*** ./~/create-react-class/~/fbjs/lib/emptyFunction.js ***!
  \**********************************************************/
/***/ (function(module, exports) {

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

/***/ }),
/* 17 */
/*!************************!*\
  !*** ./src/toolbar.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(/*! react */ 2),
	  ReactDOM = __webpack_require__(/*! react-dom/server */ 18),
		createReactClass = __webpack_require__(/*! create-react-class */ 10),
		PropTypes = __webpack_require__(/*! prop-types */ 3),
		T = PropTypes;
	
	var defaultColors = [
		'rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
		'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
		'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
		'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
		'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
		'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
		'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
		'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
		'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
		'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
		'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
		'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)',
	].map(function(color){ return { value: color } });
	
	var defaultItems = [
	
		{ label:'Formatos', type:'group', items: [
			{ label:'Fuente', type:'font', items: [
				{ label:'Sans Serif',  value:'sans-serif' },
				{ label:'Serif',       value:'serif' },
				{ label:'Monospace',   value:'monospace' }
			]},
			{ type:'separator' },
			{ label:'Tamaño', type:'size', items: [
				{ label:'Pequeña',  value:'10px' },
				{ label:'Normal', value:'13px' },
				{ label:'Grande',  value:'18px' },
				{ label:'Gigante',    value:'32px' }
			]},
			{ type:'separator' },
			{ label:'Justificación', type:'align', items: [
				{ label:'', value:'center' },
				{ label:'', value:'left' },
				{ label:'', value:'right' },
				{ label:'', value:'justify' }
			]}
		]},
	
		{ label:'Texto', type:'group', items: [
			{ type:'bold', label:'Bold' },
			{ type:'italic', label:'Italic' },
			{ type:'strike', label:'Strike' },
			{ type:'underline', label:'Underline' },
			{ type:'separator' },
			{ type:'color', label:'Color de texto', items:defaultColors },
			{ type:'background', label:'Color de fondo', items:defaultColors },
			{ type:'separator' },
		]},
	
		{ label:'Blocks', type:'group', items: [
			{ type:'bullet', label:'Viñeta' },
			{ type:'separator' },
			{ type:'list', label:'Numeración' }
		]}
	
	];
	
	var QuillToolbar = createReactClass({
	
		displayName: 'Quill Toolbar',
	
		propTypes: {
			id:        T.string,
			className: T.string,
			items:     T.array
		},
	
		getDefaultProps: function(){
			return {
				items: defaultItems
			};
		},
	
		renderSeparator: function(key) {
			return React.createElement('span', {
				key: key,
				className:'ql-format-separator'
			});
		},
	
		renderGroup: function(item, key) {
			return React.createElement('span', {
				key: item.label || key,
				className:'ql-format-group' },
				item.items.map(this.renderItem)
			);
		},
	
		renderChoiceItem: function(item, key) {
			return React.createElement('option', {
				key: item.label || item.value || key,
				value:item.value },
				item.label
			);
		},
	
		renderChoices: function(item, key) {
			return React.createElement('select', {
				key: item.label || key,
				title: item.label,
				className: 'ql-'+item.type },
				item.items.map(this.renderChoiceItem)
			);
		},
	
		renderAction: function(item, key) {
			return React.createElement('span', {
				key: item.label || item.value || key,
				className: 'ql-format-button ql-'+item.type,
				title: item.label },
				item.children
			);
		},
	
		renderItem: function(item, key) {
			switch (item.type) {
				case 'separator':
					return this.renderSeparator(key);
				case 'group':
					return this.renderGroup(item, key);
				case 'font':
				case 'align':
				case 'size':
				case 'color':
				case 'background':
					return this.renderChoices(item, key);
				default:
					return this.renderAction(item, key);
			}
		},
	
		getClassName: function() {
			return 'quill-toolbar ' + (this.props.className||'');
		},
	
		render: function() {
			var children = this.props.items.map(this.renderItem);
			var html = children.map(ReactDOM.renderToStaticMarkup).join('');
			return React.createElement('div', {
				className: this.getClassName(),
				dangerouslySetInnerHTML: { __html:html }
			});
		}
	
	});
	
	module.exports = QuillToolbar;
	QuillToolbar.defaultItems = defaultItems;
	QuillToolbar.defaultColors = defaultColors;


/***/ }),
/* 18 */
/*!***************************************!*\
  !*** ./~/react-dom/server.browser.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	if (process.env.NODE_ENV === 'production') {
	  module.exports = __webpack_require__(/*! ./cjs/react-dom-server.browser.production.min.js */ 19);
	} else {
	  module.exports = __webpack_require__(/*! ./cjs/react-dom-server.browser.development.js */ 21);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 19 */
/*!********************************************************************!*\
  !*** ./~/react-dom/cjs/react-dom-server.browser.production.min.js ***!
  \********************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/** @license React v16.7.0
	 * react-dom-server.browser.production.min.js
	 *
	 * Copyright (c) Facebook, Inc. and its affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';var p=__webpack_require__(/*! object-assign */ 20),q=__webpack_require__(/*! react */ 2);function aa(a,b,e,c,g,d,h,f){if(!a){a=void 0;if(void 0===b)a=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var B=[e,c,g,d,h,f],A=0;a=Error(b.replace(/%s/g,function(){return B[A++]}));a.name="Invariant Violation"}a.framesToPop=1;throw a;}}
	function u(a){for(var b=arguments.length-1,e="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=0;c<b;c++)e+="&args[]="+encodeURIComponent(arguments[c+1]);aa(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",e)}
	var w="function"===typeof Symbol&&Symbol.for,y=w?Symbol.for("react.portal"):60106,z=w?Symbol.for("react.fragment"):60107,C=w?Symbol.for("react.strict_mode"):60108,D=w?Symbol.for("react.profiler"):60114,E=w?Symbol.for("react.provider"):60109,F=w?Symbol.for("react.context"):60110,G=w?Symbol.for("react.concurrent_mode"):60111,H=w?Symbol.for("react.forward_ref"):60112,I=w?Symbol.for("react.suspense"):60113,J=w?Symbol.for("react.memo"):60115,L=w?Symbol.for("react.lazy"):60116;
	function M(a){if(null==a)return null;if("function"===typeof a)return a.displayName||a.name||null;if("string"===typeof a)return a;switch(a){case G:return"ConcurrentMode";case z:return"Fragment";case y:return"Portal";case D:return"Profiler";case C:return"StrictMode";case I:return"Suspense"}if("object"===typeof a)switch(a.$$typeof){case F:return"Context.Consumer";case E:return"Context.Provider";case H:var b=a.render;b=b.displayName||b.name||"";return a.displayName||(""!==b?"ForwardRef("+b+")":"ForwardRef");
	case J:return M(a.type);case L:if(a=1===a._status?a._result:null)return M(a)}return null}var ba=q.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ca={};function N(a,b){for(var e=a._threadCount|0;e<=b;e++)a[e]=a._currentValue2,a._threadCount=e+1}function da(a,b,e){var c=a.contextType;if("object"===typeof c&&null!==c)return N(c,e),c[e];if(a=a.contextTypes){e={};for(var g in a)e[g]=b[g];b=e}else b=ca;return b}for(var O=new Uint16Array(16),P=0;15>P;P++)O[P]=P+1;O[15]=0;
	var ea=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,fa=Object.prototype.hasOwnProperty,ha={},ia={};
	function ja(a){if(fa.call(ia,a))return!0;if(fa.call(ha,a))return!1;if(ea.test(a))return ia[a]=!0;ha[a]=!0;return!1}function ka(a,b,e,c){if(null!==e&&0===e.type)return!1;switch(typeof b){case "function":case "symbol":return!0;case "boolean":if(c)return!1;if(null!==e)return!e.acceptsBooleans;a=a.toLowerCase().slice(0,5);return"data-"!==a&&"aria-"!==a;default:return!1}}
	function la(a,b,e,c){if(null===b||"undefined"===typeof b||ka(a,b,e,c))return!0;if(c)return!1;if(null!==e)switch(e.type){case 3:return!b;case 4:return!1===b;case 5:return isNaN(b);case 6:return isNaN(b)||1>b}return!1}function Q(a,b,e,c,g){this.acceptsBooleans=2===b||3===b||4===b;this.attributeName=c;this.attributeNamespace=g;this.mustUseProperty=e;this.propertyName=a;this.type=b}var R={};
	"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a){R[a]=new Q(a,0,!1,a,null)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(a){var b=a[0];R[b]=new Q(b,1,!1,a[1],null)});["contentEditable","draggable","spellCheck","value"].forEach(function(a){R[a]=new Q(a,2,!1,a.toLowerCase(),null)});
	["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(a){R[a]=new Q(a,2,!1,a,null)});"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a){R[a]=new Q(a,3,!1,a.toLowerCase(),null)});["checked","multiple","muted","selected"].forEach(function(a){R[a]=new Q(a,3,!0,a,null)});
	["capture","download"].forEach(function(a){R[a]=new Q(a,4,!1,a,null)});["cols","rows","size","span"].forEach(function(a){R[a]=new Q(a,6,!1,a,null)});["rowSpan","start"].forEach(function(a){R[a]=new Q(a,5,!1,a.toLowerCase(),null)});var S=/[\-:]([a-z])/g;function T(a){return a[1].toUpperCase()}
	"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a){var b=a.replace(S,
	T);R[b]=new Q(b,1,!1,a,null)});"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a){var b=a.replace(S,T);R[b]=new Q(b,1,!1,a,"http://www.w3.org/1999/xlink")});["xml:base","xml:lang","xml:space"].forEach(function(a){var b=a.replace(S,T);R[b]=new Q(b,1,!1,a,"http://www.w3.org/XML/1998/namespace")});R.tabIndex=new Q("tabIndex",1,!1,"tabindex",null);var ma=/["'&<>]/;
	function U(a){if("boolean"===typeof a||"number"===typeof a)return""+a;a=""+a;var b=ma.exec(a);if(b){var e="",c,g=0;for(c=b.index;c<a.length;c++){switch(a.charCodeAt(c)){case 34:b="&quot;";break;case 38:b="&amp;";break;case 39:b="&#x27;";break;case 60:b="&lt;";break;case 62:b="&gt;";break;default:continue}g!==c&&(e+=a.substring(g,c));g=c+1;e+=b}a=g!==c?e+a.substring(g,c):e}return a}var na=!1;function oa(a,b,e,c){for(;na;)na=!1,e=a(b,c);return e}
	var V=0,pa={readContext:function(a){var b=V;N(a,b);return a[b]}},qa={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function ra(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}
	var sa={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},ta=p({menuitem:!0},sa),W={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,
	gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},ua=["Webkit","ms","Moz","O"];Object.keys(W).forEach(function(a){ua.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);W[b]=W[a]})});
	var va=/([A-Z])/g,wa=/^ms-/,X=q.Children.toArray,Y=ba.ReactCurrentOwner,xa={listing:!0,pre:!0,textarea:!0},ya=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,za={},Z={};function Aa(a){if(void 0===a||null===a)return a;var b="";q.Children.forEach(a,function(a){null!=a&&(b+=a)});return b}var Ba=Object.prototype.hasOwnProperty,Ca={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null,suppressHydrationWarning:null};function Da(a,b){void 0===a&&u("152",M(b)||"Component")}
	function Ea(a,b,e){function c(g,c){var d=da(c,b,e),f=[],h=!1,l={isMounted:function(){return!1},enqueueForceUpdate:function(){if(null===f)return null},enqueueReplaceState:function(a,b){h=!0;f=[b]},enqueueSetState:function(a,b){if(null===f)return null;f.push(b)}},k=void 0;if(c.prototype&&c.prototype.isReactComponent){if(k=new c(g.props,d,l),"function"===typeof c.getDerivedStateFromProps){var r=c.getDerivedStateFromProps.call(null,g.props,k.state);null!=r&&(k.state=p({},k.state,r))}}else if(k=c(g.props,
	d,l),k=oa(c,g.props,k,d),null==k||null==k.render){a=k;Da(a,c);return}k.props=g.props;k.context=d;k.updater=l;l=k.state;void 0===l&&(k.state=l=null);if("function"===typeof k.UNSAFE_componentWillMount||"function"===typeof k.componentWillMount)if("function"===typeof k.componentWillMount&&"function"!==typeof c.getDerivedStateFromProps&&k.componentWillMount(),"function"===typeof k.UNSAFE_componentWillMount&&"function"!==typeof c.getDerivedStateFromProps&&k.UNSAFE_componentWillMount(),f.length){l=f;var m=
	h;f=null;h=!1;if(m&&1===l.length)k.state=l[0];else{r=m?l[0]:k.state;var t=!0;for(m=m?1:0;m<l.length;m++){var v=l[m];v="function"===typeof v?v.call(k,r,g.props,d):v;null!=v&&(t?(t=!1,r=p({},r,v)):p(r,v))}k.state=r}}else f=null;a=k.render();Da(a,c);g=void 0;if("function"===typeof k.getChildContext&&(d=c.childContextTypes,"object"===typeof d)){g=k.getChildContext();for(var K in g)K in d?void 0:u("108",M(c)||"Unknown",K)}g&&(b=p({},b,g))}for(;q.isValidElement(a);){var g=a,d=g.type;if("function"!==typeof d)break;
	c(g,d)}return{child:a,context:b}}
	var Fa=function(){function a(b,e){if(!(this instanceof a))throw new TypeError("Cannot call a class as a function");q.isValidElement(b)?b.type!==z?b=[b]:(b=b.props.children,b=q.isValidElement(b)?[b]:X(b)):b=X(b);b={type:null,domNamespace:qa.html,children:b,childIndex:0,context:ca,footer:""};var c=O[0];if(0===c){var g=O;c=g.length;var d=2*c;65536>=d?void 0:u("304");var h=new Uint16Array(d);h.set(g);O=h;O[0]=c+1;for(g=c;g<d-1;g++)O[g]=g+1;O[d-1]=0}else O[0]=O[c];this.threadID=c;this.stack=[b];this.exhausted=
	!1;this.currentSelectValue=null;this.previousWasTextNode=!1;this.makeStaticMarkup=e;this.suspenseDepth=0;this.contextIndex=-1;this.contextStack=[];this.contextValueStack=[]}a.prototype.destroy=function(){if(!this.exhausted){this.exhausted=!0;var a=this.threadID;O[a]=O[0];O[0]=a}};a.prototype.pushProvider=function(a){var b=++this.contextIndex,c=a.type._context,g=this.threadID;N(c,g);var d=c[g];this.contextStack[b]=c;this.contextValueStack[b]=d;c[g]=a.props.value};a.prototype.popProvider=function(){var a=
	this.contextIndex,e=this.contextStack[a],c=this.contextValueStack[a];this.contextStack[a]=null;this.contextValueStack[a]=null;this.contextIndex--;e[this.threadID]=c};a.prototype.read=function(a){if(this.exhausted)return null;var b=V;V=this.threadID;var c=Y.currentDispatcher;Y.currentDispatcher=pa;try{for(var g=[""],d=!1;g[0].length<a;){if(0===this.stack.length){this.exhausted=!0;var h=this.threadID;O[h]=O[0];O[0]=h;break}var f=this.stack[this.stack.length-1];if(d||f.childIndex>=f.children.length){var B=
	f.footer;""!==B&&(this.previousWasTextNode=!1);this.stack.pop();if("select"===f.type)this.currentSelectValue=null;else if(null!=f.type&&null!=f.type.type&&f.type.type.$$typeof===E)this.popProvider(f.type);else if(f.type===I){this.suspenseDepth--;var A=g.pop();if(d){d=!1;var n=f.fallbackFrame;n?void 0:u("303");this.stack.push(n);continue}else g[this.suspenseDepth]+=A}g[this.suspenseDepth]+=B}else{var l=f.children[f.childIndex++],k="";try{k+=this.render(l,f.context,f.domNamespace)}catch(r){throw r;
	}finally{}g.length<=this.suspenseDepth&&g.push("");g[this.suspenseDepth]+=k}}return g[0]}finally{Y.currentDispatcher=c,V=b}};a.prototype.render=function(a,e,c){if("string"===typeof a||"number"===typeof a){c=""+a;if(""===c)return"";if(this.makeStaticMarkup)return U(c);if(this.previousWasTextNode)return"\x3c!-- --\x3e"+U(c);this.previousWasTextNode=!0;return U(c)}e=Ea(a,e,this.threadID);a=e.child;e=e.context;if(null===a||!1===a)return"";if(!q.isValidElement(a)){if(null!=a&&null!=a.$$typeof){var b=a.$$typeof;
	b===y?u("257"):void 0;u("258",b.toString())}a=X(a);this.stack.push({type:null,domNamespace:c,children:a,childIndex:0,context:e,footer:""});return""}b=a.type;if("string"===typeof b)return this.renderDOM(a,e,c);switch(b){case C:case G:case D:case z:return a=X(a.props.children),this.stack.push({type:null,domNamespace:c,children:a,childIndex:0,context:e,footer:""}),"";case I:u("294")}if("object"===typeof b&&null!==b)switch(b.$$typeof){case H:var d=b.render(a.props,a.ref);d=oa(b.render,a.props,d,a.ref);
	d=X(d);this.stack.push({type:null,domNamespace:c,children:d,childIndex:0,context:e,footer:""});return"";case J:return a=[q.createElement(b.type,p({ref:a.ref},a.props))],this.stack.push({type:null,domNamespace:c,children:a,childIndex:0,context:e,footer:""}),"";case E:return b=X(a.props.children),c={type:a,domNamespace:c,children:b,childIndex:0,context:e,footer:""},this.pushProvider(a),this.stack.push(c),"";case F:b=a.type;d=a.props;var h=this.threadID;N(b,h);b=X(d.children(b[h]));this.stack.push({type:a,
	domNamespace:c,children:b,childIndex:0,context:e,footer:""});return"";case L:u("295")}u("130",null==b?b:typeof b,"")};a.prototype.renderDOM=function(a,e,c){var b=a.type.toLowerCase();c===qa.html&&ra(b);za.hasOwnProperty(b)||(ya.test(b)?void 0:u("65",b),za[b]=!0);var d=a.props;if("input"===b)d=p({type:void 0},d,{defaultChecked:void 0,defaultValue:void 0,value:null!=d.value?d.value:d.defaultValue,checked:null!=d.checked?d.checked:d.defaultChecked});else if("textarea"===b){var h=d.value;if(null==h){h=
	d.defaultValue;var f=d.children;null!=f&&(null!=h?u("92"):void 0,Array.isArray(f)&&(1>=f.length?void 0:u("93"),f=f[0]),h=""+f);null==h&&(h="")}d=p({},d,{value:void 0,children:""+h})}else if("select"===b)this.currentSelectValue=null!=d.value?d.value:d.defaultValue,d=p({},d,{value:void 0});else if("option"===b){f=this.currentSelectValue;var B=Aa(d.children);if(null!=f){var A=null!=d.value?d.value+"":B;h=!1;if(Array.isArray(f))for(var n=0;n<f.length;n++){if(""+f[n]===A){h=!0;break}}else h=""+f===A;d=
	p({selected:void 0,children:void 0},d,{selected:h,children:B})}}if(h=d)ta[b]&&(null!=h.children||null!=h.dangerouslySetInnerHTML?u("137",b,""):void 0),null!=h.dangerouslySetInnerHTML&&(null!=h.children?u("60"):void 0,"object"===typeof h.dangerouslySetInnerHTML&&"__html"in h.dangerouslySetInnerHTML?void 0:u("61")),null!=h.style&&"object"!==typeof h.style?u("62",""):void 0;h=d;f=this.makeStaticMarkup;B=1===this.stack.length;A="<"+a.type;for(x in h)if(Ba.call(h,x)){var l=h[x];if(null!=l){if("style"===
	x){n=void 0;var k="",r="";for(n in l)if(l.hasOwnProperty(n)){var m=0===n.indexOf("--"),t=l[n];if(null!=t){var v=n;if(Z.hasOwnProperty(v))v=Z[v];else{var K=v.replace(va,"-$1").toLowerCase().replace(wa,"-ms-");v=Z[v]=K}k+=r+v+":";r=n;m=null==t||"boolean"===typeof t||""===t?"":m||"number"!==typeof t||0===t||W.hasOwnProperty(r)&&W[r]?(""+t).trim():t+"px";k+=m;r=";"}}l=k||null}n=null;b:if(m=b,t=h,-1===m.indexOf("-"))m="string"===typeof t.is;else switch(m){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":m=
	!1;break b;default:m=!0}if(m)Ca.hasOwnProperty(x)||(n=x,n=ja(n)&&null!=l?n+"="+('"'+U(l)+'"'):"");else{m=x;n=l;l=R.hasOwnProperty(m)?R[m]:null;if(t="style"!==m)t=null!==l?0===l.type:!(2<m.length)||"o"!==m[0]&&"O"!==m[0]||"n"!==m[1]&&"N"!==m[1]?!1:!0;t||la(m,n,l,!1)?n="":null!==l?(m=l.attributeName,l=l.type,n=3===l||4===l&&!0===n?m+'=""':m+"="+('"'+U(n)+'"')):n=ja(m)?m+"="+('"'+U(n)+'"'):""}n&&(A+=" "+n)}}f||B&&(A+=' data-reactroot=""');var x=A;h="";sa.hasOwnProperty(b)?x+="/>":(x+=">",h="</"+a.type+
	">");a:{f=d.dangerouslySetInnerHTML;if(null!=f){if(null!=f.__html){f=f.__html;break a}}else if(f=d.children,"string"===typeof f||"number"===typeof f){f=U(f);break a}f=null}null!=f?(d=[],xa[b]&&"\n"===f.charAt(0)&&(x+="\n"),x+=f):d=X(d.children);a=a.type;c=null==c||"http://www.w3.org/1999/xhtml"===c?ra(a):"http://www.w3.org/2000/svg"===c&&"foreignObject"===a?"http://www.w3.org/1999/xhtml":c;this.stack.push({domNamespace:c,type:b,children:d,childIndex:0,context:e,footer:h});this.previousWasTextNode=
	!1;return x};return a}(),Ga={renderToString:function(a){a=new Fa(a,!1);try{return a.read(Infinity)}finally{a.destroy()}},renderToStaticMarkup:function(a){a=new Fa(a,!0);try{return a.read(Infinity)}finally{a.destroy()}},renderToNodeStream:function(){u("207")},renderToStaticNodeStream:function(){u("208")},version:"16.7.0"},Ha={default:Ga},Ia=Ha&&Ga||Ha;module.exports=Ia.default||Ia;


/***/ }),
/* 20 */
/*!**********************************************!*\
  !*** ./~/react-dom/~/object-assign/index.js ***!
  \**********************************************/
/***/ (function(module, exports) {

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
			}
	
			// Detect buggy property enumeration order in older V8 versions.
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}
	
			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
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


/***/ }),
/* 21 */
/*!*****************************************************************!*\
  !*** ./~/react-dom/cjs/react-dom-server.browser.development.js ***!
  \*****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/** @license React v16.7.0
	 * react-dom-server.browser.development.js
	 *
	 * Copyright (c) Facebook, Inc. and its affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	
	'use strict';
	
	
	
	if (process.env.NODE_ENV !== "production") {
	  (function() {
	'use strict';
	
	var _assign = __webpack_require__(/*! object-assign */ 20);
	var React = __webpack_require__(/*! react */ 2);
	var checkPropTypes = __webpack_require__(/*! prop-types/checkPropTypes */ 8);
	
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
	
	var validateFormat = function () {};
	
	{
	  validateFormat = function (format) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  };
	}
	
	function invariant(condition, format, a, b, c, d, e, f) {
	  validateFormat(format);
	
	  if (!condition) {
	    var error = void 0;
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
	
	// Relying on the `invariant()` implementation lets us
	// preserve the format and params in the www builds.
	
	// TODO: this is special because it gets imported during build.
	
	var ReactVersion = '16.7.0';
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warningWithoutStack = function () {};
	
	{
	  warningWithoutStack = function (condition, format) {
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }
	
	    if (format === undefined) {
	      throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
	    }
	    if (args.length > 8) {
	      // Check before the condition to catch violations early.
	      throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
	    }
	    if (condition) {
	      return;
	    }
	    if (typeof console !== 'undefined') {
	      var argsWithFormat = args.map(function (item) {
	        return '' + item;
	      });
	      argsWithFormat.unshift('Warning: ' + format);
	
	      // We intentionally don't use spread (or .apply) directly because it
	      // breaks IE9: https://github.com/facebook/react/issues/13610
	      Function.prototype.apply.call(console.error, console, argsWithFormat);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      var argIndex = 0;
	      var message = 'Warning: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      });
	      throw new Error(message);
	    } catch (x) {}
	  };
	}
	
	var warningWithoutStack$1 = warningWithoutStack;
	
	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var hasSymbol = typeof Symbol === 'function' && Symbol.for;
	
	
	var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
	
	var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
	
	var Resolved = 1;
	
	
	function refineResolvedLazyComponent(lazyComponent) {
	  return lazyComponent._status === Resolved ? lazyComponent._result : null;
	}
	
	function getWrappedName(outerType, innerType, wrapperName) {
	  var functionName = innerType.displayName || innerType.name || '';
	  return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
	}
	
	function getComponentName(type) {
	  if (type == null) {
	    // Host root, text node or just invalid type.
	    return null;
	  }
	  {
	    if (typeof type.tag === 'number') {
	      warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
	    }
	  }
	  if (typeof type === 'function') {
	    return type.displayName || type.name || null;
	  }
	  if (typeof type === 'string') {
	    return type;
	  }
	  switch (type) {
	    case REACT_CONCURRENT_MODE_TYPE:
	      return 'ConcurrentMode';
	    case REACT_FRAGMENT_TYPE:
	      return 'Fragment';
	    case REACT_PORTAL_TYPE:
	      return 'Portal';
	    case REACT_PROFILER_TYPE:
	      return 'Profiler';
	    case REACT_STRICT_MODE_TYPE:
	      return 'StrictMode';
	    case REACT_SUSPENSE_TYPE:
	      return 'Suspense';
	  }
	  if (typeof type === 'object') {
	    switch (type.$$typeof) {
	      case REACT_CONTEXT_TYPE:
	        return 'Context.Consumer';
	      case REACT_PROVIDER_TYPE:
	        return 'Context.Provider';
	      case REACT_FORWARD_REF_TYPE:
	        return getWrappedName(type, type.render, 'ForwardRef');
	      case REACT_MEMO_TYPE:
	        return getComponentName(type.type);
	      case REACT_LAZY_TYPE:
	        {
	          var thenable = type;
	          var resolvedThenable = refineResolvedLazyComponent(thenable);
	          if (resolvedThenable) {
	            return getComponentName(resolvedThenable);
	          }
	        }
	    }
	  }
	  return null;
	}
	
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
	      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
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
	
	var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
	
	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */
	
	var warning = warningWithoutStack$1;
	
	{
	  warning = function (condition, format) {
	    if (condition) {
	      return;
	    }
	    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
	    var stack = ReactDebugCurrentFrame.getStackAddendum();
	    // eslint-disable-next-line react-internal/warning-and-invariant-args
	
	    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	      args[_key - 2] = arguments[_key];
	    }
	
	    warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
	  };
	}
	
	var warning$1 = warning;
	
	var BEFORE_SLASH_RE = /^(.*)[\\\/]/;
	
	var describeComponentFrame = function (name, source, ownerName) {
	  var sourceInfo = '';
	  if (source) {
	    var path = source.fileName;
	    var fileName = path.replace(BEFORE_SLASH_RE, '');
	    {
	      // In DEV, include code for a common special case:
	      // prefer "folder/index.js" instead of just "index.js".
	      if (/^index\./.test(fileName)) {
	        var match = path.match(BEFORE_SLASH_RE);
	        if (match) {
	          var pathBeforeSlash = match[1];
	          if (pathBeforeSlash) {
	            var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
	            fileName = folderName + '/' + fileName;
	          }
	        }
	      }
	    }
	    sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
	  } else if (ownerName) {
	    sourceInfo = ' (created by ' + ownerName + ')';
	  }
	  return '\n    in ' + (name || 'Unknown') + sourceInfo;
	};
	
	var enableHooks = false;
	// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:
	
	
	// In some cases, StrictMode should also double-render lifecycles.
	// This can be confusing for tests though,
	// And it can be bad for performance in production.
	// This feature flag can be used to control the behavior:
	
	
	// To preserve the "Pause on caught exceptions" behavior of the debugger, we
	// replay the begin phase of a failed component inside invokeGuardedCallback.
	
	
	// Warn about deprecated, async-unsafe lifecycles; relates to RFC #6:
	var warnAboutDeprecatedLifecycles = false;
	
	// Gather advanced timing metrics for Profiler subtrees.
	
	
	// Trace which interactions trigger each commit.
	
	
	// Only used in www builds.
	var enableSuspenseServerRenderer = false; // TODO: true? Here it might just be false.
	
	// Only used in www builds.
	
	
	// Only used in www builds.
	
	
	// React Fire: prevent the value and checked attributes from syncing
	// with their related DOM properties
	
	
	// These APIs will no longer be "unstable" in the upcoming 16.7 release,
	// Control this behavior with a flag to support 16.6 minor releases in the meanwhile.
	
	var ReactDebugCurrentFrame$1 = void 0;
	{
	  ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
	}
	
	var didWarnAboutInvalidateContextType = {};
	
	var emptyObject = {};
	{
	  Object.freeze(emptyObject);
	}
	
	function maskContext(type, context) {
	  var contextTypes = type.contextTypes;
	  if (!contextTypes) {
	    return emptyObject;
	  }
	  var maskedContext = {};
	  for (var contextName in contextTypes) {
	    maskedContext[contextName] = context[contextName];
	  }
	  return maskedContext;
	}
	
	function checkContextTypes(typeSpecs, values, location) {
	  {
	    checkPropTypes(typeSpecs, values, location, 'Component', ReactDebugCurrentFrame$1.getCurrentStack);
	  }
	}
	
	function validateContextBounds(context, threadID) {
	  // If we don't have enough slots in this context to store this threadID,
	  // fill it in without leaving any holes to ensure that the VM optimizes
	  // this as non-holey index properties.
	  // (Note: If `react` package is < 16.6, _threadCount is undefined.)
	  for (var i = context._threadCount | 0; i <= threadID; i++) {
	    // We assume that this is the same as the defaultValue which might not be
	    // true if we're rendering inside a secondary renderer but they are
	    // secondary because these use cases are very rare.
	    context[i] = context._currentValue2;
	    context._threadCount = i + 1;
	  }
	}
	
	function processContext(type, context, threadID) {
	  var contextType = type.contextType;
	  if (typeof contextType === 'object' && contextType !== null) {
	    {
	      if (contextType.$$typeof !== REACT_CONTEXT_TYPE) {
	        var name = getComponentName(type) || 'Component';
	        if (!didWarnAboutInvalidateContextType[name]) {
	          didWarnAboutInvalidateContextType[name] = true;
	          warningWithoutStack$1(false, '%s defines an invalid contextType. ' + 'contextType should point to the Context object returned by React.createContext(). ' + 'Did you accidentally pass the Context.Provider instead?', name);
	        }
	      }
	    }
	    validateContextBounds(contextType, threadID);
	    return contextType[threadID];
	  } else {
	    var maskedContext = maskContext(type, context);
	    {
	      if (type.contextTypes) {
	        checkContextTypes(type.contextTypes, maskedContext, 'context');
	      }
	    }
	    return maskedContext;
	  }
	}
	
	// Allocates a new index for each request. Tries to stay as compact as possible so that these
	// indices can be used to reference a tightly packaged array. As opposed to being used in a Map.
	// The first allocated index is 1.
	
	var nextAvailableThreadIDs = new Uint16Array(16);
	for (var i = 0; i < 15; i++) {
	  nextAvailableThreadIDs[i] = i + 1;
	}
	nextAvailableThreadIDs[15] = 0;
	
	function growThreadCountAndReturnNextAvailable() {
	  var oldArray = nextAvailableThreadIDs;
	  var oldSize = oldArray.length;
	  var newSize = oldSize * 2;
	  !(newSize <= 0x10000) ? invariant(false, 'Maximum number of concurrent React renderers exceeded. This can happen if you are not properly destroying the Readable provided by React. Ensure that you call .destroy() on it if you no longer want to read from it, and did not read to the end. If you use .pipe() this should be automatic.') : void 0;
	  var newArray = new Uint16Array(newSize);
	  newArray.set(oldArray);
	  nextAvailableThreadIDs = newArray;
	  nextAvailableThreadIDs[0] = oldSize + 1;
	  for (var _i = oldSize; _i < newSize - 1; _i++) {
	    nextAvailableThreadIDs[_i] = _i + 1;
	  }
	  nextAvailableThreadIDs[newSize - 1] = 0;
	  return oldSize;
	}
	
	function allocThreadID() {
	  var nextID = nextAvailableThreadIDs[0];
	  if (nextID === 0) {
	    return growThreadCountAndReturnNextAvailable();
	  }
	  nextAvailableThreadIDs[0] = nextAvailableThreadIDs[nextID];
	  return nextID;
	}
	
	function freeThreadID(id) {
	  nextAvailableThreadIDs[id] = nextAvailableThreadIDs[0];
	  nextAvailableThreadIDs[0] = id;
	}
	
	// A reserved attribute.
	// It is handled by React separately and shouldn't be written to the DOM.
	var RESERVED = 0;
	
	// A simple string attribute.
	// Attributes that aren't in the whitelist are presumed to have this type.
	var STRING = 1;
	
	// A string attribute that accepts booleans in React. In HTML, these are called
	// "enumerated" attributes with "true" and "false" as possible values.
	// When true, it should be set to a "true" string.
	// When false, it should be set to a "false" string.
	var BOOLEANISH_STRING = 2;
	
	// A real boolean attribute.
	// When true, it should be present (set either to an empty string or its name).
	// When false, it should be omitted.
	var BOOLEAN = 3;
	
	// An attribute that can be used as a flag as well as with a value.
	// When true, it should be present (set either to an empty string or its name).
	// When false, it should be omitted.
	// For any other value, should be present with that value.
	var OVERLOADED_BOOLEAN = 4;
	
	// An attribute that must be numeric or parse as a numeric.
	// When falsy, it should be removed.
	var NUMERIC = 5;
	
	// An attribute that must be positive numeric or parse as a positive numeric.
	// When falsy, it should be removed.
	var POSITIVE_NUMERIC = 6;
	
	/* eslint-disable max-len */
	var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
	/* eslint-enable max-len */
	var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
	
	
	var ROOT_ATTRIBUTE_NAME = 'data-reactroot';
	var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
	
	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	var illegalAttributeNameCache = {};
	var validatedAttributeNameCache = {};
	
	function isAttributeNameSafe(attributeName) {
	  if (hasOwnProperty$1.call(validatedAttributeNameCache, attributeName)) {
	    return true;
	  }
	  if (hasOwnProperty$1.call(illegalAttributeNameCache, attributeName)) {
	    return false;
	  }
	  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
	    validatedAttributeNameCache[attributeName] = true;
	    return true;
	  }
	  illegalAttributeNameCache[attributeName] = true;
	  {
	    warning$1(false, 'Invalid attribute name: `%s`', attributeName);
	  }
	  return false;
	}
	
	function shouldIgnoreAttribute(name, propertyInfo, isCustomComponentTag) {
	  if (propertyInfo !== null) {
	    return propertyInfo.type === RESERVED;
	  }
	  if (isCustomComponentTag) {
	    return false;
	  }
	  if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
	    return true;
	  }
	  return false;
	}
	
	function shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag) {
	  if (propertyInfo !== null && propertyInfo.type === RESERVED) {
	    return false;
	  }
	  switch (typeof value) {
	    case 'function':
	    // $FlowIssue symbol is perfectly valid here
	    case 'symbol':
	      // eslint-disable-line
	      return true;
	    case 'boolean':
	      {
	        if (isCustomComponentTag) {
	          return false;
	        }
	        if (propertyInfo !== null) {
	          return !propertyInfo.acceptsBooleans;
	        } else {
	          var prefix = name.toLowerCase().slice(0, 5);
	          return prefix !== 'data-' && prefix !== 'aria-';
	        }
	      }
	    default:
	      return false;
	  }
	}
	
	function shouldRemoveAttribute(name, value, propertyInfo, isCustomComponentTag) {
	  if (value === null || typeof value === 'undefined') {
	    return true;
	  }
	  if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, isCustomComponentTag)) {
	    return true;
	  }
	  if (isCustomComponentTag) {
	    return false;
	  }
	  if (propertyInfo !== null) {
	    switch (propertyInfo.type) {
	      case BOOLEAN:
	        return !value;
	      case OVERLOADED_BOOLEAN:
	        return value === false;
	      case NUMERIC:
	        return isNaN(value);
	      case POSITIVE_NUMERIC:
	        return isNaN(value) || value < 1;
	    }
	  }
	  return false;
	}
	
	function getPropertyInfo(name) {
	  return properties.hasOwnProperty(name) ? properties[name] : null;
	}
	
	function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace) {
	  this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
	  this.attributeName = attributeName;
	  this.attributeNamespace = attributeNamespace;
	  this.mustUseProperty = mustUseProperty;
	  this.propertyName = name;
	  this.type = type;
	}
	
	// When adding attributes to this list, be sure to also add them to
	// the `possibleStandardNames` module to ensure casing and incorrect
	// name warnings.
	var properties = {};
	
	// These props are reserved by React. They shouldn't be written to the DOM.
	['children', 'dangerouslySetInnerHTML',
	// TODO: This prevents the assignment of defaultValue to regular
	// elements (not just inputs). Now that ReactDOMInput assigns to the
	// defaultValue property -- do we need this?
	'defaultValue', 'defaultChecked', 'innerHTML', 'suppressContentEditableWarning', 'suppressHydrationWarning', 'style'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, RESERVED, false, // mustUseProperty
	  name, // attributeName
	  null);
	} // attributeNamespace
	);
	
	// A few React string attributes have a different name.
	// This is a mapping from React prop names to the attribute names.
	[['acceptCharset', 'accept-charset'], ['className', 'class'], ['htmlFor', 'for'], ['httpEquiv', 'http-equiv']].forEach(function (_ref) {
	  var name = _ref[0],
	      attributeName = _ref[1];
	
	  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
	  attributeName, // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are "enumerated" HTML attributes that accept "true" and "false".
	// In React, we let users pass `true` and `false` even though technically
	// these aren't boolean attributes (they are coerced to strings).
	['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
	  name.toLowerCase(), // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are "enumerated" SVG attributes that accept "true" and "false".
	// In React, we let users pass `true` and `false` even though technically
	// these aren't boolean attributes (they are coerced to strings).
	// Since these are SVG attributes, their attribute names are case-sensitive.
	['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, BOOLEANISH_STRING, false, // mustUseProperty
	  name, // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are HTML boolean attributes.
	['allowFullScreen', 'async',
	// Note: there is a special case that prevents it from being written to the DOM
	// on the client side because the browsers are inconsistent. Instead we call focus().
	'autoFocus', 'autoPlay', 'controls', 'default', 'defer', 'disabled', 'formNoValidate', 'hidden', 'loop', 'noModule', 'noValidate', 'open', 'playsInline', 'readOnly', 'required', 'reversed', 'scoped', 'seamless',
	// Microdata
	'itemScope'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, BOOLEAN, false, // mustUseProperty
	  name.toLowerCase(), // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are the few React props that we set as DOM properties
	// rather than attributes. These are all booleans.
	['checked',
	// Note: `option.selected` is not updated if `select.multiple` is
	// disabled with `removeAttribute`. We have special logic for handling this.
	'multiple', 'muted', 'selected'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, BOOLEAN, true, // mustUseProperty
	  name, // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are HTML attributes that are "overloaded booleans": they behave like
	// booleans, but can also accept a string value.
	['capture', 'download'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, OVERLOADED_BOOLEAN, false, // mustUseProperty
	  name, // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are HTML attributes that must be positive numbers.
	['cols', 'rows', 'size', 'span'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, POSITIVE_NUMERIC, false, // mustUseProperty
	  name, // attributeName
	  null);
	} // attributeNamespace
	);
	
	// These are HTML attributes that must be numbers.
	['rowSpan', 'start'].forEach(function (name) {
	  properties[name] = new PropertyInfoRecord(name, NUMERIC, false, // mustUseProperty
	  name.toLowerCase(), // attributeName
	  null);
	} // attributeNamespace
	);
	
	var CAMELIZE = /[\-\:]([a-z])/g;
	var capitalize = function (token) {
	  return token[1].toUpperCase();
	};
	
	// This is a list of all SVG attributes that need special casing, namespacing,
	// or boolean value assignment. Regular attributes that just accept strings
	// and have the same names are omitted, just like in the HTML whitelist.
	// Some of these attributes can be hard to find. This list was created by
	// scrapping the MDN documentation.
	['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'xmlns:xlink', 'x-height'].forEach(function (attributeName) {
	  var name = attributeName.replace(CAMELIZE, capitalize);
	  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
	  attributeName, null);
	} // attributeNamespace
	);
	
	// String SVG attributes with the xlink namespace.
	['xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type'].forEach(function (attributeName) {
	  var name = attributeName.replace(CAMELIZE, capitalize);
	  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
	  attributeName, 'http://www.w3.org/1999/xlink');
	});
	
	// String SVG attributes with the xml namespace.
	['xml:base', 'xml:lang', 'xml:space'].forEach(function (attributeName) {
	  var name = attributeName.replace(CAMELIZE, capitalize);
	  properties[name] = new PropertyInfoRecord(name, STRING, false, // mustUseProperty
	  attributeName, 'http://www.w3.org/XML/1998/namespace');
	});
	
	// Special case: this attribute exists both in HTML and SVG.
	// Its "tabindex" attribute name is case-sensitive in SVG so we can't just use
	// its React `tabIndex` name, like we do for attributes that exist only in HTML.
	properties.tabIndex = new PropertyInfoRecord('tabIndex', STRING, false, // mustUseProperty
	'tabindex', // attributeName
	null);
	
	// code copied and modified from escape-html
	/**
	 * Module variables.
	 * @private
	 */
	
	var matchHtmlRegExp = /["'&<>]/;
	
	/**
	 * Escapes special characters and HTML entities in a given html string.
	 *
	 * @param  {string} string HTML string to escape for later insertion
	 * @return {string}
	 * @public
	 */
	
	function escapeHtml(string) {
	  var str = '' + string;
	  var match = matchHtmlRegExp.exec(str);
	
	  if (!match) {
	    return str;
	  }
	
	  var escape = void 0;
	  var html = '';
	  var index = void 0;
	  var lastIndex = 0;
	
	  for (index = match.index; index < str.length; index++) {
	    switch (str.charCodeAt(index)) {
	      case 34:
	        // "
	        escape = '&quot;';
	        break;
	      case 38:
	        // &
	        escape = '&amp;';
	        break;
	      case 39:
	        // '
	        escape = '&#x27;'; // modified from escape-html; used to be '&#39'
	        break;
	      case 60:
	        // <
	        escape = '&lt;';
	        break;
	      case 62:
	        // >
	        escape = '&gt;';
	        break;
	      default:
	        continue;
	    }
	
	    if (lastIndex !== index) {
	      html += str.substring(lastIndex, index);
	    }
	
	    lastIndex = index + 1;
	    html += escape;
	  }
	
	  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
	}
	// end code copied and modified from escape-html
	
	/**
	 * Escapes text to prevent scripting attacks.
	 *
	 * @param {*} text Text value to escape.
	 * @return {string} An escaped string.
	 */
	function escapeTextForBrowser(text) {
	  if (typeof text === 'boolean' || typeof text === 'number') {
	    // this shortcircuit helps perf for types that we know will never have
	    // special characters, especially given that this function is used often
	    // for numeric dom ids.
	    return '' + text;
	  }
	  return escapeHtml(text);
	}
	
	/**
	 * Escapes attribute value to prevent scripting attacks.
	 *
	 * @param {*} value Value to escape.
	 * @return {string} An escaped string.
	 */
	function quoteAttributeValueForBrowser(value) {
	  return '"' + escapeTextForBrowser(value) + '"';
	}
	
	/**
	 * Operations for dealing with DOM properties.
	 */
	
	/**
	 * Creates markup for the ID property.
	 *
	 * @param {string} id Unescaped ID.
	 * @return {string} Markup string.
	 */
	
	
	function createMarkupForRoot() {
	  return ROOT_ATTRIBUTE_NAME + '=""';
	}
	
	/**
	 * Creates markup for a property.
	 *
	 * @param {string} name
	 * @param {*} value
	 * @return {?string} Markup string, or null if the property was invalid.
	 */
	function createMarkupForProperty(name, value) {
	  var propertyInfo = getPropertyInfo(name);
	  if (name !== 'style' && shouldIgnoreAttribute(name, propertyInfo, false)) {
	    return '';
	  }
	  if (shouldRemoveAttribute(name, value, propertyInfo, false)) {
	    return '';
	  }
	  if (propertyInfo !== null) {
	    var attributeName = propertyInfo.attributeName;
	    var type = propertyInfo.type;
	
	    if (type === BOOLEAN || type === OVERLOADED_BOOLEAN && value === true) {
	      return attributeName + '=""';
	    } else {
	      return attributeName + '=' + quoteAttributeValueForBrowser(value);
	    }
	  } else if (isAttributeNameSafe(name)) {
	    return name + '=' + quoteAttributeValueForBrowser(value);
	  }
	  return '';
	}
	
	/**
	 * Creates markup for a custom property.
	 *
	 * @param {string} name
	 * @param {*} value
	 * @return {string} Markup string, or empty string if the property was invalid.
	 */
	function createMarkupForCustomAttribute(name, value) {
	  if (!isAttributeNameSafe(name) || value == null) {
	    return '';
	  }
	  return name + '=' + quoteAttributeValueForBrowser(value);
	}
	
	function areHookInputsEqual(arr1, arr2) {
	  // Don't bother comparing lengths in prod because these arrays should be
	  // passed inline.
	  {
	    !(arr1.length === arr2.length) ? warning$1(false, 'Detected a variable number of hook dependencies. The length of the ' + 'dependencies array should be constant between renders.\n\n' + 'Previous: %s\n' + 'Incoming: %s', arr1.join(', '), arr2.join(', ')) : void 0;
	  }
	  for (var i = 0; i < arr1.length; i++) {
	    // Inlined Object.is polyfill.
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	    var val1 = arr1[i];
	    var val2 = arr2[i];
	    if (val1 === val2 && (val1 !== 0 || 1 / val1 === 1 / val2) || val1 !== val1 && val2 !== val2 // eslint-disable-line no-self-compare
	    ) {
	        continue;
	      }
	    return false;
	  }
	  return true;
	}
	
	var currentlyRenderingComponent = null;
	var firstWorkInProgressHook = null;
	var workInProgressHook = null;
	// Whether the work-in-progress hook is a re-rendered hook
	var isReRender = false;
	// Whether an update was scheduled during the currently executing render pass.
	var didScheduleRenderPhaseUpdate = false;
	// Lazily created map of render-phase updates
	var renderPhaseUpdates = null;
	// Counter to prevent infinite loops.
	var numberOfReRenders = 0;
	var RE_RENDER_LIMIT = 25;
	
	function resolveCurrentlyRenderingComponent() {
	  !(currentlyRenderingComponent !== null) ? invariant(false, 'Hooks can only be called inside the body of a function component.') : void 0;
	  return currentlyRenderingComponent;
	}
	
	function createHook() {
	  return {
	    memoizedState: null,
	    queue: null,
	    next: null
	  };
	}
	
	function createWorkInProgressHook() {
	  if (workInProgressHook === null) {
	    // This is the first hook in the list
	    if (firstWorkInProgressHook === null) {
	      isReRender = false;
	      firstWorkInProgressHook = workInProgressHook = createHook();
	    } else {
	      // There's already a work-in-progress. Reuse it.
	      isReRender = true;
	      workInProgressHook = firstWorkInProgressHook;
	    }
	  } else {
	    if (workInProgressHook.next === null) {
	      isReRender = false;
	      // Append to the end of the list
	      workInProgressHook = workInProgressHook.next = createHook();
	    } else {
	      // There's already a work-in-progress. Reuse it.
	      isReRender = true;
	      workInProgressHook = workInProgressHook.next;
	    }
	  }
	  return workInProgressHook;
	}
	
	function prepareToUseHooks(componentIdentity) {
	  currentlyRenderingComponent = componentIdentity;
	
	  // The following should have already been reset
	  // didScheduleRenderPhaseUpdate = false;
	  // firstWorkInProgressHook = null;
	  // numberOfReRenders = 0;
	  // renderPhaseUpdates = null;
	  // workInProgressHook = null;
	}
	
	function finishHooks(Component, props, children, refOrContext) {
	  // This must be called after every function component to prevent hooks from
	  // being used in classes.
	
	  while (didScheduleRenderPhaseUpdate) {
	    // Updates were scheduled during the render phase. They are stored in
	    // the `renderPhaseUpdates` map. Call the component again, reusing the
	    // work-in-progress hooks and applying the additional updates on top. Keep
	    // restarting until no more updates are scheduled.
	    didScheduleRenderPhaseUpdate = false;
	    numberOfReRenders += 1;
	
	    // Start over from the beginning of the list
	    workInProgressHook = null;
	
	    children = Component(props, refOrContext);
	  }
	  currentlyRenderingComponent = null;
	  firstWorkInProgressHook = null;
	  numberOfReRenders = 0;
	  renderPhaseUpdates = null;
	  workInProgressHook = null;
	
	  // These were reset above
	  // currentlyRenderingComponent = null;
	  // didScheduleRenderPhaseUpdate = false;
	  // firstWorkInProgressHook = null;
	  // numberOfReRenders = 0;
	  // renderPhaseUpdates = null;
	  // workInProgressHook = null;
	
	  return children;
	}
	
	function readContext(context, observedBits) {
	  var threadID = currentThreadID;
	  validateContextBounds(context, threadID);
	  return context[threadID];
	}
	
	function useContext(context, observedBits) {
	  resolveCurrentlyRenderingComponent();
	  var threadID = currentThreadID;
	  validateContextBounds(context, threadID);
	  return context[threadID];
	}
	
	function basicStateReducer(state, action) {
	  return typeof action === 'function' ? action(state) : action;
	}
	
	function useState(initialState) {
	  return useReducer(basicStateReducer,
	  // useReducer has a special case to support lazy useState initializers
	  initialState);
	}
	
	function useReducer(reducer, initialState, initialAction) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	  if (isReRender) {
	    // This is a re-render. Apply the new render phase updates to the previous
	    var _queue = workInProgressHook.queue;
	    var _dispatch = _queue.dispatch;
	    if (renderPhaseUpdates !== null) {
	      // Render phase updates are stored in a map of queue -> linked list
	      var firstRenderPhaseUpdate = renderPhaseUpdates.get(_queue);
	      if (firstRenderPhaseUpdate !== undefined) {
	        renderPhaseUpdates.delete(_queue);
	        var newState = workInProgressHook.memoizedState;
	        var update = firstRenderPhaseUpdate;
	        do {
	          // Process this render phase update. We don't have to check the
	          // priority because it will always be the same as the current
	          // render's.
	          var _action = update.action;
	          newState = reducer(newState, _action);
	          update = update.next;
	        } while (update !== null);
	
	        workInProgressHook.memoizedState = newState;
	
	        return [newState, _dispatch];
	      }
	    }
	    return [workInProgressHook.memoizedState, _dispatch];
	  } else {
	    if (reducer === basicStateReducer) {
	      // Special case for `useState`.
	      if (typeof initialState === 'function') {
	        initialState = initialState();
	      }
	    } else if (initialAction !== undefined && initialAction !== null) {
	      initialState = reducer(initialState, initialAction);
	    }
	    workInProgressHook.memoizedState = initialState;
	    var _queue2 = workInProgressHook.queue = {
	      last: null,
	      dispatch: null
	    };
	    var _dispatch2 = _queue2.dispatch = dispatchAction.bind(null, currentlyRenderingComponent, _queue2);
	    return [workInProgressHook.memoizedState, _dispatch2];
	  }
	}
	
	function useMemo(nextCreate, inputs) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	
	  var nextInputs = inputs !== undefined && inputs !== null ? inputs : [nextCreate];
	
	  if (workInProgressHook !== null && workInProgressHook.memoizedState !== null) {
	    var prevState = workInProgressHook.memoizedState;
	    var prevInputs = prevState[1];
	    if (areHookInputsEqual(nextInputs, prevInputs)) {
	      return prevState[0];
	    }
	  }
	
	  var nextValue = nextCreate();
	  workInProgressHook.memoizedState = [nextValue, nextInputs];
	  return nextValue;
	}
	
	function useRef(initialValue) {
	  currentlyRenderingComponent = resolveCurrentlyRenderingComponent();
	  workInProgressHook = createWorkInProgressHook();
	  var previousRef = workInProgressHook.memoizedState;
	  if (previousRef === null) {
	    var ref = { current: initialValue };
	    {
	      Object.seal(ref);
	    }
	    workInProgressHook.memoizedState = ref;
	    return ref;
	  } else {
	    return previousRef;
	  }
	}
	
	function useLayoutEffect(create, inputs) {
	  warning$1(false, 'useLayoutEffect does nothing on the server, because its effect cannot ' + "be encoded into the server renderer's output format. This will lead " + 'to a mismatch between the initial, non-hydrated UI and the intended ' + 'UI. To avoid this, useLayoutEffect should only be used in ' + 'components that render exclusively on the client.');
	}
	
	function dispatchAction(componentIdentity, queue, action) {
	  !(numberOfReRenders < RE_RENDER_LIMIT) ? invariant(false, 'Too many re-renders. React limits the number of renders to prevent an infinite loop.') : void 0;
	
	  if (componentIdentity === currentlyRenderingComponent) {
	    // This is a render phase update. Stash it in a lazily-created map of
	    // queue -> linked list of updates. After this render pass, we'll restart
	    // and apply the stashed updates on top of the work-in-progress hook.
	    didScheduleRenderPhaseUpdate = true;
	    var update = {
	      action: action,
	      next: null
	    };
	    if (renderPhaseUpdates === null) {
	      renderPhaseUpdates = new Map();
	    }
	    var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
	    if (firstRenderPhaseUpdate === undefined) {
	      renderPhaseUpdates.set(queue, update);
	    } else {
	      // Append the update to the end of the list.
	      var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
	      while (lastRenderPhaseUpdate.next !== null) {
	        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
	      }
	      lastRenderPhaseUpdate.next = update;
	    }
	  } else {
	    // This means an update has happened after the function component has
	    // returned. On the server this is a no-op. In React Fiber, the update
	    // would be scheduled for a future render.
	  }
	}
	
	function noop() {}
	function identity(fn) {
	  return fn;
	}
	
	var currentThreadID = 0;
	
	function setCurrentThreadID(threadID) {
	  currentThreadID = threadID;
	}
	
	var Dispatcher = {
	  readContext: readContext,
	  useContext: useContext,
	  useMemo: useMemo,
	  useReducer: useReducer,
	  useRef: useRef,
	  useState: useState,
	  useLayoutEffect: useLayoutEffect,
	  // Callbacks are passed as they are in the server environment.
	  useCallback: identity,
	  // useImperativeMethods is not run in the server environment
	  useImperativeMethods: noop,
	  // Effects are not run in the server environment.
	  useEffect: noop
	};
	var DispatcherWithoutHooks = {
	  readContext: readContext
	};
	
	var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
	var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
	var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
	
	var Namespaces = {
	  html: HTML_NAMESPACE,
	  mathml: MATH_NAMESPACE,
	  svg: SVG_NAMESPACE
	};
	
	// Assumes there is no parent namespace.
	function getIntrinsicNamespace(type) {
	  switch (type) {
	    case 'svg':
	      return SVG_NAMESPACE;
	    case 'math':
	      return MATH_NAMESPACE;
	    default:
	      return HTML_NAMESPACE;
	  }
	}
	
	function getChildNamespace(parentNamespace, type) {
	  if (parentNamespace == null || parentNamespace === HTML_NAMESPACE) {
	    // No (or default) parent namespace: potential entry point.
	    return getIntrinsicNamespace(type);
	  }
	  if (parentNamespace === SVG_NAMESPACE && type === 'foreignObject') {
	    // We're leaving SVG.
	    return HTML_NAMESPACE;
	  }
	  // By default, pass namespace below.
	  return parentNamespace;
	}
	
	var ReactDebugCurrentFrame$2 = null;
	
	var ReactControlledValuePropTypes = {
	  checkPropTypes: null
	};
	
	{
	  ReactDebugCurrentFrame$2 = ReactSharedInternals.ReactDebugCurrentFrame;
	
	  var hasReadOnlyValue = {
	    button: true,
	    checkbox: true,
	    image: true,
	    hidden: true,
	    radio: true,
	    reset: true,
	    submit: true
	  };
	
	  var propTypes = {
	    value: function (props, propName, componentName) {
	      if (hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled || props[propName] == null) {
	        return null;
	      }
	      return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
	    },
	    checked: function (props, propName, componentName) {
	      if (props.onChange || props.readOnly || props.disabled || props[propName] == null) {
	        return null;
	      }
	      return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
	    }
	  };
	
	  /**
	   * Provide a linked `value` attribute for controlled forms. You should not use
	   * this outside of the ReactDOM controlled form components.
	   */
	  ReactControlledValuePropTypes.checkPropTypes = function (tagName, props) {
	    checkPropTypes(propTypes, props, 'prop', tagName, ReactDebugCurrentFrame$2.getStackAddendum);
	  };
	}
	
	// For HTML, certain tags should omit their close tag. We keep a whitelist for
	// those special-case tags.
	
	var omittedCloseTags = {
	  area: true,
	  base: true,
	  br: true,
	  col: true,
	  embed: true,
	  hr: true,
	  img: true,
	  input: true,
	  keygen: true,
	  link: true,
	  meta: true,
	  param: true,
	  source: true,
	  track: true,
	  wbr: true
	  // NOTE: menuitem's close tag should be omitted, but that causes problems.
	};
	
	// For HTML, certain tags cannot have children. This has the same purpose as
	// `omittedCloseTags` except that `menuitem` should still have its closing tag.
	
	var voidElementTags = _assign({
	  menuitem: true
	}, omittedCloseTags);
	
	// TODO: We can remove this if we add invariantWithStack()
	// or add stack by default to invariants where possible.
	var HTML = '__html';
	
	var ReactDebugCurrentFrame$3 = null;
	{
	  ReactDebugCurrentFrame$3 = ReactSharedInternals.ReactDebugCurrentFrame;
	}
	
	function assertValidProps(tag, props) {
	  if (!props) {
	    return;
	  }
	  // Note the use of `==` which checks for null or undefined.
	  if (voidElementTags[tag]) {
	    !(props.children == null && props.dangerouslySetInnerHTML == null) ? invariant(false, '%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s', tag, ReactDebugCurrentFrame$3.getStackAddendum()) : void 0;
	  }
	  if (props.dangerouslySetInnerHTML != null) {
	    !(props.children == null) ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : void 0;
	    !(typeof props.dangerouslySetInnerHTML === 'object' && HTML in props.dangerouslySetInnerHTML) ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.') : void 0;
	  }
	  {
	    !(props.suppressContentEditableWarning || !props.contentEditable || props.children == null) ? warning$1(false, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : void 0;
	  }
	  !(props.style == null || typeof props.style === 'object') ? invariant(false, 'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s', ReactDebugCurrentFrame$3.getStackAddendum()) : void 0;
	}
	
	/**
	 * CSS properties which accept numbers but are not in units of "px".
	 */
	var isUnitlessNumber = {
	  animationIterationCount: true,
	  borderImageOutset: true,
	  borderImageSlice: true,
	  borderImageWidth: true,
	  boxFlex: true,
	  boxFlexGroup: true,
	  boxOrdinalGroup: true,
	  columnCount: true,
	  columns: true,
	  flex: true,
	  flexGrow: true,
	  flexPositive: true,
	  flexShrink: true,
	  flexNegative: true,
	  flexOrder: true,
	  gridArea: true,
	  gridRow: true,
	  gridRowEnd: true,
	  gridRowSpan: true,
	  gridRowStart: true,
	  gridColumn: true,
	  gridColumnEnd: true,
	  gridColumnSpan: true,
	  gridColumnStart: true,
	  fontWeight: true,
	  lineClamp: true,
	  lineHeight: true,
	  opacity: true,
	  order: true,
	  orphans: true,
	  tabSize: true,
	  widows: true,
	  zIndex: true,
	  zoom: true,
	
	  // SVG-related properties
	  fillOpacity: true,
	  floodOpacity: true,
	  stopOpacity: true,
	  strokeDasharray: true,
	  strokeDashoffset: true,
	  strokeMiterlimit: true,
	  strokeOpacity: true,
	  strokeWidth: true
	};
	
	/**
	 * @param {string} prefix vendor-specific prefix, eg: Webkit
	 * @param {string} key style name, eg: transitionDuration
	 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
	 * WebkitTransitionDuration
	 */
	function prefixKey(prefix, key) {
	  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
	}
	
	/**
	 * Support style names that may come passed in prefixed by adding permutations
	 * of vendor prefixes.
	 */
	var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
	
	// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
	// infinite loop, because it iterates over the newly added props too.
	Object.keys(isUnitlessNumber).forEach(function (prop) {
	  prefixes.forEach(function (prefix) {
	    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
	  });
	});
	
	/**
	 * Convert a value into the proper css writable value. The style name `name`
	 * should be logical (no hyphens), as specified
	 * in `CSSProperty.isUnitlessNumber`.
	 *
	 * @param {string} name CSS property name such as `topMargin`.
	 * @param {*} value CSS property value such as `10px`.
	 * @return {string} Normalized style value with dimensions applied.
	 */
	function dangerousStyleValue(name, value, isCustomProperty) {
	  // Note that we've removed escapeTextForBrowser() calls here since the
	  // whole string will be escaped when the attribute is injected into
	  // the markup. If you provide unsafe user data here they can inject
	  // arbitrary CSS which may be problematic (I couldn't repro this):
	  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
	  // This is not an XSS hole but instead a potential CSS injection issue
	  // which has lead to a greater discussion about how we're going to
	  // trust URLs moving forward. See #2115901
	
	  var isEmpty = value == null || typeof value === 'boolean' || value === '';
	  if (isEmpty) {
	    return '';
	  }
	
	  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
	    return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
	  }
	
	  return ('' + value).trim();
	}
	
	var uppercasePattern = /([A-Z])/g;
	var msPattern = /^ms-/;
	
	/**
	 * Hyphenates a camelcased CSS property name, for example:
	 *
	 *   > hyphenateStyleName('backgroundColor')
	 *   < "background-color"
	 *   > hyphenateStyleName('MozTransition')
	 *   < "-moz-transition"
	 *   > hyphenateStyleName('msTransition')
	 *   < "-ms-transition"
	 *
	 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
	 * is converted to `-ms-`.
	 */
	function hyphenateStyleName(name) {
	  return name.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-');
	}
	
	function isCustomComponent(tagName, props) {
	  if (tagName.indexOf('-') === -1) {
	    return typeof props.is === 'string';
	  }
	  switch (tagName) {
	    // These are reserved SVG and MathML elements.
	    // We don't mind this whitelist too much because we expect it to never grow.
	    // The alternative is to track the namespace in a few places which is convoluted.
	    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
	    case 'annotation-xml':
	    case 'color-profile':
	    case 'font-face':
	    case 'font-face-src':
	    case 'font-face-uri':
	    case 'font-face-format':
	    case 'font-face-name':
	    case 'missing-glyph':
	      return false;
	    default:
	      return true;
	  }
	}
	
	var warnValidStyle = function () {};
	
	{
	  // 'msTransform' is correct, but the other prefixes should be capitalized
	  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;
	  var msPattern$1 = /^-ms-/;
	  var hyphenPattern = /-(.)/g;
	
	  // style values shouldn't contain a semicolon
	  var badStyleValueWithSemicolonPattern = /;\s*$/;
	
	  var warnedStyleNames = {};
	  var warnedStyleValues = {};
	  var warnedForNaNValue = false;
	  var warnedForInfinityValue = false;
	
	  var camelize = function (string) {
	    return string.replace(hyphenPattern, function (_, character) {
	      return character.toUpperCase();
	    });
	  };
	
	  var warnHyphenatedStyleName = function (name) {
	    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
	      return;
	    }
	
	    warnedStyleNames[name] = true;
	    warning$1(false, 'Unsupported style property %s. Did you mean %s?', name,
	    // As Andi Smith suggests
	    // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
	    // is converted to lowercase `ms`.
	    camelize(name.replace(msPattern$1, 'ms-')));
	  };
	
	  var warnBadVendoredStyleName = function (name) {
	    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
	      return;
	    }
	
	    warnedStyleNames[name] = true;
	    warning$1(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?', name, name.charAt(0).toUpperCase() + name.slice(1));
	  };
	
	  var warnStyleValueWithSemicolon = function (name, value) {
	    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
	      return;
	    }
	
	    warnedStyleValues[value] = true;
	    warning$1(false, "Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.', name, value.replace(badStyleValueWithSemicolonPattern, ''));
	  };
	
	  var warnStyleValueIsNaN = function (name, value) {
	    if (warnedForNaNValue) {
	      return;
	    }
	
	    warnedForNaNValue = true;
	    warning$1(false, '`NaN` is an invalid value for the `%s` css style property.', name);
	  };
	
	  var warnStyleValueIsInfinity = function (name, value) {
	    if (warnedForInfinityValue) {
	      return;
	    }
	
	    warnedForInfinityValue = true;
	    warning$1(false, '`Infinity` is an invalid value for the `%s` css style property.', name);
	  };
	
	  warnValidStyle = function (name, value) {
	    if (name.indexOf('-') > -1) {
	      warnHyphenatedStyleName(name);
	    } else if (badVendoredStyleNamePattern.test(name)) {
	      warnBadVendoredStyleName(name);
	    } else if (badStyleValueWithSemicolonPattern.test(value)) {
	      warnStyleValueWithSemicolon(name, value);
	    }
	
	    if (typeof value === 'number') {
	      if (isNaN(value)) {
	        warnStyleValueIsNaN(name, value);
	      } else if (!isFinite(value)) {
	        warnStyleValueIsInfinity(name, value);
	      }
	    }
	  };
	}
	
	var warnValidStyle$1 = warnValidStyle;
	
	var ariaProperties = {
	  'aria-current': 0, // state
	  'aria-details': 0,
	  'aria-disabled': 0, // state
	  'aria-hidden': 0, // state
	  'aria-invalid': 0, // state
	  'aria-keyshortcuts': 0,
	  'aria-label': 0,
	  'aria-roledescription': 0,
	  // Widget Attributes
	  'aria-autocomplete': 0,
	  'aria-checked': 0,
	  'aria-expanded': 0,
	  'aria-haspopup': 0,
	  'aria-level': 0,
	  'aria-modal': 0,
	  'aria-multiline': 0,
	  'aria-multiselectable': 0,
	  'aria-orientation': 0,
	  'aria-placeholder': 0,
	  'aria-pressed': 0,
	  'aria-readonly': 0,
	  'aria-required': 0,
	  'aria-selected': 0,
	  'aria-sort': 0,
	  'aria-valuemax': 0,
	  'aria-valuemin': 0,
	  'aria-valuenow': 0,
	  'aria-valuetext': 0,
	  // Live Region Attributes
	  'aria-atomic': 0,
	  'aria-busy': 0,
	  'aria-live': 0,
	  'aria-relevant': 0,
	  // Drag-and-Drop Attributes
	  'aria-dropeffect': 0,
	  'aria-grabbed': 0,
	  // Relationship Attributes
	  'aria-activedescendant': 0,
	  'aria-colcount': 0,
	  'aria-colindex': 0,
	  'aria-colspan': 0,
	  'aria-controls': 0,
	  'aria-describedby': 0,
	  'aria-errormessage': 0,
	  'aria-flowto': 0,
	  'aria-labelledby': 0,
	  'aria-owns': 0,
	  'aria-posinset': 0,
	  'aria-rowcount': 0,
	  'aria-rowindex': 0,
	  'aria-rowspan': 0,
	  'aria-setsize': 0
	};
	
	var warnedProperties = {};
	var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
	var rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');
	
	var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
	
	function validateProperty(tagName, name) {
	  if (hasOwnProperty$2.call(warnedProperties, name) && warnedProperties[name]) {
	    return true;
	  }
	
	  if (rARIACamel.test(name)) {
	    var ariaName = 'aria-' + name.slice(4).toLowerCase();
	    var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;
	
	    // If this is an aria-* attribute, but is not listed in the known DOM
	    // DOM properties, then it is an invalid aria-* attribute.
	    if (correctName == null) {
	      warning$1(false, 'Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.', name);
	      warnedProperties[name] = true;
	      return true;
	    }
	    // aria-* attributes should be lowercase; suggest the lowercase version.
	    if (name !== correctName) {
	      warning$1(false, 'Invalid ARIA attribute `%s`. Did you mean `%s`?', name, correctName);
	      warnedProperties[name] = true;
	      return true;
	    }
	  }
	
	  if (rARIA.test(name)) {
	    var lowerCasedName = name.toLowerCase();
	    var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;
	
	    // If this is an aria-* attribute, but is not listed in the known DOM
	    // DOM properties, then it is an invalid aria-* attribute.
	    if (standardName == null) {
	      warnedProperties[name] = true;
	      return false;
	    }
	    // aria-* attributes should be lowercase; suggest the lowercase version.
	    if (name !== standardName) {
	      warning$1(false, 'Unknown ARIA attribute `%s`. Did you mean `%s`?', name, standardName);
	      warnedProperties[name] = true;
	      return true;
	    }
	  }
	
	  return true;
	}
	
	function warnInvalidARIAProps(type, props) {
	  var invalidProps = [];
	
	  for (var key in props) {
	    var isValid = validateProperty(type, key);
	    if (!isValid) {
	      invalidProps.push(key);
	    }
	  }
	
	  var unknownPropString = invalidProps.map(function (prop) {
	    return '`' + prop + '`';
	  }).join(', ');
	
	  if (invalidProps.length === 1) {
	    warning$1(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop', unknownPropString, type);
	  } else if (invalidProps.length > 1) {
	    warning$1(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop', unknownPropString, type);
	  }
	}
	
	function validateProperties(type, props) {
	  if (isCustomComponent(type, props)) {
	    return;
	  }
	  warnInvalidARIAProps(type, props);
	}
	
	var didWarnValueNull = false;
	
	function validateProperties$1(type, props) {
	  if (type !== 'input' && type !== 'textarea' && type !== 'select') {
	    return;
	  }
	
	  if (props != null && props.value === null && !didWarnValueNull) {
	    didWarnValueNull = true;
	    if (type === 'select' && props.multiple) {
	      warning$1(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty array when `multiple` is set to `true` ' + 'to clear the component or `undefined` for uncontrolled components.', type);
	    } else {
	      warning$1(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty string to clear the component or `undefined` ' + 'for uncontrolled components.', type);
	    }
	  }
	}
	
	/**
	 * Registers plugins so that they can extract and dispatch events.
	 *
	 * @see {EventPluginHub}
	 */
	
	/**
	 * Ordered list of injected plugins.
	 */
	
	
	/**
	 * Mapping from event name to dispatch config
	 */
	
	
	/**
	 * Mapping from registration name to plugin module
	 */
	var registrationNameModules = {};
	
	/**
	 * Mapping from registration name to event name
	 */
	
	
	/**
	 * Mapping from lowercase registration names to the properly cased version,
	 * used to warn in the case of missing event handlers. Available
	 * only in true.
	 * @type {Object}
	 */
	var possibleRegistrationNames = {};
	// Trust the developer to only use possibleRegistrationNames in true
	
	/**
	 * Injects an ordering of plugins (by plugin name). This allows the ordering
	 * to be decoupled from injection of the actual plugins so that ordering is
	 * always deterministic regardless of packaging, on-the-fly injection, etc.
	 *
	 * @param {array} InjectedEventPluginOrder
	 * @internal
	 * @see {EventPluginHub.injection.injectEventPluginOrder}
	 */
	
	
	/**
	 * Injects plugins to be used by `EventPluginHub`. The plugin names must be
	 * in the ordering injected by `injectEventPluginOrder`.
	 *
	 * Plugins can be injected as part of page initialization or on-the-fly.
	 *
	 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
	 * @internal
	 * @see {EventPluginHub.injection.injectEventPluginsByName}
	 */
	
	// When adding attributes to the HTML or SVG whitelist, be sure to
	// also add them to this module to ensure casing and incorrect name
	// warnings.
	var possibleStandardNames = {
	  // HTML
	  accept: 'accept',
	  acceptcharset: 'acceptCharset',
	  'accept-charset': 'acceptCharset',
	  accesskey: 'accessKey',
	  action: 'action',
	  allowfullscreen: 'allowFullScreen',
	  alt: 'alt',
	  as: 'as',
	  async: 'async',
	  autocapitalize: 'autoCapitalize',
	  autocomplete: 'autoComplete',
	  autocorrect: 'autoCorrect',
	  autofocus: 'autoFocus',
	  autoplay: 'autoPlay',
	  autosave: 'autoSave',
	  capture: 'capture',
	  cellpadding: 'cellPadding',
	  cellspacing: 'cellSpacing',
	  challenge: 'challenge',
	  charset: 'charSet',
	  checked: 'checked',
	  children: 'children',
	  cite: 'cite',
	  class: 'className',
	  classid: 'classID',
	  classname: 'className',
	  cols: 'cols',
	  colspan: 'colSpan',
	  content: 'content',
	  contenteditable: 'contentEditable',
	  contextmenu: 'contextMenu',
	  controls: 'controls',
	  controlslist: 'controlsList',
	  coords: 'coords',
	  crossorigin: 'crossOrigin',
	  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
	  data: 'data',
	  datetime: 'dateTime',
	  default: 'default',
	  defaultchecked: 'defaultChecked',
	  defaultvalue: 'defaultValue',
	  defer: 'defer',
	  dir: 'dir',
	  disabled: 'disabled',
	  download: 'download',
	  draggable: 'draggable',
	  enctype: 'encType',
	  for: 'htmlFor',
	  form: 'form',
	  formmethod: 'formMethod',
	  formaction: 'formAction',
	  formenctype: 'formEncType',
	  formnovalidate: 'formNoValidate',
	  formtarget: 'formTarget',
	  frameborder: 'frameBorder',
	  headers: 'headers',
	  height: 'height',
	  hidden: 'hidden',
	  high: 'high',
	  href: 'href',
	  hreflang: 'hrefLang',
	  htmlfor: 'htmlFor',
	  httpequiv: 'httpEquiv',
	  'http-equiv': 'httpEquiv',
	  icon: 'icon',
	  id: 'id',
	  innerhtml: 'innerHTML',
	  inputmode: 'inputMode',
	  integrity: 'integrity',
	  is: 'is',
	  itemid: 'itemID',
	  itemprop: 'itemProp',
	  itemref: 'itemRef',
	  itemscope: 'itemScope',
	  itemtype: 'itemType',
	  keyparams: 'keyParams',
	  keytype: 'keyType',
	  kind: 'kind',
	  label: 'label',
	  lang: 'lang',
	  list: 'list',
	  loop: 'loop',
	  low: 'low',
	  manifest: 'manifest',
	  marginwidth: 'marginWidth',
	  marginheight: 'marginHeight',
	  max: 'max',
	  maxlength: 'maxLength',
	  media: 'media',
	  mediagroup: 'mediaGroup',
	  method: 'method',
	  min: 'min',
	  minlength: 'minLength',
	  multiple: 'multiple',
	  muted: 'muted',
	  name: 'name',
	  nomodule: 'noModule',
	  nonce: 'nonce',
	  novalidate: 'noValidate',
	  open: 'open',
	  optimum: 'optimum',
	  pattern: 'pattern',
	  placeholder: 'placeholder',
	  playsinline: 'playsInline',
	  poster: 'poster',
	  preload: 'preload',
	  profile: 'profile',
	  radiogroup: 'radioGroup',
	  readonly: 'readOnly',
	  referrerpolicy: 'referrerPolicy',
	  rel: 'rel',
	  required: 'required',
	  reversed: 'reversed',
	  role: 'role',
	  rows: 'rows',
	  rowspan: 'rowSpan',
	  sandbox: 'sandbox',
	  scope: 'scope',
	  scoped: 'scoped',
	  scrolling: 'scrolling',
	  seamless: 'seamless',
	  selected: 'selected',
	  shape: 'shape',
	  size: 'size',
	  sizes: 'sizes',
	  span: 'span',
	  spellcheck: 'spellCheck',
	  src: 'src',
	  srcdoc: 'srcDoc',
	  srclang: 'srcLang',
	  srcset: 'srcSet',
	  start: 'start',
	  step: 'step',
	  style: 'style',
	  summary: 'summary',
	  tabindex: 'tabIndex',
	  target: 'target',
	  title: 'title',
	  type: 'type',
	  usemap: 'useMap',
	  value: 'value',
	  width: 'width',
	  wmode: 'wmode',
	  wrap: 'wrap',
	
	  // SVG
	  about: 'about',
	  accentheight: 'accentHeight',
	  'accent-height': 'accentHeight',
	  accumulate: 'accumulate',
	  additive: 'additive',
	  alignmentbaseline: 'alignmentBaseline',
	  'alignment-baseline': 'alignmentBaseline',
	  allowreorder: 'allowReorder',
	  alphabetic: 'alphabetic',
	  amplitude: 'amplitude',
	  arabicform: 'arabicForm',
	  'arabic-form': 'arabicForm',
	  ascent: 'ascent',
	  attributename: 'attributeName',
	  attributetype: 'attributeType',
	  autoreverse: 'autoReverse',
	  azimuth: 'azimuth',
	  basefrequency: 'baseFrequency',
	  baselineshift: 'baselineShift',
	  'baseline-shift': 'baselineShift',
	  baseprofile: 'baseProfile',
	  bbox: 'bbox',
	  begin: 'begin',
	  bias: 'bias',
	  by: 'by',
	  calcmode: 'calcMode',
	  capheight: 'capHeight',
	  'cap-height': 'capHeight',
	  clip: 'clip',
	  clippath: 'clipPath',
	  'clip-path': 'clipPath',
	  clippathunits: 'clipPathUnits',
	  cliprule: 'clipRule',
	  'clip-rule': 'clipRule',
	  color: 'color',
	  colorinterpolation: 'colorInterpolation',
	  'color-interpolation': 'colorInterpolation',
	  colorinterpolationfilters: 'colorInterpolationFilters',
	  'color-interpolation-filters': 'colorInterpolationFilters',
	  colorprofile: 'colorProfile',
	  'color-profile': 'colorProfile',
	  colorrendering: 'colorRendering',
	  'color-rendering': 'colorRendering',
	  contentscripttype: 'contentScriptType',
	  contentstyletype: 'contentStyleType',
	  cursor: 'cursor',
	  cx: 'cx',
	  cy: 'cy',
	  d: 'd',
	  datatype: 'datatype',
	  decelerate: 'decelerate',
	  descent: 'descent',
	  diffuseconstant: 'diffuseConstant',
	  direction: 'direction',
	  display: 'display',
	  divisor: 'divisor',
	  dominantbaseline: 'dominantBaseline',
	  'dominant-baseline': 'dominantBaseline',
	  dur: 'dur',
	  dx: 'dx',
	  dy: 'dy',
	  edgemode: 'edgeMode',
	  elevation: 'elevation',
	  enablebackground: 'enableBackground',
	  'enable-background': 'enableBackground',
	  end: 'end',
	  exponent: 'exponent',
	  externalresourcesrequired: 'externalResourcesRequired',
	  fill: 'fill',
	  fillopacity: 'fillOpacity',
	  'fill-opacity': 'fillOpacity',
	  fillrule: 'fillRule',
	  'fill-rule': 'fillRule',
	  filter: 'filter',
	  filterres: 'filterRes',
	  filterunits: 'filterUnits',
	  floodopacity: 'floodOpacity',
	  'flood-opacity': 'floodOpacity',
	  floodcolor: 'floodColor',
	  'flood-color': 'floodColor',
	  focusable: 'focusable',
	  fontfamily: 'fontFamily',
	  'font-family': 'fontFamily',
	  fontsize: 'fontSize',
	  'font-size': 'fontSize',
	  fontsizeadjust: 'fontSizeAdjust',
	  'font-size-adjust': 'fontSizeAdjust',
	  fontstretch: 'fontStretch',
	  'font-stretch': 'fontStretch',
	  fontstyle: 'fontStyle',
	  'font-style': 'fontStyle',
	  fontvariant: 'fontVariant',
	  'font-variant': 'fontVariant',
	  fontweight: 'fontWeight',
	  'font-weight': 'fontWeight',
	  format: 'format',
	  from: 'from',
	  fx: 'fx',
	  fy: 'fy',
	  g1: 'g1',
	  g2: 'g2',
	  glyphname: 'glyphName',
	  'glyph-name': 'glyphName',
	  glyphorientationhorizontal: 'glyphOrientationHorizontal',
	  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
	  glyphorientationvertical: 'glyphOrientationVertical',
	  'glyph-orientation-vertical': 'glyphOrientationVertical',
	  glyphref: 'glyphRef',
	  gradienttransform: 'gradientTransform',
	  gradientunits: 'gradientUnits',
	  hanging: 'hanging',
	  horizadvx: 'horizAdvX',
	  'horiz-adv-x': 'horizAdvX',
	  horizoriginx: 'horizOriginX',
	  'horiz-origin-x': 'horizOriginX',
	  ideographic: 'ideographic',
	  imagerendering: 'imageRendering',
	  'image-rendering': 'imageRendering',
	  in2: 'in2',
	  in: 'in',
	  inlist: 'inlist',
	  intercept: 'intercept',
	  k1: 'k1',
	  k2: 'k2',
	  k3: 'k3',
	  k4: 'k4',
	  k: 'k',
	  kernelmatrix: 'kernelMatrix',
	  kernelunitlength: 'kernelUnitLength',
	  kerning: 'kerning',
	  keypoints: 'keyPoints',
	  keysplines: 'keySplines',
	  keytimes: 'keyTimes',
	  lengthadjust: 'lengthAdjust',
	  letterspacing: 'letterSpacing',
	  'letter-spacing': 'letterSpacing',
	  lightingcolor: 'lightingColor',
	  'lighting-color': 'lightingColor',
	  limitingconeangle: 'limitingConeAngle',
	  local: 'local',
	  markerend: 'markerEnd',
	  'marker-end': 'markerEnd',
	  markerheight: 'markerHeight',
	  markermid: 'markerMid',
	  'marker-mid': 'markerMid',
	  markerstart: 'markerStart',
	  'marker-start': 'markerStart',
	  markerunits: 'markerUnits',
	  markerwidth: 'markerWidth',
	  mask: 'mask',
	  maskcontentunits: 'maskContentUnits',
	  maskunits: 'maskUnits',
	  mathematical: 'mathematical',
	  mode: 'mode',
	  numoctaves: 'numOctaves',
	  offset: 'offset',
	  opacity: 'opacity',
	  operator: 'operator',
	  order: 'order',
	  orient: 'orient',
	  orientation: 'orientation',
	  origin: 'origin',
	  overflow: 'overflow',
	  overlineposition: 'overlinePosition',
	  'overline-position': 'overlinePosition',
	  overlinethickness: 'overlineThickness',
	  'overline-thickness': 'overlineThickness',
	  paintorder: 'paintOrder',
	  'paint-order': 'paintOrder',
	  panose1: 'panose1',
	  'panose-1': 'panose1',
	  pathlength: 'pathLength',
	  patterncontentunits: 'patternContentUnits',
	  patterntransform: 'patternTransform',
	  patternunits: 'patternUnits',
	  pointerevents: 'pointerEvents',
	  'pointer-events': 'pointerEvents',
	  points: 'points',
	  pointsatx: 'pointsAtX',
	  pointsaty: 'pointsAtY',
	  pointsatz: 'pointsAtZ',
	  prefix: 'prefix',
	  preservealpha: 'preserveAlpha',
	  preserveaspectratio: 'preserveAspectRatio',
	  primitiveunits: 'primitiveUnits',
	  property: 'property',
	  r: 'r',
	  radius: 'radius',
	  refx: 'refX',
	  refy: 'refY',
	  renderingintent: 'renderingIntent',
	  'rendering-intent': 'renderingIntent',
	  repeatcount: 'repeatCount',
	  repeatdur: 'repeatDur',
	  requiredextensions: 'requiredExtensions',
	  requiredfeatures: 'requiredFeatures',
	  resource: 'resource',
	  restart: 'restart',
	  result: 'result',
	  results: 'results',
	  rotate: 'rotate',
	  rx: 'rx',
	  ry: 'ry',
	  scale: 'scale',
	  security: 'security',
	  seed: 'seed',
	  shaperendering: 'shapeRendering',
	  'shape-rendering': 'shapeRendering',
	  slope: 'slope',
	  spacing: 'spacing',
	  specularconstant: 'specularConstant',
	  specularexponent: 'specularExponent',
	  speed: 'speed',
	  spreadmethod: 'spreadMethod',
	  startoffset: 'startOffset',
	  stddeviation: 'stdDeviation',
	  stemh: 'stemh',
	  stemv: 'stemv',
	  stitchtiles: 'stitchTiles',
	  stopcolor: 'stopColor',
	  'stop-color': 'stopColor',
	  stopopacity: 'stopOpacity',
	  'stop-opacity': 'stopOpacity',
	  strikethroughposition: 'strikethroughPosition',
	  'strikethrough-position': 'strikethroughPosition',
	  strikethroughthickness: 'strikethroughThickness',
	  'strikethrough-thickness': 'strikethroughThickness',
	  string: 'string',
	  stroke: 'stroke',
	  strokedasharray: 'strokeDasharray',
	  'stroke-dasharray': 'strokeDasharray',
	  strokedashoffset: 'strokeDashoffset',
	  'stroke-dashoffset': 'strokeDashoffset',
	  strokelinecap: 'strokeLinecap',
	  'stroke-linecap': 'strokeLinecap',
	  strokelinejoin: 'strokeLinejoin',
	  'stroke-linejoin': 'strokeLinejoin',
	  strokemiterlimit: 'strokeMiterlimit',
	  'stroke-miterlimit': 'strokeMiterlimit',
	  strokewidth: 'strokeWidth',
	  'stroke-width': 'strokeWidth',
	  strokeopacity: 'strokeOpacity',
	  'stroke-opacity': 'strokeOpacity',
	  suppresscontenteditablewarning: 'suppressContentEditableWarning',
	  suppresshydrationwarning: 'suppressHydrationWarning',
	  surfacescale: 'surfaceScale',
	  systemlanguage: 'systemLanguage',
	  tablevalues: 'tableValues',
	  targetx: 'targetX',
	  targety: 'targetY',
	  textanchor: 'textAnchor',
	  'text-anchor': 'textAnchor',
	  textdecoration: 'textDecoration',
	  'text-decoration': 'textDecoration',
	  textlength: 'textLength',
	  textrendering: 'textRendering',
	  'text-rendering': 'textRendering',
	  to: 'to',
	  transform: 'transform',
	  typeof: 'typeof',
	  u1: 'u1',
	  u2: 'u2',
	  underlineposition: 'underlinePosition',
	  'underline-position': 'underlinePosition',
	  underlinethickness: 'underlineThickness',
	  'underline-thickness': 'underlineThickness',
	  unicode: 'unicode',
	  unicodebidi: 'unicodeBidi',
	  'unicode-bidi': 'unicodeBidi',
	  unicoderange: 'unicodeRange',
	  'unicode-range': 'unicodeRange',
	  unitsperem: 'unitsPerEm',
	  'units-per-em': 'unitsPerEm',
	  unselectable: 'unselectable',
	  valphabetic: 'vAlphabetic',
	  'v-alphabetic': 'vAlphabetic',
	  values: 'values',
	  vectoreffect: 'vectorEffect',
	  'vector-effect': 'vectorEffect',
	  version: 'version',
	  vertadvy: 'vertAdvY',
	  'vert-adv-y': 'vertAdvY',
	  vertoriginx: 'vertOriginX',
	  'vert-origin-x': 'vertOriginX',
	  vertoriginy: 'vertOriginY',
	  'vert-origin-y': 'vertOriginY',
	  vhanging: 'vHanging',
	  'v-hanging': 'vHanging',
	  videographic: 'vIdeographic',
	  'v-ideographic': 'vIdeographic',
	  viewbox: 'viewBox',
	  viewtarget: 'viewTarget',
	  visibility: 'visibility',
	  vmathematical: 'vMathematical',
	  'v-mathematical': 'vMathematical',
	  vocab: 'vocab',
	  widths: 'widths',
	  wordspacing: 'wordSpacing',
	  'word-spacing': 'wordSpacing',
	  writingmode: 'writingMode',
	  'writing-mode': 'writingMode',
	  x1: 'x1',
	  x2: 'x2',
	  x: 'x',
	  xchannelselector: 'xChannelSelector',
	  xheight: 'xHeight',
	  'x-height': 'xHeight',
	  xlinkactuate: 'xlinkActuate',
	  'xlink:actuate': 'xlinkActuate',
	  xlinkarcrole: 'xlinkArcrole',
	  'xlink:arcrole': 'xlinkArcrole',
	  xlinkhref: 'xlinkHref',
	  'xlink:href': 'xlinkHref',
	  xlinkrole: 'xlinkRole',
	  'xlink:role': 'xlinkRole',
	  xlinkshow: 'xlinkShow',
	  'xlink:show': 'xlinkShow',
	  xlinktitle: 'xlinkTitle',
	  'xlink:title': 'xlinkTitle',
	  xlinktype: 'xlinkType',
	  'xlink:type': 'xlinkType',
	  xmlbase: 'xmlBase',
	  'xml:base': 'xmlBase',
	  xmllang: 'xmlLang',
	  'xml:lang': 'xmlLang',
	  xmlns: 'xmlns',
	  'xml:space': 'xmlSpace',
	  xmlnsxlink: 'xmlnsXlink',
	  'xmlns:xlink': 'xmlnsXlink',
	  xmlspace: 'xmlSpace',
	  y1: 'y1',
	  y2: 'y2',
	  y: 'y',
	  ychannelselector: 'yChannelSelector',
	  z: 'z',
	  zoomandpan: 'zoomAndPan'
	};
	
	var validateProperty$1 = function () {};
	
	{
	  var warnedProperties$1 = {};
	  var _hasOwnProperty = Object.prototype.hasOwnProperty;
	  var EVENT_NAME_REGEX = /^on./;
	  var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
	  var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
	  var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');
	
	  validateProperty$1 = function (tagName, name, value, canUseEventSystem) {
	    if (_hasOwnProperty.call(warnedProperties$1, name) && warnedProperties$1[name]) {
	      return true;
	    }
	
	    var lowerCasedName = name.toLowerCase();
	    if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
	      warning$1(false, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    // We can't rely on the event system being injected on the server.
	    if (canUseEventSystem) {
	      if (registrationNameModules.hasOwnProperty(name)) {
	        return true;
	      }
	      var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
	      if (registrationName != null) {
	        warning$1(false, 'Invalid event handler property `%s`. Did you mean `%s`?', name, registrationName);
	        warnedProperties$1[name] = true;
	        return true;
	      }
	      if (EVENT_NAME_REGEX.test(name)) {
	        warning$1(false, 'Unknown event handler property `%s`. It will be ignored.', name);
	        warnedProperties$1[name] = true;
	        return true;
	      }
	    } else if (EVENT_NAME_REGEX.test(name)) {
	      // If no event plugins have been injected, we are in a server environment.
	      // So we can't tell if the event name is correct for sure, but we can filter
	      // out known bad ones like `onclick`. We can't suggest a specific replacement though.
	      if (INVALID_EVENT_NAME_REGEX.test(name)) {
	        warning$1(false, 'Invalid event handler property `%s`. ' + 'React events use the camelCase naming convention, for example `onClick`.', name);
	      }
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    // Let the ARIA attribute hook validate ARIA attributes
	    if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
	      return true;
	    }
	
	    if (lowerCasedName === 'innerhtml') {
	      warning$1(false, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    if (lowerCasedName === 'aria') {
	      warning$1(false, 'The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
	      warning$1(false, 'Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.', typeof value);
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    if (typeof value === 'number' && isNaN(value)) {
	      warning$1(false, 'Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.', name);
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    var propertyInfo = getPropertyInfo(name);
	    var isReserved = propertyInfo !== null && propertyInfo.type === RESERVED;
	
	    // Known attributes should match the casing specified in the property config.
	    if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
	      var standardName = possibleStandardNames[lowerCasedName];
	      if (standardName !== name) {
	        warning$1(false, 'Invalid DOM property `%s`. Did you mean `%s`?', name, standardName);
	        warnedProperties$1[name] = true;
	        return true;
	      }
	    } else if (!isReserved && name !== lowerCasedName) {
	      // Unknown attributes should have lowercase casing since that's how they
	      // will be cased anyway with server rendering.
	      warning$1(false, 'React does not recognize the `%s` prop on a DOM element. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'attribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it from a parent component, remove ' + 'it from the DOM element.', name, lowerCasedName);
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    if (typeof value === 'boolean' && shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
	      if (value) {
	        warning$1(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.', value, name, name, value, name);
	      } else {
	        warning$1(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.', value, name, name, value, name, name, name);
	      }
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    // Now that we've validated casing, do not validate
	    // data types for reserved props
	    if (isReserved) {
	      return true;
	    }
	
	    // Warn when a known attribute is a bad type
	    if (shouldRemoveAttributeWithWarning(name, value, propertyInfo, false)) {
	      warnedProperties$1[name] = true;
	      return false;
	    }
	
	    // Warn when passing the strings 'false' or 'true' into a boolean prop
	    if ((value === 'false' || value === 'true') && propertyInfo !== null && propertyInfo.type === BOOLEAN) {
	      warning$1(false, 'Received the string `%s` for the boolean attribute `%s`. ' + '%s ' + 'Did you mean %s={%s}?', value, name, value === 'false' ? 'The browser will interpret it as a truthy value.' : 'Although this works, it will not work as expected if you pass the string "false".', name, value);
	      warnedProperties$1[name] = true;
	      return true;
	    }
	
	    return true;
	  };
	}
	
	var warnUnknownProperties = function (type, props, canUseEventSystem) {
	  var unknownProps = [];
	  for (var key in props) {
	    var isValid = validateProperty$1(type, key, props[key], canUseEventSystem);
	    if (!isValid) {
	      unknownProps.push(key);
	    }
	  }
	
	  var unknownPropString = unknownProps.map(function (prop) {
	    return '`' + prop + '`';
	  }).join(', ');
	  if (unknownProps.length === 1) {
	    warning$1(false, 'Invalid value for prop %s on <%s> tag. Either remove it from the element, ' + 'or pass a string or number value to keep it in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior', unknownPropString, type);
	  } else if (unknownProps.length > 1) {
	    warning$1(false, 'Invalid values for props %s on <%s> tag. Either remove them from the element, ' + 'or pass a string or number value to keep them in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior', unknownPropString, type);
	  }
	};
	
	function validateProperties$2(type, props, canUseEventSystem) {
	  if (isCustomComponent(type, props)) {
	    return;
	  }
	  warnUnknownProperties(type, props, canUseEventSystem);
	}
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// Based on reading the React.Children implementation. TODO: type this somewhere?
	
	var toArray = React.Children.toArray;
	
	// This is only used in DEV.
	// Each entry is `this.stack` from a currently executing renderer instance.
	// (There may be more than one because ReactDOMServer is reentrant).
	// Each stack is an array of frames which may contain nested stacks of elements.
	var currentDebugStacks = [];
	
	var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
	var ReactDebugCurrentFrame = void 0;
	var prevGetCurrentStackImpl = null;
	var getCurrentServerStackImpl = function () {
	  return '';
	};
	var describeStackFrame = function (element) {
	  return '';
	};
	
	var validatePropertiesInDevelopment = function (type, props) {};
	var pushCurrentDebugStack = function (stack) {};
	var pushElementToDebugStack = function (element) {};
	var popCurrentDebugStack = function () {};
	var hasWarnedAboutUsingContextAsConsumer = false;
	
	{
	  ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
	
	  validatePropertiesInDevelopment = function (type, props) {
	    validateProperties(type, props);
	    validateProperties$1(type, props);
	    validateProperties$2(type, props, /* canUseEventSystem */false);
	  };
	
	  describeStackFrame = function (element) {
	    var source = element._source;
	    var type = element.type;
	    var name = getComponentName(type);
	    var ownerName = null;
	    return describeComponentFrame(name, source, ownerName);
	  };
	
	  pushCurrentDebugStack = function (stack) {
	    currentDebugStacks.push(stack);
	
	    if (currentDebugStacks.length === 1) {
	      // We are entering a server renderer.
	      // Remember the previous (e.g. client) global stack implementation.
	      prevGetCurrentStackImpl = ReactDebugCurrentFrame.getCurrentStack;
	      ReactDebugCurrentFrame.getCurrentStack = getCurrentServerStackImpl;
	    }
	  };
	
	  pushElementToDebugStack = function (element) {
	    // For the innermost executing ReactDOMServer call,
	    var stack = currentDebugStacks[currentDebugStacks.length - 1];
	    // Take the innermost executing frame (e.g. <Foo>),
	    var frame = stack[stack.length - 1];
	    // and record that it has one more element associated with it.
	    frame.debugElementStack.push(element);
	    // We only need this because we tail-optimize single-element
	    // children and directly handle them in an inner loop instead of
	    // creating separate frames for them.
	  };
	
	  popCurrentDebugStack = function () {
	    currentDebugStacks.pop();
	
	    if (currentDebugStacks.length === 0) {
	      // We are exiting the server renderer.
	      // Restore the previous (e.g. client) global stack implementation.
	      ReactDebugCurrentFrame.getCurrentStack = prevGetCurrentStackImpl;
	      prevGetCurrentStackImpl = null;
	    }
	  };
	
	  getCurrentServerStackImpl = function () {
	    if (currentDebugStacks.length === 0) {
	      // Nothing is currently rendering.
	      return '';
	    }
	    // ReactDOMServer is reentrant so there may be multiple calls at the same time.
	    // Take the frames from the innermost call which is the last in the array.
	    var frames = currentDebugStacks[currentDebugStacks.length - 1];
	    var stack = '';
	    // Go through every frame in the stack from the innermost one.
	    for (var i = frames.length - 1; i >= 0; i--) {
	      var frame = frames[i];
	      // Every frame might have more than one debug element stack entry associated with it.
	      // This is because single-child nesting doesn't create materialized frames.
	      // Instead it would push them through `pushElementToDebugStack()`.
	      var _debugElementStack = frame.debugElementStack;
	      for (var ii = _debugElementStack.length - 1; ii >= 0; ii--) {
	        stack += describeStackFrame(_debugElementStack[ii]);
	      }
	    }
	    return stack;
	  };
	}
	
	var didWarnDefaultInputValue = false;
	var didWarnDefaultChecked = false;
	var didWarnDefaultSelectValue = false;
	var didWarnDefaultTextareaValue = false;
	var didWarnInvalidOptionChildren = false;
	var didWarnAboutNoopUpdateForComponent = {};
	var didWarnAboutBadClass = {};
	var didWarnAboutDeprecatedWillMount = {};
	var didWarnAboutUndefinedDerivedState = {};
	var didWarnAboutUninitializedState = {};
	var valuePropNames = ['value', 'defaultValue'];
	var newlineEatingTags = {
	  listing: true,
	  pre: true,
	  textarea: true
	};
	
	// We accept any tag to be rendered but since this gets injected into arbitrary
	// HTML, we want to make sure that it's a safe tag.
	// http://www.w3.org/TR/REC-xml/#NT-Name
	var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
	var validatedTagCache = {};
	function validateDangerousTag(tag) {
	  if (!validatedTagCache.hasOwnProperty(tag)) {
	    !VALID_TAG_REGEX.test(tag) ? invariant(false, 'Invalid tag: %s', tag) : void 0;
	    validatedTagCache[tag] = true;
	  }
	}
	
	var styleNameCache = {};
	var processStyleName = function (styleName) {
	  if (styleNameCache.hasOwnProperty(styleName)) {
	    return styleNameCache[styleName];
	  }
	  var result = hyphenateStyleName(styleName);
	  styleNameCache[styleName] = result;
	  return result;
	};
	
	function createMarkupForStyles(styles) {
	  var serialized = '';
	  var delimiter = '';
	  for (var styleName in styles) {
	    if (!styles.hasOwnProperty(styleName)) {
	      continue;
	    }
	    var isCustomProperty = styleName.indexOf('--') === 0;
	    var styleValue = styles[styleName];
	    {
	      if (!isCustomProperty) {
	        warnValidStyle$1(styleName, styleValue);
	      }
	    }
	    if (styleValue != null) {
	      serialized += delimiter + processStyleName(styleName) + ':';
	      serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);
	
	      delimiter = ';';
	    }
	  }
	  return serialized || null;
	}
	
	function warnNoop(publicInstance, callerName) {
	  {
	    var _constructor = publicInstance.constructor;
	    var componentName = _constructor && getComponentName(_constructor) || 'ReactClass';
	    var warningKey = componentName + '.' + callerName;
	    if (didWarnAboutNoopUpdateForComponent[warningKey]) {
	      return;
	    }
	
	    warningWithoutStack$1(false, '%s(...): Can only update a mounting component. ' + 'This usually means you called %s() outside componentWillMount() on the server. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
	    didWarnAboutNoopUpdateForComponent[warningKey] = true;
	  }
	}
	
	function shouldConstruct(Component) {
	  return Component.prototype && Component.prototype.isReactComponent;
	}
	
	function getNonChildrenInnerMarkup(props) {
	  var innerHTML = props.dangerouslySetInnerHTML;
	  if (innerHTML != null) {
	    if (innerHTML.__html != null) {
	      return innerHTML.__html;
	    }
	  } else {
	    var content = props.children;
	    if (typeof content === 'string' || typeof content === 'number') {
	      return escapeTextForBrowser(content);
	    }
	  }
	  return null;
	}
	
	function flattenTopLevelChildren(children) {
	  if (!React.isValidElement(children)) {
	    return toArray(children);
	  }
	  var element = children;
	  if (element.type !== REACT_FRAGMENT_TYPE) {
	    return [element];
	  }
	  var fragmentChildren = element.props.children;
	  if (!React.isValidElement(fragmentChildren)) {
	    return toArray(fragmentChildren);
	  }
	  var fragmentChildElement = fragmentChildren;
	  return [fragmentChildElement];
	}
	
	function flattenOptionChildren(children) {
	  if (children === undefined || children === null) {
	    return children;
	  }
	  var content = '';
	  // Flatten children and warn if they aren't strings or numbers;
	  // invalid types are ignored.
	  React.Children.forEach(children, function (child) {
	    if (child == null) {
	      return;
	    }
	    content += child;
	    {
	      if (!didWarnInvalidOptionChildren && typeof child !== 'string' && typeof child !== 'number') {
	        didWarnInvalidOptionChildren = true;
	        warning$1(false, 'Only strings and numbers are supported as <option> children.');
	      }
	    }
	  });
	  return content;
	}
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var STYLE = 'style';
	var RESERVED_PROPS = {
	  children: null,
	  dangerouslySetInnerHTML: null,
	  suppressContentEditableWarning: null,
	  suppressHydrationWarning: null
	};
	
	function createOpenTagMarkup(tagVerbatim, tagLowercase, props, namespace, makeStaticMarkup, isRootElement) {
	  var ret = '<' + tagVerbatim;
	
	  for (var propKey in props) {
	    if (!hasOwnProperty.call(props, propKey)) {
	      continue;
	    }
	    var propValue = props[propKey];
	    if (propValue == null) {
	      continue;
	    }
	    if (propKey === STYLE) {
	      propValue = createMarkupForStyles(propValue);
	    }
	    var markup = null;
	    if (isCustomComponent(tagLowercase, props)) {
	      if (!RESERVED_PROPS.hasOwnProperty(propKey)) {
	        markup = createMarkupForCustomAttribute(propKey, propValue);
	      }
	    } else {
	      markup = createMarkupForProperty(propKey, propValue);
	    }
	    if (markup) {
	      ret += ' ' + markup;
	    }
	  }
	
	  // For static pages, no need to put React ID and checksum. Saves lots of
	  // bytes.
	  if (makeStaticMarkup) {
	    return ret;
	  }
	
	  if (isRootElement) {
	    ret += ' ' + createMarkupForRoot();
	  }
	  return ret;
	}
	
	function validateRenderResult(child, type) {
	  if (child === undefined) {
	    invariant(false, '%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.', getComponentName(type) || 'Component');
	  }
	}
	
	function resolve(child, context, threadID) {
	  while (React.isValidElement(child)) {
	    // Safe because we just checked it's an element.
	    var element = child;
	    var Component = element.type;
	    {
	      pushElementToDebugStack(element);
	    }
	    if (typeof Component !== 'function') {
	      break;
	    }
	    processChild(element, Component);
	  }
	
	  // Extra closure so queue and replace can be captured properly
	  function processChild(element, Component) {
	    var publicContext = processContext(Component, context, threadID);
	
	    var queue = [];
	    var replace = false;
	    var updater = {
	      isMounted: function (publicInstance) {
	        return false;
	      },
	      enqueueForceUpdate: function (publicInstance) {
	        if (queue === null) {
	          warnNoop(publicInstance, 'forceUpdate');
	          return null;
	        }
	      },
	      enqueueReplaceState: function (publicInstance, completeState) {
	        replace = true;
	        queue = [completeState];
	      },
	      enqueueSetState: function (publicInstance, currentPartialState) {
	        if (queue === null) {
	          warnNoop(publicInstance, 'setState');
	          return null;
	        }
	        queue.push(currentPartialState);
	      }
	    };
	
	    var inst = void 0;
	    if (shouldConstruct(Component)) {
	      inst = new Component(element.props, publicContext, updater);
	
	      if (typeof Component.getDerivedStateFromProps === 'function') {
	        {
	          if (inst.state === null || inst.state === undefined) {
	            var componentName = getComponentName(Component) || 'Unknown';
	            if (!didWarnAboutUninitializedState[componentName]) {
	              warningWithoutStack$1(false, '`%s` uses `getDerivedStateFromProps` but its initial state is ' + '%s. This is not recommended. Instead, define the initial state by ' + 'assigning an object to `this.state` in the constructor of `%s`. ' + 'This ensures that `getDerivedStateFromProps` arguments have a consistent shape.', componentName, inst.state === null ? 'null' : 'undefined', componentName);
	              didWarnAboutUninitializedState[componentName] = true;
	            }
	          }
	        }
	
	        var partialState = Component.getDerivedStateFromProps.call(null, element.props, inst.state);
	
	        {
	          if (partialState === undefined) {
	            var _componentName = getComponentName(Component) || 'Unknown';
	            if (!didWarnAboutUndefinedDerivedState[_componentName]) {
	              warningWithoutStack$1(false, '%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. ' + 'You have returned undefined.', _componentName);
	              didWarnAboutUndefinedDerivedState[_componentName] = true;
	            }
	          }
	        }
	
	        if (partialState != null) {
	          inst.state = _assign({}, inst.state, partialState);
	        }
	      }
	    } else {
	      {
	        if (Component.prototype && typeof Component.prototype.render === 'function') {
	          var _componentName2 = getComponentName(Component) || 'Unknown';
	
	          if (!didWarnAboutBadClass[_componentName2]) {
	            warningWithoutStack$1(false, "The <%s /> component appears to have a render method, but doesn't extend React.Component. " + 'This is likely to cause errors. Change %s to extend React.Component instead.', _componentName2, _componentName2);
	            didWarnAboutBadClass[_componentName2] = true;
	          }
	        }
	      }
	      var componentIdentity = {};
	      prepareToUseHooks(componentIdentity);
	      inst = Component(element.props, publicContext, updater);
	      inst = finishHooks(Component, element.props, inst, publicContext);
	
	      if (inst == null || inst.render == null) {
	        child = inst;
	        validateRenderResult(child, Component);
	        return;
	      }
	    }
	
	    inst.props = element.props;
	    inst.context = publicContext;
	    inst.updater = updater;
	
	    var initialState = inst.state;
	    if (initialState === undefined) {
	      inst.state = initialState = null;
	    }
	    if (typeof inst.UNSAFE_componentWillMount === 'function' || typeof inst.componentWillMount === 'function') {
	      if (typeof inst.componentWillMount === 'function') {
	        {
	          if (warnAboutDeprecatedLifecycles && inst.componentWillMount.__suppressDeprecationWarning !== true) {
	            var _componentName3 = getComponentName(Component) || 'Unknown';
	
	            if (!didWarnAboutDeprecatedWillMount[_componentName3]) {
	              lowPriorityWarning$1(false, '%s: componentWillMount() is deprecated and will be ' + 'removed in the next major version. Read about the motivations ' + 'behind this change: ' + 'https://fb.me/react-async-component-lifecycle-hooks' + '\n\n' + 'As a temporary workaround, you can rename to ' + 'UNSAFE_componentWillMount instead.', _componentName3);
	              didWarnAboutDeprecatedWillMount[_componentName3] = true;
	            }
	          }
	        }
	
	        // In order to support react-lifecycles-compat polyfilled components,
	        // Unsafe lifecycles should not be invoked for any component with the new gDSFP.
	        if (typeof Component.getDerivedStateFromProps !== 'function') {
	          inst.componentWillMount();
	        }
	      }
	      if (typeof inst.UNSAFE_componentWillMount === 'function' && typeof Component.getDerivedStateFromProps !== 'function') {
	        // In order to support react-lifecycles-compat polyfilled components,
	        // Unsafe lifecycles should not be invoked for any component with the new gDSFP.
	        inst.UNSAFE_componentWillMount();
	      }
	      if (queue.length) {
	        var oldQueue = queue;
	        var oldReplace = replace;
	        queue = null;
	        replace = false;
	
	        if (oldReplace && oldQueue.length === 1) {
	          inst.state = oldQueue[0];
	        } else {
	          var nextState = oldReplace ? oldQueue[0] : inst.state;
	          var dontMutate = true;
	          for (var i = oldReplace ? 1 : 0; i < oldQueue.length; i++) {
	            var partial = oldQueue[i];
	            var _partialState = typeof partial === 'function' ? partial.call(inst, nextState, element.props, publicContext) : partial;
	            if (_partialState != null) {
	              if (dontMutate) {
	                dontMutate = false;
	                nextState = _assign({}, nextState, _partialState);
	              } else {
	                _assign(nextState, _partialState);
	              }
	            }
	          }
	          inst.state = nextState;
	        }
	      } else {
	        queue = null;
	      }
	    }
	    child = inst.render();
	
	    {
	      if (child === undefined && inst.render._isMockFunction) {
	        // This is probably bad practice. Consider warning here and
	        // deprecating this convenience.
	        child = null;
	      }
	    }
	    validateRenderResult(child, Component);
	
	    var childContext = void 0;
	    if (typeof inst.getChildContext === 'function') {
	      var childContextTypes = Component.childContextTypes;
	      if (typeof childContextTypes === 'object') {
	        childContext = inst.getChildContext();
	        for (var contextKey in childContext) {
	          !(contextKey in childContextTypes) ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(Component) || 'Unknown', contextKey) : void 0;
	        }
	      } else {
	        warningWithoutStack$1(false, '%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', getComponentName(Component) || 'Unknown');
	      }
	    }
	    if (childContext) {
	      context = _assign({}, context, childContext);
	    }
	  }
	  return { child: child, context: context };
	}
	
	var ReactDOMServerRenderer = function () {
	  // DEV-only
	
	  // TODO: type this more strictly:
	  function ReactDOMServerRenderer(children, makeStaticMarkup) {
	    _classCallCheck(this, ReactDOMServerRenderer);
	
	    var flatChildren = flattenTopLevelChildren(children);
	
	    var topFrame = {
	      type: null,
	      // Assume all trees start in the HTML namespace (not totally true, but
	      // this is what we did historically)
	      domNamespace: Namespaces.html,
	      children: flatChildren,
	      childIndex: 0,
	      context: emptyObject,
	      footer: ''
	    };
	    {
	      topFrame.debugElementStack = [];
	    }
	    this.threadID = allocThreadID();
	    this.stack = [topFrame];
	    this.exhausted = false;
	    this.currentSelectValue = null;
	    this.previousWasTextNode = false;
	    this.makeStaticMarkup = makeStaticMarkup;
	    this.suspenseDepth = 0;
	
	    // Context (new API)
	    this.contextIndex = -1;
	    this.contextStack = [];
	    this.contextValueStack = [];
	    {
	      this.contextProviderStack = [];
	    }
	  }
	
	  ReactDOMServerRenderer.prototype.destroy = function destroy() {
	    if (!this.exhausted) {
	      this.exhausted = true;
	      freeThreadID(this.threadID);
	    }
	  };
	
	  /**
	   * Note: We use just two stacks regardless of how many context providers you have.
	   * Providers are always popped in the reverse order to how they were pushed
	   * so we always know on the way down which provider you'll encounter next on the way up.
	   * On the way down, we push the current provider, and its context value *before*
	   * we mutated it, onto the stacks. Therefore, on the way up, we always know which
	   * provider needs to be "restored" to which value.
	   * https://github.com/facebook/react/pull/12985#issuecomment-396301248
	   */
	
	  ReactDOMServerRenderer.prototype.pushProvider = function pushProvider(provider) {
	    var index = ++this.contextIndex;
	    var context = provider.type._context;
	    var threadID = this.threadID;
	    validateContextBounds(context, threadID);
	    var previousValue = context[threadID];
	
	    // Remember which value to restore this context to on our way up.
	    this.contextStack[index] = context;
	    this.contextValueStack[index] = previousValue;
	    {
	      // Only used for push/pop mismatch warnings.
	      this.contextProviderStack[index] = provider;
	    }
	
	    // Mutate the current value.
	    context[threadID] = provider.props.value;
	  };
	
	  ReactDOMServerRenderer.prototype.popProvider = function popProvider(provider) {
	    var index = this.contextIndex;
	    {
	      !(index > -1 && provider === this.contextProviderStack[index]) ? warningWithoutStack$1(false, 'Unexpected pop.') : void 0;
	    }
	
	    var context = this.contextStack[index];
	    var previousValue = this.contextValueStack[index];
	
	    // "Hide" these null assignments from Flow by using `any`
	    // because conceptually they are deletions--as long as we
	    // promise to never access values beyond `this.contextIndex`.
	    this.contextStack[index] = null;
	    this.contextValueStack[index] = null;
	    {
	      this.contextProviderStack[index] = null;
	    }
	    this.contextIndex--;
	
	    // Restore to the previous value we stored as we were walking down.
	    // We've already verified that this context has been expanded to accommodate
	    // this thread id, so we don't need to do it again.
	    context[this.threadID] = previousValue;
	  };
	
	  ReactDOMServerRenderer.prototype.read = function read(bytes) {
	    if (this.exhausted) {
	      return null;
	    }
	
	    var prevThreadID = currentThreadID;
	    setCurrentThreadID(this.threadID);
	    var prevDispatcher = ReactCurrentOwner.currentDispatcher;
	    if (enableHooks) {
	      ReactCurrentOwner.currentDispatcher = Dispatcher;
	    } else {
	      ReactCurrentOwner.currentDispatcher = DispatcherWithoutHooks;
	    }
	    try {
	      // Markup generated within <Suspense> ends up buffered until we know
	      // nothing in that boundary suspended
	      var out = [''];
	      var suspended = false;
	      while (out[0].length < bytes) {
	        if (this.stack.length === 0) {
	          this.exhausted = true;
	          freeThreadID(this.threadID);
	          break;
	        }
	        var frame = this.stack[this.stack.length - 1];
	        if (suspended || frame.childIndex >= frame.children.length) {
	          var _footer = frame.footer;
	          if (_footer !== '') {
	            this.previousWasTextNode = false;
	          }
	          this.stack.pop();
	          if (frame.type === 'select') {
	            this.currentSelectValue = null;
	          } else if (frame.type != null && frame.type.type != null && frame.type.type.$$typeof === REACT_PROVIDER_TYPE) {
	            var provider = frame.type;
	            this.popProvider(provider);
	          } else if (frame.type === REACT_SUSPENSE_TYPE) {
	            this.suspenseDepth--;
	            var buffered = out.pop();
	
	            if (suspended) {
	              suspended = false;
	              // If rendering was suspended at this boundary, render the fallbackFrame
	              var _fallbackFrame = frame.fallbackFrame;
	              !_fallbackFrame ? invariant(false, 'suspense fallback not found, something is broken') : void 0;
	              this.stack.push(_fallbackFrame);
	              // Skip flushing output since we're switching to the fallback
	              continue;
	            } else {
	              out[this.suspenseDepth] += buffered;
	            }
	          }
	
	          // Flush output
	          out[this.suspenseDepth] += _footer;
	          continue;
	        }
	        var child = frame.children[frame.childIndex++];
	
	        var outBuffer = '';
	        {
	          pushCurrentDebugStack(this.stack);
	          // We're starting work on this frame, so reset its inner stack.
	          frame.debugElementStack.length = 0;
	        }
	        try {
	          outBuffer += this.render(child, frame.context, frame.domNamespace);
	        } catch (err) {
	          if (enableSuspenseServerRenderer && typeof err.then === 'function') {
	            suspended = true;
	          } else {
	            throw err;
	          }
	        } finally {
	          {
	            popCurrentDebugStack();
	          }
	        }
	        if (out.length <= this.suspenseDepth) {
	          out.push('');
	        }
	        out[this.suspenseDepth] += outBuffer;
	      }
	      return out[0];
	    } finally {
	      ReactCurrentOwner.currentDispatcher = prevDispatcher;
	      setCurrentThreadID(prevThreadID);
	    }
	  };
	
	  ReactDOMServerRenderer.prototype.render = function render(child, context, parentNamespace) {
	    if (typeof child === 'string' || typeof child === 'number') {
	      var text = '' + child;
	      if (text === '') {
	        return '';
	      }
	      if (this.makeStaticMarkup) {
	        return escapeTextForBrowser(text);
	      }
	      if (this.previousWasTextNode) {
	        return '<!-- -->' + escapeTextForBrowser(text);
	      }
	      this.previousWasTextNode = true;
	      return escapeTextForBrowser(text);
	    } else {
	      var nextChild = void 0;
	
	      var _resolve = resolve(child, context, this.threadID);
	
	      nextChild = _resolve.child;
	      context = _resolve.context;
	
	      if (nextChild === null || nextChild === false) {
	        return '';
	      } else if (!React.isValidElement(nextChild)) {
	        if (nextChild != null && nextChild.$$typeof != null) {
	          // Catch unexpected special types early.
	          var $$typeof = nextChild.$$typeof;
	          !($$typeof !== REACT_PORTAL_TYPE) ? invariant(false, 'Portals are not currently supported by the server renderer. Render them conditionally so that they only appear on the client render.') : void 0;
	          // Catch-all to prevent an infinite loop if React.Children.toArray() supports some new type.
	          invariant(false, 'Unknown element-like object type: %s. This is likely a bug in React. Please file an issue.', $$typeof.toString());
	        }
	        var nextChildren = toArray(nextChild);
	        var frame = {
	          type: null,
	          domNamespace: parentNamespace,
	          children: nextChildren,
	          childIndex: 0,
	          context: context,
	          footer: ''
	        };
	        {
	          frame.debugElementStack = [];
	        }
	        this.stack.push(frame);
	        return '';
	      }
	      // Safe because we just checked it's an element.
	      var nextElement = nextChild;
	      var elementType = nextElement.type;
	
	      if (typeof elementType === 'string') {
	        return this.renderDOM(nextElement, context, parentNamespace);
	      }
	
	      switch (elementType) {
	        case REACT_STRICT_MODE_TYPE:
	        case REACT_CONCURRENT_MODE_TYPE:
	        case REACT_PROFILER_TYPE:
	        case REACT_FRAGMENT_TYPE:
	          {
	            var _nextChildren = toArray(nextChild.props.children);
	            var _frame = {
	              type: null,
	              domNamespace: parentNamespace,
	              children: _nextChildren,
	              childIndex: 0,
	              context: context,
	              footer: ''
	            };
	            {
	              _frame.debugElementStack = [];
	            }
	            this.stack.push(_frame);
	            return '';
	          }
	        case REACT_SUSPENSE_TYPE:
	          {
	            if (enableSuspenseServerRenderer) {
	              var fallbackChildren = toArray(nextChild.props.fallback);
	              var _nextChildren2 = toArray(nextChild.props.children);
	              var _fallbackFrame2 = {
	                type: null,
	                domNamespace: parentNamespace,
	                children: fallbackChildren,
	                childIndex: 0,
	                context: context,
	                footer: '',
	                out: ''
	              };
	              var _frame2 = {
	                fallbackFrame: _fallbackFrame2,
	                type: REACT_SUSPENSE_TYPE,
	                domNamespace: parentNamespace,
	                children: _nextChildren2,
	                childIndex: 0,
	                context: context,
	                footer: ''
	              };
	              {
	                _frame2.debugElementStack = [];
	                _fallbackFrame2.debugElementStack = [];
	              }
	              this.stack.push(_frame2);
	              this.suspenseDepth++;
	              return '';
	            } else {
	              invariant(false, 'ReactDOMServer does not yet support Suspense.');
	            }
	          }
	        // eslint-disable-next-line-no-fallthrough
	        default:
	          break;
	      }
	      if (typeof elementType === 'object' && elementType !== null) {
	        switch (elementType.$$typeof) {
	          case REACT_FORWARD_REF_TYPE:
	            {
	              var element = nextChild;
	              var _nextChildren3 = void 0;
	              var componentIdentity = {};
	              prepareToUseHooks(componentIdentity);
	              _nextChildren3 = elementType.render(element.props, element.ref);
	              _nextChildren3 = finishHooks(elementType.render, element.props, _nextChildren3, element.ref);
	              _nextChildren3 = toArray(_nextChildren3);
	              var _frame3 = {
	                type: null,
	                domNamespace: parentNamespace,
	                children: _nextChildren3,
	                childIndex: 0,
	                context: context,
	                footer: ''
	              };
	              {
	                _frame3.debugElementStack = [];
	              }
	              this.stack.push(_frame3);
	              return '';
	            }
	          case REACT_MEMO_TYPE:
	            {
	              var _element = nextChild;
	              var _nextChildren4 = [React.createElement(elementType.type, _assign({ ref: _element.ref }, _element.props))];
	              var _frame4 = {
	                type: null,
	                domNamespace: parentNamespace,
	                children: _nextChildren4,
	                childIndex: 0,
	                context: context,
	                footer: ''
	              };
	              {
	                _frame4.debugElementStack = [];
	              }
	              this.stack.push(_frame4);
	              return '';
	            }
	          case REACT_PROVIDER_TYPE:
	            {
	              var provider = nextChild;
	              var nextProps = provider.props;
	              var _nextChildren5 = toArray(nextProps.children);
	              var _frame5 = {
	                type: provider,
	                domNamespace: parentNamespace,
	                children: _nextChildren5,
	                childIndex: 0,
	                context: context,
	                footer: ''
	              };
	              {
	                _frame5.debugElementStack = [];
	              }
	
	              this.pushProvider(provider);
	
	              this.stack.push(_frame5);
	              return '';
	            }
	          case REACT_CONTEXT_TYPE:
	            {
	              var reactContext = nextChild.type;
	              // The logic below for Context differs depending on PROD or DEV mode. In
	              // DEV mode, we create a separate object for Context.Consumer that acts
	              // like a proxy to Context. This proxy object adds unnecessary code in PROD
	              // so we use the old behaviour (Context.Consumer references Context) to
	              // reduce size and overhead. The separate object references context via
	              // a property called "_context", which also gives us the ability to check
	              // in DEV mode if this property exists or not and warn if it does not.
	              {
	                if (reactContext._context === undefined) {
	                  // This may be because it's a Context (rather than a Consumer).
	                  // Or it may be because it's older React where they're the same thing.
	                  // We only want to warn if we're sure it's a new React.
	                  if (reactContext !== reactContext.Consumer) {
	                    if (!hasWarnedAboutUsingContextAsConsumer) {
	                      hasWarnedAboutUsingContextAsConsumer = true;
	                      warning$1(false, 'Rendering <Context> directly is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
	                    }
	                  }
	                } else {
	                  reactContext = reactContext._context;
	                }
	              }
	              var _nextProps = nextChild.props;
	              var threadID = this.threadID;
	              validateContextBounds(reactContext, threadID);
	              var nextValue = reactContext[threadID];
	
	              var _nextChildren6 = toArray(_nextProps.children(nextValue));
	              var _frame6 = {
	                type: nextChild,
	                domNamespace: parentNamespace,
	                children: _nextChildren6,
	                childIndex: 0,
	                context: context,
	                footer: ''
	              };
	              {
	                _frame6.debugElementStack = [];
	              }
	              this.stack.push(_frame6);
	              return '';
	            }
	          case REACT_LAZY_TYPE:
	            invariant(false, 'ReactDOMServer does not yet support lazy-loaded components.');
	        }
	      }
	
	      var info = '';
	      {
	        var owner = nextElement._owner;
	        if (elementType === undefined || typeof elementType === 'object' && elementType !== null && Object.keys(elementType).length === 0) {
	          info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and " + 'named imports.';
	        }
	        var ownerName = owner ? getComponentName(owner) : null;
	        if (ownerName) {
	          info += '\n\nCheck the render method of `' + ownerName + '`.';
	        }
	      }
	      invariant(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', elementType == null ? elementType : typeof elementType, info);
	    }
	  };
	
	  ReactDOMServerRenderer.prototype.renderDOM = function renderDOM(element, context, parentNamespace) {
	    var tag = element.type.toLowerCase();
	
	    var namespace = parentNamespace;
	    if (parentNamespace === Namespaces.html) {
	      namespace = getIntrinsicNamespace(tag);
	    }
	
	    {
	      if (namespace === Namespaces.html) {
	        // Should this check be gated by parent namespace? Not sure we want to
	        // allow <SVG> or <mATH>.
	        !(tag === element.type) ? warning$1(false, '<%s /> is using incorrect casing. ' + 'Use PascalCase for React components, ' + 'or lowercase for HTML elements.', element.type) : void 0;
	      }
	    }
	
	    validateDangerousTag(tag);
	
	    var props = element.props;
	    if (tag === 'input') {
	      {
	        ReactControlledValuePropTypes.checkPropTypes('input', props);
	
	        if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnDefaultChecked) {
	          warning$1(false, '%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', 'A component', props.type);
	          didWarnDefaultChecked = true;
	        }
	        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultInputValue) {
	          warning$1(false, '%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', 'A component', props.type);
	          didWarnDefaultInputValue = true;
	        }
	      }
	
	      props = _assign({
	        type: undefined
	      }, props, {
	        defaultChecked: undefined,
	        defaultValue: undefined,
	        value: props.value != null ? props.value : props.defaultValue,
	        checked: props.checked != null ? props.checked : props.defaultChecked
	      });
	    } else if (tag === 'textarea') {
	      {
	        ReactControlledValuePropTypes.checkPropTypes('textarea', props);
	        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultTextareaValue) {
	          warning$1(false, 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
	          didWarnDefaultTextareaValue = true;
	        }
	      }
	
	      var initialValue = props.value;
	      if (initialValue == null) {
	        var defaultValue = props.defaultValue;
	        // TODO (yungsters): Remove support for children content in <textarea>.
	        var textareaChildren = props.children;
	        if (textareaChildren != null) {
	          {
	            warning$1(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.');
	          }
	          !(defaultValue == null) ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : void 0;
	          if (Array.isArray(textareaChildren)) {
	            !(textareaChildren.length <= 1) ? invariant(false, '<textarea> can only have at most one child.') : void 0;
	            textareaChildren = textareaChildren[0];
	          }
	
	          defaultValue = '' + textareaChildren;
	        }
	        if (defaultValue == null) {
	          defaultValue = '';
	        }
	        initialValue = defaultValue;
	      }
	
	      props = _assign({}, props, {
	        value: undefined,
	        children: '' + initialValue
	      });
	    } else if (tag === 'select') {
	      {
	        ReactControlledValuePropTypes.checkPropTypes('select', props);
	
	        for (var i = 0; i < valuePropNames.length; i++) {
	          var propName = valuePropNames[i];
	          if (props[propName] == null) {
	            continue;
	          }
	          var isArray = Array.isArray(props[propName]);
	          if (props.multiple && !isArray) {
	            warning$1(false, 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.', propName);
	          } else if (!props.multiple && isArray) {
	            warning$1(false, 'The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.', propName);
	          }
	        }
	
	        if (props.value !== undefined && props.defaultValue !== undefined && !didWarnDefaultSelectValue) {
	          warning$1(false, 'Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
	          didWarnDefaultSelectValue = true;
	        }
	      }
	      this.currentSelectValue = props.value != null ? props.value : props.defaultValue;
	      props = _assign({}, props, {
	        value: undefined
	      });
	    } else if (tag === 'option') {
	      var selected = null;
	      var selectValue = this.currentSelectValue;
	      var optionChildren = flattenOptionChildren(props.children);
	      if (selectValue != null) {
	        var value = void 0;
	        if (props.value != null) {
	          value = props.value + '';
	        } else {
	          value = optionChildren;
	        }
	        selected = false;
	        if (Array.isArray(selectValue)) {
	          // multiple
	          for (var j = 0; j < selectValue.length; j++) {
	            if ('' + selectValue[j] === value) {
	              selected = true;
	              break;
	            }
	          }
	        } else {
	          selected = '' + selectValue === value;
	        }
	
	        props = _assign({
	          selected: undefined,
	          children: undefined
	        }, props, {
	          selected: selected,
	          children: optionChildren
	        });
	      }
	    }
	
	    {
	      validatePropertiesInDevelopment(tag, props);
	    }
	
	    assertValidProps(tag, props);
	
	    var out = createOpenTagMarkup(element.type, tag, props, namespace, this.makeStaticMarkup, this.stack.length === 1);
	    var footer = '';
	    if (omittedCloseTags.hasOwnProperty(tag)) {
	      out += '/>';
	    } else {
	      out += '>';
	      footer = '</' + element.type + '>';
	    }
	    var children = void 0;
	    var innerMarkup = getNonChildrenInnerMarkup(props);
	    if (innerMarkup != null) {
	      children = [];
	      if (newlineEatingTags[tag] && innerMarkup.charAt(0) === '\n') {
	        // text/html ignores the first character in these tags if it's a newline
	        // Prefer to break application/xml over text/html (for now) by adding
	        // a newline specifically to get eaten by the parser. (Alternately for
	        // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
	        // \r is normalized out by HTMLTextAreaElement#value.)
	        // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
	        // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
	        // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
	        // See: Parsing of "textarea" "listing" and "pre" elements
	        //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
	        out += '\n';
	      }
	      out += innerMarkup;
	    } else {
	      children = toArray(props.children);
	    }
	    var frame = {
	      domNamespace: getChildNamespace(parentNamespace, element.type),
	      type: tag,
	      children: children,
	      childIndex: 0,
	      context: context,
	      footer: footer
	    };
	    {
	      frame.debugElementStack = [];
	    }
	    this.stack.push(frame);
	    this.previousWasTextNode = false;
	    return out;
	  };
	
	  return ReactDOMServerRenderer;
	}();
	
	/**
	 * Render a ReactElement to its initial HTML. This should only be used on the
	 * server.
	 * See https://reactjs.org/docs/react-dom-server.html#rendertostring
	 */
	function renderToString(element) {
	  var renderer = new ReactDOMServerRenderer(element, false);
	  try {
	    var markup = renderer.read(Infinity);
	    return markup;
	  } finally {
	    renderer.destroy();
	  }
	}
	
	/**
	 * Similar to renderToString, except this doesn't create extra DOM attributes
	 * such as data-react-id that React uses internally.
	 * See https://reactjs.org/docs/react-dom-server.html#rendertostaticmarkup
	 */
	function renderToStaticMarkup(element) {
	  var renderer = new ReactDOMServerRenderer(element, true);
	  try {
	    var markup = renderer.read(Infinity);
	    return markup;
	  } finally {
	    renderer.destroy();
	  }
	}
	
	function renderToNodeStream() {
	  invariant(false, 'ReactDOMServer.renderToNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToString() instead.');
	}
	
	function renderToStaticNodeStream() {
	  invariant(false, 'ReactDOMServer.renderToStaticNodeStream(): The streaming API is not available in the browser. Use ReactDOMServer.renderToStaticMarkup() instead.');
	}
	
	// Note: when changing this, also consider https://github.com/facebook/react/issues/11526
	var ReactDOMServerBrowser = {
	  renderToString: renderToString,
	  renderToStaticMarkup: renderToStaticMarkup,
	  renderToNodeStream: renderToNodeStream,
	  renderToStaticNodeStream: renderToStaticNodeStream,
	  version: ReactVersion
	};
	
	var ReactDOMServerBrowser$1 = Object.freeze({
		default: ReactDOMServerBrowser
	});
	
	var ReactDOMServer = ( ReactDOMServerBrowser$1 && ReactDOMServerBrowser ) || ReactDOMServerBrowser$1;
	
	// TODO: decide on the top-level export form.
	// This is hacky but makes it work with both Rollup and Jest
	var server_browser = ReactDOMServer.default || ReactDOMServer;
	
	module.exports = server_browser;
	  })();
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/~/node-libs-browser/~/process/browser.js */ 4)))

/***/ }),
/* 22 */
/*!**********************!*\
  !*** ./src/mixin.js ***!
  \**********************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var Quill = __webpack_require__(/*! quill */ 23);
	
	var QuillMixin = {
	
		/**
		Creates an editor on the given element. The editor will
		be passed the configuration, have its events bound,
		*/
		createEditor: function($el, config) {
			var editor = new Quill($el, config);
			this.hookEditor(editor);
			return editor;
		},
	
		hookEditor: function(editor) {
			editor.on('text-change', function(delta, source) {
				if (this.onEditorChange) {
					this.onEditorChange(editor.getHTML(), delta, source);
				}
			}.bind(this));
	
			editor.on('selection-change', function(range, source) {
				if (this.onEditorChangeSelection) {
					this.onEditorChangeSelection(range, source);
				}
			}.bind(this));
		},
	
		destroyEditor: function(editor) {
			editor.destroy();
		},
	
		setEditorReadOnly: function(editor, value) {
			value? editor.editor.disable()
			     : editor.editor.enable();
		},
	
		/*
		Replace the contents of the editor, but keep
		the previous selection hanging around so that
		the cursor won't move.
		*/
		setEditorContents: function(editor, value) {
			var sel = editor.getSelection();
			editor.setHTML(value || '');
			if (sel) this.setEditorSelection(editor, sel);
		},
	
		setEditorSelection: function(editor, range) {
			if (range) {
				// Validate bounds before applying.
				var length = editor.getLength();
				range.start = Math.max(0, Math.min(range.start, length-1));
				range.end = Math.max(range.start, Math.min(range.end, length-1));
			}
			editor.setSelection(range);
		}
	
	};
	
	module.exports = QuillMixin;


/***/ }),
/* 23 */
/*!**************************************************************************************!*\
  !*** external {"commonjs":"quill","commonjs2":"quill","amd":"quill","root":"Quill"} ***!
  \**************************************************************************************/
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_23__;

/***/ })
/******/ ])
});
;
//# sourceMappingURL=react-quill.js.map