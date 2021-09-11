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

