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

QUnit.test("invalid Mention objects", function (assert) {
  var exception = /invalid Mention object/;

  function callMention(prop, value) {
    var data = { tweet_id: "2",
                 screen_name: "HughGrant",
                 profile_image_url: "http://profiles.com/456321",
                 name: "Hugh Grant",
                 l_mentioned_at: "<time>20150201120536</time>",
                 text: "Hey @JohnTravolta ! #longtimenosee" };

    if (typeof value === 'undefined') {
        delete data[prop];
    } else {
        data[prop] = value;
    }
    
    return _test_only_.Mention(data);
  }

  assert.throws(function () { callMention('tweet_id'); }, exception, "tweet-id should not be missing");
  assert.throws(function () { callMention('tweet_id', 2); }, exception, "tweet-id should not be an integer");
  assert.throws(function () { callMention('tweet_id', {}); }, exception, "tweet-id should not be an object");
  assert.throws(function () { callMention('tweet_id', null); }, exception, "tweet-id should not be null");
  assert.throws(function () { callMention('tweet_id', false); }, exception, "tweet-id should not be a boolean");

  assert.throws(function () { callMention('screen_name'); }, exception, "screen name should not be missing");
  assert.throws(function () { callMention('screen_name', 45); }, exception, "screen name should not be an integer");
  assert.throws(function () { callMention('screen_name', {}); }, exception, "screen name should not be an object");
  assert.throws(function () { callMention('screen_name', null); }, exception, "screen name should not be null");
  assert.throws(function () { callMention('screen_name', true); }, exception, "screen name should not be a boolean");

  assert.throws(function () { callMention('name'); }, exception, "name should not be missing");
  assert.throws(function () { callMention('name', 3); }, exception, "name should not be an integer");
  assert.throws(function () { callMention('name', {}); }, exception, "name should not be an object");
  assert.throws(function () { callMention('name', null); }, exception, "name should not be null");
  assert.throws(function () { callMention('name', true); }, exception, "name should not be a boolean");

  assert.throws(function () { callMention('profile_image_url'); }, exception, "profile image URL should not be missing");
  assert.throws(function () { callMention('profile_image_url', 65); }, exception, "profile image URL should not be an integer");
  assert.throws(function () { callMention('profile_image_url', []); }, exception, "profile image URL should not be an object");
  assert.throws(function () { callMention('profile_image_url', null); }, exception, "profile image URL should not be null");
  assert.throws(function () { callMention('profile_image_url', true); }, exception, "profile image URL should not be a boolean");

  assert.throws(function () { callMention('l_mentioned_at'); }, exception, "l_mentioned_at should not be missing");
  assert.throws(function () { callMention('l_mentioned_at', 789); }, exception, "l_mentioned_at should not be an integer");
  assert.throws(function () { callMention('l_mentioned_at', []); }, exception, "l_mentioned_at should not be an object");
  assert.throws(function () { callMention('l_mentioned_at', null); }, exception, "l_mentioned_at should not be null");
  assert.throws(function () { callMention('l_mentioned_at', true); }, exception, "l_mentioned_at should not be a boolean");

  assert.throws(function () { callMention('text'); }, exception, "text should not be missing");
  assert.throws(function () { callMention('text', 5); }, exception, "text should not be an integer");
  assert.throws(function () { callMention('text', {}); }, exception, "text should not be an object");
  assert.throws(function () { callMention('text', null); }, exception, "text should not be null");
  assert.throws(function () { callMention('text', true); }, exception, "text should not be a boolean");

  assert.throws(function () { callMention("profile_image_url", "http:/prof/iles.com/456321"); },
      exception, "profile_image_url should be a valid URL");
  assert.throws(function () { callMention("l_mentioned_at", "20150201120536"); },
      exception, "l_mentioned_at should be a <time> tag");
});

QUnit.test("valid Mention Objects", function (assert) {
  var fixture = $('#qunit-fixture'),
      mention;

  fixture.html('<ul class="mentions"></ul><div id="template"><li class="mention well" data-tweet-id=""><div class="user" data-user-screen-name=""><a class="profile" href="http://twitter.com/"><img class="profile-img img-thumbnail" src="" alt=""><strong class="name"></strong><span>@<strong class="screen-name"></strong></span></a><a href="http://twitter.com/" class="date"></a></div><p class="text"></p><p class="reply-btn"><button type="button" class="btn btn-default reply-btn">Reply</button></p><div class="reply"></div></li></div>');

  _test_only_.Mention({ tweet_id: "2",
                        screen_name: "HughGrant",
                        profile_image_url: "http://profiles.com/456321",
                        name: "Hugh Grant",
                        l_mentioned_at: "<time>Oct. 27, 2015 20:12</time>",
                        text: "Hey @JohnTravolta ! #LongTimeNoSee" }).add();

  mention = $('.mention', fixture);
  assert.strictEqual(mention.data('tweet-id'), "2", "tweet-id");
  assert.strictEqual($('.user').data('user-screen-name'), "HughGrant", "data attribute 'user-screen-name'");
  assert.strictEqual($('a.profile', mention).prop('href'), "http://twitter.com/HughGrant", "profile URL");
  assert.strictEqual($('.user img', mention).prop('src'), "http://profiles.com/456321", "profile image URL");
  assert.strictEqual($('.name', mention).text(), "Hugh Grant", "user name");
  assert.strictEqual($('.screen-name', mention).text(), "HughGrant", "user screen name");
  assert.strictEqual($('.date', mention).html(), "<time>Oct. 27, 2015 20:12</time>", "date");
  assert.strictEqual($('.date', mention).prop('href'), "http://twitter.com/HughGrant/status/2", "status URL");
  assert.strictEqual($('.text', mention).text(), "Hey @JohnTravolta ! #LongTimeNoSee", "text");
});