module.exports = {
  apps : [{
    name: 'strapi',
    script: 'npm',
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'start',
    instances: 1,
    error_file: 'err.log',
    out_file: 'out.log',
    log_file: 'combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      GOOGLE_APPLICATION_CREDENTIALS: '/Users/housirvip/Documents/serve-me-ionic-firebase-adminsdk-44oms-33c98c32b3.json',
      DB_NAME: 'serve-me-dev',
      DB_URL: 'localhost',
      DB_USER: 'root',
      DB_PASSWORD: 'housirvip'
    },
    env_production: {
      NODE_ENV: 'production',
      GOOGLE_APPLICATION_CREDENTIALS: '/home/housirvip/serve-me-api/serve-me-ionic-firebase-adminsdk-44oms-33c98c32b3.json',
      DB_NAME: 'serve-me',
      DB_URL: 'localhost',
      DB_USER: 'root',
      DB_PASSWORD: 'housirvip'
    }
  }],
  deploy : {
    production : {
      user : 'user',
      host : 'host',
      ref  : 'origin/master',
      repo : 'git@github.com:housirvip/serve-me-api.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
