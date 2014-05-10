$(function () {
	
	for(var i = 0; i < 3; ++i) {
		var post = new Array()
		post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content !", "open": false}
		display_post(post);
	}
})

function display_post(post) {
	$('#posts_container').append(
		'<div id="post'+ post.id +'" class="container post">' +
			'<div class="post_up">'+ post.ups +'</div>' +
			'<div class="post_title">'+ post.title +'</div>' +
			'<div class="post_content"></div>'+
		'</div>'
	)
	
	$('#post'+post.id+'> .post_title').on("click", function () {
		if(!post.open) {
			$('#post'+ post.id + '> .post_content').append('<div>'+ post.content +'</div>')
			post.open = true;
		}
		else {
			$('#post'+ post.id + '> .post_content').empty()
			post.open = false;
		}
	})
}