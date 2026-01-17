/**
 * =============================================================================
 * SERVER.TS - THE ENTRY POINT OF YOUR APPLICATION
 * =============================================================================
 *
 * Think of this file as the "ignition key" of your car.
 * When you run "npm run dev", Node.js starts HERE.
 *
 * This file does 3 things:
 * 1. Starts the HTTP server (so people can make requests)
 * 2. Logs helpful startup messages
 * 3. Handles graceful shutdown (cleanup when stopping)
 *
 * FLOW: npm run dev → server.ts → app.ts → routes → controllers → services
 */
/**
 * START THE SERVER
 *
 * app.listen() tells Express to start accepting HTTP requests
 * on the specified port. Think of it like opening a store:
 * "We're now open for business on Port 3000!"
 */
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export default server;
//# sourceMappingURL=server.d.ts.map