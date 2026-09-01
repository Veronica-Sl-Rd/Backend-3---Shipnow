import { Router } from 'express';
import deliveriesController from '../controllers/deliveries.controller.js';
import { uploadDeliveryProof } from "../config/multer.config.js";

const router = Router();

router.get('/', deliveriesController.findAll);
router.get('/:id', deliveriesController.findById);
router.post('/', deliveriesController.create);
router.post("/:id/proof", uploadDeliveryProof.single("file"),deliveriesController.addProof);
router.get('/check/:city', deliveriesController.checkDelivery);
router.put('/:id', deliveriesController.update);
router.delete('/:id', deliveriesController.delete);


export default router;
