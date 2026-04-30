// This file acts as a bridge between IISNode and the optimized Next.js standalone server
// We use the standalone server because it is heavily optimized for Azure and contains all dependencies.

// Ensure we are running in production mode
process.env.NODE_ENV = 'production';

// The Next.js standalone server natively supports Azure Named Pipes via process.env.PORT!
require('./.next/standalone/server.js');
