import { and, desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  DeleteFeedbackParams,
  GetInboxResponse,
} from "@workspace/api-zod";
import { db, feedbackTable } from "@workspace/db";
import { getAuthenticatedUserId, requireAuth } from "../middlewares/auth";
import { ensureOwner, getPublicUrl } from "../lib/owners";

const router: IRouter = Router();

router.get("/inbox", requireAuth, async (req, res): Promise<void> => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const owner = await ensureOwner(req, userId);
  const messages = await db
    .select({
      id: feedbackTable.id,
      message: feedbackTable.message,
      createdAt: feedbackTable.createdAt,
    })
    .from(feedbackTable)
    .where(eq(feedbackTable.ownerId, owner.id))
    .orderBy(desc(feedbackTable.createdAt));

  res.json(
    GetInboxResponse.parse({
      total: messages.length,
      publicToken: owner.publicToken,
      publicUrl: getPublicUrl(req, owner.publicToken),
      feedback: messages,
    }),
  );
});

router.delete(
  "/inbox/messages/:feedbackId",
  requireAuth,
  async (req, res): Promise<void> => {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const params = DeleteFeedbackParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const deleted = await db
      .delete(feedbackTable)
      .where(
        and(
          eq(feedbackTable.id, params.data.feedbackId),
          eq(feedbackTable.ownerId, userId),
        ),
      )
      .returning({ id: feedbackTable.id });
    if (!deleted[0]) {
      res.status(404).json({ error: "Feedback not found" });
      return;
    }
    res.sendStatus(204);
  },
);

export default router;