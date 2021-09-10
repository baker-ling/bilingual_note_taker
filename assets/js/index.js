//DOM selection
let inputText = document.getElementById("meeting-name-input");
const myButton = document.getElementsByClassName("insert-below-button");
let startMeetingEl = document.querySelector("#start-meeting");
let dropdown2 = document.querySelector(".dropdown-trigger2");
let dropdown1 = document.querySelector(".dropdown-trigger");
//global
let meetingsArr = JSON.parse(localStorage.getItem("meetingsArr")) || [];
let meetingMetadata = {
  //To add variables
};
let options = [];
document.addEventListener("DOMContentLoaded", function () {
  let dropdown1 = document.querySelectorAll(".dropdown-trigger");
  let instances = M.Dropdown.init(dropdown1, options);
});

document.addEventListener("DOMContentLoaded", function () {
  let dropdown2 = document.querySelectorAll(".dropdown-trigger2");
  let instances = M.Dropdown.init(dropdown2, options);
});

//code to shuffle array for identifier
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
//code to create an identifier
function createIdentifier() {
  let arr = [];
  for (let i = 0; i <= 2; i++) {
    let lower = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    let upper = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    let num = String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    arr.push(lower, upper, num);
  }
  shuffleArray(arr);
  return arr.join("");
}

//save the return from function to a variable
let identifier = createIdentifier();
meetingMetadata.pantryId = identifier;

//function get source language
function getSourceLanguage() {
  let sourceDropdown = document.querySelector("#dropdown1");
  sourceDropdown.addEventListener("click", function (e) {
    let sourceLang = e.target.innerText;
    dropdown1.innerText = sourceLang;
    meetingMetadata.sourceLanguage = sourceLang;
    return sourceLang;
  });
}
function getTargetLanguage() {
  let sourceDropdown = document.querySelector("#dropdown2");
  sourceDropdown.addEventListener("click", function (e) {
    let targetLang = e.target.innerText;
    dropdown2.innerText = targetLang;
    meetingMetadata.targetLanguage = targetLang;
    console.log(targetLang);
    return targetLang;
  });
}
getSourceLanguage();
getTargetLanguage();

//function to save to localStorage
function saveToLocal() {
  meetingsArr.push(meetingMetadata);
  localStorage.setItem("meetingsArr", JSON.stringify(meetingsArr));
}

function startMeeting(event) {
  event.preventDefault();
  getSourceLanguage();
  getTargetLanguage();
  let meetingName = inputText.value.trim();
  if (!meetingName) {
    inputText.setAttribute("placeholder", "Please Enter a Name!");
    return;
  }
  // code to check user chooses language option
  if (
    typeof getSourceLanguage() === "undefined" ||
    typeof getSourceLanguage() === "undefined"
  ) {
    alert("Please choose the language options"); //replace with Modal
    return;
  }
  meetingMetadata.name = meetingName;
  console.log(meetingMetadata);
  location.assign("./meeting.html");
  saveToLocal();
}

startMeetingEl.addEventListener("click", startMeeting);
