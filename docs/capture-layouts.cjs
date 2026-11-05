// Capture documentation examples from the real browser sources, without OBS.
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs/promises');

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(__dirname, 'images');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.TEST_BROWSER || 'msedge',
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 250 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    async function capture(file, event, detail, image) {
      await page.goto(pathToFileURL(path.join(root, file)).href);
      // A neutral illustrative scene makes the transparent source visible in the README.
      await page.addStyleTag({ content: 'html,body{background:#20232a!important}' });
      await page.evaluate(
        ({ event, detail }) => {
          window.dispatchEvent(new CustomEvent(event, { detail }));
        },
        { event, detail },
      );
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(output, image) });
    }
    for (const model of ['classic', 'sidebar', 'identity']) {
      await capture(
        'name-overlay.html',
        'oocLowerThirdShow',
        {
          name: 'Alex Morgan',
          role: 'Guest speaker',
          instagram: 'example',
          _settings: { nameModel: model, nameWidth: 1000, duration: 300, shine: false },
        },
        `name-${model}.png`,
      );
    }
    for (const model of ['classic', 'capsule']) {
      await capture(
        'social-overlay.html',
        'oocSocialShow',
        {
          youtube: 'Example channel',
          facebook: 'Example community',
          instagram: 'example',
          _settings: { socialModel: model, duration: 300, shine: false },
        },
        `social-${model}.png`,
      );
    }
    await capture(
      'topic-overlay.html',
      'oocTopicShow',
      {
        text: 'A message of hope',
        topicOptions: { headingEnabled: true, heading: 'Message topic' },
        _settings: { duration: 300 },
      },
      'topic.png',
    );
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('Captured six layout examples from the browser sources.');
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
