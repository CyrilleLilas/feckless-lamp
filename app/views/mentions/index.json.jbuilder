json.array!(@mentions) do |mention|
  json.extract! mention, :id, :body
  json.url mention_url(mention, format: :json)
end
