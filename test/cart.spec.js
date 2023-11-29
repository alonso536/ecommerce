import chai from "chai";
import supertest from "supertest";
import "dotenv/config";

const expect = chai.expect;
const requester = supertest(process.env.ENDPOINT);

describe("Test de carts", function() {
    before(function() {
        this.idCart = process.env.CART_ID_TEST;
        this.idProduct = process.env.PRODUCT_ID_TEST;
        this.idProductBad = process.env.PRODUCT_ID_BAD_TEST;

        console.log({ idCart: this.idCart, idProduct: this.idProduct, idProductBad: this.idProductBad });

        this.credentials = {
            email: "john.doe@mail.com",
            password: "1234"
        };

        this.invalidCredentials = {
            email: "hola@mail.com",
            password: "asdf"
        };
    });

    it("El enpoint POST /api/carts/:cid/product/:pid debe devolver un error 401 en caso de que se ingresen credenciales inválidas", async function() {
        const { statusCode } = await requester.post(`/api/carts/${this.idCart}/product/${this.idProduct}`);
        expect(statusCode).to.be.equals(401);
    });

    it("EL endpoint POST /api/carts/:cid/product/:pid debe devolver un error 400 si el id de el producto no se encuentra", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.post(`/api/carts/${this.idCart}/product/${this.idProductBad}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(400);
        expect(_body).to.have.property("msg");
    });

    it("El enpoint POST /api/carts/:cid/product/:pid debe agregar el producto al carrito", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.post(`/api/carts/${this.idCart}/product/${this.idProduct}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(200);
        expect(_body).to.have.property("msg");
    });

    it("El enpoint POST /api/carts/:cid/product/:pid debe agregar el producto al carrito", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.post(`/api/carts/${this.idCart}/product/${this.idProduct}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(200);
        expect(_body).to.have.property("msg");
    });

    it("El endpoint GET /api/carts/:cid debe devolver la información del carrito", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.get(`/api/carts/${this.idProduct}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(404);
        expect(_body).to.have.property("msg");
    });

    it("El endpoint GET /api/carts/:cid debe devolver la información del carrito", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.get(`/api/carts/${this.idCart}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(200);
        expect(_body).to.have.property("cart");
    });

    it("El endpoint DELETE /api/carts/:cid/product/:pid debe devolver un error 400 si el carrito o el producto no existe", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.delete(`/api/carts/${this.idCart}/product/${this.idProductBad}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(400);
        expect(_body).to.have.property("msg");
    });

    it("El endpoint DELETE /api/carts/:cid/product/:pid debe remover el producto del carrito", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.delete(`/api/carts/${this.idCart}/product/${this.idProduct}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(200);
        expect(_body).to.have.property("msg");
    });

    it("El endpoint DELETE /api/carts/:cid debe limpiar el carrito", async function() {
        const login = await requester.post("/api/sessions/login").send(this.credentials);

        const { statusCode, _body } = await requester.delete(`/api/carts/${this.idCart}`)
            .set("Cookie", [`token=${login._body.token}`]);

        expect(statusCode).to.be.equals(200);
        expect(_body).to.have.property("msg");
    });
});