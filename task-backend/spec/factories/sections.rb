FactoryBot.define do
  factory :section do
    association :project
    title {'section  title'}
  end
end
