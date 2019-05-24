import "../css/popup.css";
import { markup, settingsMarkup, formWizard,  welcomeForm, checkForEmptyKeyHelper} from "./htmlMarkup";
let currentTab = 0; // Current tab is set to be the first tab (0)

chrome.runtime.sendMessage({message: "chromeStorageDelete"}, function(response) {
	console.log("URLCheck triggered")
	console.log(response);
});


function doApiCall(hostname, tableConfig) {
  //let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log("Get th")
  // request payload
  //let tempValue = chrome.storage.sync.get([String(hostname)], function(result) {
	console.log("This is it !!!!!!!");
	//console.log(result)
	//var justChecking = Object.values(result)
	//console.log(justChecking)
	//console.log(JSON.parse(justChecking))
	let userInfo = tableConfig
  let jsonBody = {};
  var http = new XMLHttpRequest();
  var url = 'https://qa2-ms-api.mpulsemobile.com/accounts/1004/members';
  let memberObj = {member: {}};
  if(userInfo.phone) {
    memberObj.member['mobilephone'] = userInfo.phone;
  }
  if(userInfo.last_name) {
    memberObj.member['lastname'] = userInfo.last_name;
  }
  if(userInfo.email) {
    memberObj.member['email'] = userInfo.email;
  }
  if(userInfo.first_name) {
    memberObj.member['firstname'] = userInfo.first_name;
  }
  //if(userInfo.appMemberId) {
  //  memberObj.member['appmemberid'] = userInfo.appMemberId;
 // }
 // if(userInfo.clientMemId) {
 //   memberObj.member['clientmemberid'] = userInfo.clientMemId;
 // }
  console.log("Final value to punch on server !!!")
  console.log(memberObj)
  jsonBody.body = memberObj;
  http.open('PUT', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('cache-control', 'no-cache');
  http.setRequestHeader('X-Ms-Format', 'json');
  http.setRequestHeader('X-Ms-Source', 'api');
  http.setRequestHeader('X-Ms-Audience-Update', 'upsert');
  http.setRequestHeader('x-ms-ignore-error-for-existing-members', 'true');
  //x-ms-ignore-error-for-existing-members
  //http.setRequestHeader('X-Ms-Force-Subscribe-Member', 'true')
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  // Handle basic auth and set in headers
  let userCredentials = "shivang:Un8GMl&T$bqnXtiH";
  let basicAuth = "Basic " + btoa(userCredentials);
  http.setRequestHeader ("Authorization", basicAuth);

  //Call a function when the state changes.
  http.onreadystatechange = function() {
    let element = document.getElementById("result-div");
    console.log("look for this response");
    console.log(http.response)  
    if(http.readyState == 4 && http.status == 200) {
        element.innerText = "Successfully added";
      } else {
        element.innerText = "Something went wrong!!!";
      }
  }
  http.send(JSON.stringify(jsonBody));
  //});
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
		document.getElementById('light_box_table').innerHTML = settingsMarkup(onboardingData);
	}
}


function activateClickFunction(){
    chrome.runtime.sendMessage({message: "chromeStorageSet"}, function(response) {
    	console.log("URLCheck set called")
    	console.log(response);
	});
}


function validateForm() {
   	// This function deals with validation of the form fields
	var x, y, i, valid = true;
	x = document.getElementsByClassName("tab");
	y = x[currentTab].getElementsByTagName("input");
  	// A loop that checks every input field in the current tab:
	for (i = 0; i < y.length; i++) {
    	// If a field is empty...
    	if (y[i].value == "") {
      		// add an "invalid" class to the field:
			y[i].className += " invalid";
      		// and set the current valid status to false
      		valid = false;
    	}
	}
  // If the valid status is true, mark the step as finished and valid:
	if (valid) {
		document.getElementsByClassName("step")[currentTab].className += " finish";
	}
  	return valid; // return the valid status
}



