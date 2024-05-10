class RemoveArchiveFromTasks < ActiveRecord::Migration[6.1]
  def up
    remove_column :tasks, :archive
      end

  def down
    add_column :tasks, :archive, :boolean
  end
end
