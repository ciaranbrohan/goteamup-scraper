#!/bin/sh

node scraper.js

cp ./month-events.json /var/www/html/month-events.json
