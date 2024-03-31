const puppeteer = require("puppeteer");

puppeteer
    .launch({headless: false})
    // .launch({ headless: true, defaultViewport: null, executablePath: '/usr/bin/google-chrome', args: ["--no-sandbox"]  }) // defaultViewport: null
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(
        "https://goteamup.com/p/5410809-t45-jiujitsu/c/schedule",
        { waitUntil: "networkidle2" }
      );
      //Wait for the page to be loaded
      await page.waitForSelector(".desktop-calendar-month-view");

      


      let events = await page.evaluate(async () => {
        var sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

        let elements = document.getElementsByClassName("calendar-event");
        let eventObjects = [];

        for (let i = 0; i < elements.length; i++) {
          elements[i].click();
          await sleepNow(1);
            //console.log(window.location.href)
            //console.log(document.querySelector('.modal__body'));
          console.log(document.querySelector('header .title div').firstElementChild.innerText)

          var dateOnly = document.querySelector('header .title div').firstElementChild.innerText.replace(elements[i].querySelector("p.time-range").innerText, '');
          var dateObject = new Date(dateOnly);
          
          
          eventObjects.push({
            title: elements[i].querySelector("h6.title")
              ? elements[i].querySelector("h6.title").innerText
              : "",
            url: window.location.href,
            time: elements[i].querySelector("p.time-range")
              ? elements[i].querySelector("p.time-range").innerText
              : "",
            date: document.querySelector('header .title div') && elements[i].querySelector("p.time-range").innerText ? dateObject : null, 
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
            
          await sleepNow(1);
          document.querySelector('.modal-modalClose').click();
        }
        await sleepNow(1 * elements.length + 1);
        
        return eventObjects;
        
      });
      console.log(events)
      //await browser.close();
      return events;
    })
    .catch(function (err) {
      console.error(err);
    });