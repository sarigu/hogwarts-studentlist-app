let jsonData;
let jsonList = "http://petlatkea.dk/2019/hogwarts/students.json";
let allStudents = new Array();
let Student = new Object();

let sorting_direction = "";
let filtering_direction = "";

window.addEventListener("DOMContentLoaded", init);

function init() {
  loadJSON();
  // register sort-buttons
  document.querySelector("#sorting").addEventListener("click", clickSort);

  //register filter-buttons

  document.querySelector("#filtering").addEventListener("click", clickFilter);

  // register remove-button //eventlistener für die ganze liste egal wo man hin klickt
  document.querySelector("#list").addEventListener("click", clickList);

  //add unique id of each animal
  allStudents.forEach(student => console.log(uuidv4()));

  prepareList(allStudents);
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

  prepareList();
}

function clickSort(event) {
  const action = event.target.dataset.action;
  if (action === "sortFirstname") {
    //event.preventDefault(); //damit der link nicht gefolt wird
    sorting_direction = "firstname";
    prepareList();
  } else if (action === "sortLastname") {
    // event.preventDefault();
    sorting_direction = "lastname";
    prepareList();
  }
}

function clickFilter(event) {
  const action = event.target.dataset.action;
  if (action === "filterSlytherin") {
    filtering_direction = "slytherin";
    prepareList();
  } else if (action === "filterHufflepuff") {
    filtering_direction = "hufflepuff";
    prepareList();
  } else if (action === "filterRavenclaw") {
    filtering_direction = "ravenclaw";
    prepareList();
  } else if (action === "filterGryffindor") {
    filtering_direction = "gryffindor";
    prepareList();
  } else {
    filtering_direction = "allHouses";
    prepareList();
  }
}

function clickList(event) {
  // console.log(event);
  // TODO: Figure out if a button was clicked
  let target = event.target;
  console.log(target.tagName);
  //TD für studenten name
  if (target.tagName === "BUTTON") {
    console.log("es war ein button");
    // TODO: Figure out if it was a remove-button
    if (target.dataset.action === "remove") {
      // TODO: If so, call clickRemove
      clickRemove();
    }
  }
}

function clickRemove(event) {
  // TODO: Figure out which element should be removed
  toBeRemoved = findStudent("Hannah");

  //index von dem button der geklickt wurde
  //dann was bei dem index im animal array ist splicen

  // TODO: Find the element index in the array
  const pos = allStudents.indexOf(toBeRemoved);

  // TODO: Splice that element from the array
  allStudents.splice(pos, 1);
  console.table(allStudents);

  // Re-display the list
}

function findStudent(studentFirstname) {
  return allStudents.find(obj => obj.name === studentFirstname);
}

function prepareList() {
  allStudents.sort((a, b) => {
    if (sorting_direction === "firstname") {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    } else if (sorting_direction === "lastname") {
      if (a.lastname > b.lastname) {
        return 1;
      } else {
        return -1;
      }
    }
  });

  let filteredList;
  if (filtering_direction === "slytherin") {
    filteredList = allStudents.filter(onlySlytherin);
    displayList(filteredList);
  } else if (filtering_direction === "hufflepuff") {
    filteredList = allStudents.filter(onlyHufflepuff);
    displayList(filteredList);
  } else if (filtering_direction === "ravenclaw") {
    filteredList = allStudents.filter(onlyRavenclaw);
    displayList(filteredList);
  } else if (filtering_direction === "gryffindor") {
    filteredList = allStudents.filter(onlyGryffindor);
    displayList(filteredList);
  } else if (filtering_direction === "allHouses") {
    displayList((filteredList = allStudents));
  } else {
    displayList((filteredList = allStudents));
  }
}

function onlySlytherin(student) {
  return student.house === "Slytherin";
}

function onlyHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function onlyRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function onlyGryffindor(student) {
  return student.house === "Gryffindor";
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = student.name;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;

  //clone.querySelector("button").dataset.id = animal.id; //siehe oben

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

//hinschreiben von wem das code snippet ist
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
