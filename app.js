const fs = require('fs');
const express = require('express');
const { json } = require('express');
const { parse } = require('path');

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).send('hello from server-side');
//   //   res.status(200).json({ message: 'hello from server side', app: 'Natours' });  // send data in json format
// });

// app.post('/', (req, res) => {
//   //   res.send('you can post on this route');
//   res.status(200).json({ message: 'post data on this route', app: 'natours' });
// });

const text = 'hello write file from txt';
fs.writeFileSync(`${__dirname}/dev-data/data/newfile.txt`, text);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  //   const addTour = tours.push(req.body);
  //   fs.writeFileSync(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours)
  //   );

  //   res.status(201).json({
  //     status: 'success',
  //     result: tours.length,
  //     data: {
  //       tours,
  //     },
  //   });
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: newTour,
      });
    }
  );
});

module.exports = app;
