/*
 * Gets all the posts near the location of the client.
 * Parameters :
 * - Location : location of the client
 * - successCallback : function called in case of a success, must take an array of JSONs as argument 
 * - failCallback : function called in case the communication fails
 */
function getPosts(location, successCallback, failCallback) {
	httpGET("example.php/posts/" + location, successCallback, failCallback);
}

/*
 * Gets one post by ID
 * Parameters :
 * - ID : id of the post
 * - successCallback : function called in case of a success, must take a JSON as argument
 * - failCallback : function called in case the communication fails
 */
function getPost(id, successCallback, failCallback) {
	httpGET("example.php/psots/id", successCallback, failCallback);
}

/*
 * Adds a post on the server
 * Parameters :
 * - post : the post to be posted
 * - successCallback : function called in case of a success
 * - failCallback : function called in case the communication fails
 */
function addPost(post, successCallback, failCallback) {
	httpPOST("test.html/posts/add", post, successCallback, failCallback);
}

/*
 * Updates a post on the server
 * Parameters :
 * - post : the post to be updated (HAS TO CONTAIN ID)
 * - successCallback : function called in case of a success
 * - failCallback : function called in case the communication fails
 */
function updatePost(post, successCallback, failCallback) {
	httpPOST("test.html/posts/update", post, successCallback, failCallback);
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
	httpPOST("test.html/posts/interestedIn", data, successCallback, failCallback);
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
		.fail(function() {
			failCallback();
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
		.done(function() {
			successCallback();
		})
		.fail(function() {
			failCallback();
		});
}
}