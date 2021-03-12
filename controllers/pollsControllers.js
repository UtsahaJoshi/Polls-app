const Polls = require("./../models/pollsModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllPolls = catchAsync(async (req, res, next) => {
  console.log(req);
  const polls = await Polls.find();
  res.status(200).json({
    status: "success",
    results: polls.length,
    data: {
      polls,
    },
    
  });
});

exports.createPolls = catchAsync(async (req, res, next) => {
  const newPoll = await Polls.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      poll: newPoll,
    },
  });
});
exports.getOnePoll = catchAsync(async (req, res, next) => {
  const pol = await Polls.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      pol,
    },
  });
});
exports.updatePoll = catchAsync(async (req, res, next) => {
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
});
exports.deletePolls = catchAsync(async (req, res, next) => {
  await Polls.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
