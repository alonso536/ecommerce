import fs from "fs";
import Product from "../models/product.js";

import { dirname } from "../../../path.js";

class ProductManager {
    constructor() {
        this.products = [];
        this.path = `${dirname}/dao/fileSystem/products.json`;

        if(fs.existsSync(this.path)) {
            let info = fs.readFileSync(this.path, { encoding: 'utf-8' });
            if(info) {
                this.products = JSON.parse(info);
                Product.increments = this.products.at(-1).id;
            }
        }
    }

    async isSameCode(code) {
        let isSameCode = false;
        this.products.forEach(p => {
            if(p.code.toLowerCase() === code.toLowerCase()) {
                isSameCode = true;
            }
        });

        return isSameCode;
    }

    async addProduct({ title, description, code, price, stock, category }) {
        const product = new Product(title, description, code, price, stock, category);
        this.products.push(product);
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));
    }

    async getProducts(limit = 8) {
        return this.products.slice(0, limit).filter(p => p.status);
    }

    async getProductById(id) {
        let product = this.products.find(p => p.id == id);
        if(!product || !product.status) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
        return product;
    }

    getProductByIdSync(id) {
        let product = this.products.find(p => p.id == id);
        if(!product || !product.status) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
        return product;
    }

    async updateProduct(id, { title, description, code, price, stock, category }) {
        let index = this.products.findIndex(p => p.id == id);
        if(index == -1 || !this.products[index].status) {
            throw new Error(`No existe un producto con el id ${id}`);
        }

        if(code && this.isSameCode(code)) {
            throw new Error(`Ya existe un producto con el código ${code}`);
        }

        const data = { title, description, code, price, stock, category };
        const values = Object.values(data);

        Object.keys(data).forEach((key, i) => {
            if(values[i]) {
                this.products[index][key] = values[i];
            }
        });
        
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));

        return id;
    }

    async deleteProduct(id) {
        let productIndex = this.products.findIndex(p => p.id == id);
        if(productIndex == -1 || !this.products[productIndex].status) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
        
        this.products[productIndex].status = false;
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));

        return id;
    }

    async uploadImg(files, id, allowExtentions = ["jpg", "jpeg", "png"]) {
        let productIndex = this.products.findIndex(p => p.id == id);
        if(productIndex == -1) {
            files.forEach(({ filename }) => {
                fs.unlinkSync(`${dirname}/uploads/${filename}`);
            });
            throw new Error(`No existe un producto con el id ${id}`);
        }

        let hasUpload = true;

        files.forEach(({ filename }) => {
            let extention = filename.split(".").at(-1);
        
            if(!allowExtentions.includes(extention)) {
                hasUpload = false;
                fs.unlinkSync(`${dirname}/uploads/${filename}`);
            } else {
                this.products[productIndex].thumbnails.push(filename);
                fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));
            }
        });

        if(!hasUpload) {
            throw new Error("Las extensiones permitidas son solo jpg, jpeg, png");
        };
    }

    async showImg(id) {
        let productIndex = this.products.findIndex(p => p.id == id);
        if(productIndex == -1) {
            throw new Error(`No existe un producto con el id ${id}`);
        }

        let thumbnails = this.products[productIndex].thumbnails;
        if(thumbnails.length === 0) {
            throw new Error("El producto no tiene imagenes");
        }

        const pathImg = `${dirname}/uploads/${thumbnails[0]}`;
        if(!fs.existsSync(pathImg)) {
            this.products[productIndex].thumbnails = this.products[productIndex].thumbnails.filter(t => t !== thumbnails[0]);
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2, "\t"));
            throw new Error("La imagen no existe");
        }

        return pathImg;
    }
}

export default ProductManager;