$(document).on('page:load', function () {
	console.log('jquery is there');
});

$(function () {
	$('body').on('click', 'a.fetch', fetchMentions);
	console.log('document.ready');

	function fetchMentions(event) {
		$.ajax('/mentions/fetch', { dataType: 'json',
									success: function (data) { console.log ('success', data); },
									error: function () { console.log ('http request error'); },
									 });
		event.preventDefault();
	}
});