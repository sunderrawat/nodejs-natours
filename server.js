const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

// console.log(app.get('env')); // get a running enviornment type
// console.log(process.env)  // all nodejs enviornment variavles

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connected sucessfully...');
  });

app.listen(port, () => {
  console.log('app is listening on port ', port);
});

//code before mongodb and code of basic express api section 6
