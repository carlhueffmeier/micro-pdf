const { send } = require('micro');
const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
  let url = req.url.slice(1);
  try {
    if (/.+\..+/.test(url) === false) {
      throw new Error('say again?');
    }
    if (/^https?:\/\/.*/.test(url) === false) {
      url = `https://${url.trim()}`;
      console.log(url);
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.emulateMedia('screen');
    await page.goto(url);
    const pdf = await page.pdf();
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    send(res, 200, pdf);
  } catch (e) {
    send(res, 500, e.message);
  }
};
