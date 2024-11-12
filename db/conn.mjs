import * as dotenv from 'dotenv';
// const dotenv = require('dotenv')
dotenv.config()

//import mongoose
import mongoose from 'mongoose';



// import { MongoClient } from "mongodb";

// const client = new MongoClient(process.env.ATLAS_URI);
// const client = mongoose(process.env.ATLAS_URI);

let conn;
try {
  conn = await mongoose.connect(process.env.ATLAS_URI);
} catch (e) {
  console.error(e);
}

// let db = conn.db("sample_training");

export default conn;
