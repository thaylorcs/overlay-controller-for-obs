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
    const page = await browser.newPage({ viewport: { width: 390, height: 950 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve('controller.html')).href);
    await page.click('[data-tab=settings]');
    await page.click('[data-i18n=expandModules]');
    assert.equal(await page.inputValue('#nameModel'), 'classic');
    assert.equal(await page.inputValue('#socialModel'), 'classic');
    await page.selectOption('#nameModel', 'identity');
    await page.selectOption('#socialModel', 'capsule');
    await page.selectOption('#preset', 'midnight');
    assert.equal(await page.inputValue('#nameModel'), 'identity');
    assert.equal(await page.inputValue('#socialModel'), 'capsule');
    assert.equal(await page.locator('#logoFile').isVisible(), true);
    assert.equal(await page.locator('#nameStyle').isVisible(), false);
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
      'base64',
    );
    await page.setInputFiles('#logoFile', { name: 'logo.png', mimeType: 'image/png', buffer: png });
    await page.waitForFunction(() => draftLogo.startsWith('data:image/png'));
    await page.click('#saveSettings');
    await page.reload();
    await page.click('[data-tab=settings]');
    assert.equal(await page.inputValue('#nameModel'), 'identity');
    assert.equal(await page.inputValue('#socialModel'), 'capsule');
    const preview = page.frameLocator('#namePreview');
    await preview.locator('#identityLogo:not([hidden])').waitFor();
    const backup = await page.evaluate(() => localStorage.getItem('overlay-controller-for-obs-v1'));
    await page.selectOption('#nameModel', 'classic');
    await page.setInputFiles('#importFile', {
      name: 'backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(backup),
    });
    await page.waitForFunction(() => document.getElementById('nameModel').value === 'identity');
    await page.click('#removeLogo');
    await preview.locator('#identityLogo[hidden]').waitFor({ state: 'attached' });
    const fallback = await page.evaluate(() =>
      OverlayThemes.normalize({
        nameModel: 'unknown',
        socialModel: 'unknown',
        logoImage: 'javascript:bad',
      }),
    );
    assert.equal(fallback.nameModel, 'classic');
    assert.equal(fallback.socialModel, 'classic');
    assert.equal(fallback.logoImage, '');

    const overlay = await browser.newPage({ viewport: { width: 1920, height: 250 } });
    overlay.on('pageerror', (error) => errors.push(error.message));
    await overlay.goto(pathToFileURL(path.resolve('name-overlay.html')).href);
    for (const model of ['classic', 'sidebar', 'identity']) {
      for (const position of ['left', 'center', 'right']) {
        await overlay.evaluate(
          ({ model, position }) =>
            window.dispatchEvent(
              new CustomEvent('oocLowerThirdShow', {
                detail: {
                  name: 'Pr. João da Silva',
                  role: 'Pregador',
                  instagram: 'joaodasilva',
                  _settings: { nameModel: model, namePosition: position, nameWidth: 700 },
                },
              }),
            ),
          { model, position },
        );
        await overlay.waitForTimeout(800);
        const bounds = await overlay.locator('#lower').boundingBox();
        assert(bounds.x >= 0 && bounds.x + bounds.width <= 1920);
        assert(bounds.y >= 0 && bounds.y + bounds.height <= 250);
        if (model !== 'classic') {
          assert.notEqual(
            await overlay
              .locator('#lower')
              .evaluate((e) => getComputedStyle(e, '::before').backgroundImage),
            'none',
          );
          const text = await overlay.locator('#nameText').boundingBox();
          const ig = await overlay.locator('#social').boundingBox();
          assert(text.y + text.height <= ig.y);
        }
      }
      await overlay.screenshot({ path: path.join(os.tmpdir(), `overlay-model-${model}.png`) });
      await overlay.evaluate(() => window.dispatchEvent(new CustomEvent('oocLowerThirdHide')));
      await overlay.waitForTimeout(500);
      assert.equal(
        await overlay.locator('#lower').evaluate((e) => getComputedStyle(e).opacity),
        '0',
      );
    }
    await overlay.goto(pathToFileURL(path.resolve('social-overlay.html')).href);
    await overlay.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent('oocSocialShow', {
          detail: {
            youtube: 'Igreja Exemplo',
            facebook: '',
            instagram: 'igrejaexemplo',
            _settings: { socialModel: 'capsule' },
          },
        }),
      ),
    );
    await overlay.waitForTimeout(1000);
    assert.equal(await overlay.locator('#facebookRow').isVisible(), false);
    assert.equal(
      await overlay
        .locator('#youtubeRow .iconbox')
        .evaluate((e) => getComputedStyle(e).borderRadius),
      '50%',
    );
    await overlay.screenshot({ path: path.join(os.tmpdir(), 'overlay-model-capsule.png') });
    await overlay.evaluate(() => window.dispatchEvent(new CustomEvent('oocSocialHide')));
    await overlay.waitForTimeout(1200);
    assert.equal(
      await overlay.locator('#youtubeRow').evaluate((e) => getComputedStyle(e).opacity),
      '0',
    );
    assert.deepEqual(errors, []);
    console.log(
      'PASS: independent models, logo upload/removal, persistence/import, legacy fallback, OBS events, bounds, hide and capsule networks.',
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
