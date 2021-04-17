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
  res.sendFile(dir + '\\views\\shoppinglist.html');
}); 


router.get('/getall', function(req, res, next) {
  db.any("SELECT * FROM shoppinglist ORDER BY timecreated ASC")
    .then(data => {
        res.json(data);
    })
    .catch(error => {
      res.status(500).send();
      console.log('ERROR:', error); // print the error;
    })
  
}); 

router.delete('/deleteall', function(req, res, next) {
  db.any("DELETE FROM shoppinglist")
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

router.delete('/', function(req, res, next) {
  console.log(req.body.product, req.body.person, parseInt(req.body.quantity), parseInt(req.body.timecreated));
  db.result('DELETE FROM shoppinglist WHERE product = $1 AND person = $2 AND quantity = $3 AND timecreated = $4', [req.body.product, req.body.person, parseInt(req.body.quantity), parseInt(req.body.timecreated)])
    .then(result => {
        console.log(result.rowCount); // print how many records were deleted;
        res.json(result.rowCount);
    })
    .catch(error => {
        res.status(500).send();
        console.log('ERROR:', error);
    });
}); 

router.post('/', upload.none(), function(req, res, next) {
  db.one('INSERT INTO shoppinglist(product, person, quantity, timecreated) VALUES($1, $2, $3, $4) RETURNING product, person, quantity, timecreated', [req.body.product, req.body.person, parseInt(req.body.quantity), Date.now()])
  .then((data) => {
      // success;
      res.json(data);
  })
  .catch(error => {
    res.status(500);
    console.log('ERROR:', error);
  }).finally(() => res.send());
}); 

module.exports = router;
