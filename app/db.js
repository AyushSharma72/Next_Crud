import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function ConnectDb() {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to database");
      return;
    } else {
      await mongoose.connect(process.env.Mongo_Db_Url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to database");
    }
  } catch (error) {
    console.log(error);
  }
}

export default ConnectDb;
