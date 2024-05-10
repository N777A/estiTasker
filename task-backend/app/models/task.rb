class Task < ApplicationRecord
  belongs_to :section
  has_many :advices, dependent: :destroy
end
