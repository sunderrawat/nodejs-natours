const fs = require('fs');
const express = require('express');
const { json } = require('express');
const { parse } = require('path');

const app = express();

// app.get('/', (req, res) => {
//   res.status(200).send('hello from server-side');
//   //   res.status(200).json({ message: 'hello from server side', app: 'Natours' });  // send data in json format
// });

// app.post('/', (req, res) => {
//   //   res.send('you can post on this route');
//   res.status(200).json({ message: 'post data on this route', app: 'natours' });
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res)=>{
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
})


module.exports = app;
