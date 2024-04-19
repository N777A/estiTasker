class CreateAdvices < ActiveRecord::Migration[6.1]
  def change
    create_table :advices do |t|
      t.references :task, null: false, foreign_key: true
      t.text :advice_text
      t.timestamps
    end
  end
end
