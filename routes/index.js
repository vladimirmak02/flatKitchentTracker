// powershell -ExecutionPolicy Bypass nodemon 
var express = require('express');
const app = require('../app');
const initDb = require("../db").initDb;
const getDb = require("../db").getDb;
var router = express.Router();

initDb();
const db = getDb();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' })

/* GET home page. */
router.get('/', function(req, res, next) {
  let dir = __dirname.slice(0, -7);
  res.sendFile(dir + '\\views\\index.html');
}); 

module.exports = router;
