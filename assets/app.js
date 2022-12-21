/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/alpinejs/dist/module.esm.js":
/*!**************************************************!*\
  !*** ./node_modules/alpinejs/dist/module.esm.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ module_default)
/* harmony export */ });
// packages/alpinejs/src/scheduler.js
var flushPending = false;
var flushing = false;
var queue = [];
function scheduler(callback) {
  queueJob(callback);
}
function queueJob(job) {
  if (!queue.includes(job))
    queue.push(job);
  queueFlush();
}
function dequeueJob(job) {
  let index = queue.indexOf(job);
  if (index !== -1)
    queue.splice(index, 1);
}
function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}
function flushJobs() {
  flushPending = false;
  flushing = true;
  for (let i = 0; i < queue.length; i++) {
    queue[i]();
  }
  queue.length = 0;
  flushing = false;
}

// packages/alpinejs/src/reactivity.js
var reactive;
var effect;
var release;
var raw;
var shouldSchedule = true;
function disableEffectScheduling(callback) {
  shouldSchedule = false;
  callback();
  shouldSchedule = true;
}
function setReactivityEngine(engine) {
  reactive = engine.reactive;
  release = engine.release;
  effect = (callback) => engine.effect(callback, {scheduler: (task) => {
    if (shouldSchedule) {
      scheduler(task);
    } else {
      task();
    }
  }});
  raw = engine.raw;
}
function overrideEffect(override) {
  effect = override;
}
function elementBoundEffect(el) {
  let cleanup2 = () => {
  };
  let wrappedEffect = (callback) => {
    let effectReference = effect(callback);
    if (!el._x_effects) {
      el._x_effects = new Set();
      el._x_runEffects = () => {
        el._x_effects.forEach((i) => i());
      };
    }
    el._x_effects.add(effectReference);
    cleanup2 = () => {
      if (effectReference === void 0)
        return;
      el._x_effects.delete(effectReference);
      release(effectReference);
    };
    return effectReference;
  };
  return [wrappedEffect, () => {
    cleanup2();
  }];
}

// packages/alpinejs/src/mutation.js
var onAttributeAddeds = [];
var onElRemoveds = [];
var onElAddeds = [];
function onElAdded(callback) {
  onElAddeds.push(callback);
}
function onElRemoved(el, callback) {
  if (typeof callback === "function") {
    if (!el._x_cleanups)
      el._x_cleanups = [];
    el._x_cleanups.push(callback);
  } else {
    callback = el;
    onElRemoveds.push(callback);
  }
}
function onAttributesAdded(callback) {
  onAttributeAddeds.push(callback);
}
function onAttributeRemoved(el, name, callback) {
  if (!el._x_attributeCleanups)
    el._x_attributeCleanups = {};
  if (!el._x_attributeCleanups[name])
    el._x_attributeCleanups[name] = [];
  el._x_attributeCleanups[name].push(callback);
}
function cleanupAttributes(el, names) {
  if (!el._x_attributeCleanups)
    return;
  Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
    if (names === void 0 || names.includes(name)) {
      value.forEach((i) => i());
      delete el._x_attributeCleanups[name];
    }
  });
}
var observer = new MutationObserver(onMutate);
var currentlyObserving = false;
function startObservingMutations() {
  observer.observe(document, {subtree: true, childList: true, attributes: true, attributeOldValue: true});
  currentlyObserving = true;
}
function stopObservingMutations() {
  flushObserver();
  observer.disconnect();
  currentlyObserving = false;
}
var recordQueue = [];
var willProcessRecordQueue = false;
function flushObserver() {
  recordQueue = recordQueue.concat(observer.takeRecords());
  if (recordQueue.length && !willProcessRecordQueue) {
    willProcessRecordQueue = true;
    queueMicrotask(() => {
      processRecordQueue();
      willProcessRecordQueue = false;
    });
  }
}
function processRecordQueue() {
  onMutate(recordQueue);
  recordQueue.length = 0;
}
function mutateDom(callback) {
  if (!currentlyObserving)
    return callback();
  stopObservingMutations();
  let result = callback();
  startObservingMutations();
  return result;
}
var isCollecting = false;
var deferredMutations = [];
function deferMutations() {
  isCollecting = true;
}
function flushAndStopDeferringMutations() {
  isCollecting = false;
  onMutate(deferredMutations);
  deferredMutations = [];
}
function onMutate(mutations) {
  if (isCollecting) {
    deferredMutations = deferredMutations.concat(mutations);
    return;
  }
  let addedNodes = [];
  let removedNodes = [];
  let addedAttributes = new Map();
  let removedAttributes = new Map();
  for (let i = 0; i < mutations.length; i++) {
    if (mutations[i].target._x_ignoreMutationObserver)
      continue;
    if (mutations[i].type === "childList") {
      mutations[i].addedNodes.forEach((node) => node.nodeType === 1 && addedNodes.push(node));
      mutations[i].removedNodes.forEach((node) => node.nodeType === 1 && removedNodes.push(node));
    }
    if (mutations[i].type === "attributes") {
      let el = mutations[i].target;
      let name = mutations[i].attributeName;
      let oldValue = mutations[i].oldValue;
      let add2 = () => {
        if (!addedAttributes.has(el))
          addedAttributes.set(el, []);
        addedAttributes.get(el).push({name, value: el.getAttribute(name)});
      };
      let remove = () => {
        if (!removedAttributes.has(el))
          removedAttributes.set(el, []);
        removedAttributes.get(el).push(name);
      };
      if (el.hasAttribute(name) && oldValue === null) {
        add2();
      } else if (el.hasAttribute(name)) {
        remove();
        add2();
      } else {
        remove();
      }
    }
  }
  removedAttributes.forEach((attrs, el) => {
    cleanupAttributes(el, attrs);
  });
  addedAttributes.forEach((attrs, el) => {
    onAttributeAddeds.forEach((i) => i(el, attrs));
  });
  for (let node of removedNodes) {
    if (addedNodes.includes(node))
      continue;
    onElRemoveds.forEach((i) => i(node));
    if (node._x_cleanups) {
      while (node._x_cleanups.length)
        node._x_cleanups.pop()();
    }
  }
  addedNodes.forEach((node) => {
    node._x_ignoreSelf = true;
    node._x_ignore = true;
  });
  for (let node of addedNodes) {
    if (removedNodes.includes(node))
      continue;
    if (!node.isConnected)
      continue;
    delete node._x_ignoreSelf;
    delete node._x_ignore;
    onElAddeds.forEach((i) => i(node));
    node._x_ignore = true;
    node._x_ignoreSelf = true;
  }
  addedNodes.forEach((node) => {
    delete node._x_ignoreSelf;
    delete node._x_ignore;
  });
  addedNodes = null;
  removedNodes = null;
  addedAttributes = null;
  removedAttributes = null;
}

// packages/alpinejs/src/scope.js
function scope(node) {
  return mergeProxies(closestDataStack(node));
}
function addScopeToNode(node, data2, referenceNode) {
  node._x_dataStack = [data2, ...closestDataStack(referenceNode || node)];
  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data2);
  };
}
function refreshScope(element, scope2) {
  let existingScope = element._x_dataStack[0];
  Object.entries(scope2).forEach(([key, value]) => {
    existingScope[key] = value;
  });
}
function closestDataStack(node) {
  if (node._x_dataStack)
    return node._x_dataStack;
  if (typeof ShadowRoot === "function" && node instanceof ShadowRoot) {
    return closestDataStack(node.host);
  }
  if (!node.parentNode) {
    return [];
  }
  return closestDataStack(node.parentNode);
}
function mergeProxies(objects) {
  let thisProxy = new Proxy({}, {
    ownKeys: () => {
      return Array.from(new Set(objects.flatMap((i) => Object.keys(i))));
    },
    has: (target, name) => {
      return objects.some((obj) => obj.hasOwnProperty(name));
    },
    get: (target, name) => {
      return (objects.find((obj) => {
        if (obj.hasOwnProperty(name)) {
          let descriptor = Object.getOwnPropertyDescriptor(obj, name);
          if (descriptor.get && descriptor.get._x_alreadyBound || descriptor.set && descriptor.set._x_alreadyBound) {
            return true;
          }
          if ((descriptor.get || descriptor.set) && descriptor.enumerable) {
            let getter = descriptor.get;
            let setter = descriptor.set;
            let property = descriptor;
            getter = getter && getter.bind(thisProxy);
            setter = setter && setter.bind(thisProxy);
            if (getter)
              getter._x_alreadyBound = true;
            if (setter)
              setter._x_alreadyBound = true;
            Object.defineProperty(obj, name, {
              ...property,
              get: getter,
              set: setter
            });
          }
          return true;
        }
        return false;
      }) || {})[name];
    },
    set: (target, name, value) => {
      let closestObjectWithKey = objects.find((obj) => obj.hasOwnProperty(name));
      if (closestObjectWithKey) {
        closestObjectWithKey[name] = value;
      } else {
        objects[objects.length - 1][name] = value;
      }
      return true;
    }
  });
  return thisProxy;
}

// packages/alpinejs/src/interceptor.js
function initInterceptors(data2) {
  let isObject2 = (val) => typeof val === "object" && !Array.isArray(val) && val !== null;
  let recurse = (obj, basePath = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(obj)).forEach(([key, {value, enumerable}]) => {
      if (enumerable === false || value === void 0)
        return;
      let path = basePath === "" ? key : `${basePath}.${key}`;
      if (typeof value === "object" && value !== null && value._x_interceptor) {
        obj[key] = value.initialize(data2, path, key);
      } else {
        if (isObject2(value) && value !== obj && !(value instanceof Element)) {
          recurse(value, path);
        }
      }
    });
  };
  return recurse(data2);
}
function interceptor(callback, mutateObj = () => {
}) {
  let obj = {
    initialValue: void 0,
    _x_interceptor: true,
    initialize(data2, path, key) {
      return callback(this.initialValue, () => get(data2, path), (value) => set(data2, path, value), path, key);
    }
  };
  mutateObj(obj);
  return (initialValue) => {
    if (typeof initialValue === "object" && initialValue !== null && initialValue._x_interceptor) {
      let initialize = obj.initialize.bind(obj);
      obj.initialize = (data2, path, key) => {
        let innerValue = initialValue.initialize(data2, path, key);
        obj.initialValue = innerValue;
        return initialize(data2, path, key);
      };
    } else {
      obj.initialValue = initialValue;
    }
    return obj;
  };
}
function get(obj, path) {
  return path.split(".").reduce((carry, segment) => carry[segment], obj);
}
function set(obj, path, value) {
  if (typeof path === "string")
    path = path.split(".");
  if (path.length === 1)
    obj[path[0]] = value;
  else if (path.length === 0)
    throw error;
  else {
    if (obj[path[0]])
      return set(obj[path[0]], path.slice(1), value);
    else {
      obj[path[0]] = {};
      return set(obj[path[0]], path.slice(1), value);
    }
  }
}

