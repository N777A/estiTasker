class SectionsController < ApplicationController
  def index
    @sections = Project.sections.all
  end

  def create
    @user = current_api_v1_user
    @project = @user.projects.find(params[:id])
    @section = @project.sections.new(section_params)

    if @section.save
      render json: @section, status: :created, location: @section
    
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  private

  def section_params
    params.require(:sections).premit(:title)
  end
end
