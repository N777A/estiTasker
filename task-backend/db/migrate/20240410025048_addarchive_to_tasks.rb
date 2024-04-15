class AddarchiveToTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :archive, :boolean, default: false, null: false
  end
end
