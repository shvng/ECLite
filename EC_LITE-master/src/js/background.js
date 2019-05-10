chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "View in EC lite",
         "contexts":["page","browser_action"],
         "id": "ViewInLightbox"
    });
});


//function contextClicked(info, tab) {
//  if (info.menuItemId == "ViewInLightbox" ) {
 //   alert("This got executed surprising!!!!")
//        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//            chrome.tabs.sendMessage(tabs[0].id, {"action": "startLightbox"});
//        });
//    }
//};


//Instruct Chrome to launch a particular function when context menu items are clicked.
//chrome.contextMenus.onClicked.addListener(contextClicked);
// Open popup on click of chrome extension icon
console.log("cliked")
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	console.log("**********************************")
    	debugger;
        chrome.tabs.sendMessage(tabs[0].id, {"action": "startLightbox"});
    });
});

chrome.tabs.executeScript({
  tabId: tabs[0].id,
  file: "content.js"
});