import "../css/popup.css";
import { markup, settingsMarkup, formWizard, welcomeForm, checkForEmptyKeyHelper} from "./htmlMarkup";

var contentScriptInjected;

//if(!window.contentScriptInjected){
//    contentScriptInjected = true; 


let clickedEl = null;
let currentTab = 0; // Current tab is set to be the first tab (0)
var tempArr=[]
var mappingDict = {}


function writeDataToLocalStorage(mappingDict){
	chrome.runtime.sendMessage({message: "logData", data:mappingDict}, function(response) {
		console.log("guess What !!!!!")
	});

}


function mappingDictHelper(Xpath){
	let returningList = []
	let changingIndex = Xpath.split("/").indexOf("@");
	let parentPath = Xpath.split("@")[0];
	let dynamicValue = Xpath.split("@")[1];
	returningList.push(parentPath);
	returningList.push(dynamicValue);
	returningList.push(changingIndex);
	return returningList;
}

function ultimateDifference(a1,a2){
	var notFoundVals = {};
	for (var i=0; i<a1.length; i++) {
		if (a1[i] != a2[i]) {
	  		notFoundVals[a1[i]] = i;
		} 
	}
	return notFoundVals
}


function getElementXPath(elt)
{
     var path = "";
     for (; elt && elt.nodeType == 1; elt = elt.parentNode)
     {
   var idx = getElementIdx(elt);
  var xname = elt.tagName;
  if (idx > 1) xname += "[" + idx + "]";
  path = "/" + xname + path;
     } 
     return path; 
}

function getElementIdx(elt)
{
    var count = 1;
    for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
    {
        if(sib.nodeType == 1 && sib.tagName == elt.tagName) count++
    }
    
    return count;
}


function checkForEmptyKey () {
  let onboardingData = JSON.parse(localStorage.getItem('onboardingData')) || {};
  let defaultJson = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  };
  let emptyKeyFound;
  for (let property1 in defaultJson) {
    if(!onboardingData[property1] || !onboardingData.hasOwnProperty(property1)) {
      emptyKeyFound = true;
      break;
    }
  }
  return emptyKeyFound;
}



function showSettingsMarkup() {
  let settingsButton = document.createElement('a');
  settingsButton.id = "settings";
  settingsButton.innerHTML = "Settings";
  let lightbox = document.getElementById('lightbox_extension');
  lightbox.appendChild(settingsButton);
  document.getElementById('settings').onclick = function() {
    // document.getElementById('settings').style.display = "none";
    let onboardingData = JSON.parse(localStorage.getItem('onboardingData'));
    console.log("0")
    console.log(onboardingData)
    document.getElementById('light_box_table').innerHTML = settingsMarkup(onboardingData);
  }
}


