class Api::V1::SectionsController < ApplicationController
  def index
    @user = current_api_v1_user
    @project = @user.projects.find(params[:project_id])
    @sections = @project.sections.all.includes(:tasks)
    p @sections
    render json: @sections.as_json(include: :tasks)
  end

  def create
    @user = current_api_v1_user
    @project = @user.projects.find(params[:project_id])
    @section = @project.sections.new(section_params)

    if @section.save
      render json: @section, status: :created
    
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def update
    @section = Section.find(params[:id])

    if @section.update(section_params)
      render json: @section
    else
      render json: @section.error, status: :unprocessable_entity
    end
  end

  def destroy
    @section = Section.find(params[:id])
    @section.destroy
  end

  private

  def section_params
    params.require(:section).permit(:title)
  end
end
