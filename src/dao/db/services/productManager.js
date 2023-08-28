import Product from "../models/product.js";
import fs from "fs";
import { dirname } from "../../../path.js";

class ProductManager {
    static endpoint = "http://localhost:8080/products";

    async isSameCode(code) {
        let isSameCode = false;
        const product = await Product.findOne({ code });
        if (product) {
            isSameCode = true;
        }
        return isSameCode;
    }

    async addProduct(product) {
        try {
            await Product.create(product);
            return product;
        } catch (err) {
            throw new Error("Error al insertar el producto");
        }
    }

    async getProducts(limit, page, sort, query) {
        let products;

        if (query) {
            if (sort) {
                products = await Product.paginate(
                    { category: query, status: true },
                    { limit, page, sort: { price: sort }, lean: true }
                );
            } else {
                products = await Product.paginate(
                    { category: query, status: true },
                    { limit, page, lean: true }
                );
            }
        } else {
            products = await Product.paginate(
                { status: true },
                { limit, page, lean: true }
            );
        }

        products.payload = products.docs;
        delete products.docs;

        products.status = "success";
        products.prevLink = products.hasPrevPage
            ? `${ProductManager.endpoint}?page=${products.prevPage}`
            : null;
        products.nextLink = products.hasNextPage
            ? `${ProductManager.endpoint}?page=${products.nextPage}`
            : null;

        return products;
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            if (!product || !product.status) {
                throw new Error(`No existe un producto con el id ${id}`);
            }

            return product;
        } catch (err) {
            throw new Error(`Error al buscar el producto`);
        }
    }

    async updateProduct(id, newProduct) {
        try {
            const product = await Product.findOne({ _id: id, status: true });
            if (!product || !product.status) {
                throw new Error(`No existe un producto con el id ${id}`);
            }

            await Product.updateOne(product, newProduct);
            return id;
        } catch (err) {
            throw new Error(`Error al actualizar el producto`);
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findById(id);
            if (!product || !product.status) {
                throw new Error(`No existe un producto con el id ${id}`);
            }

            if (product.thumbnails.length > 0) {
                product.thumbnails.forEach((filename) => {
                    fs.unlinkSync(`${dirname}/uploads/${filename}`);
                });
            }

            await Product.updateOne(product, { status: false, thumbnails: [] });
            return id;
        } catch (err) {
            throw new Error(`Error al borrar el producto`);
        }
    }

    async uploadImg(files, id, allowExtentions = ["jpg", "jpeg", "png"]) {
        const product = await Product.findById(id);
        if (!product || !product.status) {
            files.forEach(({ filename }) => {
                fs.unlinkSync(`${dirname}/uploads/${filename}`);
            });
            throw new Error(`No existe un producto con el id ${id}`);
        }

        let hasUpload = true;

        files.forEach(({ filename }) => {
            let extention = filename.split(".").at(-1);

            if (!allowExtentions.includes(extention)) {
                hasUpload = false;
                fs.unlinkSync(`${dirname}/uploads/${filename}`);
            } else {
                product.thumbnails.push(filename);
            }
        });

        await product.save();

        if (!hasUpload) {
            throw new Error(
                "Las extensiones permitidas son solo jpg, jpeg, png"
            );
        }
    }

    async showImg(id) {
        const product = await Product.findById(id);
        if (!product || !product.status) {
            throw new Error(`No existe un producto con el id ${id}`);
        }

        if (product.thumbnails.length === 0) {
            throw new Error("El producto no tiene imagenes");
        }

        const filename = product.thumbnails[0];
        const pathImg = `${dirname}/uploads/${filename}`;
        if (!fs.existsSync(pathImg)) {
            product.thumbnails = product.thumbnails.filter(
                (t) => t !== filename
            );
            await product.save();
            throw new Error("La imagen no existe");
        }

        return pathImg;
    }
}

export default ProductManager;
