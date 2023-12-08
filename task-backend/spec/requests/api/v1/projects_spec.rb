require 'rails_helper'

RSpec.describe 'API::V1::Projects', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:auth_tokens) { sign_in(user) }
  let(:other_user_auth_tokens) { sign_in(other_user) }
  let!(:projects) { create_list(:project, 2, user: user) }
  let!(:project) { create(:project, user: user)}
  let(:base_url) { '/api/v1/projects'}
  let(:json) { JSON.parse(response.body)}

  describe 'GET /api/v1/projects' do
    context 'project一覧が正常に取得できること' do
      before { get base_url, headers: auth_tokens }

      it '200のステータスコードを返すこと' do
        expect(response).to have_http_status(200)
      end

      it '取得したProjectの件数が正しいこと' do
        expect(json['projects'].length).to eq(3)
      end

      it 'ユーザIDが正しいこと' do
        expect(json['user']['id']).to eq(user.id)
      end
    end

    context '他のユーザーの場合' do
      before { get base_url, headers: other_user_auth_tokens}
    end
   
    context 'project一覧が取得できない場合' do
      it '未認証の場合はProjectを取得できないこと' do
        get '/api/v1/projects'
        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET /api/v1/projects/:id' do
    context  '特定のProjectが正常に取得できること' do
      before { get "#{base_url}/#{project.id}", headers: auth_tokens }

      it 'ステータスコードが200を返すこと' do
        expect(response).to have_http_status(200)
      end

      it 'titleとdescriptionが正常に取得できていること' do
        expect(json["title"]).to eq(project["title"])
        expect(json["description"]).to eq(project["description"])
      end
    end
  end

  describe 'Post /api/v1/projects' do
    it 'Projectが正常に作成できること' do
      project_params = { project: { title: 'New Project', description: 'Project description'} }
      
      expect{ post base_url, params: project_params, headers: auth_tokens }.to change(Project, :count).by(+1)
      expect(response).to have_http_status(200)
    end
  end

  describe 'Put /api/v1/projects/:id' do
    it 'Projectが正常に更新できること' do
      project_update_params = { project: { title: 'Updated Project', description: 'Updated Project description'}}
      put "#{base_url}/#{project.id}", params: project_update_params, headers: auth_tokens

      expect(response).to have_http_status(200)
      expect(json["title"]).to eq('Updated Project')
      expect(json["description"]).to eq('Updated Project description')
    end
  end

  describe 'Delete /api/v1/projects/:id' do
    it 'Projecを正常に削除できること' do
      expect { delete "#{base_url}/#{project.id}", headers: auth_tokens }.to change(Project, :count).by(-1)
      expect(response).to have_http_status(204)
    end
  end
end
