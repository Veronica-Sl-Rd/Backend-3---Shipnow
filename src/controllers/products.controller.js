import productService from "../services/products.service.js";

class ProductController {
    async getAll(req, res) {
        try {
            const products = await productService.getAll();
            res.json(products);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async getById(req, res) {
        try {
            const product = await productService.getById(req.params.pid);
            res.json(product);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async create(req, res) {
        try {
            const newProduct = await productService.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async update(req, res) {
        try {
            const product = await productService.update(req.params.pid, req.body);
            res.json(product);
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }

    async delete(req, res) {
        try {
            await productService.delete(req.params.pid);
            res.json({ message: "Producto eliminado" });
        } catch (error) {
            if (error.status) {return res.status(error.status).json({
                    error: error.message,});}
            res.status(500).send("Error del servidor");}
    }
}

export default new ProductController();