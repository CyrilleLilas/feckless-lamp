(function () {

	function eventListeners() {
		$('.fetch-btn').click(fetchMentions);
		$('.mentions').on('click', '.reply-btn', showReplyForm);
		$('#replyForm').submit(beforeSubmit);
		$('textarea[name="reply"]').keydown(updateCounter).on('paste', updateCounter);
	}

	/**
	* Request the server for new mentions ;
	* Display new mentions, or a warning if there are no new mentions available.
	*/
	function fetchMentions(event) {

		function onSuccess(data) {
			if (!$.trim(data)) {
				$('.no-mention-warning').removeClass('hidden');
			} else {
				$('.no-mention-warning').addClass('hidden');
			}

			$('.mentions').prepend(data);
		}

		function onError() {
			$('.no-mention-warning').addClass('hidden');
			$('#error_explanation').removeClass('hidden');
		}

		$.ajax('/mentions/fetch', { data: { since_id: $('.mention:first').data('tweet-id') },
					                type: 'post',
					                success: onSuccess,
					                error: onError });
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
			isLimitExceded = remainingChars < 0;

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

	$(eventListeners);
	$(document).on('page:load', eventListeners);

	/*-----BEGIN TESTS-----*/
	/* Strip out this code before deployment with the build tool */
	_test_only_ = {
		renderCharsLimit: renderCharsLimit
	};
	/*-----END TESTS-----*/
}());