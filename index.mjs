import express from "express";
import dotenv from 'dotenv';
dotenv.config();


const PORT = 3000;
const app = express();

import grades from "./routes/grades.mjs";
import grades_agg from "./routes/grades_agg.mjs";
import learner from "./models/learner.mjs";


app.use(express.json());


// Creating documents follows a syntax similar to classes.
const newDoc = new learner({
  Type: "exam",
  class_id: 23,
  learner_id: 5,
  score: 75,
 
});

// This saves (inserts) the document to the database.
// We'll disable it here with an anonymous function wrapper
// to prevent duplicates in our example database.
async () => {
  await newDoc.save();
};


app.get("/", async (req, res) => {
  // You can retrieve documents using find methods
  // on their associated models.
  let Learner1 = await learner.findOne({ Type: "exam" })

   // You can also add new fields to a document and save it.
   Learner1.avg = 75;
   await Learner1.save();
 
   res.send(Learner1);
 });



 app.get("/passing", async (req, res) => {
  // Here, we use the static function defined on the schema
  // to easily retrieve all learners with passing averages.
  // This also allows us to put business logic in the data model,
  // rather than scattering it about the application.
  let result = await learner.findPassing();
  res.send(result);
});


app.get("/:id", async (req, res) => {
  // Note that Mongoose automatically type-casts fields.
  // We do not need to wrap the id parameter in ObjectId().
  // That said, we should still catch errors produced by invalid ids.
  try {
    let result = await learner.findById(req.params.id);
    res.send(result);
  } catch {
    res.send("Invalid ID").status(400);
  }
});





app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", grades);
app.use("/grades", grades_agg);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
