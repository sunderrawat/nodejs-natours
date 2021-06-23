const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app');

// console.log(app.get('env')); // get a running enviornment type
// console.log(process.env)  // all nodejs enviornment variavles

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app is listening on port ', port);
});

//code before mongodb and code of basic express api section 6