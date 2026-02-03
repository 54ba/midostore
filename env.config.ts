// env.config.ts
// This file is dynamically generated or expected to exist for environment configuration.
// It exposes environment variables used throughout the application.

const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXT_PORT: process.env.NEXT_PORT || '3000',
  NEXT_HOST: process.env.NEXT_HOST || 'localhost',
  API_PORT: process.env.API_PORT || '8000',
  API_HOST: process.env.API_HOST || '0.0.0.0',
  PYTHON_PATH: process.env.PYTHON_PATH || 'python3',
  VENV_PATH: process.env.VENV_PATH || './ai/venv',
  DATABASE_URL: process.env.DATABASE_URL || 'your_database_url_here',
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgresql',
  LOG_LEVEL: process.env.LOG_LEVEL || 'INFO',
  ENABLE_AI_TRAINING: process.env.ENABLE_AI_TRAINING === 'true',
  // Add other environment variables as needed by your application
};

export const config = envConfig;
export default envConfig;
