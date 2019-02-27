"use strict";

let jsonData;
let jsonList = "http://petlatkea.dk/2019/hogwarts/students.json";
let allStudents = new Array();
let Student = new Object(); //{name: "-student-name-",lastname: "-student-lastname-",house: "-student-house-"

let btnFirstname = document.querySelector("#firstname");
let btnLastname = document.querySelector("#lastname");
let btnSlytherin = document.querySelector("#slytherin");
let btnHufflepuff = document.querySelector("#hufflepuff");
let btnRavenclaw = document.querySelector("#ravenclaw");
let btnGryffindor = document.querySelector("#gryffindor");
let btnAllHouses = document.querySelector("#allHouses");

let slytherinPressed = false;
let hufflepuffPressed = false;
let gryffindorPressed = false;
let ravenclawPressed = false;

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

  btnSlytherin.addEventListener("click", filterSlytherins);
  btnHufflepuff.addEventListener("click", filterHufflepuffs);
  btnRavenclaw.addEventListener("click", filterRavenclaws);
  btnGryffindor.addEventListener("click", filterGryffindors);
}

function filterList() {
  allStudents.sort(nameSort);
  let filteredList = allStudents;
  if (slytherinPressed === true) {
    filteredList = allStudents.filter(onlySlytherin);
    console.table(filteredList);
  } else if (hufflepuffPressed === true) {
    filteredList = allStudents.filter(onlyHufflepuff);
    console.table(filteredList);
  } else if (gryffindorPressed === true) {
    filteredList = allStudents.filter(onlyGryffindor);
    console.table(filteredList);
  } else if (ravenclawPressed === true) {
    filteredList = allStudents.filter(onlyRavenclaw);
    console.table(filteredList);
  }
  console.table(filteredList);

  displayList(filteredList);
  //setting welcher Filter
}

function filterSlytherins() {
  slytherinPressed = true;
  console.log(slytherinPressed);
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

function onlySlytherin(student) {
  console.log(student.house);
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
  document.querySelector("template#student").innerHTML = "";
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
//allStudents.sort(nameSort);

//splice zum removen bei expellen
