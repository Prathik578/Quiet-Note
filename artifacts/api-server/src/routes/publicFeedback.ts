import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  CreatePublicFeedbackBody,
  CreatePublicFeedbackParams,
  CreatePublicFeedbackResponse,
  GetPublicFeedbackTargetParams,
  GetPublicFeedbackTargetResponse,
} from "@workspace/api-zod";
import { db, feedbackTable, usersTable } from "@workspace/db";

const router: IRouter = Router();

router.get(
  "/public/feedback/:publicToken",
  async (req, res): Promise<void> => {
    const params = GetPublicFeedbackTargetParams.safeParse(req.params);
    if (!params.success) {
      res.status(404).json({ error: "Feedback link not found" });
      return;
    }
    const [owner] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.publicToken, params.data.publicToken))
      .limit(1);
    if (!owner) {
      res.status(404).json({ error: "Feedback link not found" });
      return;
    }
    res.json(GetPublicFeedbackTargetResponse.parse({ valid: true }));
  },
);

router.post(
  "/public/feedback/:publicToken",
  async (req, res): Promise<void> => {
    const params = CreatePublicFeedbackParams.safeParse(req.params);
    const bodyValue = {
      message:
        typeof req.body?.message === "string"
          ? req.body.message.trim()
          : req.body?.message,
    };
    const body = CreatePublicFeedbackBody.safeParse(bodyValue);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Enter a message up to 2,000 characters." });
      return;
    }
    const [owner] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.publicToken, params.data.publicToken))
      .limit(1);
    if (!owner) {
      res.status(404).json({ error: "Feedback link not found" });
      return;
    }
    await db.insert(feedbackTable).values({
      id: randomUUID(),
      ownerId: owner.id,
      message: body.data.message,
    });
    res
      .status(201)
      .json(CreatePublicFeedbackResponse.parse({ accepted: true }));
  },
);

export default router;