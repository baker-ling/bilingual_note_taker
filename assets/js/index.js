

//For directing to next page on save meeting button
// window.location.href = "meeting.html";

// Adding and Removing items on notes

const inputText = document.getElementById("txt");
const myButton = document.getElementsByClassName("insert-below-button");

let options = [];
document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.dropdown-trigger');
    let instances = M.Dropdown.init(elems, options);
  });


document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.dropdown-trigger2');
    let instances = M.Dropdown.init(elems, options);
  });
