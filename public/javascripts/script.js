// const { response } = require("../../app");
// https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production

const greenButton = document.getElementById("submitBtn");
const redButton = document.getElementById("clearBtn");
const form = document.getElementById("kitchen");
const select = document.getElementById("inside");
var kitchen;

greenButton.addEventListener("click", greenBtn);
redButton.addEventListener("click", redBtn);
select.addEventListener("change", setLocalStorage);
document.getElementById("occupied").addEventListener("change", onOccupiedChange);
document.getElementById("refresh").addEventListener("click", getKitchenData);

if (localStorage.getItem("inside")){
  select.value = localStorage.getItem("inside");
}


function getKitchenData(){
  fetch("/kitchen").then(function (response){
    return response.json();
  }).then(function (json) {
    kitchen = json[0];
    document.getElementById("occupied").value = kitchen.occupied;
    setStatus();
    onOccupiedChange();
  }).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
  }).then(() =>{
    document.getElementById("insideKitchenName").classList.add("updating");
    setTimeout(() => {
      document.getElementById("insideKitchenName").classList.remove("updating");
    }, 400);
  });
}

function setLocalStorage() {
  localStorage.setItem("inside", select.value);
}

function setStatus() {
  if (document.getElementById("occupied").value == "true"){
    let name = kitchen.inside;
    document.getElementById("insideKitchenName").innerHTML = name.charAt(0).toUpperCase() + name.slice(1);
  } else{
    document.getElementById("insideKitchenName").innerHTML = "No one"
  }
}

function submitForm() {
  let formData = new FormData(form);
  fetch("/kitchen", {
    method: "put",
    body: formData,
    credentials: "same-origin",
  });
  // .catch((error) => console.error("Error:", error))
  // .then((response) => console.log("Success:", JSON.stringify(response)));
}

function onOccupiedChange() {
  let occupied = (document.getElementById("occupied").value == "true");
  select.disabled = occupied;
  greenButton.disabled = occupied;
  redButton.disabled = !occupied;
  setStatus();
}

function greenBtn() {
  document.getElementById("occupied").value = true;
  kitchen.inside = select.value;
  submitForm();
  onOccupiedChange();
}

function redBtn() {
  document.getElementById("occupied").value = false;
  onOccupiedChange();
  submitForm();
}

getKitchenData();

setInterval(() => {
  getKitchenData();
}, 20000);


// // -------------------------------- NOTIFICATIONS

// function checkIfNotificationsAvailable() {
//   if (!('serviceWorker' in navigator)) { 
//     // Service Worker isn't supported on this browser, disable or hide UI.
//     console.log("no serviceworker"); 
//     return false; 
//   }
  
//   if (!('PushManager' in window)) { 
//     // Push isn't supported on this browser, disable or hide UI. 
//     console.log("no PushManager"); 
//     return false; 
//   }
// }

// function showNotification() {
//   const text = "Take a look at this brand new t-shirt!";
//   const title = "New Product Available";
//   const options = {
//       body: text,
//       vibrate: [200, 100, 200],
//       tag: "new-product",
//       badge: "https://spyna.it/icons/android-icon-192x192.png",
//       actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
//   };

//   navigator.serviceWorker.ready.then(function(serviceWorker) {
//     serviceWorker.showNotification(title, options);
//   });
// }
