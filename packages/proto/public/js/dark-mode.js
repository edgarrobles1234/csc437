const body = document.body;
const toggle = document.querySelector("[data-darkmode-toggle] input");

if (toggle) {
  toggle.addEventListener("change", (event) => {
    if (event.target.checked) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  });
}