/* Pantry Api Steps:
  1. On savecreate a basket for notes with an identifier(code to share).
   -POST to Pantry using meeting name as basket name and identifier.
  2. Retrieve the corresponding basket and display it when user wants to view past meeting notes.
   -GET from pantry and render it to the page.
   2 ways:
   1. By clicking on the list
   2. By searching with a code
    
  */

/* Local Storage steps:
1. Create an array of objects.
2. On save push object to array and save it on local storage
*/

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
