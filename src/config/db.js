// # Database connection (Mongo)

const mongoose = require("mongoose");

const dbCOnnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("db connected successfully")
  } catch (err) {
    console.log(err)
  }
};

module.exports = dbCOnnect;