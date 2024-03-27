const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

const getMonthEvents = () => {
  console.log("getMonthEvents: get month events");
  return puppeteer
    .launch({ headless: true, defaultViewport: null, executablePath: '/usr/bin/google-chrome' }) // defaultViewport: null
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(
        "https://goteamup.com/p/5410809-t45-jiujitsu/c/schedule",
        { waitUntil: "networkidle2" }
      );
      //Wait for the page to be loaded
      await page.waitForSelector(".desktop-calendar-month-view");

      let events = await page.evaluate(async () => {
        var sleepNow = (delay) =>
          new Promise((resolve) => setTimeout(resolve, delay));

        let elements = document.getElementsByClassName("calendar-event");
        let eventObjects = [];

        for (let i = 0; i < elements.length; i++) {
          elements[i].click();
          await sleepNow(1);
          eventObjects.push({
            title: elements[i].querySelector("h6.title")
              ? elements[i].querySelector("h6.title").innerText
              : "",
            url: window.location.href,
            time: elements[i].querySelector("p.time-range")
              ? elements[i].querySelector("p.time-range").innerText
              : "",
            instructorImage: document.querySelector(
              '.modal__body [data-ds-component="avatar"] img'
            )
              ? document.querySelector(
                  '.modal__body [data-ds-component="avatar"] img'
                ).src
              : null,
            instructorName: document.querySelector(
              '.modal__body [data-ds-component="avatar"]'
            ).nextElementSibling
              ? document.querySelector(
                  '.modal__body [data-ds-component="avatar"]'
                ).nextElementSibling.innerText
              : "T45 Jiujitsu",
          });
        }
        await sleepNow(1 * elements.length + 1);
        return eventObjects;
      });

      await browser.close();
      return events;
    })
    .catch(function (err) {
      console.error(err);
    });
};

const month = "test";

exports.month = month;
exports.getMonthEvents = getMonthEvents;
