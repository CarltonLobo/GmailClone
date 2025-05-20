const p_badge = document.querySelector(".primary-badge");
const s_badge = document.querySelector(".social-badge");
const pbadge = document.querySelector(".promo-badge");
const u_badge = document.querySelector(".update-badge");
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
      if(notif[0] != 0){
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
          if(parseInt(date.getHours()>12)){
            m = "PM";
            let hour = hour - 12;
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
        emailElement.innerHTML = `
          <div class="email-left">
              <input type="checkbox">
              <span class="material-symbols-outlined">star</span>
              <span class="material-symbols-outlined">label</span>
              <span class="from-name">${mail.sender}</span>
          </div>
          <div class="email-body">
              <span class="email-tab-icon ${icon}-icon" id="email-tab-icon">${type}</span>
              <span class="subject">${mail.subject || " "} </span>
              <span class="email-text">${mail.body}</span>
          </div>
          <div class="email-right">
              <div class="email-hover">
                  <button class="hover-button"><span class="material-symbols-outlined hover-icon">archive</span></button>
                  <button class="hover-button"><span class="material-symbols-outlined hover-icon">delete</span></button>
                  <button class="hover-button"><span class="material-symbols-outlined hover-icon">mark_as_unread</span></button>
                  <button class="hover-button"><span class="material-symbols-outlined hover-icon">schedule</span></button>
              </div>
              <div class="email-time">10:41 PM</div>
          </div>
        `;

        mailContainer.appendChild(emailElement);
      }
    });

  } catch (error) {
    mailContainer.innerHTML = `<p>Error fetching mails: ${error.message}</p>`;
  }
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active-tab from all
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active-tab'));

    // Add active-tab to clicked tab
    tab.classList.add('active-tab');

    // Re-fetch mails for the selected tab
    fetchMails();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerButton = document.querySelector(".header-hamburger-button");
  const sidebar = document.getElementById("sidebar");

  hamburgerButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    document.querySelector(".pages-section").classList.toggle("collapsed");
    document.querySelector(".tabs-section").classList.toggle("collapsed");
    document.querySelector(".main-section").classList.toggle("collapsed");
  });
});

fetchMails();