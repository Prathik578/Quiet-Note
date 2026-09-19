import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import inboxRouter from "./inbox";
import publicFeedbackRouter from "./publicFeedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(inboxRouter);
router.use(publicFeedbackRouter);

export default router;
