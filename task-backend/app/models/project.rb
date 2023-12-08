class Project < ApplicationRecord
  belongs_to :user
  has_many :sections, dependent: :destroy
  validates :title, presence: true, length: { maximum: 20 }
  validates :description, length: { maximum: 100 }
end
