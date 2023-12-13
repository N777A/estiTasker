class Api::V1::ProjectsController < ApplicationController
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
      render json: @project, stauts: :created
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def show
    @user = current_api_v1_user
    @project = @user.projects.find(params[:id])
    
    render json: @project
  end

  def update
    @user  = current_api_v1_user
    @project = @user.projects.find(params[:id])

    if @project.update(project_params)
      render json: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user = current_api_v1_user
    @project  = @user.projects.find(params[:id])
    @project.destroy
  end

  private

  def project_params
    params.require(:project).permit(:title, :description)
  end
end
