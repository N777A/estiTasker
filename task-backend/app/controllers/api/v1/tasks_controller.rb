class Api::V1::TasksController < ApplicationController

  def index
    @section = Section.find(params[:section_id])
    @tasks = @section.tasks
    render json: @tasks
  end

  def create
    @section = Section.find(params[:section_id])
    @task = @section.tasks.new(task_params)

    if @task.save
      render json: @task, status: :created
    
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    @section = Section.find(params[:section_id])
    @task = @section.tasks.find(params[:id])

    if @task.update(task_params)
      render json: @task
    else
      render json: @task.error, status: :unprocessable_entity
    end
  end

  def destroy
    @section = Section.find(params[:section_id])
    @task = @section.tasks.find(params[:id])
    @task.destroy
  end

  private

  def set_section
    @section = Section.find(params[:section_id])
  end

  def set_task
    @section = @section.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title)
  end
end
