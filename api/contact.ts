// Vercel Serverless Function for /api/contact & newsletter submissions
// Uses the unified, secure shared handler to prevent logic drift.
import { handleContactSubmission } from "../src/server/apiHandlers.ts";

export default handleContactSubmission;
