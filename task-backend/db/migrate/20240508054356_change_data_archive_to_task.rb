class ChangeDataArchiveToTask < ActiveRecord::Migration[6.0]
  def up
    remove_column :tasks, :archive
  end

  def down
    add_column :tasks, :archive, :boolean, default: false, null: false
  end
end
