// import chai from "chai";
// import supertest from "supertest";
// import "dotenv/config";

// const expect = chai.expect;
// const requester = supertest(process.env.ENDPOINT);

// describe("Test de products", () => {
//     before(function() {
//         this.newProduct = {
//             title: "Producto para testing",
//             description: "Descripcion para el testing",
//             code: "TEC09984",
//             price: 300,
//             stock: 23,
//             category: "Smartphones",
//         };

//         this.updateProduct = {
//             title: "Samsung Galaxy",
//             description: "Samsung Galaxy S23",
//             price: 15000,
//             stock: 30
//         };

//         this.invalidProduct = {
//             title: "Mal titulo",
//             price: "40"
//         }

//         this.invalidUpdateProduct = {
//             title: "",
//             description: ""
//         }

//         this.credentialsAdmin = {
//             email: "admin@admin.com",
//             password: "admin"
//         };

//         this.idProduct = "";
//         this.idProductBad = "654bfd3125df1c78c98821fa"
//     });

//     it("EL endpoint POST /api/products debe enviar un statusCode 401 si no se ha iniciado sesión", async function() {
//         const { statusCode, text } = await requester.post('/api/products').send(this.newProduct);
//         expect(statusCode).to.be.equals(401);
//     });

//     it("EL endpoint POST /api/products debe devolver un error 400 si hay errores en el request body", async function() {
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.post('/api/products')
//             .set("Cookie", [`token=${login._body.token}`])
//             .send(this.invalidProduct);

//         expect(statusCode).to.be.equals(400);
//         expect(_body).to.have.property("errors");
//     });

//     it("EL endpoint POST /api/products debe registrar el producto en la base de datos si no se encuentran errores", async function() {
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.post('/api/products')
//             .set("Cookie", [`token=${login._body.token}`])
//             .send(this.newProduct);

//         this.idProduct = _body.product.uid;
//         expect(statusCode).to.be.equals(201);
//         expect(_body).to.have.property("product");
//     });

//     it("El endpoint GET /api/products debe devolver un error en caso de que no se disponga de una autenticacion", async function() {
//         const { statusCode } = await requester.get('/api/products');
//         expect(statusCode).to.be.equals(401);
//     });

//     it("El endpoint GET /api/products debe devolver un arreglo de productos desde la base de datos", async function() {
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.get('/api/products')
//             .set("Cookie", [`token=${login._body.token}`]);

//         expect(statusCode).to.be.equals(200);
//         expect(_body).to.have.property("products");
//     });

//     it("El endpoint GET /api/products/:pid debe devolver un error 401 en caso de que no se disponga de una autenticacion", async function() {
//         const { statusCode } = await requester.get('/api/products/' + this.idProduct);
//         expect(statusCode).to.be.equals(401);
//     });

//     it("El endpoint GET /api/products/:pid debe devolver un error 400 en caso de que no se el pid no sea un id de mongo", async function() {
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.get('/api/products/' + 'holamundo')
//             .set("Cookie", [`token=${login._body.token}`]);

//         expect(statusCode).to.be.equals(400);
//         expect(_body).to.have.property("errors");
//     });

//     it("El endpoint GET /api/products/:pid debe devolver un error 404 en caso de que el no exista un producto con el id ingresado", async function(){
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.get('/api/products/' + this.idProductBad)
//             .set("Cookie", [`token=${login._body.token}`]);

//         expect(statusCode).to.be.equals(404);
//         expect(_body).to.have.property("msg");
//     });

//     it("El endpoint GET /api/products/:pid debe devolver el producto con el id especificado en formato json", async function() {
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);
//         console.log(this.idProduct);
//         const { statusCode, _body } = await requester.get('/api/products/' + this.idProduct)
//             .set("Cookie", [`token=${login._body.token}`]);

//         expect(statusCode, _body).to.be.equals(200);
//         expect(_body).to.have.property("product");
//     });

//     it("El endpoint PUT /api/products/:pid debe devolver un error 400 en caso de que hayan errores en el request body", async function(){
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.put('/api/products/' + process.env.PRODUCT_ID_TEST)
//             .set("Cookie", [`token=${login._body.token}`])
//             .send(this.invalidUpdateProduct);

//         expect(statusCode).to.be.equals(400);
//         expect(_body).to.have.property("errors");
//     });

//     it("El endpoint PUT /api/products/:pid debe actualizar el producto en la base de datos", async function(){
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.put('/api/products/' + process.env.PRODUCT_ID_TEST)
//             .set("Cookie", [`token=${login._body.token}`])
//             .send(this.updateProduct);

//         expect(statusCode).to.be.equals(200);
//         expect(_body).to.have.property("msg");
//     });

//     it("El endpoint DELETE /api/products/:pid debe devolver un error 404 en caso de que el producto no se encuentre o este eliminado", async function(){
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.delete('/api/products/' + process.env.PRODUCT_ID_BAD_TEST)
//             .set("Cookie", [`token=${login._body.token}`]);

//         expect(statusCode).to.be.equals(404);
//         expect(_body).to.have.property("msg");
//     });

//     it("El endpoint DELETE /api/products/:pid debe eliminar el producto en la base de datos", async function(){
//         const login = await requester.post("/api/sessions/login").send(this.credentialsAdmin);

//         const { statusCode, _body } = await requester.delete('/api/products/' + process.env.PRODUCT_ID_TEST)
//             .set("Cookie", [`token=${login._body.token}`]);

//         expect(statusCode).to.be.equals(200);
//         expect(_body).to.have.property("msg");
//     });
// });