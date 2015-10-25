QUnit.module('mentions');
QUnit.test("renderCharsLimit", function (assert) {
  var fixture = $('#qunit-fixture'),
    textarea;

  fixture.html('<form accept-charset="UTF-8" action="/mentions/reply" id="replyForm" method="post"><input type="hidden" name="in_reply_to_status_id"><div class="form-group"><textarea name="reply" class="form-control" rows="3"></textarea></div><input class="tweet-btn btn btn-default" name="commit" type="submit" value="Tweet"><span class="count">140</span></form>');

  textarea = $('textarea[name="reply"]', fixture);

  textarea.val('');
  _test_only_.renderCharsLimit(fixture);
  assert.ok(!$('.tweet-btn', fixture).prop('disabled'), "tweet button is enabled by default");
  assert.ok(!$('.count', fixture).hasClass('text-danger'), "the counter is not rendered as danger");
  assert.equal($('.count', fixture).text(), 140, "the counter has the right value");

  textarea.val('@Michel Hello Michel');
  _test_only_.renderCharsLimit(fixture);
  assert.ok(!$('.tweet-btn', fixture).prop('disabled'), "tweet button is enabled");
  assert.ok(!$('.count', fixture).hasClass('text-danger'), "the counter is not rendered as danger");
  assert.equal($('.count', fixture).text(), 120, "the counter has the right value");

  textarea.val("I have just seen the most incredible singer performing live ! I can't hear anything now though, that's too bad #TooGood #MeltingEars #TooLoud");
  _test_only_.renderCharsLimit(fixture);
  assert.ok($('.tweet-btn', fixture).prop('disabled'), "tweet button is disabled");
  assert.ok($('.count', fixture).hasClass('text-danger'), "the counter is rendered as danger");
  assert.equal($('.count', fixture).text(), -1, "the counter has the right value");
});