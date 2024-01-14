class AddEstimateTimeToTask < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :estimated_time, :integer
  end
end
