const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoUrl');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Is Ready To Be Used.......!!!!');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
