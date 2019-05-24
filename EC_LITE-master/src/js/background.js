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



function removeChromeStorageFlag(tabId) {
	console.log("upto here")
	chrome.storage.sync.remove([String(tabId)], function(){
		console.log("ChromeStoreDeleted");
	});
	return true
}

function setChromeStorage(tabsId) {
	chrome.storage.sync.set({[tabsId]: "1"}, function(){
		console.log("Storgae flag set!!!!")
	});
	return true
}

console.log("cliked")
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	console.log("**********************************") 
    	console.log(tabs[0].id);
    	//removeChromeStorageFlag(tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {"action": "startLightbox", "tabUrl": tabs[0].url});
    });
});



chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
  	//alert(document.getElementById('lightbox_background'))
	    console.log("first hit");
	    if (request.message == "chromeStorageSet"){
	    	console.log("chrome Storage Set Called !!!")
	      	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	        			//	chrome.tabs.sendMessage(tabs[0].id, {"action": "byebye"});    # Look this for reference
	    		funcCal = setChromeStorage(tabs[0].id);
	    	});
		} 
		else if(request.message == "chromeStorageDelete") {
			console.log("chrome Storage Remove Called !!!")
			chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
				console.log(tabs[0].id)
	  			uncCal = removeChromeStorageFlag(tabs[0].id)
			});
		}
		else if(request.message == "getTabId") {
			console.log("Get Tab Id Called !!!")
		    console.log(sender);
		    console.log(sender.tab.id);
			sendResponse({"TabId": sender.tab.id, "senderVal":sender.tab.url});	
		}
		else if(request.message == "logData") {
			console.log("Check this!!!!!")
			console.log(request.data)
			mappingDict = request.data
			chrome.tabs.sendMessage(sender.tab.id, {"action": "logData", data: mappingDict})
		}
		else if(request.message == "getData") {
			console.log("Request to get data from localStorage");
			let clickedEl = request.clickedEl
			chrome.tabs.sendMessage(sender.tab.id, {"action": "getData", clickedEl: clickedEl})
		}
		else if(request.message == "AllValuesFoundOnLocal"){
			console.log("All values found block background");
			console.log(request.data);
			let tableConfig = request.data;
			chrome.tabs.sendMessage(sender.tab.id, {"action": "AllValuesFoundOnLocal", data:tableConfig, tabUrl:sender.tab.url})
		}
		sendResponse({farewell: "goodbye"})
});



var checkLocalStorage = function(){
	localStorage.setItem("bleh", "11");
}
