module.exports = {
  apps: [{
    name: 'xcrab',
    script: 'index.js',
    cwd: '/root/skillgate-agent/xCrab',
    env: {
      NODE_ENV: 'production',
      MINIMAX_API_KEY: 'sk-cp-w_-_nNk1OzVjSev4wMCrFAvaQdw_CSDiyBX7BqQuLyFaS71CfDHMz3C7mg-nnUvtP9HFvTdoWUgv8cMVSsyAbR3BFslWYmO0DOgN_me2QWMCryvdwwfNUWA',
      MINIMAX_BASE_URL: 'https://api.minimaxi.com/v1',
      SERVER_PORT: '60016',
      SERVER_PASSWORD: '100911yzpYZP',
      MODEL: 'MiniMax-M2.7',
      ENABLE_MEMORY: 'false',
      HEADLESS: 'true',
      GATEWAY_ENABLED: 'true',
      GATEWAY_PORT: '60016',
      GATEWAY_TOKEN: '100911yzpYZP'
    }
  }]
};