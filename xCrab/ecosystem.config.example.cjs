module.exports = {
  apps: [{
    name: 'xcrab',
    script: 'index.js',
    cwd: './xCrab',
    env: {
      NODE_ENV: 'production',
      // ⚠️ 请在 .env 文件中配置以下环境变量，或直接在此处填写
      MINIMAX_API_KEY: 'your_api_key_here',
      MINIMAX_BASE_URL: 'https://api.minimaxi.com/v1',
      SERVER_PORT: '60016',
      SERVER_PASSWORD: 'your_password_here',
      MODEL: 'MiniMax-M2.7',
      ENABLE_MEMORY: 'false',
      HEADLESS: 'true'
    }
  }]
};
