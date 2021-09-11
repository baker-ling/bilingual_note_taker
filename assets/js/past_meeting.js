const PAST_MEETING_URLSEARCHPARAM_FLAG = "?past_meeting=true";

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
    // listItemAnchor.setAttribute(
    //   "href",
    //   `meeting.html?${PAST_MEETING_ID_SEARCH_PARAM_KEY}=${encodeURI(
    //     meeting.pantryId
    //   )}`
    // ); // todo make link works and that .name attribute is correct
    listItemAnchor.textContent = `${meeting.name} — ${meeting.date} — ${meeting.pantryId}`; // todo make sure date displays correctly
    listItemAnchor.dataset.name = meeting.name;
    listItemAnchor.dataset.pantryId = meeting.pantryId;
    listItemAnchor.dataset.sourceLanguage = meeting.sourceLanguage;
    listItemAnchor.dataset.targetLanguage = meeting.targetLanguage;
    listItemAnchor.dataset.lastUpdated = meeting.lastUpdated;
    listItem.appendChild(listItemAnchor);
    pastMeetingsUL.appendChild(listItem);
  }
}

function pastMeetingListOnclickHandler(event) {
  // get meeting metadata from anchor element that was clicked, put it in session storage,
  // and transition to meeting.html with a flag to indicate that we are loading a past meeting 
  const clickedMeeting = event.target;
  sessionStorage.setItem(CURRENT_MEETING_SESSION_KEY, JSON.stringify(clickedMeeting.dataset));
  window.location.assign('meeting.html' + PAST_MEETING_URLSEARCHPARAM_FLAG);
}