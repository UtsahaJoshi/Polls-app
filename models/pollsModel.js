const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  pollName: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  pollImage: {
    type: String,
    // required: [true, "Image is required"],
  },
  pollItem: {
    type: String,
    required: [true, "There must be a pollItem"],
  },
  pollItemImage: {
    type: String,
    //required: [true, "Poll Item must contain image"],
  },
  pollCreated: {
    type: Date,
    default: Date.now(),
  },
  pollEndDate: {
    type: Date,
  },
  pollEndTime: {
    type: Date,
  },
  paid: {
    type: Boolean,
  },
  allowedMultipleVote: {
    type: Boolean,
  },
});
const Polls = mongoose.model("Polls", pollSchema);
module.exports = Polls;
