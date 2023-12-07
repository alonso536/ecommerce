// import chai from "chai";
// import supertest from "supertest";
// import "dotenv/config";

// const expect = chai.expect;
// const requester = supertest(process.env.ENDPOINT);

// describe("Test de sessions", () => {
//     before(function() {
//         this.newUser = {
//             firstname: "Jane",
//             lastname: "Doe",
//             email: "jane.doe@mail.com",
//             password: "1234",
//             age: 30,
//         };


//         this.invalidUser = {
//             firstname: "Mal nombre",
//             age: "40"
//         }

//         this.credentials = {
//             email: "jane.doe@mail.com",
//             password: "1234"
//         };
//     });

//     it("El endpoint POST /api/sessions/register debe devolver un error 400 en caso de que hayan errores en el request body", async function() {
//         const { statusCode, _body } = await requester.post('/api/sessions/' + 'register').send(this.invalidUser);
//         expect(statusCode).to.be.equals(400);
//         expect(_body).to.have.property("errors");
//     });

//     it("El endpoint POST /api/sessions/register debe registrar un usuario en la base de datos", async function() {
//         const { statusCode, _body } = await requester.post('/api/sessions/' + 'register').send(this.newUser);
//         expect(statusCode).to.be.equals(201);
//         expect(_body).is.ok.and.to.have.property("msg");
//     });

//     it("El enpoint POST /api/sessions/login debe devolver un error 400 en caso de que se ingresen credenciales inválidas", async function() {
//         const { statusCode, text } = await requester.post("/api/sessions/login").send(this.invalidCredentials);
//         console.log(text);
//         expect(statusCode).to.be.equals(400);
//     });

//     it("El enpoint POST /api/sessions/login debe devolver un token de autenticación en caso de un inicio de sesión exitoso", async function() {
//         const { statusCode, _body } = await requester.post("/api/sessions/login").send(this.credentials);
//         console.log({ token: _body.token });
//         expect(statusCode).to.be.equals(200);
//     });
// });