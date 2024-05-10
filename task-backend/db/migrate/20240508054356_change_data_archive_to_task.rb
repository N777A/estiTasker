class ChangeDataArchiveToTask < ActiveRecord::Migration[6.1]
  def change
    change_column :tasks, :archive, :date
  end
end
