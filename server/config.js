require('dotenv').config();

module.exports = (function() {
  return {
    dbInfo: {
      host: 'localhost',
      port: 3306,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD
    }
  };
})();
