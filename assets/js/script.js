// Global constants for various keys
const PAST_MEETINGS_LS_KEY = "past_meetings"; // TODO: Make sure same keys is used for storing past meeting metadata in local storage
const PAST_MEETING_ID_SEARCH_PARAM_KEY = "past_meeting_name";

//For directing to next page on save meeting button
// window.location.href = "meeting.html";

// Adding and Removing items on notes

const inputText = document.getElementById("txt");
const myButton = document.getElementsByClassName("insert-below-butto");

/**
 * Callback function for original note textareas to automatically
 * translate contents.
 * @param {Event} event
 */
function translateTextareaCallback(event) {
  translateTextarea(event.target);
}

/**
 * Translates text in the given source text textarea
 * to its corresponding translation text textarea.
 * @param {HTMLTextAreaElement} sourceTextarea
 */
async function translateTextarea(sourceTextarea) {
  const sourceText = sourceTextarea.value;
  const sourceLanguage = getSourceLanguage();
  const targetLanguage = getTargetLanguage();
  const targetTextarea = getTargetTextarea(sourceTextarea);
  const translationText = await getTranslation(
    sourceText,
    sourceLanguage,
    targetLanguage
  );
  targetTextarea.value = translationText;
}

/**
 * Gets a machine translation from libretranslate.de
 * @param {string} sourceText - Text to be translated
 * @param {string} sourceLanguage - Language of text to be translated
 * @param {string} targetLanguage - Language to be translated into
 * @returns {string} Machine translation result.
 */
async function getTranslation(sourceText, sourceLanguage, targetLanguage) {
  const requestResult = await fetch("https://libretranslate.de/translate", {
    method: "POST",
    body: JSON.stringify({
      q: sourceText,
      source: sourceLanguage,
      target: targetLanguage,
    }),
    headers: { "Content-type": "application/json" },
  });

  const data = await requestResult.json();
  return data.translatedText;
}

/**
 * Returns the textarea element that is supposed to hold the translation
 * for the given source text textarea element.
 * @param {HTMLTextAreaElement} sourceTextarea
 * @returns {HTMLTextAreaElement} Translation textarea corresponding to sourceTextarea
 */
function getTargetTextarea(sourceTextarea) {
  return sourceTextarea.parentElement.querySelector(".note-translation");
}

function getSourceLanguage() {
  // TODO implement proper logic for getSourceLanguage
  return "en";
}

function getTargetLanguage() {
  // TODO implement proper logic for getTargetLanguage
  return "es";
}

//Exit button bottom redirecting to past_meetings.html
const bottomExitbutton = document.getElementById("exit-button-bottom");
bottomExitbutton.addEventListener("click"),
  function () {
    location.href = "./past_meetings.html";
  };

function displayPastMeetingsList() {
  const pastMeetingsJSON = localStorage.getItem(PAST_MEETINGS_LS_KEY);
  const pastMeetings = JSON.parse(pastMeetingsJSON);

  const pastMeetingsUL = document.querySelector("#past-meeting-list ul");
  //make sure pastMeetingsUL has no children
  while (pastMeetingsUL.firstChild) {
    pastMeetingsUL.removeChild(pastMeetingsUL.firstChild);
  }
  //add list items for each meeting
  for (const meeting of pastMeetings) {
    const listItem = document.createElement("li");
    const listItemAnchor = document.createElement("a");
    listItemAnchor.setAttribute(
      "href",
      `meeting.html?${PAST_MEETING_ID_SEARCH_PARAM_KEY}=${encodeURI(
        meeting.pantryId
      )}`
    ); // todo make link works and that .name attribute is correct
    listItemAnchor.textContent = `${meeting.name} — ${meeting.date}`; // todo make sure date displays correctly
    listItem.appendChild(listItemAnchor);
    pastMeetingsUL.appendChild(listItem);
  }
}

/**
 * Displays a past meeting.
 * @param {Object} meeting - Past meeting object with its notes included.
 */
function displayPastMeeting(meeting) {
  showMeetingTitle(meeting.title); // TODO make sure this exists
  setMeetingLanguages(meeting.sourceLang, meeting.targetLang); // TODO I am assuming that this function would also display those languages above each column of notes
  showMeetingLastUpdated(meeting.lastUpdated); // TODO make sure this exists
  for (const note of meeting.notes) {
    const sourceTextarea = addNoteRow();
    sourceTextarea.value = note; // TODO check if this would trigger an onchange event listener
    translateTextarea(sourceTextarea);
  }
}

/**
 * Checks if we are supposed to be displaying a meeting whose id is passed to meeting.html as a URL search parameter
 * @returns {boolean}
 */
function checkForPastMeetingSearchParam() {
  return (
    window.location.pathname.toString().endsWith("meeting.html") &&
    new URLSearchParams(window.location.search).has(
      PAST_MEETING_ID_SEARCH_PARAM_KEY
    )
  ); // todo make sure this fits the code for loading past meetings
}

function initPastMeeting() {
  const meetingId = new URLSearchParams(window.location.search).get(
    PAST_MEETING_ID_SEARCH_PARAM_KEY
  );
  const meeting = getPastMeetingById(meetingId); // todo make sure that this integrates with what Samira is working on
  displayPastMeeting(meeting);
}

/**
 * Code to intialize meeting.html
 */
if (checkForPastMeetingSearchParam()) {
  initPastMeeting();
} else {
  initNewMeeting(); // todo make sure that this call matches what Cooper is working on
}

let saveMeetingEl = document.querySelector("#save-button-bottom");
//global
let pantryId = "238364cb-50ff-45e2-8f91-9e2d44b71215";
let meetingsArr = JSON.parse(localStorage.getItem("meetingsArr")) || [];
//code to shuffle array
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
console.log(identifier);

//calls functions to save past meeting obj to localStorage and Pantry then redirects to past_meeting.html
function save() {
  saveToLocal();
  saveToPantry();
}

//function to save to localStorage
function saveToLocal() {
  let meetingMetadata = {
    //To add variables
    title: "",
    lastUpdated: "",
    sourceLang: "",
    targetLanguage: "",
    pantryId: identifier,
  };
  meetingsArr.push(meetingMetadata);
  localStorage.setItem("meetingsArr", JSON.stringify(meetingsArr));
  location.assign("./past_meetings.html");
  displayPastMeetingsList();
}
saveMeetingEl.addEventListener("click", save);

//function to POST to Pantry
async function saveToPantry() {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${identifier}`,
    {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        notes:
          "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse quaerat et quisquam eaque sapiente aut ratione, in tempore repudiandae corporis vitae dolore nobis unde omnis dolor beatae corrupti dolores. Sapiente!",
      }),
    }
  );
  const data = await response.text();
  console.log(data);
}
//function to DELETE from Pantry
async function deleteNotes() {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${identifier}`,
    {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: "",
    }
  );
  const data = await response.text();
  console.log(data);
}
//function to PUT(update notes) in Pantry
async function updateNotes() {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${identifier}`,
    {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        notes: "test", // test
      }),
    }
  );
  const data = await response.text();
  console.log(data);
}
//function to GET(retrieve notes) from Pantry
async function getNotes() {
  let response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${identifier}`,
    {
      method: "GET",
      headers: { "Content-type": "application/json" },
    }
  );
  const data = await response.json();
  console.log(data.notes);
}

let options = [];
document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.dropdown-trigger');
    let instances = M.Dropdown.init(elems, options);
  });


document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.dropdown-trigger2');
    let instances = M.Dropdown.init(elems, options);
  });