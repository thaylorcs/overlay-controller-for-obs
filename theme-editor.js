const themeLabels = {
  en: {
    appearance: 'Themes & background',
    preset: 'THEME',
    classic: 'Classic · Wine',
    midnight: 'Midnight · Blue',
    minimal: 'Minimal · Charcoal',
    light: 'Light',
    custom: 'Custom',
    background: 'BACKGROUND',
    solid: 'Solid',
    gradient: 'Gradient',
    transparent: 'Transparent',
    image: 'Image',
    backgroundColor: 'BACKGROUND COLOR',
    backgroundEnd: 'GRADIENT END',
    backgroundAngle: 'ANGLE (°)',
    backgroundOpacity: 'BACKGROUND OPACITY (%)',
    textColor: 'CARD TEXT',
    nameColor: 'PRESENTER TEXT',
    nameBackgroundColor: 'PRESENTER BACKGROUND',
    nameStyle: 'PRESENTER STYLE',
    matched: 'Match lower card (default)',
    radius: 'CORNERS (PX)',
    shine: 'Animated shine',
    imageFit: 'IMAGE FIT',
    cover: 'Cover',
    contain: 'Contain',
    imageUpload: 'Choose image (PNG, JPEG, WebP; max 1 MB)',
    removeImage: 'Remove image',
    preview: 'Live preview',
    previewHint:
      'Preview only. Save to use on the next trigger in OBS. The checkerboard represents transparency; the scene stays visible outside the cards.',
    imageError: 'Use a PNG, JPEG or WebP image up to 1 MB.',
    storageError: 'Could not save. Storage may be full; try a smaller background image.',
    customHint:
      'Choose a theme as a starting point, then adjust its colors, background and corners. Images are included in JSON backups.',
  },
  'pt-BR': {
    appearance: 'Temas e fundo',
    preset: 'TEMA',
    classic: 'Clássico · Vinho',
    midnight: 'Noturno · Azul',
    minimal: 'Minimalista · Grafite',
    light: 'Claro',
    custom: 'Personalizado',
    background: 'FUNDO',
    solid: 'Sólido',
    gradient: 'Degradê',
    transparent: 'Transparente',
    image: 'Imagem',
    backgroundColor: 'COR DO FUNDO',
    backgroundEnd: 'COR FINAL DO DEGRADÊ',
    backgroundAngle: 'ÂNGULO (°)',
    backgroundOpacity: 'OPACIDADE DO FUNDO (%)',
    textColor: 'TEXTO DO CARTÃO',
    nameColor: 'TEXTO DO APRESENTADOR',
    nameBackgroundColor: 'FUNDO DO NOME DO PREGADOR',
    nameStyle: 'ESTILO DO NOME DO PREGADOR',
    matched: 'Igual ao cartão inferior (padrão)',
    radius: 'CANTOS (PX)',
    shine: 'Brilho animado',
    imageFit: 'AJUSTE DA IMAGEM',
    cover: 'Preencher',
    contain: 'Conter',
    imageUpload: 'Escolher imagem (PNG, JPEG, WebP; máx. 1 MB)',
    removeImage: 'Remover imagem',
    preview: 'Prévia ao vivo',
    previewHint:
      'Somente prévia. Salve para usar no próximo acionamento no OBS. O quadriculado representa transparência; a cena continua visível fora dos cartões.',
    imageError: 'Use uma imagem PNG, JPEG ou WebP de até 1 MB.',
    storageError:
      'Não foi possível salvar. O armazenamento pode estar cheio; tente uma imagem menor.',
    customHint:
      'Escolha um tema como ponto de partida e ajuste cores, fundo e cantos. As imagens são incluídas no backup JSON.',
  },
};
themeLabels.en.primaryColor = 'CONTROLLER ACCENT';
themeLabels.en.secondaryColor = 'DECORATIVE ACCENT';
themeLabels['pt-BR'].primaryColor = 'DESTAQUE DO PAINEL';
themeLabels['pt-BR'].secondaryColor = 'DETALHES DO CARTÃO';
for (const language of Object.keys(themeLabels))
  Object.assign(I18N[language], themeLabels[language]);
let draftImage = '';
const extraFields = [
  'nameStyle',
  'background',
  'backgroundColor',
  'backgroundEnd',
  'backgroundAngle',
  'backgroundOpacity',
  'textColor',
  'nameColor',
  'nameBackgroundColor',
  'radius',
  'imageFit',
];
const section = document.createElement('div');
section.className = 'settingsSection';
const options = (values) =>
  values.map((v) => `<option value="${v}" data-i18n="${v}"></option>`).join('');
const field = (key, control) =>
  `<div class="field" data-field="${key}"><label for="${key}" data-i18n="${key}"></label>${control}</div>`;
