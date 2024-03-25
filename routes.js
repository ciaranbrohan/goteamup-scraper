const express = require("express");
const router = express.Router();
const scraper = require("./scraper");
// Define routes
router.get("/month-events", async (req, res) => {
    console.log("GET: month-events");
  res.send(await scraper.getMonthEvents());
});

module.exports = router;
