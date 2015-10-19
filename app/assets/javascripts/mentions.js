$(document).on('page:load', function () {
	console.log('jquery is there');
});

$(function () {
	$('body').on('click', 'a.fetch', fetchMentions);
	$('.mention').on('click', 'button', showReplyForm);
	$('#replyForm').submit(submitReply);
	console.log('document.ready');

	var twitterURI = 'http://twitter.com/';

	function fillTemplate(mention) {
		var newMention = $('#template').children('.mention').clone();

		newMention.data('tweet-id', mention.tweet_id);
		$('.user', newMention).data('user-screen-name', mention.screen_name);
		$('a[data-user-id]', newMention).data('user-id', mention.user_id).prop('href', twitterURI + mention.screen_name);
		$('.user img', newMention).prop('src', mention.profile_image_url);
		$('.name', newMention).text(mention.name);
		$('.screen-name', newMention).text(mention.screen_name);
		$('.date', newMention).text(mention.mentioned_at).prop('href', twitterURI + mention.screen_name + '/status/' + mention.tweet_id);
		$('p', newMention).text(mention.text);

		newMention.prependTo($('.mentions'));
	}

	function fetchMentions(event) {
		var latestMention = $('.mention:first'),
			i;


		$.ajax('/mentions/fetch', { dataType: 'json',
									data: { since_id: latestMention.data('tweet-id') },
									type: 'post',
									success: function (data) {
										console.log ('success', data);
										for (i = 0; i < data.length; i += 1) {
											fillTemplate(data[i]);
										}
									},
									error: function () { console.log ('http request error'); },
									 });
		event.preventDefault();
	}

	function showReplyForm() {
		var replyForm = $('#replyForm'),
			mention = $(this).closest('.mention'),
			textarea = $('textarea[name="reply"]', replyForm);

		textarea.val('@' + $('.user', mention).data('user-screen-name') + ' ');
		replyForm.appendTo($('.reply', mention));
		textarea.caretToEnd();
	}

	function submitReply() {
		var id = $(this).closest('.mention').data('tweet-id');

		$('input[name="in_reply_to_status_id"]', this).val(id);
		return true;
	}
});

(function () {

}());