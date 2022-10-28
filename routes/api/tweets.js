const express = require("express");
const router = express.Router();
const tweetController = require("../../controllers/tweetController");

router
	.route("/")
	.get(tweetController.getAllTweets)
	.post(tweetController.postTweet)
	.delete(tweetController.deleteAllTweets);

module.exports = router;
