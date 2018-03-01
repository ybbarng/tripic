const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const database = new Database();
database.createTables();

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello from Express' });
});

app.get('/api/pics.json', (req, res) => {
  database.readPics().then((row) => {
    res.send(row);
  });
});

app.get('/api/trips.json', (req, res) => {
  database.readTrips().then((row) => {
    res.send(row);
  });
});

app.put('/api/trip/:tripId', (req, res) => {
  if (!req.params.tripId) {
    res.status(400).send({
      error: 'Invalid id of Trip'
    });
    return;
  }
  const tripIdInt = parseInt(req.params.tripId);
  if (isNaN(tripIdInt)) {
    res.status(400).send({
      error: 'Invalid id of Trip'
    });
    return;
  }
  const body = req.body;
  database.updateTrip(null, {
    id: tripIdInt,
    name: body.name
  }).then(() => {
    res.status(200).send({
      message: 'Trip name is updated'
    });
  });
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
