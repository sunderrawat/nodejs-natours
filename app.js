const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('hello from server-side');
  //   res.status(200).json({ message: 'hello from server side', app: 'Natours' });  // send data in json format
});

app.post('/', (req, res) => {
  //   res.send('you can post on this route');
  res.status(200).json({ message: 'post data on this route', app: 'natours' });
});

module.exports = app;
