# frozen_string_literal: true

DeviseTokenAuth.setup do |config|
  config.change_headers_on_each_request = false
  config.token_lifespan = 6.weeks
  config.token_cost = Rails.env.test? ? 4 : 10
  # Makes it possible to change the headers names
  config.headers_names = {
    :'authorization' => 'Authorization',
    :'access-token' => 'access-token',
    :'client' => 'client',
    :'expiry' => 'expiry',
    :'uid' => 'uid',
    :'token-type' => 'token-type'
  }
end
