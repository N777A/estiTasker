class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.integer :status
      t.date :due_date
      t.integer :position

      t.timestamps
    end
  end
end
