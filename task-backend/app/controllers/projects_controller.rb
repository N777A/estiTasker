class ProjectsController < ApplicationController
  before_action :authenticate_api_v1_user!
  before_action :set_user
  before_action :set_project, only: [:show, :update, :destroy]

  def index
    @projects = @user.projects.all
    
    render json: { user: @user, projects: @projects}
  end

  def create 
    @project = @user.projects.new(project_params)

    if @project.save
      render json: @project, stauts: :created, location: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @project
  end

  def update
    if @project.update(project_params)
      render json: @project
    else
      render json: @project.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @project.destroy
    head :no_content
  end

  private

  def set_user
    @user = current_api_v1_user
  end

  def set_project
    @project = @user.projects.find(params[:id])
  end

  def project_params
    params.require(:project).permit(:title, :description, :icon, :status)
  end
end
