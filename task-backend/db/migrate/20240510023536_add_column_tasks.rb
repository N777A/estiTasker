class AddColumnTasks < ActiveRecord::Migration[6.1]
  def up
    add_column :tasks, :archive, :date
  end

  def down
    remove_column :tasks, :archive, :date
  end
end
