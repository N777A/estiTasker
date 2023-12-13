require 'rails_helper'

RSpec.describe 'API::V1::Sections', type: :request do
  let(:user) { create(:user) }
  let(:auth_tokens) { sign_in(user) }
  let(:project) { create(:project, user: user) }
  let(:other_project) { create(:project,  user: user) }
  let!(:sections) { create_list(:section, 2, project: project) }
  let!(:section) { create(:section, project: project) }
  let!(:other_project_section) { create(:section, project: other_project) }
  let(:base_url) { "/api/v1/projects/#{project.id}/sections" }
  let(:json) { JSON.parse(response.body) }
  
  describe 'GET /api/v1/sections' do
    context 'sectionの一覧が正常に取得できる場合' do
      before { get base_url, headers: auth_tokens }

      it 'ステータスコード200が返ること' do
        expect(response).to have_http_status(:success)
      end

      it '取得したsectionの件数が正しいこと' do
        expect(json.length).to eq(3)
      end
    end

    context 'section一覧が取得できない場合' do
      it 'projectIdが正しくない場合、section一覧が取得できないこと' do
        expect {get '/api/v1/projects/non_existing_project_id/sections', headers: auth_tokens}.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合は一覧が取得できないこと' do
        get base_url

        expect(response).to have_http_status(401)
      end
    end
    
      it 'projectに関連づけられていないsectionは取得できないこと' do
        get base_url, headers: auth_tokens

        section_ids = json.map { |section| section['id'] }
        expect(section_ids).to_not include(other_project_section.id)
      end
  end

  describe 'POST api/v1/projects/:project_id/sections' do
    context 'sectionが正常に作成できる場合' do
      section_params = { section: { title: 'section title' } }
      before { post "/api/v1/projects/#{project.id}/sections", params: section_params, headers: auth_tokens }

      it 'sectionが正常に作成できること' do
        expect{post "/api/v1/projects/#{project.id}/sections", params: section_params, headers: auth_tokens }.to change(Section, :count).by(+1)
        expect(response).to have_http_status(:success)
      end

    end

    context  'sectionの作成が失敗する場合' do
      it '未認証の場合は作成できないこと' do
        section_params = { section: { title: 'section title' } }
        post "/api/v1/projects/#{project.id}/sections", params: section_params

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'PUT /api/v1/sections/section_id' do
    context 'sectionが正常に更新できる場合' do
      section_update_params = { section: { title: 'Updated section title' } }
      before { put "/api/v1/sections/#{section.id}", params: section_update_params, headers: auth_tokens }

      it 'sectionが正常に更新できること' do
        expect(response).to have_http_status(:success)
        expect(json["title"]).to eq('Updated section title')
      end
    end

    context 'sectionが正常に更新できないこと' do
      it '存在しないsectionIdが指定された場合、更新に失敗すること' do
        expect { put "/api/v1/sections/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合、更新できないこと' do
        section_update_params = { section: { title: 'Updated section title' } }
        put "/api/v1/sections/#{section.id}", params: section_update_params

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'DELETE /api/v1/sections/section_id' do
    context 'sectionが正常に削除できる場合' do
      it 'sectionが正常に削除できること' do
        expect { delete "/api/v1/sections/#{section.id}", headers: auth_tokens }.to change(Section, :count).by(-1)
        expect(response).to have_http_status(:success)
      end
    end

    context 'sectionの削除に失敗する場合' do
      it '存在しないsectionIdが指定された場合、削除に失敗すること' do
        expect { delete "/api/v1/sections/non_existing_id", headers: auth_tokens }.to raise_error(ActiveRecord::RecordNotFound)
      end

      it '未認証の場合、削除できないこと' do
        delete "/api/v1/sections/#{section.id}"

        expect(response).to have_http_status(401)
      end
    end
  end
end
