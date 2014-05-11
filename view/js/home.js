$(function () {
	if (navigator.geolocation){
		var watchId = navigator.geolocation.watchPosition(
			function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				range = 50;		// Get it from... we'll see later.

				displayHome(latitude, longitude, range);

				//Test
				for(var i = 0; i < 3; ++i) {
					var post = new Array();
					post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content", "location": "EPFL", "author": "The pouldre"};
					displayPost(post);
				}
				// End Test
			},
            function() {

            },
            {enableHighAccuracy:true}
        );
	} else {
		alert("Your browser does not support HTML5 geolocation.");
	}
})

/**
 * Retrieves messages based on mode and localization
 * @param {float} latitude Latitude of user
 * @param {float} longitude Longitude of user
 * @param {int} range Wanted max range of messages
 */
function displayHome(latitude, longitude, range) {
	console.log("Displaying Home page");
	console.log("Loading posts...")
	getPosts(latitude, longitude, range,
		function(posts) {
			console.log("Posts recieved.");
			displayPosts(posts);
		},
		function(error) {
			console.log("Failed to recieve posts.");
			alert(error);
			displayErrorMessage(error);
		});
}

/**
 * Displays the Message page
 */
function displayNewMessage() {
	console.log("Displaying Message Page");
	s = 
	"<form role='form'>" + 
	  "<div class='form-group'>" + 
	    "<label for='title'>Title</label>" + 
	    "<input type='text' class='form-control' id='title' placeholder='Title of your message'>" + 
	  "</div>" + 
	  "<div class='form-group'>" + 
	    "<label for='message'>Password</label>" + 
	    "<textarea class='form-control' id='message' placeholder='Your message' rows='3'></textarea>" + 
	  "</div>" + 
	  "<button type='submit' class='btn btn-default'>Submit</button>" + 
	"</form>";
	$('#wrapper').html(s);
}

/**
 * Displays all received posts
 * @param  {Array} posts Posts
 */
function displayPosts(posts) {
	userId=2;
	for(var i = 0; i < posts.length; i++){
		displayPost(posts[i], userId);
	}
	console.log("Posts displayed.");
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
function displayPost(post, userId) {
	// todo
	var locDiff = "0 km"
	var lastPosted = "0 s"
	
	var s = 
		'<div id="post' + post.id + '" class="panel panel-default post">' +
			'<div class="panel-heading">' +
				'<div class="post_header">' +
					'<div class="ups pull-left">' + 
						'<div onclick="upvote('+post.id+', '+userId+')" class="glyphicon glyphicon-arrow-up upvote-icon"></div>' +
						'<div class="nbVotes">' + post.ups + '</div>' +
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

/**
 * Upvotes a post
 * @param  {int} postId id of the post
 * @param  {int} userId if of the upvoting user
 */
function upvote(postId, userId) {
	interestedInPost(postId, userId,
		function() {
			alert("Fnupvoted !");
			showUpVote(postId);
		}),
		function(response) {
			displayErrorMessage(response);
		}
}

/**
 * Updates the local display with the upvote
 * @param  {int} postId id of the message to display the upvote
 */
function showUpVote(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.removeClass("glyphicon-arrow-up");
	arrow.addClass("glyphicon-ok");
	votes = $($("#post"+postId+" .nbVotes")[0]);
	number = votes.html();
	votes.html(parseInt(number)+1);
}