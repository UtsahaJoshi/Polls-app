const Polls = require("./../models/pollsModel");

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Polls.find();
    res.status(200).json({
      status: "success",
      results: polls.length,
      data: {
        polls,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.createPolls = async (req, res) => {
  try {
    const newPoll = await Polls.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        poll: newPoll,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getOnePoll = async (req, res) => {
  try {
    const pol = await Polls.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        pol,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updatePoll = async (req, res) => {
  try {
    const polls = await Polls.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        polls,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deletePolls = async (req, res) => {
  try {
    await Polls.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
