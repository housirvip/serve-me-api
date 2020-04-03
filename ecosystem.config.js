module.exports = {
  apps : [{
    name: 'strapi',
    script: 'npm',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      GOOGLE_APPLICATION_CREDENTIALS: '/Users/housirvip/WebstormProjects/serve-me-api/config/environments/serve-me-ionic-firebase-adminsdk-44oms-33c98c32b3.json',
      DB_URL: 'gce.housir.vip'
    },
    env_production: {
      NODE_ENV: 'production',
      GOOGLE_APPLICATION_CREDENTIALS: '/home/housirvip/serve-me-api/config/environments/serve-me-ionic-firebase-adminsdk-44oms-33c98c32b3.json',
      DB_URL: 'localhost'
    }
  }],

  deploy : {
    production : {
      user : 'housirvip',
      host : 'gce.housir.vip',
      ref  : 'origin/master',
      repo : 'git@github.com:housirvip/serve-me-api.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
