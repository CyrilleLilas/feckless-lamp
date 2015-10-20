require 'test_helper'

class MentionsControllerTest < ActionController::TestCase
  setup do
    mentions(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:mentions)
    assert_template :index
    assert_template layout: "layouts/application"
  end

  test "should fetch new mentions" do
    post :fetch, :format => :json, since_id: 1
    assert_not_nil assigns(:new_mentions)
    assert_template :fetch
  end

  test "should reply to a tweet" do
    post :reply, in_reply_to_status_id: 1, reply: "hello"
    assert_redirected_to '/'
  end

end
