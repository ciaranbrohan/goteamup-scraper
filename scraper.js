const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

const getMonthEvents = () => {
  console.log("getMonthEvents: get month events");
  return puppeteer
    .launch({ headless: true, defaultViewport: null, executablePath: '/usr/bin/google-chrome', args: ["--no-sandbox"]  }) // defaultViewport: null
    .then(async (browser) => {
      const page = await browser.newPage();
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
  
          // console.log(dateObject);
          var now = new Date()
          // console.log(setDay(now, 0));
          // console.log(setDay(now, 6))
  
          var check = dateObject >= setDay(now, 0) && dateObject <= setDay(now, 6);
  
          // console.log(check)
  
          // console.log(sunday)
          // var lastDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()+6));
          // console.log(lastDayOfWeek)
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
