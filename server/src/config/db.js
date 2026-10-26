import mongoose from 'mongoose';
import { env } from './env.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/inkfluence';
const CONNECT_TIMEOUT_MS = 8000;

// Serverless platforms (Vercel, Lambda, etc.) reuse a function instance between
// requests. Keeping the connection on the global object means a warm instance
// reuses its pool instead of opening a new one on every invocation.
const globalCache = globalThis;
if (!globalCache.__inkfluenceMongo) {
  globalCache.__inkfluenceMongo = { connection: null, promise: null, memoryServer: null };
}
const cache = globalCache.__inkfluenceMongo;

async function establishConnection() {
  mongoose.set('strictQuery', true);

  if (env.mongoUri) {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: CONNECT_TIMEOUT_MS,
      maxPoolSize: 10,
    });
    console.log(`MongoDB connected → ${mongoose.connection.host}`);
    return { inMemory: false, cached: false };
  }

  if (env.isProduction) {
    throw new Error('MONGODB_URI is required in production.');
  }

  try {
    await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 2500 });
    console.log('MongoDB connected → localhost');
    return { inMemory: false, cached: false };
  } catch {
    // Imported lazily so production bundles never need the dev-only package.
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    console.log('No local MongoDB found — spinning up in-memory MongoDB...');
    cache.memoryServer = await MongoMemoryServer.create({ instance: { dbName: 'inkfluence' } });
    await mongoose.connect(cache.memoryServer.getUri(), { dbName: 'inkfluence' });
    console.log('In-memory MongoDB ready (data resets when the server stops)');
    return { inMemory: true, cached: false };
  }
}

/**
 * Connects to MongoDB and reuses the connection for the life of the process.
 *
 * In development, if no MONGODB_URI is provided (or the local server is
 * unreachable), a zero-config in-memory MongoDB is started so the project can
 * be explored instantly. Data in that mode resets on restart.
 */
export async function connectDB() {
  if (cache.connection && mongoose.connection.readyState === 1) {
    return { inMemory: Boolean(cache.memoryServer), cached: true };
  }

  if (cache.promise) {
    // Another request on this instance is already connecting; wait for it.
    await cache.promise;
    if (cache.connection && mongoose.connection.readyState === 1) {
      return { inMemory: Boolean(cache.memoryServer), cached: true };
    }
  }

  cache.connection = null;
  cache.promise = establishConnection();

  try {
    const result = await cache.promise;
    cache.connection = mongoose.connection;
    return result;
  } catch (error) {
    cache.connection = null;
    throw error;
  } finally {
    cache.promise = null;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  cache.connection = null;
  cache.promise = null;
  if (cache.memoryServer) {
    await cache.memoryServer.stop();
    cache.memoryServer = null;
  }
}
