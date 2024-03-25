const puppeteer = require("puppeteer");
const userAgent = require('user-agents');

// starting Puppeteer
puppeteer
  .launch({ headless: true, defaultViewport: null  })
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.goto(
      "https://goteamup.com/p/5410809-t45-jiujitsu/c/schedule?enddate=2024-03-30&startdate=2024-03-24",
      { waitUntil: "networkidle2" }
    );
    //Wait for the page to be loaded
    await page.waitForSelector(".desktop-calendar-month-view");

    let heading = await page.evaluate(() => {
      const h1 = document.body.querySelector(".current-month");

      return h1.innerText;
    });

    console.log({ heading });

    let allFruits = await page.evaluate(() => {
      const fruitsList = document.body.querySelectorAll(".calendar-event");

      let fruits = [];

      fruitsList.forEach((value) => {
        fruits.push(value.innerText);
      });
      return fruits;
    });

    // console.log({ allFruits })

    let urls = await page.evaluate(async () => {
      var sleepNow = (delay) =>
        new Promise((resolve) => setTimeout(resolve, delay));

      let elements = document.getElementsByClassName("calendar-event");
      let urlPaths = ["test"];
      for (let i = 0; i < elements.length; i++) {
        elements[i].click();
        await sleepNow(10);
        urlPaths.push(window.location.href);
        console.log(window.location.href);
      }
      await sleepNow(10 * elements.length + 1);
      return urlPaths;
    });

    console.log({ urls });

    // closing the browser
    await browser.close();
  })
  .catch(function (err) {
    console.error(err);
  });
