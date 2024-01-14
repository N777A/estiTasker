class ChangeDatatypePositionOfTasks < ActiveRecord::Migration[6.1]
  def change
    change_column :tasks, :position, :float
  end
end
