const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.TEST_BROWSER || 'msedge',
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(pathToFileURL(path.resolve('controller.html')).href);
  await page.click('[data-tab=settings]');
  await page.click('[data-i18n=expandModules]');
  await page.selectOption('#language', 'pt-BR');
  await page.selectOption('#preset', 'midnight');
  await page.selectOption('#background', 'solid');
  await page.fill('#backgroundOpacity', '45');
  await page.click('#saveSettings');
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('overlay-controller-for-obs-v1')).theme.backgroundOpacity,
    ),
    45,
  );
  await page.reload();
  await page.click('[data-tab=settings]');
  await page.click('[data-i18n=expandModules]');
  assert.equal(await page.inputValue('#background'), 'solid');
  assert.equal(await page.inputValue('#backgroundOpacity'), '45');
  const frame = page.frameLocator('#namePreview');
  await frame.locator('.lower.show').waitFor();
  assert.equal(
    await frame.locator('.card').evaluate((el) => getComputedStyle(el, '::after').opacity),
    '0.45',
  );
  assert.equal(
    await frame.locator('.role').evaluate((el) => getComputedStyle(el).color),
    'rgb(255, 255, 255)',
  );
  await page.selectOption('#background', 'transparent');
  await page.waitForTimeout(100);
  assert.equal(await frame.locator('html').getAttribute('data-transparent'), 'true');
  await page.selectOption('#preset', 'light');
  await page.waitForTimeout(100);
  const social = page.frameLocator('#socialPreview');
  assert.equal(
    await social
      .locator('.label')
      .first()
      .evaluate((el) => getComputedStyle(el).color),
    'rgb(23, 37, 84)',
  );
  assert.equal(
    await social.locator('.youtube svg').evaluate((el) => getComputedStyle(el).width),
    '48px',
  );
  await page.selectOption('#background', 'image');
  await page.setInputFiles('#backgroundFile', {
    name: 'sample.png',
    mimeType: 'image/png',
    buffer: Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=',
      'base64',
    ),
  });
  await page.waitForTimeout(200);
  await page.click('#saveSettings');
  assert.match(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('overlay-controller-for-obs-v1')).theme.backgroundImage,
    ),
    /^data:image\/png/,
  );
  const migrated = await page.evaluate(() =>
    normalizeConfig({
      theme: { primary: '#123456' },
      people: [{ nome: 'Nome antigo', cargo: 'Cargo' }],
    }),
  );
  assert.equal(migrated.theme.backgroundColor, '#123456');
  assert.equal(migrated.people[0].name, 'Nome antigo');
  const invalid = await page.evaluate(() =>
    OverlayThemes.normalize({
      backgroundOpacity: 999,
      backgroundImage: 'javascript:alert(1)',
      textColor: 'invalid',
    }),
  );
  assert.equal(invalid.backgroundOpacity, 100);
  assert.equal(invalid.backgroundImage, '');
  assert.equal(invalid.textColor, '#FFFFFF');
  const backup = await page.evaluate(() => localStorage.getItem('overlay-controller-for-obs-v1'));
  await page.setInputFiles('#importFile', {
    name: 'backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(backup),
  });
  await page.waitForTimeout(200);
  assert.equal(await page.inputValue('#background'), 'image');
  await frame.locator('body').evaluate(() => hide());
  assert.equal(
    await frame.locator('.lower').evaluate((el) => el.classList.contains('show')),
    false,
  );
  await page.selectOption('#preset', 'midnight');
  await page.locator('#namePreview').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: require('node:os').tmpdir() + '/overlay-theme-preview.png' });
  assert.deepEqual(errors, []);
  await browser.close();
  console.log(
    'PASS: presets, preview, opacity, transparency, social colors/icons, image upload, persistence, legacy migration and validation.',
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
