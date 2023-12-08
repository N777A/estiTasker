FactoryBot.define do
  factory :project do
    association :user
    title {'project title'}
    description {'project description'}
  end
end
