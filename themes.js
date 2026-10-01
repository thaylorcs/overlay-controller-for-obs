/* Shared appearance contract for the controller and both OBS browser sources. */
window.OverlayThemes = (() => {
  const defaults = {
    preset: 'classic',
    nameStyle: 'matched',
    primary: '#741D2B',
    secondary: '#D6C6B4',
    textColor: '#FFFFFF',
    nameColor: '#FFFFFF',
    nameBackgroundColor: '#F8FAFC',
    background: 'gradient',
    backgroundColor: '#741D2B',
    backgroundEnd: '#360E16',
    backgroundAngle: 135,
    backgroundOpacity: 100,
    backgroundImage: '',
    imageFit: 'cover',
    radius: 12,
    shine: true,
  };
  const presets = {
    classic: { ...defaults },
    midnight: {
      ...defaults,
      preset: 'midnight',
      primary: '#2563EB',
      secondary: '#93C5FD',
      nameColor: '#FFFFFF',
      nameBackgroundColor: '#172554',
      backgroundColor: '#172554',
      backgroundEnd: '#0F172A',
      radius: 16,
    },
    minimal: {
      ...defaults,
      preset: 'minimal',
      primary: '#27272A',
      secondary: '#71717A',
      nameColor: '#FFFFFF',
      nameBackgroundColor: '#18181B',
      background: 'solid',
      backgroundColor: '#18181B',
      radius: 4,
      shine: false,
    },
    light: {
      ...defaults,
      preset: 'light',
      primary: '#2563EB',
      secondary: '#2563EB',
      textColor: '#172554',
      nameColor: '#172554',
      background: 'solid',
      backgroundColor: '#F8FAFC',
      radius: 12,
      shine: false,
    },
  };
  const color = (v, f) => (/^#[\da-f]{6}$/i.test(v || '') ? v : f);
  const number = (v, f, min, max) =>
    Number.isFinite(Number(v)) && v !== '' ? Math.max(min, Math.min(max, Number(v))) : f;
  function normalize(input = {}) {
    const s = { ...defaults, ...input };
    for (const key of [
      'primary',
      'secondary',
      'textColor',
      'nameColor',
      'backgroundColor',
      'backgroundEnd',
    ])
      s[key] = color(s[key], defaults[key]);
    // Old backups used primary as the card and presenter color.
    if (!('backgroundColor' in input)) s.backgroundColor = s.primary;
    if (!('nameColor' in input)) s.nameColor = s.primary;
    // Supply a contrasting opaque name plate for older configurations.
    const rgb = s.nameColor
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    const luminance = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    s.nameBackgroundColor = color(
      input.nameBackgroundColor,
      luminance > 0.179 ? '#18181B' : '#F8FAFC',
    );
    s.nameStyle = s.nameStyle === 'custom' ? 'custom' : 'matched';
    if (s.nameStyle === 'matched') s.nameColor = s.textColor;
    s.background = ['solid', 'gradient', 'transparent', 'image'].includes(s.background)
      ? s.background
      : 'gradient';
    s.backgroundOpacity = number(s.backgroundOpacity, 100, 0, 100);
    s.backgroundAngle = number(s.backgroundAngle, 135, 0, 360);
    s.radius = number(s.radius, 12, 0, 40);
    s.nameWidth = number(s.nameWidth, 700, 420, 1200);
    s.duration = number(s.duration, 30, 3, 300);
    s.namePosition = ['left', 'center', 'right'].includes(s.namePosition)
      ? s.namePosition
      : 'center';
    s.imageFit = ['cover', 'contain'].includes(s.imageFit) ? s.imageFit : 'cover';
    s.backgroundImage =
      typeof s.backgroundImage === 'string' &&
      s.backgroundImage.length < 1500000 &&
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s.backgroundImage)
        ? s.backgroundImage
        : '';
    return s;
  }
  function apply(input) {
    const s = normalize(input),
      style = document.documentElement.style;
    const bg =
      s.background === 'transparent'
        ? 'none'
        : s.background === 'gradient'
          ? `linear-gradient(${s.backgroundAngle}deg,${s.backgroundColor},${s.backgroundEnd})`
          : s.background === 'image' && s.backgroundImage
            ? `url("${s.backgroundImage}")`
            : 'none';
    Object.entries({
      '--surface-image': bg,
      '--surface-color': s.background === 'transparent' ? 'transparent' : s.backgroundColor,
      '--surface-opacity': s.backgroundOpacity / 100,
      '--surface-fit': s.imageFit,
      '--theme-text': s.textColor,
      '--theme-name': s.nameColor,
      '--name-background': s.nameBackgroundColor,
      '--theme-accent': s.secondary,
      '--theme-radius': s.radius + 'px',
      '--theme-shine': s.shine === false || s.background === 'transparent' ? 'none' : 'block',
    }).forEach(([k, v]) => style.setProperty(k, v));
    document.documentElement.dataset.nameStyle = s.nameStyle;
    document.documentElement.dataset.transparent = s.background === 'transparent';
    return s;
  }
  return { defaults, presets, normalize, apply };
})();
