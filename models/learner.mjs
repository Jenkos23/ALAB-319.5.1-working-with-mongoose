import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema({
    Type : {
        type: String,
        enum: ['homework', 
             'exam', 
             'quiz'],
        required: true,

    },

    class_id:{
        type: Number,
        required: true,
    },

    learners_id: {
        type: Number,
        required: true,
    },

    scores: {
        type: Number,
        required: true,
    },



});

//building indexing into the schemas.
learnerSchema.index({ Type: 1 });
learnerSchema.index({ class_id: 1 });
learnerSchema.index({ learners_id: 1 });
learnerSchema.index({ score: 1 });

// You can add methods to instances of a Mongoose model,
// which is simply a document object with its own instance methods.
learnerSchema.methods.getPeers = function (cb) {
    return mongoose
      .model("Learner")
      .find({ learners_id: this.learners_id, Type: this.Type }, cb);
  };

// You can also add static methods to a model for common tasks.
learnerSchema.statics.findPassing = function () {
    return this.find({ avg: { $gte: 70 } });
  };
  learnerSchema.statics.findByLearners_id = function (learners_id) {
    return this.find({ learners_id });
  };

  // As an additional convenience option, you can add query helpers
// to models using the schema.query method, allowing you to extend
// the chainable query builder API.
learnerSchema.query.byName = function (class_id) {
    return this.where({ class_id: new RegExp(class_id, "i") });
  };

// Virtuals allow us to get and set properties that are not
// stored in the MongoDB database. This is useful for a number
// of scenarios, like combining fields, repetitive processing,
// decomposing a value into multiple values for storage, etc.
// You cannot query with virtuals, since they are not
// stored in the database.
learnerSchema.virtual("passing").get(function () {
    return this.avg >= 70;
  });
  

export default mongoose.model("Learner", learnerSchema);
