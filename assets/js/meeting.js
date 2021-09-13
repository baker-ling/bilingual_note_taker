const PANTRY_KEY = "57dfac71-7e72-4583-8f41-fd7b82d032c1";
const meetingMetadata = JSON.parse(
  sessionStorage.getItem(CURRENT_MEETING_SESSION_KEY)
);
let meetingsMetadataArray =
  JSON.parse(localStorage.getItem("meetingsMetadataArray")) || [];

// Elements from DOM
const mainElement = document.querySelector("main");
const saveMeetingEl = document.querySelector("#save-button-bottom");
const meetingTitleEl = document.querySelector("#meeting-title");

/**
 * Callback function for original note textareas to automatically
 * translate contents.
 * @param {Event} event
 */
function translateTextareaCallback(event) {
  translateTextarea(event.target);
}

/**
 * Inserts a row after the given row or at the end of the list.
 * @param {HTMLDivElement|null} currentRow
 * @returns {HTMLDivElement} - the row that was added
 */
function insertRow(currentRow = null) {
  //construct new row
  let RowElement = document.createElement("div");
  RowElement.className = "line-item row";
  RowElement.innerHTML = `<!--mobile first-->
            <textarea class="note-source white col s12 m6"></textarea>
            <textarea class="note-translation white col s12 m6"></textarea>
          
            <!--Insert line button-->
            <a href="#" class=" btn-floating green">
                <i class="insert-below-button material-icons white-text">add</i>
            </a>
            
            <!--delete button-->
            <a href="#" class=" btn-floating red">
                <i class="delete-button material-icons white-text">remove</i>
            </a>
            
          <a href="#" class="btn-floating orange">
                <i class="translate-button material-icons white-text">edit</i>
            </a>`;

  // insert between currentRow and the row that follows it
  let nextRow = currentRow ? currentRow.nextSibling : null;
  mainElement.insertBefore(RowElement, nextRow);
  return RowElement;
}

function mainElementonclickListener(event) {
  console.log(event);
  if (event.target.classList.contains("insert-below-button")) {
    let currentRow = event.target.closest("div");
    insertRow(currentRow);
    getNotesFromCurrentMeeting();
  } else if (event.target.classList.contains("delete-button")) {
    let currentRow = event.target.closest("div");
    deleteRow(currentRow);
  } else if (event.target.classList.contains("translate-button")) {
    let currentRow = event.target.closest("div");
    let sourceTextarea = currentRow.querySelector(".note-source");
    translateTextarea(sourceTextarea);
  }
}
mainElement.addEventListener("click", mainElementonclickListener);

function deleteRow(currentRow) {
  currentRow.remove();
}

/**
 * Translates text in the given source text textarea
 * to its corresponding translation text textarea.
 * @param {HTMLTextAreaElement} sourceTextarea
 */
async function translateTextarea(sourceTextarea) {
  const sourceText = sourceTextarea.value;
  const sourceLanguage = getSourceLanguageForCurrentMeeting();
  const targetLanguage = getTargetLanguageForCurrentMeeting();
  const targetTextarea = getTargetTextarea(sourceTextarea);
  const translationText = await getTranslation(
    sourceText,
    sourceLanguage,
    targetLanguage
  );
  targetTextarea.value = translationText;
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

//Exit button bottom redirecting to past_meetings.html
const bottomExitButton = document.getElementById("exit-button-bottom");
bottomExitButton.addEventListener("click", function () {
  location.href = "./past_meetings.html";
});

//function to save meeting on localStorage and Pantry
function saveMeeting() {
  saveToLocalStorage();
  saveToPantry();
  toastPopUp();
}

//function to save to localStorage();
function saveToLocalStorage() {
  meetingsMetadataArray.push(meetingMetadata);
  localStorage.setItem(
    "meetingsMetadataArray",
    JSON.stringify(meetingsMetadataArray)
  );
}

//function to POST to Pantry
async function saveToPantry() {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${PANTRY_KEY}/basket/${meetingMetadata.pantryId}`,
    {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        Metadata: meetingMetadata,
        notes: getNotesFromCurrentMeeting(),
      }),
    }
  );
  const data = await response.text();
}

//function to DELETE from Pantry
async function deleteNotesFromPantry() {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${PANTRY_KEY}/basket/${meetingMetadata.pantryId}`,
    {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: "",
    }
  );
  const data = await response.text();
}
//function to PUT(update notes) in Pantry
async function updateNotesOnPantry() {
  const response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${PANTRY_KEY}/basket/${meetingMetadata.pantryId}`,
    {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        notes: "test", // test
      }),
    }
  );
  const data = await response.text();
}

/**
 * Returns an array of strings for all of the source text notes.
 */
function getNotesFromCurrentMeeting() {
  const notes = [];
  document.querySelectorAll(".note-source").forEach((note) => {
    notes.push(note.value.trim());
  });
  return notes;
}
/**
 * Displays a past meeting based on meeting.metadata
 */
async function displayPastMeeting() {
  const notes = await getNotes();
  showMeetingTitle();
  showMeetingLanguages();
  showMeetingLastUpdated();

  // clear all children from main element
  while (mainElement.firstChild) {
    mainElement.removeChild(mainElement.firstChild);
  }

  // add row to main element for each note
  for (const note of notes) {
    const rowElement = insertRow();
    const sourceTextarea = rowElement.querySelector(".note-source");
    sourceTextarea.value = note;
    translateTextarea(sourceTextarea);
  }
}

function initPastMeeting() {
  // todo fix to get from session storage instead
  const meeting = getPastMeetingById(meetingId); // todo make sure that this integrates with what Samira is working on
  displayPastMeeting(meeting);
}

function initNewMeeting() {
  showMeetingTitle(meetingMetadata);
  showMeetingLanguages();
}

/**
 * Displays the title based on meetingMetadata at the top of the page
 */
function showMeetingTitle() {
  meetingTitleEl.textContent = meetingMetadata.name;
}

/**
 * Shows the source language and target language at the top of the slide based on meetingMetadata
 */
function showMeetingLanguages() {
  // TODO implement after MVP
}

/**
 * Shows when the meeting was last updated based on meetingMetadata
 */
function showMeetingLastUpdated() {
  // todo
}

function loadingPastMeetingCheck() {
  return window.location.href.includes(PAST_MEETING_URLSEARCHPARAM_FLAG);
}

function initMeeting() {
  if (loadingPastMeetingCheck()) {
    initPastMeeting();
  } else {
    initNewMeeting();
  }
}

//display toast when meeting is saved
function toastPopUp() {
  let toastHTML = "<span>Save successful!</span><button";
  M.toast({ html: toastHTML, classes: "rounded" });
}

//add event listener to save meeting button
saveMeetingEl.addEventListener("click", saveMeeting);

initMeeting();
