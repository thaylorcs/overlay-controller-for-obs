const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.TEST_BROWSER || 'msedge',
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 250 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(pathToFileURL(path.resolve('topic-overlay.html')).href);
    const show = (text, duration = 30) =>
      page.evaluate(
        ({ text, duration }) => {
          window.dispatchEvent(
            new CustomEvent('oocTopicShow', {
              detail: {
                text,
                _settings: {
                  duration,
                  font: 'Arial,sans-serif',
                  background: 'solid',
                  backgroundColor: '#172554',
                },
              },
            }),
          );
        },
        { text, duration },
      );
    const state = () =>
      page.evaluate(() => ({
        visible: document.querySelector('#topic').classList.contains('show'),
        animations: document
          .querySelector('#text')
          .getAnimations()
          .map((a) => a.effect.getKeyframes()),
        font: getComputedStyle(document.querySelector('#topic')).fontFamily,
        background: getComputedStyle(document.documentElement)
          .getPropertyValue('--surface-color')
          .trim(),
      }));
    const timing = await page.evaluate(() => ({
      inherited: TopicSettings.seconds('texto', { customDuration: false, duration: 99 }, 12),
      manual: TopicSettings.seconds(
        'texto',
        { customDuration: true, automatic: false, duration: 17 },
        12,
      ),
      short: TopicSettings.seconds('curto', { customDuration: true }, 12),
      long: TopicSettings.seconds('x'.repeat(100), { customDuration: true }, 12),
      fast: TopicSettings.seconds('x'.repeat(100), { customDuration: true, speed: 320 }, 12),
    }));
    assert.equal(timing.inherited, 12);
    assert.equal(timing.manual, 17);
    assert.ok(timing.long > timing.short);
    assert.ok(timing.fast < timing.long);
    const longText = 'Teste de velocidade '.repeat(15);
    const speedDuration = async (speed) =>
      page.evaluate(
        ({ speed, text }) => {
          window.dispatchEvent(
            new CustomEvent('oocTopicShow', { detail: { text, topicOptions: { speed } } }),
          );
          return document.querySelector('#text').getAnimations()[0].effect.getTiming().duration;
        },
        { speed, text: longText },
      );
    const slowDuration = await speedDuration(80);
    const fastDuration = await speedDuration(320);
    assert.ok(Math.abs(slowDuration / fastDuration - 4) < 0.01);
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent('oocTopicShow', {
          detail: {
            text: 'Duração própria',
            _settings: { duration: 30 },
            topicOptions: { customDuration: true, automatic: false, duration: 3 },
          },
        }),
      ),
    );
    await page.waitForTimeout(3200);
    assert.equal((await state()).visible, false);
    await show('Fé e esperança');
    assert.equal(await page.locator('#topicHeading').textContent(), 'Tema da mensagem');
    assert.equal(await page.locator('#topicHeading').isVisible(), true);
    const headingBounds = await page.locator('#topicHeading').boundingBox();
    const textBounds = await page.locator('#text').boundingBox();
    assert.ok(headingBounds.y + headingBounds.height <= textBounds.y);
    const panel = await page.locator('#topic').boundingBox();
    assert.ok(panel.y >= 0 && panel.y + panel.height <= 250);
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent('oocTopicShow', {
          detail: {
            text: 'Tópico',
            topicOptions: { heading: 'Título personalizado', headingEnabled: false },
          },
        }),
      ),
    );
    assert.equal(await page.locator('#topicHeading').isVisible(), false);
    await page.evaluate(() =>
      window.dispatchEvent(
        new CustomEvent('oocTopicShow', {
          detail: {
            text: 'Tópico',
            topicOptions: { heading: '<b>Título personalizado</b>', headingEnabled: true },
          },
        }),
      ),
    );
    assert.equal(await page.locator('#topicHeading').textContent(), '<b>Título personalizado</b>');
    assert.equal(await page.locator('#topicHeading b').count(), 0);
    await show('Fé e esperança');
    await page.waitForTimeout(100);
    assert.equal((await state()).animations.length, 0);
    assert.match((await state()).font, /Arial/);
    assert.equal((await state()).background, '#172554');
    await show('Uma mensagem de fé, esperança e amor para toda a comunidade '.repeat(6));
    await page.waitForTimeout(100);
    assert.equal((await state()).animations.length, 1);
    const frames = (await state()).animations[0];
    assert.match(frames[0].transform, /translateX\(\d/);
    assert.match(frames[1].transform, /translateX\(-/);
    await page.evaluate(() => document.querySelector('#text').getAnimations()[0].finish());
    await page.waitForTimeout(100);
    assert.equal((await state()).visible, false, 'Hide after the last character exits');
    assert.equal(
      await page.locator('#text').evaluate((el) => getComputedStyle(el).visibility),
      'hidden',
    );
    await show('Texto curto');
    assert.equal((await state()).animations.length, 0);
    await page.setViewportSize({ width: 300, height: 250 });
    await page.waitForTimeout(100);
    assert.equal((await state()).animations.length, 1);
    await page.setViewportSize({ width: 1920, height: 250 });
    await page.waitForTimeout(100);
    assert.equal((await state()).animations.length, 0);
    await show('Timeout', 3);
    await page.waitForTimeout(3200);
    assert.equal((await state()).visible, false);
    await show('Ocultar');
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('oocTopicHide')));
    assert.equal((await state()).visible, false);
    await show('<img src=x onerror=alert(1)>');
    assert.equal(await page.locator('#text img').count(), 0);
    await show('');
    assert.equal((await state()).visible, false);
    await page.goto(pathToFileURL(path.resolve('controller.html')).href);
    await page.locator('[data-tab="topic"]').click();
    await page.locator('#topicText').fill('Tema salvo');
    assert.equal(await page.locator('#topicCustomDuration').getAttribute('role'), 'switch');
    const toggle = await page.locator('label[for=topicCustomDuration] .toggleTrack').boundingBox();
    assert.equal(toggle.width, 52);
    assert.equal(toggle.height, 30);
    const offColor = await page
      .locator('label[for=topicCustomDuration] .toggleTrack')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    await page.locator('label[for=topicCustomDuration]').click();
    assert.equal(await page.locator('#topicCustomDuration').isChecked(), true);
    await page.waitForTimeout(250);
    const onColor = await page
      .locator('label[for=topicCustomDuration] .toggleTrack')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    assert.notEqual(offColor, onColor);
    await page.locator('#topicCustomDuration').focus();
    await page.keyboard.press('Space');
    assert.equal(await page.locator('#topicCustomDuration').isChecked(), false);
    await page.locator('#topicCustomDuration').check();
    await page.locator('#topicTimingMode').selectOption('manual');
    await page.locator('#topicDuration').fill('18');
    await page.locator('#topicSpeed').fill('240');
    await page.locator('#topicHeading').fill('Mensagem de domingo');
    await page.locator('#saveTopic').click();
    await page.reload();
    assert.equal(await page.locator('#topicText').inputValue(), 'Tema salvo');
    assert.equal(await page.locator('#topicHeading').inputValue(), 'Mensagem de domingo');
    await page.locator('[data-tab=topic]').click();
    await page.locator('#topicHeadingEnabled').uncheck();
    assert.equal(await page.locator('#topicHeading').isDisabled(), true);
    assert.equal(await page.locator('#topicDuration').inputValue(), '18');
    assert.equal(await page.locator('#topicSpeed').inputValue(), '240');
    assert.equal(await page.locator('#topicCustomDuration').isChecked(), true);
    await page.locator('[data-tab="topic"]').click();
    await page.locator('#topicCustomDuration').uncheck();
    assert.equal(await page.locator('#topicTimingOptions').isHidden(), true);
    assert.deepEqual(errors, []);
    console.log('Topic overlay checks passed.');
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
