import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import dotenv from "dotenv"
dotenv.config()

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if(!token) return next(createError(401, "You are not authenticated"))

    // created token, secret key, (// what is returned can be err and user)
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if(err) return next(createError(403, "Not VALID Token"))
        req.user = user; // assign new property
        next();
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }else{
            if(err) return next(createError(403, "Not Autherized"))
        }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if(req.user.isAdmin) {
            next();
        }else{
            if(err) return next(createError(403, "Not Autherized"))
        }
    })
}