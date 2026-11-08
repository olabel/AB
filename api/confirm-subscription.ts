// Vercel Serverless Function for /api/confirm-subscription
// Uses the unified, secure shared handler to prevent logic drift.
import { handleConfirmSubscription } from "../src/server/apiHandlers.ts";

export default handleConfirmSubscription;
