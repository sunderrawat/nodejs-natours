const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandeled Exception error 💥 shutting down server....💥');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connected sucessfully...');
  })
  .catch((err) => {
    console.log('error in database during connection 💥');
  });

const server = app.listen(port, () => {
  console.log('app is listening on port ', port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandeled Rejection 💥 shutting down server....💥');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('Sigtrem recived. Shutting down gracefully 🔆');
  server.close(() => {
    console.log('Process terminated 🙋');
  });
});
