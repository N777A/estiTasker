class ProjectsController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    @user = current_api_v1_user
    @projects = @user.projects.all
    
    render json: { user: @user, projects: @projects}
  end

  def create 
    @user = current_api_v1_user
    @project = @user.projects.new(project_params)

    if @project.save
      render json: @project, stauts: :created, location: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def show
    @user = current_api_v1_user
    @project = @user.projects.find(params[:id])
    Rails.logger.info(@project.inspect)

    render json: @project
  end

  private

  def project_params
    params.require(:project).permit(:title, :description, :icon, :status)
  end
end
