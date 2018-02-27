const fs = require('fs');
const mysql = require('mysql');
const Config = require('./config');

module.exports = (function() {
  const pool = mysql.createPool({
    connectionLimit: 10,
    ...Config.dbInfo
  });
  return {
    createTables: () => {
      const createTableSqls = fs.readFileSync('server/sql/create_tables.sql').toString().split('\n\n');
      pool.getConnection((error, connection) => {
        connection.beginTransaction((error) => {
          if (error) { throw error; }
          createTableSqls.map((sql) => {
            connection.query({sql, typeCast: false}, function(error ,results, fields) {
              if (error) {
                connection.rollback(() => { throw(error); });
              }
            });
          });
        });
      });
    },
    getPics: function() {
    }
  };
})();


