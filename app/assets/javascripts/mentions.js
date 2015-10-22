(function () {

	var twitterURI = 'http://twitter.com/';

	function eventListeners() {
		$('.fetch-btn').click(fetchMentions);
		$('.mentions').on('click', '.reply-btn', showReplyForm);
		$('#replyForm').submit(beforeSubmit);
		$('textarea[name="reply"]').keydown(updateCounter).on('paste', updateCounter);
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

	/**
	* @this {HTMLTextareaElem}
	* calling setTimeout so that the value obtained is the value resulting from the keydown or paste event
	*/
	function updateCounter() {
		var textarea = this;

		setTimeout(function () {
		  	renderCharsLimit($(textarea).closest('form'));
		}, 0);
	}

	/**
	* updates the counter of characters, toggles its class when passing the limit of 140,
	* enables or disables the Tweet button when needed.
	* @param {jQuery} $form the reply form
	*/
	function renderCharsLimit($form) {
		var textarea = $('textarea[name="reply"]', $form),
			countElem = $('span.count', $form),
			remainingChars = 140 - textarea.val().length,
			isLimitExceded = remainingChars <= 0;

		countElem.text(remainingChars)
		  	.toggleClass('text-danger', isLimitExceded);
		$('.tweet-btn', $form).prop('disabled', isLimitExceded);
	}

	/**
	* Moves the reply form in the selected mention.
	* The form is reset, with the screen name and caret ready for typing.
	*/
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

	/**
	* Checks than the limit is not exceeded.
	* Set the status id for the reply.
	*/
	function beforeSubmit() {
		var id = $(this).closest('.mention').data('tweet-id'),
			submit = true;

		$('input[name="in_reply_to_status_id"]', this).val(id);

		if ($('textarea[name="reply"]').val().length > 140) {
			submit = false;
		}

		return submit;
	}

	/**
	* Fills a mention template.
	*/
	function Mention(mention) {
		var $this;

		function add() {
			$this.prependTo($('.mentions'));
		}

		if (typeof mention === 'object' && typeof mention.tweet_id === 'string'
				&& typeof mention.name === 'string' && typeof mention.screen_name === 'string'
				&& typeof mention.profile_image_url === 'string' && typeof mention.l_mentioned_at === 'string'
				&& typeof mention.text === 'string' && /^http:\/\//.test(mention.profile_image_url)
				&& $(mention.l_mentioned_at).is('time')) {
		} else {
			throw "invalid Mention object";    	
		}

		$this = $('#template').children('.mention').clone();

		$this.data('tweet-id', mention.tweet_id);
		$('.user', $this).data('user-screen-name', mention.screen_name);
		$('a.profile', $this).prop('href', twitterURI + mention.screen_name);
		$('.user img', $this).prop('src', mention.profile_image_url);
		$('.name', $this).text(mention.name);
		$('.screen-name', $this).text(mention.screen_name);
		$('.date', $this).html(mention.l_mentioned_at).prop('href', twitterURI + mention.screen_name + '/status/' + mention.tweet_id);
		$('.text', $this).html(mention.text);

		this.add = add;
	}

	$(eventListeners);
	$(document).on('page:load', eventListeners);

	/*-----BEGIN TESTS-----*/
	/* Strip out this code before deployment with the build tool */
	_test_only_ = {
		Mention: function (data) { return new Mention(data) },
		renderCharsLimit: renderCharsLimit
	};
	/*-----END TESTS-----*/
}());