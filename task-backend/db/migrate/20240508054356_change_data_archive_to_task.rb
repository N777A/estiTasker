class ChangeDataArchiveToTask < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      ALTER TABLE tasks
      ALTER COLUMN archive TYPE date
      USING (CASE WHEN archive THEN CURRENT_DATE ELSE NULL END);
    SQL
  end

  def down
    execute <<-SQL
      ALTER TABLE tasks
      ALTER COLUMN archive TYPE boolean
      USING (CASE WHEN archive IS NOT NULL THEN 't'::boolean ELSE 'f'::boolean END);
    SQL
  end
end
