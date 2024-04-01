Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3001', 'https://esti-tasker.vercel.app/'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['access-token', 'expiry', 'token-type', 'uid', 'client'],
      credentials: true
  end
end
