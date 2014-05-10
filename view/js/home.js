$(function () {
	
	for(var i = 0; i < 3; ++i) {
		var post = new Array()
		post = {"id": i, "ups": 0, "title": "Post title", "content": "Post content !", "open": false}
		display_post(post);
	}
})

function display_post(post) {
	$('#posts_container').append(
		'<div id="post'+ post.id +'" class="row">' +
			'<div class="col-md-1 post_up">'+ post.ups +'</div>' +
			'<div class="post_title">'+ 
				'<div class="panel-group" id="accordion">' +
				  '<div class="panel panel-default">' +
					'<div class="panel-heading">' +
					  '<h4 class="panel-title">' +
						'<a data-toggle="collapse" data-parent="#accordion" href="#collapse'+ post.id +'">' + post.title + '</a>' +
					  '</h4>' +
					'</div>' +
					'<div id="collapse'+ post.id +'" class="panel-collapse collapse">' +
					  '<div class="panel-body">' +
						'Marrant contenu' +
					  '</div>' +
					'</div>' +
				  '</div>' +
				'</div>' +
			'</div>' +
		'</div>'
	)
}