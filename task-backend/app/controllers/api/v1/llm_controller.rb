class Api::V1::LlmController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_aws_sdk

  def create_tasks
    @tasks = invoke(
      "Break down to Tasks based on description. Estimate Time for each task. Output in Japanese.",
      params[:input]
    )
    render json: { tasks: @tasks }
  end

  def estimate_task_time
    @task = invoke(
      "Estimate the time it will take to complete the following task in hour.",
      params[:task]
    )
    render json: { task: @task }
  end

  private

  def set_aws_sdk
    @client = Aws::BedrockRuntime::Client.new()
  end

  def invoke(description, input)
    messages = [{
      "role": "user",
      "content": [{"type": "text", "text": input}]
    }]

    body = {
      "anthropic_version": "bedrock-2023-05-31",
      "max_tokens": 300,
      "system": "あなたは優秀なAIボットです",
      "messages": messages
    }

    response = @client.invoke_model(
      model_id: "anthropic.claude-3-haiku-20240307-v1:0",
      body: body.to_json,
      content_type: "application/json",
      accept: "application/json"
    )

    response_body = JSON.parse(response.body.read)
    completion = response_body["completion"]
    if completion
      match_data = completion.match(/<output>(.*?)<\/output>/m)
      match_data ? JSON.parse(match_data[1]) : {}
    else
      { error: "No valid output received from the model." }
    end
  rescue => e
    { error: e.message }
  end
end
