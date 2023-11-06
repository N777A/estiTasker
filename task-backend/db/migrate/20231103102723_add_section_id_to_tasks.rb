class AddSectionIdToTasks < ActiveRecord::Migration[6.1]
  def change
    add_reference :tasks, :section, null: false, foreign_key: true
  end
end
