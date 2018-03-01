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

  inTransaction(action) {
    let connection = null;
    this.pool.getConnection().catch(function(error) {
      console.log(error);
    }).then((conn) => {
      connection = conn;
      return connection.beginTransaction();
    }).then(() => {
      return action(connection);
    }).then(() => {
      return connection.commit();
    }).catch((error) => {
      console.error(error);
      return connection.rollback();
    }).then(() => {
      return connection.release();
    });
  }

  createTables() {
    const createTableSqls = fs.readFileSync('server/sql/create_tables.sql').toString().split('\n\n');
    this.inTransaction((connection) => {
      return Promise.all(createTableSqls.map((sql) => {
        return connection.query({sql, typeCast: false});
      }));
    });
  }

  createTrip(connection, trip) {
    if (!trip.name) {
      throw 'The name of trip is not provided';
    }
    connection = connection || this.pool;
    return connection.query('INSERT INTO Trips (name) VALUES (?)', [trip.name]);
  }

  readTrips(connection) {
    connection = connection || this.pool;
    return connection.query(
      `SELECT Trips.id as id, Trips.name as name, count(Pics.trip_id) as n_pics
      FROM Trips LEFT OUTER JOIN Pics on Trips.id = Pics.trip_id
      GROUP BY Trips.id, Trips.name`);
  }

  updateTrip(connection, trip) {
    connection = connection || this.pool;
    return connection.query('UPDATE Trips SET name = ? WHERE id = ?', [trip.name, trip.id]);
  }

  deleteTrip(connection, trip) {
    if (!trip.id) {
      throw 'The id of trip is not provided';
    }
    connection = connection || this.pool;
    return connection.query('DELETE FROM Trips WHERE id = ?', [trip.id]);
  }

  createTag(connection, tag) {
    if (!tag.name) {
      throw 'The name of tag is not provided';
    }
    connection = connection || this.pool;
    return connection.query('INSERT INTO Tags (name) VALUES (?)', [tag.name]);
  }

  readTags(connection) {
    connection = connection || this.pool;
    return connection.query(
      `SELECT Tags.id as id, Tags.name as name, count(PicsTags.tag_id) as n_pics
      FROM Tags LEFT OUTER JOIN PicsTags on Tags.id = PicsTags.tag_id
      GROUP BY Tags.id, Tags.name`);
  }

  updateTag(connection, tag) {
    connection = connection || this.pool;
    return connection.query('UPDATE Tags SET name = ? WHERE id = ?', [tag.name, tag.id]);
  }

  deleteTag(connection, tag) {
    if (!tag.id) {
      throw 'The id of tag is not provided';
    }
    connection = connection || this.pool;
    return connection.query('DELETE FROM Tags WHERE id = ?', [tag.id]);
  }

  createPic(connection, pic) {
    connection = connection || this.pool;
    return connection.query('INSERT INTO Pics (trip_id, datetime, location, image_url) VALUES (?, ?, Point(?, ?), ?)', [pic.trip_id, pic.datetime, pic.longitude, pic.latitude, pic.image_url]);
  }

  readPics(connection) {
    connection = connection || this.pool;
    return connection.query(
      `SELECT Pics.id as id, trip_id, Trips.name as trip_name, datetime, ST_Y(location) as longitude, ST_X(location) as latitude, image_url
      FROM Pics LEFT OUTER JOIN Trips on Pics.trip_id = Trips.id`);
  }

  updatePic(connection, patch) {
    connection = connection || this.pool;
    return connection.query('UPDATE Pics SET ? WHERE id = ?', [patch.diff, patch.id]);
  }

  deletePic(connection, pic) {
    if (!pic.id) {
      throw 'The id of pic is not provided';
    }
    connection = connection || this.pool;
    return connection.query('DELETE FROM Pics WHERE id = ?', [pic.id]);
  }

  getPics() {
  }
}

module.exports = Database;

