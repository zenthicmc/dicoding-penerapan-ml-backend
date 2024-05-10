import { Router } from "express";
import multer from "multer";

import * as PredictController from "../Controllers/PredictController";

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), PredictController.predict);
router.get("/histories", PredictController.history);

export default router;