$(function () {
	
	for(var i = 0; i < 3; ++i) {
		var post = new Array()
		post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content"}
		display_post(post);
	}
})

function display_post(post) {
	var s = 
		'<div id="post'+post.id+'" class="panel panel-default post">' +
			'<div class="panel-heading">' +
				'<div class="pull-left ups">' + 
					post.ups + 
				'</div>' +
				'<div>' +
					'<h4 class="panel-title">' +
						'<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+post.id+'">' +
								post.title +
						'</a>' +
					'</h4>' +
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