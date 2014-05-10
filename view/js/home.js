$(function () {
	
	latitude = 0;	// Get it using localization
	longitude = 0;	// Get it using localization
	range = 50;		// Get it from... we'll see later.

	loadHome(latitude, longitude, range);

	for(var i = 0; i < 3; ++i) {
		var post = new Array()
		post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content", "location": "EPFL", "author": "The pouldre"}
		display_post(post);
	}
})

/**
 * Retrieves messages based on mode and localization
 * @param {float} latitude Latitude of user
 * @param {float} longitude Longitude of user
 * @param {int} range Wanted max range of messages
 * @return {Array} Messages in decreasing relevance order
 */
function loadHome(latitude, longitude, range) {
	getPosts(latitude, longitude, range, displayPosts(posts), displayErrorMessage(error));
}

/**
 * Displays all received posts
 * @param  {Array} posts Posts
 */
function displayPosts(posts) {
	for(var i = 0; i < posts.length; i++){
		displayPost(posts[i]);
	}
}

/**
 * Displays an error message
 * @param  {String} error Message to display
 */
function displayErrorMessage(error) {
	alert(error);
}

/**
 * Displays a post
 * @param  {Array} post Post
 */
function displayPost(post) {
	// todo
	var locDiff = "0 km"
	var lastPosted = "0 s"
	
	var s = 
		'<div id="post' + post.id + '" class="panel panel-default post">' +
			'<div class="panel-heading">' +
				'<div class="post_header">' +
					'<div class="ups pull-left">' + 
						'<div onclick="upvote()" class="glyphicon glyphicon-arrow-up"></div>' +
						'<div>' + post.ups + '</div>' +
					'</div>' +
					'<div class=" post_first_line panel-title">' +
							'<a class="post_title" data-toggle="collapse" data-parent="#accordion" href="#collapse'+post.id+'">' +
									post.title +
							'</a>' +
						'<span class="small_text"> at '+ post.location + ' (~' + locDiff + ')</span>' +
					'</div>' +
					'<span class="post_second_line small_text">' +
						'by ' + post.author + " - " + lastPosted + " ago" +
					'</span>' +
				'</div>' +
				
			'</div>' +
			'<div id="collapse' + post.id + '" class="panel-collapse collapse">' +
				'<div class="panel-body">' +
					post.content +
				'</div>' +
			'</div>' +
		'</div>'

	$('.posts_container').append(s);
}

// todo
function upvote() {
	alert("Fnupvoted !")
}