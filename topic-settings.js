/* Shared topic timing contract for the dock and browser source. */
window.TopicSettings = (() => {
  function normalize(input = {}) {
    const clamp = (value, fallback, min, max) => {
      const n = Number(value);
      return Number.isFinite(n) && n > 0 ? Math.max(min, Math.min(max, n)) : fallback;
    };
    return {
      headingEnabled: input.headingEnabled !== false,
      heading: typeof input.heading === 'string' ? input.heading.trim() : 'Tema da mensagem',
      customDuration: input.customDuration === true,
      automatic: input.automatic !== false,
      duration: clamp(input.duration, 30, 3, 3600),
      speed: clamp(input.speed, 160, 40, 480),
    };
  }
  function seconds(text, input, sharedDuration) {
    const options = normalize(input);
    if (!options.customDuration) return Math.max(3, Math.min(300, Number(sharedDuration) || 30));
    if (!options.automatic) return options.duration;
    // Estimate reading at 15 characters/second at normal speed, with 3s of preparation.
    // Reserve travel time for a full-width source and a conservative 64px per character.
    const count = Array.from(String(text || '').trim()).length;
    return Math.min(
      3600,
      Math.max(
        5,
        Math.ceil(
          3 + Math.max(((count / 15) * 160) / options.speed, (1728 + count * 64) / options.speed),
        ),
      ),
    );
  }
  return { normalize, seconds };
})();
