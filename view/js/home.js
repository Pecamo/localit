var userId=-1;
var latitude;
var longitude;
var hasMessages = false;
var states = {
	local : 0,
	regional : 1,
	submit : 2
}

var upvoteIcon="glyphicon-arrow-up";
var upvotedIcon="glyphicon-ok";

var state = states.local;

$(function () {
	if (navigator.geolocation){
		var watchId = navigator.geolocation.watchPosition(
			function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				range = 0;		// Get it from... we'll see later.
				console.log("got new position")
				if(state === states.local){
					displayHome(latitude, longitude, 20);
				} else if (state === states.regional){
					displayRanged(latitude, longitude, range);
				}
			},
            function() {
            	console.log("Failed to get localization");
            	displayIfNothing("Failed to get localization");
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

    $("#km").keypress(function (event){
		if (event.which == 13){
			event.preventDefault();
			backHome();
		}
	});
})

function facebookConnected() {
	FB.api('/me', { fields: 'id, name, link' }, function(response){
		console.log(response);
		if (response.error){
			userId = -1;
			backHome();
			console.log("Logged out");
		} else {
			var userData = {
				Name: response.name,
				PictureUrl: 'http://graph.facebook.com/'+response.id+'/picture?type=square&height=16&width=16',
				ProfileLink: response.link,
				FacebookId: response.id
			};

			logIn(userData, function(){console.log("Auth OK");}, function(){console.log("Auth not OK");});
			userId = response.id;
			if(state === 0){
				displayHome(latitude, longitude, 20);
			} else if (state === 1){
				displayRanged(latitude, longitude, range);
			}
		}
	});
}

/**
 * Retrieves messages based on mode and localization
 * @param {float} latitude Latitude of user
 * @param {float} longitude Longitude of user
 * @param {int} range Wanted max range of messages
 */
function displayHome(latitude, longitude, range) {
	displayIfNothing("Loading messages...");
	console.log("Displaying Home page");
	console.log("Loading posts...")
	fetchPosts(userId, latitude, longitude, range,
		function(posts) {
			if (posts == null) {
				displayIfNothing("Received nothing.");
				console.log("Received nothing.");
			} else if (posts.length == 0) {
				displayIfNothing("Received no message.");
				console.log("Received no post.");
			} else {
				console.log(posts.length + " Posts received.");
				hasMessages = true;
				displayPosts(posts, userId);
			}
		},
		function(error) {
			displayIfNothing("Failed to receive posts.");
			console.log("Failed to receive posts.");
		});
}

/**
 * Retrieves messags based on localization and range
 * @param {float} latitude Latitude of user
 * @param {float} longitude Longitude of user
 * @param {float} range Max range in kilometers
 * @param {int} range Wanted max range of messages
 */
function displayRanged(latitude, longitude, range) {
	displayIfNothing("Loading messages...");
	console.log("Displaying Ranged page");
	console.log("Loading posts...")
	fetchPosts(userId, latitude, longitude, range,
		function(posts) {
			if (posts == null) {
				displayIfNothing("Received nothing.");
				console.log("Received nothing.");
			} else if (posts.length == 0) {
				displayIfNothing("Received no message.");
				console.log("Received no post.");
			} else {
				console.log(posts.length + " Posts received.");
				hasMessages = true;
				displayPosts(posts, userId);
			}
		},
		function(error) {
			console.log("Failed to receive posts.");
		});
}

/**
 * Displays the Message page
 */
function displayNewMessage() {
	if(userId != -1){
		state = states.submit;
		console.log("Displaying Message Page");
		s = 
		"<form role='form'>" + 
		  "<div class='form-group'>" + 
		    "<label for='title'>Title</label>" + 
		    "<input type='text' class='form-control' id='title' placeholder='Title of your message'>" + 
		  "</div>" + 
		  "<div class='form-group'>" + 
		    "<label for='message'>Content</label>" + 
		    "<textarea class='form-control' id='message' placeholder='Your message' rows='3'></textarea>" + 
		  "</div>" + 
		  "<button type='submit' class='btn btn-default' onclick='submitPost()'>Submit</button>" + 
		"</form>";
		$('#main_content').html(s);
		$('#newPost').addClass("active");
		$("#lookup").removeClass("active");
	} else {
		alert("You are not logged in !");
	} 
}

function submitPost() {
	if(userId != -1){
		var title = $("#title").val();
		var message = $("#message").val();
		if(title != "" && title != null && title != undefined && message != "" && message != null && message != undefined && title.trim() != "" && message.trim() != ""){
			console.log("OK");
			var loc = new google.maps.LatLng(latitude, longitude);
			var map = new google.maps.Map(document.getElementById('map'), {
	      		center: loc,
	      		zoom: 15
	    	});
	    	var request = {
	    		location: loc,
	    		radius: '10',
	  		};
	  		var service = new google.maps.places.PlacesService(map);
	  		service.nearbySearch(request, function (results, status){
	  			if (status == google.maps.places.PlacesServiceStatus.OK) {
	  				console.log(results);
					addPost(userId,title,message,latitude,longitude,results[0].name, function(response){backHome();}, function(response){alert(response);backHome();})
	  			} else {
	  				alert("google maps problem !")
	  				backHome();
	  			}
	  		});
  		} else {
  			alert("Title or message is not filled !");
  		}
	} else {
		alert("You are not logged in !")
	}
}

function backHome() {
	var range = $("#km").val();
	if (range != ""){
		displayHome(latitude, longitude, parseInt(range));
	} else {
		displayHome(latitude, longitude, 20);
	}
	$('#newPost').removeClass("active");
	$("#lookup").addClass("active");
	state = states.local;
}

function backRanged() {
	displayRanged(userId, latitude, longitude, 5);
	$('#newPost').removeClass("active");
	$("#lookup").addClass("active");
	state = states.regional;
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
		if (posts[i].HasUserVoted == true) {
			showVoted(posts[i].PostId);
		}
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

	var distance = computeDistance(latitude, longitude, post.Location.Latitude, post.Location.Longitude) + " km";
	var lastPosted = toSMH(((new Date().getTime()) - parseDate(post.CreationDate).getTime()) / 1000);
	
	var voteIcon = upvoteIcon;

	if (post.HasUserVoted == true) {
		voteIcon = upvotedIcon;
		actionIcon = 'cancelUpvote('+post.PostId+', '+userId+')';
	} else {
		voteIcon = upvoteIcon;
		actionIcon = 'upvote('+post.PostId+', '+userId+')';
	}
	
	
	var del = ""
	if (post.Creator.UserId == userId) {
		del = '<div id="delete_link' + post.PostId + '" class="pull-right small_text">delete this post</div>'
	}

	if (post.Title === null) {
		post.Title = "untitled";
	}
	if (post.Content === null) {
		post.Content = "";
	}
	
	// less than one minute
	if(lastPosted == "") {
		lastPosted += "just now";
	}
	else {
		lastPosted += " ago";
	}
	
	var s = 
		'<div id="post' + post.PostId + '" class="panel panel-default post">' +
			'<div class="panel-heading">' +
				'<div class="post_header">' +
					'<div class="ups pull-left">' + 
						'<div onclick="' + actionIcon + '" class="glyphicon ' + voteIcon + ' upvote-icon"></div>' +
						'<div class="nbVotes">' + post.Score + '</div>' +
					'</div>' +
					'<div class=" post_first_line panel-title">' +
							'<a class="post_title" data-toggle="collapse" data-parent="#accordion" href="#collapse'+post.PostId+'">' +
									purify(post.Title) +
							'</a>' +
						'<span class="small_text"> at '+ purify(post.Location.DisplayName) + ' (~' + distance + ')</span>' +
					'</div>' +
					'<span class="post_second_line small_text">' +
						'by <a href="'+ post.Creator.ProfileLink+'"><img src="'+ post.Creator.PictureUrl + '" class="fbPicture">' + purify(post.Creator.Name) + "</a> - " + lastPosted +
					'</span>' +
					del +
				'</div>' +
			'</div>' +
			'<div id="collapse' + post.PostId + '" class="panel-collapse collapse">' +
				'<div class="panel-body">' +
					purify(post.Content) +
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
function upvote(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.attr('onclick','').unbind('click');
	interestedInPost(postId, userId,
		function() {
			showUpvote(postId);
		}),
		function(response) {
			arrow.click(function () {
				upvote(postId, userId);
			});
			console.log(response);
		}
}

/**
 * Unupvotes a post
 * @param  {int} postId id of the post
 * @param  {int} userId if of the upvoting user
 */
function cancelUpvote(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.attr('onclick','').unbind('click');
	noMoreUpvote(postId, userId,
		function() {
			showDownvote(postId);
		}),
		function(response) {
			arrow.click(function () {
				cancelUpvote(postId, userId);
			});
			console.log(response);
		}	
}

/**
 * Updates the local display with the upvote
 * @param  {int} postId id of the message to display the upvote
 */
function showUpvote(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.removeClass(upvoteIcon);
	arrow.addClass(upvotedIcon);
	arrow.attr('onclick','').unbind('click');
	arrow.click(function () {
		cancelUpvote(postId, userId);
	});
	votes = $($("#post"+postId+" .nbVotes")[0]);
	number = votes.html();
	votes.html(parseInt(number)+1);
}

/**
 * Updates the local display with the downvote
 * @param  {int} postId id of the message to display the upvote
 */
function showDownvote(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.removeClass(upvotedIcon);
	arrow.addClass(upvoteIcon);
	arrow.click(function () {
		upvote(postId, userId);
	});
	votes = $($("#post"+postId+" .nbVotes")[0]);
	number = votes.html();
	votes.html(parseInt(number)-1);
}

function showVoted(postId) {
	arrow = $($("#post"+postId+" .upvote-icon")[0]);
	arrow.removeClass(upvoteIcon);
	arrow.addClass(upvotedIcon);
	arrow.click(function () {
		console.log("SALUT");
		cancelUpvote(postId, userId);
	});
}

function displayIfNothing(message) {
	if (!hasMessages) {
        $("#main_content").html(message);
    }
}

function purify(string) {
	return string.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace("'", "&#x27;").replace("\/", "&#x2F;");
}