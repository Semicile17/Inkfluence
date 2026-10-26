import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { seedDatabase } from './seed/seed.js';
import Blog from './models/Blog.js';
import User from './models/User.js';

async function start() {
  await connectDB();

  if (env.autoSeed) {
    const [blogCount, userCount] = await Promise.all([
      Blog.estimatedDocumentCount(),
      User.estimatedDocumentCount(),
    ]);

    // Seeding resets demo content, so only do it on a completely empty
    // database. Never wipe real accounts just because the library is empty.
    if (blogCount === 0 && userCount === 0) {
      console.log('Empty library detected — seeding a little inspiration...');
      await seedDatabase({ silent: true });
      console.log('Demo content ready. Sign in with demo@inkfluence.app / demo1234');
    } else if (blogCount === 0) {
      console.log('Library is empty but accounts exist — skipping auto-seed.');
    }
  }

  const server = app.listen(env.port, () => {
    console.log(`\n  ✦ Inkfluence API running at http://localhost:${env.port}`);
    console.log(`  ✦ Client origin: ${env.clientUrl}`);
    console.log(`  ✦ Muse provider: ${env.geminiApiKey ? 'Gemini (free)' : env.groqApiKey ? 'Groq (free)' : env.pollinationsEnabled ? 'Pollinations (free, keyless)' : 'local fallback'}\n`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received — closing down gracefully...`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
  });
}

start().catch((error) => {
  console.error('Failed to start Inkfluence:', error);
  process.exit(1);
});
