class MentionsController < ApplicationController

  def index
    @mentions = Mention.all.order(tweet_id: :desc)
    @template_mention = Mention.new
  end

  def fetch
    options = fetch_params
    if options[:since_id] === ""
      options = {}
    end
    new_mentions = TwitterClient.mentions_timeline(options).reverse!
    @new_mentions = []
    new_mentions.each_index do |i|
      @new_mentions[i] = create new_mentions[i]
    end
  end

  def reply
    reply = TwitterClient.update(reply_params[:reply], { in_reply_to_status_id: reply_params[:in_reply_to_status_id] })
    respond_to do |format|
      format.html { redirect_to '/' }
      format.json { head :no_content }
    end
  end

  private
    def create new_mention
      mention = Mention.new({ tweet_id: new_mention.id,
        user_id: new_mention.user.id,
        name: new_mention.user.name,
        screen_name: new_mention.user.screen_name,
        text: new_mention.text,
        mentioned_at: new_mention.created_at,
        profile_image_url: new_mention.user.profile_image_url.to_s })
      mention.save
      return mention
    end

    def fetch_params
      params.permit(:since_id)
    end

    def reply_params
      params.permit(:reply, :in_reply_to_status_id)
    end
end
