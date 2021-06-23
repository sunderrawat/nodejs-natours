const fs = require('fs');
const express = require('express');
const { json } = require('express');
const { parse } = require('path');
const { fail } = require('assert');

const app = express();
app.use(express.json());

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

app.get('/api/v1/tours/:id', (req, res) => {
  //   console.log(req.params);
  const findOneTour = tours.find((el) => el.id === +req.params.id);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: findOneTour },
  });
});

app.patch('/api/v1/tours/:id', (req, res) => {
  //   console.log(req.params);
  const findOneTour = tours.find((el) => el.id === +req.params.id);
  if (!findOneTour) {
    return res.status(404).json({ status: 'fail', message: 'Invallid id' });
  }
  res.status(200).json({
    status: 'success',
    message: 'updating tour...',
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
  const newTour = Object.assign(req.body, { id: newId });
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
