FactoryBot.define do
  factory :task do
    association :section
    title {'task title'}
    description {'task description'}
    due_date { Date.today + 7.days }
    status { 0 }
  end
end
