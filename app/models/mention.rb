class Mention < ActiveRecord::Base
	include Twitter::Autolink
	validates :name, :screen_name, :text, :tweet_id, :mentioned_at, presence: true
	validates :name, length: { maximum: 20 }
	validates :screen_name, length: { maximum: 15 }
	validates :text, length: { maximum: 140 }
	validates :profile_image_url, length: { maximum: 2000 }
	validates_uniqueness_of :tweet_id
	def l_mentioned_at
		if mentioned_at
			l = I18n.l(self.mentioned_at, format: :short)
		end
		l || DateTime.new
	end
	def parsed_text
		auto_link(text).to_s.html_safe
	end
end