section.innerHTML =
  '<h3 data-i18n="appearance"></h3>' +
  field(
    'preset',
    `<select id="preset">${options(['classic', 'midnight', 'minimal', 'light', 'custom'])}</select>`,
  ) +
  '<div class="hint" data-i18n="customHint"></div>' +
  field(
    'background',
    `<select id="background">${options(['solid', 'gradient', 'transparent', 'image'])}</select>`,
  ) +
  field('nameStyle', `<select id="nameStyle">${options(['matched', 'custom'])}</select>`) +
  '<div class="grid2">' +
  ['backgroundColor', 'backgroundEnd', 'textColor', 'nameColor', 'nameBackgroundColor']
    .map((k) => field(k, `<input id="${k}" type="color">`))
    .join('') +
  ['backgroundAngle', 'backgroundOpacity', 'radius']
    .map((k, i) => field(k, `<input id="${k}" type="number" min="0" max="${[360, 100, 40][i]}">`))
    .join('') +
  '</div>' +
  '<div id="imageOptions">' +
  field('imageFit', `<select id="imageFit">${options(['cover', 'contain'])}</select>`) +
  '<div class="field"><label for="backgroundFile" data-i18n="imageUpload"></label><input id="backgroundFile" type="file" accept="image/png,image/jpeg,image/webp"></div><button id="removeImage" class="widebtn" data-i18n="removeImage"></button></div>' +
  '<div class="field"><label><input id="shine" type="checkbox" style="width:auto;height:auto"> <span data-i18n="shine"></span></label></div>' +
  '<h3 data-i18n="preview"></h3><div class="overlayPreview"><iframe id="namePreview" title="Name overlay preview" src="name-overlay.html?preview"></iframe><iframe id="socialPreview" title="Social overlay preview" src="social-overlay.html?preview"></iframe></div><div class="hint" data-i18n="previewHint"></div>';
// Keep General first; appearance follows the main configuration.
$('language').closest('.settingsSection').after(section);
function readThemeDraft() {
  const s = {
    ...cfg.theme,
    preset: $('preset').value,
    backgroundImage: draftImage,
    shine: $('shine').checked,
    primary: $('primaryColor').value,
    secondary: $('secondaryColor').value,
    font: $('font').value,
    nameWidth: $('nameWidth').value,
    namePosition: $('namePosition').value,
    nameShadow: $('nameShadow').checked,
    duration: $('duration').value,
  };
  for (const key of extraFields) s[key] = $(key).value;
  return OverlayThemes.normalize(s);
}
function fillThemeEditor(s = cfg.theme) {
  s = OverlayThemes.normalize(s);
  draftImage = s.backgroundImage;
  for (const k of extraFields) $(k).value = s[k];
  $('preset').value = OverlayThemes.presets[s.preset] ? s.preset : 'custom';
  $('shine').checked = s.shine !== false;
  updateThemePreview();
}
function updateThemePreview() {
  const s = readThemeDraft();
  for (const k of ['nameColor', 'nameBackgroundColor'])
    section.querySelector(`[data-field="${k}"]`).hidden = s.nameStyle === 'matched';
  $('imageOptions').hidden = s.background !== 'image';
  for (const k of ['backgroundEnd', 'backgroundAngle'])
    section.querySelector(`[data-field="${k}"]`).hidden = s.background !== 'gradient';
  for (const k of ['backgroundColor', 'backgroundOpacity'])
    section.querySelector(`[data-field="${k}"]`).hidden = s.background === 'transparent';
  const settings = { ...s, duration: 300 };
  $('namePreview').contentWindow.postMessage(
    {
      type: 'overlay-preview',
      payload: {
        ...(cfg.people[0] || { name: 'Example', role: 'Presenter', instagram: 'example' }),
        _settings: settings,
      },
    },
    '*',
  );
  $('socialPreview').contentWindow.postMessage(
    { type: 'overlay-preview', payload: { ...cfg.social, _settings: settings } },
    '*',
  );
}
$('preset').onchange = () => {
  const p = OverlayThemes.presets[$('preset').value];
  if (!p) return;
  for (const [id, key] of [
    ['primaryColor', 'primary'],
    ['secondaryColor', 'secondary'],
  ]) {
    $(id).value = p[key];
    $(id + 'Picker').value = p[key];
  }
  fillThemeEditor({ ...readThemeDraft(), ...p });
};
$('settings').addEventListener('input', (e) => {
  if (e.target.id === 'backgroundFile' || e.target.id === 'preset') return;
  if (
    extraFields.includes(e.target.id) ||
    [
      'shine',
      'primaryColor',
      'secondaryColor',
      'primaryColorPicker',
      'secondaryColorPicker',
    ].includes(e.target.id)
  )
    $('preset').value = 'custom';
  updateThemePreview();
});
$('backgroundFile').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 1024 * 1024 || !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    status(t('imageError'), true);
    e.target.value = '';
    return;
  }
  try {
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const img = new Image();
    img.src = url;
    await img.decode();
    draftImage = url;
    $('preset').value = 'custom';
    updateThemePreview();
  } catch {
    status(t('imageError'), true);
  }
  e.target.value = '';
};
$('removeImage').onclick = () => {
  draftImage = '';
  $('preset').value = 'custom';
  updateThemePreview();
};
for (const id of ['namePreview', 'socialPreview']) $(id).onload = updateThemePreview;
const oldFillSettings = fillSettings;
fillSettings = () => {
  oldFillSettings();
  fillThemeEditor();
};
const oldSaveSettings = $('saveSettings').onclick;
$('saveSettings').onclick = () => {
  const previous = clone(cfg);
  cfg.theme = readThemeDraft();
  try {
    oldSaveSettings();
    fillSettings();
  } catch {
    cfg = previous;
    status(t('storageError'), true);
  }
};
const previewBox = section.querySelector('.overlayPreview');
new ResizeObserver(() => {
  const scale = previewBox.clientWidth / 1920;
  for (const id of ['namePreview', 'socialPreview']) {
    $(id).style.transform = `scale(${scale})`;
    $(id).style.marginBottom = 250 * scale - 250 + 'px';
  }
}).observe(previewBox);
fillThemeEditor();
applyI18n();
