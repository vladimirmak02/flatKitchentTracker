var express = require('express');
const app = require('../app');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

const initDb = require("../db").initDb;
const getDb = require("../db").getDb;
initDb();
const db = getDb();

router.get('/', function(req, res, next) {
  db.any("SELECT inside, occupied FROM kitchen WHERE room = 'kitchen'")
    .then(data => {
        res.json(data);
    })
    .catch(error => {
      res.status(500).send();
      console.log('ERROR:', error); // print the error;
    })
  
}); 

router.put('/', upload.none(), function(req, res, next) {
  db.tx(async t => {
    // t.ctx = transaction config + state context;
    await t.none("UPDATE kitchen SET inside = $1, occupied = $2 WHERE room = 'kitchen'", [req.body.inside, req.body.occupied]);
})
    .then(() => {
        // success;
        res.status(200);
    })
    .catch(error => {
        res.status(500);
        console.log('ERROR:', error);
    })
    .finally(() => res.send());
  
}); 

module.exports = router;
