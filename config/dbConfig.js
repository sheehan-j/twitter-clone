const mongoose = require("mongoose");
DATABASE_PATH =
	"mongodb+srv://jordansheehan:twitterclone123@cluster0.3laqsh7.mongodb.net/twitterdb?retryWrites=true&w=majority";

const connectToDB = async () => {
	try {
		await mongoose.connect(DATABASE_PATH, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
	} catch (err) {
		console.error(err);
	}
};

module.exports = connectToDB;
