//Variables

let jsonData;
let jsonList = "http://petlatkea.dk/2019/hogwarts/students.json";
let bloodtypeList = "http://petlatkea.dk/2019/hogwarts/families.json";

let Student = new Object();

let allStudents = new Array();
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

//Functions

window.addEventListener("DOMContentLoaded", init);

function init() {
  loadJSON();
  // register sort-buttons
  document.querySelector("#sorting").addEventListener("click", clickSort);
  //register filter-buttons
  document.querySelector("#filtering").addEventListener("click", clickFilter);
  // register remove-button and clicks on students
  document.querySelector("#list tbody").addEventListener("click", clickList);
}

function loadJSON() {
  //load JSON data from the both provided files
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
  //add myself
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

    //get data from json and set properties
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

  //hack bloodtype for each student
  allStudents.forEach(student => hackBloodtype(student));

  prepareList(allStudents);
}

//code snippet from here: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function prepareBloodtypes(data) {
  //store lastname in global arrays
  data.half.forEach(name => halfBlooded.push(name));
  data.pure.forEach(name2 => pureBlooded.push(name2));
}

function checkBloodtype(student) {
  //check if lastname is on one of the lists we got from the JSON file
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

function hackBloodtype(student) {
  let bloodtypesArr = ["half", "muggle"];

  if (student.bloodtype === "pure") {
    student.bloodtype = bloodtypesArr[randomBloodType()]; //get random bloodtype from array
  } else if (student.bloodtype === "half") {
    student.bloodtype = "pure";
  } else if (student.bloodtype === "muggle") {
    student.bloodtype = "pure";
  }
}

function randomBloodType() {
  return Math.floor(Math.random() * 2);
}

function clickSort(event) {
  //check if a sorting option was pressed
  const action = event.target.dataset.action;
  if (action === "sortFirstname") {
    sorting_direction = "firstname"; //store sorting option type in a global variable
    prepareList();
  } else if (action === "sortLastname") {
    sorting_direction = "lastname";
    prepareList();
  } else if (action === "sortHouses") {
    sorting_direction = "houses";
    prepareList();
  }
}

function clickFilter(event) {
  //check if a filter option was pressed
  const action = event.target.dataset.action;
  if (action === "filterSlytherin") {
    filtering_direction = "slytherin"; //store filter option type in a global variable
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

function prepareList() {
  //the actual sorting regarding the value of the global variable
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
    } else if (sorting_direction === "houses") {
      if (a.house < b.house) {
        return -1;
      } else {
        return 1;
      }
    }
  });

  //add only the selected houses to the filtered list
  //pass filtered list on to displayList function
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
    filteredList = allStudents;
    displayList(filteredList);
  } else {
    filteredList = allStudents;
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

  getCount();
}

function getCount() {
  //get number of students in total, in each house and expelled

  let countTotal = allStudents.length + expelledStudents.length;
  let countSlytherin = allStudents.filter(onlySlytherin).length;
  let countGryffindor = allStudents.filter(onlyGryffindor).length;
  let countHufflepuff = allStudents.filter(onlyHufflepuff).length;
  let countRavenclaw = allStudents.filter(onlyRavenclaw).length;

  document.querySelector("#totalNmbr").textContent =
    "Students in total: " + countTotal;
  document.querySelector("#slytheringNmbr").textContent =
    "Slytherin: " + countSlytherin;
  document.querySelector("#gryffindorNmbr").textContent =
    "Gryffindor: " + countGryffindor;
  document.querySelector("#hufflepuffNmbr").textContent =
    "Hufflepuff: " + countHufflepuff;
  document.querySelector("#ravenclawNmbr").textContent =
    "Ravenclaw: " + countRavenclaw;
  document.querySelector("#expeledNmbr").textContent =
    "Students expeled: " + expelledStudents.length;
}

