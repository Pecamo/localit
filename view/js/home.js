$(function () {
	
	for(var i = 0; i < 3; ++i) {
		var post = new Array()
		post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content", "location": "EPFL", "author": "The pouldre"}
		display_post(post);
	}
})

function display_post(post) {
	// todo
	var currentUser = "The pouldre"
	var locDiff = "0 km"
	var lastPosted = "0 s"
	
	var del = ""
	if(post.author == currentUser) {
		del = '<div id="delete_link' + post.id + '" class="pull-right small_text"></div>'
	}
	
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
					del +
				'</div>' +
			'</div>' +
			'<div id="collapse' + post.id + '" class="panel-collapse collapse">' +
				'<div class="panel-body">' +
					post.content +
				'</div>' +
			'</div>' +
		'</div>'

	$('.posts_container').append(s);
	$('#delete_link' + post.id).append("delete this post")
	$('#delete_link' + post.id).on('click', function () {
		if(post.author == currentUser) {
			deletePost(post)
		}
		else {
			alert("You are not allowed to do this.")
		}
	})
}

// todo
function upvote() {
	alert("Fnupvoted !")
}

function deletePost(post) {
	alert("You deleted this post.")
}