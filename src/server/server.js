import express from "express";
import cors from "cors";
import handlebars from "express-handlebars";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import passport from "passport";
import initializePassport from "../config/passport.js";

import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { socketController } from "../sockets/controller.js";

import { cartRouter, productRouter, authRouter, viewRouter } from "../routers/index.js";
import { connect } from "../config/database.js";
import { dirname } from "../path.js";

class Server {
    constructor() {
        this.app = express();
        this.port = 8080;
        this.server = createServer(this.app);
        this.io = new SocketServer(this.server);

        this.paths = {
            auth: "/api/sessions",
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
        this.app.use(this.paths.auth, authRouter);
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

        this.app.use(session({
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URL,
                mongoOptions: {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                ttl: 60 * 60
            }),
            secret: process.env.SESSION_SECRET_KEY,
            resave: false,
            saveUninitialized: false
        }));

        this.app.use(cookieParser());

        initializePassport();
        this.app.use(passport.initialize());
        this.app.use(passport.session());
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