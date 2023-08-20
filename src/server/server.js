import express from "express";
import cors from "cors";
import handlebars from "express-handlebars";

import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { socketController } from "../sockets/controller.js";

import { cartRouter, productRouter, viewRouter } from "../routers/index.js";
import { connect } from "../database/config.js";
import { dirname } from "../path.js";

class Server {
    constructor() {
        this.app = express();
        this.port = 8080;
        this.server = createServer(this.app);
        this.io = new SocketServer(this.server);

        this.paths = {
            carts: "/api/carts",
            products: "/api/products",
            views: "/"
        }

        this.database();
        this.middlewares();
        this.routes();
        this.sockets();
    }

    routes() {
        this.app.use(this.paths.carts, cartRouter);
        this.app.use(this.paths.products, productRouter);
        this.app.use(this.paths.views, viewRouter);
    }

    async database() {
        await connect();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static(`${dirname}/public`));

        this.app.engine("handlebars", handlebars.engine());

        this.app.set("views", `${dirname}/views`);
        this.app.set("view engine", "handlebars");
    }

    sockets() {
        this.io.on("connection", socket => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server running in port: ${this.port}`);
        });
    }
}

export default Server;