<<<<<<< HEAD

let saveMeetingEl = document.querySelectorAll(".save-button-top");
let meetingsArr = JSON.parse(localStorage.getItem("meetingsArr")) || [];
//code to create an identifier
function createIdentifier() {
  let arr = [];
  for (let i = 0; i <= 2; i++) {
    let lower = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    let upper = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    let num = String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    arr.push(lower, upper, num);
  }
  let code = arr.join("");
  return code;
}
//save the return from function to a variable
let identifier = createIdentifier();
console.log(identifier);

//code to save past meeting obj to localStorage and redirects to past_meeting.html
function save() {
  saveToLocal();
  saveToPantry();
}
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
saveMeetingEl.forEach((button) => {
  button.addEventListener("click", save);
});
=======

// Global constants for various keys
const PAST_MEETINGS_LS_KEY = 'past_meetings'; // TODO: Make sure same keys is used for storing past meeting metadata in local storage


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
    const translationText = await getTranslation(sourceText, sourceLanguage, targetLanguage);
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
            target: targetLanguage
        }),
        headers: {"Content-type": "application/json"}
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
    return sourceTextarea.parentElement.querySelector('.note-translation');
}

function getSourceLanguage() {
    // TODO implement proper logic for getSourceLanguage
    return 'en';
}

function getTargetLanguage() {
    // TODO implement proper logic for getTargetLanguage
    return 'es';
}

//Exit button bottom redirecting to past_meetings.html
const bottomExitbutton = document.getElementById("exit-button-bottom");
bottomExitbutton.addEventListener("click"), function () {
    location.href = "./past_meetings.html"
}


function displayPastMeetingsList() {
    const pastMeetingsJSON = localStorage.getItem(PAST_MEETINGS_LS_KEY);
    const pastMeetings = JSON.parse(pastMeetingsJSON);

    const pastMeetingsUL = document.querySelector('#past-meeting-list ul')
    //make sure pastMeetingsUL has no children
    while (pastMeetingsUL.firstChild) {
        pastMeetingsUL.removeChild(pastMeetingsUL.firstChild);
    }
    //add list items for each meeting
    for (const meeting of pastMeetings) {
        const listItem = document.createElement('li');
        const listItemAnchor = document.createElement('a')
        listItemAnchor.setAttribute('href', `meeting.html?past_meeting_name=${encodeURI(meeting.name)}`) // todo make link works and that .name attribute is correct
        listItemAnchor.textContent = `${meeting.name} — ${meeting.date}`; // todo make sure date displays correctly
        listItem.appendChild(listItemAnchor);
        pastMeetingsUL.appendChild(listItem);
    }
}
>>>>>>> d75c614ea0ec03b3b1b8716c17f993d6db46fe11
