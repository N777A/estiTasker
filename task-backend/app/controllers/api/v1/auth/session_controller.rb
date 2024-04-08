class Api::V1::Auth::SessionController < ApplicationController
  def index
    if current_api_v1_user
      render json: {is_login: true, data: current_api_v1_user}
    else
      render json: {is_login: false, message: 'ユーザーが存在しません'}
    end
  end

  def guest_sign_in
    @resource = User.guest
    @token = @resource.create_token
    @resource.save!
    render json: {
      status: 'success',
      message: 'ゲストユーザーとしてサインインしました。',
      data: {
        user: {
          id: @resource.id,
          name: @resource.name,
          email: @resource.email
        },
        token: {
          access_token: @token.token,
          token_type: 'Bearer',
          client: @token.client,
          expiry: @token.expiry,
          uid: @resource.uid
        }
      }
    }, status: :ok
  end
end
