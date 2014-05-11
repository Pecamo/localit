var userId=-1;
var latitude;
var longitude;
$(function () {
	if (navigator.geolocation){
		var watchId = navigator.geolocation.watchPosition(
			function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				range = 0;		// Get it from... we'll see later.
				console.log("got new position")
				displayHome(userId, latitude, longitude, range);
			},
            function() {
            	console.log("Failed to get localization");
            },
            {enableHighAccuracy:true}
        );
	} else {
		alert("Your browser does not support HTML5 geolocation.");
	}

	window.fbAsyncInit = function() {
		FB.init({
	  		appId      : '569948019785822',
	  		xfbml      : true,
	  		version    : 'v2.0'
		});
		FB.getLoginStatus(function(response) {
			console.log("getLoginStatus")
			if (response.status === 'connected') {
				facebookConnected();
			}
			else if (response.status === 'not_authorized') {
				// the user is logged in to Facebook, 
				// but has not authenticated your app
			}
			else {
				// the user isn't logged in to Facebook.
			}
		});
    };

	(function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
})


function facebookConnected() {
	FB.api('/me', { fields: 'id, name, link' }, function(response){
		console.log(response);
		if (response.error){
			userId = -1;
			console.log("Logged out");
		} else {
			var userData = {
				Name: response.name,
				PictureUrl: 'http://graph.facebook.com/'+response.id+'/picture?type=square&height=32&width=32',
				ProfileLink: response.link,
				FacebookId: response.id
			};

			logIn(userData, function(){console.log("Auth OK");}, function(){console.log("Auth not OK");});
			userId = response.id;
			displayHome(userId, latitude, longitude, range);
		}
	});
}

/**
 * Retrieves messages based on mode and localization
 * @param {float} latitude Latitude of user
 * @param {float} longitude Longitude of user
 * @param {int} range Wanted max range of messages
 */
function displayHome(userId, latitude, longitude) {
	console.log("Displaying Home page");
	console.log("Loading posts...")
	fetchPosts(latitude, longitude, 0,
		function(posts) {
			if (posts == null) {
				console.log("Received nothing.");
			} else if (posts.length == 0) {
				console.log("Received no post.");
			} else {
				console.log(posts.length + " Posts received.");
				displayPosts(posts, userId);
			}
		},
		function(error) {
			console.log("Failed to receive posts.");
			alert(error);
			displayErrorMessage(error);
		});
}

/**
 * Retrieves messags based on localization and range
 * @param {float} latitude Latitude of user
 * @param {float} longitude Longitude of user
 * @param {float} range Max range in kilometers
 * @param {int} range Wanted max range of messages
 */
function displayRanged(userId, latitude, longitude, range) {
	console.log("Displaying Ranged page");
	console.log("Loading posts...")
	fetchPosts(latitude, longitude, range,
		function(posts) {
			console.log("Posts received.");
			displayPosts(posts, userId);
		},
		function(error) {
			console.log("Failed to receive posts.");
			alert(error);
			displayErrorMessage(error);
		});
}

/**
 * Displays the Message page
 */
function displayNewMessage(userId) {
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
	$('#main_content').html(s);
}

/**
 * Displays all received posts
 * @param  {Array} posts Posts
 * @param {int} userId id of connectred user
 */
function displayPosts(posts, userId) {
	string = '<div class="posts_container panel-group" id="accordion">';
	for(var i = 0; i < posts.length; i++){
		string += htmlPost(posts[i], userId);
	}
	string += "</div>";

	console.log("Posts displayed.");
	$('#main_content').html(string);
	for (var i = 0; i < posts.length; i++) {
		$('#delete_link' + posts[i].id).on('click', function () {
			if(posts[i].Creator == userId) {
				deletePost(posts[i])
			}
			else {
				alert("You are not allowed to do this.")
			}
		})
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
 * Returns the HTLM to display a post
 * @param  {Array} post Post Object
 * @return {String} HTML to display a post
 */
function htmlPost(post, userId) {
	// todo
	var distance = computeDistance(latitude, longitude, post.Location.Latitude, post.Location.Longitude) + " km"
	var lastPosted = "0"
	
	var del = ""
	if (post.Creator.UserId == userId) {
		del = '<div id="delete_link' + post.PostId + '" class="pull-right small_text">delete this post</div>'
	}
	
	var s = 
		'<div id="post' + post.PostId + '" class="panel panel-default post">' +
			'<div class="panel-heading">' +
				'<div class="post_header">' +
					'<div class="ups pull-left">' + 
						'<div onclick="upvote('+post.PostId+', '+userId+')" class="glyphicon glyphicon-arrow-up upvote-icon"></div>' +
						'<div class="nbVotes">' + post.Score + '</div>' +
					'</div>' +
					'<div class=" post_first_line panel-title">' +
							'<a class="post_title" data-toggle="collapse" data-parent="#accordion" href="#collapse'+post.PostId+'">' +
									post.Title +
							'</a>' +
						'<span class="small_text"> at '+ post.Location.DisplayName + ' (~' + distance + ')</span>' +
					'</div>' +
					'<span class="post_second_line small_text">' +
						'by ' + post.Creator.Name + " - " + toSMH(lastPosted) + " ago" +
					'</span>' +
					del +
				'</div>' +
			'</div>' +
			'<div id="collapse' + post.PostId + '" class="panel-collapse collapse">' +
				'<div class="panel-body">' +
					post.Content +
				'</div>' +
			'</div>' +
		'</div>';

	return s;

}


function tryDelete(post, userId) {
	if(post.Creator.UserId == userId) {
		deletePost(post,
			function () {
				alert("Post deleted with FNU ! ");
			},
			function () {
				alert("Due to some shit happening, it didn't work.");
			}
		);
	}
	else {
		alert("You are not allowed to do this.")
	}
}

/**
 * Upvotes a post
 * @param  {int} postId id of the post
 * @param  {int} userId if of the upvoting user
 */
function upvote(postId, userId) {
	interestedInPost(postId, userId,
		function() {
			showUpvote(postId);
		}),
		function(response) {
			displayErrorMessage(response);
		}
}

/**
 * Updates the local display with the upvote
 * @param  {int} postId id of the message to display the upvote
 */
function showUpvote(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.removeClass("glyphicon-arrow-up");
	arrow.addClass("glyphicon-ok");
	votes = $($("#post"+postId+" .nbVotes")[0]);
	number = votes.html();
	votes.html(parseInt(number)+1);
}