// Measure the rendered text, including the chosen font and each model's padding.
// This same routine runs in the preview and the OBS browser source.
window.fitPresenterName = (settings) => {
  const lower = document.getElementById('lower');
  const card = document.querySelector('.card');
  const text = document.getElementById('nameText');
  const limits = OverlayThemes.nameLimits;
  const availableCanvas = document.querySelector('.stage').clientWidth * 0.9;
  const maximum = Math.min(limits.maxWidth, availableCanvas);
  const setWidth = (width) => {
    lower.style.width = width + 'px';
    card.style.width = width + 'px';
  };
  text.style.fontSize = '';
  setWidth(Math.min(settings.nameWidth, maximum));
  const baseFont = parseFloat(getComputedStyle(text).fontSize);
  const range = document.createRange();
  range.selectNodeContents(text);
  const textWidth = () => range.getBoundingClientRect().width;
  const fits = () => textWidth() <= text.clientWidth;
  if (settings.nameAutoFit && !fits()) {
    const padding = lower.getBoundingClientRect().width - text.clientWidth;
    setWidth(Math.min(maximum, Math.ceil(textWidth() + padding + 2)));
    if (!fits()) {
      let low = limits.minFontSize;
      let high = baseFont;
      let best = low;
      while (high - low >= 0.25) {
        const size = (low + high) / 2;
        text.style.fontSize = size + 'px';
        if (fits()) {
          best = size;
          low = size;
        } else high = size;
      }
      text.style.fontSize = best + 'px';
    }
  }
  const result = {
    clipped: !fits(),
    width: lower.getBoundingClientRect().width,
    fontSize: parseFloat(getComputedStyle(text).fontSize),
  };
  lower.dataset.nameClipped = String(result.clipped);
  return result;
};
