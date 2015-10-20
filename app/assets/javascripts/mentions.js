(function () {

	var twitterURI = 'http://twitter.com/';

	function eventListeners() {
		$('.fetch-btn').click(fetchMentions);
		$('.mentions').on('click', '.reply-btn', showReplyForm);
		$('#replyForm').submit(submitReply);
		$('textarea[name="reply"]').click(updateCounter).change(updateCounter).keydown(updateCounter).on('paste', 
			function () {
				var textarea = this;

				setTimeout(function () {
					updateCounter.apply(textarea);
				}, 0);
			});
	}

	function fetchMentions(event) {
		$.ajax('/mentions/fetch', { dataType: 'json',
									data: { since_id: $('.mention:first').data('tweet-id') },
									type: 'post',
									success: function (data) {
										var i;

										for (i = 0; i < data.length; i += 1) {
											new Mention(data[i]).add();
										}

										if (data.length === 0) {
											$('.no-mention-warning').removeClass('hidden');
										} else {
											$('.no-mention-warning').addClass('hidden');
										}

										$('#error_explanation').addClass('hidden');
									},
									error: function () {
										$('.no-mention-warning').addClass('hidden');
										$('#error_explanation').text("error while trying to fetch mentions")
											.removeClass('hidden');
									},
								 });
		event.preventDefault();
	}

	function updateCounter() {
		renderCharsLimit($(this).closest('form'));
	}

	function renderCharsLimit($form) {
		var textarea = $('textarea[name="reply"]', $form),
			countElem = $('span.count', $form),
			remainingChars = 140 - textarea.val().length,
			isLimitExceded = remainingChars <= 0;

		countElem.text(remainingChars)
			.toggleClass('text-danger', isLimitExceded);
		$('.tweet-btn', $form).prop('disabled', isLimitExceded);
	}

	function showReplyForm() {
		var replyForm = $('#replyForm'),
			mention = $(this).closest('.mention'),
			textarea = $('textarea[name="reply"]', replyForm);

		function reset() {
			textarea.val('@' + $('.user', mention).data('user-screen-name') + ' ');
			renderCharsLimit(replyForm);
		}

		if ($('#replyForm', mention). length < 1) {
			reset();
			replyForm.appendTo($('.reply', mention));
			textarea.caretToEnd();
		} else {
			textarea.focus();
		}
	}

	function submitReply() {
		var id = $(this).closest('.mention').data('tweet-id'),
			submit = true;

		$('input[name="in_reply_to_status_id"]', this).val(id);
		
		if ($('textarea[name="reply"]').val().length > 140) {
			submit = false;
		}

		return submit;
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

	$(eventListeners);
	$(document).on('page:load', eventListeners);
}());