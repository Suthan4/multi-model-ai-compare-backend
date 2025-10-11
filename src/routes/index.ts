import { Router } from "express";
import { API_VERSION, NODE_ENV } from "../constants/env";
import comparisionRoutes from "./comparision.route";
import { comparisonController } from "../controllers/comparision.controller";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: API_VERSION,
  });
});

router.use(`/api/comparisons`, comparisionRoutes);
router.get(`/api/models`,
comparisonController.getAvailableModels.bind(comparisonController)
);
router.get(`/api/stats`,
  comparisonController.getStats.bind(comparisonController)
);

export default router;
