const form = document.getElementById("form");
const select = document.getElementById("person");
const addBtn = document.getElementById("addBtn");
const table = document.getElementById("productList");

select.addEventListener("change", setLocalStorage);
addBtn.addEventListener("click", submitForm);
document.getElementById("deleteAll").addEventListener("click", deleteAll);
document.getElementById("refresh").addEventListener("click", getShoppingList);

var shoppingList = new Array();
document.getElementById("product").select();


if (localStorage.getItem("person")){
  select.value = localStorage.getItem("person");
  document.getElementById("personNameCell").innerHTML = select.value.charAt(0).toUpperCase() + select.value.slice(1);
}

function getShoppingList(){
  fetch("shoppinglist/getall").then(function (response){
    return response.json();
  }).then(function (json) {
    for (let i = 0; i < shoppingList.length; i++){
      table.deleteRow(2);
    }
    json.forEach((listItem) => {
      addToTable(listItem);
    });
    shoppingList = json;
  }).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
  });
}

function addToTable(listItem) {
  // Create an empty <tr> element and add it to the last position of the table:
  var row = table.insertRow(2);
  // Insert new cells (<td> elements)
  row.insertCell(0).innerHTML = listItem.product;
  row.insertCell(1).innerHTML = listItem.person.charAt(0).toUpperCase() + listItem.person.slice(1);
  row.insertCell(2).innerHTML = listItem.quantity;
  row.insertCell(3).innerHTML = "\u00D7";
  row.cells[3].classList.add("close");
  row.cells[3].addEventListener("click", (e) => {
    deleteItem(listItem);
    let arrIndex = row.cells[3].parentElement.rowIndex-2;
    shoppingList.splice(arrIndex, 1);
    table.deleteRow(row.cells[3].parentElement.rowIndex);
  });
}

function deleteItem(listItem) {
  fetch("/shoppinglist", {
    method: "DELETE",
    body: JSON.stringify(listItem),
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(function (response){
    return response.json();
  }).then(function (json) {
    // delete all from table
  }).catch(function(err) {
    console.log('Delete problem: ' + err.message);
  });
}

function isNumberKey(evt){
  var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
  return true;
}

function setLocalStorage() {
  document.getElementById("personNameCell").innerHTML = select.value.charAt(0).toUpperCase() + select.value.slice(1);
  localStorage.setItem("person", select.value);
}

function submitForm() {
  let formData = new FormData(form);
  fetch("/shoppinglist", {
    method: "post",
    body: formData,
    credentials: "same-origin",
  }).then(function (response){
    return response.json();
  }).then(function (json) {
    shoppingList.unshift(json);
    addToTable(json);
    document.getElementById("product").focus();
    document.getElementById("product").select();
  }).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
  });
}

function deleteAll() {
  fetch("/shoppinglist/deleteall", {
    method: "DELETE",
  }).then(function () {
    // delete all from table
    for (let i = 0; i < shoppingList.length; i++){
      table.deleteRow(2);
    }
    shoppingList = new Array();
  }).catch(function(err) {
    console.log('Fetch problem: ' + err.message);
  });
}

document.getElementById("product").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("quantity").focus();
    document.getElementById("quantity").select();
  }
});

document.getElementById("quantity").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    addBtn.click();
  }
});

getShoppingList();
setInterval(() => {
  getShoppingList();
}, 20000);
