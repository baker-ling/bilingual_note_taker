
// Global constants for various keys
const PAST_MEETINGS_LS_KEY = 'past_meetings'; // TODO: Make sure same keys is used for storing past meeting metadata in local storage
const PAST_MEETING_ID_SEARCH_PARAM_KEY = 'past_meeting_name';

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
        listItemAnchor.setAttribute('href', `meeting.html?${PAST_MEETING_ID_SEARCH_PARAM_KEY}=${encodeURI(meeting.pantryId)}`) // todo make link works and that .name attribute is correct
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
    showMeetingTitle(meeting.title);    // TODO make sure this exists
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
    return window.location.pathname.toString().endsWith('meeting.html')
           && new URLSearchParams(window.location.search).has(PAST_MEETING_ID_SEARCH_PARAM_KEY); // todo make sure this fits the code for loading past meetings
}

function initPastMeeting() {
    const meetingId = new URLSearchParams(window.location.search).get(PAST_MEETING_ID_SEARCH_PARAM_KEY);
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