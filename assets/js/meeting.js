const pantryKey = "238364cb-50ff-45e2-8f91-9e2d44b71215";
let meetingMetadata;

// Elements from DOM
const mainElement = document.querySelector('main');
const saveMeetingEl = document.querySelector("#save-button-bottom");
const meetingTitleEl = document.querySelector('#meeting-title');

/**
 * Callback function for original note textareas to automatically
 * translate contents.
 * @param {Event} event
 */
function translateTextareaCallback(event) {
  translateTextarea(event.target);
}

function insertRow(currentRow) {
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
                <i class="material-icons white-text">edit</i>
            </a>`;
         
  // //todo add callbacks for delete and edit
  // // insert after new row
 
  mainElement.insertBefore(RowElement, currentRow.nextSibling); 
    
}

function mainElementonclickListener(event) {
  console.log(event)
  if (event.target.classList.contains("insert-below-button")) {
    let currentRow = event.target;
    currentRow = event.target.closest("div");
    insertRow(currentRow);
  } 
  else if(event.target.classList.contains("delete-button")) {
    let currentRow = event.target;
    currentRow = event.target.closest("div");
    deleteRow(currentRow);
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
bottomExitButton.addEventListener("click",
  function () {
    location.href = "./past_meetings.html";
  }
);




//add event listener to save meeting button
saveMeetingEl.addEventListener("click", saveToPantry);

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
  location.assign("./past_meetings.html");
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


/**
 * Displays a past meeting.
 * @param {Object} meeting - Past meeting object with its notes included.
 */
 function displayPastMeeting(meeting) {
  showMeetingTitle(meeting.title); // TODO make sure this exists
  showMeetingLanguages(meeting.sourceLang, meeting.targetLang); // TODO I am assuming that this function would also display those languages above each column of notes
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

function initNewMeeting() {
  meetingMetadata = sessionStorage.getItem(CURRENT_MEETING_SESSION_KEY);
  showMeetingTitle(meetingMetadata.title);
  showMeetingLanguages(meetingMetadata.sourceLanguage, meetingMetadata.targetLanguage);

}

/**
 * Displays the title given at the top of the page
 * @param {string} title 
 */
function showMeetingTitle(title) {
  meetingTitleEl.textContent = title;
}

/**
 * Shows the source language and target language at the top of the slide
 * @param {string} sourceLanguage 
 * @param {string} targetLanguage 
 */
function showMeetingLanguages(sourceLanguage, targetLanguage) {
  // TODO implement after MVP
}

function initMeeting() {
  if (loadingPastMeeting()) {
    initPastMeeting();
  } else {
    initNewMeeting();
  }
}

// /**
//  * Code to intialize meeting.html
//  */
// if (checkForPastMeetingSearchParam()) {
//   initPastMeeting();
// } else {
//   initNewMeeting(); // todo make sure that this call matches what Cooper is working on
// }
