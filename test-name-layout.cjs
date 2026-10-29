const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const os = require('node:os');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.TEST_BROWSER || 'msedge',
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 250 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve('name-overlay.html')).href);
    await page.addStyleTag({ content: '*{transition:none!important;animation:none!important}' });
    const names = [
      'Ana',
      'Maria Aparecida de Albuquerque Vasconcelos',
      'João Guilherme de Oliveira e Silva',
    ];
    for (const model of ['classic', 'sidebar', 'identity'])
      for (const position of ['left', 'center', 'right'])
        for (const font of ['"Segoe UI",Arial,sans-serif', 'Arial,sans-serif'])
          for (const name of names)
            for (const fields of [
              { role: 'Pregador convidado', instagram: 'igrejaexemplo' },
              { role: '', instagram: '' },
              { role: 'Pregador', instagram: '' },
              { role: '', instagram: 'igrejaexemplo' },
            ]) {
              const result = await page.evaluate(
                ({ model, position, font, name, fields }) => {
                  window.dispatchEvent(
                    new CustomEvent('oocLowerThirdShow', {
                      detail: {
                        name,
                        ...fields,
                        _settings: {
                          nameModel: model,
                          namePosition: position,
                          font,
                          nameAutoFit: true,
                          nameWidth: 700,
                        },
                      },
                    }),
                  );
                  const l = document.querySelector('#lower'),
                    text = document.querySelector('#nameText');
                  const rect = l.getBoundingClientRect();
                  const t = text.getBoundingClientRect();
                  const role = document.querySelector('#role').getBoundingClientRect();
                  const social = document.querySelector('#social').getBoundingClientRect();
                  return {
                    clipped: l.dataset.nameClipped,
                    width: rect.width,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    font: parseFloat(getComputedStyle(text).fontSize),
                    overlap:
                      (role.height > 0 && t.bottom > role.top) ||
                      (social.height > 0 && t.bottom > social.top),
                  };
                },
                { model, position, font, name, fields },
              );
              assert.equal(result.clipped, 'false', JSON.stringify({ model, name, font, result }));
              assert(result.width <= 1728 && result.width >= 700);
              assert(result.left >= 95.9 && result.right <= 1824.1);
              assert(result.bottom <= 250);
              assert(result.font >= 32);
              assert(!result.overlap);
              if (name === 'Ana') assert.equal(result.width, 700);
            }
    // Max width remains usable without automatic fitting, and old widths are untouched.
    for (const model of ['classic', 'sidebar', 'identity']) {
      const result = await page.evaluate((model) => {
        show({
          name: 'Maria Aparecida de Albuquerque Vasconcelos',
          _settings: { nameModel: model, nameWidth: 1728 },
        });
        return document.querySelector('#lower').dataset.nameClipped;
      }, model);
      assert.equal(result, 'false');
    }
    for (const model of ['classic', 'sidebar', 'identity']) {
      await page.evaluate(
        (model) =>
          show({ name: 'W'.repeat(300), _settings: { nameModel: model, nameAutoFit: true } }),
        model,
      );
      assert.equal(await page.locator('#lower').getAttribute('data-name-clipped'), 'true');
      assert.equal(
        await page.locator('#nameText').evaluate((e) => parseFloat(getComputedStyle(e).fontSize)),
        32,
      );
    }
    await page.evaluate(() =>
      show({
        name: 'Maria Aparecida de Albuquerque Vasconcelos',
        role: 'Pregadora',
        instagram: 'igrejaexemplo',
        _settings: { nameWidth: 700 },
      }),
    );
    await page.screenshot({ path: path.join(os.tmpdir(), 'issue7-before.png') });
    await page.evaluate(() =>
      show({
        name: 'Maria Aparecida de Albuquerque Vasconcelos',
        role: 'Pregadora',
        instagram: 'igrejaexemplo',
        _settings: { nameWidth: 700, nameAutoFit: true },
      }),
    );
    await page.screenshot({ path: path.join(os.tmpdir(), 'issue7-after.png') });
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('oocLowerThirdHide')));
    assert.equal(await page.locator('#lower').evaluate((e) => getComputedStyle(e).opacity), '0');
    await page.evaluate(() =>
      show({ name: 'João', _settings: { duration: 3, nameAutoFit: true } }),
    );
    await page.waitForTimeout(3100);
    assert.equal(await page.locator('#lower').evaluate((e) => getComputedStyle(e).opacity), '0');
    const ui = await browser.newPage();
    ui.on('pageerror', (e) => errors.push(e.message));
    await ui.goto(pathToFileURL(path.resolve('controller.html')).href);
    await ui.click('[data-tab=settings]');
    await ui.click('[data-i18n=expandModules]');
    assert.equal(await ui.getAttribute('#nameWidth', 'max'), '1728');
    assert.equal(await ui.locator('#nameAutoFit').isChecked(), false);
    await ui.evaluate(() => {
      cfg.people[0].name = 'W'.repeat(300);
      updateThemePreview();
    });
    await ui.locator('#nameFitWarning').waitFor({ state: 'visible' });
    await ui.check('#nameAutoFit');
    await ui.fill('#nameWidth', '1600');
    await ui.click('#saveSettings');
    await ui.reload();
    await ui.click('[data-tab=settings]');
    assert.equal(await ui.inputValue('#nameWidth'), '1600');
    assert.equal(await ui.locator('#nameAutoFit').isChecked(), true);
    await ui.selectOption('#preset', 'midnight');
    assert.equal(await ui.locator('#nameAutoFit').isChecked(), true);
    const backup = await ui.evaluate(() => localStorage.getItem('overlay-controller-for-obs-v1'));
    await ui.uncheck('#nameAutoFit');
    await ui.setInputFiles('#importFile', {
      name: 'backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(backup),
    });
    await ui.waitForFunction(() => document.getElementById('nameAutoFit').checked);
    const legacy = await ui.evaluate(() => OverlayThemes.normalize({ nameWidth: 900 }));
    assert.equal(legacy.nameWidth, 900);
    assert.equal(legacy.nameAutoFit, false);
    // Preview and source must use the same measurement, including logo reservation.
    await ui.selectOption('#nameModel', 'identity');
    await ui.fill('#nameWidth', '700');
    await ui.evaluate(() => {
      cfg.people[0] = {
        name: 'Maria Aparecida de Albuquerque Vasconcelos',
        role: 'Pregadora',
        instagram: 'igrejaexemplo',
      };
      draftLogo =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=';
      updateThemePreview();
    });
    const preview = ui.frameLocator('#namePreview');
    await preview.locator('#identityLogo:not([hidden])').waitFor();
    await ui.locator('#nameFitWarning').waitFor({ state: 'hidden' });
    const payload = await ui.evaluate(() => ({ ...cfg.people[0], _settings: readThemeDraft() }));
    await page.evaluate(
      (payload) => window.dispatchEvent(new CustomEvent('oocLowerThirdShow', { detail: payload })),
      payload,
    );
    await page.waitForTimeout(800);
    const measure = (e) => ({
      width: e.getBoundingClientRect().width,
      font: getComputedStyle(e.querySelector('#nameText')).fontSize,
      clipped: e.dataset.nameClipped,
    });
    assert.deepEqual(
      await page.locator('#lower').evaluate(measure),
      await preview.locator('#lower').evaluate(measure),
    );
    const geometry = await page.evaluate(() => ({
      logo: document.getElementById('identityLogo').getBoundingClientRect().right,
      name: document.getElementById('nameText').getBoundingClientRect().left,
    }));
    assert(geometry.logo <= geometry.name);
    assert.deepEqual(errors, []);
    console.log(
      'PASS: long names, fonts, models, positions, optional fields, max width, fallback, hide/timeout, warning, persistence and legacy backup.',
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
