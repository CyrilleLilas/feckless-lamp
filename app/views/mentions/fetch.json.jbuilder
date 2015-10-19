json.array! @new_mentions do |m|
	#convert id to string for handling of large numbers
	json.tweet_id m.tweet_id.to_s
	json.name m.name
	json.screen_name m.screen_name
	json.text m.text
	json.l_mentioned_at m.l_mentioned_at
	json.profile_image_url m.profile_image_url
end