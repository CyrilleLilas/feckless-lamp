json.array!(@new_mentions) do |mention|
  json.extract! mention, :id, :text
  json.url mention_url(mention, format: :json)
end
