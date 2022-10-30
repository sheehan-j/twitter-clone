const Tweet = require("../model/Tweet");

const getAllTweets = async (req, res) => {
	const tweets = await Tweet.find();

	if (tweets.length === 0)
		return res.status(204).json({ message: "No tweets found." });

	res.json(tweets);
};

const postTweet = async (req, res) => {
	if (!req?.body?.username || !req?.body?.tweet) {
		return res
			.status(400)
			.json({ message: "Username and tweet body are required." });
	}

	if (req.body.tweet.length > 280)
		return res.status(400).json({
			message: "Tweet body must be shorter than 280 characters.",
		});

	try {
		const result = await Tweet.create({
			username: req.body.username,
			tweet: req.body.tweet,
		});
		res.status(201).json(result);
	} catch (err) {
		console.error(err);
	}
};

const deleteAllTweets = async (req, res) => {
	const result = await Tweet.deleteMany({});
	return res.json(result);
};

module.exports = {
	getAllTweets,
	postTweet,
	deleteAllTweets,
};
