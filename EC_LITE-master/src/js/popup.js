import "../css/popup.css";
import { markup, settingsMarkup, formWizard, welcomeForm} from "./htmlMarkup";

var contentScriptInjected;

//if(!window.contentScriptInjected){
//    contentScriptInjected = true; 
if (sessionStorage.getItem('testingFlag') === null){
    sessionStorage.setItem('testingFlag', '1')

let clickedEl = null;
let currentTab = 0; // Current tab is set to be the first tab (0)
var tempArr=[]
var mappingDict = {}

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
  for (var i=0; i<a1.length; i++){
    if (a1[i] != a2[i]){
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
    appId: "",
    clientId: ""
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

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
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

const closeScriptureLightbox = function() {
  sessionStorage.removeItem("testingFlag"); 
  var lb = document.getElementById('lightbox_background');
  lb.parentNode.removeChild( lb );
}

function doApiCall() {
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // request payload
  let jsonBody = {};
  var http = new XMLHttpRequest();
  var url = 'https://qa2-ms-api.mpulsemobile.com/accounts/1095/members';
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
  if(userInfo.appMemberId) {
    memberObj.member['appmemberid'] = userInfo.appMemberId;
  }
  if(userInfo.clientMemId) {
    memberObj.member['clientmemberid'] = userInfo.clientMemId;
  }
  jsonBody.body = memberObj;
  jsonBody.body.listid = "4607";
  http.open('PUT', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('X-Ms-Format', 'json');
  http.setRequestHeader('X-Ms-Source', 'api');
  http.setRequestHeader('X-Ms-Audience-Update', 'upsert');
  http.setRequestHeader('X-Ms-Force-Subscribe-Member', 'true')
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  // Handle basic auth and set in headers
  let userCredentials = "sanjeev-appmail:egRu%WKLN9S8w7!2";
  let basicAuth = "Basic " + btoa(userCredentials);
  http.setRequestHeader ("Authorization", basicAuth);

  //Call a function when the state changes.
  http.onreadystatechange = function() {
    let element = document.getElementById("result-div");  
    if(http.readyState == 4 && http.status == 200) {
        element.innerText = "Successfully added";
      } else {
        element.innerText = "Something went wrong!!!";
      }
  }
  http.send(JSON.stringify(jsonBody));
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let elementFound = document.getElementById('lightbox_extension');
    if ( request.action == "startLightbox" && !elementFound) {
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
        let emptyKeyFound = checkForEmptyKey();
        if(emptyKeyFound) {
          document.getElementById('light_box_table').innerHTML = welcomeForm();
          document.getElementById('startOnboarding').onclick = function() {
            wrapped();
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
                      return false;
                    }
                    // Otherwise, display the correct tab:
                    showTab(currentTab);
                });
            }
            localStorage.setItem("stratFlag", "1")
          }
        } else {
          // Show settings icon.
          console.log("pndy")
          wrapped();
          showSettingsMarkup();
        }
        sendResponse({farewell: "goodbye"});
    }
});



