import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production.');
}

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Vercel exposes the deployment hostname. Accepting it as an origin means the
// API also works when it is called directly on its own *.vercel.app domain.
const platformOrigins = [process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]
  .filter(Boolean)
  .map((host) => `https://${host}`);

const allowedOrigins = [...new Set([...configuredOrigins, ...platformOrigins])];

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  isVercel,
  port: Number(process.env.PORT) || 5000,
  clientUrl: allowedOrigins.join(',') || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'inkfluence-local-dev-secret-please-change',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
  pollinationsEnabled: process.env.POLLINATIONS_ENABLED !== 'false',
  pollinationsModel: process.env.POLLINATIONS_MODEL || 'openai',
  // Seeding resets demo data, so never do it implicitly on a serverless deploy.
  autoSeed: process.env.AUTO_SEED ? process.env.AUTO_SEED !== 'false' : !isVercel,
};
