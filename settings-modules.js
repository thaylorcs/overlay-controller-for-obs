// Keep the original fields mounted so folding a module never discards edits.
(() => {
  const storageKey = KEY + '-settings-modules';
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {}
  Object.assign(I18N.en, { expandModules: 'Expand all', collapseModules: 'Collapse all' });
  Object.assign(I18N['pt-BR'], {
    expandModules: 'Expandir tudo',
    collapseModules: 'Recolher tudo',
  });
  const modules = [];
  function remember() {
    const state = Object.fromEntries(modules.map((m) => [m.key, !m.body.hidden]));
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }
  function setOpen(module, open) {
    module.body.hidden = !open;
    module.button.setAttribute('aria-expanded', String(open));
    module.container.classList.toggle('expanded', open);
    if (open && module.key === 'appearance') updateThemePreview();
  }
  document.querySelectorAll('#settings > .settingsSection').forEach((container, index) => {
    const heading = container.querySelector('h3');
    const key = heading.dataset.i18n || 'connection';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'moduleToggle';
    button.id = 'module-toggle-' + key;
    const label = document.createElement('span');
    label.textContent = heading.textContent;
    if (heading.dataset.i18n) {
      label.dataset.i18n = heading.dataset.i18n;
      delete heading.dataset.i18n;
    }
    button.append(label);
    heading.replaceChildren(button);
    const body = document.createElement('div');
    body.className = 'moduleBody';
    body.id = 'module-body-' + key;
    body.setAttribute('role', 'region');
    body.setAttribute('aria-labelledby', button.id);
    while (heading.nextSibling) body.append(heading.nextSibling);
    container.append(body);
    container.classList.add('settingsModule');
    button.setAttribute('aria-controls', body.id);
    const module = { key, container, button, body };
    modules.push(module);
    setOpen(module, saved[key] === true);
    button.onclick = () => {
      setOpen(module, body.hidden);
      remember();
    };
  });
  const toolbar = document.createElement('div');
  toolbar.className = 'moduleActions';
  for (const [key, open] of [
    ['expandModules', true],
    ['collapseModules', false],
  ]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'widebtn';
    button.dataset.i18n = key;
    button.onclick = () => {
      modules.forEach((module) => setOpen(module, open));
      remember();
    };
    toolbar.append(button);
  }
  $('settings').prepend(toolbar);
  applyI18n();
})();
