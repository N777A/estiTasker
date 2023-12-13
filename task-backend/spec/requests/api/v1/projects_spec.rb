require 'rails_helper'

RSpec.describe 'API::V1::Projects', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:auth_tokens) { sign_in(user) }
  let(:other_user_auth_tokens) { sign_in(other_user) }
  let!(:projects) { create_list(:project, 2, user: user) }
  let!(:project) { create(:project, user: user) }
  let(:base_url) { '/api/v1/projects'}
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v1/projects' do
    context 'project一覧が正常に取得できる場合' do
      before { get base_url, headers: auth_tokens }

      it '200のステータスコードを返すこと' do
        expect(response).to have_http_status(:success)
      end

      it '取得したProjectの件数が正しいこと' do
        expect(json['projects'].length).to eq(3)
      end
    end

    context 'project一覧が取得できない場合' do
      it '未認証の場合はProject一覧を取得できないこと' do
        get "#{base_url}"
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET /api/v1/projects/:id' do
    context  '特定のProjectが正常に取得できる場合' do
      before { get "#{base_url}/#{project.id}", headers: auth_tokens }

      it 'ステータスコードが200を返すこと' do
        expect(response).to have_http_status(:success)
      end

      it 'titleとdescriptionが正常に取得できていること' do
        expect(json["title"]).to eq(project["title"])
        expect(json["description"]).to eq(project["description"])
      end
    end

    context '特定のProjectが取得できない場合' do
      it '存在しないプロジェクトIDを指定すると失敗すること' do
        expect { get "#{base_url}/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合は特定のprojectを取得できないこと' do
        get "#{base_url}/#{project.id}"

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'Post /api/v1/projects' do
    context 'Projectが正常に作成できる場合' do
      project_params = { project: { title: 'New Project', description: 'Project description'} }

      it 'Projectが正常に作成できること' do
        
        expect{ post base_url, params: project_params, headers: auth_tokens }.to change(Project, :count).by(+1)
        expect(response).to have_http_status(:success)
      end

      it 'レスポンスデータが正しいこと' do
        post base_url, params: project_params, headers: auth_tokens

        expect(json['title']).to eq('New Project')
        expect(json['description']).to eq('Project description')
      end
    end

    context 'Projectの新規作成が失敗する場合' do
      it 'titleが空の場合は作成できないこと' do
        project_params = { project: { title: '', description: 'project description'} }
        post base_url, params: project_params, headers: auth_tokens

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'titleが20文字以上の場合は作成できないこと' do
        project_params = { project: { title: 'a' * 21, description: 'project description'} }
        post base_url, params: project_params, headers: auth_tokens

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'descriptionが100文字以上の場合は作成できないこと' do
        project_params = { project: { title: 'project title', description: 'a' * 101}}
        post base_url, params: project_params, headers: auth_tokens

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it '未認証の場合は新規作成できないこと' do
        project_params = { project: { title: 'New Project', description: 'Project description'} }
        post base_url, params: project_params

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'Put /api/v1/projects/:id' do
    context 'Projectが正常に更新できる場合' do
      it 'Projectが正常に更新できること' do
        project_update_params = { project: { title: 'Updated Project', description: 'Updated Project description'}}
        put "#{base_url}/#{project.id}", params: project_update_params, headers: auth_tokens
  
        expect(response).to have_http_status(:success)
        expect(json["title"]).to eq('Updated Project')
        expect(json["description"]).to eq('Updated Project description')
      end
    end

    context 'Projectの更新が失敗する場合' do
      it 'タイトルが未入力の場合、更新に失敗すること' do
        project_update_params = { project: { title: '', description: 'Updated Project description'}}

        put "#{base_url}/#{project.id}", params: project_update_params, headers: auth_tokens

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'titleが20文字以上の場合は更新できないこと' do
        project_update_params = { project: { title: 'a' * 21, description: 'project description'} }
        put "#{base_url}/#{project.id}", params: project_update_params, headers: auth_tokens

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'descriptionが100文字以上の場合は更新できないこと' do
        project_update_params = { project: { title: 'project title', description: 'a' * 101}}
        put "#{base_url}/#{project.id}", params: project_update_params, headers: auth_tokens

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it '存在しないprojectIdの場合、更新できないこと' do
        expect { put "#{base_url}/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合は更新できないこと' do
        project_update_params = { project: { title: 'Updated Project', description: 'Updated Project description'}}
        put "#{base_url}/#{project.id}", params: project_update_params

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'Delete /api/v1/projects/:id' do
    context 'projectを正常に削除できる場合' do
      it 'Projecを正常に削除できること' do
        expect { delete "#{base_url}/#{project.id}", headers: auth_tokens }.to change(Project, :count).by(-1)
        expect(response).to have_http_status(204)
      end
    end
   
    context 'projectが削除できない場合' do
      it '存在しないprojectが指定された場合、削除できないこと' do
        expect { delete "#{base_url}/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it  '未認証の場合、削除できないこと' do
        delete "#{base_url}/#{project.id}"

        expect(response).to have_http_status(401)
      end
    end
  end
end