document.addEventListener("click", function(event) {
	chrome.runtime.sendMessage({message: "getTabId"}, function(response) {
    	var url = new URL(response.senderVal);
  		var domainName = url.hostname
  		mappingDict.url = domainName
    	var temp = chrome.storage.sync.get([String(response.TabId)], function(result) {
    		if (result[String(response.TabId)] === "1" && event.target.id !== "startOnboarding") {
    			console.log("click listener active!!!!");
	    		var a = document.getElementsByClassName('step active');
	  			var temp2 = chrome.storage.sync.get([String(domainName)], function(result) {
	  				var test2 = Object.values(result);
	  				if (test2.length > 0){
	  					var test = checkForEmptyKeyHelper(test2)
	  				}
	  				else{
	  					var test = checkForEmptyKeyHelper("{}")
	  				}
		    		if(test && (event.target.id !== "prevBtn" && event.target.id !== "nextBtn")) {
		    			console.log("freshClick")
		  				console.log(test);
		        		switch(currentTab) {
		        			case 0:
								var value = getElementXPath(event.toElement);
								console.log(value)
								tempArr.push(value)
								console.log(tempArr.length)
								
								if (tempArr.length >=2) {
									let matching1 = tempArr[1].split("/")
									let matching2 = tempArr[0].split("/")
									let tempVal = ultimateDifference(matching1, matching2);
									for (const [key, value] of Object.entries(tempVal)) {
									    let toBeReplacedIndex = (tempVal[key]);
									    matching1[toBeReplacedIndex] = "@"
									}
									var Xpath = matching1.join('/')
									tempArr = []          
									console.log(Xpath);
									mappingDict.firstName = mappingDictHelper(Xpath);
									console.log(mappingDict)
									currentTab = currentTab + 1
									writeDataToLocalStorage(mappingDict);
								}							
								break;
		        			case 1:
								var value = getElementXPath(event.toElement);
								console.log(value)
								tempArr.push(value)
								console.log(tempArr.length)
								if (tempArr.length >=2) {
									let matching1 = tempArr[1].split("/")
									let matching2 = tempArr[0].split("/")
									let tempVal = ultimateDifference(matching1, matching2);
									for (const [key, value] of Object.entries(tempVal)) {
									    let toBeReplacedIndex = (tempVal[key]);
									    matching1[toBeReplacedIndex] = "@"
									}
									var Xpath = matching1.join('/')
									tempArr = []
									console.log(Xpath);
									mappingDict.lastName = mappingDictHelper(Xpath);
									console.log(mappingDict)
									currentTab = currentTab + 1
									writeDataToLocalStorage(mappingDict);
								}
								break;
							case 2:
								var value = getElementXPath(event.toElement);
								console.log(value)
								tempArr.push(value)
								console.log(tempArr.length)
								if (tempArr.length >=2) {
									let matching1 = tempArr[1].split("/")
									let matching2 = tempArr[0].split("/")
									let tempVal = ultimateDifference(matching1, matching2);
									for (const [key, value] of Object.entries(tempVal)) {
									    let toBeReplacedIndex = (tempVal[key]);
									    matching1[toBeReplacedIndex] = "@"
									}
									var Xpath = matching1.join('/')
									tempArr = []
									console.log(Xpath);
									mappingDict.email = mappingDictHelper(Xpath);
									console.log(mappingDict)
									currentTab = currentTab + 1
									writeDataToLocalStorage(mappingDict);
								}
								break;
							case 3:
								var value = getElementXPath(event.toElement);
								console.log(value)
								tempArr.push(value)
								console.log(tempArr.length)
								if (tempArr.length >=2) {
									let matching1 = tempArr[1].split("/")
									let matching2 = tempArr[0].split("/")
									let tempVal = ultimateDifference(matching1, matching2);
									for (const [key, value] of Object.entries(tempVal)) {
									    let toBeReplacedIndex = (tempVal[key]);
									    matching1[toBeReplacedIndex] = "@"
									}
									var Xpath = matching1.join('/')
									tempArr = []

									console.log(Xpath);
									mappingDict.phone = mappingDictHelper(Xpath);
									console.log(mappingDict)
									currentTab = currentTab + 1
									writeDataToLocalStorage(mappingDict);
								}
								break;
		    
		        			default:
		          			// code block
		      			}
		      			//mappingDict.url = getHostname
		      			//writeDataToLocalStorage(mappingDict)
		      			//sessionStorage.setItem('settingsData', JSON.stringify(mappingDict));
		  			}

			  		else {
			  			//let value = getElementXPath(event.toElement);
			  			//chrome.runtime.sendMessage({message: "AllValuesFoundOnLocal", data:value, chromeStorageResult:test2}, function(response) {
			  			//	console.log("All values found case popup!!!!")
			  			//});
						
						let settingsTabFound = document.getElementById('settings');
			      		console.log("settingsTabFound--------->",settingsTabFound)
			      		//if(!settingsTabFound) {
			        	//	showSettingsMarkup();
			      		//}
			      		clickedEl = event.target.parentNode;
						value = getElementXPath(event.toElement);
						console.log(value);
						//chrome.runtime.sendMessage({message: "getData", data:mappingDict}, function(response) {
						//	console.log("sending control to check for append")
						//});
						var localValues = JSON.parse(test2);
						console.log(localValues);
			      		let tableConfig = {}
			      			for (const [key, value1] of Object.entries(localValues)) {
			        			switch (key) {
							          case 'firstName':
							            //tableConfig['first_name'] = item.innerText;
							            var fNameChangeIndex = localValues["firstName"][2]
							            console.log(value)
							            var operatingValue = value.split("/");
							            var dynamicVariable = operatingValue[fNameChangeIndex];
							            console.log(dynamicVariable);
							            console.log(key);
							            var fNameParentPath = localValues["firstName"][0].split("/");
							            fNameParentPath.push(dynamicVariable);
							            var fNameDynamicPart = localValues["firstName"][1].split("/");
							            fNameDynamicPart = fNameDynamicPart.filter(function(e){return e});
							            fNameParentPath.push(fNameDynamicPart);
							            fNameParentPath = fNameParentPath.filter(function(e){return e});
							            fNameParentPath = fNameParentPath.join("/");
							            console.log(fNameParentPath);
							            console.log(document.evaluate(fNameParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML);
							            tableConfig['first_name'] = (document.evaluate(fNameParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML).trim();
							            break;
							          case 'lastName':
							            //tableConfig['last_name'] = item.innerText;
							            var lNameChangeIndex = localValues["lastName"][2];
							            console.log(value)
							            var operatingValue = value.split("/");
							            var dynamicVariable = operatingValue[fNameChangeIndex];
							            console.log(dynamicVariable);
							            console.log(key);
							            var lNameParentPath = localValues["lastName"][0].split("/");
							            lNameParentPath.push(dynamicVariable);
							            var lNameDynamicPart = localValues["lastName"][1].split("/");
							            lNameDynamicPart = lNameDynamicPart.filter(function(e){return e});
							            lNameDynamicPart = lNameDynamicPart.join("/");
							            lNameParentPath.push(lNameDynamicPart);
							            lNameParentPath = lNameParentPath.filter(function(e){return e});
							            lNameParentPath = lNameParentPath.join("/");
							            console.log(lNameParentPath);
							            console.log(document.evaluate(lNameParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML);
							            tableConfig['last_name'] = (document.evaluate(lNameParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML).trim();
							            break;
							          case 'email':
							            //let email = item.getElementsByClassName("contact_info");
							            //tableConfig['email'] = email && email.length && email[0].title;
							            var emailChangeIndex = localValues["email"][2];
							            console.log(value)
							            var operatingValue = value.split("/");
							            var dynamicVariable = operatingValue[fNameChangeIndex];
							            console.log(dynamicVariable);
							            console.log(key);
							            var emailParentPath = localValues["email"][0].split("/");
							            emailParentPath.push(dynamicVariable);
							            var emailDynamicPart = localValues["email"][1].split("/");
							            emailDynamicPart = emailDynamicPart.filter(function(e){return e});
							            emailDynamicPart = emailDynamicPart.join("/");
							            emailParentPath.push(emailDynamicPart);
							            emailParentPath = emailParentPath.filter(function(e){return e});
							            emailParentPath = emailParentPath.join("/");
							            console.log(emailParentPath);
							            console.log(document.evaluate(emailParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML);
							            tableConfig['email'] = (document.evaluate(emailParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML).trim();
							            break;
							          case 'phone':
							            //tableConfig['phone'] = item.innerText;
							            var phoneChangeIndex = localValues["phone"][2];
							            console.log(value)
							            var operatingValue = value.split("/");
							            var dynamicVariable = operatingValue[fNameChangeIndex];
							            console.log(dynamicVariable);
							            console.log(key);
							            var phoneParentPath = localValues["phone"][0].split("/");
							            phoneParentPath.push(dynamicVariable);
							            var phoneDynamicPart = localValues["phone"][1].split("/");
							            phoneDynamicPart = phoneDynamicPart.filter(function(e){return e});
							            phoneDynamicPart = phoneDynamicPart.join("/");  
							            phoneParentPath.push(phoneDynamicPart);
							            phoneParentPath = phoneParentPath.filter(function(e){return e});
							            phoneParentPath = phoneParentPath.join("/");
							            console.log(phoneParentPath);
							            console.log(document.evaluate(phoneParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML);
							            tableConfig['phone'] = (document.evaluate(phoneParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML).trim();
							            break;						        
				        		}
			    			}
			    		console.log("final stage !!!!")
			    		console.log(tableConfig)
					    chrome.runtime.sendMessage({message: "AllValuesFoundOnLocal", data:tableConfig}, function(response) {
			  				console.log("All values found case popup!!!!")
			  			});
					}
				})
  			}
		})
	});
}, true);


