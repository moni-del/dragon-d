/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {api} from "./api";

// Limit concurrent instances for cost control.
setGlobalOptions({maxInstances: 10});

// Re‑export the Express app as an HTTPS function named "api".
export {api};
