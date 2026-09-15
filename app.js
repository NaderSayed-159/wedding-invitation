const details = window.invitationDetails;
document.querySelectorAll('[data-detail]').forEach(el => {el.textContent=details[el.dataset.detail] || '';});
document.title = 'دعوة خطوبة — ' + details.name;
const mapLink=document.getElementById('map-link');
if (/^https:\/\//.test(details.mapUrl)) mapLink.href=details.mapUrl; else mapLink.hidden=true;
const cover=document.getElementById('cover'), invitation=document.getElementById('invitation'), openButton=document.getElementById('open');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let openingTimer;
function renderState(event){
  clearTimeout(openingTimer);
  cover.classList.remove('opening');
  openButton.disabled=false;
  const opened=location.hash!==''&&location.hash!=='#closed';
  cover.hidden=opened;invitation.hidden=!opened;
  openButton.setAttribute('aria-expanded',String(opened));
  invitation.classList.toggle('arriving',opened);
  window.scrollTo(0,0);
  if(opened)document.querySelector('h1').focus({preventScroll:true});
  else if(event)openButton.focus({preventScroll:true});
}
openButton.addEventListener('click',()=>{
  if(openButton.disabled)return;
  if(reducedMotion.matches){location.hash='celebration';return;}
  openButton.disabled=true;
  cover.classList.add('opening');
  openingTimer=setTimeout(()=>{location.hash='celebration';},650);
});
document.getElementById('close').addEventListener('click',()=>{location.hash='closed';document.getElementById('audio').pause();document.getElementById('music').setAttribute('aria-pressed','false');document.getElementById('music-label').textContent='اضغط هنا لتشغيل الموسيقى';});
window.addEventListener('hashchange',renderState);renderState();
function updateCountdown(){const timestamp=Date.parse(details.eventDate);if(!Number.isFinite(timestamp)){document.querySelector('.countdown-section').hidden=true;return;}const remaining=Math.max(0,Math.floor((timestamp-Date.now())/1000));const values=[Math.floor(remaining/86400),Math.floor(remaining/3600)%24,Math.floor(remaining/60)%60,remaining%60];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(2,'0'));document.getElementById('countdown-message').hidden=remaining>0;}
updateCountdown();setInterval(updateCountdown,1000);
if(details.musicUrl){const audio=document.getElementById('audio'),button=document.getElementById('music');audio.src=details.musicUrl;document.getElementById('music-wrap').hidden=false;button.addEventListener('click',async()=>{if(audio.paused){try{await audio.play();document.getElementById('music-label').textContent='اضغط هنا لإيقاف الموسيقى';button.setAttribute('aria-pressed','true');}catch{document.getElementById('music-label').textContent='تعذر تشغيل الموسيقى — حاول مجدداً';}}else{audio.pause();document.getElementById('music-label').textContent='اضغط هنا لتشغيل الموسيقى';button.setAttribute('aria-pressed','false');}});}


// Reveal each lower section when it enters the viewport. Content remains
// visible without IntersectionObserver and when reduced motion is enabled.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  }, {threshold:0.12});
  document.querySelectorAll('.countdown-section,.location,footer').forEach(section=>{
    section.classList.add('scroll-reveal');observer.observe(section);
  });
}
// Reveal the venue date once, only when the date itself becomes visible.
const venueDate = document.querySelector('.venue-date');
if (venueDate && 'IntersectionObserver' in window && !reducedMotion.matches) {
  venueDate.setAttribute('aria-label', venueDate.textContent);
  const characters = Array.from(venueDate.textContent);
  venueDate.replaceChildren(...characters.map((character, index) => {
    const span = document.createElement('span');
    span.textContent = character;
    span.className = 'date-character';
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--date-delay', `${index * 75}ms`);
    return span;
  }));
  venueDate.classList.add('date-pending');
  const dateObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('date-animated');
        dateObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.75 });
  dateObserver.observe(venueDate);
}
