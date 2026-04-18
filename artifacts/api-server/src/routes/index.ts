import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import applicationsRouter from "./applications";
import examsRouter from "./exams";
import authRouter from "./auth";
import adminRouter from "./admin";
import collegesRouter from "./colleges";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use(jobsRouter);
router.use(applicationsRouter);
router.use(examsRouter);
router.use("/colleges", collegesRouter);

export default router;
