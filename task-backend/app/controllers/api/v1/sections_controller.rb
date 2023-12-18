class Api::V1::SectionsController < ApplicationController
    before_action :authenticate_api_v1_user!
    
  def index
    @user = current_api_v1_user
    @project = @user.projects.find(params[:project_id])
    @sections = @project.sections.includes(:tasks).order(:position)
    render json: @sections.as_json(include: :tasks)
  end

  def create
    @user = current_api_v1_user
    @project = @user.projects.find(params[:project_id])
    @section = @project.sections.new(section_params)

    if @section.save
      render json: @section.as_json(include: :tasks), status: :created
    
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  def update
    @section = Section.find(params[:id])

    if @section.update(section_params)
      render json: @section.as_json(include: :tasks)
    else
      render json: @section.error, status: :unprocessable_entity
    end
  end

  def destroy
    @section = Section.find(params[:id])
    @section.destroy
  end

  def update_position
    @section = Section.find(params[:id])
    new_position = calculate_new_position(params[:previous_section_id], params[:next_section_id])

    if @section.update(position: new_position)
      render json: @section
    else
      render json: 'Update failed', status: :unprocessable_entity
    end
  end

  private

  def section_params
    params.require(:section).permit(:title, :position)
  end

  def calculate_new_position(previous_section_id, next_section_id)
    previous_section = Section.find_by(id: previous_section_id)
    next_section = Section.find_by(id: next_section_id)
    if previous_section && next_section
      (previous_section.position + next_section.position) / 2.0
    elsif previous_section
      previous_section.position + 1.0
    elsif next_section
      next_section.position / 2.0
    else
      1.0
    end
  end
end
