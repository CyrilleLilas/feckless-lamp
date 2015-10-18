class Mention < ActiveRecord::Base
	validates :name, length: { maximum: 20 }
	validates :screen_name, length: { maximum: 15 }
	validates :text, length: { maximum: 140 }
	validates :profile_image_url, length: { maximum: 2000 }
	validates_uniqueness_of :tweet_id
end
