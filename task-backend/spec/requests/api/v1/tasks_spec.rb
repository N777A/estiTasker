require 'rails_helper'

RSpec.describe 'API::V1::Tasks', type: :request do
  let(:user) { create(:user) }
  let(:auth_tokens) { sign_in(user) }
  let(:section) { create(:section) }
  let(:other_section) { create(:section) }
  let!(:task) { create(:task, section: section) }
  let!(:tasks) { create_list(:task, 2, section: section) }
  let(:other_section_task) { create(:task, section: other_section) }
  let(:json) { JSON.parse(response.body) }
  
  describe 'GET /api/v1/sections/section_id/tasks' do
    context 'taskの一覧が正常に取得できる場合' do
      before { get "/api/v1/sections/#{section.id}/tasks", headers: auth_tokens }

      it 'ステータスコード200が返ること' do
        expect(response).to have_http_status(:success)
      end

      it '取得したtaskの件数が正しいこと' do
        expect(json.length).to eq(3)
      end
    end

    context 'taskの一覧が取得できない場合' do
      it 'sectionIdが正しくない場合、task一覧が取得できないこと' do
        expect {get '/api/v1/sections/non_existing_section_id/tasks', headers: auth_tokens}.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合は一覧が取得できないこと' do
        get "/api/v1/sections/#{section.id}/tasks"

        expect(response).to have_http_status(401)
      end
    end
    
      it 'sectionに関連づけられていないtaskは取得できないこと' do
        get "/api/v1/sections/#{section.id}/tasks", headers: auth_tokens

        task_ids = json.map { |task| task['id'] }
        expect(task_ids).to_not include(other_section_task.id)
      end
  end

  describe 'POST /api/v1/sections/section_id/tasks' do
    context 'taskが正常に作成できる場合' do
      task_params = { task: { title: 'task title' } }
      before { post "/api/v1/sections/#{section.id}/tasks", params: task_params, headers: auth_tokens }

      it 'taskが正常に作成できること' do
        expect{post "/api/v1/sections/#{section.id}/tasks", params: task_params, headers: auth_tokens }.to change(Task, :count).by(+1)
        expect(response).to have_http_status(:success)
      end
    end
 
    context 'taskの作成が失敗する場合' do
      it '未認証の場合は作成できないこと' do
        task_params = { task: { title: 'task title' } }
        post "/api/v1/sections/#{section.id}/tasks", params: task_params

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'PUT /api/v1/tasks/task_id' do
    context 'taskが正常に更新できる場合' do
      new_due_date = Date.today + 14.days
      task_update_params = { task: { title: 'Updated task title', description: 'Updated task description', due_date: new_due_date, status: 2 } }
      before { put "/api/v1/tasks/#{task.id}", params: task_update_params, headers: auth_tokens }

      it 'ステータスコード200が返ること' do
        expect(response).to have_http_status(:success)
      end

      it 'titleが正常に更新されていること' do
        expect(json["title"]).to eq('Updated task title')
      end

      it 'descriptionが正常に更新されていること' do
        expect(json["description"]).to eq('Updated task description')
      end

      it  'due_dateが正常に更新されていること' do
        expect(json["due_date"]).to eq(new_due_date.to_s)
      end

      it 'statusが正常に更新されていること' do
        expect(json["status"]).to eq(2)
      end
    end

    context 'taskが正常に更新できないこと' do
      it '存在しないtaskIdが指定された場合、更新に失敗すること' do
        expect { put "/api/v1/tasks/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合、更新できないこと' do
        task_update_params = { task: { title: 'Updated task title' } }
        put "/api/v1/tasks/#{task.id}", params: task_update_params

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'DELETE /api/v1/tasks/task_id' do
    context 'taskが正常に削除できる場合' do
      it 'taskが正常に削除できること' do
        expect { delete "/api/v1/tasks/#{task.id}", headers: auth_tokens }.to change(Task, :count).by(-1)
        expect(response).to have_http_status(:success)
      end
    end

    context 'taskの削除に失敗する場合' do
      it '存在しないtaskIdが指定された場合、削除に失敗すること' do
        expect { delete "/api/v1/tasks/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合、削除できないこと' do
        delete "/api/v1/tasks/#{task.id}"

        expect(response).to have_http_status(401)
      end
    end
  end
end
