import { Router } from "express";
import userController from "../controllers/users.controller.js";
import { uploadUserDocument } from "../config/multer.config.js";

const router = Router();

router.get("/", userController.findAll);
router.get("/:uid", userController.findById);
router.post("/", userController.create);
router.post("/:uid/documents",uploadUserDocument.single("file"),userController.addDocument);
router.delete("/:uid", userController.delete);

export default router;