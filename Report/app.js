// Navbar
const sections = document.querySelectorAll('section');
const navlist = document.querySelectorAll('nav .nav-container ul li');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  })
  
  navlist.forEach(li => {
    li.classList.remove('active');
    if (li.classList.contains(current)) {
      li.classList.add('active');
    }
  })
})

// Animations
let options = {
  threshold: 0,
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
  });
});

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