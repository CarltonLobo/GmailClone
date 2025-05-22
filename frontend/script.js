const p_badge = document.querySelector(".primary-badge");
p_badge.classList.remove('primary-badge');
const s_badge = document.querySelector(".social-badge");
s_badge.classList.remove('social-badge');
const pbadge = document.querySelector(".promo-badge");
pbadge.classList.remove('promo-badge');
const u_badge = document.querySelector(".update-badge");
u_badge.classList.remove('update-badge');
let mailType;

async function fetchMails() {
  const mailContainer = document.getElementById("mail-container")// Adjust this selector if needed
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let notif = [0,0,0,0];

  try {
    const response = await fetch("http://localhost:8000/api/mail/getAll");
    const mails = await response.json();

    mailContainer.innerHTML = ''; // Clear existing emails
    
    if (document.getElementById("primary-tab").classList.contains("active-tab"))
      mailType = "primary";
    else if(document.getElementById("social-tab").classList.contains("active-tab"))
      mailType = "social";
    else if(document.getElementById("promo-tab").classList.contains("active-tab"))
      mailType = "promotions";
    else if(document.getElementById("updates-tab").classList.contains("active-tab"))
      mailType = "updates";
    
    mails.forEach(mail => {
      if(mail.status != "seen"){
        if(mail.type == "primary"){
          notif[0]+=1;
        }
        else if(mail.type == "social"){
          notif[1]+=1;
        }
        else if(mail.type == "promotions"){
          notif[2]+=1;
        }
        else if(mail.type == "updates"){
          notif[3]+=1;
        }
      }
      p_badge.classList.remove('primary-badge');
      if(notif[0] != 0){
        p_badge.classList.add('primary-badge');
      p_badge.textContent = notif[0] + ' new';
      }
      s_badge.classList.remove('social-badge');
      if(notif[1] != 0){
        s_badge.classList.add('social-badge');
      s_badge.textContent = notif[1] + ' new';
      }
      pbadge.classList.remove('promo-badge');
      if(notif[2] != 0){
        pbadge.classList.add('promo-badge');
      pbadge.textContent = notif[2] + ' new';
      }
      u_badge.classList.remove('update-badge');
      if(notif[3] != 0){
        u_badge.classList.add('update-badge');
        u_badge.textContent = notif[3] + ' new';
      }
      if((mail.type == mailType) || (mailType == "primary" && (mail.type == "promotions" || mail.type == "updates"))){
        console.log(mail);
        const emailElement = document.createElement('div');
        if(mail.status == "seen")
          emailElement.classList.add('email-seen');
        else
          emailElement.classList.add('email-unseen');
        let date = new Date(mail.createdAt);
        let today = new Date();
        let time = "Default Time";
        if((today-date)<24*60*60*1000){
          let m = "AM";
          let hour = date.getHours();
          let minute = String(date.getMinutes()).padStart(2, '0');
          if(hour>12){
            m = "PM";
            hour = hour - 12;
          }
          time = hour+":"+minute+" "+m;
        }
        else{
          time = monthNames[date.getMonth()] + " " + date.getDate();
        }
        let icon = "no";
        let type = "";
        if(mail.type == "promotions"){
          icon = "promo";
          type = "Promotions";
        }
        else if(mail.type == "updates"){
          icon = "updates";
          type = "Updates";
        }
        let strclass = 'rounded'
        if(mail.starred){
          strclass = 'outlined'
        }

        emailElement.innerHTML = `
          <div class="email-left">
              <input type="checkbox">
              <button class="left-button mail-star"><span class="material-symbols-${strclass}">star</span></button>
              <button class="left-button"><span class="material-symbols-rounded">label</span></button>
              <span class="from-name">${mail.sender}</span>
          </div>
          <div class="email-body">
              <span class="email-tab-icon ${icon}-icon" id="email-tab-icon">${type}</span>
              <span class="subject">${mail.subject || " "} - </span>
              <span class="email-text">${mail.body}</span>
          </div>
          <div class="email-right">
              <div class="email-hover">
                  <button class="hover-button archive-mail"><span class="material-symbols-outlined hover-icon">archive</span></button>
                  <button class="hover-button delete-mail"><span class="material-symbols-outlined hover-icon">delete</span><div class="email-id">${mail._id}</div></button>
                  <button class="hover-button unread-mail"><span class="material-symbols-outlined hover-icon">mark_as_unread</span></button>
                  <button class="hover-button snooze-mail"><span class="material-symbols-outlined hover-icon">schedule</span></button>
              </div>
              <div class="email-time">${time}</div>
          </div>
        `;

        mailContainer.appendChild(emailElement);
      }
    });
    document.querySelectorAll('.email-unseen').forEach(mail =>{
      const delbut = mail.querySelector('.delete-mail');
      const id = delbut.querySelector(".email-id").textContent;
      const strbut = mail.querySelector('.mail-star');
      delbut.addEventListener('click', () =>{
        delMail(id);
      })
      strbut.addEventListener('click', () =>{
        star(id);
      })
      mail.addEventListener('click', ()=>{
        readMail(id);
      })
    })
    document.querySelectorAll('.email-seen').forEach(mail =>{
      const delbut = mail.querySelector('.delete-mail');
      const id = delbut.querySelector(".email-id").textContent;
      const strbut = mail.querySelector('.mail-star');
      const unseenButton = mail.querySelector('.unread-mail');
      delbut.addEventListener('click', () =>{
        delMail(id);
      })
      strbut.addEventListener('click', () =>{
        star(id);
      })
      unseenButton.addEventListener('click', ()=>{
        readMail(id);
      })
    })
    
  } catch (error) {
    mailContainer.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
  }
}

async function delMail(id) {
  try {
    const response = await fetch(`http://localhost:8000/api/mail/delete/${id}`, {method:'DELETE'});
    fetchMails(); 
    if (response.ok) {
      console.log("Successful Delete");
    } else {
      console.error("Failed to delete mail");
    }
  } catch (error) {
    console.error("Error deleting mail:", error);
  }
}
async function star(id) {
  try{
    const response = await fetch(`http://localhost:8000/api/mail/star/${id}`, {method:'PATCH'});
    if (response.ok) {
        console.log("Successfull star");
      } else {
        console.error("Failed to delete mail");
      }
    fetchMails();
  }catch(error) {
    console.error("Error deleting mail:", error);
  }
}
async function readMail(id) {
  try{
    const response = await fetch(`http://localhost:8000/api/mail/read/${id}`, {method:'PATCH'});
    if (response.ok) {
        console.log("Successfull read");
      } else {
        console.error("Failed to delete mail");
      }
    fetchMails();
  }catch(error) {
    console.error("Error deleting mail:", error);
  }
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active-tab'));

    tab.classList.add('active-tab');

    fetchMails();
  });
});
document.querySelector('.header-gmail-button').addEventListener('click', ()=>{
  fetchMails();
  console.log("Reload Page");
})

document.querySelector(".header-hamburger-button").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("collapsed");
  document.querySelector(".pages-section").classList.toggle("collapsed");
  document.querySelector(".tabs-section").classList.toggle("collapsed");
  document.querySelector(".main-section").classList.toggle("collapsed");
});

fetchMails();