// packages/alpinejs/src/magics.js
var magics = {};
function magic(name, callback) {
  magics[name] = callback;
}
function injectMagics(obj, el) {
  Object.entries(magics).forEach(([name, callback]) => {
    Object.defineProperty(obj, `$${name}`, {
      get() {
        let [utilities, cleanup2] = getElementBoundUtilities(el);
        utilities = {interceptor, ...utilities};
        onElRemoved(el, cleanup2);
        return callback(el, utilities);
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/utils/error.js
function tryCatch(el, expression, callback, ...args) {
  try {
    return callback(...args);
  } catch (e) {
    handleError(e, el, expression);
  }
}
function handleError(error2, el, expression = void 0) {
  Object.assign(error2, {el, expression});
  console.warn(`Alpine Expression Error: ${error2.message}

${expression ? 'Expression: "' + expression + '"\n\n' : ""}`, el);
  setTimeout(() => {
    throw error2;
  }, 0);
}

// packages/alpinejs/src/evaluator.js
var shouldAutoEvaluateFunctions = true;
function dontAutoEvaluateFunctions(callback) {
  let cache = shouldAutoEvaluateFunctions;
  shouldAutoEvaluateFunctions = false;
  callback();
  shouldAutoEvaluateFunctions = cache;
}
function evaluate(el, expression, extras = {}) {
  let result;
  evaluateLater(el, expression)((value) => result = value, extras);
  return result;
}
function evaluateLater(...args) {
  return theEvaluatorFunction(...args);
}
var theEvaluatorFunction = normalEvaluator;
function setEvaluator(newEvaluator) {
  theEvaluatorFunction = newEvaluator;
}
function normalEvaluator(el, expression) {
  let overriddenMagics = {};
  injectMagics(overriddenMagics, el);
  let dataStack = [overriddenMagics, ...closestDataStack(el)];
  if (typeof expression === "function") {
    return generateEvaluatorFromFunction(dataStack, expression);
  }
  let evaluator = generateEvaluatorFromString(dataStack, expression, el);
  return tryCatch.bind(null, el, expression, evaluator);
}
function generateEvaluatorFromFunction(dataStack, func) {
  return (receiver = () => {
  }, {scope: scope2 = {}, params = []} = {}) => {
    let result = func.apply(mergeProxies([scope2, ...dataStack]), params);
    runIfTypeOfFunction(receiver, result);
  };
}
var evaluatorMemo = {};
function generateFunctionFromString(expression, el) {
  if (evaluatorMemo[expression]) {
    return evaluatorMemo[expression];
  }
  let AsyncFunction = Object.getPrototypeOf(async function() {
  }).constructor;
  let rightSideSafeExpression = /^[\n\s]*if.*\(.*\)/.test(expression) || /^(let|const)\s/.test(expression) ? `(() => { ${expression} })()` : expression;
  const safeAsyncFunction = () => {
    try {
      return new AsyncFunction(["__self", "scope"], `with (scope) { __self.result = ${rightSideSafeExpression} }; __self.finished = true; return __self.result;`);
    } catch (error2) {
      handleError(error2, el, expression);
      return Promise.resolve();
    }
  };
  let func = safeAsyncFunction();
  evaluatorMemo[expression] = func;
  return func;
}
function generateEvaluatorFromString(dataStack, expression, el) {
  let func = generateFunctionFromString(expression, el);
  return (receiver = () => {
  }, {scope: scope2 = {}, params = []} = {}) => {
    func.result = void 0;
    func.finished = false;
    let completeScope = mergeProxies([scope2, ...dataStack]);
    if (typeof func === "function") {
      let promise = func(func, completeScope).catch((error2) => handleError(error2, el, expression));
      if (func.finished) {
        runIfTypeOfFunction(receiver, func.result, completeScope, params, el);
        func.result = void 0;
      } else {
        promise.then((result) => {
          runIfTypeOfFunction(receiver, result, completeScope, params, el);
        }).catch((error2) => handleError(error2, el, expression)).finally(() => func.result = void 0);
      }
    }
  };
}
function runIfTypeOfFunction(receiver, value, scope2, params, el) {
  if (shouldAutoEvaluateFunctions && typeof value === "function") {
    let result = value.apply(scope2, params);
    if (result instanceof Promise) {
      result.then((i) => runIfTypeOfFunction(receiver, i, scope2, params)).catch((error2) => handleError(error2, el, value));
    } else {
      receiver(result);
    }
  } else {
    receiver(value);
  }
}

// packages/alpinejs/src/directives.js
var prefixAsString = "x-";
function prefix(subject = "") {
  return prefixAsString + subject;
}
function setPrefix(newPrefix) {
  prefixAsString = newPrefix;
}
var directiveHandlers = {};
function directive(name, callback) {
  directiveHandlers[name] = callback;
}
function directives(el, attributes, originalAttributeOverride) {
  attributes = Array.from(attributes);
  if (el._x_virtualDirectives) {
    let vAttributes = Object.entries(el._x_virtualDirectives).map(([name, value]) => ({name, value}));
    let staticAttributes = attributesOnly(vAttributes);
    vAttributes = vAttributes.map((attribute) => {
      if (staticAttributes.find((attr) => attr.name === attribute.name)) {
        return {
          name: `x-bind:${attribute.name}`,
          value: `"${attribute.value}"`
        };
      }
      return attribute;
    });
    attributes = attributes.concat(vAttributes);
  }
  let transformedAttributeMap = {};
  let directives2 = attributes.map(toTransformedAttributes((newName, oldName) => transformedAttributeMap[newName] = oldName)).filter(outNonAlpineAttributes).map(toParsedDirectives(transformedAttributeMap, originalAttributeOverride)).sort(byPriority);
  return directives2.map((directive2) => {
    return getDirectiveHandler(el, directive2);
  });
}
function attributesOnly(attributes) {
  return Array.from(attributes).map(toTransformedAttributes()).filter((attr) => !outNonAlpineAttributes(attr));
}
var isDeferringHandlers = false;
var directiveHandlerStacks = new Map();
var currentHandlerStackKey = Symbol();
function deferHandlingDirectives(callback) {
  isDeferringHandlers = true;
  let key = Symbol();
  currentHandlerStackKey = key;
  directiveHandlerStacks.set(key, []);
  let flushHandlers = () => {
    while (directiveHandlerStacks.get(key).length)
      directiveHandlerStacks.get(key).shift()();
    directiveHandlerStacks.delete(key);
  };
  let stopDeferring = () => {
    isDeferringHandlers = false;
    flushHandlers();
  };
  callback(flushHandlers);
  stopDeferring();
}
function getElementBoundUtilities(el) {
  let cleanups = [];
  let cleanup2 = (callback) => cleanups.push(callback);
  let [effect3, cleanupEffect] = elementBoundEffect(el);
  cleanups.push(cleanupEffect);
  let utilities = {
    Alpine: alpine_default,
    effect: effect3,
    cleanup: cleanup2,
    evaluateLater: evaluateLater.bind(evaluateLater, el),
    evaluate: evaluate.bind(evaluate, el)
  };
  let doCleanup = () => cleanups.forEach((i) => i());
  return [utilities, doCleanup];
}
function getDirectiveHandler(el, directive2) {
  let noop = () => {
  };
  let handler3 = directiveHandlers[directive2.type] || noop;
  let [utilities, cleanup2] = getElementBoundUtilities(el);
  onAttributeRemoved(el, directive2.original, cleanup2);
  let fullHandler = () => {
    if (el._x_ignore || el._x_ignoreSelf)
      return;
    handler3.inline && handler3.inline(el, directive2, utilities);
    handler3 = handler3.bind(handler3, el, directive2, utilities);
    isDeferringHandlers ? directiveHandlerStacks.get(currentHandlerStackKey).push(handler3) : handler3();
  };
  fullHandler.runCleanups = cleanup2;
  return fullHandler;
}
var startingWith = (subject, replacement) => ({name, value}) => {
  if (name.startsWith(subject))
    name = name.replace(subject, replacement);
  return {name, value};
};
var into = (i) => i;
function toTransformedAttributes(callback = () => {
}) {
  return ({name, value}) => {
    let {name: newName, value: newValue} = attributeTransformers.reduce((carry, transform) => {
      return transform(carry);
    }, {name, value});
    if (newName !== name)
      callback(newName, name);
    return {name: newName, value: newValue};
  };
}
var attributeTransformers = [];
function mapAttributes(callback) {
  attributeTransformers.push(callback);
}
function outNonAlpineAttributes({name}) {
  return alpineAttributeRegex().test(name);
}
var alpineAttributeRegex = () => new RegExp(`^${prefixAsString}([^:^.]+)\\b`);
function toParsedDirectives(transformedAttributeMap, originalAttributeOverride) {
  return ({name, value}) => {
    let typeMatch = name.match(alpineAttributeRegex());
    let valueMatch = name.match(/:([a-zA-Z0-9\-:]+)/);
    let modifiers = name.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    let original = originalAttributeOverride || transformedAttributeMap[name] || name;
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map((i) => i.replace(".", "")),
      expression: value,
      original
    };
  };
}
var DEFAULT = "DEFAULT";
var directiveOrder = [
  "ignore",
  "ref",
  "data",
  "id",
  "radio",
  "tabs",
  "switch",
  "disclosure",
  "menu",
  "listbox",
  "list",
  "item",
  "combobox",
  "bind",
  "init",
  "for",
  "mask",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  DEFAULT,
  "teleport"
];
function byPriority(a, b) {
  let typeA = directiveOrder.indexOf(a.type) === -1 ? DEFAULT : a.type;
  let typeB = directiveOrder.indexOf(b.type) === -1 ? DEFAULT : b.type;
  return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
}

// packages/alpinejs/src/utils/dispatch.js
function dispatch(el, name, detail = {}) {
  el.dispatchEvent(new CustomEvent(name, {
    detail,
    bubbles: true,
    composed: true,
    cancelable: true
  }));
}

// packages/alpinejs/src/nextTick.js
var tickStack = [];
var isHolding = false;
function nextTick(callback = () => {
}) {
  queueMicrotask(() => {
    isHolding || setTimeout(() => {
      releaseNextTicks();
    });
  });
  return new Promise((res) => {
    tickStack.push(() => {
      callback();
      res();
    });
  });
}
function releaseNextTicks() {
  isHolding = false;
  while (tickStack.length)
    tickStack.shift()();
}
function holdNextTicks() {
  isHolding = true;
}

// packages/alpinejs/src/utils/walk.js
function walk(el, callback) {
  if (typeof ShadowRoot === "function" && el instanceof ShadowRoot) {
    Array.from(el.children).forEach((el2) => walk(el2, callback));
    return;
  }
  let skip = false;
  callback(el, () => skip = true);
  if (skip)
    return;
  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}

// packages/alpinejs/src/utils/warn.js
function warn(message, ...args) {
  console.warn(`Alpine Warning: ${message}`, ...args);
}

// packages/alpinejs/src/lifecycle.js
function start() {
  if (!document.body)
    warn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?");
  dispatch(document, "alpine:init");
  dispatch(document, "alpine:initializing");
  startObservingMutations();
  onElAdded((el) => initTree(el, walk));
  onElRemoved((el) => destroyTree(el));
  onAttributesAdded((el, attrs) => {
    directives(el, attrs).forEach((handle) => handle());
  });
  let outNestedComponents = (el) => !closestRoot(el.parentElement, true);
  Array.from(document.querySelectorAll(allSelectors())).filter(outNestedComponents).forEach((el) => {
    initTree(el);
  });
  dispatch(document, "alpine:initialized");
}
var rootSelectorCallbacks = [];
var initSelectorCallbacks = [];
function rootSelectors() {
  return rootSelectorCallbacks.map((fn) => fn());
}
function allSelectors() {
  return rootSelectorCallbacks.concat(initSelectorCallbacks).map((fn) => fn());
}
function addRootSelector(selectorCallback) {
  rootSelectorCallbacks.push(selectorCallback);
}
function addInitSelector(selectorCallback) {
  initSelectorCallbacks.push(selectorCallback);
}
function closestRoot(el, includeInitSelectors = false) {
  return findClosest(el, (element) => {
    const selectors = includeInitSelectors ? allSelectors() : rootSelectors();
    if (selectors.some((selector) => element.matches(selector)))
      return true;
  });
}
function findClosest(el, callback) {
  if (!el)
    return;
  if (callback(el))
    return el;
  if (el._x_teleportBack)
    el = el._x_teleportBack;
  if (!el.parentElement)
    return;
  return findClosest(el.parentElement, callback);
}
function isRoot(el) {
  return rootSelectors().some((selector) => el.matches(selector));
}
function initTree(el, walker = walk) {
  deferHandlingDirectives(() => {
    walker(el, (el2, skip) => {
      directives(el2, el2.attributes).forEach((handle) => handle());
      el2._x_ignore && skip();
    });
  });
}
function destroyTree(root) {
  walk(root, (el) => cleanupAttributes(el));
}

// packages/alpinejs/src/utils/classes.js
function setClasses(el, value) {
  if (Array.isArray(value)) {
    return setClassesFromString(el, value.join(" "));
  } else if (typeof value === "object" && value !== null) {
    return setClassesFromObject(el, value);
  } else if (typeof value === "function") {
    return setClasses(el, value());
  }
  return setClassesFromString(el, value);
}
function setClassesFromString(el, classString) {
  let split = (classString2) => classString2.split(" ").filter(Boolean);
  let missingClasses = (classString2) => classString2.split(" ").filter((i) => !el.classList.contains(i)).filter(Boolean);
  let addClassesAndReturnUndo = (classes) => {
    el.classList.add(...classes);
    return () => {
      el.classList.remove(...classes);
    };
  };
  classString = classString === true ? classString = "" : classString || "";
  return addClassesAndReturnUndo(missingClasses(classString));
}
function setClassesFromObject(el, classObject) {
  let split = (classString) => classString.split(" ").filter(Boolean);
  let forAdd = Object.entries(classObject).flatMap(([classString, bool]) => bool ? split(classString) : false).filter(Boolean);
  let forRemove = Object.entries(classObject).flatMap(([classString, bool]) => !bool ? split(classString) : false).filter(Boolean);
  let added = [];
  let removed = [];
  forRemove.forEach((i) => {
    if (el.classList.contains(i)) {
      el.classList.remove(i);
      removed.push(i);
    }
  });
  forAdd.forEach((i) => {
    if (!el.classList.contains(i)) {
      el.classList.add(i);
      added.push(i);
    }
  });
  return () => {
    removed.forEach((i) => el.classList.add(i));
    added.forEach((i) => el.classList.remove(i));
  };
}

// packages/alpinejs/src/utils/styles.js
function setStyles(el, value) {
  if (typeof value === "object" && value !== null) {
    return setStylesFromObject(el, value);
  }
  return setStylesFromString(el, value);
}
function setStylesFromObject(el, value) {
  let previousStyles = {};
  Object.entries(value).forEach(([key, value2]) => {
    previousStyles[key] = el.style[key];
    if (!key.startsWith("--")) {
      key = kebabCase(key);
    }
    el.style.setProperty(key, value2);
  });
  setTimeout(() => {
    if (el.style.length === 0) {
      el.removeAttribute("style");
    }
  });
  return () => {
    setStyles(el, previousStyles);
  };
}
function setStylesFromString(el, value) {
  let cache = el.getAttribute("style", value);
  el.setAttribute("style", value);
  return () => {
    el.setAttribute("style", cache || "");
  };
}
function kebabCase(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// packages/alpinejs/src/utils/once.js
function once(callback, fallback = () => {
}) {
  let called = false;
  return function() {
    if (!called) {
      called = true;
      callback.apply(this, arguments);
    } else {
      fallback.apply(this, arguments);
    }
  };
}

// packages/alpinejs/src/directives/x-transition.js
directive("transition", (el, {value, modifiers, expression}, {evaluate: evaluate2}) => {
  if (typeof expression === "function")
    expression = evaluate2(expression);
  if (!expression) {
    registerTransitionsFromHelper(el, modifiers, value);
  } else {
    registerTransitionsFromClassString(el, expression, value);
  }
});
function registerTransitionsFromClassString(el, classString, stage) {
  registerTransitionObject(el, setClasses, "");
  let directiveStorageMap = {
    enter: (classes) => {
      el._x_transition.enter.during = classes;
    },
    "enter-start": (classes) => {
      el._x_transition.enter.start = classes;
    },
    "enter-end": (classes) => {
      el._x_transition.enter.end = classes;
    },
    leave: (classes) => {
      el._x_transition.leave.during = classes;
    },
    "leave-start": (classes) => {
      el._x_transition.leave.start = classes;
    },
    "leave-end": (classes) => {
      el._x_transition.leave.end = classes;
    }
  };
  directiveStorageMap[stage](classString);
}
function registerTransitionsFromHelper(el, modifiers, stage) {
  registerTransitionObject(el, setStyles);
  let doesntSpecify = !modifiers.includes("in") && !modifiers.includes("out") && !stage;
  let transitioningIn = doesntSpecify || modifiers.includes("in") || ["enter"].includes(stage);
  let transitioningOut = doesntSpecify || modifiers.includes("out") || ["leave"].includes(stage);
  if (modifiers.includes("in") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index < modifiers.indexOf("out"));
  }
  if (modifiers.includes("out") && !doesntSpecify) {
    modifiers = modifiers.filter((i, index) => index > modifiers.indexOf("out"));
  }
  let wantsAll = !modifiers.includes("opacity") && !modifiers.includes("scale");
  let wantsOpacity = wantsAll || modifiers.includes("opacity");
  let wantsScale = wantsAll || modifiers.includes("scale");
  let opacityValue = wantsOpacity ? 0 : 1;
  let scaleValue = wantsScale ? modifierValue(modifiers, "scale", 95) / 100 : 1;
  let delay = modifierValue(modifiers, "delay", 0);
  let origin = modifierValue(modifiers, "origin", "center");
  let property = "opacity, transform";
  let durationIn = modifierValue(modifiers, "duration", 150) / 1e3;
  let durationOut = modifierValue(modifiers, "duration", 75) / 1e3;
  let easing = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
  if (transitioningIn) {
    el._x_transition.enter.during = {
      transformOrigin: origin,
      transitionDelay: delay,
      transitionProperty: property,
      transitionDuration: `${durationIn}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.enter.start = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
    el._x_transition.enter.end = {
      opacity: 1,
      transform: `scale(1)`
    };
  }
  if (transitioningOut) {
    el._x_transition.leave.during = {
      transformOrigin: origin,
      transitionDelay: delay,
      transitionProperty: property,
      transitionDuration: `${durationOut}s`,
      transitionTimingFunction: easing
    };
    el._x_transition.leave.start = {
      opacity: 1,
      transform: `scale(1)`
    };
    el._x_transition.leave.end = {
      opacity: opacityValue,
      transform: `scale(${scaleValue})`
    };
  }
}
function registerTransitionObject(el, setFunction, defaultValue = {}) {
  if (!el._x_transition)
    el._x_transition = {
      enter: {during: defaultValue, start: defaultValue, end: defaultValue},
      leave: {during: defaultValue, start: defaultValue, end: defaultValue},
      in(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.enter.during,
          start: this.enter.start,
          end: this.enter.end
        }, before, after);
      },
      out(before = () => {
      }, after = () => {
      }) {
        transition(el, setFunction, {
          during: this.leave.during,
          start: this.leave.start,
          end: this.leave.end
        }, before, after);
      }
    };
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(el, value, show, hide) {
  const nextTick2 = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let clickAwayCompatibleShow = () => nextTick2(show);
  if (value) {
    if (el._x_transition && (el._x_transition.enter || el._x_transition.leave)) {
      el._x_transition.enter && (Object.entries(el._x_transition.enter.during).length || Object.entries(el._x_transition.enter.start).length || Object.entries(el._x_transition.enter.end).length) ? el._x_transition.in(show) : clickAwayCompatibleShow();
    } else {
      el._x_transition ? el._x_transition.in(show) : clickAwayCompatibleShow();
    }
    return;
  }
  el._x_hidePromise = el._x_transition ? new Promise((resolve, reject) => {
    el._x_transition.out(() => {
    }, () => resolve(hide));
    el._x_transitioning.beforeCancel(() => reject({isFromCancelledTransition: true}));
  }) : Promise.resolve(hide);
  queueMicrotask(() => {
    let closest = closestHide(el);
    if (closest) {
      if (!closest._x_hideChildren)
        closest._x_hideChildren = [];
      closest._x_hideChildren.push(el);
    } else {
      nextTick2(() => {
        let hideAfterChildren = (el2) => {
          let carry = Promise.all([
            el2._x_hidePromise,
            ...(el2._x_hideChildren || []).map(hideAfterChildren)
          ]).then(([i]) => i());
          delete el2._x_hidePromise;
          delete el2._x_hideChildren;
          return carry;
        };
        hideAfterChildren(el).catch((e) => {
          if (!e.isFromCancelledTransition)
            throw e;
        });
      });
    }
  });
};
function closestHide(el) {
  let parent = el.parentNode;
  if (!parent)
    return;
  return parent._x_hidePromise ? parent : closestHide(parent);
}
function transition(el, setFunction, {during, start: start2, end} = {}, before = () => {
}, after = () => {
}) {
  if (el._x_transitioning)
    el._x_transitioning.cancel();
  if (Object.keys(during).length === 0 && Object.keys(start2).length === 0 && Object.keys(end).length === 0) {
    before();
    after();
    return;
  }
  let undoStart, undoDuring, undoEnd;
  performTransition(el, {
    start() {
      undoStart = setFunction(el, start2);
    },
    during() {
      undoDuring = setFunction(el, during);
    },
    before,
    end() {
      undoStart();
      undoEnd = setFunction(el, end);
    },
    after,
    cleanup() {
      undoDuring();
      undoEnd();
    }
  });
}
function performTransition(el, stages) {
  let interrupted, reachedBefore, reachedEnd;
  let finish = once(() => {
    mutateDom(() => {
      interrupted = true;
      if (!reachedBefore)
        stages.before();
      if (!reachedEnd) {
        stages.end();
        releaseNextTicks();
      }
      stages.after();
      if (el.isConnected)
        stages.cleanup();
      delete el._x_transitioning;
    });
  });
  el._x_transitioning = {
    beforeCancels: [],
    beforeCancel(callback) {
      this.beforeCancels.push(callback);
    },
    cancel: once(function() {
      while (this.beforeCancels.length) {
        this.beforeCancels.shift()();
      }
      ;
      finish();
    }),
    finish
  };
  mutateDom(() => {
    stages.start();
    stages.during();
  });
  holdNextTicks();
  requestAnimationFrame(() => {
    if (interrupted)
      return;
    let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3;
    let delay = Number(getComputedStyle(el).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    if (duration === 0)
      duration = Number(getComputedStyle(el).animationDuration.replace("s", "")) * 1e3;
    mutateDom(() => {
      stages.before();
    });
    reachedBefore = true;
    requestAnimationFrame(() => {
      if (interrupted)
        return;
      mutateDom(() => {
        stages.end();
      });
      releaseNextTicks();
      setTimeout(el._x_transitioning.finish, duration + delay);
      reachedEnd = true;
    });
  });
}
function modifierValue(modifiers, key, fallback) {
  if (modifiers.indexOf(key) === -1)
    return fallback;
  const rawValue = modifiers[modifiers.indexOf(key) + 1];
  if (!rawValue)
    return fallback;
  if (key === "scale") {
    if (isNaN(rawValue))
      return fallback;
  }
  if (key === "duration") {
    let match = rawValue.match(/([0-9]+)ms/);
    if (match)
      return match[1];
  }
  if (key === "origin") {
    if (["top", "right", "left", "center", "bottom"].includes(modifiers[modifiers.indexOf(key) + 2])) {
      return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(" ");
    }
  }
  return rawValue;
}

// packages/alpinejs/src/clone.js
var isCloning = false;
function skipDuringClone(callback, fallback = () => {
}) {
  return (...args) => isCloning ? fallback(...args) : callback(...args);
}
function clone(oldEl, newEl) {
  if (!newEl._x_dataStack)
    newEl._x_dataStack = oldEl._x_dataStack;
  isCloning = true;
  dontRegisterReactiveSideEffects(() => {
    cloneTree(newEl);
  });
  isCloning = false;
}
function cloneTree(el) {
  let hasRunThroughFirstEl = false;
  let shallowWalker = (el2, callback) => {
    walk(el2, (el3, skip) => {
      if (hasRunThroughFirstEl && isRoot(el3))
        return skip();
      hasRunThroughFirstEl = true;
      callback(el3, skip);
    });
  };
  initTree(el, shallowWalker);
}
function dontRegisterReactiveSideEffects(callback) {
  let cache = effect;
  overrideEffect((callback2, el) => {
    let storedEffect = cache(callback2);
    release(storedEffect);
    return () => {
    };
  });
  callback();
  overrideEffect(cache);
}

// packages/alpinejs/src/utils/bind.js
function bind(el, name, value, modifiers = []) {
  if (!el._x_bindings)
    el._x_bindings = reactive({});
  el._x_bindings[name] = value;
  name = modifiers.includes("camel") ? camelCase(name) : name;
  switch (name) {
    case "value":
      bindInputValue(el, value);
      break;
    case "style":
      bindStyles(el, value);
      break;
    case "class":
      bindClasses(el, value);
      break;
    default:
      bindAttribute(el, name, value);
      break;
  }
}
function bindInputValue(el, value) {
  if (el.type === "radio") {
    if (el.attributes.value === void 0) {
      el.value = value;
    }
    if (window.fromModel) {
      el.checked = checkedAttrLooseCompare(el.value, value);
    }
  } else if (el.type === "checkbox") {
    if (Number.isInteger(value)) {
      el.value = value;
    } else if (!Number.isInteger(value) && !Array.isArray(value) && typeof value !== "boolean" && ![null, void 0].includes(value)) {
      el.value = String(value);
    } else {
      if (Array.isArray(value)) {
        el.checked = value.some((val) => checkedAttrLooseCompare(val, el.value));
      } else {
        el.checked = !!value;
      }
    }
  } else if (el.tagName === "SELECT") {
    updateSelect(el, value);
  } else {
    if (el.value === value)
      return;
    el.value = value;
  }
}
function bindClasses(el, value) {
  if (el._x_undoAddedClasses)
    el._x_undoAddedClasses();
  el._x_undoAddedClasses = setClasses(el, value);
}
function bindStyles(el, value) {
  if (el._x_undoAddedStyles)
    el._x_undoAddedStyles();
  el._x_undoAddedStyles = setStyles(el, value);
}
function bindAttribute(el, name, value) {
  if ([null, void 0, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
    el.removeAttribute(name);
  } else {
    if (isBooleanAttr(name))
      value = name;
    setIfChanged(el, name, value);
  }
}
function setIfChanged(el, attrName, value) {
  if (el.getAttribute(attrName) != value) {
    el.setAttribute(attrName, value);
  }
}
function updateSelect(el, value) {
  const arrayWrappedValue = [].concat(value).map((value2) => {
    return value2 + "";
  });
  Array.from(el.options).forEach((option) => {
    option.selected = arrayWrappedValue.includes(option.value);
  });
}
function camelCase(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function checkedAttrLooseCompare(valueA, valueB) {
  return valueA == valueB;
}
function isBooleanAttr(attrName) {
  const booleanAttributes = [
    "disabled",
    "checked",
    "required",
    "readonly",
    "hidden",
    "open",
    "selected",
    "autofocus",
    "itemscope",
    "multiple",
    "novalidate",
    "allowfullscreen",
    "allowpaymentrequest",
    "formnovalidate",
    "autoplay",
    "controls",
    "loop",
    "muted",
    "playsinline",
    "default",
    "ismap",
    "reversed",
    "async",
    "defer",
    "nomodule"
  ];
  return booleanAttributes.includes(attrName);
}
function attributeShouldntBePreservedIfFalsy(name) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(name);
}
function getBinding(el, name, fallback) {
  if (el._x_bindings && el._x_bindings[name] !== void 0)
    return el._x_bindings[name];
  let attr = el.getAttribute(name);
  if (attr === null)
    return typeof fallback === "function" ? fallback() : fallback;
  if (attr === "")
    return true;
  if (isBooleanAttr(name)) {
    return !![name, "true"].includes(attr);
  }
  return attr;
}

// packages/alpinejs/src/utils/debounce.js
function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// packages/alpinejs/src/utils/throttle.js
function throttle(func, limit) {
  let inThrottle;
  return function() {
    let context = this, args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// packages/alpinejs/src/plugin.js
function plugin(callback) {
  callback(alpine_default);
}

// packages/alpinejs/src/store.js
var stores = {};
var isReactive = false;
function store(name, value) {
  if (!isReactive) {
    stores = reactive(stores);
    isReactive = true;
  }
  if (value === void 0) {
    return stores[name];
  }
  stores[name] = value;
  if (typeof value === "object" && value !== null && value.hasOwnProperty("init") && typeof value.init === "function") {
    stores[name].init();
  }
  initInterceptors(stores[name]);
}
function getStores() {
  return stores;
}

// packages/alpinejs/src/binds.js
var binds = {};
function bind2(name, bindings) {
  let getBindings = typeof bindings !== "function" ? () => bindings : bindings;
  if (name instanceof Element) {
    applyBindingsObject(name, getBindings());
  } else {
    binds[name] = getBindings;
  }
}
function injectBindingProviders(obj) {
  Object.entries(binds).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback(...args);
        };
      }
    });
  });
  return obj;
}
function applyBindingsObject(el, obj, original) {
  let cleanupRunners = [];
  while (cleanupRunners.length)
    cleanupRunners.pop()();
  let attributes = Object.entries(obj).map(([name, value]) => ({name, value}));
  let staticAttributes = attributesOnly(attributes);
  attributes = attributes.map((attribute) => {
    if (staticAttributes.find((attr) => attr.name === attribute.name)) {
      return {
        name: `x-bind:${attribute.name}`,
        value: `"${attribute.value}"`
      };
    }
    return attribute;
  });
  directives(el, attributes, original).map((handle) => {
    cleanupRunners.push(handle.runCleanups);
    handle();
  });
}

// packages/alpinejs/src/datas.js
var datas = {};
function data(name, callback) {
  datas[name] = callback;
}
function injectDataProviders(obj, context) {
  Object.entries(datas).forEach(([name, callback]) => {
    Object.defineProperty(obj, name, {
      get() {
        return (...args) => {
          return callback.bind(context)(...args);
        };
      },
      enumerable: false
    });
  });
  return obj;
}

// packages/alpinejs/src/alpine.js
var Alpine = {
  get reactive() {
    return reactive;
  },
  get release() {
    return release;
  },
  get effect() {
    return effect;
  },
  get raw() {
    return raw;
  },
  version: "3.10.5",
  flushAndStopDeferringMutations,
  dontAutoEvaluateFunctions,
  disableEffectScheduling,
  setReactivityEngine,
  closestDataStack,
  skipDuringClone,
  addRootSelector,
  addInitSelector,
  addScopeToNode,
  deferMutations,
  mapAttributes,
  evaluateLater,
  setEvaluator,
  mergeProxies,
  findClosest,
  closestRoot,
  interceptor,
  transition,
  setStyles,
  mutateDom,
  directive,
  throttle,
  debounce,
  evaluate,
  initTree,
  nextTick,
  prefixed: prefix,
  prefix: setPrefix,
  plugin,
  magic,
  store,
  start,
  clone,
  bound: getBinding,
  $data: scope,
  data,
  bind: bind2
};
var alpine_default = Alpine;

// node_modules/@vue/shared/dist/shared.esm-bundler.js
function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
var PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
var slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isBooleanAttr2 = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
var EMPTY_OBJ =  true ? Object.freeze({}) : 0;
var EMPTY_ARR =  true ? Object.freeze([]) : 0;
var extend = Object.assign;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var cacheStringFunction = (fn) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
var camelizeRE = /-(\w)/g;
var camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
var toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
var hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

// node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var targetMap = new WeakMap();
var effectStack = [];
var activeEffect;
var ITERATE_KEY = Symbol( true ? "iterate" : 0);
var MAP_KEY_ITERATE_KEY = Symbol( true ? "Map key iterate" : 0);
function isEffect(fn) {
  return fn && fn._isEffect === true;
}
function effect2(fn, options = EMPTY_OBJ) {
  if (isEffect(fn)) {
    fn = fn.raw;
  }
  const effect3 = createReactiveEffect(fn, options);
  if (!options.lazy) {
    effect3();
  }
  return effect3;
}
function stop(effect3) {
  if (effect3.active) {
    cleanup(effect3);
    if (effect3.options.onStop) {
      effect3.options.onStop();
    }
    effect3.active = false;
  }
}
var uid = 0;
function createReactiveEffect(fn, options) {
  const effect3 = function reactiveEffect() {
    if (!effect3.active) {
      return fn();
    }
    if (!effectStack.includes(effect3)) {
      cleanup(effect3);
      try {
        enableTracking();
        effectStack.push(effect3);
        activeEffect = effect3;
        return fn();
      } finally {
        effectStack.pop();
        resetTracking();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  };
  effect3.id = uid++;
  effect3.allowRecurse = !!options.allowRecurse;
  effect3._isEffect = true;
  effect3.active = true;
  effect3.raw = fn;
  effect3.deps = [];
  effect3.options = options;
  return effect3;
}
function cleanup(effect3) {
  const {deps} = effect3;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect3);
    }
    deps.length = 0;
  }
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (!shouldTrack || activeEffect === void 0) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = new Set());
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
    if (activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      });
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = new Set();
  const add2 = (effectsToAdd) => {
    if (effectsToAdd) {
      effectsToAdd.forEach((effect3) => {
        if (effect3 !== activeEffect || effect3.allowRecurse) {
          effects.add(effect3);
        }
      });
    }
  };
  if (type === "clear") {
    depsMap.forEach(add2);
  } else if (key === "length" && isArray(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        add2(dep);
      }
    });
  } else {
    if (key !== void 0) {
      add2(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          add2(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          add2(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            add2(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          add2(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  const run = (effect3) => {
    if (effect3.options.onTrigger) {
      effect3.options.onTrigger({
        effect: effect3,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      });
    }
    if (effect3.options.scheduler) {
      effect3.options.scheduler(effect3);
    } else {
      effect3();
    }
  };
  effects.forEach(run);
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
var get2 = /* @__PURE__ */ createGetter();
var shallowGet = /* @__PURE__ */ createGetter(false, true);
var readonlyGet = /* @__PURE__ */ createGetter(true);
var shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
var arrayInstrumentations = {};
["includes", "indexOf", "lastIndexOf"].forEach((key) => {
  const method = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    const arr = toRaw(this);
    for (let i = 0, l = this.length; i < l; i++) {
      track(arr, "get", i + "");
    }
    const res = method.apply(arr, args);
    if (res === -1 || res === false) {
      return method.apply(arr, args.map(toRaw));
    } else {
      return res;
    }
  };
});
["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
  const method = Array.prototype[key];
  arrayInstrumentations[key] = function(...args) {
    pauseTracking();
    const res = method.apply(this, args);
    resetTracking();
    return res;
  };
});
function createGetter(isReadonly = false, shallow = false) {
  return function get3(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw" && receiver === (isReadonly ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive2(res);
    }
    return res;
  };
}
var set2 = /* @__PURE__ */ createSetter();
var shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set3(target, key, value, receiver) {
    let oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      oldValue = toRaw(oldValue);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  const oldValue = target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
var mutableHandlers = {
  get: get2,
  set: set2,
  deleteProperty,
  has,
  ownKeys
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    if (true) {
      console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  },
  deleteProperty(target, key) {
    if (true) {
      console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
    }
    return true;
  }
};
var shallowReactiveHandlers = extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
var toReactive = (value) => isObject(value) ? reactive2(value) : value;
var toReadonly = (value) => isObject(value) ? readonly(value) : value;
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly = false, isShallow = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "get", key);
  }
  !isReadonly && track(rawTarget, "get", rawKey);
  const {has: has2} = getProto(rawTarget);
  const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly && track(rawTarget, "has", key);
  }
  !isReadonly && track(rawTarget, "has", rawKey);
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly = false) {
  target = target["__v_raw"];
  !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const {has: has2, get: get3} = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const {has: has2, get: get3} = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else if (true) {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get3 ? get3.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget =  true ? isMap(target) ? new Map(target) : new Set(target) : 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly, isShallow) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly, isShallow) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    !isReadonly && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const {value, done} = innerIterator.next();
        return done ? {value, done} : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    if (true) {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
    }
    return type === "delete" ? false : this;
  };
}
var mutableInstrumentations = {
  get(key) {
    return get$1(this, key);
  },
  get size() {
    return size(this);
  },
  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, false)
};
var shallowInstrumentations = {
  get(key) {
    return get$1(this, key, false, true);
  },
  get size() {
    return size(this);
  },
  has: has$1,
  add,
  set: set$1,
  delete: deleteEntry,
  clear,
  forEach: createForEach(false, true)
};
var readonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true);
  },
  get size() {
    return size(this, true);
  },
  has(key) {
    return has$1.call(this, key, true);
  },
  add: createReadonlyMethod("add"),
  set: createReadonlyMethod("set"),
  delete: createReadonlyMethod("delete"),
  clear: createReadonlyMethod("clear"),
  forEach: createForEach(true, false)
};
var shallowReadonlyInstrumentations = {
  get(key) {
    return get$1(this, key, true, true);
  },
  get size() {
    return size(this, true);
  },
  has(key) {
    return has$1.call(this, key, true);
  },
  add: createReadonlyMethod("add"),
  set: createReadonlyMethod("set"),
  delete: createReadonlyMethod("delete"),
  clear: createReadonlyMethod("clear"),
  forEach: createForEach(true, true)
};
var iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
iteratorMethods.forEach((method) => {
  mutableInstrumentations[method] = createIterableMethod(method, false, false);
  readonlyInstrumentations[method] = createIterableMethod(method, true, false);
  shallowInstrumentations[method] = createIterableMethod(method, false, true);
  shallowReadonlyInstrumentations[method] = createIterableMethod(method, true, true);
});
function createInstrumentationGetter(isReadonly, shallow) {
  const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly;
    } else if (key === "__v_isReadonly") {
      return isReadonly;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
var mutableCollectionHandlers = {
  get: createInstrumentationGetter(false, false)
};
var shallowCollectionHandlers = {
  get: createInstrumentationGetter(false, true)
};
var readonlyCollectionHandlers = {
  get: createInstrumentationGetter(true, false)
};
var shallowReadonlyCollectionHandlers = {
  get: createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
  }
}
var reactiveMap = new WeakMap();
var shallowReactiveMap = new WeakMap();
var readonlyMap = new WeakMap();
var shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive2(target) {
  if (target && target["__v_isReadonly"]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    if (true) {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function toRaw(observed) {
  return observed && toRaw(observed["__v_raw"]) || observed;
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}

// packages/alpinejs/src/magics/$nextTick.js
magic("nextTick", () => nextTick);

// packages/alpinejs/src/magics/$dispatch.js
magic("dispatch", (el) => dispatch.bind(dispatch, el));

// packages/alpinejs/src/magics/$watch.js
magic("watch", (el, {evaluateLater: evaluateLater2, effect: effect3}) => (key, callback) => {
  let evaluate2 = evaluateLater2(key);
  let firstTime = true;
  let oldValue;
  let effectReference = effect3(() => evaluate2((value) => {
    JSON.stringify(value);
    if (!firstTime) {
      queueMicrotask(() => {
        callback(value, oldValue);
        oldValue = value;
      });
    } else {
      oldValue = value;
    }
    firstTime = false;
  }));
  el._x_effects.delete(effectReference);
});

// packages/alpinejs/src/magics/$store.js
magic("store", getStores);

// packages/alpinejs/src/magics/$data.js
magic("data", (el) => scope(el));

// packages/alpinejs/src/magics/$root.js
magic("root", (el) => closestRoot(el));

// packages/alpinejs/src/magics/$refs.js
magic("refs", (el) => {
  if (el._x_refs_proxy)
    return el._x_refs_proxy;
  el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el));
  return el._x_refs_proxy;
});
function getArrayOfRefObject(el) {
  let refObjects = [];
  let currentEl = el;
  while (currentEl) {
    if (currentEl._x_refs)
      refObjects.push(currentEl._x_refs);
    currentEl = currentEl.parentNode;
  }
  return refObjects;
}

// packages/alpinejs/src/ids.js
var globalIdMemo = {};
function findAndIncrementId(name) {
  if (!globalIdMemo[name])
    globalIdMemo[name] = 0;
  return ++globalIdMemo[name];
}
function closestIdRoot(el, name) {
  return findClosest(el, (element) => {
    if (element._x_ids && element._x_ids[name])
      return true;
  });
}
function setIdRoot(el, name) {
  if (!el._x_ids)
    el._x_ids = {};
  if (!el._x_ids[name])
    el._x_ids[name] = findAndIncrementId(name);
}

// packages/alpinejs/src/magics/$id.js
magic("id", (el) => (name, key = null) => {
  let root = closestIdRoot(el, name);
  let id = root ? root._x_ids[name] : findAndIncrementId(name);
  return key ? `${name}-${id}-${key}` : `${name}-${id}`;
});

// packages/alpinejs/src/magics/$el.js
magic("el", (el) => el);

// packages/alpinejs/src/magics/index.js
warnMissingPluginMagic("Focus", "focus", "focus");
warnMissingPluginMagic("Persist", "persist", "persist");
function warnMissingPluginMagic(name, magicName, slug) {
  magic(magicName, (el) => warn(`You can't use [$${directiveName}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/directives/x-modelable.js
directive("modelable", (el, {expression}, {effect: effect3, evaluateLater: evaluateLater2}) => {
  let func = evaluateLater2(expression);
  let innerGet = () => {
    let result;
    func((i) => result = i);
    return result;
  };
  let evaluateInnerSet = evaluateLater2(`${expression} = __placeholder`);
  let innerSet = (val) => evaluateInnerSet(() => {
  }, {scope: {__placeholder: val}});
  let initialValue = innerGet();
  innerSet(initialValue);
  queueMicrotask(() => {
    if (!el._x_model)
      return;
    el._x_removeModelListeners["default"]();
    let outerGet = el._x_model.get;
    let outerSet = el._x_model.set;
    effect3(() => innerSet(outerGet()));
    effect3(() => outerSet(innerGet()));
  });
});

// packages/alpinejs/src/directives/x-teleport.js
directive("teleport", (el, {expression}, {cleanup: cleanup2}) => {
  if (el.tagName.toLowerCase() !== "template")
    warn("x-teleport can only be used on a <template> tag", el);
  let target = document.querySelector(expression);
  if (!target)
    warn(`Cannot find x-teleport element for selector: "${expression}"`);
  let clone2 = el.content.cloneNode(true).firstElementChild;
  el._x_teleport = clone2;
  clone2._x_teleportBack = el;
  if (el._x_forwardEvents) {
    el._x_forwardEvents.forEach((eventName) => {
      clone2.addEventListener(eventName, (e) => {
        e.stopPropagation();
        el.dispatchEvent(new e.constructor(e.type, e));
      });
    });
  }
  addScopeToNode(clone2, {}, el);
  mutateDom(() => {
    target.appendChild(clone2);
    initTree(clone2);
    clone2._x_ignore = true;
  });
  cleanup2(() => clone2.remove());
});

// packages/alpinejs/src/directives/x-ignore.js
var handler = () => {
};
handler.inline = (el, {modifiers}, {cleanup: cleanup2}) => {
  modifiers.includes("self") ? el._x_ignoreSelf = true : el._x_ignore = true;
  cleanup2(() => {
    modifiers.includes("self") ? delete el._x_ignoreSelf : delete el._x_ignore;
  });
};
directive("ignore", handler);

// packages/alpinejs/src/directives/x-effect.js
directive("effect", (el, {expression}, {effect: effect3}) => effect3(evaluateLater(el, expression)));

// packages/alpinejs/src/utils/on.js
function on(el, event, modifiers, callback) {
  let listenerTarget = el;
  let handler3 = (e) => callback(e);
  let options = {};
  let wrapHandler = (callback2, wrapper) => (e) => wrapper(callback2, e);
  if (modifiers.includes("dot"))
    event = dotSyntax(event);
  if (modifiers.includes("camel"))
    event = camelCase2(event);
  if (modifiers.includes("passive"))
    options.passive = true;
  if (modifiers.includes("capture"))
    options.capture = true;
  if (modifiers.includes("window"))
    listenerTarget = window;
  if (modifiers.includes("document"))
    listenerTarget = document;
  if (modifiers.includes("prevent"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.preventDefault();
      next(e);
    });
  if (modifiers.includes("stop"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.stopPropagation();
      next(e);
    });
  if (modifiers.includes("self"))
    handler3 = wrapHandler(handler3, (next, e) => {
      e.target === el && next(e);
    });
  if (modifiers.includes("away") || modifiers.includes("outside")) {
    listenerTarget = document;
    handler3 = wrapHandler(handler3, (next, e) => {
      if (el.contains(e.target))
        return;
      if (e.target.isConnected === false)
        return;
      if (el.offsetWidth < 1 && el.offsetHeight < 1)
        return;
      if (el._x_isShown === false)
        return;
      next(e);
    });
  }
  if (modifiers.includes("once")) {
    handler3 = wrapHandler(handler3, (next, e) => {
      next(e);
      listenerTarget.removeEventListener(event, handler3, options);
    });
  }
  handler3 = wrapHandler(handler3, (next, e) => {
    if (isKeyEvent(event)) {
      if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
        return;
      }
    }
    next(e);
  });
  if (modifiers.includes("debounce")) {
    let nextModifier = modifiers[modifiers.indexOf("debounce") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler3 = debounce(handler3, wait);
  }
  if (modifiers.includes("throttle")) {
    let nextModifier = modifiers[modifiers.indexOf("throttle") + 1] || "invalid-wait";
    let wait = isNumeric(nextModifier.split("ms")[0]) ? Number(nextModifier.split("ms")[0]) : 250;
    handler3 = throttle(handler3, wait);
  }
  listenerTarget.addEventListener(event, handler3, options);
  return () => {
    listenerTarget.removeEventListener(event, handler3, options);
  };
}
function dotSyntax(subject) {
  return subject.replace(/-/g, ".");
}
function camelCase2(subject) {
  return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
}
function isNumeric(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}
function kebabCase2(subject) {
  return subject.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function isKeyEvent(event) {
  return ["keydown", "keyup"].includes(event);
}
function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
  let keyModifiers = modifiers.filter((i) => {
    return !["window", "document", "prevent", "stop", "once"].includes(i);
  });
  if (keyModifiers.includes("debounce")) {
    let debounceIndex = keyModifiers.indexOf("debounce");
    keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (keyModifiers.length === 0)
    return false;
  if (keyModifiers.length === 1 && keyToModifiers(e.key).includes(keyModifiers[0]))
    return false;
  const systemKeyModifiers = ["ctrl", "shift", "alt", "meta", "cmd", "super"];
  const selectedSystemKeyModifiers = systemKeyModifiers.filter((modifier) => keyModifiers.includes(modifier));
  keyModifiers = keyModifiers.filter((i) => !selectedSystemKeyModifiers.includes(i));
  if (selectedSystemKeyModifiers.length > 0) {
    const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter((modifier) => {
      if (modifier === "cmd" || modifier === "super")
        modifier = "meta";
      return e[`${modifier}Key`];
    });
    if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
      if (keyToModifiers(e.key).includes(keyModifiers[0]))
        return false;
    }
  }
  return true;
}
function keyToModifiers(key) {
  if (!key)
    return [];
  key = kebabCase2(key);
  let modifierToKeyMap = {
    ctrl: "control",
    slash: "/",
    space: "-",
    spacebar: "-",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    equal: "="
  };
  modifierToKeyMap[key] = key;
  return Object.keys(modifierToKeyMap).map((modifier) => {
    if (modifierToKeyMap[modifier] === key)
      return modifier;
  }).filter((modifier) => modifier);
}

// packages/alpinejs/src/directives/x-model.js
directive("model", (el, {modifiers, expression}, {effect: effect3, cleanup: cleanup2}) => {
  let evaluate2 = evaluateLater(el, expression);
  let assignmentExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
  let evaluateAssignment = evaluateLater(el, assignmentExpression);
  var event = el.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(el.type) || modifiers.includes("lazy") ? "change" : "input";
  let assigmentFunction = generateAssignmentFunction(el, modifiers, expression);
  let removeListener = on(el, event, modifiers, (e) => {
    evaluateAssignment(() => {
    }, {scope: {
      $event: e,
      rightSideOfExpression: assigmentFunction
    }});
  });
  if (!el._x_removeModelListeners)
    el._x_removeModelListeners = {};
  el._x_removeModelListeners["default"] = removeListener;
  cleanup2(() => el._x_removeModelListeners["default"]());
  let evaluateSetModel = evaluateLater(el, `${expression} = __placeholder`);
  el._x_model = {
    get() {
      let result;
      evaluate2((value) => result = value);
      return result;
    },
    set(value) {
      evaluateSetModel(() => {
      }, {scope: {__placeholder: value}});
    }
  };
  el._x_forceModelUpdate = () => {
    evaluate2((value) => {
      if (value === void 0 && expression.match(/\./))
        value = "";
      window.fromModel = true;
      mutateDom(() => bind(el, "value", value));
      delete window.fromModel;
    });
  };
  effect3(() => {
    if (modifiers.includes("unintrusive") && document.activeElement.isSameNode(el))
      return;
    el._x_forceModelUpdate();
  });
});
function generateAssignmentFunction(el, modifiers, expression) {
  if (el.type === "radio") {
    mutateDom(() => {
      if (!el.hasAttribute("name"))
        el.setAttribute("name", expression);
    });
  }
  return (event, currentValue) => {
    return mutateDom(() => {
      if (event instanceof CustomEvent && event.detail !== void 0) {
        return event.detail || event.target.value;
      } else if (el.type === "checkbox") {
        if (Array.isArray(currentValue)) {
          let newValue = modifiers.includes("number") ? safeParseNumber(event.target.value) : event.target.value;
          return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter((el2) => !checkedAttrLooseCompare2(el2, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === "select" && el.multiple) {
        return modifiers.includes("number") ? Array.from(event.target.selectedOptions).map((option) => {
          let rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        }) : Array.from(event.target.selectedOptions).map((option) => {
          return option.value || option.text;
        });
      } else {
        let rawValue = event.target.value;
        return modifiers.includes("number") ? safeParseNumber(rawValue) : modifiers.includes("trim") ? rawValue.trim() : rawValue;
      }
    });
  };
}
function safeParseNumber(rawValue) {
  let number = rawValue ? parseFloat(rawValue) : null;
  return isNumeric2(number) ? number : rawValue;
}
function checkedAttrLooseCompare2(valueA, valueB) {
  return valueA == valueB;
}
function isNumeric2(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-cloak.js
directive("cloak", (el) => queueMicrotask(() => mutateDom(() => el.removeAttribute(prefix("cloak")))));

// packages/alpinejs/src/directives/x-init.js
addInitSelector(() => `[${prefix("init")}]`);
directive("init", skipDuringClone((el, {expression}, {evaluate: evaluate2}) => {
  if (typeof expression === "string") {
    return !!expression.trim() && evaluate2(expression, {}, false);
  }
  return evaluate2(expression, {}, false);
}));

// packages/alpinejs/src/directives/x-text.js
directive("text", (el, {expression}, {effect: effect3, evaluateLater: evaluateLater2}) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.textContent = value;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-html.js
directive("html", (el, {expression}, {effect: effect3, evaluateLater: evaluateLater2}) => {
  let evaluate2 = evaluateLater2(expression);
  effect3(() => {
    evaluate2((value) => {
      mutateDom(() => {
        el.innerHTML = value;
        el._x_ignoreSelf = true;
        initTree(el);
        delete el._x_ignoreSelf;
      });
    });
  });
});

// packages/alpinejs/src/directives/x-bind.js
mapAttributes(startingWith(":", into(prefix("bind:"))));
directive("bind", (el, {value, modifiers, expression, original}, {effect: effect3}) => {
  if (!value) {
    let bindingProviders = {};
    injectBindingProviders(bindingProviders);
    let getBindings = evaluateLater(el, expression);
    getBindings((bindings) => {
      applyBindingsObject(el, bindings, original);
    }, {scope: bindingProviders});
    return;
  }
  if (value === "key")
    return storeKeyForXFor(el, expression);
  let evaluate2 = evaluateLater(el, expression);
  effect3(() => evaluate2((result) => {
    if (result === void 0 && typeof expression === "string" && expression.match(/\./)) {
      result = "";
    }
    mutateDom(() => bind(el, value, result, modifiers));
  }));
});
function storeKeyForXFor(el, expression) {
  el._x_keyExpression = expression;
}

// packages/alpinejs/src/directives/x-data.js
addRootSelector(() => `[${prefix("data")}]`);
directive("data", skipDuringClone((el, {expression}, {cleanup: cleanup2}) => {
  expression = expression === "" ? "{}" : expression;
  let magicContext = {};
  injectMagics(magicContext, el);
  let dataProviderContext = {};
  injectDataProviders(dataProviderContext, magicContext);
  let data2 = evaluate(el, expression, {scope: dataProviderContext});
  if (data2 === void 0)
    data2 = {};
  injectMagics(data2, el);
  let reactiveData = reactive(data2);
  initInterceptors(reactiveData);
  let undo = addScopeToNode(el, reactiveData);
  reactiveData["init"] && evaluate(el, reactiveData["init"]);
  cleanup2(() => {
    reactiveData["destroy"] && evaluate(el, reactiveData["destroy"]);
    undo();
  });
}));

// packages/alpinejs/src/directives/x-show.js
directive("show", (el, {modifiers, expression}, {effect: effect3}) => {
  let evaluate2 = evaluateLater(el, expression);
  if (!el._x_doHide)
    el._x_doHide = () => {
      mutateDom(() => {
        el.style.setProperty("display", "none", modifiers.includes("important") ? "important" : void 0);
      });
    };
  if (!el._x_doShow)
    el._x_doShow = () => {
      mutateDom(() => {
        if (el.style.length === 1 && el.style.display === "none") {
          el.removeAttribute("style");
        } else {
          el.style.removeProperty("display");
        }
      });
    };
  let hide = () => {
    el._x_doHide();
    el._x_isShown = false;
  };
  let show = () => {
    el._x_doShow();
    el._x_isShown = true;
  };
  let clickAwayCompatibleShow = () => setTimeout(show);
  let toggle = once((value) => value ? show() : hide(), (value) => {
    if (typeof el._x_toggleAndCascadeWithTransitions === "function") {
      el._x_toggleAndCascadeWithTransitions(el, value, show, hide);
    } else {
      value ? clickAwayCompatibleShow() : hide();
    }
  });
  let oldValue;
  let firstTime = true;
  effect3(() => evaluate2((value) => {
    if (!firstTime && value === oldValue)
      return;
    if (modifiers.includes("immediate"))
      value ? clickAwayCompatibleShow() : hide();
    toggle(value);
    oldValue = value;
    firstTime = false;
  }));
});

// packages/alpinejs/src/directives/x-for.js
directive("for", (el, {expression}, {effect: effect3, cleanup: cleanup2}) => {
  let iteratorNames = parseForExpression(expression);
  let evaluateItems = evaluateLater(el, iteratorNames.items);
  let evaluateKey = evaluateLater(el, el._x_keyExpression || "index");
  el._x_prevKeys = [];
  el._x_lookup = {};
  effect3(() => loop(el, iteratorNames, evaluateItems, evaluateKey));
  cleanup2(() => {
    Object.values(el._x_lookup).forEach((el2) => el2.remove());
    delete el._x_prevKeys;
    delete el._x_lookup;
  });
});
function loop(el, iteratorNames, evaluateItems, evaluateKey) {
  let isObject2 = (i) => typeof i === "object" && !Array.isArray(i);
  let templateEl = el;
  evaluateItems((items) => {
    if (isNumeric3(items) && items >= 0) {
      items = Array.from(Array(items).keys(), (i) => i + 1);
    }
    if (items === void 0)
      items = [];
    let lookup = el._x_lookup;
    let prevKeys = el._x_prevKeys;
    let scopes = [];
    let keys = [];
    if (isObject2(items)) {
      items = Object.entries(items).map(([key, value]) => {
        let scope2 = getIterationScopeVariables(iteratorNames, value, key, items);
        evaluateKey((value2) => keys.push(value2), {scope: {index: key, ...scope2}});
        scopes.push(scope2);
      });
    } else {
      for (let i = 0; i < items.length; i++) {
        let scope2 = getIterationScopeVariables(iteratorNames, items[i], i, items);
        evaluateKey((value) => keys.push(value), {scope: {index: i, ...scope2}});
        scopes.push(scope2);
      }
    }
    let adds = [];
    let moves = [];
    let removes = [];
    let sames = [];
    for (let i = 0; i < prevKeys.length; i++) {
      let key = prevKeys[i];
      if (keys.indexOf(key) === -1)
        removes.push(key);
    }
    prevKeys = prevKeys.filter((key) => !removes.includes(key));
    let lastKey = "template";
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let prevIndex = prevKeys.indexOf(key);
      if (prevIndex === -1) {
        prevKeys.splice(i, 0, key);
        adds.push([lastKey, i]);
      } else if (prevIndex !== i) {
        let keyInSpot = prevKeys.splice(i, 1)[0];
        let keyForSpot = prevKeys.splice(prevIndex - 1, 1)[0];
        prevKeys.splice(i, 0, keyForSpot);
        prevKeys.splice(prevIndex, 0, keyInSpot);
        moves.push([keyInSpot, keyForSpot]);
      } else {
        sames.push(key);
      }
      lastKey = key;
    }
    for (let i = 0; i < removes.length; i++) {
      let key = removes[i];
      if (!!lookup[key]._x_effects) {
        lookup[key]._x_effects.forEach(dequeueJob);
      }
      lookup[key].remove();
      lookup[key] = null;
      delete lookup[key];
    }
    for (let i = 0; i < moves.length; i++) {
      let [keyInSpot, keyForSpot] = moves[i];
      let elInSpot = lookup[keyInSpot];
      let elForSpot = lookup[keyForSpot];
      let marker = document.createElement("div");
      mutateDom(() => {
        elForSpot.after(marker);
        elInSpot.after(elForSpot);
        elForSpot._x_currentIfEl && elForSpot.after(elForSpot._x_currentIfEl);
        marker.before(elInSpot);
        elInSpot._x_currentIfEl && elInSpot.after(elInSpot._x_currentIfEl);
        marker.remove();
      });
      refreshScope(elForSpot, scopes[keys.indexOf(keyForSpot)]);
    }
    for (let i = 0; i < adds.length; i++) {
      let [lastKey2, index] = adds[i];
      let lastEl = lastKey2 === "template" ? templateEl : lookup[lastKey2];
      if (lastEl._x_currentIfEl)
        lastEl = lastEl._x_currentIfEl;
      let scope2 = scopes[index];
      let key = keys[index];
      let clone2 = document.importNode(templateEl.content, true).firstElementChild;
      addScopeToNode(clone2, reactive(scope2), templateEl);
      mutateDom(() => {
        lastEl.after(clone2);
        initTree(clone2);
      });
      if (typeof key === "object") {
        warn("x-for key cannot be an object, it must be a string or an integer", templateEl);
      }
      lookup[key] = clone2;
    }
    for (let i = 0; i < sames.length; i++) {
      refreshScope(lookup[sames[i]], scopes[keys.indexOf(sames[i])]);
    }
    templateEl._x_prevKeys = keys;
  });
}
function parseForExpression(expression) {
  let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  let stripParensRE = /^\s*\(|\)\s*$/g;
  let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  let inMatch = expression.match(forAliasRE);
  if (!inMatch)
    return;
  let res = {};
  res.items = inMatch[2].trim();
  let item = inMatch[1].replace(stripParensRE, "").trim();
  let iteratorMatch = item.match(forIteratorRE);
  if (iteratorMatch) {
    res.item = item.replace(forIteratorRE, "").trim();
    res.index = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.collection = iteratorMatch[2].trim();
    }
  } else {
    res.item = item;
  }
  return res;
}
function getIterationScopeVariables(iteratorNames, item, index, items) {
  let scopeVariables = {};
  if (/^\[.*\]$/.test(iteratorNames.item) && Array.isArray(item)) {
    let names = iteratorNames.item.replace("[", "").replace("]", "").split(",").map((i) => i.trim());
    names.forEach((name, i) => {
      scopeVariables[name] = item[i];
    });
  } else if (/^\{.*\}$/.test(iteratorNames.item) && !Array.isArray(item) && typeof item === "object") {
    let names = iteratorNames.item.replace("{", "").replace("}", "").split(",").map((i) => i.trim());
    names.forEach((name) => {
      scopeVariables[name] = item[name];
    });
  } else {
    scopeVariables[iteratorNames.item] = item;
  }
  if (iteratorNames.index)
    scopeVariables[iteratorNames.index] = index;
  if (iteratorNames.collection)
    scopeVariables[iteratorNames.collection] = items;
  return scopeVariables;
}
function isNumeric3(subject) {
  return !Array.isArray(subject) && !isNaN(subject);
}

// packages/alpinejs/src/directives/x-ref.js
function handler2() {
}
handler2.inline = (el, {expression}, {cleanup: cleanup2}) => {
  let root = closestRoot(el);
  if (!root._x_refs)
    root._x_refs = {};
  root._x_refs[expression] = el;
  cleanup2(() => delete root._x_refs[expression]);
};
directive("ref", handler2);

// packages/alpinejs/src/directives/x-if.js
directive("if", (el, {expression}, {effect: effect3, cleanup: cleanup2}) => {
  let evaluate2 = evaluateLater(el, expression);
  let show = () => {
    if (el._x_currentIfEl)
      return el._x_currentIfEl;
    let clone2 = el.content.cloneNode(true).firstElementChild;
    addScopeToNode(clone2, {}, el);
    mutateDom(() => {
      el.after(clone2);
      initTree(clone2);
    });
    el._x_currentIfEl = clone2;
    el._x_undoIf = () => {
      walk(clone2, (node) => {
        if (!!node._x_effects) {
          node._x_effects.forEach(dequeueJob);
        }
      });
      clone2.remove();
      delete el._x_currentIfEl;
    };
    return clone2;
  };
  let hide = () => {
    if (!el._x_undoIf)
      return;
    el._x_undoIf();
    delete el._x_undoIf;
  };
  effect3(() => evaluate2((value) => {
    value ? show() : hide();
  }));
  cleanup2(() => el._x_undoIf && el._x_undoIf());
});

// packages/alpinejs/src/directives/x-id.js
directive("id", (el, {expression}, {evaluate: evaluate2}) => {
  let names = evaluate2(expression);
  names.forEach((name) => setIdRoot(el, name));
});

// packages/alpinejs/src/directives/x-on.js
mapAttributes(startingWith("@", into(prefix("on:"))));
directive("on", skipDuringClone((el, {value, modifiers, expression}, {cleanup: cleanup2}) => {
  let evaluate2 = expression ? evaluateLater(el, expression) : () => {
  };
  if (el.tagName.toLowerCase() === "template") {
    if (!el._x_forwardEvents)
      el._x_forwardEvents = [];
    if (!el._x_forwardEvents.includes(value))
      el._x_forwardEvents.push(value);
  }
  let removeListener = on(el, value, modifiers, (e) => {
    evaluate2(() => {
    }, {scope: {$event: e}, params: [e]});
  });
  cleanup2(() => removeListener());
}));

// packages/alpinejs/src/directives/index.js
warnMissingPluginDirective("Collapse", "collapse", "collapse");
warnMissingPluginDirective("Intersect", "intersect", "intersect");
warnMissingPluginDirective("Focus", "trap", "focus");
warnMissingPluginDirective("Mask", "mask", "mask");
function warnMissingPluginDirective(name, directiveName2, slug) {
  directive(directiveName2, (el) => warn(`You can't use [x-${directiveName2}] without first installing the "${name}" plugin here: https://alpinejs.dev/plugins/${slug}`, el));
}

// packages/alpinejs/src/index.js
alpine_default.setEvaluator(normalEvaluator);
alpine_default.setReactivityEngine({reactive: reactive2, effect: effect2, release: stop, raw: toRaw});
var src_default = alpine_default;

// packages/alpinejs/builds/module.js
var module_default = src_default;



/***/ }),

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/module.esm.js");

window.Alpine = alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"];
alpinejs__WEBPACK_IMPORTED_MODULE_0__["default"].start();
console.log('Hola soy laravel mix');

/***/ }),

/***/ "./src/styles/main.css":
/*!*****************************!*\
  !*** ./src/styles/main.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/assets/app": 0,
/******/ 			"assets/main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkscaldasonno"] = self["webpackChunkscaldasonno"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["assets/main"], () => (__webpack_require__("./src/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["assets/main"], () => (__webpack_require__("./src/styles/main.css")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQSxDQUFDO0FBQ0QsV0FBVyxZQUFZO0FBQ3ZCLFNBQVMsZ0NBQWdDO0FBQ3pDO0FBQ0EsS0FBSyxHQUFHLFlBQVk7QUFDcEI7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsS0FBSztBQUN0QztBQUNBO0FBQ0EsZ0RBQWdELGVBQWU7QUFDL0Q7QUFDQSxXQUFXLFlBQVk7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQ0FBa0MsUUFBUTtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsNkJBQTZCLEdBQUcsb0JBQW9CO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixXQUFXO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFdBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsV0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEU7QUFDQTtBQUNBLGNBQWMsNkRBQTZEO0FBQzNFLGNBQWMsNkRBQTZEO0FBQzNFO0FBQ0EsT0FBTztBQUNQLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1AsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsbURBQW1ELGdDQUFnQztBQUNuRixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyw0QkFBNEIsSUFBSTtBQUN0RSxDQUFDO0FBQ0QsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0M7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRUFBZ0UsWUFBWTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixlQUFlO0FBQ3ZDLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixLQUFJLG1CQUFtQixJQUFJLENBQUU7QUFDN0MsZ0JBQWdCLEtBQUksdUJBQXVCLENBQUU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRCxnQkFBZ0I7QUFDM0U7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsS0FBSSxlQUFlLENBQUU7QUFDOUMsaUNBQWlDLEtBQUksdUJBQXVCLENBQUU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsTUFBTTtBQUNmO0FBQ0Esb0JBQW9CLGlCQUFpQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxPQUFPO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQzs7Ozs7Ozs7Ozs7QUNMbkM7Ozs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWpEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zY2FsZGFzb25uby8uL25vZGVfbW9kdWxlcy9hbHBpbmVqcy9kaXN0L21vZHVsZS5lc20uanMiLCJ3ZWJwYWNrOi8vc2NhbGRhc29ubm8vLi9zcmMvanMvYXBwLmpzIiwid2VicGFjazovL3NjYWxkYXNvbm5vLy4vc3JjL3N0eWxlcy9tYWluLmNzcz9lOGYyIiwid2VicGFjazovL3NjYWxkYXNvbm5vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NjYWxkYXNvbm5vL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vc2NhbGRhc29ubm8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NjYWxkYXNvbm5vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2NhbGRhc29ubm8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zY2FsZGFzb25uby93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9zY2FsZGFzb25uby93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3NjYWxkYXNvbm5vL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zY2FsZGFzb25uby93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3NjaGVkdWxlci5qc1xudmFyIGZsdXNoUGVuZGluZyA9IGZhbHNlO1xudmFyIGZsdXNoaW5nID0gZmFsc2U7XG52YXIgcXVldWUgPSBbXTtcbmZ1bmN0aW9uIHNjaGVkdWxlcihjYWxsYmFjaykge1xuICBxdWV1ZUpvYihjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBxdWV1ZUpvYihqb2IpIHtcbiAgaWYgKCFxdWV1ZS5pbmNsdWRlcyhqb2IpKVxuICAgIHF1ZXVlLnB1c2goam9iKTtcbiAgcXVldWVGbHVzaCgpO1xufVxuZnVuY3Rpb24gZGVxdWV1ZUpvYihqb2IpIHtcbiAgbGV0IGluZGV4ID0gcXVldWUuaW5kZXhPZihqb2IpO1xuICBpZiAoaW5kZXggIT09IC0xKVxuICAgIHF1ZXVlLnNwbGljZShpbmRleCwgMSk7XG59XG5mdW5jdGlvbiBxdWV1ZUZsdXNoKCkge1xuICBpZiAoIWZsdXNoaW5nICYmICFmbHVzaFBlbmRpbmcpIHtcbiAgICBmbHVzaFBlbmRpbmcgPSB0cnVlO1xuICAgIHF1ZXVlTWljcm90YXNrKGZsdXNoSm9icyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGZsdXNoSm9icygpIHtcbiAgZmx1c2hQZW5kaW5nID0gZmFsc2U7XG4gIGZsdXNoaW5nID0gdHJ1ZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIHF1ZXVlW2ldKCk7XG4gIH1cbiAgcXVldWUubGVuZ3RoID0gMDtcbiAgZmx1c2hpbmcgPSBmYWxzZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3JlYWN0aXZpdHkuanNcbnZhciByZWFjdGl2ZTtcbnZhciBlZmZlY3Q7XG52YXIgcmVsZWFzZTtcbnZhciByYXc7XG52YXIgc2hvdWxkU2NoZWR1bGUgPSB0cnVlO1xuZnVuY3Rpb24gZGlzYWJsZUVmZmVjdFNjaGVkdWxpbmcoY2FsbGJhY2spIHtcbiAgc2hvdWxkU2NoZWR1bGUgPSBmYWxzZTtcbiAgY2FsbGJhY2soKTtcbiAgc2hvdWxkU2NoZWR1bGUgPSB0cnVlO1xufVxuZnVuY3Rpb24gc2V0UmVhY3Rpdml0eUVuZ2luZShlbmdpbmUpIHtcbiAgcmVhY3RpdmUgPSBlbmdpbmUucmVhY3RpdmU7XG4gIHJlbGVhc2UgPSBlbmdpbmUucmVsZWFzZTtcbiAgZWZmZWN0ID0gKGNhbGxiYWNrKSA9PiBlbmdpbmUuZWZmZWN0KGNhbGxiYWNrLCB7c2NoZWR1bGVyOiAodGFzaykgPT4ge1xuICAgIGlmIChzaG91bGRTY2hlZHVsZSkge1xuICAgICAgc2NoZWR1bGVyKHRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXNrKCk7XG4gICAgfVxuICB9fSk7XG4gIHJhdyA9IGVuZ2luZS5yYXc7XG59XG5mdW5jdGlvbiBvdmVycmlkZUVmZmVjdChvdmVycmlkZSkge1xuICBlZmZlY3QgPSBvdmVycmlkZTtcbn1cbmZ1bmN0aW9uIGVsZW1lbnRCb3VuZEVmZmVjdChlbCkge1xuICBsZXQgY2xlYW51cDIgPSAoKSA9PiB7XG4gIH07XG4gIGxldCB3cmFwcGVkRWZmZWN0ID0gKGNhbGxiYWNrKSA9PiB7XG4gICAgbGV0IGVmZmVjdFJlZmVyZW5jZSA9IGVmZmVjdChjYWxsYmFjayk7XG4gICAgaWYgKCFlbC5feF9lZmZlY3RzKSB7XG4gICAgICBlbC5feF9lZmZlY3RzID0gbmV3IFNldCgpO1xuICAgICAgZWwuX3hfcnVuRWZmZWN0cyA9ICgpID0+IHtcbiAgICAgICAgZWwuX3hfZWZmZWN0cy5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgZWwuX3hfZWZmZWN0cy5hZGQoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICBjbGVhbnVwMiA9ICgpID0+IHtcbiAgICAgIGlmIChlZmZlY3RSZWZlcmVuY2UgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZWwuX3hfZWZmZWN0cy5kZWxldGUoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICAgIHJlbGVhc2UoZWZmZWN0UmVmZXJlbmNlKTtcbiAgICB9O1xuICAgIHJldHVybiBlZmZlY3RSZWZlcmVuY2U7XG4gIH07XG4gIHJldHVybiBbd3JhcHBlZEVmZmVjdCwgKCkgPT4ge1xuICAgIGNsZWFudXAyKCk7XG4gIH1dO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbXV0YXRpb24uanNcbnZhciBvbkF0dHJpYnV0ZUFkZGVkcyA9IFtdO1xudmFyIG9uRWxSZW1vdmVkcyA9IFtdO1xudmFyIG9uRWxBZGRlZHMgPSBbXTtcbmZ1bmN0aW9uIG9uRWxBZGRlZChjYWxsYmFjaykge1xuICBvbkVsQWRkZWRzLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gb25FbFJlbW92ZWQoZWwsIGNhbGxiYWNrKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGlmICghZWwuX3hfY2xlYW51cHMpXG4gICAgICBlbC5feF9jbGVhbnVwcyA9IFtdO1xuICAgIGVsLl94X2NsZWFudXBzLnB1c2goY2FsbGJhY2spO1xuICB9IGVsc2Uge1xuICAgIGNhbGxiYWNrID0gZWw7XG4gICAgb25FbFJlbW92ZWRzLnB1c2goY2FsbGJhY2spO1xuICB9XG59XG5mdW5jdGlvbiBvbkF0dHJpYnV0ZXNBZGRlZChjYWxsYmFjaykge1xuICBvbkF0dHJpYnV0ZUFkZGVkcy5wdXNoKGNhbGxiYWNrKTtcbn1cbmZ1bmN0aW9uIG9uQXR0cmlidXRlUmVtb3ZlZChlbCwgbmFtZSwgY2FsbGJhY2spIHtcbiAgaWYgKCFlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcylcbiAgICBlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcyA9IHt9O1xuICBpZiAoIWVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdKVxuICAgIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdID0gW107XG4gIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdLnB1c2goY2FsbGJhY2spO1xufVxuZnVuY3Rpb24gY2xlYW51cEF0dHJpYnV0ZXMoZWwsIG5hbWVzKSB7XG4gIGlmICghZWwuX3hfYXR0cmlidXRlQ2xlYW51cHMpXG4gICAgcmV0dXJuO1xuICBPYmplY3QuZW50cmllcyhlbC5feF9hdHRyaWJ1dGVDbGVhbnVwcykuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIGlmIChuYW1lcyA9PT0gdm9pZCAwIHx8IG5hbWVzLmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgICB2YWx1ZS5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICAgICAgZGVsZXRlIGVsLl94X2F0dHJpYnV0ZUNsZWFudXBzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59XG52YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihvbk11dGF0ZSk7XG52YXIgY3VycmVudGx5T2JzZXJ2aW5nID0gZmFsc2U7XG5mdW5jdGlvbiBzdGFydE9ic2VydmluZ011dGF0aW9ucygpIHtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwge3N1YnRyZWU6IHRydWUsIGNoaWxkTGlzdDogdHJ1ZSwgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlT2xkVmFsdWU6IHRydWV9KTtcbiAgY3VycmVudGx5T2JzZXJ2aW5nID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHN0b3BPYnNlcnZpbmdNdXRhdGlvbnMoKSB7XG4gIGZsdXNoT2JzZXJ2ZXIoKTtcbiAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICBjdXJyZW50bHlPYnNlcnZpbmcgPSBmYWxzZTtcbn1cbnZhciByZWNvcmRRdWV1ZSA9IFtdO1xudmFyIHdpbGxQcm9jZXNzUmVjb3JkUXVldWUgPSBmYWxzZTtcbmZ1bmN0aW9uIGZsdXNoT2JzZXJ2ZXIoKSB7XG4gIHJlY29yZFF1ZXVlID0gcmVjb3JkUXVldWUuY29uY2F0KG9ic2VydmVyLnRha2VSZWNvcmRzKCkpO1xuICBpZiAocmVjb3JkUXVldWUubGVuZ3RoICYmICF3aWxsUHJvY2Vzc1JlY29yZFF1ZXVlKSB7XG4gICAgd2lsbFByb2Nlc3NSZWNvcmRRdWV1ZSA9IHRydWU7XG4gICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgcHJvY2Vzc1JlY29yZFF1ZXVlKCk7XG4gICAgICB3aWxsUHJvY2Vzc1JlY29yZFF1ZXVlID0gZmFsc2U7XG4gICAgfSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHByb2Nlc3NSZWNvcmRRdWV1ZSgpIHtcbiAgb25NdXRhdGUocmVjb3JkUXVldWUpO1xuICByZWNvcmRRdWV1ZS5sZW5ndGggPSAwO1xufVxuZnVuY3Rpb24gbXV0YXRlRG9tKGNhbGxiYWNrKSB7XG4gIGlmICghY3VycmVudGx5T2JzZXJ2aW5nKVxuICAgIHJldHVybiBjYWxsYmFjaygpO1xuICBzdG9wT2JzZXJ2aW5nTXV0YXRpb25zKCk7XG4gIGxldCByZXN1bHQgPSBjYWxsYmFjaygpO1xuICBzdGFydE9ic2VydmluZ011dGF0aW9ucygpO1xuICByZXR1cm4gcmVzdWx0O1xufVxudmFyIGlzQ29sbGVjdGluZyA9IGZhbHNlO1xudmFyIGRlZmVycmVkTXV0YXRpb25zID0gW107XG5mdW5jdGlvbiBkZWZlck11dGF0aW9ucygpIHtcbiAgaXNDb2xsZWN0aW5nID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGZsdXNoQW5kU3RvcERlZmVycmluZ011dGF0aW9ucygpIHtcbiAgaXNDb2xsZWN0aW5nID0gZmFsc2U7XG4gIG9uTXV0YXRlKGRlZmVycmVkTXV0YXRpb25zKTtcbiAgZGVmZXJyZWRNdXRhdGlvbnMgPSBbXTtcbn1cbmZ1bmN0aW9uIG9uTXV0YXRlKG11dGF0aW9ucykge1xuICBpZiAoaXNDb2xsZWN0aW5nKSB7XG4gICAgZGVmZXJyZWRNdXRhdGlvbnMgPSBkZWZlcnJlZE11dGF0aW9ucy5jb25jYXQobXV0YXRpb25zKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGFkZGVkTm9kZXMgPSBbXTtcbiAgbGV0IHJlbW92ZWROb2RlcyA9IFtdO1xuICBsZXQgYWRkZWRBdHRyaWJ1dGVzID0gbmV3IE1hcCgpO1xuICBsZXQgcmVtb3ZlZEF0dHJpYnV0ZXMgPSBuZXcgTWFwKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG11dGF0aW9uc1tpXS50YXJnZXQuX3hfaWdub3JlTXV0YXRpb25PYnNlcnZlcilcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmIChtdXRhdGlvbnNbaV0udHlwZSA9PT0gXCJjaGlsZExpc3RcIikge1xuICAgICAgbXV0YXRpb25zW2ldLmFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4gbm9kZS5ub2RlVHlwZSA9PT0gMSAmJiBhZGRlZE5vZGVzLnB1c2gobm9kZSkpO1xuICAgICAgbXV0YXRpb25zW2ldLnJlbW92ZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiBub2RlLm5vZGVUeXBlID09PSAxICYmIHJlbW92ZWROb2Rlcy5wdXNoKG5vZGUpKTtcbiAgICB9XG4gICAgaWYgKG11dGF0aW9uc1tpXS50eXBlID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgICAgbGV0IGVsID0gbXV0YXRpb25zW2ldLnRhcmdldDtcbiAgICAgIGxldCBuYW1lID0gbXV0YXRpb25zW2ldLmF0dHJpYnV0ZU5hbWU7XG4gICAgICBsZXQgb2xkVmFsdWUgPSBtdXRhdGlvbnNbaV0ub2xkVmFsdWU7XG4gICAgICBsZXQgYWRkMiA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFhZGRlZEF0dHJpYnV0ZXMuaGFzKGVsKSlcbiAgICAgICAgICBhZGRlZEF0dHJpYnV0ZXMuc2V0KGVsLCBbXSk7XG4gICAgICAgIGFkZGVkQXR0cmlidXRlcy5nZXQoZWwpLnB1c2goe25hbWUsIHZhbHVlOiBlbC5nZXRBdHRyaWJ1dGUobmFtZSl9KTtcbiAgICAgIH07XG4gICAgICBsZXQgcmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXJlbW92ZWRBdHRyaWJ1dGVzLmhhcyhlbCkpXG4gICAgICAgICAgcmVtb3ZlZEF0dHJpYnV0ZXMuc2V0KGVsLCBbXSk7XG4gICAgICAgIHJlbW92ZWRBdHRyaWJ1dGVzLmdldChlbCkucHVzaChuYW1lKTtcbiAgICAgIH07XG4gICAgICBpZiAoZWwuaGFzQXR0cmlidXRlKG5hbWUpICYmIG9sZFZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIGFkZDIoKTtcbiAgICAgIH0gZWxzZSBpZiAoZWwuaGFzQXR0cmlidXRlKG5hbWUpKSB7XG4gICAgICAgIHJlbW92ZSgpO1xuICAgICAgICBhZGQyKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmVtb3ZlZEF0dHJpYnV0ZXMuZm9yRWFjaCgoYXR0cnMsIGVsKSA9PiB7XG4gICAgY2xlYW51cEF0dHJpYnV0ZXMoZWwsIGF0dHJzKTtcbiAgfSk7XG4gIGFkZGVkQXR0cmlidXRlcy5mb3JFYWNoKChhdHRycywgZWwpID0+IHtcbiAgICBvbkF0dHJpYnV0ZUFkZGVkcy5mb3JFYWNoKChpKSA9PiBpKGVsLCBhdHRycykpO1xuICB9KTtcbiAgZm9yIChsZXQgbm9kZSBvZiByZW1vdmVkTm9kZXMpIHtcbiAgICBpZiAoYWRkZWROb2Rlcy5pbmNsdWRlcyhub2RlKSlcbiAgICAgIGNvbnRpbnVlO1xuICAgIG9uRWxSZW1vdmVkcy5mb3JFYWNoKChpKSA9PiBpKG5vZGUpKTtcbiAgICBpZiAobm9kZS5feF9jbGVhbnVwcykge1xuICAgICAgd2hpbGUgKG5vZGUuX3hfY2xlYW51cHMubGVuZ3RoKVxuICAgICAgICBub2RlLl94X2NsZWFudXBzLnBvcCgpKCk7XG4gICAgfVxuICB9XG4gIGFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgIG5vZGUuX3hfaWdub3JlU2VsZiA9IHRydWU7XG4gICAgbm9kZS5feF9pZ25vcmUgPSB0cnVlO1xuICB9KTtcbiAgZm9yIChsZXQgbm9kZSBvZiBhZGRlZE5vZGVzKSB7XG4gICAgaWYgKHJlbW92ZWROb2Rlcy5pbmNsdWRlcyhub2RlKSlcbiAgICAgIGNvbnRpbnVlO1xuICAgIGlmICghbm9kZS5pc0Nvbm5lY3RlZClcbiAgICAgIGNvbnRpbnVlO1xuICAgIGRlbGV0ZSBub2RlLl94X2lnbm9yZVNlbGY7XG4gICAgZGVsZXRlIG5vZGUuX3hfaWdub3JlO1xuICAgIG9uRWxBZGRlZHMuZm9yRWFjaCgoaSkgPT4gaShub2RlKSk7XG4gICAgbm9kZS5feF9pZ25vcmUgPSB0cnVlO1xuICAgIG5vZGUuX3hfaWdub3JlU2VsZiA9IHRydWU7XG4gIH1cbiAgYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgZGVsZXRlIG5vZGUuX3hfaWdub3JlU2VsZjtcbiAgICBkZWxldGUgbm9kZS5feF9pZ25vcmU7XG4gIH0pO1xuICBhZGRlZE5vZGVzID0gbnVsbDtcbiAgcmVtb3ZlZE5vZGVzID0gbnVsbDtcbiAgYWRkZWRBdHRyaWJ1dGVzID0gbnVsbDtcbiAgcmVtb3ZlZEF0dHJpYnV0ZXMgPSBudWxsO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc2NvcGUuanNcbmZ1bmN0aW9uIHNjb3BlKG5vZGUpIHtcbiAgcmV0dXJuIG1lcmdlUHJveGllcyhjbG9zZXN0RGF0YVN0YWNrKG5vZGUpKTtcbn1cbmZ1bmN0aW9uIGFkZFNjb3BlVG9Ob2RlKG5vZGUsIGRhdGEyLCByZWZlcmVuY2VOb2RlKSB7XG4gIG5vZGUuX3hfZGF0YVN0YWNrID0gW2RhdGEyLCAuLi5jbG9zZXN0RGF0YVN0YWNrKHJlZmVyZW5jZU5vZGUgfHwgbm9kZSldO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIG5vZGUuX3hfZGF0YVN0YWNrID0gbm9kZS5feF9kYXRhU3RhY2suZmlsdGVyKChpKSA9PiBpICE9PSBkYXRhMik7XG4gIH07XG59XG5mdW5jdGlvbiByZWZyZXNoU2NvcGUoZWxlbWVudCwgc2NvcGUyKSB7XG4gIGxldCBleGlzdGluZ1Njb3BlID0gZWxlbWVudC5feF9kYXRhU3RhY2tbMF07XG4gIE9iamVjdC5lbnRyaWVzKHNjb3BlMikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgZXhpc3RpbmdTY29wZVtrZXldID0gdmFsdWU7XG4gIH0pO1xufVxuZnVuY3Rpb24gY2xvc2VzdERhdGFTdGFjayhub2RlKSB7XG4gIGlmIChub2RlLl94X2RhdGFTdGFjaylcbiAgICByZXR1cm4gbm9kZS5feF9kYXRhU3RhY2s7XG4gIGlmICh0eXBlb2YgU2hhZG93Um9vdCA9PT0gXCJmdW5jdGlvblwiICYmIG5vZGUgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgcmV0dXJuIGNsb3Nlc3REYXRhU3RhY2sobm9kZS5ob3N0KTtcbiAgfVxuICBpZiAoIW5vZGUucGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gY2xvc2VzdERhdGFTdGFjayhub2RlLnBhcmVudE5vZGUpO1xufVxuZnVuY3Rpb24gbWVyZ2VQcm94aWVzKG9iamVjdHMpIHtcbiAgbGV0IHRoaXNQcm94eSA9IG5ldyBQcm94eSh7fSwge1xuICAgIG93bktleXM6ICgpID0+IHtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKG5ldyBTZXQob2JqZWN0cy5mbGF0TWFwKChpKSA9PiBPYmplY3Qua2V5cyhpKSkpKTtcbiAgICB9LFxuICAgIGhhczogKHRhcmdldCwgbmFtZSkgPT4ge1xuICAgICAgcmV0dXJuIG9iamVjdHMuc29tZSgob2JqKSA9PiBvYmouaGFzT3duUHJvcGVydHkobmFtZSkpO1xuICAgIH0sXG4gICAgZ2V0OiAodGFyZ2V0LCBuYW1lKSA9PiB7XG4gICAgICByZXR1cm4gKG9iamVjdHMuZmluZCgob2JqKSA9PiB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBuYW1lKTtcbiAgICAgICAgICBpZiAoZGVzY3JpcHRvci5nZXQgJiYgZGVzY3JpcHRvci5nZXQuX3hfYWxyZWFkeUJvdW5kIHx8IGRlc2NyaXB0b3Iuc2V0ICYmIGRlc2NyaXB0b3Iuc2V0Ll94X2FscmVhZHlCb3VuZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoZGVzY3JpcHRvci5nZXQgfHwgZGVzY3JpcHRvci5zZXQpICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZSkge1xuICAgICAgICAgICAgbGV0IGdldHRlciA9IGRlc2NyaXB0b3IuZ2V0O1xuICAgICAgICAgICAgbGV0IHNldHRlciA9IGRlc2NyaXB0b3Iuc2V0O1xuICAgICAgICAgICAgbGV0IHByb3BlcnR5ID0gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIGdldHRlciA9IGdldHRlciAmJiBnZXR0ZXIuYmluZCh0aGlzUHJveHkpO1xuICAgICAgICAgICAgc2V0dGVyID0gc2V0dGVyICYmIHNldHRlci5iaW5kKHRoaXNQcm94eSk7XG4gICAgICAgICAgICBpZiAoZ2V0dGVyKVxuICAgICAgICAgICAgICBnZXR0ZXIuX3hfYWxyZWFkeUJvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChzZXR0ZXIpXG4gICAgICAgICAgICAgIHNldHRlci5feF9hbHJlYWR5Qm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgICAgICAgICAuLi5wcm9wZXJ0eSxcbiAgICAgICAgICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICAgICAgICAgIHNldDogc2V0dGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSkgfHwge30pW25hbWVdO1xuICAgIH0sXG4gICAgc2V0OiAodGFyZ2V0LCBuYW1lLCB2YWx1ZSkgPT4ge1xuICAgICAgbGV0IGNsb3Nlc3RPYmplY3RXaXRoS2V5ID0gb2JqZWN0cy5maW5kKChvYmopID0+IG9iai5oYXNPd25Qcm9wZXJ0eShuYW1lKSk7XG4gICAgICBpZiAoY2xvc2VzdE9iamVjdFdpdGhLZXkpIHtcbiAgICAgICAgY2xvc2VzdE9iamVjdFdpdGhLZXlbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdHNbb2JqZWN0cy5sZW5ndGggLSAxXVtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRoaXNQcm94eTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2ludGVyY2VwdG9yLmpzXG5mdW5jdGlvbiBpbml0SW50ZXJjZXB0b3JzKGRhdGEyKSB7XG4gIGxldCBpc09iamVjdDIgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbCkgJiYgdmFsICE9PSBudWxsO1xuICBsZXQgcmVjdXJzZSA9IChvYmosIGJhc2VQYXRoID0gXCJcIikgPT4ge1xuICAgIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iaikpLmZvckVhY2goKFtrZXksIHt2YWx1ZSwgZW51bWVyYWJsZX1dKSA9PiB7XG4gICAgICBpZiAoZW51bWVyYWJsZSA9PT0gZmFsc2UgfHwgdmFsdWUgPT09IHZvaWQgMClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbGV0IHBhdGggPSBiYXNlUGF0aCA9PT0gXCJcIiA/IGtleSA6IGAke2Jhc2VQYXRofS4ke2tleX1gO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5feF9pbnRlcmNlcHRvcikge1xuICAgICAgICBvYmpba2V5XSA9IHZhbHVlLmluaXRpYWxpemUoZGF0YTIsIHBhdGgsIGtleSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNPYmplY3QyKHZhbHVlKSAmJiB2YWx1ZSAhPT0gb2JqICYmICEodmFsdWUgaW5zdGFuY2VvZiBFbGVtZW50KSkge1xuICAgICAgICAgIHJlY3Vyc2UodmFsdWUsIHBhdGgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiByZWN1cnNlKGRhdGEyKTtcbn1cbmZ1bmN0aW9uIGludGVyY2VwdG9yKGNhbGxiYWNrLCBtdXRhdGVPYmogPSAoKSA9PiB7XG59KSB7XG4gIGxldCBvYmogPSB7XG4gICAgaW5pdGlhbFZhbHVlOiB2b2lkIDAsXG4gICAgX3hfaW50ZXJjZXB0b3I6IHRydWUsXG4gICAgaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5pbml0aWFsVmFsdWUsICgpID0+IGdldChkYXRhMiwgcGF0aCksICh2YWx1ZSkgPT4gc2V0KGRhdGEyLCBwYXRoLCB2YWx1ZSksIHBhdGgsIGtleSk7XG4gICAgfVxuICB9O1xuICBtdXRhdGVPYmoob2JqKTtcbiAgcmV0dXJuIChpbml0aWFsVmFsdWUpID0+IHtcbiAgICBpZiAodHlwZW9mIGluaXRpYWxWYWx1ZSA9PT0gXCJvYmplY3RcIiAmJiBpbml0aWFsVmFsdWUgIT09IG51bGwgJiYgaW5pdGlhbFZhbHVlLl94X2ludGVyY2VwdG9yKSB7XG4gICAgICBsZXQgaW5pdGlhbGl6ZSA9IG9iai5pbml0aWFsaXplLmJpbmQob2JqKTtcbiAgICAgIG9iai5pbml0aWFsaXplID0gKGRhdGEyLCBwYXRoLCBrZXkpID0+IHtcbiAgICAgICAgbGV0IGlubmVyVmFsdWUgPSBpbml0aWFsVmFsdWUuaW5pdGlhbGl6ZShkYXRhMiwgcGF0aCwga2V5KTtcbiAgICAgICAgb2JqLmluaXRpYWxWYWx1ZSA9IGlubmVyVmFsdWU7XG4gICAgICAgIHJldHVybiBpbml0aWFsaXplKGRhdGEyLCBwYXRoLCBrZXkpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqLmluaXRpYWxWYWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcbn1cbmZ1bmN0aW9uIGdldChvYmosIHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoXCIuXCIpLnJlZHVjZSgoY2FycnksIHNlZ21lbnQpID0+IGNhcnJ5W3NlZ21lbnRdLCBvYmopO1xufVxuZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBwYXRoID09PSBcInN0cmluZ1wiKVxuICAgIHBhdGggPSBwYXRoLnNwbGl0KFwiLlwiKTtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAxKVxuICAgIG9ialtwYXRoWzBdXSA9IHZhbHVlO1xuICBlbHNlIGlmIChwYXRoLmxlbmd0aCA9PT0gMClcbiAgICB0aHJvdyBlcnJvcjtcbiAgZWxzZSB7XG4gICAgaWYgKG9ialtwYXRoWzBdXSlcbiAgICAgIHJldHVybiBzZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gICAgZWxzZSB7XG4gICAgICBvYmpbcGF0aFswXV0gPSB7fTtcbiAgICAgIHJldHVybiBzZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MuanNcbnZhciBtYWdpY3MgPSB7fTtcbmZ1bmN0aW9uIG1hZ2ljKG5hbWUsIGNhbGxiYWNrKSB7XG4gIG1hZ2ljc1tuYW1lXSA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gaW5qZWN0TWFnaWNzKG9iaiwgZWwpIHtcbiAgT2JqZWN0LmVudHJpZXMobWFnaWNzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgYCQke25hbWV9YCwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICBsZXQgW3V0aWxpdGllcywgY2xlYW51cDJdID0gZ2V0RWxlbWVudEJvdW5kVXRpbGl0aWVzKGVsKTtcbiAgICAgICAgdXRpbGl0aWVzID0ge2ludGVyY2VwdG9yLCAuLi51dGlsaXRpZXN9O1xuICAgICAgICBvbkVsUmVtb3ZlZChlbCwgY2xlYW51cDIpO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZWwsIHV0aWxpdGllcyk7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9lcnJvci5qc1xuZnVuY3Rpb24gdHJ5Q2F0Y2goZWwsIGV4cHJlc3Npb24sIGNhbGxiYWNrLCAuLi5hcmdzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKC4uLmFyZ3MpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaGFuZGxlRXJyb3IoZSwgZWwsIGV4cHJlc3Npb24pO1xuICB9XG59XG5mdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uID0gdm9pZCAwKSB7XG4gIE9iamVjdC5hc3NpZ24oZXJyb3IyLCB7ZWwsIGV4cHJlc3Npb259KTtcbiAgY29uc29sZS53YXJuKGBBbHBpbmUgRXhwcmVzc2lvbiBFcnJvcjogJHtlcnJvcjIubWVzc2FnZX1cblxuJHtleHByZXNzaW9uID8gJ0V4cHJlc3Npb246IFwiJyArIGV4cHJlc3Npb24gKyAnXCJcXG5cXG4nIDogXCJcIn1gLCBlbCk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIHRocm93IGVycm9yMjtcbiAgfSwgMCk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9ldmFsdWF0b3IuanNcbnZhciBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSB0cnVlO1xuZnVuY3Rpb24gZG9udEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyhjYWxsYmFjaykge1xuICBsZXQgY2FjaGUgPSBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnM7XG4gIHNob3VsZEF1dG9FdmFsdWF0ZUZ1bmN0aW9ucyA9IGZhbHNlO1xuICBjYWxsYmFjaygpO1xuICBzaG91bGRBdXRvRXZhbHVhdGVGdW5jdGlvbnMgPSBjYWNoZTtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlKGVsLCBleHByZXNzaW9uLCBleHRyYXMgPSB7fSkge1xuICBsZXQgcmVzdWx0O1xuICBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSgodmFsdWUpID0+IHJlc3VsdCA9IHZhbHVlLCBleHRyYXMpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gZXZhbHVhdGVMYXRlciguLi5hcmdzKSB7XG4gIHJldHVybiB0aGVFdmFsdWF0b3JGdW5jdGlvbiguLi5hcmdzKTtcbn1cbnZhciB0aGVFdmFsdWF0b3JGdW5jdGlvbiA9IG5vcm1hbEV2YWx1YXRvcjtcbmZ1bmN0aW9uIHNldEV2YWx1YXRvcihuZXdFdmFsdWF0b3IpIHtcbiAgdGhlRXZhbHVhdG9yRnVuY3Rpb24gPSBuZXdFdmFsdWF0b3I7XG59XG5mdW5jdGlvbiBub3JtYWxFdmFsdWF0b3IoZWwsIGV4cHJlc3Npb24pIHtcbiAgbGV0IG92ZXJyaWRkZW5NYWdpY3MgPSB7fTtcbiAgaW5qZWN0TWFnaWNzKG92ZXJyaWRkZW5NYWdpY3MsIGVsKTtcbiAgbGV0IGRhdGFTdGFjayA9IFtvdmVycmlkZGVuTWFnaWNzLCAuLi5jbG9zZXN0RGF0YVN0YWNrKGVsKV07XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIGdlbmVyYXRlRXZhbHVhdG9yRnJvbUZ1bmN0aW9uKGRhdGFTdGFjaywgZXhwcmVzc2lvbik7XG4gIH1cbiAgbGV0IGV2YWx1YXRvciA9IGdlbmVyYXRlRXZhbHVhdG9yRnJvbVN0cmluZyhkYXRhU3RhY2ssIGV4cHJlc3Npb24sIGVsKTtcbiAgcmV0dXJuIHRyeUNhdGNoLmJpbmQobnVsbCwgZWwsIGV4cHJlc3Npb24sIGV2YWx1YXRvcik7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUV2YWx1YXRvckZyb21GdW5jdGlvbihkYXRhU3RhY2ssIGZ1bmMpIHtcbiAgcmV0dXJuIChyZWNlaXZlciA9ICgpID0+IHtcbiAgfSwge3Njb3BlOiBzY29wZTIgPSB7fSwgcGFyYW1zID0gW119ID0ge30pID0+IHtcbiAgICBsZXQgcmVzdWx0ID0gZnVuYy5hcHBseShtZXJnZVByb3hpZXMoW3Njb3BlMiwgLi4uZGF0YVN0YWNrXSksIHBhcmFtcyk7XG4gICAgcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgcmVzdWx0KTtcbiAgfTtcbn1cbnZhciBldmFsdWF0b3JNZW1vID0ge307XG5mdW5jdGlvbiBnZW5lcmF0ZUZ1bmN0aW9uRnJvbVN0cmluZyhleHByZXNzaW9uLCBlbCkge1xuICBpZiAoZXZhbHVhdG9yTWVtb1tleHByZXNzaW9uXSkge1xuICAgIHJldHVybiBldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dO1xuICB9XG4gIGxldCBBc3luY0Z1bmN0aW9uID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGFzeW5jIGZ1bmN0aW9uKCkge1xuICB9KS5jb25zdHJ1Y3RvcjtcbiAgbGV0IHJpZ2h0U2lkZVNhZmVFeHByZXNzaW9uID0gL15bXFxuXFxzXSppZi4qXFwoLipcXCkvLnRlc3QoZXhwcmVzc2lvbikgfHwgL14obGV0fGNvbnN0KVxccy8udGVzdChleHByZXNzaW9uKSA/IGAoKCkgPT4geyAke2V4cHJlc3Npb259IH0pKClgIDogZXhwcmVzc2lvbjtcbiAgY29uc3Qgc2FmZUFzeW5jRnVuY3Rpb24gPSAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBuZXcgQXN5bmNGdW5jdGlvbihbXCJfX3NlbGZcIiwgXCJzY29wZVwiXSwgYHdpdGggKHNjb3BlKSB7IF9fc2VsZi5yZXN1bHQgPSAke3JpZ2h0U2lkZVNhZmVFeHByZXNzaW9ufSB9OyBfX3NlbGYuZmluaXNoZWQgPSB0cnVlOyByZXR1cm4gX19zZWxmLnJlc3VsdDtgKTtcbiAgICB9IGNhdGNoIChlcnJvcjIpIHtcbiAgICAgIGhhbmRsZUVycm9yKGVycm9yMiwgZWwsIGV4cHJlc3Npb24pO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgfTtcbiAgbGV0IGZ1bmMgPSBzYWZlQXN5bmNGdW5jdGlvbigpO1xuICBldmFsdWF0b3JNZW1vW2V4cHJlc3Npb25dID0gZnVuYztcbiAgcmV0dXJuIGZ1bmM7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUV2YWx1YXRvckZyb21TdHJpbmcoZGF0YVN0YWNrLCBleHByZXNzaW9uLCBlbCkge1xuICBsZXQgZnVuYyA9IGdlbmVyYXRlRnVuY3Rpb25Gcm9tU3RyaW5nKGV4cHJlc3Npb24sIGVsKTtcbiAgcmV0dXJuIChyZWNlaXZlciA9ICgpID0+IHtcbiAgfSwge3Njb3BlOiBzY29wZTIgPSB7fSwgcGFyYW1zID0gW119ID0ge30pID0+IHtcbiAgICBmdW5jLnJlc3VsdCA9IHZvaWQgMDtcbiAgICBmdW5jLmZpbmlzaGVkID0gZmFsc2U7XG4gICAgbGV0IGNvbXBsZXRlU2NvcGUgPSBtZXJnZVByb3hpZXMoW3Njb3BlMiwgLi4uZGF0YVN0YWNrXSk7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGxldCBwcm9taXNlID0gZnVuYyhmdW5jLCBjb21wbGV0ZVNjb3BlKS5jYXRjaCgoZXJyb3IyKSA9PiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKSk7XG4gICAgICBpZiAoZnVuYy5maW5pc2hlZCkge1xuICAgICAgICBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCBmdW5jLnJlc3VsdCwgY29tcGxldGVTY29wZSwgcGFyYW1zLCBlbCk7XG4gICAgICAgIGZ1bmMucmVzdWx0ID0gdm9pZCAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBydW5JZlR5cGVPZkZ1bmN0aW9uKHJlY2VpdmVyLCByZXN1bHQsIGNvbXBsZXRlU2NvcGUsIHBhcmFtcywgZWwpO1xuICAgICAgICB9KS5jYXRjaCgoZXJyb3IyKSA9PiBoYW5kbGVFcnJvcihlcnJvcjIsIGVsLCBleHByZXNzaW9uKSkuZmluYWxseSgoKSA9PiBmdW5jLnJlc3VsdCA9IHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gcnVuSWZUeXBlT2ZGdW5jdGlvbihyZWNlaXZlciwgdmFsdWUsIHNjb3BlMiwgcGFyYW1zLCBlbCkge1xuICBpZiAoc2hvdWxkQXV0b0V2YWx1YXRlRnVuY3Rpb25zICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgbGV0IHJlc3VsdCA9IHZhbHVlLmFwcGx5KHNjb3BlMiwgcGFyYW1zKTtcbiAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgcmVzdWx0LnRoZW4oKGkpID0+IHJ1bklmVHlwZU9mRnVuY3Rpb24ocmVjZWl2ZXIsIGksIHNjb3BlMiwgcGFyYW1zKSkuY2F0Y2goKGVycm9yMikgPT4gaGFuZGxlRXJyb3IoZXJyb3IyLCBlbCwgdmFsdWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVjZWl2ZXIocmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVjZWl2ZXIodmFsdWUpO1xuICB9XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzLmpzXG52YXIgcHJlZml4QXNTdHJpbmcgPSBcIngtXCI7XG5mdW5jdGlvbiBwcmVmaXgoc3ViamVjdCA9IFwiXCIpIHtcbiAgcmV0dXJuIHByZWZpeEFzU3RyaW5nICsgc3ViamVjdDtcbn1cbmZ1bmN0aW9uIHNldFByZWZpeChuZXdQcmVmaXgpIHtcbiAgcHJlZml4QXNTdHJpbmcgPSBuZXdQcmVmaXg7XG59XG52YXIgZGlyZWN0aXZlSGFuZGxlcnMgPSB7fTtcbmZ1bmN0aW9uIGRpcmVjdGl2ZShuYW1lLCBjYWxsYmFjaykge1xuICBkaXJlY3RpdmVIYW5kbGVyc1tuYW1lXSA9IGNhbGxiYWNrO1xufVxuZnVuY3Rpb24gZGlyZWN0aXZlcyhlbCwgYXR0cmlidXRlcywgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkge1xuICBhdHRyaWJ1dGVzID0gQXJyYXkuZnJvbShhdHRyaWJ1dGVzKTtcbiAgaWYgKGVsLl94X3ZpcnR1YWxEaXJlY3RpdmVzKSB7XG4gICAgbGV0IHZBdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMoZWwuX3hfdmlydHVhbERpcmVjdGl2ZXMpLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gKHtuYW1lLCB2YWx1ZX0pKTtcbiAgICBsZXQgc3RhdGljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNPbmx5KHZBdHRyaWJ1dGVzKTtcbiAgICB2QXR0cmlidXRlcyA9IHZBdHRyaWJ1dGVzLm1hcCgoYXR0cmlidXRlKSA9PiB7XG4gICAgICBpZiAoc3RhdGljQXR0cmlidXRlcy5maW5kKChhdHRyKSA9PiBhdHRyLm5hbWUgPT09IGF0dHJpYnV0ZS5uYW1lKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6IGB4LWJpbmQ6JHthdHRyaWJ1dGUubmFtZX1gLFxuICAgICAgICAgIHZhbHVlOiBgXCIke2F0dHJpYnV0ZS52YWx1ZX1cImBcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gICAgfSk7XG4gICAgYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMuY29uY2F0KHZBdHRyaWJ1dGVzKTtcbiAgfVxuICBsZXQgdHJhbnNmb3JtZWRBdHRyaWJ1dGVNYXAgPSB7fTtcbiAgbGV0IGRpcmVjdGl2ZXMyID0gYXR0cmlidXRlcy5tYXAodG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoKG5ld05hbWUsIG9sZE5hbWUpID0+IHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwW25ld05hbWVdID0gb2xkTmFtZSkpLmZpbHRlcihvdXROb25BbHBpbmVBdHRyaWJ1dGVzKS5tYXAodG9QYXJzZWREaXJlY3RpdmVzKHRyYW5zZm9ybWVkQXR0cmlidXRlTWFwLCBvcmlnaW5hbEF0dHJpYnV0ZU92ZXJyaWRlKSkuc29ydChieVByaW9yaXR5KTtcbiAgcmV0dXJuIGRpcmVjdGl2ZXMyLm1hcCgoZGlyZWN0aXZlMikgPT4ge1xuICAgIHJldHVybiBnZXREaXJlY3RpdmVIYW5kbGVyKGVsLCBkaXJlY3RpdmUyKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBhdHRyaWJ1dGVzT25seShhdHRyaWJ1dGVzKSB7XG4gIHJldHVybiBBcnJheS5mcm9tKGF0dHJpYnV0ZXMpLm1hcCh0b1RyYW5zZm9ybWVkQXR0cmlidXRlcygpKS5maWx0ZXIoKGF0dHIpID0+ICFvdXROb25BbHBpbmVBdHRyaWJ1dGVzKGF0dHIpKTtcbn1cbnZhciBpc0RlZmVycmluZ0hhbmRsZXJzID0gZmFsc2U7XG52YXIgZGlyZWN0aXZlSGFuZGxlclN0YWNrcyA9IG5ldyBNYXAoKTtcbnZhciBjdXJyZW50SGFuZGxlclN0YWNrS2V5ID0gU3ltYm9sKCk7XG5mdW5jdGlvbiBkZWZlckhhbmRsaW5nRGlyZWN0aXZlcyhjYWxsYmFjaykge1xuICBpc0RlZmVycmluZ0hhbmRsZXJzID0gdHJ1ZTtcbiAgbGV0IGtleSA9IFN5bWJvbCgpO1xuICBjdXJyZW50SGFuZGxlclN0YWNrS2V5ID0ga2V5O1xuICBkaXJlY3RpdmVIYW5kbGVyU3RhY2tzLnNldChrZXksIFtdKTtcbiAgbGV0IGZsdXNoSGFuZGxlcnMgPSAoKSA9PiB7XG4gICAgd2hpbGUgKGRpcmVjdGl2ZUhhbmRsZXJTdGFja3MuZ2V0KGtleSkubGVuZ3RoKVxuICAgICAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoa2V5KS5zaGlmdCgpKCk7XG4gICAgZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5kZWxldGUoa2V5KTtcbiAgfTtcbiAgbGV0IHN0b3BEZWZlcnJpbmcgPSAoKSA9PiB7XG4gICAgaXNEZWZlcnJpbmdIYW5kbGVycyA9IGZhbHNlO1xuICAgIGZsdXNoSGFuZGxlcnMoKTtcbiAgfTtcbiAgY2FsbGJhY2soZmx1c2hIYW5kbGVycyk7XG4gIHN0b3BEZWZlcnJpbmcoKTtcbn1cbmZ1bmN0aW9uIGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCkge1xuICBsZXQgY2xlYW51cHMgPSBbXTtcbiAgbGV0IGNsZWFudXAyID0gKGNhbGxiYWNrKSA9PiBjbGVhbnVwcy5wdXNoKGNhbGxiYWNrKTtcbiAgbGV0IFtlZmZlY3QzLCBjbGVhbnVwRWZmZWN0XSA9IGVsZW1lbnRCb3VuZEVmZmVjdChlbCk7XG4gIGNsZWFudXBzLnB1c2goY2xlYW51cEVmZmVjdCk7XG4gIGxldCB1dGlsaXRpZXMgPSB7XG4gICAgQWxwaW5lOiBhbHBpbmVfZGVmYXVsdCxcbiAgICBlZmZlY3Q6IGVmZmVjdDMsXG4gICAgY2xlYW51cDogY2xlYW51cDIsXG4gICAgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlci5iaW5kKGV2YWx1YXRlTGF0ZXIsIGVsKSxcbiAgICBldmFsdWF0ZTogZXZhbHVhdGUuYmluZChldmFsdWF0ZSwgZWwpXG4gIH07XG4gIGxldCBkb0NsZWFudXAgPSAoKSA9PiBjbGVhbnVwcy5mb3JFYWNoKChpKSA9PiBpKCkpO1xuICByZXR1cm4gW3V0aWxpdGllcywgZG9DbGVhbnVwXTtcbn1cbmZ1bmN0aW9uIGdldERpcmVjdGl2ZUhhbmRsZXIoZWwsIGRpcmVjdGl2ZTIpIHtcbiAgbGV0IG5vb3AgPSAoKSA9PiB7XG4gIH07XG4gIGxldCBoYW5kbGVyMyA9IGRpcmVjdGl2ZUhhbmRsZXJzW2RpcmVjdGl2ZTIudHlwZV0gfHwgbm9vcDtcbiAgbGV0IFt1dGlsaXRpZXMsIGNsZWFudXAyXSA9IGdldEVsZW1lbnRCb3VuZFV0aWxpdGllcyhlbCk7XG4gIG9uQXR0cmlidXRlUmVtb3ZlZChlbCwgZGlyZWN0aXZlMi5vcmlnaW5hbCwgY2xlYW51cDIpO1xuICBsZXQgZnVsbEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgaWYgKGVsLl94X2lnbm9yZSB8fCBlbC5feF9pZ25vcmVTZWxmKVxuICAgICAgcmV0dXJuO1xuICAgIGhhbmRsZXIzLmlubGluZSAmJiBoYW5kbGVyMy5pbmxpbmUoZWwsIGRpcmVjdGl2ZTIsIHV0aWxpdGllcyk7XG4gICAgaGFuZGxlcjMgPSBoYW5kbGVyMy5iaW5kKGhhbmRsZXIzLCBlbCwgZGlyZWN0aXZlMiwgdXRpbGl0aWVzKTtcbiAgICBpc0RlZmVycmluZ0hhbmRsZXJzID8gZGlyZWN0aXZlSGFuZGxlclN0YWNrcy5nZXQoY3VycmVudEhhbmRsZXJTdGFja0tleSkucHVzaChoYW5kbGVyMykgOiBoYW5kbGVyMygpO1xuICB9O1xuICBmdWxsSGFuZGxlci5ydW5DbGVhbnVwcyA9IGNsZWFudXAyO1xuICByZXR1cm4gZnVsbEhhbmRsZXI7XG59XG52YXIgc3RhcnRpbmdXaXRoID0gKHN1YmplY3QsIHJlcGxhY2VtZW50KSA9PiAoe25hbWUsIHZhbHVlfSkgPT4ge1xuICBpZiAobmFtZS5zdGFydHNXaXRoKHN1YmplY3QpKVxuICAgIG5hbWUgPSBuYW1lLnJlcGxhY2Uoc3ViamVjdCwgcmVwbGFjZW1lbnQpO1xuICByZXR1cm4ge25hbWUsIHZhbHVlfTtcbn07XG52YXIgaW50byA9IChpKSA9PiBpO1xuZnVuY3Rpb24gdG9UcmFuc2Zvcm1lZEF0dHJpYnV0ZXMoY2FsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIHJldHVybiAoe25hbWUsIHZhbHVlfSkgPT4ge1xuICAgIGxldCB7bmFtZTogbmV3TmFtZSwgdmFsdWU6IG5ld1ZhbHVlfSA9IGF0dHJpYnV0ZVRyYW5zZm9ybWVycy5yZWR1Y2UoKGNhcnJ5LCB0cmFuc2Zvcm0pID0+IHtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm0oY2FycnkpO1xuICAgIH0sIHtuYW1lLCB2YWx1ZX0pO1xuICAgIGlmIChuZXdOYW1lICE9PSBuYW1lKVxuICAgICAgY2FsbGJhY2sobmV3TmFtZSwgbmFtZSk7XG4gICAgcmV0dXJuIHtuYW1lOiBuZXdOYW1lLCB2YWx1ZTogbmV3VmFsdWV9O1xuICB9O1xufVxudmFyIGF0dHJpYnV0ZVRyYW5zZm9ybWVycyA9IFtdO1xuZnVuY3Rpb24gbWFwQXR0cmlidXRlcyhjYWxsYmFjaykge1xuICBhdHRyaWJ1dGVUcmFuc2Zvcm1lcnMucHVzaChjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBvdXROb25BbHBpbmVBdHRyaWJ1dGVzKHtuYW1lfSkge1xuICByZXR1cm4gYWxwaW5lQXR0cmlidXRlUmVnZXgoKS50ZXN0KG5hbWUpO1xufVxudmFyIGFscGluZUF0dHJpYnV0ZVJlZ2V4ID0gKCkgPT4gbmV3IFJlZ0V4cChgXiR7cHJlZml4QXNTdHJpbmd9KFteOl4uXSspXFxcXGJgKTtcbmZ1bmN0aW9uIHRvUGFyc2VkRGlyZWN0aXZlcyh0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcCwgb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSkge1xuICByZXR1cm4gKHtuYW1lLCB2YWx1ZX0pID0+IHtcbiAgICBsZXQgdHlwZU1hdGNoID0gbmFtZS5tYXRjaChhbHBpbmVBdHRyaWJ1dGVSZWdleCgpKTtcbiAgICBsZXQgdmFsdWVNYXRjaCA9IG5hbWUubWF0Y2goLzooW2EtekEtWjAtOVxcLTpdKykvKTtcbiAgICBsZXQgbW9kaWZpZXJzID0gbmFtZS5tYXRjaCgvXFwuW14uXFxdXSsoPz1bXlxcXV0qJCkvZykgfHwgW107XG4gICAgbGV0IG9yaWdpbmFsID0gb3JpZ2luYWxBdHRyaWJ1dGVPdmVycmlkZSB8fCB0cmFuc2Zvcm1lZEF0dHJpYnV0ZU1hcFtuYW1lXSB8fCBuYW1lO1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0eXBlTWF0Y2ggPyB0eXBlTWF0Y2hbMV0gOiBudWxsLFxuICAgICAgdmFsdWU6IHZhbHVlTWF0Y2ggPyB2YWx1ZU1hdGNoWzFdIDogbnVsbCxcbiAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLm1hcCgoaSkgPT4gaS5yZXBsYWNlKFwiLlwiLCBcIlwiKSksXG4gICAgICBleHByZXNzaW9uOiB2YWx1ZSxcbiAgICAgIG9yaWdpbmFsXG4gICAgfTtcbiAgfTtcbn1cbnZhciBERUZBVUxUID0gXCJERUZBVUxUXCI7XG52YXIgZGlyZWN0aXZlT3JkZXIgPSBbXG4gIFwiaWdub3JlXCIsXG4gIFwicmVmXCIsXG4gIFwiZGF0YVwiLFxuICBcImlkXCIsXG4gIFwicmFkaW9cIixcbiAgXCJ0YWJzXCIsXG4gIFwic3dpdGNoXCIsXG4gIFwiZGlzY2xvc3VyZVwiLFxuICBcIm1lbnVcIixcbiAgXCJsaXN0Ym94XCIsXG4gIFwibGlzdFwiLFxuICBcIml0ZW1cIixcbiAgXCJjb21ib2JveFwiLFxuICBcImJpbmRcIixcbiAgXCJpbml0XCIsXG4gIFwiZm9yXCIsXG4gIFwibWFza1wiLFxuICBcIm1vZGVsXCIsXG4gIFwibW9kZWxhYmxlXCIsXG4gIFwidHJhbnNpdGlvblwiLFxuICBcInNob3dcIixcbiAgXCJpZlwiLFxuICBERUZBVUxULFxuICBcInRlbGVwb3J0XCJcbl07XG5mdW5jdGlvbiBieVByaW9yaXR5KGEsIGIpIHtcbiAgbGV0IHR5cGVBID0gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZihhLnR5cGUpID09PSAtMSA/IERFRkFVTFQgOiBhLnR5cGU7XG4gIGxldCB0eXBlQiA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYi50eXBlKSA9PT0gLTEgPyBERUZBVUxUIDogYi50eXBlO1xuICByZXR1cm4gZGlyZWN0aXZlT3JkZXIuaW5kZXhPZih0eXBlQSkgLSBkaXJlY3RpdmVPcmRlci5pbmRleE9mKHR5cGVCKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2Rpc3BhdGNoLmpzXG5mdW5jdGlvbiBkaXNwYXRjaChlbCwgbmFtZSwgZGV0YWlsID0ge30pIHtcbiAgZWwuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQobmFtZSwge1xuICAgIGRldGFpbCxcbiAgICBidWJibGVzOiB0cnVlLFxuICAgIGNvbXBvc2VkOiB0cnVlLFxuICAgIGNhbmNlbGFibGU6IHRydWVcbiAgfSkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbmV4dFRpY2suanNcbnZhciB0aWNrU3RhY2sgPSBbXTtcbnZhciBpc0hvbGRpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICBxdWV1ZU1pY3JvdGFzaygoKSA9PiB7XG4gICAgaXNIb2xkaW5nIHx8IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVsZWFzZU5leHRUaWNrcygpO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMpID0+IHtcbiAgICB0aWNrU3RhY2sucHVzaCgoKSA9PiB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgICAgcmVzKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVsZWFzZU5leHRUaWNrcygpIHtcbiAgaXNIb2xkaW5nID0gZmFsc2U7XG4gIHdoaWxlICh0aWNrU3RhY2subGVuZ3RoKVxuICAgIHRpY2tTdGFjay5zaGlmdCgpKCk7XG59XG5mdW5jdGlvbiBob2xkTmV4dFRpY2tzKCkge1xuICBpc0hvbGRpbmcgPSB0cnVlO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvd2Fsay5qc1xuZnVuY3Rpb24gd2FsayhlbCwgY2FsbGJhY2spIHtcbiAgaWYgKHR5cGVvZiBTaGFkb3dSb290ID09PSBcImZ1bmN0aW9uXCIgJiYgZWwgaW5zdGFuY2VvZiBTaGFkb3dSb290KSB7XG4gICAgQXJyYXkuZnJvbShlbC5jaGlsZHJlbikuZm9yRWFjaCgoZWwyKSA9PiB3YWxrKGVsMiwgY2FsbGJhY2spKTtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IHNraXAgPSBmYWxzZTtcbiAgY2FsbGJhY2soZWwsICgpID0+IHNraXAgPSB0cnVlKTtcbiAgaWYgKHNraXApXG4gICAgcmV0dXJuO1xuICBsZXQgbm9kZSA9IGVsLmZpcnN0RWxlbWVudENoaWxkO1xuICB3aGlsZSAobm9kZSkge1xuICAgIHdhbGsobm9kZSwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICBub2RlID0gbm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gIH1cbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3dhcm4uanNcbmZ1bmN0aW9uIHdhcm4obWVzc2FnZSwgLi4uYXJncykge1xuICBjb25zb2xlLndhcm4oYEFscGluZSBXYXJuaW5nOiAke21lc3NhZ2V9YCwgLi4uYXJncyk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9saWZlY3ljbGUuanNcbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBpZiAoIWRvY3VtZW50LmJvZHkpXG4gICAgd2FybihcIlVuYWJsZSB0byBpbml0aWFsaXplLiBUcnlpbmcgdG8gbG9hZCBBbHBpbmUgYmVmb3JlIGA8Ym9keT5gIGlzIGF2YWlsYWJsZS4gRGlkIHlvdSBmb3JnZXQgdG8gYWRkIGBkZWZlcmAgaW4gQWxwaW5lJ3MgYDxzY3JpcHQ+YCB0YWc/XCIpO1xuICBkaXNwYXRjaChkb2N1bWVudCwgXCJhbHBpbmU6aW5pdFwiKTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRpYWxpemluZ1wiKTtcbiAgc3RhcnRPYnNlcnZpbmdNdXRhdGlvbnMoKTtcbiAgb25FbEFkZGVkKChlbCkgPT4gaW5pdFRyZWUoZWwsIHdhbGspKTtcbiAgb25FbFJlbW92ZWQoKGVsKSA9PiBkZXN0cm95VHJlZShlbCkpO1xuICBvbkF0dHJpYnV0ZXNBZGRlZCgoZWwsIGF0dHJzKSA9PiB7XG4gICAgZGlyZWN0aXZlcyhlbCwgYXR0cnMpLmZvckVhY2goKGhhbmRsZSkgPT4gaGFuZGxlKCkpO1xuICB9KTtcbiAgbGV0IG91dE5lc3RlZENvbXBvbmVudHMgPSAoZWwpID0+ICFjbG9zZXN0Um9vdChlbC5wYXJlbnRFbGVtZW50LCB0cnVlKTtcbiAgQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFsbFNlbGVjdG9ycygpKSkuZmlsdGVyKG91dE5lc3RlZENvbXBvbmVudHMpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgaW5pdFRyZWUoZWwpO1xuICB9KTtcbiAgZGlzcGF0Y2goZG9jdW1lbnQsIFwiYWxwaW5lOmluaXRpYWxpemVkXCIpO1xufVxudmFyIHJvb3RTZWxlY3RvckNhbGxiYWNrcyA9IFtdO1xudmFyIGluaXRTZWxlY3RvckNhbGxiYWNrcyA9IFtdO1xuZnVuY3Rpb24gcm9vdFNlbGVjdG9ycygpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5tYXAoKGZuKSA9PiBmbigpKTtcbn1cbmZ1bmN0aW9uIGFsbFNlbGVjdG9ycygpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5jb25jYXQoaW5pdFNlbGVjdG9yQ2FsbGJhY2tzKS5tYXAoKGZuKSA9PiBmbigpKTtcbn1cbmZ1bmN0aW9uIGFkZFJvb3RTZWxlY3RvcihzZWxlY3RvckNhbGxiYWNrKSB7XG4gIHJvb3RTZWxlY3RvckNhbGxiYWNrcy5wdXNoKHNlbGVjdG9yQ2FsbGJhY2spO1xufVxuZnVuY3Rpb24gYWRkSW5pdFNlbGVjdG9yKHNlbGVjdG9yQ2FsbGJhY2spIHtcbiAgaW5pdFNlbGVjdG9yQ2FsbGJhY2tzLnB1c2goc2VsZWN0b3JDYWxsYmFjayk7XG59XG5mdW5jdGlvbiBjbG9zZXN0Um9vdChlbCwgaW5jbHVkZUluaXRTZWxlY3RvcnMgPSBmYWxzZSkge1xuICByZXR1cm4gZmluZENsb3Nlc3QoZWwsIChlbGVtZW50KSA9PiB7XG4gICAgY29uc3Qgc2VsZWN0b3JzID0gaW5jbHVkZUluaXRTZWxlY3RvcnMgPyBhbGxTZWxlY3RvcnMoKSA6IHJvb3RTZWxlY3RvcnMoKTtcbiAgICBpZiAoc2VsZWN0b3JzLnNvbWUoKHNlbGVjdG9yKSA9PiBlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRDbG9zZXN0KGVsLCBjYWxsYmFjaykge1xuICBpZiAoIWVsKVxuICAgIHJldHVybjtcbiAgaWYgKGNhbGxiYWNrKGVsKSlcbiAgICByZXR1cm4gZWw7XG4gIGlmIChlbC5feF90ZWxlcG9ydEJhY2spXG4gICAgZWwgPSBlbC5feF90ZWxlcG9ydEJhY2s7XG4gIGlmICghZWwucGFyZW50RWxlbWVudClcbiAgICByZXR1cm47XG4gIHJldHVybiBmaW5kQ2xvc2VzdChlbC5wYXJlbnRFbGVtZW50LCBjYWxsYmFjayk7XG59XG5mdW5jdGlvbiBpc1Jvb3QoZWwpIHtcbiAgcmV0dXJuIHJvb3RTZWxlY3RvcnMoKS5zb21lKChzZWxlY3RvcikgPT4gZWwubWF0Y2hlcyhzZWxlY3RvcikpO1xufVxuZnVuY3Rpb24gaW5pdFRyZWUoZWwsIHdhbGtlciA9IHdhbGspIHtcbiAgZGVmZXJIYW5kbGluZ0RpcmVjdGl2ZXMoKCkgPT4ge1xuICAgIHdhbGtlcihlbCwgKGVsMiwgc2tpcCkgPT4ge1xuICAgICAgZGlyZWN0aXZlcyhlbDIsIGVsMi5hdHRyaWJ1dGVzKS5mb3JFYWNoKChoYW5kbGUpID0+IGhhbmRsZSgpKTtcbiAgICAgIGVsMi5feF9pZ25vcmUgJiYgc2tpcCgpO1xuICAgIH0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGRlc3Ryb3lUcmVlKHJvb3QpIHtcbiAgd2Fsayhyb290LCAoZWwpID0+IGNsZWFudXBBdHRyaWJ1dGVzKGVsKSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy91dGlscy9jbGFzc2VzLmpzXG5mdW5jdGlvbiBzZXRDbGFzc2VzKGVsLCB2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIHZhbHVlLmpvaW4oXCIgXCIpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21PYmplY3QoZWwsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBzZXRDbGFzc2VzKGVsLCB2YWx1ZSgpKTtcbiAgfVxuICByZXR1cm4gc2V0Q2xhc3Nlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHNldENsYXNzZXNGcm9tU3RyaW5nKGVsLCBjbGFzc1N0cmluZykge1xuICBsZXQgc3BsaXQgPSAoY2xhc3NTdHJpbmcyKSA9PiBjbGFzc1N0cmluZzIuc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IG1pc3NpbmdDbGFzc2VzID0gKGNsYXNzU3RyaW5nMikgPT4gY2xhc3NTdHJpbmcyLnNwbGl0KFwiIFwiKS5maWx0ZXIoKGkpID0+ICFlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IGFkZENsYXNzZXNBbmRSZXR1cm5VbmRvID0gKGNsYXNzZXMpID0+IHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXMpO1xuICAgIH07XG4gIH07XG4gIGNsYXNzU3RyaW5nID0gY2xhc3NTdHJpbmcgPT09IHRydWUgPyBjbGFzc1N0cmluZyA9IFwiXCIgOiBjbGFzc1N0cmluZyB8fCBcIlwiO1xuICByZXR1cm4gYWRkQ2xhc3Nlc0FuZFJldHVyblVuZG8obWlzc2luZ0NsYXNzZXMoY2xhc3NTdHJpbmcpKTtcbn1cbmZ1bmN0aW9uIHNldENsYXNzZXNGcm9tT2JqZWN0KGVsLCBjbGFzc09iamVjdCkge1xuICBsZXQgc3BsaXQgPSAoY2xhc3NTdHJpbmcpID0+IGNsYXNzU3RyaW5nLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBmb3JBZGQgPSBPYmplY3QuZW50cmllcyhjbGFzc09iamVjdCkuZmxhdE1hcCgoW2NsYXNzU3RyaW5nLCBib29sXSkgPT4gYm9vbCA/IHNwbGl0KGNsYXNzU3RyaW5nKSA6IGZhbHNlKS5maWx0ZXIoQm9vbGVhbik7XG4gIGxldCBmb3JSZW1vdmUgPSBPYmplY3QuZW50cmllcyhjbGFzc09iamVjdCkuZmxhdE1hcCgoW2NsYXNzU3RyaW5nLCBib29sXSkgPT4gIWJvb2wgPyBzcGxpdChjbGFzc1N0cmluZykgOiBmYWxzZSkuZmlsdGVyKEJvb2xlYW4pO1xuICBsZXQgYWRkZWQgPSBbXTtcbiAgbGV0IHJlbW92ZWQgPSBbXTtcbiAgZm9yUmVtb3ZlLmZvckVhY2goKGkpID0+IHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGkpKSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGkpO1xuICAgICAgcmVtb3ZlZC5wdXNoKGkpO1xuICAgIH1cbiAgfSk7XG4gIGZvckFkZC5mb3JFYWNoKChpKSA9PiB7XG4gICAgaWYgKCFlbC5jbGFzc0xpc3QuY29udGFpbnMoaSkpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoaSk7XG4gICAgICBhZGRlZC5wdXNoKGkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgcmVtb3ZlZC5mb3JFYWNoKChpKSA9PiBlbC5jbGFzc0xpc3QuYWRkKGkpKTtcbiAgICBhZGRlZC5mb3JFYWNoKChpKSA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKGkpKTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3N0eWxlcy5qc1xuZnVuY3Rpb24gc2V0U3R5bGVzKGVsLCB2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIHNldFN0eWxlc0Zyb21PYmplY3QoZWwsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gc2V0U3R5bGVzRnJvbVN0cmluZyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gc2V0U3R5bGVzRnJvbU9iamVjdChlbCwgdmFsdWUpIHtcbiAgbGV0IHByZXZpb3VzU3R5bGVzID0ge307XG4gIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChba2V5LCB2YWx1ZTJdKSA9PiB7XG4gICAgcHJldmlvdXNTdHlsZXNba2V5XSA9IGVsLnN0eWxlW2tleV07XG4gICAgaWYgKCFrZXkuc3RhcnRzV2l0aChcIi0tXCIpKSB7XG4gICAgICBrZXkgPSBrZWJhYkNhc2Uoa2V5KTtcbiAgICB9XG4gICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoa2V5LCB2YWx1ZTIpO1xuICB9KTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgaWYgKGVsLnN0eWxlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBzZXRTdHlsZXMoZWwsIHByZXZpb3VzU3R5bGVzKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIHNldFN0eWxlc0Zyb21TdHJpbmcoZWwsIHZhbHVlKSB7XG4gIGxldCBjYWNoZSA9IGVsLmdldEF0dHJpYnV0ZShcInN0eWxlXCIsIHZhbHVlKTtcbiAgZWwuc2V0QXR0cmlidXRlKFwic3R5bGVcIiwgdmFsdWUpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGNhY2hlIHx8IFwiXCIpO1xuICB9O1xufVxuZnVuY3Rpb24ga2ViYWJDYXNlKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvb25jZS5qc1xuZnVuY3Rpb24gb25jZShjYWxsYmFjaywgZmFsbGJhY2sgPSAoKSA9PiB7XG59KSB7XG4gIGxldCBjYWxsZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGlmICghY2FsbGVkKSB7XG4gICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmFsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdHJhbnNpdGlvbi5qc1xuZGlyZWN0aXZlKFwidHJhbnNpdGlvblwiLCAoZWwsIHt2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9ufSwge2V2YWx1YXRlOiBldmFsdWF0ZTJ9KSA9PiB7XG4gIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJmdW5jdGlvblwiKVxuICAgIGV4cHJlc3Npb24gPSBldmFsdWF0ZTIoZXhwcmVzc2lvbik7XG4gIGlmICghZXhwcmVzc2lvbikge1xuICAgIHJlZ2lzdGVyVHJhbnNpdGlvbnNGcm9tSGVscGVyKGVsLCBtb2RpZmllcnMsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICByZWdpc3RlclRyYW5zaXRpb25zRnJvbUNsYXNzU3RyaW5nKGVsLCBleHByZXNzaW9uLCB2YWx1ZSk7XG4gIH1cbn0pO1xuZnVuY3Rpb24gcmVnaXN0ZXJUcmFuc2l0aW9uc0Zyb21DbGFzc1N0cmluZyhlbCwgY2xhc3NTdHJpbmcsIHN0YWdlKSB7XG4gIHJlZ2lzdGVyVHJhbnNpdGlvbk9iamVjdChlbCwgc2V0Q2xhc3NlcywgXCJcIik7XG4gIGxldCBkaXJlY3RpdmVTdG9yYWdlTWFwID0ge1xuICAgIGVudGVyOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgXCJlbnRlci1zdGFydFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5zdGFydCA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImVudGVyLWVuZFwiOiAoY2xhc3NlcykgPT4ge1xuICAgICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5lbmQgPSBjbGFzc2VzO1xuICAgIH0sXG4gICAgbGVhdmU6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZyA9IGNsYXNzZXM7XG4gICAgfSxcbiAgICBcImxlYXZlLXN0YXJ0XCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLnN0YXJ0ID0gY2xhc3NlcztcbiAgICB9LFxuICAgIFwibGVhdmUtZW5kXCI6IChjbGFzc2VzKSA9PiB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmVuZCA9IGNsYXNzZXM7XG4gICAgfVxuICB9O1xuICBkaXJlY3RpdmVTdG9yYWdlTWFwW3N0YWdlXShjbGFzc1N0cmluZyk7XG59XG5mdW5jdGlvbiByZWdpc3RlclRyYW5zaXRpb25zRnJvbUhlbHBlcihlbCwgbW9kaWZpZXJzLCBzdGFnZSkge1xuICByZWdpc3RlclRyYW5zaXRpb25PYmplY3QoZWwsIHNldFN0eWxlcyk7XG4gIGxldCBkb2VzbnRTcGVjaWZ5ID0gIW1vZGlmaWVycy5pbmNsdWRlcyhcImluXCIpICYmICFtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgJiYgIXN0YWdlO1xuICBsZXQgdHJhbnNpdGlvbmluZ0luID0gZG9lc250U3BlY2lmeSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJpblwiKSB8fCBbXCJlbnRlclwiXS5pbmNsdWRlcyhzdGFnZSk7XG4gIGxldCB0cmFuc2l0aW9uaW5nT3V0ID0gZG9lc250U3BlY2lmeSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvdXRcIikgfHwgW1wibGVhdmVcIl0uaW5jbHVkZXMoc3RhZ2UpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiaW5cIikgJiYgIWRvZXNudFNwZWNpZnkpIHtcbiAgICBtb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKChpLCBpbmRleCkgPT4gaW5kZXggPCBtb2RpZmllcnMuaW5kZXhPZihcIm91dFwiKSk7XG4gIH1cbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dFwiKSAmJiAhZG9lc250U3BlY2lmeSkge1xuICAgIG1vZGlmaWVycyA9IG1vZGlmaWVycy5maWx0ZXIoKGksIGluZGV4KSA9PiBpbmRleCA+IG1vZGlmaWVycy5pbmRleE9mKFwib3V0XCIpKTtcbiAgfVxuICBsZXQgd2FudHNBbGwgPSAhbW9kaWZpZXJzLmluY2x1ZGVzKFwib3BhY2l0eVwiKSAmJiAhbW9kaWZpZXJzLmluY2x1ZGVzKFwic2NhbGVcIik7XG4gIGxldCB3YW50c09wYWNpdHkgPSB3YW50c0FsbCB8fCBtb2RpZmllcnMuaW5jbHVkZXMoXCJvcGFjaXR5XCIpO1xuICBsZXQgd2FudHNTY2FsZSA9IHdhbnRzQWxsIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcInNjYWxlXCIpO1xuICBsZXQgb3BhY2l0eVZhbHVlID0gd2FudHNPcGFjaXR5ID8gMCA6IDE7XG4gIGxldCBzY2FsZVZhbHVlID0gd2FudHNTY2FsZSA/IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcInNjYWxlXCIsIDk1KSAvIDEwMCA6IDE7XG4gIGxldCBkZWxheSA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImRlbGF5XCIsIDApO1xuICBsZXQgb3JpZ2luID0gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIFwib3JpZ2luXCIsIFwiY2VudGVyXCIpO1xuICBsZXQgcHJvcGVydHkgPSBcIm9wYWNpdHksIHRyYW5zZm9ybVwiO1xuICBsZXQgZHVyYXRpb25JbiA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImR1cmF0aW9uXCIsIDE1MCkgLyAxZTM7XG4gIGxldCBkdXJhdGlvbk91dCA9IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCBcImR1cmF0aW9uXCIsIDc1KSAvIDFlMztcbiAgbGV0IGVhc2luZyA9IGBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSlgO1xuICBpZiAodHJhbnNpdGlvbmluZ0luKSB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5lbnRlci5kdXJpbmcgPSB7XG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IG9yaWdpbixcbiAgICAgIHRyYW5zaXRpb25EZWxheTogZGVsYXksXG4gICAgICB0cmFuc2l0aW9uUHJvcGVydHk6IHByb3BlcnR5LFxuICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uOiBgJHtkdXJhdGlvbklufXNgLFxuICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiBlYXNpbmdcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQgPSB7XG4gICAgICBvcGFjaXR5OiBvcGFjaXR5VmFsdWUsXG4gICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlVmFsdWV9KWBcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24uZW50ZXIuZW5kID0ge1xuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKDEpYFxuICAgIH07XG4gIH1cbiAgaWYgKHRyYW5zaXRpb25pbmdPdXQpIHtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmR1cmluZyA9IHtcbiAgICAgIHRyYW5zZm9ybU9yaWdpbjogb3JpZ2luLFxuICAgICAgdHJhbnNpdGlvbkRlbGF5OiBkZWxheSxcbiAgICAgIHRyYW5zaXRpb25Qcm9wZXJ0eTogcHJvcGVydHksXG4gICAgICB0cmFuc2l0aW9uRHVyYXRpb246IGAke2R1cmF0aW9uT3V0fXNgLFxuICAgICAgdHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uOiBlYXNpbmdcbiAgICB9O1xuICAgIGVsLl94X3RyYW5zaXRpb24ubGVhdmUuc3RhcnQgPSB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoMSlgXG4gICAgfTtcbiAgICBlbC5feF90cmFuc2l0aW9uLmxlYXZlLmVuZCA9IHtcbiAgICAgIG9wYWNpdHk6IG9wYWNpdHlWYWx1ZSxcbiAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGVWYWx1ZX0pYFxuICAgIH07XG4gIH1cbn1cbmZ1bmN0aW9uIHJlZ2lzdGVyVHJhbnNpdGlvbk9iamVjdChlbCwgc2V0RnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSA9IHt9KSB7XG4gIGlmICghZWwuX3hfdHJhbnNpdGlvbilcbiAgICBlbC5feF90cmFuc2l0aW9uID0ge1xuICAgICAgZW50ZXI6IHtkdXJpbmc6IGRlZmF1bHRWYWx1ZSwgc3RhcnQ6IGRlZmF1bHRWYWx1ZSwgZW5kOiBkZWZhdWx0VmFsdWV9LFxuICAgICAgbGVhdmU6IHtkdXJpbmc6IGRlZmF1bHRWYWx1ZSwgc3RhcnQ6IGRlZmF1bHRWYWx1ZSwgZW5kOiBkZWZhdWx0VmFsdWV9LFxuICAgICAgaW4oYmVmb3JlID0gKCkgPT4ge1xuICAgICAgfSwgYWZ0ZXIgPSAoKSA9PiB7XG4gICAgICB9KSB7XG4gICAgICAgIHRyYW5zaXRpb24oZWwsIHNldEZ1bmN0aW9uLCB7XG4gICAgICAgICAgZHVyaW5nOiB0aGlzLmVudGVyLmR1cmluZyxcbiAgICAgICAgICBzdGFydDogdGhpcy5lbnRlci5zdGFydCxcbiAgICAgICAgICBlbmQ6IHRoaXMuZW50ZXIuZW5kXG4gICAgICAgIH0sIGJlZm9yZSwgYWZ0ZXIpO1xuICAgICAgfSxcbiAgICAgIG91dChiZWZvcmUgPSAoKSA9PiB7XG4gICAgICB9LCBhZnRlciA9ICgpID0+IHtcbiAgICAgIH0pIHtcbiAgICAgICAgdHJhbnNpdGlvbihlbCwgc2V0RnVuY3Rpb24sIHtcbiAgICAgICAgICBkdXJpbmc6IHRoaXMubGVhdmUuZHVyaW5nLFxuICAgICAgICAgIHN0YXJ0OiB0aGlzLmxlYXZlLnN0YXJ0LFxuICAgICAgICAgIGVuZDogdGhpcy5sZWF2ZS5lbmRcbiAgICAgICAgfSwgYmVmb3JlLCBhZnRlcik7XG4gICAgICB9XG4gICAgfTtcbn1cbndpbmRvdy5FbGVtZW50LnByb3RvdHlwZS5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zID0gZnVuY3Rpb24oZWwsIHZhbHVlLCBzaG93LCBoaWRlKSB7XG4gIGNvbnN0IG5leHRUaWNrMiA9IGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZSA9PT0gXCJ2aXNpYmxlXCIgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgOiBzZXRUaW1lb3V0O1xuICBsZXQgY2xpY2tBd2F5Q29tcGF0aWJsZVNob3cgPSAoKSA9PiBuZXh0VGljazIoc2hvdyk7XG4gIGlmICh2YWx1ZSkge1xuICAgIGlmIChlbC5feF90cmFuc2l0aW9uICYmIChlbC5feF90cmFuc2l0aW9uLmVudGVyIHx8IGVsLl94X3RyYW5zaXRpb24ubGVhdmUpKSB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uLmVudGVyICYmIChPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLmR1cmluZykubGVuZ3RoIHx8IE9iamVjdC5lbnRyaWVzKGVsLl94X3RyYW5zaXRpb24uZW50ZXIuc3RhcnQpLmxlbmd0aCB8fCBPYmplY3QuZW50cmllcyhlbC5feF90cmFuc2l0aW9uLmVudGVyLmVuZCkubGVuZ3RoKSA/IGVsLl94X3RyYW5zaXRpb24uaW4oc2hvdykgOiBjbGlja0F3YXlDb21wYXRpYmxlU2hvdygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5feF90cmFuc2l0aW9uID8gZWwuX3hfdHJhbnNpdGlvbi5pbihzaG93KSA6IGNsaWNrQXdheUNvbXBhdGlibGVTaG93KCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBlbC5feF9oaWRlUHJvbWlzZSA9IGVsLl94X3RyYW5zaXRpb24gPyBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgZWwuX3hfdHJhbnNpdGlvbi5vdXQoKCkgPT4ge1xuICAgIH0sICgpID0+IHJlc29sdmUoaGlkZSkpO1xuICAgIGVsLl94X3RyYW5zaXRpb25pbmcuYmVmb3JlQ2FuY2VsKCgpID0+IHJlamVjdCh7aXNGcm9tQ2FuY2VsbGVkVHJhbnNpdGlvbjogdHJ1ZX0pKTtcbiAgfSkgOiBQcm9taXNlLnJlc29sdmUoaGlkZSk7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBsZXQgY2xvc2VzdCA9IGNsb3Nlc3RIaWRlKGVsKTtcbiAgICBpZiAoY2xvc2VzdCkge1xuICAgICAgaWYgKCFjbG9zZXN0Ll94X2hpZGVDaGlsZHJlbilcbiAgICAgICAgY2xvc2VzdC5feF9oaWRlQ2hpbGRyZW4gPSBbXTtcbiAgICAgIGNsb3Nlc3QuX3hfaGlkZUNoaWxkcmVuLnB1c2goZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0VGljazIoKCkgPT4ge1xuICAgICAgICBsZXQgaGlkZUFmdGVyQ2hpbGRyZW4gPSAoZWwyKSA9PiB7XG4gICAgICAgICAgbGV0IGNhcnJ5ID0gUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgZWwyLl94X2hpZGVQcm9taXNlLFxuICAgICAgICAgICAgLi4uKGVsMi5feF9oaWRlQ2hpbGRyZW4gfHwgW10pLm1hcChoaWRlQWZ0ZXJDaGlsZHJlbilcbiAgICAgICAgICBdKS50aGVuKChbaV0pID0+IGkoKSk7XG4gICAgICAgICAgZGVsZXRlIGVsMi5feF9oaWRlUHJvbWlzZTtcbiAgICAgICAgICBkZWxldGUgZWwyLl94X2hpZGVDaGlsZHJlbjtcbiAgICAgICAgICByZXR1cm4gY2Fycnk7XG4gICAgICAgIH07XG4gICAgICAgIGhpZGVBZnRlckNoaWxkcmVuKGVsKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgIGlmICghZS5pc0Zyb21DYW5jZWxsZWRUcmFuc2l0aW9uKVxuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcbmZ1bmN0aW9uIGNsb3Nlc3RIaWRlKGVsKSB7XG4gIGxldCBwYXJlbnQgPSBlbC5wYXJlbnROb2RlO1xuICBpZiAoIXBhcmVudClcbiAgICByZXR1cm47XG4gIHJldHVybiBwYXJlbnQuX3hfaGlkZVByb21pc2UgPyBwYXJlbnQgOiBjbG9zZXN0SGlkZShwYXJlbnQpO1xufVxuZnVuY3Rpb24gdHJhbnNpdGlvbihlbCwgc2V0RnVuY3Rpb24sIHtkdXJpbmcsIHN0YXJ0OiBzdGFydDIsIGVuZH0gPSB7fSwgYmVmb3JlID0gKCkgPT4ge1xufSwgYWZ0ZXIgPSAoKSA9PiB7XG59KSB7XG4gIGlmIChlbC5feF90cmFuc2l0aW9uaW5nKVxuICAgIGVsLl94X3RyYW5zaXRpb25pbmcuY2FuY2VsKCk7XG4gIGlmIChPYmplY3Qua2V5cyhkdXJpbmcpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3Qua2V5cyhzdGFydDIpLmxlbmd0aCA9PT0gMCAmJiBPYmplY3Qua2V5cyhlbmQpLmxlbmd0aCA9PT0gMCkge1xuICAgIGJlZm9yZSgpO1xuICAgIGFmdGVyKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCB1bmRvU3RhcnQsIHVuZG9EdXJpbmcsIHVuZG9FbmQ7XG4gIHBlcmZvcm1UcmFuc2l0aW9uKGVsLCB7XG4gICAgc3RhcnQoKSB7XG4gICAgICB1bmRvU3RhcnQgPSBzZXRGdW5jdGlvbihlbCwgc3RhcnQyKTtcbiAgICB9LFxuICAgIGR1cmluZygpIHtcbiAgICAgIHVuZG9EdXJpbmcgPSBzZXRGdW5jdGlvbihlbCwgZHVyaW5nKTtcbiAgICB9LFxuICAgIGJlZm9yZSxcbiAgICBlbmQoKSB7XG4gICAgICB1bmRvU3RhcnQoKTtcbiAgICAgIHVuZG9FbmQgPSBzZXRGdW5jdGlvbihlbCwgZW5kKTtcbiAgICB9LFxuICAgIGFmdGVyLFxuICAgIGNsZWFudXAoKSB7XG4gICAgICB1bmRvRHVyaW5nKCk7XG4gICAgICB1bmRvRW5kKCk7XG4gICAgfVxuICB9KTtcbn1cbmZ1bmN0aW9uIHBlcmZvcm1UcmFuc2l0aW9uKGVsLCBzdGFnZXMpIHtcbiAgbGV0IGludGVycnVwdGVkLCByZWFjaGVkQmVmb3JlLCByZWFjaGVkRW5kO1xuICBsZXQgZmluaXNoID0gb25jZSgoKSA9PiB7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGludGVycnVwdGVkID0gdHJ1ZTtcbiAgICAgIGlmICghcmVhY2hlZEJlZm9yZSlcbiAgICAgICAgc3RhZ2VzLmJlZm9yZSgpO1xuICAgICAgaWYgKCFyZWFjaGVkRW5kKSB7XG4gICAgICAgIHN0YWdlcy5lbmQoKTtcbiAgICAgICAgcmVsZWFzZU5leHRUaWNrcygpO1xuICAgICAgfVxuICAgICAgc3RhZ2VzLmFmdGVyKCk7XG4gICAgICBpZiAoZWwuaXNDb25uZWN0ZWQpXG4gICAgICAgIHN0YWdlcy5jbGVhbnVwKCk7XG4gICAgICBkZWxldGUgZWwuX3hfdHJhbnNpdGlvbmluZztcbiAgICB9KTtcbiAgfSk7XG4gIGVsLl94X3RyYW5zaXRpb25pbmcgPSB7XG4gICAgYmVmb3JlQ2FuY2VsczogW10sXG4gICAgYmVmb3JlQ2FuY2VsKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLmJlZm9yZUNhbmNlbHMucHVzaChjYWxsYmFjayk7XG4gICAgfSxcbiAgICBjYW5jZWw6IG9uY2UoZnVuY3Rpb24oKSB7XG4gICAgICB3aGlsZSAodGhpcy5iZWZvcmVDYW5jZWxzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmJlZm9yZUNhbmNlbHMuc2hpZnQoKSgpO1xuICAgICAgfVxuICAgICAgO1xuICAgICAgZmluaXNoKCk7XG4gICAgfSksXG4gICAgZmluaXNoXG4gIH07XG4gIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgc3RhZ2VzLnN0YXJ0KCk7XG4gICAgc3RhZ2VzLmR1cmluZygpO1xuICB9KTtcbiAgaG9sZE5leHRUaWNrcygpO1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGlmIChpbnRlcnJ1cHRlZClcbiAgICAgIHJldHVybjtcbiAgICBsZXQgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoLywuKi8sIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBsZXQgZGVsYXkgPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkRlbGF5LnJlcGxhY2UoLywuKi8sIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpKSAqIDFlMztcbiAgICBpZiAoZHVyYXRpb24gPT09IDApXG4gICAgICBkdXJhdGlvbiA9IE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsKS5hbmltYXRpb25EdXJhdGlvbi5yZXBsYWNlKFwic1wiLCBcIlwiKSkgKiAxZTM7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIHN0YWdlcy5iZWZvcmUoKTtcbiAgICB9KTtcbiAgICByZWFjaGVkQmVmb3JlID0gdHJ1ZTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKGludGVycnVwdGVkKVxuICAgICAgICByZXR1cm47XG4gICAgICBtdXRhdGVEb20oKCkgPT4ge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICB9KTtcbiAgICAgIHJlbGVhc2VOZXh0VGlja3MoKTtcbiAgICAgIHNldFRpbWVvdXQoZWwuX3hfdHJhbnNpdGlvbmluZy5maW5pc2gsIGR1cmF0aW9uICsgZGVsYXkpO1xuICAgICAgcmVhY2hlZEVuZCA9IHRydWU7XG4gICAgfSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIGtleSwgZmFsbGJhY2spIHtcbiAgaWYgKG1vZGlmaWVycy5pbmRleE9mKGtleSkgPT09IC0xKVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgY29uc3QgcmF3VmFsdWUgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDFdO1xuICBpZiAoIXJhd1ZhbHVlKVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgaWYgKGtleSA9PT0gXCJzY2FsZVwiKSB7XG4gICAgaWYgKGlzTmFOKHJhd1ZhbHVlKSlcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuICBpZiAoa2V5ID09PSBcImR1cmF0aW9uXCIpIHtcbiAgICBsZXQgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaCgvKFswLTldKyltcy8pO1xuICAgIGlmIChtYXRjaClcbiAgICAgIHJldHVybiBtYXRjaFsxXTtcbiAgfVxuICBpZiAoa2V5ID09PSBcIm9yaWdpblwiKSB7XG4gICAgaWYgKFtcInRvcFwiLCBcInJpZ2h0XCIsIFwibGVmdFwiLCBcImNlbnRlclwiLCBcImJvdHRvbVwiXS5pbmNsdWRlcyhtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2Yoa2V5KSArIDJdKSkge1xuICAgICAgcmV0dXJuIFtyYXdWYWx1ZSwgbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAyXV0uam9pbihcIiBcIik7XG4gICAgfVxuICB9XG4gIHJldHVybiByYXdWYWx1ZTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2Nsb25lLmpzXG52YXIgaXNDbG9uaW5nID0gZmFsc2U7XG5mdW5jdGlvbiBza2lwRHVyaW5nQ2xvbmUoY2FsbGJhY2ssIGZhbGxiYWNrID0gKCkgPT4ge1xufSkge1xuICByZXR1cm4gKC4uLmFyZ3MpID0+IGlzQ2xvbmluZyA/IGZhbGxiYWNrKC4uLmFyZ3MpIDogY2FsbGJhY2soLi4uYXJncyk7XG59XG5mdW5jdGlvbiBjbG9uZShvbGRFbCwgbmV3RWwpIHtcbiAgaWYgKCFuZXdFbC5feF9kYXRhU3RhY2spXG4gICAgbmV3RWwuX3hfZGF0YVN0YWNrID0gb2xkRWwuX3hfZGF0YVN0YWNrO1xuICBpc0Nsb25pbmcgPSB0cnVlO1xuICBkb250UmVnaXN0ZXJSZWFjdGl2ZVNpZGVFZmZlY3RzKCgpID0+IHtcbiAgICBjbG9uZVRyZWUobmV3RWwpO1xuICB9KTtcbiAgaXNDbG9uaW5nID0gZmFsc2U7XG59XG5mdW5jdGlvbiBjbG9uZVRyZWUoZWwpIHtcbiAgbGV0IGhhc1J1blRocm91Z2hGaXJzdEVsID0gZmFsc2U7XG4gIGxldCBzaGFsbG93V2Fsa2VyID0gKGVsMiwgY2FsbGJhY2spID0+IHtcbiAgICB3YWxrKGVsMiwgKGVsMywgc2tpcCkgPT4ge1xuICAgICAgaWYgKGhhc1J1blRocm91Z2hGaXJzdEVsICYmIGlzUm9vdChlbDMpKVxuICAgICAgICByZXR1cm4gc2tpcCgpO1xuICAgICAgaGFzUnVuVGhyb3VnaEZpcnN0RWwgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soZWwzLCBza2lwKTtcbiAgICB9KTtcbiAgfTtcbiAgaW5pdFRyZWUoZWwsIHNoYWxsb3dXYWxrZXIpO1xufVxuZnVuY3Rpb24gZG9udFJlZ2lzdGVyUmVhY3RpdmVTaWRlRWZmZWN0cyhjYWxsYmFjaykge1xuICBsZXQgY2FjaGUgPSBlZmZlY3Q7XG4gIG92ZXJyaWRlRWZmZWN0KChjYWxsYmFjazIsIGVsKSA9PiB7XG4gICAgbGV0IHN0b3JlZEVmZmVjdCA9IGNhY2hlKGNhbGxiYWNrMik7XG4gICAgcmVsZWFzZShzdG9yZWRFZmZlY3QpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgfTtcbiAgfSk7XG4gIGNhbGxiYWNrKCk7XG4gIG92ZXJyaWRlRWZmZWN0KGNhY2hlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2JpbmQuanNcbmZ1bmN0aW9uIGJpbmQoZWwsIG5hbWUsIHZhbHVlLCBtb2RpZmllcnMgPSBbXSkge1xuICBpZiAoIWVsLl94X2JpbmRpbmdzKVxuICAgIGVsLl94X2JpbmRpbmdzID0gcmVhY3RpdmUoe30pO1xuICBlbC5feF9iaW5kaW5nc1tuYW1lXSA9IHZhbHVlO1xuICBuYW1lID0gbW9kaWZpZXJzLmluY2x1ZGVzKFwiY2FtZWxcIikgPyBjYW1lbENhc2UobmFtZSkgOiBuYW1lO1xuICBzd2l0Y2ggKG5hbWUpIHtcbiAgICBjYXNlIFwidmFsdWVcIjpcbiAgICAgIGJpbmRJbnB1dFZhbHVlKGVsLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgIGJpbmRTdHlsZXMoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJjbGFzc1wiOlxuICAgICAgYmluZENsYXNzZXMoZWwsIHZhbHVlKTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBiaW5kQXR0cmlidXRlKGVsLCBuYW1lLCB2YWx1ZSk7XG4gICAgICBicmVhaztcbiAgfVxufVxuZnVuY3Rpb24gYmluZElucHV0VmFsdWUoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC50eXBlID09PSBcInJhZGlvXCIpIHtcbiAgICBpZiAoZWwuYXR0cmlidXRlcy52YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBlbC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBpZiAod2luZG93LmZyb21Nb2RlbCkge1xuICAgICAgZWwuY2hlY2tlZCA9IGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKGVsLnZhbHVlLCB2YWx1ZSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09IFwiY2hlY2tib3hcIikge1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdHlwZW9mIHZhbHVlICE9PSBcImJvb2xlYW5cIiAmJiAhW251bGwsIHZvaWQgMF0uaW5jbHVkZXModmFsdWUpKSB7XG4gICAgICBlbC52YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBlbC5jaGVja2VkID0gdmFsdWUuc29tZSgodmFsKSA9PiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZSh2YWwsIGVsLnZhbHVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5jaGVja2VkID0gISF2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoZWwudGFnTmFtZSA9PT0gXCJTRUxFQ1RcIikge1xuICAgIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIGlmIChlbC52YWx1ZSA9PT0gdmFsdWUpXG4gICAgICByZXR1cm47XG4gICAgZWwudmFsdWUgPSB2YWx1ZTtcbiAgfVxufVxuZnVuY3Rpb24gYmluZENsYXNzZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC5feF91bmRvQWRkZWRDbGFzc2VzKVxuICAgIGVsLl94X3VuZG9BZGRlZENsYXNzZXMoKTtcbiAgZWwuX3hfdW5kb0FkZGVkQ2xhc3NlcyA9IHNldENsYXNzZXMoZWwsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIGJpbmRTdHlsZXMoZWwsIHZhbHVlKSB7XG4gIGlmIChlbC5feF91bmRvQWRkZWRTdHlsZXMpXG4gICAgZWwuX3hfdW5kb0FkZGVkU3R5bGVzKCk7XG4gIGVsLl94X3VuZG9BZGRlZFN0eWxlcyA9IHNldFN0eWxlcyhlbCwgdmFsdWUpO1xufVxuZnVuY3Rpb24gYmluZEF0dHJpYnV0ZShlbCwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKFtudWxsLCB2b2lkIDAsIGZhbHNlXS5pbmNsdWRlcyh2YWx1ZSkgJiYgYXR0cmlidXRlU2hvdWxkbnRCZVByZXNlcnZlZElmRmFsc3kobmFtZSkpIHtcbiAgICBlbC5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzQm9vbGVhbkF0dHIobmFtZSkpXG4gICAgICB2YWx1ZSA9IG5hbWU7XG4gICAgc2V0SWZDaGFuZ2VkKGVsLCBuYW1lLCB2YWx1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHNldElmQ2hhbmdlZChlbCwgYXR0ck5hbWUsIHZhbHVlKSB7XG4gIGlmIChlbC5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpICE9IHZhbHVlKSB7XG4gICAgZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpIHtcbiAgY29uc3QgYXJyYXlXcmFwcGVkVmFsdWUgPSBbXS5jb25jYXQodmFsdWUpLm1hcCgodmFsdWUyKSA9PiB7XG4gICAgcmV0dXJuIHZhbHVlMiArIFwiXCI7XG4gIH0pO1xuICBBcnJheS5mcm9tKGVsLm9wdGlvbnMpLmZvckVhY2goKG9wdGlvbikgPT4ge1xuICAgIG9wdGlvbi5zZWxlY3RlZCA9IGFycmF5V3JhcHBlZFZhbHVlLmluY2x1ZGVzKG9wdGlvbi52YWx1ZSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKFxcdykvZywgKG1hdGNoLCBjaGFyKSA9PiBjaGFyLnRvVXBwZXJDYXNlKCkpO1xufVxuZnVuY3Rpb24gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBpc0Jvb2xlYW5BdHRyKGF0dHJOYW1lKSB7XG4gIGNvbnN0IGJvb2xlYW5BdHRyaWJ1dGVzID0gW1xuICAgIFwiZGlzYWJsZWRcIixcbiAgICBcImNoZWNrZWRcIixcbiAgICBcInJlcXVpcmVkXCIsXG4gICAgXCJyZWFkb25seVwiLFxuICAgIFwiaGlkZGVuXCIsXG4gICAgXCJvcGVuXCIsXG4gICAgXCJzZWxlY3RlZFwiLFxuICAgIFwiYXV0b2ZvY3VzXCIsXG4gICAgXCJpdGVtc2NvcGVcIixcbiAgICBcIm11bHRpcGxlXCIsXG4gICAgXCJub3ZhbGlkYXRlXCIsXG4gICAgXCJhbGxvd2Z1bGxzY3JlZW5cIixcbiAgICBcImFsbG93cGF5bWVudHJlcXVlc3RcIixcbiAgICBcImZvcm1ub3ZhbGlkYXRlXCIsXG4gICAgXCJhdXRvcGxheVwiLFxuICAgIFwiY29udHJvbHNcIixcbiAgICBcImxvb3BcIixcbiAgICBcIm11dGVkXCIsXG4gICAgXCJwbGF5c2lubGluZVwiLFxuICAgIFwiZGVmYXVsdFwiLFxuICAgIFwiaXNtYXBcIixcbiAgICBcInJldmVyc2VkXCIsXG4gICAgXCJhc3luY1wiLFxuICAgIFwiZGVmZXJcIixcbiAgICBcIm5vbW9kdWxlXCJcbiAgXTtcbiAgcmV0dXJuIGJvb2xlYW5BdHRyaWJ1dGVzLmluY2x1ZGVzKGF0dHJOYW1lKTtcbn1cbmZ1bmN0aW9uIGF0dHJpYnV0ZVNob3VsZG50QmVQcmVzZXJ2ZWRJZkZhbHN5KG5hbWUpIHtcbiAgcmV0dXJuICFbXCJhcmlhLXByZXNzZWRcIiwgXCJhcmlhLWNoZWNrZWRcIiwgXCJhcmlhLWV4cGFuZGVkXCIsIFwiYXJpYS1zZWxlY3RlZFwiXS5pbmNsdWRlcyhuYW1lKTtcbn1cbmZ1bmN0aW9uIGdldEJpbmRpbmcoZWwsIG5hbWUsIGZhbGxiYWNrKSB7XG4gIGlmIChlbC5feF9iaW5kaW5ncyAmJiBlbC5feF9iaW5kaW5nc1tuYW1lXSAhPT0gdm9pZCAwKVxuICAgIHJldHVybiBlbC5feF9iaW5kaW5nc1tuYW1lXTtcbiAgbGV0IGF0dHIgPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIGlmIChhdHRyID09PSBudWxsKVxuICAgIHJldHVybiB0eXBlb2YgZmFsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IGZhbGxiYWNrKCkgOiBmYWxsYmFjaztcbiAgaWYgKGF0dHIgPT09IFwiXCIpXG4gICAgcmV0dXJuIHRydWU7XG4gIGlmIChpc0Jvb2xlYW5BdHRyKG5hbWUpKSB7XG4gICAgcmV0dXJuICEhW25hbWUsIFwidHJ1ZVwiXS5pbmNsdWRlcyhhdHRyKTtcbiAgfVxuICByZXR1cm4gYXR0cjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL2RlYm91bmNlLmpzXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0KSB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLCBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgfTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL3V0aWxzL3Rocm90dGxlLmpzXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCBsaW1pdCkge1xuICBsZXQgaW5UaHJvdHRsZTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIGxldCBjb250ZXh0ID0gdGhpcywgYXJncyA9IGFyZ3VtZW50cztcbiAgICBpZiAoIWluVGhyb3R0bGUpIHtcbiAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpblRocm90dGxlID0gdHJ1ZTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gaW5UaHJvdHRsZSA9IGZhbHNlLCBsaW1pdCk7XG4gICAgfVxuICB9O1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvcGx1Z2luLmpzXG5mdW5jdGlvbiBwbHVnaW4oY2FsbGJhY2spIHtcbiAgY2FsbGJhY2soYWxwaW5lX2RlZmF1bHQpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvc3RvcmUuanNcbnZhciBzdG9yZXMgPSB7fTtcbnZhciBpc1JlYWN0aXZlID0gZmFsc2U7XG5mdW5jdGlvbiBzdG9yZShuYW1lLCB2YWx1ZSkge1xuICBpZiAoIWlzUmVhY3RpdmUpIHtcbiAgICBzdG9yZXMgPSByZWFjdGl2ZShzdG9yZXMpO1xuICAgIGlzUmVhY3RpdmUgPSB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIHN0b3Jlc1tuYW1lXTtcbiAgfVxuICBzdG9yZXNbbmFtZV0gPSB2YWx1ZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShcImluaXRcIikgJiYgdHlwZW9mIHZhbHVlLmluaXQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHN0b3Jlc1tuYW1lXS5pbml0KCk7XG4gIH1cbiAgaW5pdEludGVyY2VwdG9ycyhzdG9yZXNbbmFtZV0pO1xufVxuZnVuY3Rpb24gZ2V0U3RvcmVzKCkge1xuICByZXR1cm4gc3RvcmVzO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvYmluZHMuanNcbnZhciBiaW5kcyA9IHt9O1xuZnVuY3Rpb24gYmluZDIobmFtZSwgYmluZGluZ3MpIHtcbiAgbGV0IGdldEJpbmRpbmdzID0gdHlwZW9mIGJpbmRpbmdzICE9PSBcImZ1bmN0aW9uXCIgPyAoKSA9PiBiaW5kaW5ncyA6IGJpbmRpbmdzO1xuICBpZiAobmFtZSBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICBhcHBseUJpbmRpbmdzT2JqZWN0KG5hbWUsIGdldEJpbmRpbmdzKCkpO1xuICB9IGVsc2Uge1xuICAgIGJpbmRzW25hbWVdID0gZ2V0QmluZGluZ3M7XG4gIH1cbn1cbmZ1bmN0aW9uIGluamVjdEJpbmRpbmdQcm92aWRlcnMob2JqKSB7XG4gIE9iamVjdC5lbnRyaWVzKGJpbmRzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gYXBwbHlCaW5kaW5nc09iamVjdChlbCwgb2JqLCBvcmlnaW5hbCkge1xuICBsZXQgY2xlYW51cFJ1bm5lcnMgPSBbXTtcbiAgd2hpbGUgKGNsZWFudXBSdW5uZXJzLmxlbmd0aClcbiAgICBjbGVhbnVwUnVubmVycy5wb3AoKSgpO1xuICBsZXQgYXR0cmlidXRlcyA9IE9iamVjdC5lbnRyaWVzKG9iaikubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoe25hbWUsIHZhbHVlfSkpO1xuICBsZXQgc3RhdGljQXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNPbmx5KGF0dHJpYnV0ZXMpO1xuICBhdHRyaWJ1dGVzID0gYXR0cmlidXRlcy5tYXAoKGF0dHJpYnV0ZSkgPT4ge1xuICAgIGlmIChzdGF0aWNBdHRyaWJ1dGVzLmZpbmQoKGF0dHIpID0+IGF0dHIubmFtZSA9PT0gYXR0cmlidXRlLm5hbWUpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBgeC1iaW5kOiR7YXR0cmlidXRlLm5hbWV9YCxcbiAgICAgICAgdmFsdWU6IGBcIiR7YXR0cmlidXRlLnZhbHVlfVwiYFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJpYnV0ZTtcbiAgfSk7XG4gIGRpcmVjdGl2ZXMoZWwsIGF0dHJpYnV0ZXMsIG9yaWdpbmFsKS5tYXAoKGhhbmRsZSkgPT4ge1xuICAgIGNsZWFudXBSdW5uZXJzLnB1c2goaGFuZGxlLnJ1bkNsZWFudXBzKTtcbiAgICBoYW5kbGUoKTtcbiAgfSk7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kYXRhcy5qc1xudmFyIGRhdGFzID0ge307XG5mdW5jdGlvbiBkYXRhKG5hbWUsIGNhbGxiYWNrKSB7XG4gIGRhdGFzW25hbWVdID0gY2FsbGJhY2s7XG59XG5mdW5jdGlvbiBpbmplY3REYXRhUHJvdmlkZXJzKG9iaiwgY29udGV4dCkge1xuICBPYmplY3QuZW50cmllcyhkYXRhcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmJpbmQoY29udGV4dCkoLi4uYXJncyk7XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9hbHBpbmUuanNcbnZhciBBbHBpbmUgPSB7XG4gIGdldCByZWFjdGl2ZSgpIHtcbiAgICByZXR1cm4gcmVhY3RpdmU7XG4gIH0sXG4gIGdldCByZWxlYXNlKCkge1xuICAgIHJldHVybiByZWxlYXNlO1xuICB9LFxuICBnZXQgZWZmZWN0KCkge1xuICAgIHJldHVybiBlZmZlY3Q7XG4gIH0sXG4gIGdldCByYXcoKSB7XG4gICAgcmV0dXJuIHJhdztcbiAgfSxcbiAgdmVyc2lvbjogXCIzLjEwLjVcIixcbiAgZmx1c2hBbmRTdG9wRGVmZXJyaW5nTXV0YXRpb25zLFxuICBkb250QXV0b0V2YWx1YXRlRnVuY3Rpb25zLFxuICBkaXNhYmxlRWZmZWN0U2NoZWR1bGluZyxcbiAgc2V0UmVhY3Rpdml0eUVuZ2luZSxcbiAgY2xvc2VzdERhdGFTdGFjayxcbiAgc2tpcER1cmluZ0Nsb25lLFxuICBhZGRSb290U2VsZWN0b3IsXG4gIGFkZEluaXRTZWxlY3RvcixcbiAgYWRkU2NvcGVUb05vZGUsXG4gIGRlZmVyTXV0YXRpb25zLFxuICBtYXBBdHRyaWJ1dGVzLFxuICBldmFsdWF0ZUxhdGVyLFxuICBzZXRFdmFsdWF0b3IsXG4gIG1lcmdlUHJveGllcyxcbiAgZmluZENsb3Nlc3QsXG4gIGNsb3Nlc3RSb290LFxuICBpbnRlcmNlcHRvcixcbiAgdHJhbnNpdGlvbixcbiAgc2V0U3R5bGVzLFxuICBtdXRhdGVEb20sXG4gIGRpcmVjdGl2ZSxcbiAgdGhyb3R0bGUsXG4gIGRlYm91bmNlLFxuICBldmFsdWF0ZSxcbiAgaW5pdFRyZWUsXG4gIG5leHRUaWNrLFxuICBwcmVmaXhlZDogcHJlZml4LFxuICBwcmVmaXg6IHNldFByZWZpeCxcbiAgcGx1Z2luLFxuICBtYWdpYyxcbiAgc3RvcmUsXG4gIHN0YXJ0LFxuICBjbG9uZSxcbiAgYm91bmQ6IGdldEJpbmRpbmcsXG4gICRkYXRhOiBzY29wZSxcbiAgZGF0YSxcbiAgYmluZDogYmluZDJcbn07XG52YXIgYWxwaW5lX2RlZmF1bHQgPSBBbHBpbmU7XG5cbi8vIG5vZGVfbW9kdWxlcy9AdnVlL3NoYXJlZC9kaXN0L3NoYXJlZC5lc20tYnVuZGxlci5qc1xuZnVuY3Rpb24gbWFrZU1hcChzdHIsIGV4cGVjdHNMb3dlckNhc2UpIHtcbiAgY29uc3QgbWFwID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgY29uc3QgbGlzdCA9IHN0ci5zcGxpdChcIixcIik7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIG1hcFtsaXN0W2ldXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGV4cGVjdHNMb3dlckNhc2UgPyAodmFsKSA9PiAhIW1hcFt2YWwudG9Mb3dlckNhc2UoKV0gOiAodmFsKSA9PiAhIW1hcFt2YWxdO1xufVxudmFyIFBhdGNoRmxhZ05hbWVzID0ge1xuICBbMV06IGBURVhUYCxcbiAgWzJdOiBgQ0xBU1NgLFxuICBbNF06IGBTVFlMRWAsXG4gIFs4XTogYFBST1BTYCxcbiAgWzE2XTogYEZVTExfUFJPUFNgLFxuICBbMzJdOiBgSFlEUkFURV9FVkVOVFNgLFxuICBbNjRdOiBgU1RBQkxFX0ZSQUdNRU5UYCxcbiAgWzEyOF06IGBLRVlFRF9GUkFHTUVOVGAsXG4gIFsyNTZdOiBgVU5LRVlFRF9GUkFHTUVOVGAsXG4gIFs1MTJdOiBgTkVFRF9QQVRDSGAsXG4gIFsxMDI0XTogYERZTkFNSUNfU0xPVFNgLFxuICBbMjA0OF06IGBERVZfUk9PVF9GUkFHTUVOVGAsXG4gIFstMV06IGBIT0lTVEVEYCxcbiAgWy0yXTogYEJBSUxgXG59O1xudmFyIHNsb3RGbGFnc1RleHQgPSB7XG4gIFsxXTogXCJTVEFCTEVcIixcbiAgWzJdOiBcIkRZTkFNSUNcIixcbiAgWzNdOiBcIkZPUldBUkRFRFwiXG59O1xudmFyIHNwZWNpYWxCb29sZWFuQXR0cnMgPSBgaXRlbXNjb3BlLGFsbG93ZnVsbHNjcmVlbixmb3Jtbm92YWxpZGF0ZSxpc21hcCxub21vZHVsZSxub3ZhbGlkYXRlLHJlYWRvbmx5YDtcbnZhciBpc0Jvb2xlYW5BdHRyMiA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKHNwZWNpYWxCb29sZWFuQXR0cnMgKyBgLGFzeW5jLGF1dG9mb2N1cyxhdXRvcGxheSxjb250cm9scyxkZWZhdWx0LGRlZmVyLGRpc2FibGVkLGhpZGRlbixsb29wLG9wZW4scmVxdWlyZWQscmV2ZXJzZWQsc2NvcGVkLHNlYW1sZXNzLGNoZWNrZWQsbXV0ZWQsbXVsdGlwbGUsc2VsZWN0ZWRgKTtcbnZhciBFTVBUWV9PQkogPSB0cnVlID8gT2JqZWN0LmZyZWV6ZSh7fSkgOiB7fTtcbnZhciBFTVBUWV9BUlIgPSB0cnVlID8gT2JqZWN0LmZyZWV6ZShbXSkgOiBbXTtcbnZhciBleHRlbmQgPSBPYmplY3QuYXNzaWduO1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBoYXNPd24gPSAodmFsLCBrZXkpID0+IGhhc093blByb3BlcnR5LmNhbGwodmFsLCBrZXkpO1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xudmFyIGlzTWFwID0gKHZhbCkgPT4gdG9UeXBlU3RyaW5nKHZhbCkgPT09IFwiW29iamVjdCBNYXBdXCI7XG52YXIgaXNTdHJpbmcgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcInN0cmluZ1wiO1xudmFyIGlzU3ltYm9sID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJzeW1ib2xcIjtcbnZhciBpc09iamVjdCA9ICh2YWwpID0+IHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiO1xudmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciB0b1R5cGVTdHJpbmcgPSAodmFsdWUpID0+IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xudmFyIHRvUmF3VHlwZSA9ICh2YWx1ZSkgPT4ge1xuICByZXR1cm4gdG9UeXBlU3RyaW5nKHZhbHVlKS5zbGljZSg4LCAtMSk7XG59O1xudmFyIGlzSW50ZWdlcktleSA9IChrZXkpID0+IGlzU3RyaW5nKGtleSkgJiYga2V5ICE9PSBcIk5hTlwiICYmIGtleVswXSAhPT0gXCItXCIgJiYgXCJcIiArIHBhcnNlSW50KGtleSwgMTApID09PSBrZXk7XG52YXIgY2FjaGVTdHJpbmdGdW5jdGlvbiA9IChmbikgPT4ge1xuICBjb25zdCBjYWNoZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHJldHVybiAoc3RyKSA9PiB7XG4gICAgY29uc3QgaGl0ID0gY2FjaGVbc3RyXTtcbiAgICByZXR1cm4gaGl0IHx8IChjYWNoZVtzdHJdID0gZm4oc3RyKSk7XG4gIH07XG59O1xudmFyIGNhbWVsaXplUkUgPSAvLShcXHcpL2c7XG52YXIgY2FtZWxpemUgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGNhbWVsaXplUkUsIChfLCBjKSA9PiBjID8gYy50b1VwcGVyQ2FzZSgpIDogXCJcIik7XG59KTtcbnZhciBoeXBoZW5hdGVSRSA9IC9cXEIoW0EtWl0pL2c7XG52YXIgaHlwaGVuYXRlID0gY2FjaGVTdHJpbmdGdW5jdGlvbigoc3RyKSA9PiBzdHIucmVwbGFjZShoeXBoZW5hdGVSRSwgXCItJDFcIikudG9Mb3dlckNhc2UoKSk7XG52YXIgY2FwaXRhbGl6ZSA9IGNhY2hlU3RyaW5nRnVuY3Rpb24oKHN0cikgPT4gc3RyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKDEpKTtcbnZhciB0b0hhbmRsZXJLZXkgPSBjYWNoZVN0cmluZ0Z1bmN0aW9uKChzdHIpID0+IHN0ciA/IGBvbiR7Y2FwaXRhbGl6ZShzdHIpfWAgOiBgYCk7XG52YXIgaGFzQ2hhbmdlZCA9ICh2YWx1ZSwgb2xkVmFsdWUpID0+IHZhbHVlICE9PSBvbGRWYWx1ZSAmJiAodmFsdWUgPT09IHZhbHVlIHx8IG9sZFZhbHVlID09PSBvbGRWYWx1ZSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9AdnVlL3JlYWN0aXZpdHkvZGlzdC9yZWFjdGl2aXR5LmVzbS1idW5kbGVyLmpzXG52YXIgdGFyZ2V0TWFwID0gbmV3IFdlYWtNYXAoKTtcbnZhciBlZmZlY3RTdGFjayA9IFtdO1xudmFyIGFjdGl2ZUVmZmVjdDtcbnZhciBJVEVSQVRFX0tFWSA9IFN5bWJvbCh0cnVlID8gXCJpdGVyYXRlXCIgOiBcIlwiKTtcbnZhciBNQVBfS0VZX0lURVJBVEVfS0VZID0gU3ltYm9sKHRydWUgPyBcIk1hcCBrZXkgaXRlcmF0ZVwiIDogXCJcIik7XG5mdW5jdGlvbiBpc0VmZmVjdChmbikge1xuICByZXR1cm4gZm4gJiYgZm4uX2lzRWZmZWN0ID09PSB0cnVlO1xufVxuZnVuY3Rpb24gZWZmZWN0Mihmbiwgb3B0aW9ucyA9IEVNUFRZX09CSikge1xuICBpZiAoaXNFZmZlY3QoZm4pKSB7XG4gICAgZm4gPSBmbi5yYXc7XG4gIH1cbiAgY29uc3QgZWZmZWN0MyA9IGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKTtcbiAgaWYgKCFvcHRpb25zLmxhenkpIHtcbiAgICBlZmZlY3QzKCk7XG4gIH1cbiAgcmV0dXJuIGVmZmVjdDM7XG59XG5mdW5jdGlvbiBzdG9wKGVmZmVjdDMpIHtcbiAgaWYgKGVmZmVjdDMuYWN0aXZlKSB7XG4gICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLm9uU3RvcCkge1xuICAgICAgZWZmZWN0My5vcHRpb25zLm9uU3RvcCgpO1xuICAgIH1cbiAgICBlZmZlY3QzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59XG52YXIgdWlkID0gMDtcbmZ1bmN0aW9uIGNyZWF0ZVJlYWN0aXZlRWZmZWN0KGZuLCBvcHRpb25zKSB7XG4gIGNvbnN0IGVmZmVjdDMgPSBmdW5jdGlvbiByZWFjdGl2ZUVmZmVjdCgpIHtcbiAgICBpZiAoIWVmZmVjdDMuYWN0aXZlKSB7XG4gICAgICByZXR1cm4gZm4oKTtcbiAgICB9XG4gICAgaWYgKCFlZmZlY3RTdGFjay5pbmNsdWRlcyhlZmZlY3QzKSkge1xuICAgICAgY2xlYW51cChlZmZlY3QzKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGVuYWJsZVRyYWNraW5nKCk7XG4gICAgICAgIGVmZmVjdFN0YWNrLnB1c2goZWZmZWN0Myk7XG4gICAgICAgIGFjdGl2ZUVmZmVjdCA9IGVmZmVjdDM7XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgZWZmZWN0U3RhY2sucG9wKCk7XG4gICAgICAgIHJlc2V0VHJhY2tpbmcoKTtcbiAgICAgICAgYWN0aXZlRWZmZWN0ID0gZWZmZWN0U3RhY2tbZWZmZWN0U3RhY2subGVuZ3RoIC0gMV07XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBlZmZlY3QzLmlkID0gdWlkKys7XG4gIGVmZmVjdDMuYWxsb3dSZWN1cnNlID0gISFvcHRpb25zLmFsbG93UmVjdXJzZTtcbiAgZWZmZWN0My5faXNFZmZlY3QgPSB0cnVlO1xuICBlZmZlY3QzLmFjdGl2ZSA9IHRydWU7XG4gIGVmZmVjdDMucmF3ID0gZm47XG4gIGVmZmVjdDMuZGVwcyA9IFtdO1xuICBlZmZlY3QzLm9wdGlvbnMgPSBvcHRpb25zO1xuICByZXR1cm4gZWZmZWN0Mztcbn1cbmZ1bmN0aW9uIGNsZWFudXAoZWZmZWN0Mykge1xuICBjb25zdCB7ZGVwc30gPSBlZmZlY3QzO1xuICBpZiAoZGVwcy5sZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRlcHNbaV0uZGVsZXRlKGVmZmVjdDMpO1xuICAgIH1cbiAgICBkZXBzLmxlbmd0aCA9IDA7XG4gIH1cbn1cbnZhciBzaG91bGRUcmFjayA9IHRydWU7XG52YXIgdHJhY2tTdGFjayA9IFtdO1xuZnVuY3Rpb24gcGF1c2VUcmFja2luZygpIHtcbiAgdHJhY2tTdGFjay5wdXNoKHNob3VsZFRyYWNrKTtcbiAgc2hvdWxkVHJhY2sgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIGVuYWJsZVRyYWNraW5nKCkge1xuICB0cmFja1N0YWNrLnB1c2goc2hvdWxkVHJhY2spO1xuICBzaG91bGRUcmFjayA9IHRydWU7XG59XG5mdW5jdGlvbiByZXNldFRyYWNraW5nKCkge1xuICBjb25zdCBsYXN0ID0gdHJhY2tTdGFjay5wb3AoKTtcbiAgc2hvdWxkVHJhY2sgPSBsYXN0ID09PSB2b2lkIDAgPyB0cnVlIDogbGFzdDtcbn1cbmZ1bmN0aW9uIHRyYWNrKHRhcmdldCwgdHlwZSwga2V5KSB7XG4gIGlmICghc2hvdWxkVHJhY2sgfHwgYWN0aXZlRWZmZWN0ID09PSB2b2lkIDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGRlcHNNYXAgPSB0YXJnZXRNYXAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGVwc01hcCkge1xuICAgIHRhcmdldE1hcC5zZXQodGFyZ2V0LCBkZXBzTWFwID0gbmV3IE1hcCgpKTtcbiAgfVxuICBsZXQgZGVwID0gZGVwc01hcC5nZXQoa2V5KTtcbiAgaWYgKCFkZXApIHtcbiAgICBkZXBzTWFwLnNldChrZXksIGRlcCA9IG5ldyBTZXQoKSk7XG4gIH1cbiAgaWYgKCFkZXAuaGFzKGFjdGl2ZUVmZmVjdCkpIHtcbiAgICBkZXAuYWRkKGFjdGl2ZUVmZmVjdCk7XG4gICAgYWN0aXZlRWZmZWN0LmRlcHMucHVzaChkZXApO1xuICAgIGlmIChhY3RpdmVFZmZlY3Qub3B0aW9ucy5vblRyYWNrKSB7XG4gICAgICBhY3RpdmVFZmZlY3Qub3B0aW9ucy5vblRyYWNrKHtcbiAgICAgICAgZWZmZWN0OiBhY3RpdmVFZmZlY3QsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAgdHlwZSxcbiAgICAgICAga2V5XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHRyaWdnZXIodGFyZ2V0LCB0eXBlLCBrZXksIG5ld1ZhbHVlLCBvbGRWYWx1ZSwgb2xkVGFyZ2V0KSB7XG4gIGNvbnN0IGRlcHNNYXAgPSB0YXJnZXRNYXAuZ2V0KHRhcmdldCk7XG4gIGlmICghZGVwc01hcCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBlZmZlY3RzID0gbmV3IFNldCgpO1xuICBjb25zdCBhZGQyID0gKGVmZmVjdHNUb0FkZCkgPT4ge1xuICAgIGlmIChlZmZlY3RzVG9BZGQpIHtcbiAgICAgIGVmZmVjdHNUb0FkZC5mb3JFYWNoKChlZmZlY3QzKSA9PiB7XG4gICAgICAgIGlmIChlZmZlY3QzICE9PSBhY3RpdmVFZmZlY3QgfHwgZWZmZWN0My5hbGxvd1JlY3Vyc2UpIHtcbiAgICAgICAgICBlZmZlY3RzLmFkZChlZmZlY3QzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBpZiAodHlwZSA9PT0gXCJjbGVhclwiKSB7XG4gICAgZGVwc01hcC5mb3JFYWNoKGFkZDIpO1xuICB9IGVsc2UgaWYgKGtleSA9PT0gXCJsZW5ndGhcIiAmJiBpc0FycmF5KHRhcmdldCkpIHtcbiAgICBkZXBzTWFwLmZvckVhY2goKGRlcCwga2V5MikgPT4ge1xuICAgICAgaWYgKGtleTIgPT09IFwibGVuZ3RoXCIgfHwga2V5MiA+PSBuZXdWYWx1ZSkge1xuICAgICAgICBhZGQyKGRlcCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGtleSAhPT0gdm9pZCAwKSB7XG4gICAgICBhZGQyKGRlcHNNYXAuZ2V0KGtleSkpO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJhZGRcIjpcbiAgICAgICAgaWYgKCFpc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICBhZGQyKGRlcHNNYXAuZ2V0KElURVJBVEVfS0VZKSk7XG4gICAgICAgICAgaWYgKGlzTWFwKHRhcmdldCkpIHtcbiAgICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoTUFQX0tFWV9JVEVSQVRFX0tFWSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChpc0ludGVnZXJLZXkoa2V5KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoXCJsZW5ndGhcIikpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlbGV0ZVwiOlxuICAgICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgICAgYWRkMihkZXBzTWFwLmdldChNQVBfS0VZX0lURVJBVEVfS0VZKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInNldFwiOlxuICAgICAgICBpZiAoaXNNYXAodGFyZ2V0KSkge1xuICAgICAgICAgIGFkZDIoZGVwc01hcC5nZXQoSVRFUkFURV9LRVkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgY29uc3QgcnVuID0gKGVmZmVjdDMpID0+IHtcbiAgICBpZiAoZWZmZWN0My5vcHRpb25zLm9uVHJpZ2dlcikge1xuICAgICAgZWZmZWN0My5vcHRpb25zLm9uVHJpZ2dlcih7XG4gICAgICAgIGVmZmVjdDogZWZmZWN0MyxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBrZXksXG4gICAgICAgIHR5cGUsXG4gICAgICAgIG5ld1ZhbHVlLFxuICAgICAgICBvbGRWYWx1ZSxcbiAgICAgICAgb2xkVGFyZ2V0XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGVmZmVjdDMub3B0aW9ucy5zY2hlZHVsZXIpIHtcbiAgICAgIGVmZmVjdDMub3B0aW9ucy5zY2hlZHVsZXIoZWZmZWN0Myk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVmZmVjdDMoKTtcbiAgICB9XG4gIH07XG4gIGVmZmVjdHMuZm9yRWFjaChydW4pO1xufVxudmFyIGlzTm9uVHJhY2thYmxlS2V5cyA9IC8qIEBfX1BVUkVfXyAqLyBtYWtlTWFwKGBfX3Byb3RvX18sX192X2lzUmVmLF9faXNWdWVgKTtcbnZhciBidWlsdEluU3ltYm9scyA9IG5ldyBTZXQoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoU3ltYm9sKS5tYXAoKGtleSkgPT4gU3ltYm9sW2tleV0pLmZpbHRlcihpc1N5bWJvbCkpO1xudmFyIGdldDIgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlR2V0dGVyKCk7XG52YXIgc2hhbGxvd0dldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVHZXR0ZXIoZmFsc2UsIHRydWUpO1xudmFyIHJlYWRvbmx5R2V0ID0gLyogQF9fUFVSRV9fICovIGNyZWF0ZUdldHRlcih0cnVlKTtcbnZhciBzaGFsbG93UmVhZG9ubHlHZXQgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlR2V0dGVyKHRydWUsIHRydWUpO1xudmFyIGFycmF5SW5zdHJ1bWVudGF0aW9ucyA9IHt9O1xuW1wiaW5jbHVkZXNcIiwgXCJpbmRleE9mXCIsIFwibGFzdEluZGV4T2ZcIl0uZm9yRWFjaCgoa2V5KSA9PiB7XG4gIGNvbnN0IG1ldGhvZCA9IEFycmF5LnByb3RvdHlwZVtrZXldO1xuICBhcnJheUluc3RydW1lbnRhdGlvbnNba2V5XSA9IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBjb25zdCBhcnIgPSB0b1Jhdyh0aGlzKTtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0cmFjayhhcnIsIFwiZ2V0XCIsIGkgKyBcIlwiKTtcbiAgICB9XG4gICAgY29uc3QgcmVzID0gbWV0aG9kLmFwcGx5KGFyciwgYXJncyk7XG4gICAgaWYgKHJlcyA9PT0gLTEgfHwgcmVzID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseShhcnIsIGFyZ3MubWFwKHRvUmF3KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICB9O1xufSk7XG5bXCJwdXNoXCIsIFwicG9wXCIsIFwic2hpZnRcIiwgXCJ1bnNoaWZ0XCIsIFwic3BsaWNlXCJdLmZvckVhY2goKGtleSkgPT4ge1xuICBjb25zdCBtZXRob2QgPSBBcnJheS5wcm90b3R5cGVba2V5XTtcbiAgYXJyYXlJbnN0cnVtZW50YXRpb25zW2tleV0gPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgcGF1c2VUcmFja2luZygpO1xuICAgIGNvbnN0IHJlcyA9IG1ldGhvZC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICByZXNldFRyYWNraW5nKCk7XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcbn0pO1xuZnVuY3Rpb24gY3JlYXRlR2V0dGVyKGlzUmVhZG9ubHkgPSBmYWxzZSwgc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBnZXQzKHRhcmdldCwga2V5LCByZWNlaXZlcikge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWRvbmx5XCIpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIiAmJiByZWNlaXZlciA9PT0gKGlzUmVhZG9ubHkgPyBzaGFsbG93ID8gc2hhbGxvd1JlYWRvbmx5TWFwIDogcmVhZG9ubHlNYXAgOiBzaGFsbG93ID8gc2hhbGxvd1JlYWN0aXZlTWFwIDogcmVhY3RpdmVNYXApLmdldCh0YXJnZXQpKSB7XG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH1cbiAgICBjb25zdCB0YXJnZXRJc0FycmF5ID0gaXNBcnJheSh0YXJnZXQpO1xuICAgIGlmICghaXNSZWFkb25seSAmJiB0YXJnZXRJc0FycmF5ICYmIGhhc093bihhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSkpIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldChhcnJheUluc3RydW1lbnRhdGlvbnMsIGtleSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgICBjb25zdCByZXMgPSBSZWZsZWN0LmdldCh0YXJnZXQsIGtleSwgcmVjZWl2ZXIpO1xuICAgIGlmIChpc1N5bWJvbChrZXkpID8gYnVpbHRJblN5bWJvbHMuaGFzKGtleSkgOiBpc05vblRyYWNrYWJsZUtleXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKCFpc1JlYWRvbmx5KSB7XG4gICAgICB0cmFjayh0YXJnZXQsIFwiZ2V0XCIsIGtleSk7XG4gICAgfVxuICAgIGlmIChzaGFsbG93KSB7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAoaXNSZWYocmVzKSkge1xuICAgICAgY29uc3Qgc2hvdWxkVW53cmFwID0gIXRhcmdldElzQXJyYXkgfHwgIWlzSW50ZWdlcktleShrZXkpO1xuICAgICAgcmV0dXJuIHNob3VsZFVud3JhcCA/IHJlcy52YWx1ZSA6IHJlcztcbiAgICB9XG4gICAgaWYgKGlzT2JqZWN0KHJlcykpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5ID8gcmVhZG9ubHkocmVzKSA6IHJlYWN0aXZlMihyZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xuICB9O1xufVxudmFyIHNldDIgPSAvKiBAX19QVVJFX18gKi8gY3JlYXRlU2V0dGVyKCk7XG52YXIgc2hhbGxvd1NldCA9IC8qIEBfX1BVUkVfXyAqLyBjcmVhdGVTZXR0ZXIodHJ1ZSk7XG5mdW5jdGlvbiBjcmVhdGVTZXR0ZXIoc2hhbGxvdyA9IGZhbHNlKSB7XG4gIHJldHVybiBmdW5jdGlvbiBzZXQzKHRhcmdldCwga2V5LCB2YWx1ZSwgcmVjZWl2ZXIpIHtcbiAgICBsZXQgb2xkVmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICBpZiAoIXNoYWxsb3cpIHtcbiAgICAgIHZhbHVlID0gdG9SYXcodmFsdWUpO1xuICAgICAgb2xkVmFsdWUgPSB0b1JhdyhvbGRWYWx1ZSk7XG4gICAgICBpZiAoIWlzQXJyYXkodGFyZ2V0KSAmJiBpc1JlZihvbGRWYWx1ZSkgJiYgIWlzUmVmKHZhbHVlKSkge1xuICAgICAgICBvbGRWYWx1ZS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaGFkS2V5ID0gaXNBcnJheSh0YXJnZXQpICYmIGlzSW50ZWdlcktleShrZXkpID8gTnVtYmVyKGtleSkgPCB0YXJnZXQubGVuZ3RoIDogaGFzT3duKHRhcmdldCwga2V5KTtcbiAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LnNldCh0YXJnZXQsIGtleSwgdmFsdWUsIHJlY2VpdmVyKTtcbiAgICBpZiAodGFyZ2V0ID09PSB0b1JhdyhyZWNlaXZlcikpIHtcbiAgICAgIGlmICghaGFkS2V5KSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCBrZXksIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoaGFzQ2hhbmdlZCh2YWx1ZSwgb2xkVmFsdWUpKSB7XG4gICAgICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICBjb25zdCBoYWRLZXkgPSBoYXNPd24odGFyZ2V0LCBrZXkpO1xuICBjb25zdCBvbGRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwga2V5KTtcbiAgaWYgKHJlc3VsdCAmJiBoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiwga2V5LCB2b2lkIDAsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gaGFzKHRhcmdldCwga2V5KSB7XG4gIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuaGFzKHRhcmdldCwga2V5KTtcbiAgaWYgKCFpc1N5bWJvbChrZXkpIHx8ICFidWlsdEluU3ltYm9scy5oYXMoa2V5KSkge1xuICAgIHRyYWNrKHRhcmdldCwgXCJoYXNcIiwga2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gb3duS2V5cyh0YXJnZXQpIHtcbiAgdHJhY2sodGFyZ2V0LCBcIml0ZXJhdGVcIiwgaXNBcnJheSh0YXJnZXQpID8gXCJsZW5ndGhcIiA6IElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3Qub3duS2V5cyh0YXJnZXQpO1xufVxudmFyIG11dGFibGVIYW5kbGVycyA9IHtcbiAgZ2V0OiBnZXQyLFxuICBzZXQ6IHNldDIsXG4gIGRlbGV0ZVByb3BlcnR5LFxuICBoYXMsXG4gIG93bktleXNcbn07XG52YXIgcmVhZG9ubHlIYW5kbGVycyA9IHtcbiAgZ2V0OiByZWFkb25seUdldCxcbiAgc2V0KHRhcmdldCwga2V5KSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU2V0IG9wZXJhdGlvbiBvbiBrZXkgXCIke1N0cmluZyhrZXkpfVwiIGZhaWxlZDogdGFyZ2V0IGlzIHJlYWRvbmx5LmAsIHRhcmdldCk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIGtleSkge1xuICAgIGlmICh0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oYERlbGV0ZSBvcGVyYXRpb24gb24ga2V5IFwiJHtTdHJpbmcoa2V5KX1cIiBmYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0YXJnZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbnZhciBzaGFsbG93UmVhY3RpdmVIYW5kbGVycyA9IGV4dGVuZCh7fSwgbXV0YWJsZUhhbmRsZXJzLCB7XG4gIGdldDogc2hhbGxvd0dldCxcbiAgc2V0OiBzaGFsbG93U2V0XG59KTtcbnZhciBzaGFsbG93UmVhZG9ubHlIYW5kbGVycyA9IGV4dGVuZCh7fSwgcmVhZG9ubHlIYW5kbGVycywge1xuICBnZXQ6IHNoYWxsb3dSZWFkb25seUdldFxufSk7XG52YXIgdG9SZWFjdGl2ZSA9ICh2YWx1ZSkgPT4gaXNPYmplY3QodmFsdWUpID8gcmVhY3RpdmUyKHZhbHVlKSA6IHZhbHVlO1xudmFyIHRvUmVhZG9ubHkgPSAodmFsdWUpID0+IGlzT2JqZWN0KHZhbHVlKSA/IHJlYWRvbmx5KHZhbHVlKSA6IHZhbHVlO1xudmFyIHRvU2hhbGxvdyA9ICh2YWx1ZSkgPT4gdmFsdWU7XG52YXIgZ2V0UHJvdG8gPSAodikgPT4gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih2KTtcbmZ1bmN0aW9uIGdldCQxKHRhcmdldCwga2V5LCBpc1JlYWRvbmx5ID0gZmFsc2UsIGlzU2hhbGxvdyA9IGZhbHNlKSB7XG4gIHRhcmdldCA9IHRhcmdldFtcIl9fdl9yYXdcIl07XG4gIGNvbnN0IHJhd1RhcmdldCA9IHRvUmF3KHRhcmdldCk7XG4gIGNvbnN0IHJhd0tleSA9IHRvUmF3KGtleSk7XG4gIGlmIChrZXkgIT09IHJhd0tleSkge1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJnZXRcIiwga2V5KTtcbiAgfVxuICAhaXNSZWFkb25seSAmJiB0cmFjayhyYXdUYXJnZXQsIFwiZ2V0XCIsIHJhd0tleSk7XG4gIGNvbnN0IHtoYXM6IGhhczJ9ID0gZ2V0UHJvdG8ocmF3VGFyZ2V0KTtcbiAgY29uc3Qgd3JhcCA9IGlzU2hhbGxvdyA/IHRvU2hhbGxvdyA6IGlzUmVhZG9ubHkgPyB0b1JlYWRvbmx5IDogdG9SZWFjdGl2ZTtcbiAgaWYgKGhhczIuY2FsbChyYXdUYXJnZXQsIGtleSkpIHtcbiAgICByZXR1cm4gd3JhcCh0YXJnZXQuZ2V0KGtleSkpO1xuICB9IGVsc2UgaWYgKGhhczIuY2FsbChyYXdUYXJnZXQsIHJhd0tleSkpIHtcbiAgICByZXR1cm4gd3JhcCh0YXJnZXQuZ2V0KHJhd0tleSkpO1xuICB9IGVsc2UgaWYgKHRhcmdldCAhPT0gcmF3VGFyZ2V0KSB7XG4gICAgdGFyZ2V0LmdldChrZXkpO1xuICB9XG59XG5mdW5jdGlvbiBoYXMkMShrZXksIGlzUmVhZG9ubHkgPSBmYWxzZSkge1xuICBjb25zdCB0YXJnZXQgPSB0aGlzW1wiX192X3Jhd1wiXTtcbiAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgY29uc3QgcmF3S2V5ID0gdG9SYXcoa2V5KTtcbiAgaWYgKGtleSAhPT0gcmF3S2V5KSB7XG4gICAgIWlzUmVhZG9ubHkgJiYgdHJhY2socmF3VGFyZ2V0LCBcImhhc1wiLCBrZXkpO1xuICB9XG4gICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJoYXNcIiwgcmF3S2V5KTtcbiAgcmV0dXJuIGtleSA9PT0gcmF3S2V5ID8gdGFyZ2V0LmhhcyhrZXkpIDogdGFyZ2V0LmhhcyhrZXkpIHx8IHRhcmdldC5oYXMocmF3S2V5KTtcbn1cbmZ1bmN0aW9uIHNpemUodGFyZ2V0LCBpc1JlYWRvbmx5ID0gZmFsc2UpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0W1wiX192X3Jhd1wiXTtcbiAgIWlzUmVhZG9ubHkgJiYgdHJhY2sodG9SYXcodGFyZ2V0KSwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgXCJzaXplXCIsIHRhcmdldCk7XG59XG5mdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgdmFsdWUgPSB0b1Jhdyh2YWx1ZSk7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCBwcm90byA9IGdldFByb3RvKHRhcmdldCk7XG4gIGNvbnN0IGhhZEtleSA9IHByb3RvLmhhcy5jYWxsKHRhcmdldCwgdmFsdWUpO1xuICBpZiAoIWhhZEtleSkge1xuICAgIHRhcmdldC5hZGQodmFsdWUpO1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImFkZFwiLCB2YWx1ZSwgdmFsdWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuZnVuY3Rpb24gc2V0JDEoa2V5LCB2YWx1ZSkge1xuICB2YWx1ZSA9IHRvUmF3KHZhbHVlKTtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHtoYXM6IGhhczIsIGdldDogZ2V0M30gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAodHJ1ZSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDMuY2FsbCh0YXJnZXQsIGtleSk7XG4gIHRhcmdldC5zZXQoa2V5LCB2YWx1ZSk7XG4gIGlmICghaGFkS2V5KSB7XG4gICAgdHJpZ2dlcih0YXJnZXQsIFwiYWRkXCIsIGtleSwgdmFsdWUpO1xuICB9IGVsc2UgaWYgKGhhc0NoYW5nZWQodmFsdWUsIG9sZFZhbHVlKSkge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcInNldFwiLCBrZXksIHZhbHVlLCBvbGRWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5mdW5jdGlvbiBkZWxldGVFbnRyeShrZXkpIHtcbiAgY29uc3QgdGFyZ2V0ID0gdG9SYXcodGhpcyk7XG4gIGNvbnN0IHtoYXM6IGhhczIsIGdldDogZ2V0M30gPSBnZXRQcm90byh0YXJnZXQpO1xuICBsZXQgaGFkS2V5ID0gaGFzMi5jYWxsKHRhcmdldCwga2V5KTtcbiAgaWYgKCFoYWRLZXkpIHtcbiAgICBrZXkgPSB0b1JhdyhrZXkpO1xuICAgIGhhZEtleSA9IGhhczIuY2FsbCh0YXJnZXQsIGtleSk7XG4gIH0gZWxzZSBpZiAodHJ1ZSkge1xuICAgIGNoZWNrSWRlbnRpdHlLZXlzKHRhcmdldCwgaGFzMiwga2V5KTtcbiAgfVxuICBjb25zdCBvbGRWYWx1ZSA9IGdldDMgPyBnZXQzLmNhbGwodGFyZ2V0LCBrZXkpIDogdm9pZCAwO1xuICBjb25zdCByZXN1bHQgPSB0YXJnZXQuZGVsZXRlKGtleSk7XG4gIGlmIChoYWRLZXkpIHtcbiAgICB0cmlnZ2VyKHRhcmdldCwgXCJkZWxldGVcIiwga2V5LCB2b2lkIDAsIG9sZFZhbHVlKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY2xlYXIoKSB7XG4gIGNvbnN0IHRhcmdldCA9IHRvUmF3KHRoaXMpO1xuICBjb25zdCBoYWRJdGVtcyA9IHRhcmdldC5zaXplICE9PSAwO1xuICBjb25zdCBvbGRUYXJnZXQgPSB0cnVlID8gaXNNYXAodGFyZ2V0KSA/IG5ldyBNYXAodGFyZ2V0KSA6IG5ldyBTZXQodGFyZ2V0KSA6IHZvaWQgMDtcbiAgY29uc3QgcmVzdWx0ID0gdGFyZ2V0LmNsZWFyKCk7XG4gIGlmIChoYWRJdGVtcykge1xuICAgIHRyaWdnZXIodGFyZ2V0LCBcImNsZWFyXCIsIHZvaWQgMCwgdm9pZCAwLCBvbGRUYXJnZXQpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBjcmVhdGVGb3JFYWNoKGlzUmVhZG9ubHksIGlzU2hhbGxvdykge1xuICByZXR1cm4gZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFjaywgdGhpc0FyZykge1xuICAgIGNvbnN0IG9ic2VydmVkID0gdGhpcztcbiAgICBjb25zdCB0YXJnZXQgPSBvYnNlcnZlZFtcIl9fdl9yYXdcIl07XG4gICAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJpdGVyYXRlXCIsIElURVJBVEVfS0VZKTtcbiAgICByZXR1cm4gdGFyZ2V0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHdyYXAodmFsdWUpLCB3cmFwKGtleSksIG9ic2VydmVkKTtcbiAgICB9KTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUl0ZXJhYmxlTWV0aG9kKG1ldGhvZCwgaXNSZWFkb25seSwgaXNTaGFsbG93KSB7XG4gIHJldHVybiBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gdGhpc1tcIl9fdl9yYXdcIl07XG4gICAgY29uc3QgcmF3VGFyZ2V0ID0gdG9SYXcodGFyZ2V0KTtcbiAgICBjb25zdCB0YXJnZXRJc01hcCA9IGlzTWFwKHJhd1RhcmdldCk7XG4gICAgY29uc3QgaXNQYWlyID0gbWV0aG9kID09PSBcImVudHJpZXNcIiB8fCBtZXRob2QgPT09IFN5bWJvbC5pdGVyYXRvciAmJiB0YXJnZXRJc01hcDtcbiAgICBjb25zdCBpc0tleU9ubHkgPSBtZXRob2QgPT09IFwia2V5c1wiICYmIHRhcmdldElzTWFwO1xuICAgIGNvbnN0IGlubmVySXRlcmF0b3IgPSB0YXJnZXRbbWV0aG9kXSguLi5hcmdzKTtcbiAgICBjb25zdCB3cmFwID0gaXNTaGFsbG93ID8gdG9TaGFsbG93IDogaXNSZWFkb25seSA/IHRvUmVhZG9ubHkgOiB0b1JlYWN0aXZlO1xuICAgICFpc1JlYWRvbmx5ICYmIHRyYWNrKHJhd1RhcmdldCwgXCJpdGVyYXRlXCIsIGlzS2V5T25seSA/IE1BUF9LRVlfSVRFUkFURV9LRVkgOiBJVEVSQVRFX0tFWSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQoKSB7XG4gICAgICAgIGNvbnN0IHt2YWx1ZSwgZG9uZX0gPSBpbm5lckl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgcmV0dXJuIGRvbmUgPyB7dmFsdWUsIGRvbmV9IDoge1xuICAgICAgICAgIHZhbHVlOiBpc1BhaXIgPyBbd3JhcCh2YWx1ZVswXSksIHdyYXAodmFsdWVbMV0pXSA6IHdyYXAodmFsdWUpLFxuICAgICAgICAgIGRvbmVcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZVJlYWRvbmx5TWV0aG9kKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICBpZiAodHJ1ZSkge1xuICAgICAgY29uc3Qga2V5ID0gYXJnc1swXSA/IGBvbiBrZXkgXCIke2FyZ3NbMF19XCIgYCA6IGBgO1xuICAgICAgY29uc29sZS53YXJuKGAke2NhcGl0YWxpemUodHlwZSl9IG9wZXJhdGlvbiAke2tleX1mYWlsZWQ6IHRhcmdldCBpcyByZWFkb25seS5gLCB0b1Jhdyh0aGlzKSk7XG4gICAgfVxuICAgIHJldHVybiB0eXBlID09PSBcImRlbGV0ZVwiID8gZmFsc2UgOiB0aGlzO1xuICB9O1xufVxudmFyIG11dGFibGVJbnN0cnVtZW50YXRpb25zID0ge1xuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIGdldCQxKHRoaXMsIGtleSk7XG4gIH0sXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiBzaXplKHRoaXMpO1xuICB9LFxuICBoYXM6IGhhcyQxLFxuICBhZGQsXG4gIHNldDogc2V0JDEsXG4gIGRlbGV0ZTogZGVsZXRlRW50cnksXG4gIGNsZWFyLFxuICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKGZhbHNlLCBmYWxzZSlcbn07XG52YXIgc2hhbGxvd0luc3RydW1lbnRhdGlvbnMgPSB7XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCBmYWxzZSwgdHJ1ZSk7XG4gIH0sXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiBzaXplKHRoaXMpO1xuICB9LFxuICBoYXM6IGhhcyQxLFxuICBhZGQsXG4gIHNldDogc2V0JDEsXG4gIGRlbGV0ZTogZGVsZXRlRW50cnksXG4gIGNsZWFyLFxuICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKGZhbHNlLCB0cnVlKVxufTtcbnZhciByZWFkb25seUluc3RydW1lbnRhdGlvbnMgPSB7XG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gZ2V0JDEodGhpcywga2V5LCB0cnVlKTtcbiAgfSxcbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHNpemUodGhpcywgdHJ1ZSk7XG4gIH0sXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gaGFzJDEuY2FsbCh0aGlzLCBrZXksIHRydWUpO1xuICB9LFxuICBhZGQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiYWRkXCIpLFxuICBzZXQ6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwic2V0XCIpLFxuICBkZWxldGU6IGNyZWF0ZVJlYWRvbmx5TWV0aG9kKFwiZGVsZXRlXCIpLFxuICBjbGVhcjogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJjbGVhclwiKSxcbiAgZm9yRWFjaDogY3JlYXRlRm9yRWFjaCh0cnVlLCBmYWxzZSlcbn07XG52YXIgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucyA9IHtcbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiBnZXQkMSh0aGlzLCBrZXksIHRydWUsIHRydWUpO1xuICB9LFxuICBnZXQgc2l6ZSgpIHtcbiAgICByZXR1cm4gc2l6ZSh0aGlzLCB0cnVlKTtcbiAgfSxcbiAgaGFzKGtleSkge1xuICAgIHJldHVybiBoYXMkMS5jYWxsKHRoaXMsIGtleSwgdHJ1ZSk7XG4gIH0sXG4gIGFkZDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJhZGRcIiksXG4gIHNldDogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJzZXRcIiksXG4gIGRlbGV0ZTogY3JlYXRlUmVhZG9ubHlNZXRob2QoXCJkZWxldGVcIiksXG4gIGNsZWFyOiBjcmVhdGVSZWFkb25seU1ldGhvZChcImNsZWFyXCIpLFxuICBmb3JFYWNoOiBjcmVhdGVGb3JFYWNoKHRydWUsIHRydWUpXG59O1xudmFyIGl0ZXJhdG9yTWV0aG9kcyA9IFtcImtleXNcIiwgXCJ2YWx1ZXNcIiwgXCJlbnRyaWVzXCIsIFN5bWJvbC5pdGVyYXRvcl07XG5pdGVyYXRvck1ldGhvZHMuZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gIG11dGFibGVJbnN0cnVtZW50YXRpb25zW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGZhbHNlLCBmYWxzZSk7XG4gIHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9uc1ttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCB0cnVlLCBmYWxzZSk7XG4gIHNoYWxsb3dJbnN0cnVtZW50YXRpb25zW21ldGhvZF0gPSBjcmVhdGVJdGVyYWJsZU1ldGhvZChtZXRob2QsIGZhbHNlLCB0cnVlKTtcbiAgc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9uc1ttZXRob2RdID0gY3JlYXRlSXRlcmFibGVNZXRob2QobWV0aG9kLCB0cnVlLCB0cnVlKTtcbn0pO1xuZnVuY3Rpb24gY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGlzUmVhZG9ubHksIHNoYWxsb3cpIHtcbiAgY29uc3QgaW5zdHJ1bWVudGF0aW9ucyA9IHNoYWxsb3cgPyBpc1JlYWRvbmx5ID8gc2hhbGxvd1JlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucyA6IHNoYWxsb3dJbnN0cnVtZW50YXRpb25zIDogaXNSZWFkb25seSA/IHJlYWRvbmx5SW5zdHJ1bWVudGF0aW9ucyA6IG11dGFibGVJbnN0cnVtZW50YXRpb25zO1xuICByZXR1cm4gKHRhcmdldCwga2V5LCByZWNlaXZlcikgPT4ge1xuICAgIGlmIChrZXkgPT09IFwiX192X2lzUmVhY3RpdmVcIikge1xuICAgICAgcmV0dXJuICFpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9pc1JlYWRvbmx5XCIpIHtcbiAgICAgIHJldHVybiBpc1JlYWRvbmx5O1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIl9fdl9yYXdcIikge1xuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0KGhhc093bihpbnN0cnVtZW50YXRpb25zLCBrZXkpICYmIGtleSBpbiB0YXJnZXQgPyBpbnN0cnVtZW50YXRpb25zIDogdGFyZ2V0LCBrZXksIHJlY2VpdmVyKTtcbiAgfTtcbn1cbnZhciBtdXRhYmxlQ29sbGVjdGlvbkhhbmRsZXJzID0ge1xuICBnZXQ6IGNyZWF0ZUluc3RydW1lbnRhdGlvbkdldHRlcihmYWxzZSwgZmFsc2UpXG59O1xudmFyIHNoYWxsb3dDb2xsZWN0aW9uSGFuZGxlcnMgPSB7XG4gIGdldDogY3JlYXRlSW5zdHJ1bWVudGF0aW9uR2V0dGVyKGZhbHNlLCB0cnVlKVxufTtcbnZhciByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIodHJ1ZSwgZmFsc2UpXG59O1xudmFyIHNoYWxsb3dSZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycyA9IHtcbiAgZ2V0OiBjcmVhdGVJbnN0cnVtZW50YXRpb25HZXR0ZXIodHJ1ZSwgdHJ1ZSlcbn07XG5mdW5jdGlvbiBjaGVja0lkZW50aXR5S2V5cyh0YXJnZXQsIGhhczIsIGtleSkge1xuICBjb25zdCByYXdLZXkgPSB0b1JhdyhrZXkpO1xuICBpZiAocmF3S2V5ICE9PSBrZXkgJiYgaGFzMi5jYWxsKHRhcmdldCwgcmF3S2V5KSkge1xuICAgIGNvbnN0IHR5cGUgPSB0b1Jhd1R5cGUodGFyZ2V0KTtcbiAgICBjb25zb2xlLndhcm4oYFJlYWN0aXZlICR7dHlwZX0gY29udGFpbnMgYm90aCB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiB0aGUgc2FtZSBvYmplY3Qke3R5cGUgPT09IGBNYXBgID8gYCBhcyBrZXlzYCA6IGBgfSwgd2hpY2ggY2FuIGxlYWQgdG8gaW5jb25zaXN0ZW5jaWVzLiBBdm9pZCBkaWZmZXJlbnRpYXRpbmcgYmV0d2VlbiB0aGUgcmF3IGFuZCByZWFjdGl2ZSB2ZXJzaW9ucyBvZiBhbiBvYmplY3QgYW5kIG9ubHkgdXNlIHRoZSByZWFjdGl2ZSB2ZXJzaW9uIGlmIHBvc3NpYmxlLmApO1xuICB9XG59XG52YXIgcmVhY3RpdmVNYXAgPSBuZXcgV2Vha01hcCgpO1xudmFyIHNoYWxsb3dSZWFjdGl2ZU1hcCA9IG5ldyBXZWFrTWFwKCk7XG52YXIgcmVhZG9ubHlNYXAgPSBuZXcgV2Vha01hcCgpO1xudmFyIHNoYWxsb3dSZWFkb25seU1hcCA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiB0YXJnZXRUeXBlTWFwKHJhd1R5cGUpIHtcbiAgc3dpdGNoIChyYXdUeXBlKSB7XG4gICAgY2FzZSBcIk9iamVjdFwiOlxuICAgIGNhc2UgXCJBcnJheVwiOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSBcIk1hcFwiOlxuICAgIGNhc2UgXCJTZXRcIjpcbiAgICBjYXNlIFwiV2Vha01hcFwiOlxuICAgIGNhc2UgXCJXZWFrU2V0XCI6XG4gICAgICByZXR1cm4gMjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIDA7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldFRhcmdldFR5cGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlW1wiX192X3NraXBcIl0gfHwgIU9iamVjdC5pc0V4dGVuc2libGUodmFsdWUpID8gMCA6IHRhcmdldFR5cGVNYXAodG9SYXdUeXBlKHZhbHVlKSk7XG59XG5mdW5jdGlvbiByZWFjdGl2ZTIodGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgJiYgdGFyZ2V0W1wiX192X2lzUmVhZG9ubHlcIl0pIHtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG4gIHJldHVybiBjcmVhdGVSZWFjdGl2ZU9iamVjdCh0YXJnZXQsIGZhbHNlLCBtdXRhYmxlSGFuZGxlcnMsIG11dGFibGVDb2xsZWN0aW9uSGFuZGxlcnMsIHJlYWN0aXZlTWFwKTtcbn1cbmZ1bmN0aW9uIHJlYWRvbmx5KHRhcmdldCkge1xuICByZXR1cm4gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCB0cnVlLCByZWFkb25seUhhbmRsZXJzLCByZWFkb25seUNvbGxlY3Rpb25IYW5kbGVycywgcmVhZG9ubHlNYXApO1xufVxuZnVuY3Rpb24gY3JlYXRlUmVhY3RpdmVPYmplY3QodGFyZ2V0LCBpc1JlYWRvbmx5LCBiYXNlSGFuZGxlcnMsIGNvbGxlY3Rpb25IYW5kbGVycywgcHJveHlNYXApIHtcbiAgaWYgKCFpc09iamVjdCh0YXJnZXQpKSB7XG4gICAgaWYgKHRydWUpIHtcbiAgICAgIGNvbnNvbGUud2FybihgdmFsdWUgY2Fubm90IGJlIG1hZGUgcmVhY3RpdmU6ICR7U3RyaW5nKHRhcmdldCl9YCk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgaWYgKHRhcmdldFtcIl9fdl9yYXdcIl0gJiYgIShpc1JlYWRvbmx5ICYmIHRhcmdldFtcIl9fdl9pc1JlYWN0aXZlXCJdKSkge1xuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cbiAgY29uc3QgZXhpc3RpbmdQcm94eSA9IHByb3h5TWFwLmdldCh0YXJnZXQpO1xuICBpZiAoZXhpc3RpbmdQcm94eSkge1xuICAgIHJldHVybiBleGlzdGluZ1Byb3h5O1xuICB9XG4gIGNvbnN0IHRhcmdldFR5cGUgPSBnZXRUYXJnZXRUeXBlKHRhcmdldCk7XG4gIGlmICh0YXJnZXRUeXBlID09PSAwKSB7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuICBjb25zdCBwcm94eSA9IG5ldyBQcm94eSh0YXJnZXQsIHRhcmdldFR5cGUgPT09IDIgPyBjb2xsZWN0aW9uSGFuZGxlcnMgOiBiYXNlSGFuZGxlcnMpO1xuICBwcm94eU1hcC5zZXQodGFyZ2V0LCBwcm94eSk7XG4gIHJldHVybiBwcm94eTtcbn1cbmZ1bmN0aW9uIHRvUmF3KG9ic2VydmVkKSB7XG4gIHJldHVybiBvYnNlcnZlZCAmJiB0b1JhdyhvYnNlcnZlZFtcIl9fdl9yYXdcIl0pIHx8IG9ic2VydmVkO1xufVxuZnVuY3Rpb24gaXNSZWYocikge1xuICByZXR1cm4gQm9vbGVhbihyICYmIHIuX192X2lzUmVmID09PSB0cnVlKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kbmV4dFRpY2suanNcbm1hZ2ljKFwibmV4dFRpY2tcIiwgKCkgPT4gbmV4dFRpY2spO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRkaXNwYXRjaC5qc1xubWFnaWMoXCJkaXNwYXRjaFwiLCAoZWwpID0+IGRpc3BhdGNoLmJpbmQoZGlzcGF0Y2gsIGVsKSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvJHdhdGNoLmpzXG5tYWdpYyhcIndhdGNoXCIsIChlbCwge2V2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyLCBlZmZlY3Q6IGVmZmVjdDN9KSA9PiAoa2V5LCBjYWxsYmFjaykgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoa2V5KTtcbiAgbGV0IGZpcnN0VGltZSA9IHRydWU7XG4gIGxldCBvbGRWYWx1ZTtcbiAgbGV0IGVmZmVjdFJlZmVyZW5jZSA9IGVmZmVjdDMoKCkgPT4gZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAoIWZpcnN0VGltZSkge1xuICAgICAgcXVldWVNaWNyb3Rhc2soKCkgPT4ge1xuICAgICAgICBjYWxsYmFjayh2YWx1ZSwgb2xkVmFsdWUpO1xuICAgICAgICBvbGRWYWx1ZSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICB9KSk7XG4gIGVsLl94X2VmZmVjdHMuZGVsZXRlKGVmZmVjdFJlZmVyZW5jZSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kc3RvcmUuanNcbm1hZ2ljKFwic3RvcmVcIiwgZ2V0U3RvcmVzKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZGF0YS5qc1xubWFnaWMoXCJkYXRhXCIsIChlbCkgPT4gc2NvcGUoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcm9vdC5qc1xubWFnaWMoXCJyb290XCIsIChlbCkgPT4gY2xvc2VzdFJvb3QoZWwpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kcmVmcy5qc1xubWFnaWMoXCJyZWZzXCIsIChlbCkgPT4ge1xuICBpZiAoZWwuX3hfcmVmc19wcm94eSlcbiAgICByZXR1cm4gZWwuX3hfcmVmc19wcm94eTtcbiAgZWwuX3hfcmVmc19wcm94eSA9IG1lcmdlUHJveGllcyhnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSk7XG4gIHJldHVybiBlbC5feF9yZWZzX3Byb3h5O1xufSk7XG5mdW5jdGlvbiBnZXRBcnJheU9mUmVmT2JqZWN0KGVsKSB7XG4gIGxldCByZWZPYmplY3RzID0gW107XG4gIGxldCBjdXJyZW50RWwgPSBlbDtcbiAgd2hpbGUgKGN1cnJlbnRFbCkge1xuICAgIGlmIChjdXJyZW50RWwuX3hfcmVmcylcbiAgICAgIHJlZk9iamVjdHMucHVzaChjdXJyZW50RWwuX3hfcmVmcyk7XG4gICAgY3VycmVudEVsID0gY3VycmVudEVsLnBhcmVudE5vZGU7XG4gIH1cbiAgcmV0dXJuIHJlZk9iamVjdHM7XG59XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9pZHMuanNcbnZhciBnbG9iYWxJZE1lbW8gPSB7fTtcbmZ1bmN0aW9uIGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKSB7XG4gIGlmICghZ2xvYmFsSWRNZW1vW25hbWVdKVxuICAgIGdsb2JhbElkTWVtb1tuYW1lXSA9IDA7XG4gIHJldHVybiArK2dsb2JhbElkTWVtb1tuYW1lXTtcbn1cbmZ1bmN0aW9uIGNsb3Nlc3RJZFJvb3QoZWwsIG5hbWUpIHtcbiAgcmV0dXJuIGZpbmRDbG9zZXN0KGVsLCAoZWxlbWVudCkgPT4ge1xuICAgIGlmIChlbGVtZW50Ll94X2lkcyAmJiBlbGVtZW50Ll94X2lkc1tuYW1lXSlcbiAgICAgIHJldHVybiB0cnVlO1xuICB9KTtcbn1cbmZ1bmN0aW9uIHNldElkUm9vdChlbCwgbmFtZSkge1xuICBpZiAoIWVsLl94X2lkcylcbiAgICBlbC5feF9pZHMgPSB7fTtcbiAgaWYgKCFlbC5feF9pZHNbbmFtZV0pXG4gICAgZWwuX3hfaWRzW25hbWVdID0gZmluZEFuZEluY3JlbWVudElkKG5hbWUpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvbWFnaWNzLyRpZC5qc1xubWFnaWMoXCJpZFwiLCAoZWwpID0+IChuYW1lLCBrZXkgPSBudWxsKSA9PiB7XG4gIGxldCByb290ID0gY2xvc2VzdElkUm9vdChlbCwgbmFtZSk7XG4gIGxldCBpZCA9IHJvb3QgPyByb290Ll94X2lkc1tuYW1lXSA6IGZpbmRBbmRJbmNyZW1lbnRJZChuYW1lKTtcbiAgcmV0dXJuIGtleSA/IGAke25hbWV9LSR7aWR9LSR7a2V5fWAgOiBgJHtuYW1lfS0ke2lkfWA7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL21hZ2ljcy8kZWwuanNcbm1hZ2ljKFwiZWxcIiwgKGVsKSA9PiBlbCk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9tYWdpY3MvaW5kZXguanNcbndhcm5NaXNzaW5nUGx1Z2luTWFnaWMoXCJGb2N1c1wiLCBcImZvY3VzXCIsIFwiZm9jdXNcIik7XG53YXJuTWlzc2luZ1BsdWdpbk1hZ2ljKFwiUGVyc2lzdFwiLCBcInBlcnNpc3RcIiwgXCJwZXJzaXN0XCIpO1xuZnVuY3Rpb24gd2Fybk1pc3NpbmdQbHVnaW5NYWdpYyhuYW1lLCBtYWdpY05hbWUsIHNsdWcpIHtcbiAgbWFnaWMobWFnaWNOYW1lLCAoZWwpID0+IHdhcm4oYFlvdSBjYW4ndCB1c2UgWyQke2RpcmVjdGl2ZU5hbWV9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtuYW1lfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7c2x1Z31gLCBlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW1vZGVsYWJsZS5qc1xuZGlyZWN0aXZlKFwibW9kZWxhYmxlXCIsIChlbCwge2V4cHJlc3Npb259LCB7ZWZmZWN0OiBlZmZlY3QzLCBldmFsdWF0ZUxhdGVyOiBldmFsdWF0ZUxhdGVyMn0pID0+IHtcbiAgbGV0IGZ1bmMgPSBldmFsdWF0ZUxhdGVyMihleHByZXNzaW9uKTtcbiAgbGV0IGlubmVyR2V0ID0gKCkgPT4ge1xuICAgIGxldCByZXN1bHQ7XG4gICAgZnVuYygoaSkgPT4gcmVzdWx0ID0gaSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbGV0IGV2YWx1YXRlSW5uZXJTZXQgPSBldmFsdWF0ZUxhdGVyMihgJHtleHByZXNzaW9ufSA9IF9fcGxhY2Vob2xkZXJgKTtcbiAgbGV0IGlubmVyU2V0ID0gKHZhbCkgPT4gZXZhbHVhdGVJbm5lclNldCgoKSA9PiB7XG4gIH0sIHtzY29wZToge19fcGxhY2Vob2xkZXI6IHZhbH19KTtcbiAgbGV0IGluaXRpYWxWYWx1ZSA9IGlubmVyR2V0KCk7XG4gIGlubmVyU2V0KGluaXRpYWxWYWx1ZSk7XG4gIHF1ZXVlTWljcm90YXNrKCgpID0+IHtcbiAgICBpZiAoIWVsLl94X21vZGVsKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSgpO1xuICAgIGxldCBvdXRlckdldCA9IGVsLl94X21vZGVsLmdldDtcbiAgICBsZXQgb3V0ZXJTZXQgPSBlbC5feF9tb2RlbC5zZXQ7XG4gICAgZWZmZWN0MygoKSA9PiBpbm5lclNldChvdXRlckdldCgpKSk7XG4gICAgZWZmZWN0MygoKSA9PiBvdXRlclNldChpbm5lckdldCgpKSk7XG4gIH0pO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdGVsZXBvcnQuanNcbmRpcmVjdGl2ZShcInRlbGVwb3J0XCIsIChlbCwge2V4cHJlc3Npb259LCB7Y2xlYW51cDogY2xlYW51cDJ9KSA9PiB7XG4gIGlmIChlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwidGVtcGxhdGVcIilcbiAgICB3YXJuKFwieC10ZWxlcG9ydCBjYW4gb25seSBiZSB1c2VkIG9uIGEgPHRlbXBsYXRlPiB0YWdcIiwgZWwpO1xuICBsZXQgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihleHByZXNzaW9uKTtcbiAgaWYgKCF0YXJnZXQpXG4gICAgd2FybihgQ2Fubm90IGZpbmQgeC10ZWxlcG9ydCBlbGVtZW50IGZvciBzZWxlY3RvcjogXCIke2V4cHJlc3Npb259XCJgKTtcbiAgbGV0IGNsb25lMiA9IGVsLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICBlbC5feF90ZWxlcG9ydCA9IGNsb25lMjtcbiAgY2xvbmUyLl94X3RlbGVwb3J0QmFjayA9IGVsO1xuICBpZiAoZWwuX3hfZm9yd2FyZEV2ZW50cykge1xuICAgIGVsLl94X2ZvcndhcmRFdmVudHMuZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICBjbG9uZTIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIChlKSA9PiB7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IGUuY29uc3RydWN0b3IoZS50eXBlLCBlKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHt9LCBlbCk7XG4gIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGNsb25lMik7XG4gICAgaW5pdFRyZWUoY2xvbmUyKTtcbiAgICBjbG9uZTIuX3hfaWdub3JlID0gdHJ1ZTtcbiAgfSk7XG4gIGNsZWFudXAyKCgpID0+IGNsb25lMi5yZW1vdmUoKSk7XG59KTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pZ25vcmUuanNcbnZhciBoYW5kbGVyID0gKCkgPT4ge1xufTtcbmhhbmRsZXIuaW5saW5lID0gKGVsLCB7bW9kaWZpZXJzfSwge2NsZWFudXA6IGNsZWFudXAyfSkgPT4ge1xuICBtb2RpZmllcnMuaW5jbHVkZXMoXCJzZWxmXCIpID8gZWwuX3hfaWdub3JlU2VsZiA9IHRydWUgOiBlbC5feF9pZ25vcmUgPSB0cnVlO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgbW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSA/IGRlbGV0ZSBlbC5feF9pZ25vcmVTZWxmIDogZGVsZXRlIGVsLl94X2lnbm9yZTtcbiAgfSk7XG59O1xuZGlyZWN0aXZlKFwiaWdub3JlXCIsIGhhbmRsZXIpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWVmZmVjdC5qc1xuZGlyZWN0aXZlKFwiZWZmZWN0XCIsIChlbCwge2V4cHJlc3Npb259LCB7ZWZmZWN0OiBlZmZlY3QzfSkgPT4gZWZmZWN0MyhldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvdXRpbHMvb24uanNcbmZ1bmN0aW9uIG9uKGVsLCBldmVudCwgbW9kaWZpZXJzLCBjYWxsYmFjaykge1xuICBsZXQgbGlzdGVuZXJUYXJnZXQgPSBlbDtcbiAgbGV0IGhhbmRsZXIzID0gKGUpID0+IGNhbGxiYWNrKGUpO1xuICBsZXQgb3B0aW9ucyA9IHt9O1xuICBsZXQgd3JhcEhhbmRsZXIgPSAoY2FsbGJhY2syLCB3cmFwcGVyKSA9PiAoZSkgPT4gd3JhcHBlcihjYWxsYmFjazIsIGUpO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwiZG90XCIpKVxuICAgIGV2ZW50ID0gZG90U3ludGF4KGV2ZW50KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImNhbWVsXCIpKVxuICAgIGV2ZW50ID0gY2FtZWxDYXNlMihldmVudCk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJwYXNzaXZlXCIpKVxuICAgIG9wdGlvbnMucGFzc2l2ZSA9IHRydWU7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJjYXB0dXJlXCIpKVxuICAgIG9wdGlvbnMuY2FwdHVyZSA9IHRydWU7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ3aW5kb3dcIikpXG4gICAgbGlzdGVuZXJUYXJnZXQgPSB3aW5kb3c7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkb2N1bWVudFwiKSlcbiAgICBsaXN0ZW5lclRhcmdldCA9IGRvY3VtZW50O1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwicHJldmVudFwiKSlcbiAgICBoYW5kbGVyMyA9IHdyYXBIYW5kbGVyKGhhbmRsZXIzLCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcInN0b3BcIikpXG4gICAgaGFuZGxlcjMgPSB3cmFwSGFuZGxlcihoYW5kbGVyMywgKG5leHQsIGUpID0+IHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBuZXh0KGUpO1xuICAgIH0pO1xuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwic2VsZlwiKSlcbiAgICBoYW5kbGVyMyA9IHdyYXBIYW5kbGVyKGhhbmRsZXIzLCAobmV4dCwgZSkgPT4ge1xuICAgICAgZS50YXJnZXQgPT09IGVsICYmIG5leHQoZSk7XG4gICAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJhd2F5XCIpIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcIm91dHNpZGVcIikpIHtcbiAgICBsaXN0ZW5lclRhcmdldCA9IGRvY3VtZW50O1xuICAgIGhhbmRsZXIzID0gd3JhcEhhbmRsZXIoaGFuZGxlcjMsIChuZXh0LCBlKSA9PiB7XG4gICAgICBpZiAoZWwuY29udGFpbnMoZS50YXJnZXQpKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZS50YXJnZXQuaXNDb25uZWN0ZWQgPT09IGZhbHNlKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoZWwub2Zmc2V0V2lkdGggPCAxICYmIGVsLm9mZnNldEhlaWdodCA8IDEpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGlmIChlbC5feF9pc1Nob3duID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbmV4dChlKTtcbiAgICB9KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwib25jZVwiKSkge1xuICAgIGhhbmRsZXIzID0gd3JhcEhhbmRsZXIoaGFuZGxlcjMsIChuZXh0LCBlKSA9PiB7XG4gICAgICBuZXh0KGUpO1xuICAgICAgbGlzdGVuZXJUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjMsIG9wdGlvbnMpO1xuICAgIH0pO1xuICB9XG4gIGhhbmRsZXIzID0gd3JhcEhhbmRsZXIoaGFuZGxlcjMsIChuZXh0LCBlKSA9PiB7XG4gICAgaWYgKGlzS2V5RXZlbnQoZXZlbnQpKSB7XG4gICAgICBpZiAoaXNMaXN0ZW5pbmdGb3JBU3BlY2lmaWNLZXlUaGF0SGFzbnRCZWVuUHJlc3NlZChlLCBtb2RpZmllcnMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgbmV4dChlKTtcbiAgfSk7XG4gIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJkZWJvdW5jZVwiKSkge1xuICAgIGxldCBuZXh0TW9kaWZpZXIgPSBtb2RpZmllcnNbbW9kaWZpZXJzLmluZGV4T2YoXCJkZWJvdW5jZVwiKSArIDFdIHx8IFwiaW52YWxpZC13YWl0XCI7XG4gICAgbGV0IHdhaXQgPSBpc051bWVyaWMobmV4dE1vZGlmaWVyLnNwbGl0KFwibXNcIilbMF0pID8gTnVtYmVyKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA6IDI1MDtcbiAgICBoYW5kbGVyMyA9IGRlYm91bmNlKGhhbmRsZXIzLCB3YWl0KTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKFwidGhyb3R0bGVcIikpIHtcbiAgICBsZXQgbmV4dE1vZGlmaWVyID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKFwidGhyb3R0bGVcIikgKyAxXSB8fCBcImludmFsaWQtd2FpdFwiO1xuICAgIGxldCB3YWl0ID0gaXNOdW1lcmljKG5leHRNb2RpZmllci5zcGxpdChcIm1zXCIpWzBdKSA/IE51bWJlcihuZXh0TW9kaWZpZXIuc3BsaXQoXCJtc1wiKVswXSkgOiAyNTA7XG4gICAgaGFuZGxlcjMgPSB0aHJvdHRsZShoYW5kbGVyMywgd2FpdCk7XG4gIH1cbiAgbGlzdGVuZXJUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlcjMsIG9wdGlvbnMpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIzLCBvcHRpb25zKTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGRvdFN5bnRheChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLy0vZywgXCIuXCIpO1xufVxuZnVuY3Rpb24gY2FtZWxDYXNlMihzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYyhzdWJqZWN0KSB7XG4gIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG59XG5mdW5jdGlvbiBrZWJhYkNhc2UyKHN1YmplY3QpIHtcbiAgcmV0dXJuIHN1YmplY3QucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgXCIkMS0kMlwiKS5yZXBsYWNlKC9bX1xcc10vLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbmZ1bmN0aW9uIGlzS2V5RXZlbnQoZXZlbnQpIHtcbiAgcmV0dXJuIFtcImtleWRvd25cIiwgXCJrZXl1cFwiXS5pbmNsdWRlcyhldmVudCk7XG59XG5mdW5jdGlvbiBpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykge1xuICBsZXQga2V5TW9kaWZpZXJzID0gbW9kaWZpZXJzLmZpbHRlcigoaSkgPT4ge1xuICAgIHJldHVybiAhW1wid2luZG93XCIsIFwiZG9jdW1lbnRcIiwgXCJwcmV2ZW50XCIsIFwic3RvcFwiLCBcIm9uY2VcIl0uaW5jbHVkZXMoaSk7XG4gIH0pO1xuICBpZiAoa2V5TW9kaWZpZXJzLmluY2x1ZGVzKFwiZGVib3VuY2VcIikpIHtcbiAgICBsZXQgZGVib3VuY2VJbmRleCA9IGtleU1vZGlmaWVycy5pbmRleE9mKFwiZGVib3VuY2VcIik7XG4gICAga2V5TW9kaWZpZXJzLnNwbGljZShkZWJvdW5jZUluZGV4LCBpc051bWVyaWMoKGtleU1vZGlmaWVyc1tkZWJvdW5jZUluZGV4ICsgMV0gfHwgXCJpbnZhbGlkLXdhaXRcIikuc3BsaXQoXCJtc1wiKVswXSkgPyAyIDogMSk7XG4gIH1cbiAgaWYgKGtleU1vZGlmaWVycy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoa2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gMSAmJiBrZXlUb01vZGlmaWVycyhlLmtleSkuaW5jbHVkZXMoa2V5TW9kaWZpZXJzWzBdKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHN5c3RlbUtleU1vZGlmaWVycyA9IFtcImN0cmxcIiwgXCJzaGlmdFwiLCBcImFsdFwiLCBcIm1ldGFcIiwgXCJjbWRcIiwgXCJzdXBlclwiXTtcbiAgY29uc3Qgc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMgPSBzeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKChtb2RpZmllcikgPT4ga2V5TW9kaWZpZXJzLmluY2x1ZGVzKG1vZGlmaWVyKSk7XG4gIGtleU1vZGlmaWVycyA9IGtleU1vZGlmaWVycy5maWx0ZXIoKGkpID0+ICFzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5pbmNsdWRlcyhpKSk7XG4gIGlmIChzZWxlY3RlZFN5c3RlbUtleU1vZGlmaWVycy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzID0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKChtb2RpZmllcikgPT4ge1xuICAgICAgaWYgKG1vZGlmaWVyID09PSBcImNtZFwiIHx8IG1vZGlmaWVyID09PSBcInN1cGVyXCIpXG4gICAgICAgIG1vZGlmaWVyID0gXCJtZXRhXCI7XG4gICAgICByZXR1cm4gZVtgJHttb2RpZmllcn1LZXlgXTtcbiAgICB9KTtcbiAgICBpZiAoYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICBpZiAoa2V5VG9Nb2RpZmllcnMoZS5rZXkpLmluY2x1ZGVzKGtleU1vZGlmaWVyc1swXSkpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBrZXlUb01vZGlmaWVycyhrZXkpIHtcbiAgaWYgKCFrZXkpXG4gICAgcmV0dXJuIFtdO1xuICBrZXkgPSBrZWJhYkNhc2UyKGtleSk7XG4gIGxldCBtb2RpZmllclRvS2V5TWFwID0ge1xuICAgIGN0cmw6IFwiY29udHJvbFwiLFxuICAgIHNsYXNoOiBcIi9cIixcbiAgICBzcGFjZTogXCItXCIsXG4gICAgc3BhY2ViYXI6IFwiLVwiLFxuICAgIGNtZDogXCJtZXRhXCIsXG4gICAgZXNjOiBcImVzY2FwZVwiLFxuICAgIHVwOiBcImFycm93LXVwXCIsXG4gICAgZG93bjogXCJhcnJvdy1kb3duXCIsXG4gICAgbGVmdDogXCJhcnJvdy1sZWZ0XCIsXG4gICAgcmlnaHQ6IFwiYXJyb3ctcmlnaHRcIixcbiAgICBwZXJpb2Q6IFwiLlwiLFxuICAgIGVxdWFsOiBcIj1cIlxuICB9O1xuICBtb2RpZmllclRvS2V5TWFwW2tleV0gPSBrZXk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhtb2RpZmllclRvS2V5TWFwKS5tYXAoKG1vZGlmaWVyKSA9PiB7XG4gICAgaWYgKG1vZGlmaWVyVG9LZXlNYXBbbW9kaWZpZXJdID09PSBrZXkpXG4gICAgICByZXR1cm4gbW9kaWZpZXI7XG4gIH0pLmZpbHRlcigobW9kaWZpZXIpID0+IG1vZGlmaWVyKTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1tb2RlbC5qc1xuZGlyZWN0aXZlKFwibW9kZWxcIiwgKGVsLCB7bW9kaWZpZXJzLCBleHByZXNzaW9ufSwge2VmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDJ9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgbGV0IGFzc2lnbm1lbnRFeHByZXNzaW9uID0gYCR7ZXhwcmVzc2lvbn0gPSByaWdodFNpZGVPZkV4cHJlc3Npb24oJGV2ZW50LCAke2V4cHJlc3Npb259KWA7XG4gIGxldCBldmFsdWF0ZUFzc2lnbm1lbnQgPSBldmFsdWF0ZUxhdGVyKGVsLCBhc3NpZ25tZW50RXhwcmVzc2lvbik7XG4gIHZhciBldmVudCA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIiB8fCBbXCJjaGVja2JveFwiLCBcInJhZGlvXCJdLmluY2x1ZGVzKGVsLnR5cGUpIHx8IG1vZGlmaWVycy5pbmNsdWRlcyhcImxhenlcIikgPyBcImNoYW5nZVwiIDogXCJpbnB1dFwiO1xuICBsZXQgYXNzaWdtZW50RnVuY3Rpb24gPSBnZW5lcmF0ZUFzc2lnbm1lbnRGdW5jdGlvbihlbCwgbW9kaWZpZXJzLCBleHByZXNzaW9uKTtcbiAgbGV0IHJlbW92ZUxpc3RlbmVyID0gb24oZWwsIGV2ZW50LCBtb2RpZmllcnMsIChlKSA9PiB7XG4gICAgZXZhbHVhdGVBc3NpZ25tZW50KCgpID0+IHtcbiAgICB9LCB7c2NvcGU6IHtcbiAgICAgICRldmVudDogZSxcbiAgICAgIHJpZ2h0U2lkZU9mRXhwcmVzc2lvbjogYXNzaWdtZW50RnVuY3Rpb25cbiAgICB9fSk7XG4gIH0pO1xuICBpZiAoIWVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzKVxuICAgIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzID0ge307XG4gIGVsLl94X3JlbW92ZU1vZGVsTGlzdGVuZXJzW1wiZGVmYXVsdFwiXSA9IHJlbW92ZUxpc3RlbmVyO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF9yZW1vdmVNb2RlbExpc3RlbmVyc1tcImRlZmF1bHRcIl0oKSk7XG4gIGxldCBldmFsdWF0ZVNldE1vZGVsID0gZXZhbHVhdGVMYXRlcihlbCwgYCR7ZXhwcmVzc2lvbn0gPSBfX3BsYWNlaG9sZGVyYCk7XG4gIGVsLl94X21vZGVsID0ge1xuICAgIGdldCgpIHtcbiAgICAgIGxldCByZXN1bHQ7XG4gICAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiByZXN1bHQgPSB2YWx1ZSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gICAgc2V0KHZhbHVlKSB7XG4gICAgICBldmFsdWF0ZVNldE1vZGVsKCgpID0+IHtcbiAgICAgIH0sIHtzY29wZToge19fcGxhY2Vob2xkZXI6IHZhbHVlfX0pO1xuICAgIH1cbiAgfTtcbiAgZWwuX3hfZm9yY2VNb2RlbFVwZGF0ZSA9ICgpID0+IHtcbiAgICBldmFsdWF0ZTIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUgPT09IHZvaWQgMCAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSlcbiAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgd2luZG93LmZyb21Nb2RlbCA9IHRydWU7XG4gICAgICBtdXRhdGVEb20oKCkgPT4gYmluZChlbCwgXCJ2YWx1ZVwiLCB2YWx1ZSkpO1xuICAgICAgZGVsZXRlIHdpbmRvdy5mcm9tTW9kZWw7XG4gICAgfSk7XG4gIH07XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoXCJ1bmludHJ1c2l2ZVwiKSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZWwpKVxuICAgICAgcmV0dXJuO1xuICAgIGVsLl94X2ZvcmNlTW9kZWxVcGRhdGUoKTtcbiAgfSk7XG59KTtcbmZ1bmN0aW9uIGdlbmVyYXRlQXNzaWdubWVudEZ1bmN0aW9uKGVsLCBtb2RpZmllcnMsIGV4cHJlc3Npb24pIHtcbiAgaWYgKGVsLnR5cGUgPT09IFwicmFkaW9cIikge1xuICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBpZiAoIWVsLmhhc0F0dHJpYnV0ZShcIm5hbWVcIikpXG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgZXhwcmVzc2lvbik7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIChldmVudCwgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgcmV0dXJuIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBDdXN0b21FdmVudCAmJiBldmVudC5kZXRhaWwgIT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gZXZlbnQuZGV0YWlsIHx8IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoZWwudHlwZSA9PT0gXCJjaGVja2JveFwiKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikgPyBzYWZlUGFyc2VOdW1iZXIoZXZlbnQudGFyZ2V0LnZhbHVlKSA6IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyBjdXJyZW50VmFsdWUuY29uY2F0KFtuZXdWYWx1ZV0pIDogY3VycmVudFZhbHVlLmZpbHRlcigoZWwyKSA9PiAhY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUyKGVsMiwgbmV3VmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcInNlbGVjdFwiICYmIGVsLm11bHRpcGxlKSB7XG4gICAgICAgIHJldHVybiBtb2RpZmllcnMuaW5jbHVkZXMoXCJudW1iZXJcIikgPyBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5zZWxlY3RlZE9wdGlvbnMpLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgbGV0IHJhd1ZhbHVlID0gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICAgIHJldHVybiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpO1xuICAgICAgICB9KSA6IEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKChvcHRpb24pID0+IHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByYXdWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgcmV0dXJuIG1vZGlmaWVycy5pbmNsdWRlcyhcIm51bWJlclwiKSA/IHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSkgOiBtb2RpZmllcnMuaW5jbHVkZXMoXCJ0cmltXCIpID8gcmF3VmFsdWUudHJpbSgpIDogcmF3VmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5mdW5jdGlvbiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpIHtcbiAgbGV0IG51bWJlciA9IHJhd1ZhbHVlID8gcGFyc2VGbG9hdChyYXdWYWx1ZSkgOiBudWxsO1xuICByZXR1cm4gaXNOdW1lcmljMihudW1iZXIpID8gbnVtYmVyIDogcmF3VmFsdWU7XG59XG5mdW5jdGlvbiBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZTIodmFsdWVBLCB2YWx1ZUIpIHtcbiAgcmV0dXJuIHZhbHVlQSA9PSB2YWx1ZUI7XG59XG5mdW5jdGlvbiBpc051bWVyaWMyKHN1YmplY3QpIHtcbiAgcmV0dXJuICFBcnJheS5pc0FycmF5KHN1YmplY3QpICYmICFpc05hTihzdWJqZWN0KTtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1jbG9hay5qc1xuZGlyZWN0aXZlKFwiY2xvYWtcIiwgKGVsKSA9PiBxdWV1ZU1pY3JvdGFzaygoKSA9PiBtdXRhdGVEb20oKCkgPT4gZWwucmVtb3ZlQXR0cmlidXRlKHByZWZpeChcImNsb2FrXCIpKSkpKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1pbml0LmpzXG5hZGRJbml0U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImluaXRcIil9XWApO1xuZGlyZWN0aXZlKFwiaW5pdFwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7ZXhwcmVzc2lvbn0sIHtldmFsdWF0ZTogZXZhbHVhdGUyfSkgPT4ge1xuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gISFleHByZXNzaW9uLnRyaW0oKSAmJiBldmFsdWF0ZTIoZXhwcmVzc2lvbiwge30sIGZhbHNlKTtcbiAgfVxuICByZXR1cm4gZXZhbHVhdGUyKGV4cHJlc3Npb24sIHt9LCBmYWxzZSk7XG59KSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtdGV4dC5qc1xuZGlyZWN0aXZlKFwidGV4dFwiLCAoZWwsIHtleHByZXNzaW9ufSwge2VmZmVjdDogZWZmZWN0MywgZXZhbHVhdGVMYXRlcjogZXZhbHVhdGVMYXRlcjJ9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyMihleHByZXNzaW9uKTtcbiAgZWZmZWN0MygoKSA9PiB7XG4gICAgZXZhbHVhdGUyKCh2YWx1ZSkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWh0bWwuanNcbmRpcmVjdGl2ZShcImh0bWxcIiwgKGVsLCB7ZXhwcmVzc2lvbn0sIHtlZmZlY3Q6IGVmZmVjdDMsIGV2YWx1YXRlTGF0ZXI6IGV2YWx1YXRlTGF0ZXIyfSkgPT4ge1xuICBsZXQgZXZhbHVhdGUyID0gZXZhbHVhdGVMYXRlcjIoZXhwcmVzc2lvbik7XG4gIGVmZmVjdDMoKCkgPT4ge1xuICAgIGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICBlbC5feF9pZ25vcmVTZWxmID0gdHJ1ZTtcbiAgICAgICAgaW5pdFRyZWUoZWwpO1xuICAgICAgICBkZWxldGUgZWwuX3hfaWdub3JlU2VsZjtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWJpbmQuanNcbm1hcEF0dHJpYnV0ZXMoc3RhcnRpbmdXaXRoKFwiOlwiLCBpbnRvKHByZWZpeChcImJpbmQ6XCIpKSkpO1xuZGlyZWN0aXZlKFwiYmluZFwiLCAoZWwsIHt2YWx1ZSwgbW9kaWZpZXJzLCBleHByZXNzaW9uLCBvcmlnaW5hbH0sIHtlZmZlY3Q6IGVmZmVjdDN9KSA9PiB7XG4gIGlmICghdmFsdWUpIHtcbiAgICBsZXQgYmluZGluZ1Byb3ZpZGVycyA9IHt9O1xuICAgIGluamVjdEJpbmRpbmdQcm92aWRlcnMoYmluZGluZ1Byb3ZpZGVycyk7XG4gICAgbGV0IGdldEJpbmRpbmdzID0gZXZhbHVhdGVMYXRlcihlbCwgZXhwcmVzc2lvbik7XG4gICAgZ2V0QmluZGluZ3MoKGJpbmRpbmdzKSA9PiB7XG4gICAgICBhcHBseUJpbmRpbmdzT2JqZWN0KGVsLCBiaW5kaW5ncywgb3JpZ2luYWwpO1xuICAgIH0sIHtzY29wZTogYmluZGluZ1Byb3ZpZGVyc30pO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodmFsdWUgPT09IFwia2V5XCIpXG4gICAgcmV0dXJuIHN0b3JlS2V5Rm9yWEZvcihlbCwgZXhwcmVzc2lvbik7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgZWZmZWN0MygoKSA9PiBldmFsdWF0ZTIoKHJlc3VsdCkgPT4ge1xuICAgIGlmIChyZXN1bHQgPT09IHZvaWQgMCAmJiB0eXBlb2YgZXhwcmVzc2lvbiA9PT0gXCJzdHJpbmdcIiAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSkge1xuICAgICAgcmVzdWx0ID0gXCJcIjtcbiAgICB9XG4gICAgbXV0YXRlRG9tKCgpID0+IGJpbmQoZWwsIHZhbHVlLCByZXN1bHQsIG1vZGlmaWVycykpO1xuICB9KSk7XG59KTtcbmZ1bmN0aW9uIHN0b3JlS2V5Rm9yWEZvcihlbCwgZXhwcmVzc2lvbikge1xuICBlbC5feF9rZXlFeHByZXNzaW9uID0gZXhwcmVzc2lvbjtcbn1cblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1kYXRhLmpzXG5hZGRSb290U2VsZWN0b3IoKCkgPT4gYFske3ByZWZpeChcImRhdGFcIil9XWApO1xuZGlyZWN0aXZlKFwiZGF0YVwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7ZXhwcmVzc2lvbn0sIHtjbGVhbnVwOiBjbGVhbnVwMn0pID0+IHtcbiAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24gPT09IFwiXCIgPyBcInt9XCIgOiBleHByZXNzaW9uO1xuICBsZXQgbWFnaWNDb250ZXh0ID0ge307XG4gIGluamVjdE1hZ2ljcyhtYWdpY0NvbnRleHQsIGVsKTtcbiAgbGV0IGRhdGFQcm92aWRlckNvbnRleHQgPSB7fTtcbiAgaW5qZWN0RGF0YVByb3ZpZGVycyhkYXRhUHJvdmlkZXJDb250ZXh0LCBtYWdpY0NvbnRleHQpO1xuICBsZXQgZGF0YTIgPSBldmFsdWF0ZShlbCwgZXhwcmVzc2lvbiwge3Njb3BlOiBkYXRhUHJvdmlkZXJDb250ZXh0fSk7XG4gIGlmIChkYXRhMiA9PT0gdm9pZCAwKVxuICAgIGRhdGEyID0ge307XG4gIGluamVjdE1hZ2ljcyhkYXRhMiwgZWwpO1xuICBsZXQgcmVhY3RpdmVEYXRhID0gcmVhY3RpdmUoZGF0YTIpO1xuICBpbml0SW50ZXJjZXB0b3JzKHJlYWN0aXZlRGF0YSk7XG4gIGxldCB1bmRvID0gYWRkU2NvcGVUb05vZGUoZWwsIHJlYWN0aXZlRGF0YSk7XG4gIHJlYWN0aXZlRGF0YVtcImluaXRcIl0gJiYgZXZhbHVhdGUoZWwsIHJlYWN0aXZlRGF0YVtcImluaXRcIl0pO1xuICBjbGVhbnVwMigoKSA9PiB7XG4gICAgcmVhY3RpdmVEYXRhW1wiZGVzdHJveVwiXSAmJiBldmFsdWF0ZShlbCwgcmVhY3RpdmVEYXRhW1wiZGVzdHJveVwiXSk7XG4gICAgdW5kbygpO1xuICB9KTtcbn0pKTtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvc3JjL2RpcmVjdGl2ZXMveC1zaG93LmpzXG5kaXJlY3RpdmUoXCJzaG93XCIsIChlbCwge21vZGlmaWVycywgZXhwcmVzc2lvbn0sIHtlZmZlY3Q6IGVmZmVjdDN9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgaWYgKCFlbC5feF9kb0hpZGUpXG4gICAgZWwuX3hfZG9IaWRlID0gKCkgPT4ge1xuICAgICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgICAgZWwuc3R5bGUuc2V0UHJvcGVydHkoXCJkaXNwbGF5XCIsIFwibm9uZVwiLCBtb2RpZmllcnMuaW5jbHVkZXMoXCJpbXBvcnRhbnRcIikgPyBcImltcG9ydGFudFwiIDogdm9pZCAwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIGlmICghZWwuX3hfZG9TaG93KVxuICAgIGVsLl94X2RvU2hvdyA9ICgpID0+IHtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGlmIChlbC5zdHlsZS5sZW5ndGggPT09IDEgJiYgZWwuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbC5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIGxldCBoaWRlID0gKCkgPT4ge1xuICAgIGVsLl94X2RvSGlkZSgpO1xuICAgIGVsLl94X2lzU2hvd24gPSBmYWxzZTtcbiAgfTtcbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgZWwuX3hfZG9TaG93KCk7XG4gICAgZWwuX3hfaXNTaG93biA9IHRydWU7XG4gIH07XG4gIGxldCBjbGlja0F3YXlDb21wYXRpYmxlU2hvdyA9ICgpID0+IHNldFRpbWVvdXQoc2hvdyk7XG4gIGxldCB0b2dnbGUgPSBvbmNlKCh2YWx1ZSkgPT4gdmFsdWUgPyBzaG93KCkgOiBoaWRlKCksICh2YWx1ZSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZWwuX3hfdG9nZ2xlQW5kQ2FzY2FkZVdpdGhUcmFuc2l0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBlbC5feF90b2dnbGVBbmRDYXNjYWRlV2l0aFRyYW5zaXRpb25zKGVsLCB2YWx1ZSwgc2hvdywgaGlkZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID8gY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKSA6IGhpZGUoKTtcbiAgICB9XG4gIH0pO1xuICBsZXQgb2xkVmFsdWU7XG4gIGxldCBmaXJzdFRpbWUgPSB0cnVlO1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICBpZiAoIWZpcnN0VGltZSAmJiB2YWx1ZSA9PT0gb2xkVmFsdWUpXG4gICAgICByZXR1cm47XG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcyhcImltbWVkaWF0ZVwiKSlcbiAgICAgIHZhbHVlID8gY2xpY2tBd2F5Q29tcGF0aWJsZVNob3coKSA6IGhpZGUoKTtcbiAgICB0b2dnbGUodmFsdWUpO1xuICAgIG9sZFZhbHVlID0gdmFsdWU7XG4gICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gIH0pKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWZvci5qc1xuZGlyZWN0aXZlKFwiZm9yXCIsIChlbCwge2V4cHJlc3Npb259LCB7ZWZmZWN0OiBlZmZlY3QzLCBjbGVhbnVwOiBjbGVhbnVwMn0pID0+IHtcbiAgbGV0IGl0ZXJhdG9yTmFtZXMgPSBwYXJzZUZvckV4cHJlc3Npb24oZXhwcmVzc2lvbik7XG4gIGxldCBldmFsdWF0ZUl0ZW1zID0gZXZhbHVhdGVMYXRlcihlbCwgaXRlcmF0b3JOYW1lcy5pdGVtcyk7XG4gIGxldCBldmFsdWF0ZUtleSA9IGV2YWx1YXRlTGF0ZXIoZWwsIGVsLl94X2tleUV4cHJlc3Npb24gfHwgXCJpbmRleFwiKTtcbiAgZWwuX3hfcHJldktleXMgPSBbXTtcbiAgZWwuX3hfbG9va3VwID0ge307XG4gIGVmZmVjdDMoKCkgPT4gbG9vcChlbCwgaXRlcmF0b3JOYW1lcywgZXZhbHVhdGVJdGVtcywgZXZhbHVhdGVLZXkpKTtcbiAgY2xlYW51cDIoKCkgPT4ge1xuICAgIE9iamVjdC52YWx1ZXMoZWwuX3hfbG9va3VwKS5mb3JFYWNoKChlbDIpID0+IGVsMi5yZW1vdmUoKSk7XG4gICAgZGVsZXRlIGVsLl94X3ByZXZLZXlzO1xuICAgIGRlbGV0ZSBlbC5feF9sb29rdXA7XG4gIH0pO1xufSk7XG5mdW5jdGlvbiBsb29wKGVsLCBpdGVyYXRvck5hbWVzLCBldmFsdWF0ZUl0ZW1zLCBldmFsdWF0ZUtleSkge1xuICBsZXQgaXNPYmplY3QyID0gKGkpID0+IHR5cGVvZiBpID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGkpO1xuICBsZXQgdGVtcGxhdGVFbCA9IGVsO1xuICBldmFsdWF0ZUl0ZW1zKChpdGVtcykgPT4ge1xuICAgIGlmIChpc051bWVyaWMzKGl0ZW1zKSAmJiBpdGVtcyA+PSAwKSB7XG4gICAgICBpdGVtcyA9IEFycmF5LmZyb20oQXJyYXkoaXRlbXMpLmtleXMoKSwgKGkpID0+IGkgKyAxKTtcbiAgICB9XG4gICAgaWYgKGl0ZW1zID09PSB2b2lkIDApXG4gICAgICBpdGVtcyA9IFtdO1xuICAgIGxldCBsb29rdXAgPSBlbC5feF9sb29rdXA7XG4gICAgbGV0IHByZXZLZXlzID0gZWwuX3hfcHJldktleXM7XG4gICAgbGV0IHNjb3BlcyA9IFtdO1xuICAgIGxldCBrZXlzID0gW107XG4gICAgaWYgKGlzT2JqZWN0MihpdGVtcykpIHtcbiAgICAgIGl0ZW1zID0gT2JqZWN0LmVudHJpZXMoaXRlbXMpLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGxldCBzY29wZTIgPSBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCB2YWx1ZSwga2V5LCBpdGVtcyk7XG4gICAgICAgIGV2YWx1YXRlS2V5KCh2YWx1ZTIpID0+IGtleXMucHVzaCh2YWx1ZTIpLCB7c2NvcGU6IHtpbmRleDoga2V5LCAuLi5zY29wZTJ9fSk7XG4gICAgICAgIHNjb3Blcy5wdXNoKHNjb3BlMik7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc2NvcGUyID0gZ2V0SXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMoaXRlcmF0b3JOYW1lcywgaXRlbXNbaV0sIGksIGl0ZW1zKTtcbiAgICAgICAgZXZhbHVhdGVLZXkoKHZhbHVlKSA9PiBrZXlzLnB1c2godmFsdWUpLCB7c2NvcGU6IHtpbmRleDogaSwgLi4uc2NvcGUyfX0pO1xuICAgICAgICBzY29wZXMucHVzaChzY29wZTIpO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgYWRkcyA9IFtdO1xuICAgIGxldCBtb3ZlcyA9IFtdO1xuICAgIGxldCByZW1vdmVzID0gW107XG4gICAgbGV0IHNhbWVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2S2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGtleSA9IHByZXZLZXlzW2ldO1xuICAgICAgaWYgKGtleXMuaW5kZXhPZihrZXkpID09PSAtMSlcbiAgICAgICAgcmVtb3Zlcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHByZXZLZXlzID0gcHJldktleXMuZmlsdGVyKChrZXkpID0+ICFyZW1vdmVzLmluY2x1ZGVzKGtleSkpO1xuICAgIGxldCBsYXN0S2V5ID0gXCJ0ZW1wbGF0ZVwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGtleSA9IGtleXNbaV07XG4gICAgICBsZXQgcHJldkluZGV4ID0gcHJldktleXMuaW5kZXhPZihrZXkpO1xuICAgICAgaWYgKHByZXZJbmRleCA9PT0gLTEpIHtcbiAgICAgICAgcHJldktleXMuc3BsaWNlKGksIDAsIGtleSk7XG4gICAgICAgIGFkZHMucHVzaChbbGFzdEtleSwgaV0pO1xuICAgICAgfSBlbHNlIGlmIChwcmV2SW5kZXggIT09IGkpIHtcbiAgICAgICAgbGV0IGtleUluU3BvdCA9IHByZXZLZXlzLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgbGV0IGtleUZvclNwb3QgPSBwcmV2S2V5cy5zcGxpY2UocHJldkluZGV4IC0gMSwgMSlbMF07XG4gICAgICAgIHByZXZLZXlzLnNwbGljZShpLCAwLCBrZXlGb3JTcG90KTtcbiAgICAgICAgcHJldktleXMuc3BsaWNlKHByZXZJbmRleCwgMCwga2V5SW5TcG90KTtcbiAgICAgICAgbW92ZXMucHVzaChba2V5SW5TcG90LCBrZXlGb3JTcG90XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYW1lcy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgICBsYXN0S2V5ID0ga2V5O1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBrZXkgPSByZW1vdmVzW2ldO1xuICAgICAgaWYgKCEhbG9va3VwW2tleV0uX3hfZWZmZWN0cykge1xuICAgICAgICBsb29rdXBba2V5XS5feF9lZmZlY3RzLmZvckVhY2goZGVxdWV1ZUpvYik7XG4gICAgICB9XG4gICAgICBsb29rdXBba2V5XS5yZW1vdmUoKTtcbiAgICAgIGxvb2t1cFtrZXldID0gbnVsbDtcbiAgICAgIGRlbGV0ZSBsb29rdXBba2V5XTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb3Zlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IFtrZXlJblNwb3QsIGtleUZvclNwb3RdID0gbW92ZXNbaV07XG4gICAgICBsZXQgZWxJblNwb3QgPSBsb29rdXBba2V5SW5TcG90XTtcbiAgICAgIGxldCBlbEZvclNwb3QgPSBsb29rdXBba2V5Rm9yU3BvdF07XG4gICAgICBsZXQgbWFya2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGVsRm9yU3BvdC5hZnRlcihtYXJrZXIpO1xuICAgICAgICBlbEluU3BvdC5hZnRlcihlbEZvclNwb3QpO1xuICAgICAgICBlbEZvclNwb3QuX3hfY3VycmVudElmRWwgJiYgZWxGb3JTcG90LmFmdGVyKGVsRm9yU3BvdC5feF9jdXJyZW50SWZFbCk7XG4gICAgICAgIG1hcmtlci5iZWZvcmUoZWxJblNwb3QpO1xuICAgICAgICBlbEluU3BvdC5feF9jdXJyZW50SWZFbCAmJiBlbEluU3BvdC5hZnRlcihlbEluU3BvdC5feF9jdXJyZW50SWZFbCk7XG4gICAgICAgIG1hcmtlci5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgICAgcmVmcmVzaFNjb3BlKGVsRm9yU3BvdCwgc2NvcGVzW2tleXMuaW5kZXhPZihrZXlGb3JTcG90KV0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBbbGFzdEtleTIsIGluZGV4XSA9IGFkZHNbaV07XG4gICAgICBsZXQgbGFzdEVsID0gbGFzdEtleTIgPT09IFwidGVtcGxhdGVcIiA/IHRlbXBsYXRlRWwgOiBsb29rdXBbbGFzdEtleTJdO1xuICAgICAgaWYgKGxhc3RFbC5feF9jdXJyZW50SWZFbClcbiAgICAgICAgbGFzdEVsID0gbGFzdEVsLl94X2N1cnJlbnRJZkVsO1xuICAgICAgbGV0IHNjb3BlMiA9IHNjb3Blc1tpbmRleF07XG4gICAgICBsZXQga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBsZXQgY2xvbmUyID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZUVsLmNvbnRlbnQsIHRydWUpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgYWRkU2NvcGVUb05vZGUoY2xvbmUyLCByZWFjdGl2ZShzY29wZTIpLCB0ZW1wbGF0ZUVsKTtcbiAgICAgIG11dGF0ZURvbSgoKSA9PiB7XG4gICAgICAgIGxhc3RFbC5hZnRlcihjbG9uZTIpO1xuICAgICAgICBpbml0VHJlZShjbG9uZTIpO1xuICAgICAgfSk7XG4gICAgICBpZiAodHlwZW9mIGtleSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB3YXJuKFwieC1mb3Iga2V5IGNhbm5vdCBiZSBhbiBvYmplY3QsIGl0IG11c3QgYmUgYSBzdHJpbmcgb3IgYW4gaW50ZWdlclwiLCB0ZW1wbGF0ZUVsKTtcbiAgICAgIH1cbiAgICAgIGxvb2t1cFtrZXldID0gY2xvbmUyO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNhbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZWZyZXNoU2NvcGUobG9va3VwW3NhbWVzW2ldXSwgc2NvcGVzW2tleXMuaW5kZXhPZihzYW1lc1tpXSldKTtcbiAgICB9XG4gICAgdGVtcGxhdGVFbC5feF9wcmV2S2V5cyA9IGtleXM7XG4gIH0pO1xufVxuZnVuY3Rpb24gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcbiAgbGV0IGZvckl0ZXJhdG9yUkUgPSAvLChbXixcXH1cXF1dKikoPzosKFteLFxcfVxcXV0qKSk/JC87XG4gIGxldCBzdHJpcFBhcmVuc1JFID0gL15cXHMqXFwofFxcKVxccyokL2c7XG4gIGxldCBmb3JBbGlhc1JFID0gLyhbXFxzXFxTXSo/KVxccysoPzppbnxvZilcXHMrKFtcXHNcXFNdKikvO1xuICBsZXQgaW5NYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goZm9yQWxpYXNSRSk7XG4gIGlmICghaW5NYXRjaClcbiAgICByZXR1cm47XG4gIGxldCByZXMgPSB7fTtcbiAgcmVzLml0ZW1zID0gaW5NYXRjaFsyXS50cmltKCk7XG4gIGxldCBpdGVtID0gaW5NYXRjaFsxXS5yZXBsYWNlKHN0cmlwUGFyZW5zUkUsIFwiXCIpLnRyaW0oKTtcbiAgbGV0IGl0ZXJhdG9yTWF0Y2ggPSBpdGVtLm1hdGNoKGZvckl0ZXJhdG9yUkUpO1xuICBpZiAoaXRlcmF0b3JNYXRjaCkge1xuICAgIHJlcy5pdGVtID0gaXRlbS5yZXBsYWNlKGZvckl0ZXJhdG9yUkUsIFwiXCIpLnRyaW0oKTtcbiAgICByZXMuaW5kZXggPSBpdGVyYXRvck1hdGNoWzFdLnRyaW0oKTtcbiAgICBpZiAoaXRlcmF0b3JNYXRjaFsyXSkge1xuICAgICAgcmVzLmNvbGxlY3Rpb24gPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzLml0ZW0gPSBpdGVtO1xuICB9XG4gIHJldHVybiByZXM7XG59XG5mdW5jdGlvbiBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCBpdGVtLCBpbmRleCwgaXRlbXMpIHtcbiAgbGV0IHNjb3BlVmFyaWFibGVzID0ge307XG4gIGlmICgvXlxcWy4qXFxdJC8udGVzdChpdGVyYXRvck5hbWVzLml0ZW0pICYmIEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICBsZXQgbmFtZXMgPSBpdGVyYXRvck5hbWVzLml0ZW0ucmVwbGFjZShcIltcIiwgXCJcIikucmVwbGFjZShcIl1cIiwgXCJcIikuc3BsaXQoXCIsXCIpLm1hcCgoaSkgPT4gaS50cmltKCkpO1xuICAgIG5hbWVzLmZvckVhY2goKG5hbWUsIGkpID0+IHtcbiAgICAgIHNjb3BlVmFyaWFibGVzW25hbWVdID0gaXRlbVtpXTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmICgvXlxcey4qXFx9JC8udGVzdChpdGVyYXRvck5hbWVzLml0ZW0pICYmICFBcnJheS5pc0FycmF5KGl0ZW0pICYmIHR5cGVvZiBpdGVtID09PSBcIm9iamVjdFwiKSB7XG4gICAgbGV0IG5hbWVzID0gaXRlcmF0b3JOYW1lcy5pdGVtLnJlcGxhY2UoXCJ7XCIsIFwiXCIpLnJlcGxhY2UoXCJ9XCIsIFwiXCIpLnNwbGl0KFwiLFwiKS5tYXAoKGkpID0+IGkudHJpbSgpKTtcbiAgICBuYW1lcy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBzY29wZVZhcmlhYmxlc1tuYW1lXSA9IGl0ZW1bbmFtZV07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pdGVtXSA9IGl0ZW07XG4gIH1cbiAgaWYgKGl0ZXJhdG9yTmFtZXMuaW5kZXgpXG4gICAgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pbmRleF0gPSBpbmRleDtcbiAgaWYgKGl0ZXJhdG9yTmFtZXMuY29sbGVjdGlvbilcbiAgICBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb25dID0gaXRlbXM7XG4gIHJldHVybiBzY29wZVZhcmlhYmxlcztcbn1cbmZ1bmN0aW9uIGlzTnVtZXJpYzMoc3ViamVjdCkge1xuICByZXR1cm4gIUFycmF5LmlzQXJyYXkoc3ViamVjdCkgJiYgIWlzTmFOKHN1YmplY3QpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LXJlZi5qc1xuZnVuY3Rpb24gaGFuZGxlcjIoKSB7XG59XG5oYW5kbGVyMi5pbmxpbmUgPSAoZWwsIHtleHByZXNzaW9ufSwge2NsZWFudXA6IGNsZWFudXAyfSkgPT4ge1xuICBsZXQgcm9vdCA9IGNsb3Nlc3RSb290KGVsKTtcbiAgaWYgKCFyb290Ll94X3JlZnMpXG4gICAgcm9vdC5feF9yZWZzID0ge307XG4gIHJvb3QuX3hfcmVmc1tleHByZXNzaW9uXSA9IGVsO1xuICBjbGVhbnVwMigoKSA9PiBkZWxldGUgcm9vdC5feF9yZWZzW2V4cHJlc3Npb25dKTtcbn07XG5kaXJlY3RpdmUoXCJyZWZcIiwgaGFuZGxlcjIpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LWlmLmpzXG5kaXJlY3RpdmUoXCJpZlwiLCAoZWwsIHtleHByZXNzaW9ufSwge2VmZmVjdDogZWZmZWN0MywgY2xlYW51cDogY2xlYW51cDJ9KSA9PiB7XG4gIGxldCBldmFsdWF0ZTIgPSBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKTtcbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgaWYgKGVsLl94X2N1cnJlbnRJZkVsKVxuICAgICAgcmV0dXJuIGVsLl94X2N1cnJlbnRJZkVsO1xuICAgIGxldCBjbG9uZTIgPSBlbC5jb250ZW50LmNsb25lTm9kZSh0cnVlKS5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICBhZGRTY29wZVRvTm9kZShjbG9uZTIsIHt9LCBlbCk7XG4gICAgbXV0YXRlRG9tKCgpID0+IHtcbiAgICAgIGVsLmFmdGVyKGNsb25lMik7XG4gICAgICBpbml0VHJlZShjbG9uZTIpO1xuICAgIH0pO1xuICAgIGVsLl94X2N1cnJlbnRJZkVsID0gY2xvbmUyO1xuICAgIGVsLl94X3VuZG9JZiA9ICgpID0+IHtcbiAgICAgIHdhbGsoY2xvbmUyLCAobm9kZSkgPT4ge1xuICAgICAgICBpZiAoISFub2RlLl94X2VmZmVjdHMpIHtcbiAgICAgICAgICBub2RlLl94X2VmZmVjdHMuZm9yRWFjaChkZXF1ZXVlSm9iKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjbG9uZTIucmVtb3ZlKCk7XG4gICAgICBkZWxldGUgZWwuX3hfY3VycmVudElmRWw7XG4gICAgfTtcbiAgICByZXR1cm4gY2xvbmUyO1xuICB9O1xuICBsZXQgaGlkZSA9ICgpID0+IHtcbiAgICBpZiAoIWVsLl94X3VuZG9JZilcbiAgICAgIHJldHVybjtcbiAgICBlbC5feF91bmRvSWYoKTtcbiAgICBkZWxldGUgZWwuX3hfdW5kb0lmO1xuICB9O1xuICBlZmZlY3QzKCgpID0+IGV2YWx1YXRlMigodmFsdWUpID0+IHtcbiAgICB2YWx1ZSA/IHNob3coKSA6IGhpZGUoKTtcbiAgfSkpO1xuICBjbGVhbnVwMigoKSA9PiBlbC5feF91bmRvSWYgJiYgZWwuX3hfdW5kb0lmKCkpO1xufSk7XG5cbi8vIHBhY2thZ2VzL2FscGluZWpzL3NyYy9kaXJlY3RpdmVzL3gtaWQuanNcbmRpcmVjdGl2ZShcImlkXCIsIChlbCwge2V4cHJlc3Npb259LCB7ZXZhbHVhdGU6IGV2YWx1YXRlMn0pID0+IHtcbiAgbGV0IG5hbWVzID0gZXZhbHVhdGUyKGV4cHJlc3Npb24pO1xuICBuYW1lcy5mb3JFYWNoKChuYW1lKSA9PiBzZXRJZFJvb3QoZWwsIG5hbWUpKTtcbn0pO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy94LW9uLmpzXG5tYXBBdHRyaWJ1dGVzKHN0YXJ0aW5nV2l0aChcIkBcIiwgaW50byhwcmVmaXgoXCJvbjpcIikpKSk7XG5kaXJlY3RpdmUoXCJvblwiLCBza2lwRHVyaW5nQ2xvbmUoKGVsLCB7dmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbn0sIHtjbGVhbnVwOiBjbGVhbnVwMn0pID0+IHtcbiAgbGV0IGV2YWx1YXRlMiA9IGV4cHJlc3Npb24gPyBldmFsdWF0ZUxhdGVyKGVsLCBleHByZXNzaW9uKSA6ICgpID0+IHtcbiAgfTtcbiAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJ0ZW1wbGF0ZVwiKSB7XG4gICAgaWYgKCFlbC5feF9mb3J3YXJkRXZlbnRzKVxuICAgICAgZWwuX3hfZm9yd2FyZEV2ZW50cyA9IFtdO1xuICAgIGlmICghZWwuX3hfZm9yd2FyZEV2ZW50cy5pbmNsdWRlcyh2YWx1ZSkpXG4gICAgICBlbC5feF9mb3J3YXJkRXZlbnRzLnB1c2godmFsdWUpO1xuICB9XG4gIGxldCByZW1vdmVMaXN0ZW5lciA9IG9uKGVsLCB2YWx1ZSwgbW9kaWZpZXJzLCAoZSkgPT4ge1xuICAgIGV2YWx1YXRlMigoKSA9PiB7XG4gICAgfSwge3Njb3BlOiB7JGV2ZW50OiBlfSwgcGFyYW1zOiBbZV19KTtcbiAgfSk7XG4gIGNsZWFudXAyKCgpID0+IHJlbW92ZUxpc3RlbmVyKCkpO1xufSkpO1xuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvZGlyZWN0aXZlcy9pbmRleC5qc1xud2Fybk1pc3NpbmdQbHVnaW5EaXJlY3RpdmUoXCJDb2xsYXBzZVwiLCBcImNvbGxhcHNlXCIsIFwiY29sbGFwc2VcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIkludGVyc2VjdFwiLCBcImludGVyc2VjdFwiLCBcImludGVyc2VjdFwiKTtcbndhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKFwiRm9jdXNcIiwgXCJ0cmFwXCIsIFwiZm9jdXNcIik7XG53YXJuTWlzc2luZ1BsdWdpbkRpcmVjdGl2ZShcIk1hc2tcIiwgXCJtYXNrXCIsIFwibWFza1wiKTtcbmZ1bmN0aW9uIHdhcm5NaXNzaW5nUGx1Z2luRGlyZWN0aXZlKG5hbWUsIGRpcmVjdGl2ZU5hbWUyLCBzbHVnKSB7XG4gIGRpcmVjdGl2ZShkaXJlY3RpdmVOYW1lMiwgKGVsKSA9PiB3YXJuKGBZb3UgY2FuJ3QgdXNlIFt4LSR7ZGlyZWN0aXZlTmFtZTJ9XSB3aXRob3V0IGZpcnN0IGluc3RhbGxpbmcgdGhlIFwiJHtuYW1lfVwiIHBsdWdpbiBoZXJlOiBodHRwczovL2FscGluZWpzLmRldi9wbHVnaW5zLyR7c2x1Z31gLCBlbCkpO1xufVxuXG4vLyBwYWNrYWdlcy9hbHBpbmVqcy9zcmMvaW5kZXguanNcbmFscGluZV9kZWZhdWx0LnNldEV2YWx1YXRvcihub3JtYWxFdmFsdWF0b3IpO1xuYWxwaW5lX2RlZmF1bHQuc2V0UmVhY3Rpdml0eUVuZ2luZSh7cmVhY3RpdmU6IHJlYWN0aXZlMiwgZWZmZWN0OiBlZmZlY3QyLCByZWxlYXNlOiBzdG9wLCByYXc6IHRvUmF3fSk7XG52YXIgc3JjX2RlZmF1bHQgPSBhbHBpbmVfZGVmYXVsdDtcblxuLy8gcGFja2FnZXMvYWxwaW5lanMvYnVpbGRzL21vZHVsZS5qc1xudmFyIG1vZHVsZV9kZWZhdWx0ID0gc3JjX2RlZmF1bHQ7XG5leHBvcnQge1xuICBtb2R1bGVfZGVmYXVsdCBhcyBkZWZhdWx0XG59O1xuIiwiaW1wb3J0IEFscGluZSBmcm9tICdhbHBpbmVqcyc7XG5cbndpbmRvdy5BbHBpbmUgPSBBbHBpbmU7XG5BbHBpbmUuc3RhcnQoKTtcblxuY29uc29sZS5sb2coJ0hvbGEgc295IGxhcmF2ZWwgbWl4Jyk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiL2Fzc2V0cy9hcHBcIjogMCxcblx0XCJhc3NldHMvbWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzY2FsZGFzb25ub1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtzY2FsZGFzb25ub1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbl9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImFzc2V0cy9tYWluXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2pzL2FwcC5qc1wiKSkpXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcImFzc2V0cy9tYWluXCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3N0eWxlcy9tYWluLmNzc1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbIkFscGluZSIsIndpbmRvdyIsInN0YXJ0IiwiY29uc29sZSIsImxvZyJdLCJzb3VyY2VSb290IjoiIn0=