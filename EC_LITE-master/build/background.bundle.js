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

eval("chrome.runtime.onInstalled.addListener(function() {\n    chrome.contextMenus.create({\n        \"title\": \"View in EC lite\",\n         \"contexts\":[\"page\",\"browser_action\"],\n         \"id\": \"ViewInLightbox\"\n    });\n});\n\n\n//function contextClicked(info, tab) {\n//  if (info.menuItemId == \"ViewInLightbox\" ) {\n //   alert(\"This got executed surprising!!!!\")\n//        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {\n//            chrome.tabs.sendMessage(tabs[0].id, {\"action\": \"startLightbox\"});\n//        });\n//    }\n//};\n\n\n//Instruct Chrome to launch a particular function when context menu items are clicked.\n//chrome.contextMenus.onClicked.addListener(contextClicked);\n// Open popup on click of chrome extension icon\n\n\n\nfunction removeChromeStorageFlag(tabId) {\n\tconsole.log(\"upto here\")\n\tchrome.storage.sync.remove([String(tabId)], function(){\n\t\tconsole.log(\"ChromeStoreDeleted\");\n\t});\n\treturn true\n}\n\nfunction setChromeStorage(tabsId) {\n\tchrome.storage.sync.set({[tabsId]: \"1\"}, function(){\n\t\tconsole.log(\"Storgae flag set!!!!\")\n\t});\n\treturn true\n}\n\nconsole.log(\"cliked\")\nchrome.browserAction.onClicked.addListener(function() {\n    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {\n    \tconsole.log(\"**********************************\") \n    \tconsole.log(tabs[0].id);\n    \t//removeChromeStorageFlag(tabs[0].id);\n        chrome.tabs.sendMessage(tabs[0].id, {\"action\": \"startLightbox\", \"tabUrl\": tabs[0].url});\n    });\n});\n\n\n\nchrome.runtime.onMessage.addListener(\n\tfunction(request, sender, sendResponse) {\n  \t//alert(document.getElementById('lightbox_background'))\n\t    console.log(\"first hit\");\n\t    if (request.message == \"chromeStorageSet\"){\n\t    \tconsole.log(\"chrome Storage Set Called !!!\")\n\t      \tchrome.tabs.query({active: true, currentWindow: true}, function(tabs) {\n\t        \t\t\t//\tchrome.tabs.sendMessage(tabs[0].id, {\"action\": \"byebye\"});    # Look this for reference\n\t    \t\tfuncCal = setChromeStorage(tabs[0].id);\n\t    \t});\n\t\t} \n\t\telse if(request.message == \"chromeStorageDelete\") {\n\t\t\tconsole.log(\"chrome Storage Remove Called !!!\")\n\t\t\tchrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {\n\t\t\t\tconsole.log(tabs[0].id)\n\t  \t\t\tuncCal = removeChromeStorageFlag(tabs[0].id)\n\t\t\t});\n\t\t}\n\t\telse if(request.message == \"getTabId\") {\n\t\t\tconsole.log(\"Get Tab Id Called !!!\")\n\t\t    console.log(sender);\n\t\t    console.log(sender.tab.id);\n\t\t\tsendResponse({\"TabId\": sender.tab.id, \"senderVal\":sender.tab.url});\t\n\t\t}\n\t\telse if(request.message == \"logData\") {\n\t\t\tconsole.log(\"Check this!!!!!\")\n\t\t\tconsole.log(request.data)\n\t\t\tmappingDict = request.data\n\t\t\tchrome.tabs.sendMessage(sender.tab.id, {\"action\": \"logData\", data: mappingDict})\n\t\t}\n\t\telse if(request.message == \"getData\") {\n\t\t\tconsole.log(\"Request to get data from localStorage\");\n\t\t\tlet clickedEl = request.clickedEl\n\t\t\tchrome.tabs.sendMessage(sender.tab.id, {\"action\": \"getData\", clickedEl: clickedEl})\n\t\t}\n\t\telse if(request.message == \"AllValuesFoundOnLocal\"){\n\t\t\tconsole.log(\"All values found block background\");\n\t\t\tconsole.log(request.data);\n\t\t\tlet tableConfig = request.data;\n\t\t\tchrome.tabs.sendMessage(sender.tab.id, {\"action\": \"AllValuesFoundOnLocal\", data:tableConfig, tabUrl:sender.tab.url})\n\t\t}\n\t\tsendResponse({farewell: \"goodbye\"})\n});\n\n\n\nvar checkLocalStorage = function(){\n\tlocalStorage.setItem(\"bleh\", \"11\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvanMvYmFja2dyb3VuZC5qcy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9qcy9iYWNrZ3JvdW5kLmpzPzgxMDQiXSwic291cmNlc0NvbnRlbnQiOlsiY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24oKSB7XG4gICAgY2hyb21lLmNvbnRleHRNZW51cy5jcmVhdGUoe1xuICAgICAgICBcInRpdGxlXCI6IFwiVmlldyBpbiBFQyBsaXRlXCIsXG4gICAgICAgICBcImNvbnRleHRzXCI6W1wicGFnZVwiLFwiYnJvd3Nlcl9hY3Rpb25cIl0sXG4gICAgICAgICBcImlkXCI6IFwiVmlld0luTGlnaHRib3hcIlxuICAgIH0pO1xufSk7XG5cblxuLy9mdW5jdGlvbiBjb250ZXh0Q2xpY2tlZChpbmZvLCB0YWIpIHtcbi8vICBpZiAoaW5mby5tZW51SXRlbUlkID09IFwiVmlld0luTGlnaHRib3hcIiApIHtcbiAvLyAgIGFsZXJ0KFwiVGhpcyBnb3QgZXhlY3V0ZWQgc3VycHJpc2luZyEhISFcIilcbi8vICAgICAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgZnVuY3Rpb24odGFicykge1xuLy8gICAgICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCB7XCJhY3Rpb25cIjogXCJzdGFydExpZ2h0Ym94XCJ9KTtcbi8vICAgICAgICB9KTtcbi8vICAgIH1cbi8vfTtcblxuXG4vL0luc3RydWN0IENocm9tZSB0byBsYXVuY2ggYSBwYXJ0aWN1bGFyIGZ1bmN0aW9uIHdoZW4gY29udGV4dCBtZW51IGl0ZW1zIGFyZSBjbGlja2VkLlxuLy9jaHJvbWUuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihjb250ZXh0Q2xpY2tlZCk7XG4vLyBPcGVuIHBvcHVwIG9uIGNsaWNrIG9mIGNocm9tZSBleHRlbnNpb24gaWNvblxuXG5cblxuZnVuY3Rpb24gcmVtb3ZlQ2hyb21lU3RvcmFnZUZsYWcodGFiSWQpIHtcblx0Y29uc29sZS5sb2coXCJ1cHRvIGhlcmVcIilcblx0Y2hyb21lLnN0b3JhZ2Uuc3luYy5yZW1vdmUoW1N0cmluZyh0YWJJZCldLCBmdW5jdGlvbigpe1xuXHRcdGNvbnNvbGUubG9nKFwiQ2hyb21lU3RvcmVEZWxldGVkXCIpO1xuXHR9KTtcblx0cmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gc2V0Q2hyb21lU3RvcmFnZSh0YWJzSWQpIHtcblx0Y2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoe1t0YWJzSWRdOiBcIjFcIn0sIGZ1bmN0aW9uKCl7XG5cdFx0Y29uc29sZS5sb2coXCJTdG9yZ2FlIGZsYWcgc2V0ISEhIVwiKVxuXHR9KTtcblx0cmV0dXJuIHRydWVcbn1cblxuY29uc29sZS5sb2coXCJjbGlrZWRcIilcbmNocm9tZS5icm93c2VyQWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbigpIHtcbiAgICBjaHJvbWUudGFicy5xdWVyeSh7YWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlfSwgZnVuY3Rpb24odGFicykge1xuICAgIFx0Y29uc29sZS5sb2coXCIqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXCIpIFxuICAgIFx0Y29uc29sZS5sb2codGFic1swXS5pZCk7XG4gICAgXHQvL3JlbW92ZUNocm9tZVN0b3JhZ2VGbGFnKHRhYnNbMF0uaWQpO1xuICAgICAgICBjaHJvbWUudGFicy5zZW5kTWVzc2FnZSh0YWJzWzBdLmlkLCB7XCJhY3Rpb25cIjogXCJzdGFydExpZ2h0Ym94XCIsIFwidGFiVXJsXCI6IHRhYnNbMF0udXJsfSk7XG4gICAgfSk7XG59KTtcblxuXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihcblx0ZnVuY3Rpb24ocmVxdWVzdCwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgXHQvL2FsZXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaWdodGJveF9iYWNrZ3JvdW5kJykpXG5cdCAgICBjb25zb2xlLmxvZyhcImZpcnN0IGhpdFwiKTtcblx0ICAgIGlmIChyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJjaHJvbWVTdG9yYWdlU2V0XCIpe1xuXHQgICAgXHRjb25zb2xlLmxvZyhcImNocm9tZSBTdG9yYWdlIFNldCBDYWxsZWQgISEhXCIpXG5cdCAgICAgIFx0Y2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sIGZ1bmN0aW9uKHRhYnMpIHtcblx0ICAgICAgICBcdFx0XHQvL1x0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwge1wiYWN0aW9uXCI6IFwiYnllYnllXCJ9KTsgICAgIyBMb29rIHRoaXMgZm9yIHJlZmVyZW5jZVxuXHQgICAgXHRcdGZ1bmNDYWwgPSBzZXRDaHJvbWVTdG9yYWdlKHRhYnNbMF0uaWQpO1xuXHQgICAgXHR9KTtcblx0XHR9IFxuXHRcdGVsc2UgaWYocmVxdWVzdC5tZXNzYWdlID09IFwiY2hyb21lU3RvcmFnZURlbGV0ZVwiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNocm9tZSBTdG9yYWdlIFJlbW92ZSBDYWxsZWQgISEhXCIpXG5cdFx0XHRjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZSB9LCBhc3luYyBmdW5jdGlvbiAodGFicykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyh0YWJzWzBdLmlkKVxuXHQgIFx0XHRcdHVuY0NhbCA9IHJlbW92ZUNocm9tZVN0b3JhZ2VGbGFnKHRhYnNbMF0uaWQpXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0ZWxzZSBpZihyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJnZXRUYWJJZFwiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIkdldCBUYWIgSWQgQ2FsbGVkICEhIVwiKVxuXHRcdCAgICBjb25zb2xlLmxvZyhzZW5kZXIpO1xuXHRcdCAgICBjb25zb2xlLmxvZyhzZW5kZXIudGFiLmlkKTtcblx0XHRcdHNlbmRSZXNwb25zZSh7XCJUYWJJZFwiOiBzZW5kZXIudGFiLmlkLCBcInNlbmRlclZhbFwiOnNlbmRlci50YWIudXJsfSk7XHRcblx0XHR9XG5cdFx0ZWxzZSBpZihyZXF1ZXN0Lm1lc3NhZ2UgPT0gXCJsb2dEYXRhXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiQ2hlY2sgdGhpcyEhISEhXCIpXG5cdFx0XHRjb25zb2xlLmxvZyhyZXF1ZXN0LmRhdGEpXG5cdFx0XHRtYXBwaW5nRGljdCA9IHJlcXVlc3QuZGF0YVxuXHRcdFx0Y2hyb21lLnRhYnMuc2VuZE1lc3NhZ2Uoc2VuZGVyLnRhYi5pZCwge1wiYWN0aW9uXCI6IFwibG9nRGF0YVwiLCBkYXRhOiBtYXBwaW5nRGljdH0pXG5cdFx0fVxuXHRcdGVsc2UgaWYocmVxdWVzdC5tZXNzYWdlID09IFwiZ2V0RGF0YVwiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlJlcXVlc3QgdG8gZ2V0IGRhdGEgZnJvbSBsb2NhbFN0b3JhZ2VcIik7XG5cdFx0XHRsZXQgY2xpY2tlZEVsID0gcmVxdWVzdC5jbGlja2VkRWxcblx0XHRcdGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHNlbmRlci50YWIuaWQsIHtcImFjdGlvblwiOiBcImdldERhdGFcIiwgY2xpY2tlZEVsOiBjbGlja2VkRWx9KVxuXHRcdH1cblx0XHRlbHNlIGlmKHJlcXVlc3QubWVzc2FnZSA9PSBcIkFsbFZhbHVlc0ZvdW5kT25Mb2NhbFwiKXtcblx0XHRcdGNvbnNvbGUubG9nKFwiQWxsIHZhbHVlcyBmb3VuZCBibG9jayBiYWNrZ3JvdW5kXCIpO1xuXHRcdFx0Y29uc29sZS5sb2cocmVxdWVzdC5kYXRhKTtcblx0XHRcdGxldCB0YWJsZUNvbmZpZyA9IHJlcXVlc3QuZGF0YTtcblx0XHRcdGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHNlbmRlci50YWIuaWQsIHtcImFjdGlvblwiOiBcIkFsbFZhbHVlc0ZvdW5kT25Mb2NhbFwiLCBkYXRhOnRhYmxlQ29uZmlnLCB0YWJVcmw6c2VuZGVyLnRhYi51cmx9KVxuXHRcdH1cblx0XHRzZW5kUmVzcG9uc2Uoe2ZhcmV3ZWxsOiBcImdvb2RieWVcIn0pXG59KTtcblxuXG5cbnZhciBjaGVja0xvY2FsU3RvcmFnZSA9IGZ1bmN0aW9uKCl7XG5cdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYmxlaFwiLCBcIjExXCIpO1xufVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/js/background.js\n");

/***/ })

/******/ });