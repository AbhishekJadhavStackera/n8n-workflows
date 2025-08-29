import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth";
import wfRoutes from "./routes/workflows";
import webhookRoutes from "./routes/webhook";
import importerRoutes from "./routes/importer";

export const app = express();
app.use(bodyParser.json({ limit: "1mb" }));

app.use("/auth", authRoutes);
app.use("/workflows", wfRoutes);
app.use("/webhook", webhookRoutes);
app.use("/integrations", importerRoutes);

app.get("/", (_, res) => res.json({ ok: true }));
