class CreateMentions < ActiveRecord::Migration
  def change
    create_table :mentions do |t|
      t.integer :tweet_id, :user_id
      t.string :name, :screen_name, :profile_image_url, :text
      t.datetime :mentioned_at

      t.timestamps
    end
    add_index :mentions, :tweet_id, :unique => true
  end
end