class Api::V1::TasksController < ApplicationController
  before_action :authenticate_api_v1_user!
  
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
    @task = Task.find(params[:id])

    if @task.update(task_update_params)
      render json: @task
    else
      render json: @task.error, status: :unprocessable_entity
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
  end

  def update_position
    @task = Task.find(params[:id])
    new_position = calculate_new_position(params[:previous_id], params[:next_id])

    if @task.update(position: new_position)
      render json: @task
    else
      render json: { error: 'Update failed' }, status: :unprocessable_entity
    end
  end

  def archive
    @user = current_api_v1_user
    @project = @user.projects.find(params[:project_id])
    @archives = @project.tasks.where.not(archive: nil)
    @unArchives = @project.tasks.where(archive: nil)
    @overdue_tasks = @project.tasks.where('due_date < ? ', Date.today)
    @tasks = @project.tasks
    render json: { archives: @archives, archives_count: @archives.count, unArchives_count: @unArchives.count, overdue_tasks_count: @overdue_tasks.count, tasks_count: @tasks.count }
  end

  def chart
    @user = current_api_v1_user
    
  end
  private

  def set_section
    @section = Section.find(params[:section_id])
  end

  def task_params
    params.require(:task).permit(:title, :description, :due_date, :position, :section_id, :status, :estimated_time, :archive, :advice, :created_at)
  end
 
  def task_update_params
    params.require(:task).permit(:title, :description, :due_date, :position, :section_id, :status, :estimated_time, :archive, :advice, :updated_at)
  end

  def calculate_new_position(previous_id, next_id)
    previous_task = Task.find_by(id: previous_id)
    next_task = Task.find_by(id: next_id)

    if previous_task && next_task
      (previous_task.position + next_task.position) / 2.0
    elsif previous_task
      prervious_task.position + 1
    elsif next_task 
      next_task.position / 2.0
    else
      1.0
    end 
  end
 
end
