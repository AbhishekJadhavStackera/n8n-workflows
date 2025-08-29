import { Router } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sign } from "../lib/jwt";

const prisma = new PrismaClient();
const router = Router();

/**
 * POST /auth/signup
 * body: { email, password, name?, tenantName? }
 */
router.post("/signup", async (req, res) => {
  const { email, password, name, tenantName } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email+password required" });
  const hashed = await bcrypt.hash(password, 10);
  const tenant = await prisma.tenant.create({ data: { name: tenantName || email } });
  const user = await prisma.user.create({
    data: { email, password: hashed, name, tenantId: tenant.id },
  });
  const token = sign({ userId: user.id, tenantId: tenant.id });
  res.json({ token, tenantId: tenant.id });
});

/**
 * POST /auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email+password required" });
  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) return res.status(401).json({ error: "invalid credentials" });
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });
  const token = sign({ userId: u.id, tenantId: u.tenantId });
  res.json({ token, tenantId: u.tenantId });
});

export default router;
