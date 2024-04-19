class Api::V1::LlmController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_aws_sdk

  def create_tasks
    @tasks = invoke(
      "Break down to Tasks based on description. Estimate Time for each task.
      Follow output-format and wrap result in <output></output> tag. output in Japanese.
      <description>
      #{params[:input]}
      </description>
      <output-format>
      [
        { \"title\": string, \"description\": string, \"estimated_time\": string (format: \"HH:mm\") }
      ]
      <output-format>
      Breakdown task into small tasks. For example if it is frontend, break tasks to page, feature, and component level."
    )
    
    render json: { tasks: @tasks }
  end
  
  def advice_task
    @advice = invoke(
      "Based on the task description, generate three practical advice that could help in effectively completing the task. Consider factors like task complexity, necessary skills, and potential obstacles. Also, provide a breakdown of steps or considerations that might be useful in Japanese. Enclose with <output> when outputting. Output in Japanese. 
      <description>
      #{params[:input]}
      </description>
      <output-format>
      [
        { \"advice\": string }
      ]
      <output-format>"
    )

    render json: { advice: @advice }
  end

  private

  def set_aws_sdk
    @client = Aws::BedrockRuntime::Client.new()
  end

  def invoke(prompt)
    resp = @client.invoke_model({
      body: {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [
            {
              "role": "user",
              "content": [
                {"type": "text", "text": prompt}
              ],
            }
        ],
    }.to_json,
      content_type: "application/json",
      accept: "application/json",
      model_id: "anthropic.claude-3-haiku-20240307-v1:0",
    })
    parsed_body = JSON.parse(resp.body.read)
    puts parsed_body
    completion = parsed_body['content'][0]['text']
    puts completion.match(/<output>(.*?)<\/output>/m)
    json_string = completion.match(/<output>(.*?)<\/output>/m)[1]
    JSON.parse(json_string.strip)
  end
end
