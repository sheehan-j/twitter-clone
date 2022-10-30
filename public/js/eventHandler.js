document.addEventListener("readystatechange", (event) => {
	if (event.target.readyState === "complete") {
		init();
	}
});

const init = () => {
	// Fetch all tweets from DB and display them
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

			if (username.length > 50)
				return handleInvalidInput(
					"Username length cannot exceed 50 characters."
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

	// Hide the error message if it was being displayed
	document.getElementById("errorContainer").classList.remove("visible");

	// Update the ending text that indicates no more tweets
	document.getElementById("noMoreTweets").innerHTML = "No more tweets :(";

	// Prepend new tweet
	const tweetsContainer = document.getElementById("tweetsContainer");
	const existingHTML = tweetsContainer.innerHTML;
	tweetsContainer.innerHTML = `
		<div class="tweet-container">
			<div><img class="tweet-profile-icon" src="/img/profileicon.png"></div>
			<div class="tweet-text-container">
				<div class="tweet-username">@${username}</div>
				<div class="tweet-body">${tweet}</div>
			</div>
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
	const responseStatus = await response.status;

	// If no tweets are found in the db (status: 204), add the no tweets found message to the tweets container
	if (responseStatus == 204) {
		document.getElementById("tweetsContainer").innerHTML += `
			<div id="noMoreTweets">
				No tweets found :(
			</div>
		`;
		return;
	}

	// Now it is known that there are tweets present, so store them
	const tweets = await response.json();
	// If there are tweets, append each of them to the tweets container
	for (let i = tweets.length - 1; i >= 0; i--) {
		document.getElementById("tweetsContainer").innerHTML += `
		<div class="tweet-container">
			<div><img class="tweet-profile-icon" src="/img/profileicon.png"></div>
			<div class="tweet-text-container">
				<div class="tweet-username">@${tweets[i].username}</div>
				<div class="tweet-body">${tweets[i].tweet}</div>
			</div>
		</div>
		`;
	}

	// At the "no more tweets" message at the end of all the tweets
	document.getElementById("tweetsContainer").innerHTML += `
		<div id="noMoreTweets">
			No more tweets :(
		</div>
	`;
};

const handleInvalidInput = (message) => {
	const errorContainer = document.getElementById("errorContainer");

	errorContainer.innerHTML = message;
	errorContainer.classList.add("visible");
};
