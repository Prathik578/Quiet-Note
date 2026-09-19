import { Router, type IRouter } from "express";
import { GetCurrentUserResponse } from "@workspace/api-zod";
import { getAuthenticatedUserId, requireAuth } from "../middlewares/auth";
import { ensureOwner, getPublicUrl } from "../lib/owners";

const router: IRouter = Router();

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const owner = await ensureOwner(req, userId);
  res.json(
    GetCurrentUserResponse.parse({
      id: owner.id,
      email: owner.email,
      publicToken: owner.publicToken,
      publicUrl: getPublicUrl(req, owner.publicToken),
      createdAt: owner.createdAt,
    }),
  );
});

export default router;