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

//create a tour schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ['true', 'A tour must have a name'],
    unique: ['true', 'A tour name is unique'],
  },
  price: {
    type: Number,
    required: ['true', 'A tour must be a price'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

//define a tour model
const Tour = mongoose.model('Tour', tourSchema);

app.listen(port, () => {
  console.log('app is listening on port ', port);
});

//code before mongodb and code of basic express api section 6
