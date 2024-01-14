class Api::V1::LlmController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_aws_sdk

  def create_tasks
    @tasks = invoke(
      "Human: Break down to Tasks based on description. Estimate Time for each task for beginner developer.
      Convert estimated to minutes.
      Follow output-format and wrap result in <output></output> tag. output in Japanese.
      <description>
      #{params[:input]}
      </description>
      <output-format>
      [
        { \"title\": string, \"description\": string, \"estimated\": string (format: \"HH:mm\"), \"estimated_time\" : number }
      ]
      <output-format>
      Breakdown task into small tasks. For example if it is frontend, break tasks to page, feature, and component level.
      Assistant:"
    )
    
    render json: { tasks: @tasks }
  end
  
  def estimate_task_time
    @task = invoke(
      "Human: Estimate the time it will take to complete the following task in hour. 
      Follow output-format and wrap result in <output></output> tag.
      <task>
      #{params[:task]}
      </task>
      <output-format>
      { \"title\": string, \"time\": number (time to coplete in hour) }
      </output-format>
      Assistant:"
    )
    
    render json: { task: @task }
  end

  private

  def set_aws_sdk
    @client = Aws::BedrockRuntime::Client.new()
  end

  def invoke(prompt)
    resp = @client.invoke_model({
      body: {
        prompt: prompt,
        temperature: 0.7,
        top_p: 1.0,
        top_k: 5,
        max_tokens_to_sample: 1024,
      }.to_json,
      content_type: "application/json",
      accept: "application/json",
      model_id: "anthropic.claude-instant-v1",
    })
    parsed_body = JSON.parse(resp.body.is_a?(StringIO) ? resp.body.read : resp.body)
    completion = parsed_body["completion"]
    json_string = completion.match(/<output>(.*?)<\/output>/m)[1]
    JSON.parse(json_string)
  end
end
