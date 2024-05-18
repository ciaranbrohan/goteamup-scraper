const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

const getMonthEvents = () => {
  console.log("getMonthEvents: get month events");
  return puppeteer
    .launch({ headless: true,executablePath: '/usr/bin/google-chrome', args: ["--no-sandbox"] , defaultViewport: null, }) //executablePath: '/usr/bin/google-chrome', args: ["--no-sandbox"] 
    .then(async (browser) => {
      console.log('fired');
      const page = await browser.newPage();
      console.log(page)
      await page.goto("https://goteamup.com/p/5410809-t45-jiujitsu/c/schedule", {
        waitUntil: "networkidle2",
      });
      //Wait for the page to be loaded
      await page.waitForSelector(".desktop-calendar-month-view");
      let events = await page.evaluate(async () => {

        var sleepNow = (delay) =>
          new Promise((resolve) => setTimeout(resolve, delay));
        
          let setDay = (date, dayOfWeek) => {
            date = new Date(date.getTime ());
            date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
            return date;
          }
      
  
        let elements = document.getElementsByClassName("calendar-event");
        let eventObjects = [];

  
        for (let i = 0; i < elements.length; i++) {
          elements[i].click();
          await sleepNow(1);
  
          var dateOnly = document
            .querySelector("header .title div")
            .firstElementChild.innerText.replace(
              elements[i].querySelector("p.time-range").innerText,
              ""
            );

          var dateObject = new Date(dateOnly);
  
          var now = new Date()
          now.setHours(0,0,0,0);
              
          var check = dateObject.getDate() === now.getDate();
  
          if (check) {
            eventObjects.push({
              title: elements[i].querySelector("h6.title")
                ? elements[i].querySelector("h6.title").innerText
                : "",
              url: window.location.href,
              time: elements[i].querySelector("p.time-range")
                ? elements[i].querySelector("p.time-range").innerText
                : "",
              date:
                document.querySelector("header .title div") &&
                  elements[i].querySelector("p.time-range").innerText
                  ? dateObject
                  : null,
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
              weekDay: dateObject.getDay() || null,
              year: dateObject.getFullYear() || null,
              month: dateObject.getMonth() || null,
              day: dateObject.getDate() || null,
            });
          }
  
          await sleepNow(1);
          document.querySelector(".modal-modalClose").click();
        }
        await sleepNow(1 * elements.length + 1);
  
        return eventObjects;
      });
  
  
      // await browser.close();
      console.log(events)
      return events;
    })
    .catch(function (err) {
      console.error(err);
    });
  
};

const month = "test";

exports.month = month;
exports.getMonthEvents = getMonthEvents;
