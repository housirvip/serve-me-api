module.exports = {
  apps : [{
    name: 'strapi',
    script: 'npm',
    args: 'start',
    instances: 1,
    version: '0.1.5',
    error_file: 'err.log',
    out_file: 'out.log',
    log_file: 'combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
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
  }]
};
