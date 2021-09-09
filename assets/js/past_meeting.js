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
