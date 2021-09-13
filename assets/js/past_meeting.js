function displayPastMeetingsList() {
  const pastMeetingsJSON = localStorage.getItem(PAST_MEETINGS_LS_KEY);
  const pastMeetings = JSON.parse(pastMeetingsJSON);

  const pastMeetingsUL = document.querySelector("#past-meeting-list ul");
  //make sure pastMeetingsUL has no children
  while (pastMeetingsUL.firstChild) {
    pastMeetingsUL.removeChild(pastMeetingsUL.firstChild);
  }
  
  if (pastMeetings.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "No meeting notes have been saved with this device.";
    pastMeetingsUL.appendChild(listItem)
  } else {
    //add list items for each meeting
    for (const meeting of pastMeetings) {
      const pastMeetingMetadata = meeting.meetingMetadata
      const listItem = document.createElement("li");
      const listItemAnchor = document.createElement("a");
      listItemAnchor.textContent = `${pastMeetingMetadata.name} — ${pastMeetingMetadata.pantryId}`; // todo make sure date displays correctly
      listItemAnchor.dataset.name = pastMeetingMetadata.name;
      listItemAnchor.dataset.pantryId = pastMeetingMetadata.pantryId;
      listItemAnchor.dataset.sourceLanguage = pastMeetingMetadata.sourceLanguage;
      listItemAnchor.dataset.targetLanguage = pastMeetingMetadata.targetLanguage;
      listItem.appendChild(listItemAnchor);
      pastMeetingsUL.appendChild(listItem);
    }
    // attach event listener to pastMeetingsUL
    pastMeetingsUL.addEventListener("click", pastMeetingListOnclickHandler);
  }
}

//function to GET(retrieve notes) from Pantry using identifier
async function getNotesFromPantry() {
  let response = await fetch(
    `https://getpantry.cloud/apiv1/pantry/${PANTRY_KEY}/basket/${meetingMetadata.pantryId}`,
    {
      method: "GET",
      headers: { "Content-type": "application/json" },
    }
  );
  const data = await response.json();
  console.log(data.notes);
  return data.notes;
}

function pastMeetingListOnclickHandler(event) {
  // get meeting metadata from anchor element that was clicked, put it in session storage,
  // and transition to meeting.html with a flag to indicate that we are loading a past meeting 
  const clickedMeeting = event.target;
  sessionStorage.setItem(CURRENT_MEETING_SESSION_KEY, JSON.stringify(clickedMeeting.dataset));
  window.location.assign('meeting.html' + PAST_MEETING_URLSEARCHPARAM_FLAG);
}

function openPastMeetingFromUserEnteredCode(event) {
  event.preventDefault();
  //get meeting identifier from input field
  const codeInputElement = document.getElementById("meeting-code-input");
  const codeInputText = codeInputElement.value.trim();

  //todo make sure that meeting exists

  //put meeting id into session storage
  const metaData = {pantryId: codeInputText};
  sessionStorage.setItem(CURRENT_MEETING_SESSION_KEY, JSON.stringify(metaData));

  //transition to meeting.html
  window.location.assign('meeting.html' + PAST_MEETING_URLSEARCHPARAM_FLAG);
}

function initPastMeetingsPage() {
  const lookUpMeetingForm = document.querySelector("form");
  lookUpMeetingForm.addEventListener("submit", openPastMeetingFromUserEnteredCode);
  const lookUpMeetingButton = document.querySelector("a.btn");
  lookUpMeetingButton.addEventListener("click", openPastMeetingFromUserEnteredCode);
  displayPastMeetingsList();
}

initPastMeetingsPage();