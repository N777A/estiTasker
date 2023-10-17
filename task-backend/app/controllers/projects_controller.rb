class ProjectsController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    puts "UID: #{request.headers['uid']}"
    puts "Access-Token: #{request.headers['access-token']}"
    puts "Client: #{request.headers['HTTP_CLIENT']}"
    request.headers.each do |key, value|
      puts "#{key}: #{value}"
    end
    puts '________________________________________________________'
    Rails.logger.info "Current User: #{current_api_v1_user.inspect}"

    @user = current_api_v1_user
    @projects = Project.all
    
    render json: { user: @user, projects: @projects}
  end

  def create 
    @project = Project.new(project_params)
  end

  private

  def project_params
    params.require(:project).permit(:title, :description, :icon, :status,)
  end
end
