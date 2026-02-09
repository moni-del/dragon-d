import * as functions from "firebase-functions";
import express, {Request, Response} from "express";
import session from "express-session";
import cors from "cors";
import {Client, GatewayIntentBits} from "discord.js";

// TypeScript adaptation of server/index.js to run as a single HTTPS function.

const app = express();

// In production, set CLIENT_URL to your Firebase Hosting URL
// e.g. https://your-project-id.web.app
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_me_session_secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.json());

// Discord bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once("ready", () => {
  // eslint-disable-next-line no-console
  console.log(`Discord bot logged in as ${client.user?.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN as string).catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to login Discord bot:", err);
});

// Helper: exchange code for token (using global fetch)
async function exchangeCodeForToken(code: string): Promise<any> {
  const params = new URLSearchParams();
  params.append("client_id", process.env.DISCORD_CLIENT_ID || "");
  params.append("client_secret", process.env.DISCORD_CLIENT_SECRET || "");
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI || "");

  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: params as any,
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Helper: fetch current user
async function fetchCurrentUser(accessToken: string): Promise<any> {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch user failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// OAuth2 callback
app.get("/auth/discord/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  if (!code) {
    return res.status(400).send("Missing code");
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const user = await fetchCurrentUser(tokenData.access_token);

    (req.session as any).userId = user.id;

    return res.redirect(`${CLIENT_URL}/?loggedIn=true`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("OAuth callback error:", err);
    return res.status(500).send("OAuth failed");
  }
});

// Status endpoint: check if user is logged in and in guild
app.get("/api/status", async (req: Request, res: Response) => {
  const userId = (req.session as any).userId as string | undefined;
  if (!userId) {
    return res.json({loggedIn: false, inServer: false});
  }

  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) {
    return res.status(500).json({error: "DISCORD_GUILD_ID not configured"});
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(userId).catch(() => null);

    const inServer = !!member;

    return res.json({loggedIn: true, inServer});
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Status check error:", err);
    return res.status(500).json({error: "Failed to check membership"});
  }
});

export const api = functions.https.onRequest(app);
