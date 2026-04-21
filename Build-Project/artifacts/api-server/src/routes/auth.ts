import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "Email already registered." });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      name, email, passwordHash, provider: "email", role: "user",
    }).returning();
    req.session!.userId = user.id;
    req.session!.userRole = user.role;
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Registration failed." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    if (!user.passwordHash) {
      res.status(401).json({ error: "This account uses social login. Please use the appropriate provider." });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }
    req.session!.userId = user.id;
    req.session!.userRole = user.role;
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Login failed." });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session?.destroy(() => {});
  res.json({ success: true });
});

// Get current user
router.get("/me", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not logged in." });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  if (!user) {
    res.status(401).json({ error: "User not found." });
    return;
  }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar });
});

// OAuth placeholder routes (require credentials to be configured)
router.get("/google", (req, res) => {
  res.redirect(`/api/auth/google/start`);
});

router.get("/github", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.redirect(`${process.env.FRONTEND_URL || ""}/login?error=GitHub+OAuth+not+configured`);
    return;
  }
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email`;
  res.redirect(url);
});

router.get("/github/callback", async (req, res) => {
  const { code } = req.query as { code: string };
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret || !code) {
    res.redirect("/login?error=OAuth+failed");
    return;
  }
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData: any = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    });
    const ghUser: any = await userRes.json();
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails: any[] = await emailRes.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email || ghUser.email || `${ghUser.login}@github.com`;
    let [user] = await db.select().from(usersTable).where(eq(usersTable.email, primaryEmail));
    if (!user) {
      const [created] = await db.insert(usersTable).values({
        name: ghUser.name || ghUser.login,
        email: primaryEmail,
        provider: "github",
        providerId: String(ghUser.id),
        avatar: ghUser.avatar_url,
        role: "user",
      }).returning();
      user = created;
    }
    req.session!.userId = user.id;
    req.session!.userRole = user.role;
    res.redirect("/");
  } catch {
    res.redirect("/login?error=OAuth+failed");
  }
});

export default router;