function wrapped(){
document.addEventListener("click", function(event) {
  var a = document.getElementsByClassName('step active');
  let emptyKeyFound = checkForEmptyKey();
  console.log(emptyKeyFound)
  console.log(event.target.id);
  if(emptyKeyFound && event.target.id !== "prevBtn" && event.target.id !== "nextBtn") {
        switch(currentTab) {
        case 0:
          var value = getElementXPath(event.toElement);
          console.log(value)
          tempArr.push(value)
          console.log(tempArr.length)
          if (tempArr.length >=2){
            let matching1 = tempArr[1].split("/")
            let matching2 = tempArr[0].split("/")
            let tempVal = ultimateDifference(matching1, matching2);
            for (const [key, value] of Object.entries(tempVal)) {
                let toBeReplacedIndex = (tempVal[key]);
                matching1[toBeReplacedIndex] = "@"
          }
          var Xpath = matching1.join('/')
          let currentTabScreen = document.getElementsByClassName("tab");
          let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
          currentInput[0].setAttribute("value",Xpath);
          tempArr = []
          }
          console.log(Xpath);
          mappingDict.firstName = mappingDictHelper(Xpath);
          console.log(mappingDict)
          break;
        case 1:
          var value = getElementXPath(event.toElement);
          console.log(value)
          tempArr.push(value)
          console.log(tempArr.length)
          if (tempArr.length >=2){
            let matching1 = tempArr[1].split("/")
            let matching2 = tempArr[0].split("/")
            let tempVal = ultimateDifference(matching1, matching2);
            for (const [key, value] of Object.entries(tempVal)) {
                let toBeReplacedIndex = (tempVal[key]);
                matching1[toBeReplacedIndex] = "@"
          }
          var Xpath = matching1.join('/')
          let currentTabScreen = document.getElementsByClassName("tab");
          let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
          currentInput[0].setAttribute("value",Xpath);
          tempArr = []
          }
          console.log(Xpath);
          mappingDict.lastName = mappingDictHelper(Xpath);
          console.log(mappingDict)
          break;
        case 2:
          var value = getElementXPath(event.toElement);
          console.log(value)
          tempArr.push(value)
          console.log(tempArr.length)
          if (tempArr.length >=2){
            let matching1 = tempArr[1].split("/")
            let matching2 = tempArr[0].split("/")
            let tempVal = ultimateDifference(matching1, matching2);
            for (const [key, value] of Object.entries(tempVal)) {
                let toBeReplacedIndex = (tempVal[key]);
                matching1[toBeReplacedIndex] = "@"
          }
          var Xpath = matching1.join('/')
          let currentTabScreen = document.getElementsByClassName("tab");
          let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
          currentInput[0].setAttribute("value",Xpath);
          tempArr = []
          }
          console.log(Xpath);
          mappingDict.email = mappingDictHelper(Xpath);
          console.log(mappingDict)
          break;
        case 3:
          var value = getElementXPath(event.toElement);
          console.log(value)
          tempArr.push(value)
          console.log(tempArr.length)
          if (tempArr.length >=2){
            let matching1 = tempArr[1].split("/")
            let matching2 = tempArr[0].split("/")
            let tempVal = ultimateDifference(matching1, matching2);
            for (const [key, value] of Object.entries(tempVal)) {
                let toBeReplacedIndex = (tempVal[key]);
                matching1[toBeReplacedIndex] = "@"
          }
          var Xpath = matching1.join('/')
          let currentTabScreen = document.getElementsByClassName("tab");
          let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
          currentInput[0].setAttribute("value",Xpath);
          tempArr = []
          }
          console.log(Xpath);
          mappingDict.phone = mappingDictHelper(Xpath);
          console.log(mappingDict)
          break;
        case 4:
          var value = getElementXPath(event.toElement);
          console.log(value)
          tempArr.push(value)
          console.log(tempArr.length)
          if (tempArr.length >=2){
            let matching1 = tempArr[1].split("/")
            let matching2 = tempArr[0].split("/")
            let tempVal = ultimateDifference(matching1, matching2);
            for (const [key, value] of Object.entries(tempVal)) {
                let toBeReplacedIndex = (tempVal[key]);
                matching1[toBeReplacedIndex] = "@"
          }
          var Xpath = matching1.join('/')
          let currentTabScreen = document.getElementsByClassName("tab");
          let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
          currentInput[0].setAttribute("value",Xpath);
          tempArr = []
          }
          console.log(Xpath);
          mappingDict.appId = mappingDictHelper(Xpath);
          console.log(mappingDict)
          break;
        case 5:
          var value = getElementXPath(event.toElement);
          console.log(value)
          tempArr.push(value)
          console.log(tempArr.length)
          if (tempArr.length >=2){
            let matching1 = tempArr[1].split("/")
            let matching2 = tempArr[0].split("/")
            let tempVal = ultimateDifference(matching1, matching2);
            for (const [key, value] of Object.entries(tempVal)) {
                let toBeReplacedIndex = (tempVal[key]);
                matching1[toBeReplacedIndex] = "@"
          }
          var Xpath = matching1.join('/')
          let currentTabScreen = document.getElementsByClassName("tab");
          let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
          currentInput[0].setAttribute("value",Xpath);
          tempArr = []
          }
          console.log(Xpath);
          mappingDict.clientId = mappingDictHelper(Xpath);
          console.log(mappingDict)
          break;
        default:
          // code block
      }
      sessionStorage.setItem('settingsData', JSON.stringify(mappingDict));
   // }
  } else {
      let settingsTabFound = document.getElementById('settings');
      console.log("settingsTabFound--------->",settingsTabFound)
      if(!settingsTabFound) {
        showSettingsMarkup();
      }
      clickedEl = event.target.parentNode;
      console.log("shvng")
      value = getElementXPath(event.toElement);
      console.log(value);
      var localValues = JSON.parse(localStorage.getItem('onboardingData'));
      console.log(localValues);
      //let element = clickedEl;
      //let cells = element && element.cells || element.children;
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
            tableConfig['first_name'] = document.evaluate(fNameParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
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
            tableConfig['last_name'] = document.evaluate(lNameParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
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
            tableConfig['email'] = document.evaluate(emailParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML
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
            tableConfig['phone'] = document.evaluate(phoneParentPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerHTML;
            break;
          case 'appId':
            //tableConfig['clientMemId'] = item.innerText;
            console.log(key);
            break;
          case 'clientId':
            //tableConfig['appMemberId'] = item.innerText;
            console.log(key);
            break;
        }
    }
    var target = event.target;
      document.getElementById('light_box_table').innerHTML = markup(tableConfig) || "";
      localStorage.setItem('userInfo', JSON.stringify(tableConfig));
      let sendButton = document.getElementById('send-details');
      if(sendButton) {
       sendButton.onclick = function() {
         doApiCall();
       }
          }
  }
}, true);
}
}

window.onload = function() {
  sessionStorage.removeItem("testingFlag"); 
}