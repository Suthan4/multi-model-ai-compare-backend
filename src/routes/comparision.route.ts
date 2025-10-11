import { Router } from "express";
import { comparisonController } from "../controllers/comparision.controller";

const comparisionRoutes = Router();

comparisionRoutes.post(
  "/",
  comparisonController.createComparison.bind(comparisonController)
);
comparisionRoutes.get(
  "/:id",
  comparisonController.getComparison.bind(comparisonController)
);
comparisionRoutes.get(
  "/",
  comparisonController.getAllComparision.bind(comparisonController)
);
comparisionRoutes.post(
  "/:id/share",
  comparisonController.shareComparison.bind(comparisonController)
);
comparisionRoutes.get(
  "/share/:shareId",
  comparisonController.getComparisonByShareId.bind(comparisonController)
);
comparisionRoutes.delete(
  "/:id",
  comparisonController.deleteComparison.bind(comparisonController)
);

export default comparisionRoutes;
