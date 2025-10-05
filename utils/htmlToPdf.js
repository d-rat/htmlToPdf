const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

/**
 * Converts HTML content to a PDF buffer using Puppeteer and Chromium.
 * @param {string} html - The HTML content to convert to PDF.
 * @param {object} htmlToPdfOption - Options to pass to Puppeteer's page.pdf() method.
 * @returns {Promise<Buffer>} - A promise that resolves to a PDF buffer.
 */
async function htmlToPdf(html, htmlToPdfOption) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  // Create a new page
  const page = await browser.newPage();

  const loaded = page.waitForNavigation({
    waitUntil: 'load',
  });
  //Get HTML content from HTML file
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await loaded;

  // To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

  // Download the PDF
  const pdf = await page.pdf({
    printBackground: true,
    ...htmlToPdfOption,
  });

  // Close the browser instance
  await browser.close();

  return pdf;
}

module.exports = { htmlToPdf };
