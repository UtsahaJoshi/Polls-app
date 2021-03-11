const express = require("express");
const pollController = require("./../controllers/pollsControllers");
const authController = require("./../controllers/authcontroller");

const router = express.Router();
router
  .route("/")
  .get(authController.protect, pollController.getAllPolls)
  .post(pollController.createPolls);
router
  .route("/:id")
  .get(pollController.getOnePoll)
  .patch(pollController.updatePoll)
  .delete(pollController.deletePolls);

module.exports = router;
