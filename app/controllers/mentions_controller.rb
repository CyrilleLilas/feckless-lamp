class MentionsController < ApplicationController
  before_action :set_mention, only: [:show, :edit, :update, :destroy]

  # GET /mentions
  # GET /mentions.json
  def index
    @mentions = Mention.all
    options = {}
    @new_mentions = TwitterClient.mentions_timeline(options)
    # logger.debug "MENTIONS #{@new_mentions}"
  end

  # GET /mentions/1
  # GET /mentions/1.json
  def show
  end

  # GET /mentions/new
  def new
    @mention = Mention.new
  end

  # GET /mentions/1/edit
  def edit
  end

  # POST /mentions
  # POST /mentions.json
  def create
    @mention = Mention.new(mention_params)

    respond_to do |format|
      if @mention.save
        format.html { redirect_to @mention, notice: 'Mention was successfully created.' }
        format.json { render action: 'show', status: :created, location: @mention }
      else
        format.html { render action: 'new' }
        format.json { render json: @mention.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /mentions/1
  # PATCH/PUT /mentions/1.json
  def update
    respond_to do |format|
      if @mention.update(mention_params)
        format.html { redirect_to @mention, notice: 'Mention was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @mention.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /mentions/1
  # DELETE /mentions/1.json
  def destroy
    @mention.destroy
    respond_to do |format|
      format.html { redirect_to mentions_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_mention
      @mention = Mention.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def mention_params
      params.require(:mention).permit(:body)
    end
end
