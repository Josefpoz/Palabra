/* Kleine kontextuelle Hilfen; keine Nutzerdaten werden verändert. */
document.addEventListener('click', event => {
  const btn=event.target.closest('button[data-help-toggle]');
  if(!btn)return;
  const panel=document.getElementById(btn.dataset.helpToggle);
  if(!panel)return;
  panel.hidden=!panel.hidden;
  btn.setAttribute('aria-expanded',String(!panel.hidden));
});
