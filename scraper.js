const userAgent = require("user-agents");


const getMonthEvents = async () => {
  console.log("getMonthEvents: get month events");

  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--no-sandbox"] });
  const page = await browser.newPage();

  await page.goto("https://goteamup.com/providers/calendar/", {
    waitUntil: "networkidle2",
  });
  
  console.log('working')

  await page.focus('#id_email-email');
  await page.keyboard.type('info@t45jiujitsu.ie')
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await new Promise(r => setTimeout(r, 1000));

await page.focus('#id_login-password');
    await page.keyboard.type('AvatartheA4ng')
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await page.waitForSelector('.calendar-event');
    let events = await page.evaluate(async () => {
        let eventElements = document.querySelectorAll(".calendar-event");
        let eventsArray = [];
        eventElements.forEach(element => {
            eventsArray.push({
                id: element.getAttribute('href').replace("/providers/events/", "").replace("/", ""),
                title: element.querySelector('.title').innerHTML.trim(),
                time: element.querySelector('.time-range').innerHTML.trim(),
                instructor: element.querySelectorAll('.instructors li')[0].innerHTML.trim(),
                members: element.querySelectorAll('.users li')[0].innerText
            })
        });
        return eventsArray;
    });
    return events;
  
};

exports.getMonthEvents = getMonthEvents;
