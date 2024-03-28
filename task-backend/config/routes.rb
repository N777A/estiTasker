Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :questions, only: %i[index show create update destroy]

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[index]
      end

      resources :projects do
        resources :sections, only: [:index, :create]
      end
    
      resources :sections, only: [:update, :destroy] do
        member do
          patch 'update_position'
        end
        resources :tasks, only: [:index, :create]
      end

      resources :tasks, only: [:update, :destroy]

      resources :llm, only: [], controller: 'llm' do
        collection do
          post :create_tasks
          post :estimate_task_time
        end
      end
    end
  end
root to: 'api/v1/projects#index'
end
