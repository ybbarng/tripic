const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Database = require('./database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const multipartParser = multer();

const database = new Database();
database.createTables();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

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
  let cloudinaryUrl = 'http://via.placeholder.com/80x45';
  sharp(req.file.buffer)
    .resize(1280, 720)
    .toBuffer()
    .then((data) => {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(null, (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }).end(data);
      });
    }).catch((error) => {
      res.status(500).send({
        error
      });
    }).then((result) => {
      cloudinaryUrl = result.secure_url
        .replace(process.env.REACT_APP_CLOUD_URL_HEADER, '');
      return database.createPic(null, {
        trip_id: req.body.trip_id,
        datetime: req.body.datetime,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image_url: cloudinaryUrl
      });
    }).then((response) => {
      res.status(200).send({
        id: response.insertId,
        image_src: cloudinaryUrl
      });
    }).catch((error) => {
      console.log(error);
      res.status(500).send({
        error
      });
    });
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
