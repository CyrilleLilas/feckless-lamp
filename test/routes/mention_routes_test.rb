class MentionRoutesTest < ActionController::TestCase
  test "should route to index" do
    assert_routing '/', { controller: "mentions", action: "index" }
  end
 
  test "should route to reply" do
    assert_routing({ method: 'post', path: '/mentions/reply' }, { controller: "mentions", action: "reply" })
  end

  test "should route to fetch" do
    assert_routing({ method: 'post', path: '/mentions/fetch' }, { controller: "mentions", action: "fetch" })
  end
end