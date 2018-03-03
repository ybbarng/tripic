const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const Database = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const multipartParser = multer();

const database = new Database();
database.createTables();

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello from Express' });
});

app.get('/api/pics', (req, res) => {
  database.readPics().then((row) => {
    res.send(row);
  });
});

app.get('/api/trips', (req, res) => {
  database.readTrips().then((row) => {
    res.send(row);
  });
});

app.post('/api/trip', (req, res) => {
  const body = req.body;
  database.createTrip(null, {
    name: body.name
  }).then((response) => {
    res.status(200).send({
      id: response.insertId,
      name: body.name
    });
  }).catch((error) => {
    console.log(error);
    let errorMessage = '';
    if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Duplicate entry';
    }
    res.status(400).send({
      error: errorMessage
    });
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
  }).catch((error) => {
    console.log(error);
    let errorMessage = '';
    if (error.code === 'ER_DUP_ENTRY') {
      errorMessage = 'Duplicate entry';
    }
    res.status(400).send({
      error: errorMessage
    });
  });
});

app.delete('/api/trip/:tripId', (req, res) => {
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
  database.deleteTrip(null, {
    id: tripIdInt,
  }).then(() => {
    res.status(200).send({
      message: `Trip ${tripIdInt} is deleted`
    });
  }).catch((error) => {
    console.log(error);
    let errorMessage = '';
    res.status(400).send({
      error: errorMessage
    });
  });
});

app.post('/api/pic', multipartParser.single('image'), (req, res) => {
  console.log(req.file);
  console.log(req.body);
    res.status(200).send({
      id: 1234145
    });
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
