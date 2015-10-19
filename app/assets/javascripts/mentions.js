$(document).on('page:load', function () {
	console.log('jquery is there');
});

$(function () {
	$('body').on('click', 'a.fetch', fetchMentions);
	$('.mention').on('click', 'button', showReplyForm);
	$('#replyForm').submit(submitReply);
	console.log('document.ready');

	var twitterURI = 'http://twitter.com/';

	function fetchMentions(event) {
		$.ajax('/mentions/fetch', { dataType: 'json',
									data: { since_id: $('.mention:first').data('tweet-id') },
									type: 'post',
									success: function (data) {
										var i;

										for (i = 0; i < data.length; i += 1) {
											new Mention(data[i]).add();
										}
									},
									error: function () {
										console.log ('http request error');
									},
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

	function Mention(mention) {
		var $this = $('#template').children('.mention').clone();

		function add() {
			$this.prependTo($('.mentions'));

		}

		$this.data('tweet-id', mention.tweet_id);
		$('.user', $this).data('user-screen-name', mention.screen_name);
		$('a.profile', $this).prop('href', twitterURI + mention.screen_name);
		$('.user img', $this).prop('src', mention.profile_image_url);
		$('.name', $this).text(mention.name);
		$('.screen-name', $this).text(mention.screen_name);
		$('.date', $this).text(mention.l_mentioned_at).prop('href', twitterURI + mention.screen_name + '/status/' + mention.tweet_id);
		$('.text', $this).text(mention.text);

		this.add = add;
	}
});

(function () {

}());