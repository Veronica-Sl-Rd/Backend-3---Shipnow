import { Router } from "express";
import userController from "../controllers/users.controller.js";

const router = Router();

router.get("/", userController.getAll);
router.get("/:uid", userController.getById);
router.post("/", userController.create);
router.delete("/:uid", userController.delete);

export default router;