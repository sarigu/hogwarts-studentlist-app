//Variables

let jsonData;
let jsonList = "http://petlatkea.dk/2019/hogwarts/students.json";
let bloodtypeList = "http://petlatkea.dk/2019/hogwarts/families.json";
let allStudents = new Array();
let Student = new Object();
let allBtns = new Array();
let expelledStudents = new Array();

let halfBlooded = new Array();
let pureBlooded = new Array();

let sorting_direction = "";
let filtering_direction = "";

let modal;
let closeBtn;
let sqaudBtn;
let bloodtypeSpan;
let houseSpan;

window.addEventListener("DOMContentLoaded", init);

//Functions

function init() {
  loadJSON();
  // register sort-buttons
  document.querySelector("#sorting").addEventListener("click", clickSort);
  //register filter-buttons
  document.querySelector("#filtering").addEventListener("click", clickFilter);
  // register remove-button and student clicks
  document.querySelector("#list tbody").addEventListener("click", clickList);
}

function loadJSON() {
  fetch(bloodtypeList)
    .then(response => response.json())
    .then(bloodData => {
      prepareBloodtypes(bloodData);
    });

  fetch(jsonList)
    .then(response => response.json())
    .then(myJson => {
      prepareObjects(myJson);
    });
}

function prepareObjects(jsonData) {
  const me = new Object();
  me.name = "Sari";
  me.lastname = "Guci";
  me.house = "Hufflepuff";
  me.id = uuidv4();
  me.bloodtype = "half";
  allStudents.push(me);

  jsonData.forEach(jsonObject => {
    //create new object
    const student = Object.create(Student);
    //get data from json
    const parts = jsonObject.fullname.split(" ");
    student.name = parts[0];
    student.lastname = parts[1];
    student.house = jsonObject.house;
    student.id = uuidv4();
    checkBloodtype(student);
    if (student.bloodtype === undefined) {
      student.bloodtype = "muggle";
    }

    //store student in gloabal array
    allStudents.push(student);
  });

  allStudents.forEach(student => changeBloodtype(student));

  prepareList(allStudents);
}

function checkBloodtype(student) {
  for (
    let i = 0, x = 0;
    i < halfBlooded.length, x < pureBlooded.length;
    i++, x++
  ) {
    if (student.lastname === halfBlooded[i]) {
      student.bloodtype = "half";
    } else if (student.lastname === pureBlooded[x]) {
      student.bloodtype = "pure";
    }
  }
}

function prepareBloodtypes(data) {
  data.half.forEach(name => halfBlooded.push(name));
  data.pure.forEach(name2 => pureBlooded.push(name2));
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
  // TODO: Figure out if a button was clicked

  let target = event.target;
  if (target.tagName === "BUTTON") {
    if (findSari(target.className) == true) {
      alert("das geht nicht!");
    } else {
      clickRemove(target.className);
    }
  } else if (target.tagName === "TD") {
    let rowBtn = target.closest("tr").querySelector("#button");
    if (target.dataset.field === "lastname") {
      showModal(rowBtn.className);
    } else if (target.dataset.field === "name") {
      showModal(rowBtn.className);
    }
  }
}

function getStatus() {
  let totalNmbr = allStudents.length + expelledStudents.length;
  let slytherinNmbr = allStudents.filter(onlySlytherin).length;
  let gryffindorNmbr = allStudents.filter(onlyGryffindor).length;
  let hufflepuffNmbr = allStudents.filter(onlyHufflepuff).length;
  let ravenclawNmbr = allStudents.filter(onlyRavenclaw).length;

  document.querySelector("#totalNmbr").textContent =
    "Total Number of students: " + totalNmbr;
  document.querySelector("#slytheringNmbr").textContent =
    "Slytherin: " + slytherinNmbr;
  document.querySelector("#gryffindorNmbr").textContent =
    "Gryffindor: " + gryffindorNmbr;
  document.querySelector("#hufflepuffNmbr").textContent =
    "Hufflepuff: " + hufflepuffNmbr;
  document.querySelector("#ravenclawNmbr").textContent =
    "Ravenclaw: " + ravenclawNmbr;
  document.querySelector("#expeledNmbr").textContent =
    "Students expeled: " + expelledStudents.length;
}