function clickList(event) {
  let target = event.target;
  //figure out if a button was clicked
  if (target.tagName === "BUTTON") {
    //figure out if I should be expelled
    if (findSari(target.className) == true) {
      //start visual effects
      let snow = document.querySelector("#snow");
      let impossibleDisplay = document.querySelector("#impossible");
      impossibleDisplay.style.display = "block";
      snow.style.display = "block";
      setTimeout(() => {
        snow.style.display = "none";
        impossibleDisplay.style.display = "none";
      }, 5000);
    } else {
      clickRemove(target.className); //pass id of the student that was clicked on to function
    }
  } else if (target.tagName === "TD") {
    //figure out if a student was clicked
    //get button id of the one in the same row
    let rowBtn = target.closest("tr").querySelector("#button");
    if (target.dataset.field === "lastname") {
      showModal(rowBtn.className);
    } else if (target.dataset.field === "name") {
      showModal(rowBtn.className);
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

function clickRemove(badStudent) {
  toBeRemoved = findStudent(badStudent); // TODO: Figure out which element should be removed
  const pos = allStudents.indexOf(toBeRemoved); // TODO: Find the element index in the array
  allStudents.splice(pos, 1); // TODO: Splice that element from the array
  expelledStudents.push(toBeRemoved); //Add  student to expelled list
  displayList(allStudents);
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
  let quest = document.querySelector("#quest");
  let img = document.querySelector("#potrait");
  let caption = document.querySelector("#caption");
  closeBtn = document.querySelector("#closeBtn");
  sqaudBtn = document.querySelector("#squadBtn");

  //add event listener
  closeBtn.addEventListener("click", closeModal);
  sqaudBtn.addEventListener("click", addToSquad);

  //check which students id it is, set modal window properties accordingly
  for (let i = 0; i < allStudents.length; i++) {
    if (allStudents[i].id === studentID) {
      img.src = imageArr[randomNmbr()];
      caption.textContent = allStudents[i].name + " " + allStudents[i].lastname;
      nameSpan.textContent = "Name: " + allStudents[i].name;
      lastNameSpan.textContent = "Lastname: " + allStudents[i].lastname;
      bloodtypeSpan.textContent = "Bloodtype: " + allStudents[i].bloodtype;
      if (allStudents[i].house === "Hufflepuff") {
        houseSpan.textContent = "House: Hufflepuff";
        modal.style.backgroundColor = "yellow";
        quest.src = "Hufflepuff.png";
      } else if (allStudents[i].house === "Slytherin") {
        houseSpan.textContent = "House: Slytherin";
        modal.style.backgroundColor = "green";
        quest.src = "Slytherin.png";
      } else if (allStudents[i].house === "Gryffindor") {
        houseSpan.textContent = "House: Gryffindor";
        modal.style.backgroundColor = "red";
        quest.src = "Gryffindor.png";
      } else {
        houseSpan.textContent = "House: Ravenclaw";
        modal.style.backgroundColor = "darkblue";
        quest.src = "Ravenclaw.png";
      }
    }
    modal.style.display = "block";
  }
}

function randomNmbr() {
  return Math.floor(Math.random() * 9); //get a random number between 0 and 9
}

function closeModal() {
  modal.style.display = "none";
}

function addToSquad(student) {
  let squadStatus = document.querySelector("#squadStatus");

  //TODO: Figure out if "Add"- button was clicked
  if (sqaudBtn.textContent === "Add to Inquisitorial Squad") {
    //check if requirements are true
    if (bloodtypeSpan.textContent === "Bloodtype: pure") {
      sqaudBtn.textContent = "Remove";
      squadStatus.textContent = "Status: Inquisitorial Squad";

      setTimeout(function() {
        //Set Timer to 4 seconds for IS status
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
      alert("Cannot be added to Inquisitorial Squad");
    }
    //TODO: Figure out if "remove"- button was clicked
  } else if (sqaudBtn.textContent === "Remove") {
    sqaudBtn.textContent = "Add to Inquisitorial Squad";
    squadStatus.textContent = "Status: Not in Inquisitorial Squad";
  }
}
