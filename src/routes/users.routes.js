import { Router } from "express";
import userController from "../controllers/users.controller.js";

const router = Router();

router.get("/", userController.findAll);
router.get("/:uid", userController.findById);
router.post("/", userController.create);
router.delete("/:uid", userController.delete);

export default router;