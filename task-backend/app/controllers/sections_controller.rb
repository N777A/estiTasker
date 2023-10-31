class SectionsController < ApplicationController
  before_action :set_user
  before_action :set_project
  before_action :set_section, only: [:update, :destroy]
  def index
    @sections = @project.sections.all

    render json: @sections
  end

  def create
    @section = @project.sections.new(section_params)

    if @section.save
      render json: @section, status: :created, location: @section
    
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def update
    if @section.update(section_params)
      render json: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @section.destroy
    head :no_content
  end

  private

  def set_user
    @user = current_api_v1_user
  end

  def set_project
    @project = @user.projects.find(params[:project_id])
  end

  def set_section
    @section = @project.sections.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:title)
  end
end
