class Api::V1::AdvicesController < ApplicationController
  before_action :authenticate_api_v1_user!
  
  def index
    @task = Task.find(params[:task_id])
    @advices = @task.advices
    render json: @advices
  end

  def create
    @task = Task.find(params[:task_id])
    @advice = @task.advices.new(advice_params)

    if @advice.save
      render json: @advice, status: :created
    else
      render json: @advice.errors, status: :unprocessable_entity
    end
  end

  private

  def advice_params
    params.require(:advice).permit(:title, :task_id, :advice_text, :advice, :created_at)
  end
end
