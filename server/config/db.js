const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URI, { dbName: "Primary" });
    console.log("Database connection established");
  } catch (err) {
    console.error("Unable to connect to database!");
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