function fixStepIndicator(n) {
	// This function removes the "active" class of all steps...
	var i, x = document.getElementsByClassName("step");
	for (i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(" active", "");
  	}
	//... and adds the "active" class on the current step:
  	x[n].className += " active";
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


const closeScriptureLightbox = function() {
  	sessionStorage.removeItem("testingFlag"); 
  	var lb = document.getElementById('lightbox_background');
  	lb.parentNode.removeChild( lb );
  	chrome.runtime.sendMessage({message: "chromeStorageDelete"}, function(response) {
		console.log("URLCheck triggered")
		console.log(response);
	});
}


function showTab(n) {
  // This function will display the specified tab of the form...
  	var x = document.getElementsByClassName("tab");
  	x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  	if (n == 0) {
    	document.getElementById("prevBtn").style.display = "none";
  	}
  	else {
    	document.getElementById("prevBtn").style.display = "inline";
  	}
  	if (n == (x.length - 1)) {
    	document.getElementById("nextBtn").innerHTML = "Submit";
  	}
  	else {
    	document.getElementById("nextBtn").innerHTML = "Next";
  	}
  //... and run a function that will display the correct step indicator:
  	fixStepIndicator(n)
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let elementFound = document.getElementById('lightbox_extension');
    if ( request.action == "startLightbox" && !elementFound) {
    	console.log(request.tabUrl)
    	let urlValue = new URL(request.tabUrl);
  		let domainName = urlValue.hostname
  		console.log(domainName)
        // Reinitialize current tab;
        currentTab = 0;
        let background = document.createElement('div');
        background.id = "lightbox_background";
        let lightbox = document.createElement('div');
        lightbox.id = "lightbox_extension";
        document.body.appendChild(background);
        background.appendChild( lightbox );
        let anchor = document.createElement('a');
        anchor.id = "close";
        anchor.innerHTML = '&times';
        anchor.onclick=closeScriptureLightbox;
        lightbox.appendChild(anchor);
        let table = document.createElement('div');
        table.id = "light_box_table";
        lightbox.appendChild(table);
        // if onboarding done.
        // Check boarding json in local storage to determine if boarding page needs to show.
        // othewise show boarding page
        var checkVar = chrome.storage.sync.get([String(domainName)], function(result) {
			var test2 = Object.values(result);
			if (test2.length > 0){
				var test = checkForEmptyKeyHelper(test2)
			}
			else{
				var test = checkForEmptyKeyHelper("{}")
			}
			if(test) {
	          	document.getElementById('light_box_table').innerHTML = welcomeForm();
	          	document.getElementById('startOnboarding').onclick = function() {
	            activateClickFunction();
	           	document.getElementById('light_box_table').innerHTML = formWizard();
	            showTab(currentTab);
	            var deleteLink = document.querySelectorAll('.goToStep');
	            console.log(deleteLink);
	            for (var i = 0; i < deleteLink.length; i++) {
	                deleteLink[i].addEventListener('click', function(event) {
	                    let n;
	                    if(event.target.id === "nextBtn") {
	                    	n = 1;
	                    } else {
	                    	n = -1;
	                    }
	                    // This function will figure out which tab to display
	                    var x = document.getElementsByClassName("tab");
	                    // Exit the function if any field in the current tab is invalid:
	                    if (n == 1 && !validateForm()) return false;
	                    // Hide the current tab:
	                    x[currentTab].style.display = "none";
	                    // Increase or decrease the current tab by 1:
	                    currentTab = currentTab + n;
	                    // if you have reached the end of the form...
	                    if (currentTab >= x.length) {
	                      // ... the form gets submitted:
	                    	let sessionData = sessionStorage.getItem('settingsData');
	                    	localStorage.setItem('onboardingData',sessionData);
	                    	document.getElementById('prevBtn').style.display="none";
	                    	document.getElementById("nextBtn").style.display="none";
	                    	document.getElementById("steps").style.display ="none";
	                    	showSettingsMarkup();
	                    	document.getElementById('light_box_table').innerHTML = `<div style="text-align:center;padding: 19%;">Your onboarding is complete &#127773;. Now you can start seeing rows here.</div>`;
	                    	var hostname = JSON.parse(sessionData);
	                    	hostname = hostname.url
	                    	chrome.storage.sync.set({[hostname]: sessionData}, function(){
								console.log("Mapping on chrome storage")
							});
	                      return false;
	                    }
	                    // Otherwise, display the correct tab:
	                    showTab(currentTab);
	                });
	            }
            localStorage.setItem("stratFlag", "1")
          }
        }
        });
        let emptyKeyFound = checkForEmptyKey();
        activateClickFunction();
        showSettingsMarkup(); 
        sendResponse({farewell: "goodbye"});
    }
    else if (request.action == "logData") {
    	if (sessionStorage.getItem('settingsData') === null){
    		console.log("Session storage found null !!!!");
    		sessionStorage.setItem('settingsData', JSON.stringify(request.data));	
    	}
    	else{
    		sessionStorage.setItem('settingsData', JSON.stringify(request.data))
    	}
    	let currentTabScreen = document.getElementsByClassName("tab");
		let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
		currentInput[0].setAttribute("value","Captured");
    }
    else if (request.action == "getData"){
    	console.log(request.clickedEl);
    }
    else if (request.action == "AllValuesFoundOnLocal"){
    	console.log(request.data);
    	var tabUrl = new URL(request.tabUrl)
    	let hostname = tabUrl.hostname
    	let tableConfig = request.data
    	let settingsTabFound = document.getElementById('settings');
		if(!settingsTabFound) {
			showSettingsMarkup();
		}
    	document.getElementById('light_box_table').innerHTML = markup(request.data) || "";
		localStorage.setItem('userInfo', JSON.stringify(request.data));
		let sendButton = document.getElementById('send-details');
		if(sendButton){
			sendButton.onclick = function() {
		 		doApiCall(hostname, tableConfig);
			}
		}    	
    }
});





//chrome.storage.sync.get(function(result){console.log(result)})