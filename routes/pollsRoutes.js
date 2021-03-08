const express = require("express");
const pollController = require("./../controllers/pollsControllers");

const router = express.Router();
router
  .route("/")
  .get(pollController.getAllPolls)
  .post(pollController.createPolls);
router
  .route("/:id")
  .get(pollController.getOnePoll)
  .patch(pollController.updatePoll)
  .delete(pollController.deletePolls);

module.exports = router;
