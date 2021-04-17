const pgp = require('pg-promise')();

const promise = require('bluebird');
const cn = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'flat59',
  user: 'postgres',
  password: '1234'
};

let _db;

function initDb() {
  if (_db) {
      console.warn("Trying to init DB again!");
      return;
  }else{
  
  _db = pgp(cn);
  }
}

function getDb() {
  if (_db) {
    return _db;
  }
  else{
    console.warn("Tryed to get uninitialised db");
  }
}

module.exports = {
  getDb,
  initDb
};
