// Animations
let options = {
  threshold: 0,
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
  });
}, options);

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// Design Principles Loading
function loadHtml(id, filename) {
  console.log(`div id: ${id}, filename: ${filename}`);

  let xhttp;
  let element = document.getElementById(id);
  let file = filename;

  if (file) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {element.innerHTML = this.responseText;}
        if (this.status == 404) {element.innerHTML = "<h1>PAGE NOT FOUND</h1>";}
      }
    }
    xhttp.open("GET", `Principles/${file}`, true);
    xhttp.send();
    return;
  }
}