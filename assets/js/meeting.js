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
  });

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