function showModal(studentID) {
  let imageArr = [
    "images/brown_i.png",
    "images/finnigan_s.png",
    "images/granger_h.png",
    "images/jones_m.png",
    "images/longbottom_n.png",
    "images/patil_p.png",
    "images/potter_h.png",
    "images/thomas_d.png",
    "images/weasley_r.png"
  ];

  modal = document.querySelector("#modal");
  let nameSpan = document.querySelector("#firstname");
  let lastNameSpan = document.querySelector("#lastname");
  houseSpan = document.querySelector("#house");
  bloodtypeSpan = document.querySelector("#bloodtype");
  let img = document.querySelector("#potrait");
  let caption = document.querySelector("#caption");
  closeBtn = document.querySelector("#closeBtn");
  closeBtn.addEventListener("click", closeModal);
  sqaudBtn = document.querySelector("#squad");
  sqaudBtn.addEventListener("click", addToSquad);

  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].id === studentID) {
      img.src = imageArr[randomNmbr()];
      caption.textContent = allStudents[i].name + allStudents[i].lastname;
      nameSpan.textContent = "Name: " + allStudents[i].name;
      lastNameSpan.textContent = "Lastname: " + allStudents[i].lastname;
      bloodtypeSpan.textContent = "Bloodtype: " + allStudents[i].bloodtype;
      if (allStudents[i].house === "Hufflepuff") {
        houseSpan.textContent = "House: Hufflepuff";
        modal.style.backgroundColor = "yellow";
      } else if (allStudents[i].house === "Slytherin") {
        houseSpan.textContent = "House: Slytherin";
        modal.style.backgroundColor = "green";
      } else if (allStudents[i].house === "Gryffindor") {
        houseSpan.textContent = "House: Gryffindor";
        modal.style.backgroundColor = "red";
      } else {
        houseSpan.textContent = "House: Ravenclaw";
        modal.style.backgroundColor = "darkblue";
      }
    }
    modal.style.display = "block";
  }
}

function randomNmbr() {
  return Math.floor(Math.random() * 9);
}

function closeModal() {
  modal.style.display = "none";
}

function clickRemove(badStudent) {
  // TODO: Figure out which element should be removed
  toBeRemoved = findStudent(badStudent);

  // TODO: Find the element index in the array
  const pos = allStudents.indexOf(toBeRemoved);
  // TODO: Splice that element from the array
  allStudents.splice(pos, 1);
  //console.table(allStudents);

  //add to expelled list
  expelledStudents.push(toBeRemoved);
  //console.table(expelledStudents);

  // Re-display the list
  displayList(allStudents);
}

function addToSquad(student) {
  let squadStatus = document.querySelector("#squadStatus");

  if (sqaudBtn.textContent === "Add to Inquisitorial Squad") {
    if (bloodtypeSpan.textContent === "Bloodtype: pure") {
      sqaudBtn.textContent = "Remove";
      squadStatus.textContent = "Status: Inquisitorial Squad";
      setTimeout(function() {
        sqaudBtn.textContent = "Add to Inquisitorial Squad";
        squadStatus.textContent = "Status: Not in Inquisitorial Squad";
      }, 4000);
    } else if (houseSpan.textContent === "House: Slytherin") {
      sqaudBtn.textContent = "Remove";
      squadStatus.textContent = "Status: Inquisitorial Squad";
      setTimeout(function() {
        sqaudBtn.textContent = "Add to Inquisitorial Squad";
        squadStatus.textContent = "Status: Not in Inquisitorial Squad";
      }, 4000);
    } else {
      alert("can't be added to  Inquisitorial Squad");
    }
  }
}

function findStudent(studentID) {
  return allStudents.find(obj => obj.id === studentID);
}
function findSari(studentID) {
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].id === studentID) {
      if (allStudents[i].name === "Sari") {
        return true;
      }
    }
  }
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
  clone.querySelector("[data-field=bloodtype]").textContent = student.bloodtype;

  clone.querySelector("#button").className = student.id;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);

  getStatus();
}

function changeBloodtype(student) {
  let bloodtypesArr = ["half", "muggle"];

  if (student.bloodtype === "pure") {
    student.bloodtype = bloodtypesArr[randomBloodType()];
  } else if (student.bloodtype === "half") {
    student.bloodtype = "pure";
  } else if (student.bloodtype === "muggle") {
    student.bloodtype = "pure";
  }
}

function randomBloodType() {
  return Math.floor(Math.random() * 2);
}

//hinschreiben von wem das code snippet ist
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
