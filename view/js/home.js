$(function () {
	
	for(var i = 0; i < 3; ++i) {
		var post = new Array()
		post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content", "location": "EPFL"}
		display_post(post);
	}
})

function display_post(post) {
	var s = 
		'<div id="post'+post.id+'" class="panel panel-default post">' +
			'<div class="panel-heading">' +
				'<div class="post_header">' +
					'<div class="ups pull-left">' + 
						'<div onclick="upvote()" class="glyphicon glyphicon-arrow-up"></div>' +
						'<div>' + post.ups + '</div>' +
					'</div>' +
					'<div class="post_first_line">' +
						'<div class="panel-title">' +
							'<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+post.id+'">' +
									post.title +
							'</a>' +
						'</div>' +
						'<div> at '+ post.location + '</div>' +
					'</div>' +
					'<div class="post_second_line">' +
						
					'</div>' +
				'</div>' +
				
			'</div>' +
			'<div id="collapse'+post.id+'" class="panel-collapse collapse">' +
				'<div class="panel-body">' +
					post.content +
				'</div>' +
			'</div>' +
		'</div>'

	$('.posts_container').append(s);
}

function upvote() {
	alert("Fnupvoted !")
}