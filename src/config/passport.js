import passport from "passport";
import GitHubStrategy from "passport-github2";
import LocalStrategy from "passport-local";
import jwt from "passport-jwt";

import User from "../dao/db/models/user.js";
import bcryptjs from "bcryptjs";
import CartManager from "../dao/db/services/cartManager.js";

const service = new CartManager();

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { firstname, lastname, email, age, role = "ROLE_USER" } = req.body;

        try {
            const user = await User.findOne({ email: username });

            if(!user) {
                const cart = await service.addCart();
    
                const data = {
                    firstname,
                    lastname,
                    email,
                    role,
                    cart: cart._id,
                    password: bcryptjs.hashSync(password, bcryptjs.genSaltSync()),
                    age
                };

                const newUser = await User.create(data);
                return done(null, newUser);
            } else {
                return done(null, false);
            }            
        } catch(error) {
            return done(error);
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (username, password, done) => {

        try {
            const user = await User.findOne({ email: username });
            if(!user) {
                return done(null, false);
            }

            if(!bcryptjs.compareSync(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);

        } catch(error) {
            return done(error);
        }
    }));

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET_KEY,
    }, async (payload, done) => {
        try {
            return done(null, payload);
        } catch(err) {
            return done(err);
        }
    }));

    passport.use("github", new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET_KEY,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ email: profile._json.email });
            if(!user) {
                const cart = await service.addCart();

                const data = {
                    firstname: profile._json.name,
                    lastname: '',
                    email: profile._json.email,
                    age: 25,
                    password: 'nothing',
                    cart: cart._id,
                    github: true
                }

                const newUser = await User.create(data);
                done(null, newUser);
            } else {
                done(null, user);
            }
           
        } catch(error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
}

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies["token"];
    }

    return token;
}

export default initializePassport;