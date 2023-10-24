class AddForeignKeyToSection < ActiveRecord::Migration[6.1]
  def change
    add_reference :sections, :project, null: false, foreign_key: true
  end
end
