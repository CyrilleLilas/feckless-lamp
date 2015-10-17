class CreateMentions < ActiveRecord::Migration
  def change
    create_table :mentions do |t|
      t.text :body

      t.timestamps
    end
  end
end
