"use strict";

let jsonData;
let jsonList = "http://petlatkea.dk/2019/hogwarts/students.json";
let allStudents = new Array();
let Student = new Object(); //{name: "-student-name-",lastname: "-student-lastname-",house: "-student-house-"

let firstnameBtn = document.querySelector("#firstnameBtn");
let lastnameBtn = document.querySelector("#lastnameBtn");
let slytherinBtn = document.querySelector("#slytherinBtn");
let hufflepuffBtn = document.querySelector("#hufflepuffBtn");
let ravenclawBtn = document.querySelector("#ravenclawBtn");
let gryffindorBtn = document.querySelector("#gryffindorBtn");
let allHousesBtn = document.querySelector("#allHousesBtn");

let slytherinPressed = false;
let hufflepuffPressed = false;
let gryffindorPressed = false;
let ravenclawPressed = false;
let allHousesPressed = false;
let namePressed = false;
let lastnamePressed = false;

window.addEventListener("DOMContentLoaded", init);

function init() {
  loadJSON();
}

function loadJSON() {
  fetch(jsonList)
    .then(response => response.json())
    .then(myJson => {
      prepareObjects(myJson);
    });
}

function prepareObjects(jsonData) {
  //console.log(jsonData);
  jsonData.forEach(jsonObject => {
    //create new object
    const student = Object.create(Student);

    //get data from json
    const parts = jsonObject.fullname.split(" ");
    student.name = parts[0];
    student.lastname = parts[1];
    student.house = jsonObject.house;

    //store student in gloabal array
    allStudents.push(student);
    //console.table(allStudents);
  });

  firstnameBtn.addEventListener("click", sortNames);
  lastnameBtn.addEventListener("click", sortLastnames);
  slytherinBtn.addEventListener("click", filterSlytherins);
  hufflepuffBtn.addEventListener("click", filterHufflepuffs);
  ravenclawBtn.addEventListener("click", filterRavenclaws);
  gryffindorBtn.addEventListener("click", filterGryffindors);
  allHousesBtn.addEventListener("click", filterAllHouses);

  filterList();
}

function filterList() {
  let filteredList = allStudents;
  displayList(filteredList);

  if (slytherinPressed === true) {
    filteredList = allStudents.filter(onlySlytherin);
    if (namePressed === true) {
      //clear list
      filteredList.sort(nameSort);
    } else if (lastnamePressed === true) {
      filteredList.sort(lastnameSort);
    }
  } else if (hufflepuffPressed === true) {
    filteredList = allStudents.filter(onlyHufflepuff);
    if (namePressed === true) {
      filteredList.sort(nameSort);
    } else if (lastnamePressed === true) {
      filteredList.sort(lastnameSort);
    }
  } else if (gryffindorPressed === true) {
    filteredList = allStudents.filter(onlyGryffindor);
    if (namePressed === true) {
      filteredList.sort(nameSort);
    } else if (lastnamePressed === true) {
      filteredList.sort(lastnameSort);
    }
  } else if (ravenclawPressed === true) {
    filteredList = allStudents.filter(onlyRavenclaw);
    if (namePressed === true) {
      filteredList.sort(nameSort);
    } else if (lastnamePressed === true) {
      filteredList.sort(lastnameSort);
    }
  } else if (allHousesPressed === true) {
    filteredList = allStudents;˚
    if (namePressed === true) {
      filteredList.sort(nameSort);
    } else if (lastnamePressed === true) {
      filteredList.sort(lastnameSort);
    }
  } else {
    if (namePressed === true) {
      filteredList.sort(nameSort);
    } else if (lastnamePressed === true) {
      filteredList.sort(lastnameSort);
    }
  }

  console.table(filteredList);
  displayList(filteredList);
}

function lastnameSort(a, b) {
  //"ape" < "cat" true, weil es alphabetisch zuerst kommt
  if (a.lastname < b.lastname) {
    return -1;
  } else {
    return 1;
  }
}

function filterSlytherins() {
  slytherinPressed = true;
  filterList();
}

function filterAllHouses() {
  allHousesPressed = true;
  filterList();
}

function filterHufflepuffs() {
  hufflepuffPressed = true;
  filterList();
}

function filterGryffindors() {
  gryffindorPressed = true;
  filterList();
}
function filterRavenclaws() {
  ravenclawPressed = true;
  filterList();
}

function sortNames() {
  namePressed = true;
  filterList();
}

function sortLastnames() {
  lastnamePressed = true;
  filterList();
}

function onlySlytherin(student) {
  return student.house === "Slytherin";
}

function onlyHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function onlyGryffindor(student) {
  return student.house === "Gryffindor";
}

function onlyRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function displayList(list) {
  //clear list

  //build new list
  list.forEach(displayStudent);
}

function displayStudent(student) {
  //Create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  //Set clone data

  clone.querySelector("[data-field=name]").textContent = student.name;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//selber weil sort() bei objekten im array nicht funktioniert
function nameSort(a, b) {
  //"ape" < "cat" true, weil es alphabetisch zuerst kommt
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
}

//showModal
function showModal(student) {
  console.log("popup");
  //let modal = document.createElement("div");
  //let studentpotrait = document.createElement("image");
  //modal.appendChild(studentpotrait);
  //studentpotrait.src=""
  //let title = document.create("p");
  //p.textContent = student.firstname + student.lastname;
  //studentpotrait.appenChild(title);
  //if (stundent.house == ".."){
  //modal.style.backgroundColor = "red";
  //}
}

//splice zum removen bei expellen
