document.addEventListener("readystatechange", (event) => {
	if (event.target.readyState === "complete") {
		init();
	}
});

const init = () => {
	refreshAllTweets();

	document
		.getElementById("tweetForm")
		.addEventListener("submit", async (e) => {
			// Prevent page reload
			e.preventDefault();

			const username = document.getElementById("username").value;
			const tweet = document.getElementById("tweet").value;

			if (username == "" || tweet == "")
				return handleInvalidInput("Username and tweet are required.");

			if (tweet.length > 280)
				return handleInvalidInput(
					"Tweet body must be shorter than 280 characters."
				);

			await submitTweetToAPI(username, tweet);
		});
};

const submitTweetToAPI = async (username, tweet) => {
	const tweetData = {
		username: username,
		tweet: tweet,
	};

	// Send POST request to API with tweet data from form
	const response = await fetch("/tweets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(tweetData),
	});

	// Record the JSON message returned and the status
	const jsonResponse = await response.json();
	const responseStatus = response.status;

	// If input validation on frontend did not work, check if backend has determined invalid input
	if (responseStatus == 400) {
		return handleInvalidInput(jsonResponse.message);
	}

	// Clear input fields
	document.getElementById("username").value = "";
	document.getElementById("tweet").value = "";

	// Prepend new tweet
	const tweetsContainer = document.getElementById("tweetsContainer");
	const existingHTML = tweetsContainer.innerHTML;
	tweetsContainer.innerHTML = `
		<div class="tweet-wrapper">
			<div class="tweet-username">${username}</div>
			<div class="tweet-body">${tweet}</div>
		</div>
	`;
	tweetsContainer.innerHTML += existingHTML;
};

const refreshAllTweets = async () => {
	const response = await fetch("/tweets", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	const tweets = await response.json();

	if (tweets.length === 0) return;

	for (let i = tweets.length - 1; i >= 0; i--) {
		document.getElementById("tweetsContainer").innerHTML += `
		<div class="tweet-wrapper">
			<div class="tweet-username">${tweets[i].username}</div>
			<div class="tweet-body">${tweets[i].tweet}</div>
		</div>
		`;
	}
};

const handleInvalidInput = (message) => {
	console.log(message);
};
