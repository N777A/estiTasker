class RemoveNotNullConstraintFromArchive < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tasks, :archive, true
  end
end
