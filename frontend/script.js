async function fetchMails() {
  try {
    const response = await fetch("http://localhost:8000/api/mail/getAll");
    const mails = await response.json();
    console.log(mails);
  } catch (error) {
    mailContainer.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
  }
}

fetchMails();

const buttons = document.querySelectorAll(".sidebar-category-button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active")); // remove from all
    button.classList.add("active"); // add to clicked
  });
});
