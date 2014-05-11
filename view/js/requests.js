var api_root = "http://128.179.130.155:8888/api/"
var posts_root = api_root + "posts"
/*
 * Gets all the posts near the location of the client.
 * Parameters :
 * - latitude/longitude : Latitude/longitude of the client
 * - range : Maximum wanted distance of messages
 * - successCallback : function called in case of a success, must take an array of objects as argument 
 * - failCallback : function called in case the communication fails
 */
function fetchPosts(latitude, longitude, range, successCallback, failCallback) {
	rangeString = "";
	if (range != 0) {
		rangeString = "&range=" + range;
	}
	httpGET(posts_root + "?latitude=" + latitude + "&longitude=" + longitude + rangeString, successCallback, failCallback);
}

/*
 * Gets one post by ID
 * Parameters :
 * - ID : id of the post
 * - successCallback : function called in case of a success, must take a JSON as argument
 * - failCallback : function called in case the communication fails
 */
function getPost(id, successCallback, failCallback) {
	httpGET(posts_root + "/" + id, successCallback, failCallback);
}

/*
 * Adds a post on the server
 * Parameters :
 * - post : the post to be posted
 * - successCallback : function called in case of a success
 * - failCallback : function called in case the communication fails
 */
function addPost(post, successCallback, failCallback) {
	httpPOST(posts_root + "/add", post, successCallback, failCallback);
}

/*
 * Updates a post on the server
 * Parameters :
 * - post : the post to be updated (HAS TO CONTAIN ID)
 * - successCallback : function called in case of a success
 * - failCallback : function called in case the communication fails
 */
function updatePost(post, successCallback, failCallback) {
	httpPOST(posts_root + "/update", post, successCallback, failCallback);
}

/**
 * Delete a post on the server
 * Parameters :
 * - post : the post to be updated (HAS TO CONTAIN ID)
 * - successCallback : function called in case of a success
 * - failCallback : function called in case the communication fails
 */
function deletePost(post, successCallback, failCallback) {
	httpPOST(posts_root + "/delete", post, successCallback, failCallback);
}

/*
 * Shows interest in a post on the server
 * Parameters :
 * - postID : id of the post
 * - userID : id of the user who shows interest
 * - failCallback : function called in case the communication fails
 */
function interestedInPost(postID, userID, successCallback, failCallback) {
	var data = {
		postID : postID,
		userID : userID
	};
	httpPOST(posts_root + "/upvote", data, successCallback, failCallback);
}

function logIn(id, name, successCallback, failCallback){
	httpPOST(api_root + "auth", {FacebookId:id, Name:name}, successCallback, failCallback);
}

/*
 * Performs a HTTP GET.
 * Parameters :
 * - url : url to perform the get
 * - successCallback : function called in case of success, takes response in argument
 * - failCallback : function called in case of a fail
 */
function httpGET(url, successCallback, failCallback) {
	$.ajax(url)
		.done(function(response) {
			successCallback(response);
		})
		.fail(function(response) {
			failCallback(response);
		});
}

/*
 * Performs a http POST to a url and sending data
 * - url : url to perform the post
 * - successCallback : function called in case of success
 * - failCallback : function called in case of a fail
 */
function httpPOST(url, data, successCallback, failCallback) {
	$.ajax({
		url: url,
		type : 'POST',
		data : data
	})
		.done(function(response) {
			successCallback(response);
		})
		.fail(function(response) {
			failCallback(response);
		});
}