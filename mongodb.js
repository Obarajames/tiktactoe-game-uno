 const mongoose = require("mongoose")
const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://module:game@cluster0.lagqbbx.mongodb.net/?retryWrites=true&w=majority");
    console.log("MongoDB connected");
  } 
  catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};
module.exports = connectToMongoDB
