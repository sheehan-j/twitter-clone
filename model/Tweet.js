const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	tweet: {
		type: String,
		required: true,
	},
	// time: {
	// 	type: String,
	// 	required: true,
	// },
});

module.exports = mongoose.model("Tweet", tweetSchema);
