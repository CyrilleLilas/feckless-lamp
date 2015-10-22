require 'test_helper'

class MentionTest < ActiveSupport::TestCase
  def setup
  	@mention = Mention.new name: "John Malkovich",
  				 screen_name: "@J_Malkovich",
  				 text: "@BraddPitt I love your hair",
  				 tweet_id: 3,
  				 mentioned_at: DateTime.new
  end

  test "should not save with no tweet_id" do
  	@mention.tweet_id= nil
    assert_not @mention.save
  end

  test "should not save with duplicate tweet_id" do
  	@mention.tweet_id= 1
    assert_not @mention.save
  end

  test "should not save with mentioned_at as an integer" do
  	@mention.mentioned_at= 5
    assert_not @mention.save
  end

  test "should not save with no mentioned_at" do
  	@mention.mentioned_at= nil
    assert_not @mention.save
  end

  test "should not save with text over 140 chars" do
  	@mention.text= "loooooooooooooooooooooooooooooong loooooooooooooooooooooooooooong loooooooong oooooooooooooooooooooooooooooooooooooooooooooong tweet 142 chars"
    assert_not @mention.save
  end

  test "should not save with no text" do
  	@mention.text= ""
    assert_not @mention.save
  end

  test "should not save with name over 20 chars" do
  	@mention.name= "John Malkovich Malkov"
    assert_not @mention.save
  end

  test "should not save with no name" do
  	@mention.name= nil
    assert_not @mention.save
  end

  test "should not save with screen name over 15 chars" do
  	@mention.screen_name= "John Malkovich M"
    assert_not @mention.save
  end

  test "should not save with no screen name" do
  	@mention.screen_name= nil
    assert_not @mention.save
  end

  test "should save" do
  	assert @mention.save
  end

end
