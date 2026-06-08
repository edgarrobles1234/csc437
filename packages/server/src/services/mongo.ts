import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.set("debug", true);
mongoose.set("bufferCommands", false);

dotenv.config();

function getMongoURI(dbname: string) {
  let connectionString = `mongodb://localhost:27017/${dbname}`;
  const { MONGO_USER, MONGO_PWD, MONGO_CLUSTER } = process.env;

  if (MONGO_USER && MONGO_PWD && MONGO_CLUSTER) {
    console.log(
      "Connecting to MongoDB at",
      `mongodb+srv://${MONGO_USER}:<password>@${MONGO_CLUSTER}/${dbname}`
    );

    connectionString =
      `mongodb+srv://${MONGO_USER}:${MONGO_PWD}` +
      `@${MONGO_CLUSTER}/${dbname}?retryWrites=true&w=majority`;
  } else {
    console.log("Connecting to MongoDB at", connectionString);
  }

  return connectionString;
}

export async function connect(dbname: string) {
  const uri = getMongoURI(dbname);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000
  });

  console.log("Mongo connection established");
}