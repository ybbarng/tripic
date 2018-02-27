const fs = require('fs');
const mysql = require('promise-mysql');
const Config = require('./config');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      ...Config.dbInfo
    });
  }

  createTables() {
    const createTableSqls = fs.readFileSync('server/sql/create_tables.sql').toString().split('\n\n');
    let connection = null;
    this.pool.getConnection().catch(function(error) {
      console.log(error);
    }).then((conn) => {
      connection = conn;
      return connection.beginTransaction();
    }).then(() => {
      return Promise.all(createTableSqls.map((sql) => {
        return connection.query({sql, typeCast: false});
      }));
    }).then(() => {
      return connection.commit();
    }).catch((error) => {
      console.error(error);
      return connection.rollback();
    }).then(() => {
      return connection.release();
    });
  }

  getPics() {
  }
}

module.exports = Database;

