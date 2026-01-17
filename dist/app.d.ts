/**
 * =============================================================================
 * APP.TS - THE EXPRESS APPLICATION CONFIGURATION
 * =============================================================================
 *
 * This file is like the "blueprint" of your restaurant:
 * - What security measures to use (helmet, cors)
 * - How to handle incoming orders (body parsing)
 * - What menu items are available (routes)
 * - What to do when something goes wrong (error handling)
 *
 * MIDDLEWARE EXPLANATION:
 * Middleware are functions that run BEFORE your route handlers.
 * Think of them as a "pipeline" - each request goes through them:
 *
 * Request → [Helmet] → [CORS] → [Body Parser] → [Logger] → [Your Route] → Response
 */
import { Application } from 'express';
declare const app: Application;
export default app;
//# sourceMappingURL=app.d.ts.map