function doApiCall() {
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  // request payload
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
  if(userInfo.appMemberId) {
    memberObj.member['appmemberid'] = userInfo.appMemberId;
  }
  if(userInfo.clientMemId) {
    memberObj.member['clientmemberid'] = userInfo.clientMemId;
  }
  console.log(memberObj)
  jsonBody.body = memberObj;
  http.open('PUT', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('X-Ms-Format', 'json');
  http.setRequestHeader('X-Ms-Source', 'api');
  http.setRequestHeader('X-Ms-Audience-Update', 'upsert');
  http.setRequestHeader('X-Ms-Force-Subscribe-Member', 'true')
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  // Handle basic auth and set in headers
  let userCredentials = "shivang:Un8GMl&T$bqnXtiH";
  let basicAuth = "Basic " + btoa(userCredentials);
  http.setRequestHeader ("Authorization", basicAuth);
  console.log(jsonBody)
  console.log(http)

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