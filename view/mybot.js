require('dotenv').config();
const Bot = require('../model/bot.js');
const config = require('../model/config.js');
new Bot(config);