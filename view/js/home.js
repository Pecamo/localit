$(function () {
	for(var i = 0; i < 3; ++i) {
		display_post();
	}
})

function display_post() {
	$('#posts_container').append('<div class="post">Post<div>')
}