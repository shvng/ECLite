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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/background.js":
/*!******************************!*\
  !*** ./src/js/background.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("chrome.runtime.onInstalled.addListener(function() {\n    chrome.contextMenus.create({\n        \"title\": \"View in EC lite\",\n         \"contexts\":[\"page\",\"browser_action\"],\n         \"id\": \"ViewInLightbox\"\n    });\n});\n\n\n//function contextClicked(info, tab) {\n//  if (info.menuItemId == \"ViewInLightbox\" ) {\n //   alert(\"This got executed surprising!!!!\")\n//        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {\n//            chrome.tabs.sendMessage(tabs[0].id, {\"action\": \"startLightbox\"});\n//        });\n//    }\n//};\n\n\n//Instruct Chrome to launch a particular function when context menu items are clicked.\n//chrome.contextMenus.onClicked.addListener(contextClicked);\n// Open popup on click of chrome extension icon\nconsole.log(\"cliked\")\nchrome.browserAction.onClicked.addListener(function() {\n    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {\n    \tconsole.log(\"**********************************\")\n    \tdebugger;\n        chrome.tabs.sendMessage(tabs[0].id, {\"action\": \"startLightbox\"});\n    });\n});\n\nchrome.tabs.executeScript({\n  tabId: tabs[0].id,\n  file: \"content.js\"\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvYmFja2dyb3VuZC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9iYWNrZ3JvdW5kLmpzPzgxMDQiXSwic291cmNlc0NvbnRlbnQiOlsiY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24oKSB7XG4gICAgY2hyb21lLmNvbnRleHRNZW51cy5jcmVhdGUoe1xuICAgICAgICBcInRpdGxlXCI6IFwiVmlldyBpbiBFQyBsaXRlXCIsXG4gICAgICAgICBcImNvbnRleHRzXCI6W1wicGFnZVwiLFwiYnJvd3Nlcl9hY3Rpb25cIl0sXG4gICAgICAgICBcImlkXCI6IFwiVmlld0luTGlnaHRib3hcIlxuICAgIH0pO1xufSk7XG5cblxuLy9mdW5jdGlvbiBjb250ZXh0Q2xpY2tlZChpbmZvLCB0YWIpIHtcbi8vICBpZiAoaW5mby5tZW51SXRlbUlkID09IFwiVmlld0luTGlnaHRib3hcIiApIHtcbiAvLyAgIGFsZXJ0KFwiVGhpcyBnb3QgZXhlY3V0ZWQgc3VycHJpc2luZyEhISFcIilcbi8vICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgZnVuY3Rpb24odGFicykge1xuLy8gICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCB7XCJhY3Rpb25cIjogXCJzdGFydExpZ2h0Ym94XCJ9KTtcbi8vICAgICAgICB9KTtcbi8vICAgIH1cbi8vfTtcblxuXG4vL0luc3RydWN0IENocm9tZSB0byBsYXVuY2ggYSBwYXJ0aWN1bGFyIGZ1bmN0aW9uIHdoZW4gY29udGV4dCBtZW51IGl0ZW1zIGFyZSBjbGlja2VkLlxuLy9jaHJvbWUuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihjb250ZXh0Q2xpY2tlZCk7XG4vLyBPcGVuIHBvcHVwIG9uIGNsaWNrIG9mIGNocm9tZSBleHRlbnNpb24gaWNvblxuY29uc29sZS5sb2coXCJjbGlrZWRcIilcbmNocm9tZS5icm93c2VyQWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbigpIHtcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgZnVuY3Rpb24odGFicykge1xuICAgIFx0Y29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpXG4gICAgXHRkZWJ1Z2dlcjtcbiAgICAgICAgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwge1wiYWN0aW9uXCI6IFwic3RhcnRMaWdodGJveFwifSk7XG4gICAgfSk7XG59KTtcblxuY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh7XG4gIHRhYklkOiB0YWJzWzBdLmlkLFxuICBmaWxlOiBcImNvbnRlbnQuanNcIlxufSk7Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/js/background.js\n");

/***/ })

/******/ });